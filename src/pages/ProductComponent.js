// src/pages/ProductComponent.js
import React, { useState } from 'react';
import './ProductComponent.css';

function ProductComponent({ addToCart, addToFavorites }) {
  const [products] = useState([
    {
      id: 1,
      name: "난 마카오",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtg5CsXcBWxl7aSa0sGZuDOwpSSFb4eKIPw&s.jpg"
    },
    {
      id: 2,
      name: "난 조마",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJ1I4Me580mSBEctbU7oIbSGOz9Q27lE5Ig&s.jpg"
    },
    {
      id: 3,
      name: "우리 사이 좋게 지내요",
      price: 117000,
      image: "https://i.namu.wiki/i/phJJ4yav60AY8ao5brb4JDnoqP0ZFJk3zaqLnE9l760V5ubk2b67VUnQzz73oeVaJRm49I_Fr32QqU36RyddNw.webp"
    },
    {
      id: 4,
      name: "난 마카오",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtg5CsXcBWxl7aSa0sGZuDOwpSSFb4eKIPw&s.jpg"
    },
    {
      id: 5,
      name: "난 조마",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJ1I4Me580mSBEctbU7oIbSGOz9Q27lE5Ig&s.jpg"
    },
    {
      id: 6,
      name: "우리 사이 좋게 지내요",
      price: 117000,
      image: "https://i.namu.wiki/i/phJJ4yav60AY8ao5brb4JDnoqP0ZFJk3zaqLnE9l760V5ubk2b67VUnQzz73oeVaJRm49I_Fr32QqU36RyddNw.webp"
    },
    {
      id: 7,
      name: "난 마카오",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtg5CsXcBWxl7aSa0sGZuDOwpSSFb4eKIPw&s.jpg"
    },
    {
      id: 8,
      name: "난 조마",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJ1I4Me580mSBEctbU7oIbSGOz9Q27lE5Ig&s.jpg"
    },
    {
      id: 9,
      name: "우리 사이 좋게 지내요",
      price: 117000,
      image: "https://i.namu.wiki/i/phJJ4yav60AY8ao5brb4JDnoqP0ZFJk3zaqLnE9l760V5ubk2b67VUnQzz73oeVaJRm49I_Fr32QqU36RyddNw.webp"
    },
    {
      id: 10,
      name: "난 마카오",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtg5CsXcBWxl7aSa0sGZuDOwpSSFb4eKIPw&s.jpg"
    },
    {
      id: 11,
      name: "난 조마",
      price: 117000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJ1I4Me580mSBEctbU7oIbSGOz9Q27lE5Ig&s.jpg"
    },
    {
      id: 12,
      name: "우리 사이 좋게 지내요",
      price: 117000,
      image: "https://i.namu.wiki/i/phJJ4yav60AY8ao5brb4JDnoqP0ZFJk3zaqLnE9l760V5ubk2b67VUnQzz73oeVaJRm49I_Fr32QqU36RyddNw.webp"
    },
    // 다른 제품 정보들 추가
  ]);

   return (
    <div className="product-grid__wrapper">
      <div className="product-grid__wrap">
        <div className="product-grid__container">
          {products.map(product => (
            <article key={product.id} className="card">
              <div className="product-card-image">
                <img src={product.image} alt="Product" />
                <div className="product-card-content">
                  <h3 className="product-card-title">
                    <div className='product-buttons'>
                <button className="product-button" onClick={() => addToFavorites(product)}>★</button>
                      <button className="product-button" onClick={() => addToCart(product)}>구매하기</button>
                      <button className="product-button" onClick={() => addToCart(product)}>장바구니</button>
                    </div>
                    <span className="product-name">{product.name}</span>
                    <span className="product-price-wrapper">
                      <span className="product-price-current">
                        {product.price.toLocaleString()}원
                      </span>
                    </span>
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;