import { useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Root.css';

export default function RootLayout(){

  const location = useLocation();
  const isIndexPage = location.pathname === '/';

  return (
    <div className="app">
      {!isIndexPage && <Header />}
      <Outlet />
      {!isIndexPage && <Footer />}
    </div>
    )
  }