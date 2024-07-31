import React, { useState } from 'react';
import axios from 'axios';
import './SignupComponent.css';

const SignupComponent = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerPw: '',
    customerName: '',
    customerPhone1: '010',
    customerPhone2: '',
    customerPhone3: '',
    customerDate: '',
    customerAdd: '',
    customerAddMore: '',
    customerEmail: '',
    customerEmailDomain: 'naver.com',
    customerRate: '',
    customerRole: '',
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
    const fullPhone = `${formData.customerPhone1}-${formData.customerPhone2}-${formData.customerPhone3}`;
    const fullEmail = `${formData.customerEmail}@${formData.customerEmailDomain}`;

    try {
      const response = await axios.post('http://localhost:8090/popcon/signup', {
        ...formData,
        customerPhone: fullPhone,
        customerEmail: fullEmail,
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
            <input type="text" name="customerId" placeholder="ID" value={formData.customerId} onChange={handleChange} />
            <button type="button">중복확인</button>
          </div>
          <input type="password" name="customerPw" placeholder="Password" value={formData.customerPw} onChange={handleChange} />
          <input type="text" name="customerName" placeholder="Name" value={formData.customerName} onChange={handleChange} />
          <input type="text" name="customerRate" placeholder="Rate" value={formData.customerRate} onChange={handleChange} />
          <input type="text" name="customerRole" placeholder="Role" value={formData.customerRole} onChange={handleChange} />
          <input type="date" name="customerDate" placeholder="Year-Month-Day" value={formData.customerDate} onChange={handleChange} />
          <div className="signUp-phone-box">
            <input type="text" name="customerPhone1" placeholder="010" value={formData.customerPhone1} onChange={handleChange} />
            <input type="text" name="customerPhone2" placeholder="0000" value={formData.customerPhone2} onChange={handleChange} />
            <input type="text" name="customerPhone3" placeholder="0000" value={formData.customerPhone3} onChange={handleChange} />
          </div>
          <div className="signUp-email-box">
            <input type="text" name="customerEmail" placeholder="Email" value={formData.customerEmail} onChange={handleChange} />
            <select name="customerEmailDomain" value={formData.customerEmailDomain} onChange={handleChange}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="yahoo.com">yahoo.com</option>
            </select>
          </div>
          <div className="signUp-address">
            <input type="text" name="customerAdd" placeholder="Address Line 1" value={formData.customerAdd} onChange={handleChange} />
            <input type="text" name="customerAddMore" placeholder="Address Line 2" value={formData.customerAddMore} onChange={handleChange} />
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
