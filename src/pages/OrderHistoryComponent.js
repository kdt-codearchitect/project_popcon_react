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
          <div className="order-history-font">
            <h1>History/ 주문내역</h1>
          </div>
        </div>
        <div className="order-list-title flex-sa">
          <div className="list-checkbox-box"></div>
          <p className="list-title-img">상품이미지</p>
          <p className="oder-code-box">주문번호</p>
          <p className="oder-dage-box">주문일</p>
          <p className="list-cancel-box">주문액</p>
          <p className="list-state-box">상태</p>
        </div>

        {orders.map((order, index) => (
          <div className="order-list-item flex-sa" key={index} onClick={() => openModal(order)}>
            <div className="list-checkbox-box flex-c">

            </div>
            <div className="list-img-box flex-c">
              <img src={imgSrc + order.skuName + '.jpg'} alt="order.skuName" />
            </div>
            <div className="oder-code-box">
              <p>{order.paymentId}</p>
            </div>
            <div className="oder-dage-box flex-c">
              <p>{new Date(order.orderTime).toLocaleDateString()}</p>
            </div>
            <div className="list-cancel-box flex-c">
              <p>{order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}</p>
            </div>
            <div className="list-state-box flex-c">
              <p>{order.orderStatus || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} orderItems={orderItems} closeModal={closeModal} />
      )}
    </div>
  );
};

export default OrderHistoryComponent;