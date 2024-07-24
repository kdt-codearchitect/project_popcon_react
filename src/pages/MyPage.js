import React from 'react';
import './MyPage.css'; // MyPage.css 파일을 import
import { Link , useNavigate} from "react-router-dom";

const MyPage = ({ userInfo }) => {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="mypage-container">
        <div className="mypage-content">
          <h2 className="mypage-title" onClick={() => navigate('/MyPage')}>마이페이지</h2>
          <ul className="nav-links-side">
            <li><Link to="/MyInfo">MyInfo / 개인정보수정</Link></li>
            <li><Link to="/favorites">Favorites / 나의 찜 목록</Link></li>
            <li><Link to="/MyDelivery">Delivery / 배송 상황</Link></li>
            <li><Link to="/refrigerator">Fridge / 나의 냉장고</Link></li>
            <li><Link to="/Payment">Payment / 결제수단</Link></li>
            <li><Link to="/orderhistory">History / 주문 내역</Link></li>
          </ul>
        </div>
      </div>
      <div className="section-container">
        <div className="section-header">
          <div className="section-font">
            <h1>My Info / 나의 정보</h1>
          </div>
        </div>
        <div className="section-content">
          <div className="mypage-info">
            <p><strong>이름</strong>: {userInfo.name}</p>
            <p><strong>비밀번호</strong>: <button className="update-button">비밀번호 변경</button></p>
            <p><strong>연락처</strong>: {userInfo.phone.part1} - {userInfo.phone.part2} - {userInfo.phone.part3}</p>
            <p><strong>E-mail</strong>: {userInfo.email}</p>
            <p><strong>주소</strong>: {userInfo.address}</p>
             <button type="button" className="update-button" onClick={() => navigate('/MyInfo')}>개인정보수정</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
