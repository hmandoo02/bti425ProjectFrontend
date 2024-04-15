import { Card, Alert, Pagination, Button, Form } from "react-bootstrap";
import { getToken } from "@/lib/authenticate";
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { getFavourites, addHistory, addFavourites } from '@/lib/userData';
import { favouritesAtom, searchHistoryAtom } from "@/lib/store";
import { useRouter } from 'next/router';

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Music() {
  const router = useRouter();

  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/user/music`, fetcher, {
    revalidateOnMount: true,
    initialData: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const user = localStorage.getItem('userName');

  useEffect(() => {
    if (errorMsg) {
      const timeout = setTimeout(() => {
        setErrorMsg(null);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (data && searchTerm) {
      const filtered = data.filter(album => {
        return album.name.toLowerCase().includes(searchTerm.toLowerCase()) || album.artist.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData([]);
    }
  }, [data, searchTerm]);

  if (error) return <Alert variant="danger">Error fetching data</Alert>;
  if (!data) return <Alert variant="info">Loading...</Alert>;

  const albumsPerPage = 9;
  const albumsToPaginate = searchTerm ? filteredData : data;
  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = albumsToPaginate.slice(indexOfFirstAlbum, indexOfLastAlbum);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addHist = async (album) => {
    try {
      const userData = {
        userName: user,
        history: {
          title: album.name,
          artist: album.artist.name,
          imagePath: album.image.find(img => img.size === 'extralarge')['#text']
        }
      };
      setSearchHistory(await addHistory(userData));
      router.push(`/album/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`);
    } catch (error) {
      console.error('Error adding album to history:', error);
    }
  };

  const addFav = async (album) => {
    try {
      const userData = {
        userName: user,
        favourites: {
          title: album.name,
          artist: album.artist.name,
          imagePath: album.image.find(img => img.size === 'extralarge')['#text']
        }
      };

      const existingFavourites = await getFavourites({ userName: user });
      const isDuplicate = existingFavourites.some(favourite => (
        favourite.title === userData.favourites.title &&
        favourite.artist === userData.favourites.artist
      ));

      if (isDuplicate) {
        throw new Error('Album already exists in favourites.');
      }

      setFavouritesList(await addFavourites(userData));
    } catch (error) {
      console.error('Error adding album to favourites:', error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="container mt-4">
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Form.Group className="py-3" controlId="formSearch">
        <Form.Control type="text" placeholder="Search albums..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </Form.Group>
      <div className="row">
        {currentAlbums.map((album, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card className="card-color">
              <Card.Img variant="top" src={album.image.find(img => img.size === 'extralarge')['#text']} alt="Artist Image" />
              <Card.Body>
                <Card.Title onClick={() => addHist(album)} style={{ cursor: 'pointer' }}>{album.name}</Card.Title>
                <Card.Text>{album.artist.name}</Card.Text>
                <Button variant="secondary" className="btn-sm" onClick={() => addFav(album)} style={{ position: 'absolute', bottom: '20px', right: '15px' }}>Add to Favorites</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Pagination className="mt-4">
        {Array.from({ length: Math.ceil(albumsToPaginate.length / albumsPerPage) }, (_, i) => (
          <Pagination.Item key={i + 1} activeLabel="" active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};
