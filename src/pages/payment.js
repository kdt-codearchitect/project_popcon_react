import React, { useEffect } from 'react';
import './CheckoutComponent.css';
import { useNavigate } from 'react-router-dom';

const payment_value = {
    storeId: "store-b0ebe037-6ace-4169-a208-a5e368cbe5ec",
    paymentId: "testlzl4f9xe29",
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
};

const Payment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.PortOne) {
      console.error('PortOne SDK가 로드되지 않았습니다.');
    }
  }, []);

  const moveToKeep = async (customerIdx) => {
    const token = localStorage.getItem('jwtAuthToken');

    try {
      const response = await fetch(`http://localhost:8090/popcon/cart/moveToKeep/${customerIdx}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Items moved to Keep successfully!");
      } else {
        console.error('Failed to move items to Keep.');
      }
    } catch (error) {
      console.error('Move to Keep request failed:', error);
    }
  };

  const clearCart = async (customerIdx) => {
    const token = localStorage.getItem('jwtAuthToken');

    try {
      const response = await fetch(`http://localhost:8090/popcon/cart/clear/${customerIdx}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Cart cleared successfully!");
      } else {
        console.error('Cart clearing failed.');
      }
    } catch (error) {
      console.error('Cart clearing request failed:', error);
    }
  };

  const requestPay = () => {
    if (!window.PortOne) {
      console.error('PortOne SDK가 로드되지 않았습니다.');
      return;
    }

    window.PortOne.requestPayment(payment_value)
      .then(response => {
        console.log("Payment response:", response);

        const customerIdx = localStorage.getItem('customerIdx');

        // 결제 성공 여부와 상관없이 장바구니 처리
        const userChoice = window.confirm("결제에 성공하였습니다, 구매하신 상품을 keep하시겠습니까?");
        if (userChoice) {
          moveToKeep(customerIdx).then(() => {
            navigate('/refrigerator', { state: { openModal: true } });
          });
        } else {
          clearCart(customerIdx).then(() => {
            navigate('/');
          });
        }
      })
      .catch(error => {
        console.error('결제 요청 중 오류 발생:', error);
    
        const customerIdx = localStorage.getItem('customerIdx');
        clearCart(customerIdx).then(() => {
          navigate('/');
        });
      });
  };

  return (
    <div>
      <button className="thema-btn-01" onClick={requestPay}>결제하기</button>
    </div>
  );
};

export { Payment, payment_value };
