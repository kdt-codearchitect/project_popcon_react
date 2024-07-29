// src/pages/ProductComponent.js
import React, { useState, useEffect } from 'react';
import './ProductComponent.css';
import axios from 'axios';

function ProductComponent({ addToCart, addToFavorites }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Spring Boot 백엔드의 API 엔드포인트를 호출하여 데이터를 가져옴
    axios.get('http://localhost:8090/app/Sku')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  return (
    <div className="product-grid__wrapper">
      <div className="product-grid__wrap">
        <div className="product-grid__container">
          {products.map(product => (
            <article key={product.skuIdx} className="card">
              <div className="product-card-image">
                <img src={product.skuBarcode} alt="Product" />
                <div className="product-card-content">
                  <h3 className="product-card-title">
                    <div className='product-buttons'>
                      <button className="product-button" onClick={() => addToFavorites(product)}>★</button>
                      <button className="product-button" onClick={() => addToCart(product)}>구매하기</button>
                      <button className="product-button" onClick={() => addToCart(product)}>장바구니</button>
                    </div>
                    <span className="product-name">{product.skuName}</span>
                    <span className="product-price-wrapper">
                      <span className="product-price-current">
                        {product.skuCost.toLocaleString()}원
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
