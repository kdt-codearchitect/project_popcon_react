import React from 'react';
import './RefrigeratorComponent.css';

const RefrigeratorComponent = ({ products }) => {
  return (
    <div className="refrigerator">
      <div className="refrigerator-header">
        <h1>Fridge</h1>
        <h2>나의 냉장고</h2>
        <p>냉장고 상품 추가는 결제 페이지 진행 전에 한 번 물어보는 방식으로 진행하자</p>
      </div>
      <table className="refrigerator-table">
        <thead>
          <tr>
            <th>상품</th>
            <th>상품명</th>
            <th>수량</th>
            <th>픽업</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td><img src={product.image} alt={product.name} /></td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td><button className="pickup-button">PickUp</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RefrigeratorComponent;
