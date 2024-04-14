import { Card, Alert, Form, Button } from "react-bootstrap";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { registerUser } from "@/lib/authenticate";

export default function Register(props) {
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (password !== password2) {
        setWarning("Passwords do not match");
        return;
      }
      await registerUser(user, password, password2);
      router.push("/login");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "650px" }}>
        <Card style={{ backgroundColor: '#17141f', color: 'white', width: '60%', padding: '30px', margin: 'auto' }}>
          <Card.Header>
            <Card.Title className="text-center">Create an Account</Card.Title>
          </Card.Header>
          <Card.Body className="row justify-content-center">
            <Form onSubmit={handleSubmit} style={{ width: '60%', margin: 'auto' }}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text" value={user} id="userName" name="userName" placeholder="Enter email" onChange={e => setUser(e.target.value)} />
                <Form.Text className="text-muted">
                  We'll never share your userName with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} id="password" name="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={password2} id="password2" name="password2" placeholder="Confirm Password" onChange={e => setPassword2(e.target.value)} />
              </Form.Group>
              {warning && <>
                <br />
                <Alert variant='danger'>
                  {warning}
                </Alert>
              </>}
              <br />
              <Button variant="primary" type="submit">
                Sign Up
              </Button>{' '}
              <Button onClick={handleLoginClick} variant="primary" >
                Back to Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
