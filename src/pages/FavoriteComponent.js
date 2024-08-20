import React, { useEffect, useState } from 'react';
import './FavoriteComponent.css'; 
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import deleteIcon from "../image/Delete.png"; 
import SideMenu from './SideMenu';

const FavoriteComponent = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null); // 초기화 추가
  const [token, setToken] = useState(null); // 초기화 추가
  const navigate = useNavigate();

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);

      axios.get(`http://localhost:8090/popcon/Wish/${storedCustomerIdx}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        setFavoriteItems(response.data);
      })
      .catch(error => {
        console.error('상품 정보를 불러오는 중에 오류가 발생 했습니다!', error);
      });
    }
  }, []); // useEffect 내부 블록 닫힘 추가

  const handleRemove = (wishItemIdx) => {
    console.log('Removing wish item with ID:', wishItemIdx);
    axios.delete(`http://localhost:8090/popcon/Wish/delete/${wishItemIdx}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      setFavoriteItems(prevItems => prevItems.filter(item => item.wishItemIdx !== wishItemIdx));
    })
    .catch(error => {
      console.error('제품 데이터를 삭제하는 데 오류가 발생했습니다.', error);
    });
  };

  const handleMoveToCart = (wishItemIdx) => {
    axios.post('http://localhost:8090/popcon/Wish/moveToCart', null, {
      params: {
        wishItemIdx: wishItemIdx,
        cartIdx: customerIdx, // 실제 사용 중인 cartIdx 값으로 대체하세요
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(() => {
      alert('상품이 장바구니로 이동되었습니다.');
      handleRemove(wishItemIdx); // 장바구니로 이동 후 찜 목록에서 제거
    })
    .catch(error => {
      console.error('장바구니로 상품을 이동하는 중에 오류가 발생했습니다.', error);
    });
  };

  return (
    <div className="page-container">
      <SideMenu/>
      <div className="refrigerator-container">
        <div className="refrigerator-header">
          <div className="refrigerator-font">
            <div>
              <h1>Favorites</h1>
              <h2> / 나의 찜 목록</h2>
            </div>
          </div>
        </div>
        <div className="refrigerator-content">
          <table className="refrigerator-table">
            <thead>
              <tr>
                <th>상품</th>
                <th>상품명</th>
                <th>할인여부</th>
                <th>주문액</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {favoriteItems.map((item, index) => (
                <tr key={index}>
                  <td><img src={item.skuBarcode || ''} alt={item.skuName || '상품 이미지'} className="favorites-item-image" /></td>
                  <td>{item.skuName || '상품명 없음'}</td>
                  <td>할인없음</td>
                  <td>{(item.skuCost ? item.skuCost.toLocaleString() : '0')}원</td>
                  <td>
                    <button className="remove-button" onClick={() => handleRemove(item.wishItemIdx)}>
                      <img src={deleteIcon} alt="Delete" className="delete-icon" />
                    </button>
                    <button className="move-to-cart-button" onClick={() => handleMoveToCart(item.wishItemIdx)}>
                      장바구니로 이동
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FavoriteComponent;
