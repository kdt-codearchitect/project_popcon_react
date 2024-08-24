import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistoryComponent.css';
import SideMenu from './SideMenu';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistoryComponent = () => {
  const [orders, setOrders] = useState([]); // 초기값을 빈 배열로 설정
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const url = process.env.REACT_APP_API_BASE_URL;
  const CustomerIdx = localStorage.getItem('customerIdx'); // 로그인한 유저의 customerIdx를 불러옴
  const imgSrc = '../image/item_image/';

  useEffect(() => {
    // 전체 주문 목록을 가져오는 API 호출  
    axios.get(`${url}/orders/user/${CustomerIdx}`)
      .then(response => {
        // 응답 데이터를 콘솔에 출력
        console.log("API 응답 데이터:", response.data);
        
        // 응답 데이터가 배열인지 확인
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error("Expected array but got:", response.data);
          setOrders([]); // 비어있는 배열로 설정
        }
      })
      .catch(error => {
        console.error("There was an error fetching the orders!", error);
      });
  }, [url, CustomerIdx]);

  const openModal = (order) => {
    const orderIdx = order.orderIdx; // 선택한 주문의 orderIdx를 가져옵니다.

    // 특정 주문의 아이템 목록을 가져오는 API 호출
    axios.get(`${url}/orders/${orderIdx}/items`)
      .then(response => {
        console.log("Order Items API 응답 데이터:", response.data); // 응답 데이터 콘솔 출력
        setOrderItems(response.data);
        setSelectedOrder(order);
      })
      .catch(error => {
        console.error("There was an error fetching the order items!", error);
      });
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  return (
    <div className="page-container">
      <SideMenu />

      <div className="order-history">
        <div className="order-history-header">
          <div>
            <h1>History</h1>
            <h2>/ 주문내역</h2>
          </div>
        </div>
        <table className="order-history-table">
          <thead>
            <tr>
              <th>주문</th>
              <th>주문번호</th>
              <th>주문일</th>
              <th>주문액</th>
              <th>주문상태</th>
              <th>배송상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const firstOrderItem = orderItems.length > 0 ? orderItems[0] : null; // 첫 번째 아이템 선택

              return (
                <tr key={index} onClick={() => openModal(order)}>
                  <td>
                    {firstOrderItem ? (

                      <img src={imgSrc+firstOrderItem.image+'.jpg'} alt={firstOrderItem.name} />

                    ) : (
                      <p>No image</p>
                    )}
                  </td>
                  <td>{order.paymentId}</td> {/* order.paymentId로 수정 */}
                  <td>{new Date(order.orderTime).toLocaleDateString()}</td> {/* order.orderTime을 사용하여 날짜 형식으로 변환 */}
                  <td>{order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}</td> {/* order.price가 존재하는지 확인 */}
                  <td>{order.orderStatus || 'N/A'}</td> {/* 주문상태가 없을 경우 'N/A' 표시 */}
                  <td>{order.deliveryStatus || 'N/A'}</td> {/* 배송상태가 없을 경우 'N/A' 표시 */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} orderItems={orderItems} closeModal={closeModal} />
      )}
    </div>
  );
};

export default OrderHistoryComponent;
