import React, { useState, useEffect } from 'react';
import './RefrigeratorComponent.css';
import { Link, useLocation } from "react-router-dom";
import KeepModal from './KeepModal';

const RefrigeratorComponent = ({ products }) => {
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.openModal) {
      setModalOpen(true);
    }
  }, [location.state]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="mypage-container">
        <div className="mypage-content">
          <h2 className="mypage-title">마이페이지</h2>
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
      <div className="refrigerator-container">
        <div className="refrigerator-header">
          <div className="refrigerator-font">
            <h1>Fridge / 나의 냉장고</h1>
          </div>
        </div>
        <div className="refrigerator-content">
          <table className="refrigerator-table">
            <thead>
              <tr>
                <th>상품</th>
                <th>상품명</th>
                <th>수량</th>
                <th>픽업</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td><img src={product.image} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td><button className="pickup-button">PickUp</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <KeepModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cartItems={products}
        customerIdx={localStorage.getItem('customerIdx')}
      />
    </div>
  );
};

export default RefrigeratorComponent;
