import { useLocation, Outlet } from "react-router-dom";
import './Root.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingMenu from "./FloatingMenu";
import SideMenu from "./SideMenu";

export default function RootLayout(){

  const location = useLocation();
  const isIndexPage = location.pathname === '/';
  const isSkuPage = location.pathname === '/Sku';
  const isMyInfoPage = location.pathname === '/MyInfo';
  const isMyPage = location.pathname === '/MyPage';
  const isWishPage = location.pathname === '/Wish';
  const isMyDeliveryPage = location.pathname === '/MyDelivery';
  const isRefrigeratorPage = location.pathname === '/refrigerator';
  const isOrderhistoryPage = location.pathname === '/orderhistory';

  return (
    <div className="app">
      {isSkuPage && <FloatingMenu />}
      {!isIndexPage && <Header />}
      {/* {isMyInfoPage && <SideMenu />}
      {isMyPage && <SideMenu />}
      {isWishPage && <SideMenu />}
      {isMyDeliveryPage && <SideMenu />}
      {isRefrigeratorPage && <SideMenu />}
      {isOrderhistoryPage && <SideMenu />} */}
      <Outlet />
      {!isIndexPage && <Footer />}
    </div>
    )
  }