import { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, Card, Pagination } from 'react-bootstrap';
import useSWR from 'swr';
import { getToken } from '@/lib/authenticate';

const fetcher = (url) =>
  fetch(url, { headers: { Authorization: `JWT ${getToken()}` } }).then((res) => res.json());

const tracksPerPage = 4;

export default function Album() {
  const router = useRouter();
  const { artist, album } = router.query;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/user/music/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`,
    fetcher,
    {
      revalidateOnMount: true,
      initialData: { image: [], name: '', artist: '', playcount: '', url: '', tracks: { track: [] } },
    }
  );

  console.log(data);

  if (error) return <Alert variant="danger">Error fetching album details</Alert>;
  if (!data) return <Alert variant="info">Loading...</Alert>;

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = (data.tracks && Array.isArray(data.tracks.track)) ? data.tracks.track.slice(indexOfFirstTrack, indexOfLastTrack) : [];

  const totalPages = Math.ceil((data.tracks && Array.isArray(data.tracks.track)) ? data.tracks.track.length / tracksPerPage : 0);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatPlaycount = (playcount) => {
    return playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mt-4 card-color">
      <div className="row p-3">
        <div className="col-md-3">
          {data.image.length > 0 && (
            <img src={data.image[3]['#text']} alt="Album Cover" className="img-fluid" style={{ marginLeft: "-15px" }} />
          )}
        </div>
        <div className="col-md-9">
          <h1>{data.name}</h1>
          <p>{data.artist}</p>
          <p>Playcount: {formatPlaycount(data.playcount)}</p>
          {data.url && <p><a href={data.url} target="_blank" rel="noopener noreferrer" >View the entire album on last.fm</a></p>}
        </div>
      </div>
      {currentTracks.length > 0 && <h2>Tracklist:</h2>}
      <div className="row">
        {currentTracks.map((track, index) => (
          <div key={index} className="col-md-6 px-0">
            <Card className="card-color">
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>Duration: {formatDuration(track.duration)}</Card.Text>
                <Card.Text>
                  <a href={track.url} target="_blank" rel="noopener noreferrer">
                    Listen on Last.fm
                  </a>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4 py-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              activeLabel=""
              active={i + 1 === currentPage}
              onClick={() => handlePagination(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
