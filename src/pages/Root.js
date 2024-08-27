import { useLocation, Outlet } from "react-router-dom";
import './Root.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingMenu from "./FloatingMenu";

export default function RootLayout(){

  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isSkuPage = location.pathname === '/Sku';
  const isMap = location.pathname === '/maps';

  return (
    <div className="app">
      {isSkuPage && <FloatingMenu />}
      {!isIndexPage && <Header />}
      <Outlet />
      {!isIndexPage && !isSkuPage &&!isMap && <Footer />}
    </div>
    )
  }