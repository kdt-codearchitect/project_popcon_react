import React from 'react';
import './RefrigeratorComponent.css'; // 동일한 CSS 파일을 사용
import { Link, useNavigate } from "react-router-dom";
import deleteIcon from "../image/Delete.png"; // 적절한 경로로 수정하세요

const FavoriteComponent = ({ favoriteItems, removeFromFavorites }) => {
 const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="mypage-container">
        <div className="mypage-content">
        <h2 className="mypage-title" onClick={() => navigate('/MyPage')}>마이페이지</h2>
          <ul className="nav-links-sides">
          <li><Link to="/MyInfo">MyInfo / 개인정보수정</Link></li>
            <li><Link to="/favorites">Favorites / 나의 찜 목록</Link></li>
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
            <h1>Favorites / 나의 찜 목록</h1>
          </div>
        </div>
        <div className="refrigerator-content">
          <table className="refrigerator-table">
            <thead>
              <tr>
                <th>상품</th>
                <th>상품명</th>
                <th>할인여부</th>
                <th>주문액</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {favoriteItems.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} className="favorites-item-image" /></td>
                  <td>{item.name}</td>
                  <td>할인없음</td>
                  <td>{item.price.toLocaleString()}원</td>
                  <td>
                    <button className="remove-button" onClick={() => removeFromFavorites(item.id)}>
                      <img src={deleteIcon} alt="Delete" className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FavoriteComponent;