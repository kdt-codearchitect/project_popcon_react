import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Root.css';

export default function RootLayout(){

    return(
      <div className="app">
      <body>
          
        <div className="container">
          <Header />
          <div className="app">
           <Outlet />
        </div>
        </div>
        </body>
          <Footer/>
      </div>
        
    )
  }