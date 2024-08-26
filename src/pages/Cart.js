import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import EmptyCart from './EmptyCart';
import Loading from './Loading'; // 로딩 컴포넌트 import
import { getAuthToken } from '../util/auth'; // 이 줄을 파일 상단에 추가하세요

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const imgSrc = '../image/item_image/'

  const handleOrder = () => {
    const itemsToOrder = cartItems.filter(item => selectedItems.includes(item.cartItemIdx));
    if (itemsToOrder.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    const selectedSkuIds = itemsToOrder.map(item => item.skuIdx);
    
    // 선택된 skuIdx 값들을 콘솔에 출력
    console.log('선택된 상품의 skuIdx:', selectedSkuIds);

    navigate('/checkout', { state: { orderItems: itemsToOrder, selectedSkuIds: selectedSkuIds } });
  };

  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const token = getAuthToken(); // getAuthToken 함수를 사용하여 토큰 가져오기

    if (storedCustomerIdx && token) {
      setCustomerIdx(storedCustomerIdx);
      console.log('저장된 customerIdx:', storedCustomerIdx);
      console.log('저장된 토큰:', token);

      const startTime = Date.now();

      axios.get(url + `/cart/customer/${storedCustomerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
            ...item,
            cartIdx: cart.cartIdx,
            customerIdx: cart.customerIdx,
            isFromKeep: item.keepCost !== null && item.keepCost === 0.00
          }))));

          console.log("cartItems : ", cartItems); // cartItems 출력

          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime);
          
          setTimeout(() => {
            setIsLoading(false);
          }, remainingTime);
        })
        .catch(error => {
          console.error('카트에 제품 데이터를 가져오는데 오류가 발생했습니다', error);
          
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime);
          
          setTimeout(() => {
            setIsLoading(false);
          }, remainingTime);
        });
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 토큰을 찾을 수 없습니다.');
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  const removeFromCart = (cartItemIdx) => {
    axios.delete(url+ `/cart/cartitem/${cartItemIdx}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setCartItems(cartItems.filter(item => item.cartItemIdx !== cartItemIdx));
      })
      .catch(error => {
        console.error('제품 데이터를 삭제하는 데 오류가 발생했습니다.', error);
      });
  };

  const updateQuantity = (cartItemIdx, skuValue) => {
    const token = getAuthToken(); // 토큰을 새로 가져옵니다
    if (!token) {
      console.error('인증 토큰이 없습니다.');
      // 로그인 페이지로 리다이렉트하거나 사용자에게 알림을 표시할 수 있습니다
      return;
    }

    axios.put(url+`/cart/cartitem/${cartItemIdx}/quantity`, { skuValue }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setCartItems(cartItems.map(item => item.cartItemIdx === cartItemIdx ? { ...item, skuValue } : item));
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.error('인증 오류가 발생했습니다. 다시 로그인해주세요.');
          // 로그인 페이지로 리다이렉트하거나 사용자에게 알림을 표시할 수 있습니다
        } else {
          console.error('수량 설정하는데 에러가 발생했습니다.', error);
        }
      });
  };

  const calculateItemCost = (item) => {
    return item.isFromKeep ? 0 : item.skuCost * item.skuValue;  // Keep에서 온 경우 0원 처리
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.cartItemIdx))
      .reduce((total, item) => total + calculateItemCost(item), 0);
  };

  const calculateTotalAll = () => {
    return cartItems.reduce((total, item) => total + calculateItemCost(item), 0);
  };

  const handleQuantityChange = (cartItemIdx, event) => {
    const newQuantity = event.target.value;
    if (newQuantity >= 0) {
      updateQuantity(cartItemIdx, newQuantity);
    }
  };

  const handleIncrement = (cartItemIdx) => {
    const item = cartItems.find(item => item.cartItemIdx === cartItemIdx);
    const newQuantity = item.skuValue + 1;
    updateQuantity(cartItemIdx, newQuantity);
  };
  
  const handleDecrement = (cartItemIdx) => {
    const item = cartItems.find(item => item.cartItemIdx === cartItemIdx);
    const newQuantity = item.skuValue > 1 ? item.skuValue - 1 : 1;
    updateQuantity(cartItemIdx, newQuantity);
  };

  const handleCheckboxChange = (cartItemIdx) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(cartItemIdx)) {
        return prevSelected.filter(id => id !== cartItemIdx);
      } else {
        return [...prevSelected, cartItemIdx];
      }
    });
  };

  return (
    <div className="cart-container flex-sb flex-d-column">
      {isLoading ? (
        <Loading /> // 로딩 컴포넌트로 대체
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="cart-list flex-c flex-d-column">
            <div className="cart-list-title flex-sa">
              <div className="list-checkbox-box"></div>
              <p className="list-title-img">상품</p>
              <p className="list-title-box">상품명</p>
              <p className="list-stack-box">수량</p>
              <p className="list-cancel-box">취소</p>
              <p className="list-price-box">주문액</p>
            </div>

            {cartItems.map((item) => (
              <div className="cart-list-item flex-sa" key={`${item.cartItemIdx}-${item.isFromKeep ? 'KEEP' : 'SKU'}`}>
                <div className="list-checkbox-box flex-c">
                  <input 
                    type="checkbox"
                    checked={selectedItems.includes(item.cartItemIdx)}
                    onChange={() => handleCheckboxChange(item.cartItemIdx)}
                  />
                </div>
                <div className="list-img-box flex-c">
                  <img src={imgSrc+item.skuName+'.jpg'} alt={item.skuName} />
                </div>
                <div className="list-title-box">
                  <p>{item.skuName}</p>
                </div>
                <div className="list-stack-box flex-c"> 
                  <input type="text" value={item.skuValue} onChange={(event) => handleQuantityChange(item.cartItemIdx, event)}/>
                  <div className="list-stack-btn flex-sb flex-d-culumn">
                    <button onClick={() => handleIncrement(item.cartItemIdx)}><FontAwesomeIcon icon={faCaretUp}/></button>
                    <button onClick={() => handleDecrement(item.cartItemIdx)}><FontAwesomeIcon icon={faCaretDown}/></button>
                  </div>
                </div>
                <div className="list-cancel-box flex-c">
                  <button onClick={() => removeFromCart(item.cartItemIdx)}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
                <div className="list-price-box flex-c">
                  <p>{calculateItemCost(item).toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-price-top">
            <div className="cart-price-top-text flex-c">
              <p>선택한 상품 총 합계 :</p>
              <p>{calculateTotal().toLocaleString()}원</p>
            </div>
          </div>
          <div className="cart-btn-box flex-sb">
            <button className="thema-btn-01" onClick={handleOrder}>주문하기</button>
            <button className="thema-btn-02">뒤로가기</button>
          </div>
          <div className="cart-price-bot">
            <p>총 합계 :</p>
            <p>{calculateTotalAll().toLocaleString()}원</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;