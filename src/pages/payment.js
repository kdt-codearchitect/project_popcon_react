import React, { useEffect } from 'react';
import './CheckoutComponent.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  // uuid import 추가

const payment_value = {
    storeId: "store-b0ebe037-6ace-4169-a208-a5e368cbe5ec",
    paymentId: uuidv4(),  // UUID로 paymentId 생성
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

      const cartResponse = await axios.get(url+ `/cart/customer/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Cart Response:", cartResponse.data);
      console.log("Cart Response:", cartResponse.data[0]);
      console.log("Cart Response:", cartResponse.data[0].cartItems);

      if (cartResponse.status === 200 && cartResponse.data.length > 0) {
        const cartIdx = cartResponse.data[0].cartIdx;
        console.log("Cart Index:", cartIdx);

        // OrderDTO와 OrderItemDTO 리스트를 요청 본문에 포함
        const orderData = {
          orderDTO: {
            customerIdx,
            paymentId,
            cartIdx,
            deliveryIdx: validDeliveryIdx,  // 유효한 deliveryIdx 값 사용
            orderTime: new Date().toISOString(),
            orderStatusIdx: 1, // 예시 값, 실제로는 다른 값을 사용 가능
            orderPrice: cartResponse.data.reduce((total, item) => total + item.price * item.quantity, 0) // 예시로 가격 계산
          },
          orderItems: cartResponse.data[0].cartItems.map(cartItem => ({
            skuIdx: cartItem.skuIdx,
            orderItemQty: cartItem.skuValue,
            orderItemPrice: cartItem.skuCost,
            // 필요시 추가 필드도 추가 가능
          })),
          cart: cartResponse.data // 전체 카트 데이터를 포함
        };

        console.log("Order Data:", orderData);

        const response = await axios.post(url+'/orders/place', orderData, {
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

  const moveToKeep = async (customerIdx) => {
    const token = localStorage.getItem('jwtAuthToken');

    try {
      console.log("Moving items to Keep for customerIdx:", customerIdx);

      const response = await fetch(url+`/cart/moveToKeep/${customerIdx}`, {
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
      console.log("Clearing cart for customerIdx:", customerIdx);

      const response = await fetch(url + `/cart/clear/${customerIdx}`, {
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
        const paymentId = response.paymentId || payment_value.paymentId;

        placeOrder(customerIdx, paymentId).then(() => {
          const userChoice = window.confirm("결제에 성공하였습니다, 구매하신 상품을 keep하시겠습니까?");
          if (userChoice) {
            moveToKeep(customerIdx).then(() => {
              //여기서 킵하겠다고 했을때 냉장고 화면으로 넘어가는게 아니라 그 결제 페이지에서 keepModal이 뜨게 해줬으면 좋겠다.
              navigate('/refrigerator', { state: { openModal: true } });
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
