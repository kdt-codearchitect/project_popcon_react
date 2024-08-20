import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import KeepModal from './KeepModal';
import axios from 'axios';
import './RefrigeratorComponent.css';

const RefrigeratorComponent = () => {
  const navigate = useNavigate();
  const [keepItems, setKeepItems] = useState([]);
  const [cartIdx, setCartIdx] = useState(null); // cartIdx 상태 추가
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // customerIdx와 token을 localStorage에서 가져옴
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');

  useEffect(() => {
    if (!customerIdx || !token) {
      navigate('/login');
      return;
    }

    const fetchCartIdx = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/popcon/cart/customer/${customerIdx}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 && response.data.length > 0) {
          const cartData = response.data[0];
          setCartIdx(cartData.cartIdx); // cartIdx 설정
        }

      } catch (error) {
        console.error('Error fetching cartIdx:', error);
      }
    };

    fetchCartIdx(); // cartIdx를 가져오는 함수 호출

    const fetchKeeps = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/popcon/keep/${customerIdx}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 && response.data.length > 0) {
          const firstKeep = response.data[0];
          const items = firstKeep.keepItems.map(item => ({
            skuIdx: item.skuIdx,
            quantity: item.qty,
            name: `SKU ${item.skuIdx}`,
            image: 'https://via.placeholder.com/50', // 이미지 URL이 없을 때 placeholder 사용
            fridgeIdx: firstKeep.fridgeIdx,
            keepItemIdx: item.keepItemIdx, // 이 필드 추가
          }));
          setKeepItems(items);
        }

      } catch (error) {
        console.error('Error fetching keeps:', error);
      }
    };

    fetchKeeps();
  }, [customerIdx, token, navigate]);

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handlePickup = async (item) => {
    if (!cartIdx) {
      console.error('cartIdx가 설정되지 않았습니다.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8090/popcon/cart/moveToCart', null, {
        params: {
          keepItemIdx: item.keepItemIdx,
          cartIdx: cartIdx, // cartIdx를 요청에 포함
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        alert('아이템이 장바구니로 이동되었습니다.');
        // 장바구니로 이동 시, keep에서 해당 아이템 제거
        setKeepItems(keepItems.filter(i => i.keepItemIdx !== item.keepItemIdx));
      }
    } catch (error) {
      console.error('아이템을 장바구니로 이동하는 중 오류가 발생했습니다.', error);
      alert('아이템을 장바구니로 이동하는 중 오류가 발생했습니다.');
    }
};
  
  return (
    <div className="page-container">
      <div className="mypage-container">
        <div className="mypage-content">
          <h2 className="mypage-title">마이페이지</h2>
          <ul className="nav-links-side">
            <li><Link to="/MyInfo">MyInfo / 개인정보수정</Link></li>
            <li><Link to="/Wish">Favorites / 나의 찜 목록</Link></li>
            <li><Link to="/MyDelivery">Delivery / 배송 상황</Link></li>
            <li><Link to="/refrigerator">Fridge / 나의 냉장고</Link></li>
            <li><Link to="/Payment">Payment / 결제수단</Link></li>
            <li><Link to="/orderhistory">History / 주문 내역</Link></li>
          </ul>
        </div>
      </div>
      <div className="refrigerator-container">
        <div className="refrigerator-header">
          <div className="refrigerator-font">
            <h1>Fridge / 나의 냉장고</h1>
          </div>
        </div>
        <div className="refrigerator-content">
          <table className="refrigerator-table">
            <thead>
              <tr>
                <th>상품</th>
                <th>상품명</th>
                <th>수량</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {keepItems.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.image} alt={item.name} /></td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button className="action-button" onClick={() => handleModalOpen(item)}>Manage</button>
                    <button className="action-button" onClick={() => handlePickup(item)}>PICKUP</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <KeepModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          fridgeIdx={selectedItem.fridgeIdx}
        />
      )}
    </div>
  );
};

export default RefrigeratorComponent;
