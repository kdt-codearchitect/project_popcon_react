import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckoutComponent.css';
import PopconB from "../image/store_image/PopconB.png";
import checkout_labe1 from "../image/store_image/checkout_label01.png"; 
import checkout_labe2 from "../image/store_image/checkout_label02.png";
import checkout_labe3 from "../image/store_image/checkout_label03.png"; 
import checkout_labe4 from "../image/store_image/checkout_label04.png";

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
    guide: ''
  });

  const [cartItems, setCartItems] = useState([]);
 
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Daum Postcode script loaded');
    };
    document.body.appendChild(script);

    // 고객 데이터 가져오기 (임의로 customerIdx를 1로 설정)
    const customerIdx = 1;
    axios.get(`http://localhost:8090/popcon/Customer/${customerIdx}`)
      .then(response => {
        setCustomer(response.data);
      })
      .catch(error => {
        console.error('고객 데이터를 가져오는데 오류가 발생했습니다.', error);
      });
    
    // 장바구니 데이터 가져오기 (임의로 customerIdx를 1로 설정)
    axios.get(`http://localhost:8090/popcon/customer/${customerIdx}`)
      .then(response => {
        setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
          ...item,
          cartIdx: cart.cartIdx,
          customerIdx: cart.customerIdx
        }))));
      })
      .catch(error => {
        console.error('장바구니 데이터를 가져오는데 오류가 발생했습니다.', error);
      });
  }, []);

  const handleAddressChange = () => {
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

  return (
    <div className="checkOut-container flex-c flex-d-column">
      <div className="checkOut-title-box flex-c">
        <div className="title-box-text">
          <img src={PopconB} alt="#"/>
          <h1>주문결제</h1>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe1} alt=""/>
            <h2>구매자 정보</h2>
          </div>
          <div className="checkOut-user-info checkOut-grid">
            <p>이름</p>
            <p>{customer.customerName}</p>
            <p>이메일</p>
            <p>{customer.customerEmail}</p>
            <p>휴대폰번호</p>
            <div className="co-user-input-box">
              <input type="text" value={customer.customerPhone} readOnly />
              <button>수정</button>
            </div>
            <p></p>
            <p>인증번호를 못 받았다면 1577-7011 번호 차단 및 스팸 설정을 확인해 주세요.</p>
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe2} alt=""/>
            <h2>받는 사람 정보</h2>
            <button onClick={handleAddressChange}>배송지 변경</button>
          </div>
          <div className="checkOut-add-info checkOut-grid">
            <p>이름</p>
            <p>{customer.customerName}</p>
            <p>배송주소</p>
            <p>{address.roadAddress}</p>
            <p>연락처</p>
            <p>{customer.customerPhone}</p>
            <p>배송 요청사항</p>
            <p>문 앞에 두고 가세요</p>
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe3} alt=""/>
            <h2>배송 정보</h2>
          </div>
          <div className="checkOut-delivery-info">
            {cartItems.map(item => (
              <div className="co-delivery-item" key={item.cartItemIdx}>
                <p>{item.skuName}</p>
                <p>수량: {item.skuValue}</p>
                <p>{item.skuCost}원</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="checkOut-contents flex-d-column">
        <div className="checkOut-contents-box flex-c flex-d-column">
          <div className="co-contents-title">
            <img src={checkout_labe4} alt=""/>
            <h2>결제정보</h2>
          </div>
          <div className="checkOut-pay-info checkOut-grid">
            <p>총 상품 가격</p>
            <p>{cartItems.reduce((total, item) => total + item.skuCost * item.skuValue, 0).toLocaleString()}원</p>
            <p>포인트 할인</p>
            <div className="co-point-box">
              <p>1,750,000</p>
              <button className="thema-btn-01">사용</button>
            </div>
            <p>배송비</p>
            <p>3000원</p>
            <p>팝콘 캐시</p>
            <p>팝콘 캐시</p>
            <p>결제 방법</p>
            <div className="checkOut-method">
              <div>
                <input type="checkbox" id="kakaoPay"/>
                <label htmlFor="kakaoPay">카카오페이</label>
              </div>
              <div>
                <input type="checkbox" id="naverPay"/>
                <label htmlFor="naverPay">네이버페이</label>
              </div>
              <div>
                <input type="checkbox" id="tossPay"/>
                <label htmlFor="tossPay">토스페이</label>
              </div>
              <div>
                <input type="checkbox" id="accountTransfer"/>
                <label htmlFor="accountTransfer">계좌이체</label>
              </div>
              <div>
                <input type="checkbox" id="creditCard"/>
                <label htmlFor="creditCard">신용/체크카드</label>
              </div>
              <div>
                <input type="checkbox" id="mobilePay"/>
                <label htmlFor="mobilePay">휴대폰결제</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="checkOut-btn-box flex-sb">
        <button className="thema-btn-01">주문하기</button>
        <button className="thema-btn-02">뒤로가기</button>
      </div>
    </div>
  );
};

export default CheckoutComponent;
