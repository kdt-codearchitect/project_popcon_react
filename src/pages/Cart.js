import React from 'react';
import './Cart.css';
import deleteIcon from '../image/Delete.png'; // Delete.png 파일 경로


const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (productId, event) => {
    const newQuantity = event.target.value;
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
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
            <tr key={item.id}>
              <td><img src={item.image} alt={item.name} className="cart-item-image" /></td>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(event) => handleQuantityChange(item.id, event)}
                />
              </td>
              <td>
              <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                    <img src={deleteIcon} alt="삭제" className="delete-icon" />
                  </button>
              </td>
              <td>{item.price}</td>
              <td>{(item.price * item.quantity).toLocaleString()}원</td>
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
