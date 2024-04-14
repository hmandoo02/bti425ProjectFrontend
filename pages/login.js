import { Card, Alert, Form, Button } from "react-bootstrap";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { authenticateUser } from "@/lib/authenticate";
import { useAtom } from 'jotai';
import { getFavourites, getHistory } from "@/lib/userData";
import { favouritesAtom, searchHistoryAtom } from "@/lib/store";

export default function Login(props){

  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/register'); // Navigate to register.js page
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try{
      await authenticateUser(user, password);
      await updateAtoms();
      router.push("/favourites");
    }catch(err){
     setWarning(err.message);
    }

  }

  async function updateAtoms(){
    setFavouritesList(await getFavourites({ userName: user }));
    setSearchHistory(await getHistory({ userName: user }));
    localStorage.setItem('userName', user);
  }

  return (
    <>
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "650px"}}>
      <Card style={{ backgroundColor: '#17141f', color: 'white', width: '60%', padding: '30px', margin: 'auto' }}>
        <Card.Header>
          <Card.Title className="text-center">Account</Card.Title>
        </Card.Header>
        <Card.Body className="row justify-content-center">
          <Form onSubmit={handleSubmit} style={{width:'60%', margin:'auto'}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="text" value={user} name="userName" placeholder="Enter email" onChange={e => setUser(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your information with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            {warning && <>
              <br />
              <Alert variant='danger'>
                {warning}
              </Alert>
            </>}
            <br/>
            <Button variant="primary" type="submit">
              Login
            </Button>{' '}
            <Button onClick={handleSignUpClick} variant="primary" >
              Register
            </Button>
          </Form>        
        </Card.Body>

      </Card>
    </div>
 </>   
  );
}
