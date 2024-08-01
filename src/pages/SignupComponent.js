import React, { useState } from 'react';
import axios from 'axios';
import './SignupComponent.css';

const SignupComponent = () => {
  const [formData, setFormData] = useState({
    memberId: '',
    memberPw: '',
    memberName: '',
    memberPhone1: '010',
    memberPhone2: '',
    memberPhone3: '',
    memberDate: '',
    memberAdd: '',
    memberAddMore: '',
    memberEmail: '',
    memberEmailDomain: 'naver.com',
    memberRate: '',
    memberRole: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhone = `${formData.memberPhone1}-${formData.memberPhone2}-${formData.memberPhone3}`;
    const fullEmail = `${formData.memberEmail}@${formData.memberEmailDomain}`;

    try {
      const response = await axios.post('http://localhost:8090/app/signup', {
        ...formData,
        memberPhone: fullPhone,
        memberEmail: fullEmail,
      });
      alert('회원가입해주셔서 감사합니다! 환영합니다!!');
    } catch (error) {
      console.error('There was an error signing up!', error);
    }
  };

  return (
    <div className="signUp-container">
      <div className="signUp-box">
        <form className="signUp-form" onSubmit={handleSubmit}>
          <div className="signUp-box-item">
            <input type="text" name="memberId" placeholder="ID" value={formData.memberId} onChange={handleChange} />
            <button type="button">중복확인</button>
          </div>
          <input type="password" name="memberPw" placeholder="Password" value={formData.memberPw} onChange={handleChange} />
          <input type="text" name="memberName" placeholder="Name" value={formData.memberName} onChange={handleChange} />
          <input type="text" name="memberRate" placeholder="Rate" value={formData.memberRate} onChange={handleChange} />
          <input type="text" name="memberRole" placeholder="Role" value={formData.memberRole} onChange={handleChange} />
          <input type="date" name="memberDate" placeholder="Year-Month-Day" value={formData.memberDate} onChange={handleChange} />
          <div className="signUp-phone-box">
            <input type="text" name="memberPhone1" placeholder="010" value={formData.memberPhone1} onChange={handleChange} />
            <input type="text" name="memberPhone2" placeholder="0000" value={formData.memberPhone2} onChange={handleChange} />
            <input type="text" name="memberPhone3" placeholder="0000" value={formData.memberPhone3} onChange={handleChange} />
          </div>
          <div className="signUp-email-box">
            <input type="text" name="memberEmail" placeholder="Email" value={formData.memberEmail} onChange={handleChange} />
            <select name="memberEmailDomain" value={formData.memberEmailDomain} onChange={handleChange}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="yahoo.com">yahoo.com</option>
            </select>
          </div>
          <div className="signUp-address">
            <input type="text" name="memberAdd" placeholder="Address Line 1" value={formData.memberAdd} onChange={handleChange} />
            <input type="text" name="memberAddMore" placeholder="Address Line 2" value={formData.memberAddMore} onChange={handleChange} />
            <button type="button">주소찾기</button>
          </div>
          <div className="signUp-button-box">
            <button type="submit">회원가입</button>
            <button type="reset">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupComponent;
