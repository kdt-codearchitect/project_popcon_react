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

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);

      // 제품 목록을 가져옴 (axios 사용)
      axios.get('http://localhost:8090/popcon/Sku')
        .then(response => {
          setProducts(response.data); // 제품 목록을 상태에 저장
        })
        .catch(error => {
          console.error('제품을 가져오는 데 실패했습니다.', error);
        });
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 token을 찾을 수 없습니다.');
    }
  }, []);

  const handleAddToCart = async (product) => {
    if (!customerIdx) return;

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
    if (!customerIdx) return;

    console.log('Adding to wishlist with token:', token);

    const wishItem = {
      skuIdx: product.skuIdx,
      customerIdx: customerIdx,
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
              {/* 이미지 추가 부분 */}
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
      <div class="floating-menu flex-sa flex-d-column">
          <div class="floating-menu-top flex-c flex-d-column">
              <i class="fas fa-caret-up"></i>
              <a href="#" class="font-w-b">TOP</a>
          </div>
          <a href="#">매장찾기</a>
          <a href="#">장바구니</a>
          <a href="#">마이페이지</a>
          <a href="#">문의하기</a>
      </div>
    </div>
  );
}

export default ProductComponent;