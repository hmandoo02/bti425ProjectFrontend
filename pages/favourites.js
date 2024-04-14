import { useState, useEffect } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { addHistory, getFavourites, deleteFavourites, deleteAllFavourites } from '@/lib/userData';
import { searchHistoryAtom, favouritesAtom } from "@/lib/store";
import { useRouter } from 'next/router';

export default function Favourites() {
  const router = useRouter();

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => { 
      setLoading(true);
      try {
        const user = localStorage.getItem('userName');
        const userData = { userName: user };
        setFavouritesList(await getFavourites(userData));
      } catch (error) {
        console.error('Error fetching favourites:', error);
      }
      setLoading(false);
    };

    fetchFavourites();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const user = localStorage.getItem('userName');
      const userData = { userName: user, favouriteId: id };
      await deleteFavourites(userData);
      setFavouritesList(await getFavourites(userData));
    } catch (error) {
      console.error('Error deleting favourite item:', error);
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem('userName');
      const userData = { userName: user };
      await deleteAllFavourites(userData);
      setFavouritesList([]);
    } catch (error) {
      console.error('Error deleting all favourites:', error);
    }
    setLoading(false);
  };

  const addHist = async (item) => {
    try {
      const user = localStorage.getItem('userName');
      const userData = {
        userName: user,
        history: {
          title: item.title,
          artist: item.artist,
          imagePath: item.imagePath
        }
      };
      setSearchHistory(await addHistory(userData));
      router.push(`/album/${encodeURIComponent(item.artist)}/${encodeURIComponent(item.title)}`);
    } catch (error) {
      console.error('Error adding album to history:', error);
    }
  };

  if (!favouritesList.length) {
    return (
        <div className="container mt-4">
            <Alert variant="info">No favourite music added yet!</Alert>
        </div>
        );
  }

  return (
    <div className="container mt-4">
      <h2>Favourites</h2>
      <Button variant="danger" onClick={handleDeleteAll} disabled={loading} className="mb-3">
        Delete All
      </Button>
      <div className="row">
        {favouritesList.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card className="card-color">
              <Card.Img variant="top" src={item.imagePath} alt="Album Image" />
              <Card.Body>
                <Card.Title onClick={() => addHist(item)} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
                <Card.Text>{item.artist}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(item._id)} disabled={loading}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
