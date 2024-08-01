import React from 'react';
import './OrderHistoryComponent.css';

const OrderHistoryComponent = ({ orders }) => {
  return (
    <div className="order-history">
      <div className="order-history-header">
        <h1>History</h1>
        <h2>/ 주문내역</h2>
      </div>
      <table className="order-history-table">
        <thead>
          <tr>
            <th>상품</th>
            <th>상품명</th>
            <th>수량</th>
            <th>주문일</th>
            <th>주문액</th>
            <th>반품</th>
            <th>리뷰</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td><img src={order.image} alt={order.name} /></td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.orderDate}</td>
              <td>{order.price.toLocaleString()}원</td>
              <td><button className="return-button">반품 신청</button></td>
              <td><button className="review-button">상품리뷰</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryComponent;
