import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeepModal.css';

const KeepModal = ({ isOpen, onClose, fridgeIdx }) => {
  const [cartItems, setCartItems] = useState([]);
  const [keepItems, setKeepItems] = useState([]);
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');

  useEffect(() => {
    if (isOpen) {
      axios.get(`http://localhost:8090/popcon/cart/customer/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
          ...item,
          cartIdx: cart.cartIdx,
          customerIdx: cart.customerIdx,
          skuCost: 0,  // KeepModal에서 skuCost를 0으로 설정
        }))));
      })
      .catch((error) => {
        console.error('카트에 제품 데이터를 가져오는데 오류가 발생했습니다', error);
      });
    }
  }, [isOpen, customerIdx, token]);

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

  const handleMoveToKeep = async (cartItem) => {
    try {
      const response = await axios.post('http://localhost:8090/popcon/cart/cart/moveToKeep', null, {
        params: {
          cartItemIdx: cartItem.cartItemIdx,
          fridgeIdx: fridgeIdx,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('상품이 킵으로 이동되었습니다.');
        onClose(); // 성공 시 모달 닫기
      }
    } catch (error) {
      console.error('킵으로 상품을 이동하는 중에 오류가 발생했습니다.', error);
    }
  };

  const handleSubmit = () => {
    keepItems.forEach((item) => {
      const cartItem = cartItems.find((cartItem) => cartItem.skuIdx === item.skuIdx);
      if (cartItem) {
        // 가격을 0으로 설정한 후 서버로 전송
        handleMoveToKeep({
          ...cartItem,
          skuCost: 0,  // 여기서 가격을 0으로 설정
        });
      }
    });

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
