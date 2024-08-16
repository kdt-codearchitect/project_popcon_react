import React, { useState } from 'react';
import './KeepModal.css';

const KeepModal = ({ isOpen, onClose, cartItems, customerIdx }) => {
  const [keepItems, setKeepItems] = useState([]);

  if (!isOpen) {
    return null; // 모달이 열려 있지 않으면 렌더링하지 않음
  }

  const handleItemChange = (skuIdx, quantity) => {
    setKeepItems(prevState => {
      const existingItem = prevState.find(item => item.skuIdx === skuIdx);
      if (existingItem) {
        return prevState.map(item =>
          item.skuIdx === skuIdx ? { ...item, quantity } : item
        );
      } else {
        return [...prevState, { skuIdx, quantity }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('jwtAuthToken');
      const response = await fetch('http://localhost:8090/popcon/keep/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fridgeIdx: customerIdx, // fridgeIdx 전달
          customerIdx: customerIdx, // customerIdx 전달
          items: keepItems.map(item => ({
            skuIdx: item.skuIdx,
            qty: item.quantity``
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save keep items');
      }

      onClose();

    } catch (error) {
      console.error('Error saving keep items:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>킵할 상품을 선택하세요</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="modal-item">
            <span>{item.skuName}</span>
            <input
              type="number"
              min="0"
              max={item.skuValue}
              defaultValue="0"
              onChange={(e) => handleItemChange(item.skuIdx, parseInt(e.target.value))}
            />
          </div>
        ))}
        <button onClick={handleSubmit}>저장</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default KeepModal;
