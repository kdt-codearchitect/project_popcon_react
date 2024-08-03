import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OrderHistoryComponent.css';

const OrderHistoryComponent = () => {
  const navigate = useNavigate();
  // 더미 데이터
  const orders = [
    {
      image: 'https://via.placeholder.com/50',
      name: '상품명 1',
      quantity: 2,
      orderDate: '2024-07-29',
      price: 50000,
    },
    {
      image: 'https://via.placeholder.com/50',
      name: '상품명 2',
      quantity: 1,
      orderDate: '2024-07-28',
      price: 30000,
    },
    {
      image: 'https://via.placeholder.com/50',
      name: '상품명 3',
      quantity: 3,
      orderDate: '2024-07-27',
      price: 45000,
    },
  ];

  return (
    <div className="page-container">
      <div className="mypage-container">
        <div className="mypage-content">
          <h2 className="mypage-title" onClick={() => navigate('/MyPage')}>마이페이지</h2>
          <ul className="nav-links-side">
            <li><Link to="/MyInfo">MyInfo / 개인정보수정</Link></li>
            <li><Link to="/Wish">Favorites / 나의 찜 목록</Link></li>
            <li><Link to="/MyDelivery">Delivery / 배송 상황</Link></li>
            <li><Link to="/refrigerator">Fridge / 나의 냉장고</Link></li>
            <li><Link to="/Payment">Payment / 결제수단</Link></li>
            <li><Link to="/orderhistory">History / 주문 내역</Link></li>
          </ul>
        </div>
      </div>
      
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
    </div>
  );
};

export default OrderHistoryComponent;
