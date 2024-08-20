import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeepModal.css';

const KeepModal = ({ isOpen, onClose, fridgeIdx }) => {
  const [cartItems, setCartItems] = useState([]);
  const [keepItems, setKeepItems] = useState([]); // keepItems 상태 정의
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);

      if (isOpen) {
        // 로그인한 사용자의 카트를 가져옴 (axios 사용)
        axios.get(`http://localhost:8090/popcon/customer/${storedCustomerIdx}`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            setCartItems(response.data.flatMap(cart => cart.cartItems.map(item => ({
              ...item,
              cartIdx: cart.cartIdx,
              customerIdx: cart.customerIdx
            }))));
          })
          .catch(error => {
            console.error('카트에 제품데이터를 가져오는데 오류가 발생 했습니다', error);
          });
      }
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 token을 찾을 수 없습니다.');
    }
  }, [isOpen]);

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

  const handleMoveToKeep = async (cartItemIdx) => {
    try {
      const response = await axios.post('http://localhost:8090/popcon/cart/moveToKeep', null, {
        params: {
          cartItemIdx: cartItemIdx,
          fridgeIdx: fridgeIdx,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        alert('상품이 킵으로 이동되었습니다.');
      }
    } catch (error) {
      console.error('킵으로 상품을 이동하는 중에 오류가 발생했습니다.', error);
    }
  };

  const handleSubmit = () => {
    keepItems.forEach(item => {
      const cartItem = cartItems.find(cartItem => cartItem.skuIdx === item.skuIdx);
      if (cartItem) {
        handleMoveToKeep(cartItem.cartItemIdx);
      }
    });

    onClose(); // 모달 닫기
  };

  if (!isOpen) {
    return null;
  }

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
