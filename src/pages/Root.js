import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Root.css';

export default function RootLayout(){

    return(
      <div className="app">
        <Header />
        <Outlet />
        <Footer/>
      </div>
    )
  }