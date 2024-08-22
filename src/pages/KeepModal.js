import React, { useState, useEffect } from 'react';
import './CheckoutComponent.css';
import PopconB from "../image/store_image/PopconB.png";
import checkout_labe1 from "../image/store_image/checkout_label01.png"; 
import checkout_labe2 from "../image/store_image/checkout_label02.png";
import checkout_labe3 from "../image/store_image/checkout_label03.png"; 
import checkout_labe4 from "../image/store_image/checkout_label04.png";
import { Payment, payment_value } from "./payment";
import { getAuthToken } from '../util/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutComponent = () => {
  const [customer, setCustomer] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAdd: '',
    customerAddMore: ''
  });
  const [address, setAddress] = useState({
    postcode: '',
    roadAddress: '',
    jibunAddress: '',
    guide: '',
    roadAddress_more: '' // 추가: 상세주소 필드
  });
  const [cartItems, setCartItems] = useState([]);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');

  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_BASE_URL;


  // 총 상품 가격 불러오기 위한 변수 
  const totalSumCost = cartItems.length > 0 ? cartItems[0].totalSumCost : 0; 
  const customerIdx = localStorage.getItem('customerIdx'); // 로그인한 유저의 customerIdx를 불러옴
  const token = localStorage.getItem('jwtAuthToken'); // JWT 토큰 가져오기

  payment_value.customer.fullName = customer.customerName;

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
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(url+`/findCustomer/${customerIdx}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setCustomer(data[0]); // 첫 번째 고객 데이터 사용
          setEditedPhone(data[0].customerPhone); // 초기 값 설정
        } else {
          setCustomer(data);
          setEditedPhone(data.customerPhone); // 초기 값 설정
        }
      } catch (error) {
        console.error('There was an error fetching the customer data!', error);
      }
    };
    
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(url+`/cart/customer/${customerIdx}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCartItems(
          response.data.flatMap(cart => 
            cart.cartItems.map(item => ({
              ...item,
              cartIdx: cart.cartIdx,
              customerIdx: cart.customerIdx,
              skuCost: 0,  // 추가된 필드
            }))
          )
        );
      } catch (error) {
        console.error('There was an error fetching the cart data!', error);
        setCartItems([]); // 오류 발생 시 빈 배열로 설정
        alert("로그인이 필요한 페이지입니다.");
        window.location.href = "/";
      }
    };

    fetchCustomer();
    fetchCartItems();
  }, [customerIdx, token]);

  const handleAddressChange = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
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
              : '',
          roadAddress_more: '' // 새로운 주소가 선택되면 상세주소 필드 초기화
        });
      }
    }).open();
  };

  payment_value.totalAmount = totalSumCost;

  const handleEditPhoneClick = () => {
    setIsEditingPhone(true);
  };

  const handlePhoneChange = (e) => {
    setEditedPhone(e.target.value);
  };

  const handlePhoneBlur = () => {
    setCustomer({ ...customer, customerPhone: editedPhone });
    setIsEditingPhone(false);
  };

  const handlePaymentSuccess = () => {
    const userChoice = window.confirm("결제하신 상품을 냉장고에 킵하시겠습니까?");
    if (userChoice) {
      navigate('/refrigerator', { state: { openModal: true } }); // 냉장고로 이동하며 모달 열기
    } else {
      navigate('/refrigerator'); // 냉장고로 이동하지만 모달은 열지 않음
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="checkOut-container flex-c flex-d-column">
      <div className="checkOut-title-box flex-c">
        <div className="title-box-text">
          <img src={PopconB} alt="#" />
          <h1>주문결제</h1>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe1} alt="" />
            <h2>구매자 정보</h2>
          </div>
          <div className="checkOut-user-info checkOut-grid">
            <p>이름</p>
            <p>{customer.customerName || 'N/A'}</p>
            <p>이메일</p>
            <p>{customer.customerEmail || 'N/A'}</p>
            <p>휴대폰번호</p>
            <div className="co-user-input-box">
              {isEditingPhone ? (
                <input 
                  type="text" 
                  value={editedPhone} 
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur} 
                  autoFocus
                />
              ) : (
                <>
                  <input type="text" value={customer.customerPhone || ''} readOnly />
                  <button onClick={handleEditPhoneClick}>수정</button>
                </>
              )}
            </div>
            <p></p>
            <p>인증번호를 못 받았다면 1577-7011 번호 차단 및 스팸 설정을 확인해 주세요.</p>
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe2} alt="" />
            <h2>받는 사람 정보</h2>
            <button onClick={handleAddressChange}>배송지 변경</button>
          </div>
          <div className="checkOut-add-info checkOut-grid">
            <p>이름</p>
            <p>{customer.customerName || 'N/A'}</p>
            <p>배송주소</p>
            <p>{address.roadAddress || customer.customerAdd}</p>
            <p>상세주소</p>
            {address.roadAddress ? (
              <input 
                type="text" 
                value={address.roadAddress_more} 
                onChange={(e) => setAddress({ ...address, roadAddress_more: e.target.value })} 
                placeholder="상세주소를 입력하세요"
              />
            ) : (
              <p>{customer.customerAddMore}</p>
            )}
            <p>배송 요청사항</p>
            <p>문 앞에 두고 가세요</p>
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe3} alt="" />
            <h2>배송 정보</h2>
          </div>
          <div className="checkOut-delivery-info">
            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div className="co-delivery-item" key={index}>
                  <p>{item.skuName}</p>
                  <p>수량</p>
                  <p>{item.skuValue}</p>
                  <p>무료배송</p>
                  <p>{formatNumber(item.skuCost)}원</p>
                </div>
              ))
            ) : (
              <p>장바구니가 비어 있습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe4} alt="" />
            <h2>결제정보</h2>
          </div>
          <div className="checkOut-pay-info checkOut-grid">
            <p>총 상품 가격</p>
            <p>{formatNumber(totalSumCost)}원</p>
            <p>포인트 할인</p>
            <div className="co-point-box">
              <p>1,750,000</p>
              <button className="thema-btn-01">사용</button>
            </div>
            <p>배송비</p>
            <p>3,000원</p>
            <p>팝콘 캐시</p>
            <p>팝콘 캐시</p>
          </div>
        </div>
      </div>

      <div className="checkOut-btn-box flex-sb">
        <Payment onPaymentSuccess={handlePaymentSuccess} /> 
        <button className="thema-btn-02">뒤로가기</button>
      </div>
    </div>
  );
};

export default CheckoutComponent;
