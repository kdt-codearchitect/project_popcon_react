import React, { useState, useEffect } from 'react';
import './ProductComponent.css';
import axios from 'axios';

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [cartIdx, setCartIdx] = useState(null);

  useEffect(() => {
    // 로그인된 사용자 정보를 가져와서 customerIdx와 cartIdx를 설정, 10 나중에 로그인된 고객 idx로 바뀌겠금 수정
    axios.get('http://localhost:8090/popcon/getCustomerIdx/10', { withCredentials: true }) // customerIdx는 로그인된 사용자의 값을 사용해야 함
      .then(response => {
        console.log('받아온 데이터:', response.data); // 받아온 데이터 로그 출력
        setCustomerIdx(response.data.customerIdx);
        setCartIdx(response.data.cartIdx); // API가 cartIdx를 반환한다고 가정
        console.log('cartIdx 설정됨:', response.data.cartIdx);
      })
      .catch(error => {
        console.error('사용자 정보를 가져오는데 오류가 발생했습니다!', error);
      });

    // 상품 정보를 가져오기
    axios.get('http://localhost:8090/popcon/Sku', { withCredentials: true })
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('상품을 가져오는데 오류가 발생했습니다!', error);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (!cartIdx) {
      console.error('장바구니 정보가 없습니다!');
      return;
    }
  
    const cartItem = {

      cartIdx: cartIdx, // 장바구니 식별자
      skuIdx: product.skuIdx, // 상품 식별자
      skuValue: 1  // 기본 수량을 1로 설정

    };
  
    console.log('장바구니에 추가할 데이터:', cartItem); // 디버깅용 로그
  
    axios.post('http://localhost:8090/popcon/sku/addToCart', cartItem, { withCredentials: true })
      .then(response => {
        console.log('상품이 장바구니에 담겼습니다', response.data);
        alert('상품이 장바구니에 담겼습니다.');
      })
      .catch(error => {
        console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!', error.response ? error.response.data : error.message);
        alert('상품을 장바구니에 담는 도중 문제가 발생했습니다.');
      });
  };

  const handleAddToWishlist = (product) => {
    const wishItem = {

      skuIdx: product.skuIdx,
      customerIdx: customerIdx  // 찜하기를 할 때도 customerIdx 사용

    };

    axios.post('http://localhost:8090/popcon/addToWish', wishItem, { withCredentials: true })
      .then(response => {
        console.log('상품이 찜목록에 담겼습니다.', response.data);
        alert('상품이 찜목록에 담겼습니다.');
      })
      .catch(error => {
        console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!', error);
        alert('찜목록에 상품을 담는 도중 문제가 발생했습니다.');
      });
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
    </div>
  );
}

export default ProductComponent;
