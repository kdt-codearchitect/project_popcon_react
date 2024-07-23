import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from "../pages/LoginComponent";
import HomeComponent from "../pages/HomeComponent";
import ProductComponent from "../pages/ProductComponent";
import ProductComponent2 from "../pages/ProductComponent2";
import ProductComponent3 from "../pages/ProductComponent3";
import Cart from '../pages/Cart';
import Error from "../pages/Error" ;
import './Main.css';
import { Link } from 'react-router-dom';

const Main = () => {
    document.addEventListener('DOMContentLoaded', function(){
        function loadContent(url){
    fetch(LoginComponent)
    .then(response => Error.text())
    .then(data => {
        document.getElementById('content').innerHTML = data;
        })
        .catch(error => console.error('Error loading content: ', error));
        }
        loadContent('main-content.html');
    })
    return (
        <main>
            {/* <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/product1" element={<ProductComponent />} />
                <Route path="/product2" element={<ProductComponent2 />} />
                <Route path="/productonsale" element={<ProductComponent3 />} />
                <Route path="/cart" element={<Cart />} />
            
            </Routes> */}
        </main>
    );
};

export default Main;