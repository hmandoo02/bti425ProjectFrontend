import { useRouter } from 'next/router';
import Head from 'next/head';
import Logout from './logout';

const Layout = ({ children }) => {
  const router = useRouter();
  
  // Function to check if current route is '/register' or '/login'
  const isRegisterOrLogin = () => {
    return router.pathname === '/register' || router.pathname === '/login';
  }

  // Function to render menu items
  const renderMenuItems = () => {
    if (isRegisterOrLogin()) {
      return null; // Don't render any menu items if on register or login page
    }

    return (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <a className="nav-link" href="/music">Top 100 Rap Albums</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/favourites">Favorites</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/history">History</a>
        </li>
      </ul>
    );
  }

  return (
    <>
      <Head>
        <title>RapReel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://stackpath.bootstrapcdn.com/bootswatch/4.5.2/pulse/bootstrap.min.css" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #000000, #6c4dff); /* Example gradient */
          background-attachment: fixed; /* Ensure background extends through the entire document */
        }
        .navbar-brand {
          font-size: 2.5rem;
        }
        .navbar-dark .navbar-nav .nav-link {
          color: white;
        }
        .card {
          height: 100%;
        }
        .card-color {
          background-color: #212121;
        }
        .card-title {
          font-size: 1.5rem;
        }
        .card-text {
          font-size: 1rem;
          color: white;
        }
        .nav-link:hover {
          text-decoration: none;
        }
        .card-title {
          text-decoration: none;
          color: white;
        }
        .artist-image {
          max-width: 100%;
          height: auto;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand">RapReel ♪</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            {renderMenuItems()}
            {!isRegisterOrLogin() && (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Logout />
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className="container mt-4">{children}</div>
    </>
  );
};

export default Layout;
