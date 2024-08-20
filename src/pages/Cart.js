import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);

      axios.get(`http://localhost:8090/popcon/cart/customer/${storedCustomerIdx}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
            ...item,
            cartIdx: cart.cartIdx,
            customerIdx: cart.customerIdx,
            isFromKeep: item.keepCost !== null && item.keepCost === 0.00 // keepCost가 0.00인 경우
          }))));
        })
        .catch(error => {
          console.error('카트에 제품데이터를 가져오는데 오류가 발생 했습니다', error);
        });
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 token을 찾을 수 없습니다.');
    }
  }, []);

  const removeFromCart = (cartItemIdx) => {
    axios.delete(`http://localhost:8090/popcon/cart/cartitem/${cartItemIdx}`, {
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
    axios.put(`http://localhost:8090/popcon/cart/cartitem/${cartItemIdx}/quantity`, { skuValue }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setCartItems(cartItems.map(item => item.cartItemIdx === cartItemIdx ? { ...item, skuValue } : item));
      })
      .catch(error => {
        console.error('수량 설정하는데 에러가 발생 했습니다.', error);
      });
  };

  const calculateItemCost = (item) => {
    return item.isFromKeep ? 0 : item.skuCost * item.skuValue;  // Keep에서 온 경우 0원 처리
  };

  const calculateTotal = () => {
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

  return (
      <div className="cart-container flex-sb flex-d-column">
          
          <div className="cart-list flex-c flex-d-column">
              <div className="cart-list-title flex-sa">
                  <div className="list-checkbox-box"></div>
                  <p className="list-title-img">상품</p>
                  <p className="list-title-box">상품명</p>
                  <p className="list-stack-box">수량</p>
                  <p className="list-cancel-box">취소</p>
                  <p className="list-cart-box">Cart</p>  {/* SKU에서 온 상품을 위한 칸 */}
                  <p className="list-keep-box">냉장고</p>  {/* Keep에서 온 상품을 위한 칸 */}
                  <p className="list-price-box">주문액</p>
              </div>

              {cartItems.map((item) => (
                <div className="cart-list-item flex-sa" key={`${item.cartItemIdx}-${item.isFromKeep ? 'KEEP' : 'SKU'}`}>
                    <div className="list-checkbox-box flex-c">
                        <input type="checkbox"/>
                    </div>
                    <div className="list-img-box flex-c">
                        <img src={item.skuBarcode} alt={item.skuName}/>
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
                    <div className="list-cart-box flex-c"> {/* SKU에서 온 상품 */}
                        <p>{!item.isFromKeep ? `${item.skuCost.toLocaleString()}원` : '-'}</p>
                    </div>
                    <div className="list-keep-box flex-c"> {/* Keep에서 온 상품 */}
                        <p>{item.isFromKeep ? '0원' : '-'}</p>
                    </div>
                    <div className="list-price-box flex-c">
                        <p>{calculateItemCost(item).toLocaleString()}원</p>
                    </div>
                </div>
              ))}
              
          </div>
          <div className="cart-price-top">
              <div className="cart-price-top-text flex-c">
                  <p>총 합계 :</p>
                  <p>{(calculateTotal()).toLocaleString()}원</p>
              </div>
          </div>
          <div className="cart-btn-box flex-sb">
              <button className="thema-btn-01" onClick={handleOrder}>주문하기</button>
              <button className="thema-btn-02">뒤로가기</button>
          </div>
          <div className="cart-price-bot">
              <p>총 합계 :</p>
              <p>{(calculateTotal()).toLocaleString()}원</p>
          </div>
      </div>
  );
};

export default Cart;
