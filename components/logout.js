import { removeToken } from '../lib/authenticate';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    removeToken();
    router.push('/login');
  };

  return (
    <a className="nav-link" href="#" onClick={handleLogout}>
      Logout
    </a>
  );
};

export default Logout;
