import React, { useState, useEffect } from 'react';
import './CheckoutComponent.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KeepModal from './KeepModal';  // KeepModal 가져오기

const payment_value = {
    storeId: "store-b0ebe037-6ace-4169-a208-a5e368cbe5ec",
    paymentId: "testlzl4f9xe759",
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

const url = process.env.REACT_APP_API_BASE_URL;

const Payment = () => {
  const [isModalOpen, setModalOpen] = useState(false);  // 모달 상태 관리
  const [fridgeIdx, setFridgeIdx] = useState(null);  // fridgeIdx 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.PortOne) {
      console.error('PortOne SDK가 로드되지 않았습니다.');
    }
  }, []);

  const placeOrder = async (customerIdx, paymentId) => {
    const token = localStorage.getItem('jwtAuthToken');
    const validDeliveryIdx = 1; // 유효한 deliveryIdx 값을 미리 설정 또는 가져오기

    try {
      console.log("Attempting to fetch cart for customerIdx:", customerIdx);

      const cartResponse = await axios.get(url + `/cart/customer/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (cartResponse.status === 200 && cartResponse.data.length > 0) {
        const cartIdx = cartResponse.data[0].cartIdx;

        // OrderDTO와 OrderItemDTO 리스트를 요청 본문에 포함
        const orderData = {
          orderDTO: {
            customerIdx,
            paymentId,
            cartIdx,
            deliveryIdx: validDeliveryIdx,  // 유효한 deliveryIdx 값 사용
            orderTime: new Date().toISOString(),
            orderStatusIdx: 1, // 예시 값, 실제로는 다른 값을 사용 가능
          },
          orderItems: cartResponse.data[0].cartItems.map(cartItem => ({
            skuIdx: cartItem.skuIdx,
            orderItemQty: cartItem.skuValue,
            orderItemPrice: cartItem.skuCost,
          })),
          cart: cartResponse.data // 전체 카트 데이터를 포함
        };

        const response = await axios.post(url + '/orders/place', orderData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          console.log("Order placed successfully!");
        } else {
          console.error('Failed to place order:', response.statusText);
        }
      } else {
        console.error('No cart found for the customer');
      }
    } catch (error) {
      console.error('Order placement request failed:', error);
    }
  };

  const clearCart = async (customerIdx) => {
    const token = localStorage.getItem('jwtAuthToken');

    try {
      console.log("Clearing cart for customerIdx:", customerIdx);

      const response = await fetch(url + `/cart/cart/clear/${customerIdx}`, {
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

  const moveToKeep = async (customerIdx) => {
    const token = localStorage.getItem('jwtAuthToken');

    try {
      console.log("Moving items to Keep for customerIdx:", customerIdx);

      const response = await fetch(url + `/cart/cart/moveToKeep/${customerIdx}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Items moved to Keep successfully!");
        // 여기에 fridgeIdx를 저장
        const data = await response.json();
        setFridgeIdx(data.fridgeIdx);  // fridgeIdx를 저장
      } else {
        console.error('Failed to move items to Keep.');
      }
    } catch (error) {
      console.error('Move to Keep request failed:', error);
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
        const paymentId = response.paymentId || payment_value.paymentId;

        placeOrder(customerIdx, paymentId).then(() => {
          const userChoice = window.confirm("결제에 성공하였습니다, 구매하신 상품을 keep하시겠습니까?");
          if (userChoice) {
            moveToKeep(customerIdx).then(() => {
              // KeepModal을 열도록 상태 업데이트
              setModalOpen(true);
              clearCart(customerIdx).then(() => {
              });
            });
          } else {
            clearCart(customerIdx).then(() => {
              navigate('/');
            });
          }
        });

      })
      .catch(error => {
        console.error('결제 요청 중 오류 발생:', error);
        alert('결제 처리 중 오류가 발생했습니다.');
      });
  };

  const handleModalClose = () => {
    setModalOpen(false); // 모달 닫기
    navigate('/refrigerator'); // 냉장고 페이지로 이동
  };

  return (
    <div>
      <button className="thema-btn-01" onClick={requestPay}>결제하기</button>
      {isModalOpen && (
        <KeepModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          fridgeIdx={fridgeIdx}
        />
      )}
    </div>
  );
};

export { Payment, payment_value };