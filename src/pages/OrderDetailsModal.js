import React from 'react';
import './OrderDetailsModal.css';  // CSS 파일을 import
import { ImCross } from "react-icons/im";

const OrderDetailsModal = ({ order, orderItems, closeModal }) => {

    const imgSrc = '../image/item_image/';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>주문 내역 상세</h2>
        <p><strong>주문 ID :</strong> {order.paymentId}</p>
        <p><strong>주문 날짜 :</strong> {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p>

        <h3>주문 목록</h3>
        <ul className="order-items-list">
          {orderItems.map((item, index) => (
            <li key={index} className="order-item">
              <img className="order-item-image" src={imgSrc + item.skuName + '.jpg'} alt={item.skuName} />
              <div className="order-item-details">
                <p><strong>이름 :</strong> {item.skuName}</p>
                <p><strong>수량 :</strong> {item.orderItemQty}</p>
                <p><strong>가격 :</strong> {item.orderItemPrice.toLocaleString()}원</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="total-price">
          <strong>결제금액:</strong> {order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}
        </div>
        
        <ImCross className="close-button" onClick={closeModal}/>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
