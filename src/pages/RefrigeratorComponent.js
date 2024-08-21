import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import KeepModal from './KeepModal';
import axios from 'axios';
import './RefrigeratorComponent.css';

const RefrigeratorComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keepItems, setKeepItems] = useState([]);
  const [cartIdx, setCartIdx] = useState(null); // cartIdx 상태 추가
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // customerIdx와 token을 localStorage에서 가져옴
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');

  const url = process.env.REACT_APP_API_BASE_URL;

  // fetchKeeps 함수를 RefrigeratorComponent 내부에서 정의
  const fetchKeeps = async () => {
    try {
      const response = await axios.get(url+`/keep/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 && response.data.length > 0) {
        const firstKeep = response.data[0];
  
        // 동일한 SKU를 가진 항목들을 그룹화하고 수량을 합산
        const groupedItems = firstKeep.keepItems.reduce((acc, item) => {
          const existingItem = acc.find(i => i.skuIdx === item.skuIdx);
          if (existingItem) {
            existingItem.quantity += item.qty;
          } else {
            acc.push({
              skuIdx: item.skuIdx,
              quantity: item.qty,
              name: `SKU ${item.skuIdx}`,
              image: 'https://via.placeholder.com/50', // 이미지 URL이 없을 때 placeholder 사용
              fridgeIdx: firstKeep.fridgeIdx,
              keepItemIdx: item.keepItemIdx, // 이 필드 추가
            });
          }
          return acc;
        }, []);
  
        setKeepItems(groupedItems);
      }
  
    } catch (error) {
      console.error('Error fetching keeps:', error);
    }
  };

  useEffect(() => {
    if (!customerIdx || !token) {
      navigate('/login');
      return;
    }

    const fetchCartIdx = async () => {
      try {
        const response = await axios.get(url+`/cart/customer/${customerIdx}`, {
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
    fetchKeeps(); // Keep Items를 가져오는 함수 호출

    // 결제 후 리디렉션되어 온 경우, 모달을 자동으로 열기
    if (location.state?.openModal) {
      setModalOpen(true);
    }
  }, [customerIdx, token, navigate, location.state]);

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    // 모달이 닫힌 후 Keep Items를 다시 불러옵니다.
    fetchKeeps();
  };

  const handlePickup = async (item) => {
    if (!cartIdx) {
      console.error('cartIdx가 설정되지 않았습니다.');
      return;
    }
  
    // 수량이 0 이하인 경우 처리하지 않음
    if (item.quantity <= 0) {
      alert('더 이상 픽업할 수 있는 수량이 없습니다.');
      return;
    }
  
    try {
      const response = await axios.post(url+'/cart/moveToCart', null, {
        params: {
          keepItemIdx: item.keepItemIdx,
          cartIdx: cartIdx,
          quantity: 1 // 한 번에 하나씩 픽업
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        alert('아이템이 장바구니로 이동되었습니다.');
  
        // 수량 하나를 픽업했으므로, 남은 수량을 1 줄임
        setKeepItems(prevItems => 
          prevItems.map(i => 
            i.keepItemIdx === item.keepItemIdx 
              ? { ...i, quantity: i.quantity - 1 } 
              : i
          ).filter(i => i.quantity > 0) // 수량이 0이 되면 목록에서 제거
        );
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
