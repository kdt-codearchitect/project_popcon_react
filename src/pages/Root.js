import { useLocation, Outlet } from "react-router-dom";
import './Root.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingMenu from "./FloatingMenu";

export default function RootLayout(){

  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isSkuPage = location.pathname === '/Sku';
  const isSkuPage1 = location.pathname === '/sku1';
  const isSkuPage2 = location.pathname === '/sku2';

  return (
    <div className="app">
      {isSkuPage && <FloatingMenu />}
      {isSkuPage1 && <FloatingMenu />}
      {isSkuPage2 && <FloatingMenu />}
      {!isIndexPage && <Header />}
      <Outlet />
      {!isIndexPage && !isSkuPage && <Footer />}
    </div>
  );
  }