import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeepModal.css';

const KeepModal = ({ isOpen, onClose, fridgeIdx }) => {
  const [cartItems, setCartItems] = useState([]);
  const [keepItems, setKeepItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  
  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);

      if (isOpen) {
        axios.get(url+`/cart/customer/${storedCustomerIdx}`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          const items = response.data.flatMap(cart => cart.cartItems.map(item => ({
            ...item,
            cartIdx: cart.cartIdx,
            customerIdx: cart.customerIdx,
            skuIdx: item.skuIdx,  // skuIdx를 명시적으로 추가
            isFromKeep: item.keepCost !== null  // keepCost가 null이 아니면 Keep에서 넘어온 것으로 구분
          })));
          
          console.log('Loaded Cart Items:', items); // cartItems 데이터 확인
          setCartItems(items);
        })
        .catch(error => {
          console.error('카트에 제품 데이터를 가져오는 데 오류가 발생했습니다', error);
        });
      }
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 token을 찾을 수 없습니다.');
    }
  }, [isOpen]);

  const handleItemChange = (skuIdx, quantity) => {
    console.log('SKU Index received:', skuIdx); // SKU Index가 올바르게 전달되는지 확인

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

  const handleMoveToKeep = async (cartItemIdx, quantity) => {
    try {
      const response = await axios.post(url+'/cart/cart/moveToKeep', null, {
        params: {
          cartItemIdx: cartItemIdx,
          fridgeIdx: fridgeIdx,
          qty: quantity, // 전달할 수량 추가
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log(`상품 ${cartItemIdx}가 ${quantity}개 킵으로 이동되었습니다.`);
      }
    } catch (error) {
      console.error('킵으로 상품을 이동하는 중에 오류가 발생했습니다.', error);
    }
  };

  const handleSubmit = async () => {
    const promises = keepItems.map(async (item) => {
      const cartItem = cartItems.find((cartItem) => cartItem.skuIdx === item.skuIdx);
      if (cartItem) {
        await handleMoveToKeep(cartItem.cartItemIdx, item.quantity);
      }
    });

    await Promise.all(promises);

    onClose(); // 모든 항목이 처리된 후 모달 닫기
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
            <span>{item.skuName} (SKU Index: {item.skuIdx})</span> {/* SKU Index 확인 */}
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
