import React, { useState, useEffect } from 'react';
import './ProductComponent.css';
import axios from 'axios';

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    // 로그인된 경우에만 customerIdx와 token을 상태에 저장
    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);
    } else {
      console.log('로그인되지 않은 사용자');
    }

    // 제품 목록을 가져옴 (로그인 여부와 상관없이)
    axios.get('http://localhost:8090/popcon/Sku')
      .then(response => {
        setProducts(response.data); // 제품 목록을 상태에 저장
      })
      .catch(error => {
        console.error('제품을 가져오는 데 실패했습니다.', error);
      });
  }, []);

  const handleAddToCart = async (product) => {
    if (!customerIdx) {
      console.error('로그인이 필요합니다.');
      return;
    }

    console.log('Adding to cart with token:', token);

    const cartItem = {
      skuIdx: product.skuIdx,
      skuValue: 1,
      customerIdx: customerIdx,
      cartIdx: customerIdx // 이 예제에서는 customerIdx와 cartIdx가 동일하다고 가정
    };

    try {
      const response = await fetch('http://localhost:8090/popcon/sku/addToCart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItem)
      });

      if (response.ok) {
        console.log('상품이 장바구니에 성공적으로 담겼습니다');
      } else {
        console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!');
      }
    } catch (error) {
      console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!customerIdx) {
      console.error('로그인이 필요합니다.');
      return;
    }

    console.log('Adding to wishlist with token:', token);

    const wishItem = {
      customerIdx: customerIdx,
      skuIdx: product.skuIdx,
      wishIdx: customerIdx
    };

    try {
      const response = await fetch('http://localhost:8090/popcon/Wish/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wishItem)
      });

      if (response.ok) {
        console.log('상품이 찜목록에 성공적으로 담겼습니다.');
      } else {
        console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!');
      }
    } catch (error) {
      console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!', error);
    }
  };

  return (
    <div className="product-grid__wrapper">
      <div className="product-grid__wrap">
        <div className="product-grid__container">
          {products.map(product => (
            <article key={product.skuIdx} className="product-card">
              {product.promotion && <div className="product-badge">{product.promotion}</div>}
              <img src={product.imageUrl} alt={product.skuName} className="product-image" />
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
