import React, { useEffect, useState } from 'react';
import './FavoriteComponent.css'; 
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import deleteIcon from "../image/Delete.png"; 
import SideMenu from './SideMenu';

const FavoriteComponent = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_BASE_URL;

  // 데이터 조회 함수
  const fetchFavoriteItems = () => {
    if (customerIdx && token) {
      axios.get(`${url}/wish/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setFavoriteItems(response.data);
      })
      .catch(error => {
        console.error('상품 정보를 불러오는 중에 오류가 발생 했습니다!', error);
      });
    }
  };

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetchFavoriteItems();
  }, [customerIdx, token]); // customerIdx와 token이 설정된 후 데이터 조회

  const handleRemove = (wishItemIdx) => {
    axios.delete(`${url}/wish/delete/${wishItemIdx}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      console.log("즐겨찾기에서 제품이 지워졌습니다!");
      fetchFavoriteItems(); // 최신 데이터를 다시 조회하여 반영
    })
    .catch(error => {
      console.error('제품 데이터를 삭제하는 데 오류가 발생했습니다.', error);
    });
  };

  const handleMoveToCart = (wishItemIdx) => {
    axios.post(`${url}/wish/moveToCart`, null, {
      params: {
        wishItemIdx: wishItemIdx,
        cartIdx: customerIdx,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(() => {
      alert('상품이 장바구니로 이동되었습니다.');
      console.log("즐겨찾기 제품이 장바구니로 옮겨졌습니다!");
      fetchFavoriteItems(); // 최신 데이터를 다시 조회하여 반영
    })
    .catch(error => {
      console.error('장바구니로 상품을 이동하는 중에 오류가 발생했습니다.', error);
    });
  };

  return (
    <div className="page-container">
      <SideMenu/>
      <div className="favorite-container">
        <div className="favorite-header">
          <div className="favorite-font">
            <h1>Favorites / 나의 찜 목록</h1>
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
                  <td><img src={`${item.skuName}.jpg`} alt={item.skuName || '상품 이미지'} className="favorites-item-image" /></td>
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
