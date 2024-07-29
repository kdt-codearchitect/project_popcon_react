import React, { useEffect, useState } from 'react';
import './MyPage.css';
import { Link, useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:8090/app/MyPage');  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setUserList(json);
      } catch (error) {
        console.error("There was an error fetching the members!", error);
      }
    };

    fetchMembers();
  }, []);

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
            
            <h2>All Members</h2>
            <ul>
              {userList.map(member => (
                <li key={member.id}>
                  {member.name} ({member.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
