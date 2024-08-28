import React from 'react';
import './OrderDetailsModal.css';  // CSS 파일을 import

const OrderDetailsModal = ({ order, orderItems, closeModal }) => {

    const imgSrc = '../image/item_image/';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> {order.orderIdx}</p>
        <p><strong>Payment ID:</strong> {order.paymentId}</p>
        <p><strong>Order Time:</strong> {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p>
        <p><strong>Order Status:</strong> {order.orderStatus || 'N/A'}</p>
        <p><strong>Delivery Status:</strong> {order.deliveryStatus || 'N/A'}</p>

        <h3>Order Items</h3>
        <ul className="order-items-list">
          {orderItems.map((item, index) => (
            <li key={index} className="order-item">
              <img className="order-item-image" src={imgSrc + item.skuName + '.jpg'} alt={item.skuName} />
              <div className="order-item-details">
                <p><strong>이름:</strong> {item.skuName}</p>
                <p><strong>수량:</strong> {item.orderItemQty}</p>
                <p><strong>가격:</strong> {item.orderItemPrice.toLocaleString()}원</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="total-price">
          <strong>결제금액:</strong> {order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}
        </div>
        
        <button className="close-button" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
