//import Content from '../components/content'
//import Login from '../components/login'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Perform any prerequisite checks here, if necessary
    router.push('/login');
  }, [router]);

  return (
    <>
      {/* <div className="container mt-5">
        <h1>Welcome</h1>
      </div>
      <Login /> */}
      {/* <Content /> */}

  </>
  );
}