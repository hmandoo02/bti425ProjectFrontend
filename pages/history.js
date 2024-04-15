import { useState, useEffect } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { getHistory, addHistory, deleteHistory, deleteAllHistory } from '@/lib/userData';
import { searchHistoryAtom } from '@/lib/store';
import { useRouter } from 'next/router';

export default function History() {
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const user = localStorage.getItem('userName');
        const userData = { userName: user };
        setSearchHistory(await getHistory(userData));
      } catch (error) {
        console.error('Error fetching history:', error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const user = localStorage.getItem('userName');
      const userData = { userName: user, historyId: id };
      await deleteHistory(userData);
      setSearchHistory(await getHistory(userData));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem('userName');
      const userData = { userName: user };
      await deleteAllHistory(userData); // Call deleteAllHistory function
      setSearchHistory([]); // Clear the search history
    } catch (error) {
      console.error('Error deleting all history:', error);
    }
    setLoading(false);
  };

  const handleAlbumClick = async (item) => {
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
      if (item.title == "?") {
        router.push(`/tentacion`);
      } else {
        router.push(`/album/${encodeURIComponent(item.artist)}/${encodeURIComponent(item.title)}`);
      }
    } catch (error) {
      console.error('Error adding album to history:', error);
    }
  };

  if (!searchHistory.length) {
    return (
        <div className="container mt-4">
            <Alert variant="info">No history added yet!</Alert>
        </div>
        );
  }
  
  return (
    <div className="container mt-4">
      <h2>Search History</h2>
      <Button variant="danger" onClick={handleDeleteAll} disabled={loading} className="mb-3">
        Delete All
      </Button>
      <div className="row">
        {searchHistory.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card className="card-color">
              <Card.Img variant="top" src={item.imagePath} alt="Album Image" />
              <Card.Body>
              <Card.Title onClick={() => handleAlbumClick(item)} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
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
