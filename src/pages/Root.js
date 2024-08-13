import { useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Root.css';
import FloatingMenu from "./FloatingMenu";

export default function RootLayout(){

  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isSkuPage = location.pathname === '/Sku';

  return (
    <div className="app">
      {isSkuPage && <FloatingMenu />}
      {!isIndexPage && <Header />}
      <Outlet />
      {!isIndexPage && <Footer />}
    </div>
    )
  }