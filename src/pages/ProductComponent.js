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

    // customerIdx와 token을 상태에 저장
    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);
    }

    // 로그인 여부와 상관없이 제품 목록을 가져옴 (axios 사용)
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
      console.log('로그인이 필요합니다.');
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
      console.log('로그인이 필요합니다.');
      return;
    }

    console.log('Adding to wishlist with token:', token);

    const wishItem = {
      skuIdx: product.skuIdx,
      customerIdx: customerIdx,

      wishIdx: customerIdx,
      skuIdx: product.skuIdx

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
    <div className="productList-container">
      <div className="productList-contents flex-c flex-d-column">
        <nav>
          <ul className="flex-sb">
            <li className="product-nav-uderbar thema-font-01">전체목록</li>
            <li>즉석요리</li>
            <li>과자류</li>
            <li>아이스크림</li>
            <li>식품</li>
            <li>음료</li>
            <li>생활용품</li>
          </ul>
        </nav>
        <div className="productList-box">
          {products.map(product => (
            <div key={product.skuIdx} className="product-card flex-sb flex-d-column">
              <div className="product-img-box flex-c">
                <label className="opo flex-c">1+1</label>
                {/* <label className="tpo flex-c">2+1</label> */}
                <img src={product.imageUrl} alt={product.skuName} />
              </div>
              <div className='product-title-box'>
                <p>{product.skuName}</p>
              </div>
              <div className="product-price-box flex-sb">
                <p className="product-original-price">{product.skuCost.toLocaleString()}<span>원</span></p>
                <p className="product-event-price">{product.skuCost.toLocaleString()}<span>원</span></p>
              </div>
              <div className="product-button-box flex-sb">
                {/* <button className="product-button" onClick={() => handleAddToWishlist(product)}>찜하기</button> */}
                <button className="thema-btn-01" onClick={() => handleAddToCart(product)}>장바구니</button>
                <button className="thema-btn-02" onClick={() => handleAddToCart(product)}>바로구매</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
