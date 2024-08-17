import React, { useEffect } from 'react';
import './CheckoutComponent.css';

const payment_value = {
    storeId: "store-b0ebe037-6ace-4169-a208-a5e368cbe5ec",
    paymentId: "testlzl4f9xe2",
    orderName: "테스트 결제",
    totalAmount: 100,
    currency: "KRW",
    channelKey: "channel-key-0c8dda50-9f5b-4487-bdfd-b4511f8fd803",
    payMethod: "CARD",
    card: {},
    customer: {
      fullName: "포트원",
    },
    redirectUrl: "https://sdk-playground.portone.io/",
}

const Payment = () => {
  useEffect(() => {
    // PortOne SDK가 로드되었는지 확인
    if (!window.PortOne) {
      console.error('PortOne SDK가 로드되지 않았습니다.');
    }
  }, []);

  const requestPay = () => {
    if (!window.PortOne) {
      console.error('PortOne SDK가 로드되지 않았습니다.');
      return;
    }

     

    window.PortOne.requestPayment(payment_value);
  };

  return (
    <div>
      <button className="thema-btn-01" onClick={requestPay}>결제하기</button>
    </div>
  );
};

export { Payment,payment_value };
