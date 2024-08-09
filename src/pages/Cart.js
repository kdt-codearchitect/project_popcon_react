import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import deleteIcon from '../image/Delete.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const customerIdx = 1; // customerIdx를 1로 설정
    axios.get(`http://localhost:8090/popcon/customer/${customerIdx}`)
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
  }, []);

  const Keep = (fridgeIdx) => {
    axios.get('http://localhost:8090/popcon/Keep')
    .then(response => {
      setCartItems(response.data);
    })
    .catch(error =>{
      console.error('냉장고에서 제품 가져오는데 오류가 발생 했습니다')
    })
  };
  
  const removeFromCart = (cartItemIdx) => {
    axios.delete(`http://localhost:8090/popcon/cartitem/${cartItemIdx}`)
      .then(response => {
        setCartItems(cartItems.filter(item => item.cartItemIdx !== cartItemIdx));
      })
      .catch(error => {
        console.error('제품 데이터를 삭제하는 데 오류가 발생했습니다.', error);
      });
  };

  const updateQuantity = (cartItemIdx, skuValue) => {
    axios.put(`http://localhost:8090/popcon/Cart/${cartItemIdx}`, { skuValue })
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
          <button className="order-button">주문하기</button>
          <button className="back-button">뒤로가기</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
