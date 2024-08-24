import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KeepModal.css';

const KeepModal = ({ isOpen, onClose, fridgeIdx }) => {
  const [cartItems, setCartItems] = useState([]);
  const [keepItems, setKeepItems] = useState([]);
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');
  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      axios.get(url+`/cart/customer/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const items = response.data.flatMap(cart => cart.cartItems.map(item => ({
          ...item,
          cartIdx: cart.cartIdx,
          customerIdx: cart.customerIdx,
        })));
        
        console.log('Loaded Cart Items:', items); // cartItems 데이터 확인
        setCartItems(items);
      })
      .catch((error) => {
        console.error('카트에 제품 데이터를 가져오는데 오류가 발생했습니다', error);
      });
    }
  }, [isOpen, customerIdx, token]);

  const handleItemChange = (skuIdx, quantity) => {
    console.log('SKU Index:', skuIdx); // 디버깅: 올바른 SKU Index가 전달되고 있는지 확인
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
  
    console.log('Updated Keep Items:', keepItems); // 디버깅: 상태 업데이트 후 확인
  };

  
const handleMoveToKeep = async (cartItemIdx, quantity) => {
  try {
    const response = await axios.post(url+'/cart/cart/moveToKeep', null, {
      params: {
        cartItemIdx: cartItemIdx,
        fridgeIdx: customerIdx,
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
  // 선택한 모든 상품에 대해 반복
  const promises = keepItems.map(async (item) => {
    const cartItem = cartItems.find((cartItem) => cartItem.skuIdx === item.skuIdx);
    if (cartItem) {
      // 각 SKU에 대해 개별적으로 서버로 요청
      await handleMoveToKeep(cartItem.cartItemIdx, item.quantity);
    }
  });

  // 모든 요청이 완료될 때까지 기다림
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
    <span>{item.skuName} (SKU Index: {item.skuIdx})</span> {/* 디버깅용 출력 */}
    <input
      type="number"
      min="0"
      max={item.skuValue}
      defaultValue="1"
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
