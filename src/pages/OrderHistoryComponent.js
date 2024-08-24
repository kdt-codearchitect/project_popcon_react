import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './OrderHistoryComponent.css';
import SideMenu from './SideMenu';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistoryComponent = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const elementRef = useRef(null);
  const url = process.env.REACT_APP_API_BASE_URL;
  const CustomerIdx = localStorage.getItem('customerIdx');
  const imgSrc = '../image/item_image/';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/orders/user/${CustomerIdx}?page=${page}`);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setOrders((prevOrders) => {
          const newOrders = response.data.filter(
            (newOrder) => !prevOrders.some((order) => order.orderIdx === newOrder.orderIdx)
          );
          return [...prevOrders, ...newOrders];
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);  // 더 이상 데이터가 없을 때
      }
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
      setHasMore(false);  // 오류 발생 시에도 추가 요청 중단
    }
  };

  useEffect(() => {
    fetchOrders();  // 초기 주문 데이터 가져오기
  }, [url, CustomerIdx]);

  useEffect(() => {
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore) {
        fetchOrders();  // 추가 주문 데이터 가져오기
      }
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasMore]);

  const openModal = (order) => {
    const orderIdx = order.orderIdx;

    axios.get(`${url}/orders/${orderIdx}/items`)
      .then(response => {
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
            {orders.map((order, index) => (
              <tr key={index} onClick={() => openModal(order)}>
                <td>
                  {order.skuImg ? (
                    <img src={imgSrc + order.skuImg} alt={order.skuName} />
                  ) : (
                    <p>No image</p>
                  )}
                </td>
                <td>{order.paymentId}</td>
                <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                <td>{order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}</td>
                <td>{order.orderStatus || 'N/A'}</td>
                <td>{order.deliveryStatus || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <div ref={elementRef}></div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} orderItems={orderItems} closeModal={closeModal} />
      )}
    </div>
  );
};

export default OrderHistoryComponent;