import "@/styles/globals.css";
import Layout from '../components/layout';
import  RouteGuard  from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  return <RouteGuard><Layout><Component {...pageProps} /></Layout></RouteGuard>;
}
