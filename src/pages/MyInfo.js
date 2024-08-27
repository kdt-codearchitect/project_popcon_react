import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyInfo.css';
import SideMenu from './SideMenu';

const url = process.env.REACT_APP_API_BASE_URL;
const customerIdx_org = localStorage.getItem('customerIdx');


const MyInfo = ({ userInfo, updateUserInfo }) => {
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    postcode: '',
    roadAddress: '',
    jibunAddress: '',
    guide: ''
  });
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Daum Postcode script loaded');
    };
    document.body.appendChild(script);
  }, []);
  

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${url}/getCustomerIdx/${customerIdx_org}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setLocalUserInfo({
          password: '',
          confirmPassword: '',
          phone: {
            part1: json.customerPhone.split('-')[0],
            part2: json.customerPhone.split('-')[1],
            part3: json.customerPhone.split('-')[2],
          },
          email: json.customerEmail.split('@')[0],
          addressMore: json.customerAddMore || '',
        });
        setAddress((prevAddress) => ({
          ...prevAddress,
          roadAddress: json.customerAdd || '',
        }));
      } catch (error) {
        console.error('There was an error fetching the members!', error);
      }
    };
    fetchMembers();
  }, []);


  const handleAddressChange = (e) => {
    e.preventDefault();
    new window.daum.Postcode({
      oncomplete: function(data) {
        var fullRoadAddr = data.roadAddress;
        var extraRoadAddr = '';
  
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraRoadAddr !== '') {
          fullRoadAddr += ' (' + extraRoadAddr + ')';
        }
  
        setAddress({
          postcode: data.zonecode,
          roadAddress: fullRoadAddr,
          jibunAddress: data.jibunAddress,
          guide: data.autoRoadAddress ? `(예상 도로명 주소: ${data.autoRoadAddress + extraRoadAddr})` 
              : data.autoJibunAddress ? `(예상 지번 주소: ${data.autoJibunAddress})` 
              : ''
        });
      }
    }).open();
    
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const authData = {
      customerIdx: localStorage.getItem('customerIdx'),
      customerId: localStorage.getItem('userid'),
      customerPw: localUserInfo.password,
      customerPhone: `${localUserInfo.phone.part1}-${localUserInfo.phone.part2}-${localUserInfo.phone.part3}`,
      customerAdd: address.roadAddress,
      customerAddMore: localUserInfo.addressMore,
      customerEmail: localUserInfo.email,
    };

    try {
      const response = await fetch(`${url}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });

      if (response.ok) {
        updateUserInfo(localUserInfo);
        navigate('/');
      } else {
        // 에러 처리
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        // 여기에 사용자에게 에러 메시지를 보여주는 로직을 추가할 수 있습니다.
      }
    } catch (error) {
      console.error('Error during update:', error);
      // 네트워크 오류 등의 처리
    }
  };

  // JSX 부분은 기존과 동일

  return (
    <div className="page-container">
    <SideMenu/>
    <div className="section-container">
      <div className="myinfo-header">
        <div className="section-font">
          <h1>MyInfo / 개인정보수정</h1>
        </div>
      </div>
      <div className="section-content">
        <div className="myinfo-container">
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
                placeholder="1234"
                value={localUserInfo.phone.part2}
                onChange={handlePhoneChange}
              />
              <input
                type="text"
                name="part3"
                placeholder="1234"
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
            <div className=" flex-sb">
            <input
              type="text"
              name="address"
              placeholder="주소"
              value={address.roadAddress}
              onChange={handleChange}
            />
               <button className="thema-btn-01" onClick={handleAddressChange}>주소찾기</button>
               </div>
            <input
              type="text"
              name="addressMore"
              placeholder="주소상세"
              value={localUserInfo.addressMore}
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