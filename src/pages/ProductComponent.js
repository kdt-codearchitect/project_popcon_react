import React from 'react';

import './ProductComponent.css';

const products = [
  { id: 1, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' },
  { id: 2, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' },
  { id: 3, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' },
  { id: 4, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' },
  { id: 5, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' },
  { id: 6, name: '후드집업', price: 117000, imageUrl: 'https://sfgroup.centracdn.net/client/dynamic/images/443_c9425ec032-220862999_1_better.jpg' }
];

const ProductComponent = ({ addToCart}) => {
  console.log("addToCart function:", addToCart);
  
  return (
    <div className="product-grid__wrapper">
      <div className="product-grid__wrap">
        <div className="product-grid__container">
          {products.map((product) => (
            <article key={product.id} className="card">
              <div className="product-card-image">
                <img src={product.imageUrl} alt="Product" />
                <div className="product-card-content">
                  <h3 className="product-card-title">
                    <div className='product-buttons'>
                      <button className="product-button">구매하기</button>
                      <button className="product-button" onClick={() => addToCart(product)}>장바구니</button>
                    </div>
                    <span className="product-name">{product.name}</span>
                    <span className="product-price-wrapper">
                      <span className="product-price-current">
                        {product.price.toLocaleString()}원
                      </span>
                    </span>
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
