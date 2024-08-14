import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import deleteIcon from '../image/Delete.png';
import { useNavigate } from 'react-router-dom'; // * 추가된 코드

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // * 추가된 코드

  const handleOrder = () => { // * 컴포넌트 내부로 이동
    navigate('/checkout'); // * 추가된 코드
  };

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);

      // 로그인한 사용자의 카트를 가져옴 (axios 사용)
      axios.get(`http://localhost:8090/popcon/customer/${storedCustomerIdx}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
            ...item,
            cartIdx: cart.cartIdx,
            customerIdx: cart.customerIdx
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
    axios.delete(`http://localhost:8090/popcon/cartitem/${cartItemIdx}`, {
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
    axios.put(`http://localhost:8090/popcon/cartitem/${cartItemIdx}/quantity`, { skuValue }, {
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.skuCost * item.skuValue, 0);
  };

  const handleQuantityChange = (cartItemIdx, event) => {
    const newQuantity = event.target.value;
    if (newQuantity >= 0) {
      updateQuantity(cartItemIdx, newQuantity);
    }
  };

  return (
    <div className="cart-container">
      <table className="cart-table">
        <thead>
          <tr>
            <th>상품</th>
            <th>상품명</th>
            <th>수량</th>
            <th>주문취소</th>
            <th>포인트</th>
            <th>주문액</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.cartItemIdx}>
              <td><img src={item.skuBarcode} alt={item.skuName} className="cart-item-image" /></td>
              <td>{item.skuName}</td>
              <td>
                <input
                  type="number"
                  value={item.skuValue}
                  onChange={(event) => handleQuantityChange(item.cartItemIdx, event)}
                />
              </td>
              <td>
                <button className="remove-button" onClick={() => removeFromCart(item.cartItemIdx)}>
                  <img src={deleteIcon} alt="삭제" className="delete-icon" />
                </button>
              </td>
              <td>{item.skuCost}</td>
              <td>{(item.skuCost * item.skuValue).toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="cart-total">총 합계: {(calculateTotal()).toLocaleString()}원</div>
        <div className="cart-actions">
        <button className="order-button" onClick={handleOrder}>주문하기</button>
          <button className="back-button">뒤로가기</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

