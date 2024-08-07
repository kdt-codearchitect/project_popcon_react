import React, { useState, useEffect } from 'react';
import './ProductComponent.css';
import axios from 'axios';

function ProductComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8090/popcon/Sku', { withCredentials: true })
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  const handleAddToCart = (product) => {
    const cartItem = {
      skuIdx: product.skuIdx,
      skuValue: 1,
      customerIdx: 1
    };
    axios.post('http://localhost:8090/popcon/Sku/addToCart', cartItem, { withCredentials: true })
      .then(response => {
        console.log('상품이 장바구니에 담겼습니다', response.data);
      })
      .catch(error => {
        console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!', error);
      });
  };

  const handleAddToWishlist = (product) => {
    const wishItem = {
      customerIdx: 1, 
      skuIdx: product.skuIdx
    };
    axios.post('http://localhost:8090/popcon/Sku/addToWish', wishItem, { withCredentials: true })
      .then(response => {
        console.log('상품이 찜목록에 담겼습니다.', response.data);
      })
      .catch(error => {
        console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!', error);
      });
  };

  return (
    <div className="product-grid__wrapper">
      <div className="product-grid__wrap">
        <div className="product-grid__container">
          {products.map(product => (
            <article key={product.skuIdx} className="product-card">
              <div className="product-card-content">
                <h3 className="product-card-title">{product.skuName}</h3>
                <div className="product-price-wrapper">
                  <span className="product-price-current">
                    {product.skuCost.toLocaleString()}원
                  </span>
                </div>
              </div>
              <div className="product-buttons">
                <button className="product-button" onClick={() => handleAddToWishlist(product)}>찜하기</button>
                <button className="product-button" onClick={() => handleAddToCart(product)}>장바구니</button>
                <button className="product-button" onClick={() => handleAddToCart(product)}>구매하기</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
