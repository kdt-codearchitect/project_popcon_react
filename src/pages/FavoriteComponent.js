import React from 'react';
import './FavoriteComponent.css';
import deleteIcon from '../image/Delete.png'; // Delete.png 파일 경로

const FavoriteComponent = ({ favoriteItems, removeFromFavorites }) => {
  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <div className="favorites-font">
          <h1>Favorites / 나의 찜 목록</h1>
        </div>
      </div>
      {favoriteItems.length === 0 ? (
        <p>찜한 상품이 없습니다.</p>
      ) : (
        <table className="favorites-table">
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
            {favoriteItems.map(item => (
              <tr key={item.id}>
                <td className="image-cell">
                  <img src={item.image} alt={item.name} className="favorites-item-image" />
                </td>
                <td>{item.name}</td>
                <td>할인없음</td>
                <td>{item.price.toLocaleString()}원</td>
                <td>
                  <button className="remove-button" onClick={() => removeFromFavorites(item.id)}>
                    <img src={deleteIcon} alt="삭제" className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FavoriteComponent;
