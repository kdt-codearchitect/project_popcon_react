import React, { useState } from 'react';
import './MyInfo.css';
import { Link, useNavigate } from "react-router-dom";

const MyInfo = ({ userInfo, updateUserInfo }) => {
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setLocalUserInfo(prevState => ({
      ...prevState,
      phone: {
        ...prevState.phone,
        [name]: value
      }
    }));
  };

  const handleSubmit = () => {
    updateUserInfo(localUserInfo);
    navigate('/MyPage');
  };

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
            <h1>MyInfo / 개인정보수정</h1>
          </div>
        </div>
        <div className="section-content">
          <div className="myinfo-container">
            <div className="myinfo-header">
              <h2>MyInfo/ 개인정보 수정</h2>
            </div>
            <form className="myinfo-form" onSubmit={handleSubmit}>
              <div className="myinfo-name">
                <h1>{localUserInfo.name}</h1>
              </div>
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={localUserInfo.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={localUserInfo.confirmPassword}
                onChange={handleChange}
              />
              <div className="myinfo-phone">
                <input
                  type="text"
                  name="part1"
                  placeholder="010"
                  value={localUserInfo.phone.part1}
                  onChange={handlePhoneChange}
                />
                <input
                  type="text"
                  name="part2"
                  placeholder="9391"
                  value={localUserInfo.phone.part2}
                  onChange={handlePhoneChange}
                />
                <input
                  type="text"
                  name="part3"
                  placeholder="4767"
                  value={localUserInfo.phone.part3}
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="myinfo-email">
                <input
                  type="text"
                  name="email"
                  placeholder="E-mail"
                  value={localUserInfo.email.split('@')[0]}
                  onChange={handleChange}
                />
                <select
                  name="emailDomain"
                  value={`@${localUserInfo.email.split('@')[1]}`}
                  onChange={(e) => handleChange({ target: { name: 'email', value: `${localUserInfo.email.split('@')[0]}${e.target.value}` } })}
                >
                  <option value="@naver.com">@naver.com</option>
                  <option value="@gmail.com">@gmail.com</option>
                  <option value="@daum.net">@daum.net</option>
                </select>
              </div>
              <input
                type="text"
                name="address"
                placeholder="주소"
                value={localUserInfo.address}
                onChange={handleChange}
              />
              <div className="myinfo-buttons">
                <button type="button" className="save-button" onClick={handleSubmit}>수정</button>
                <button type="button" className="cancel-button" onClick={() => navigate('/MyPage')}>취소</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
