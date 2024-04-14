import { Card, Alert, Pagination } from "react-bootstrap";
import { getToken } from "@/lib/authenticate";
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Music() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/user/music`, fetcher, {
    revalidateOnMount: true,
    initialData: [],
  });
  const [currentPage, setCurrentPage] = useState(1);

  if (error) return <Alert variant="danger">Error fetching data</Alert>;
  if (!data) return <Alert variant="info">Loading...</Alert>;

  const albumsPerPage = 9;
  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = data.slice(indexOfFirstAlbum, indexOfLastAlbum);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <div className="row">
        {currentAlbums.map((track, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card className="card-color">
              <Card.Img variant="top" src={track.image.find(img => img.size === 'extralarge')['#text']} alt="Artist Image" />
              <Card.Body>
                <Card.Title><a>{track.name}</a></Card.Title>
                <Card.Text>{track.artist.name}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Pagination className="mt-4">
        {Array.from({ length: Math.ceil(data.length / albumsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} activeLabel = "" active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};
