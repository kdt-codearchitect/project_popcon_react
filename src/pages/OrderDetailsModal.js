import React from 'react';

const OrderDetailsModal = ({ order, orderItems, closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Order Details</h2>
        <p>Order ID: {order.orderIdx}</p>
        <p>Payment ID: {order.paymentId}</p>
        <p>Order Time: {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p> {/* 조건부 렌더링 */}
        <p>Order Status: {order.orderStatus || 'N/A'}</p>
        <p>Delivery Status: {order.deliveryStatus || 'N/A'}</p>
        <button onClick={closeModal}>Close</button>

        <h3>Order Items</h3>
        <ul>
          
          
          {orderItems.map((item, index) => (
            <li key={index}>
              SKU: {item.skuIdx}, 수량: {item.orderItemQty}, 가격: {item.orderItemPrice.toLocaleString()}원
            </li>
          ))}
        

            <li >
               {order.totalSumPrice ? order.totalSumPrice.toLocaleString() + '원' : 'N/A'}
            </li>
          
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
