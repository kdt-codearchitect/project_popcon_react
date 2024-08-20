import React, { useState, useEffect } from 'react';
import './RefrigeratorComponent.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import KeepModal from './KeepModal';

const RefrigeratorComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [keepItems, setKeepItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const customerIdx = localStorage.getItem('customerIdx');

  useEffect(() => {
    if (!customerIdx) {
      navigate('/login');
      return;
    }

    const fetchKeeps = async () => {
      const token = localStorage.getItem('jwtAuthToken');
      try {
        const response = await fetch(`http://localhost:8090/popcon/keep/${customerIdx}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch keeps');
        }

        const data = await response.json();

        console.log('Server response:', data); // 서버 응답을 확인

        // 데이터가 배열로 감싸져 있으므로 첫 번째 요소를 사용합니다.
        if (Array.isArray(data) && data.length > 0) {
          const firstKeep = data[0];
          if (firstKeep.keepItems && Array.isArray(firstKeep.keepItems)) {
            const items = firstKeep.keepItems.map(item => ({
              skuIdx: item.skuIdx,
              quantity: item.qty,
              name: `SKU ${item.skuIdx}`, // Name과 Image는 실제 데이터를 사용하거나 기본값으로 설정
              image: 'https://via.placeholder.com/50', // 실제 이미지 URL이 없으면 placeholder 사용
              fridgeIdx: firstKeep.fridgeIdx,
            }));
            setKeepItems(items);
          }
        }

      } catch (error) {
        console.error('Error fetching keeps:', error);
      }
    };

    fetchKeeps();
  }, [customerIdx, navigate]);

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
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
          item={selectedItem}
          customerIdx={customerIdx}
          fridgeIdx={selectedItem.fridgeIdx}
        />
      )}
    </div>
  );
};

export default RefrigeratorComponent;
