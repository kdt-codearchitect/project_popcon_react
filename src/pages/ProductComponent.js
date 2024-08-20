import React, { useState, useEffect, useRef } from 'react';
import './ProductComponent.css';
import axios from 'axios';

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const elementRef = useRef(null);

  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭의 인덱스를 저장
  const [skuTypeIdx, setSkuTypeIdx] = useState(null); // 선택된 skuTypeIdx를 저장

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    // customerIdx와 token을 상태에 저장
    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      console.log('Stored customerIdx:', storedCustomerIdx);
      console.log('Stored token:', storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchMoreItems = async () => {
      try {
        const response = await axios.get(
          skuTypeIdx !== null
            ? `http://localhost:8090/popcon/Sku/type/${skuTypeIdx}/${page * 12}`
            : `http://localhost:8090/popcon/Sku/${page * 12}`
        );
  
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...response.data]);
          setPage((prevPage) => prevPage + 1); // 페이지 번호 증가
        }
      } catch (error) {
        console.error('제품을 가져오는 데 실패했습니다.', error);
      }
    };
    
    // 데이터 로드 초기화 및 fetchMoreItems 호출
    setProducts([]);
    setPage(1); // 페이지를 1로 초기화
    setHasMore(true);
    fetchMoreItems();
  
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore) {
        fetchMoreItems();
      }
    });
  
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
  
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [skuTypeIdx, hasMore]);


  const handleTabClick = (index, skuType) => {
    setActiveTab(index);  // 활성화된 탭의 인덱스를 업데이트
    setSkuTypeIdx(skuType);  // 선택된 skuTypeIdx를 업데이트
  };

  const handleAddToCart = async (product) => {
    if (!customerIdx) {
      console.log('로그인이 필요합니다.');
      return;
    }

    console.log('Adding to cart with token:', token);

    const cartItem = {
      skuIdx: product.skuIdx,
      skuValue: 1,
      customerIdx: customerIdx,
      cartIdx: customerIdx // 이 예제에서는 customerIdx와 cartIdx가 동일하다고 가정
    };

    try {
      const response = await fetch('http://localhost:8090/popcon/sku/addToCart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItem)
      });

      if (response.ok) {
        console.log('상품이 장바구니에 성공적으로 담겼습니다');
      } else {
        console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!');
      }
    } catch (error) {
      console.error('상품이 장바구니에 담기면서 문제가 발생했습니다!', error);
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!customerIdx) {
      console.log('로그인이 필요합니다.');
      return;
    }

    console.log('Adding to wishlist with token:', token);

    const wishItem = {
      skuIdx: product.skuIdx,
      customerIdx: customerIdx
    };

    try {
      const response = await fetch('http://localhost:8090/popcon/Wish/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wishItem)
      });

      if (response.ok) {
        console.log('상품이 찜목록에 성공적으로 담겼습니다.');
      } else {
        console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!');
      }
    } catch (error) {
      console.error('찜목록에 상품이 담기면서 오류가 발생했습니다!', error);
    }
  };

  return (
    <div className="productList-container">
      <div className="productList-contents flex-c flex-d-column">
        <nav>
          <ul className="flex-sb">
            <li className={activeTab === 0 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(0, null)}>전체목록</li>
            <li className={activeTab === 1 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(1, 2000)}>즉석요리</li>
            <li className={activeTab === 2 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(2, 3000)}>과자류</li>
            <li className={activeTab === 3 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(3, 4000)}>아이스크림</li>
            <li className={activeTab === 4 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(4, 5000)}>식품</li>
            <li className={activeTab === 5 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(5, 6000)}>음료</li>
            <li className={activeTab === 6 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(6, 7000)}>생활용품</li>
          </ul>
        </nav>
        <div className="productList-box">
          {products.map(product => (
            <div key={product.skuIdx} className="product-card flex-sb flex-d-column">
              <div className="product-img-box flex-c">
              {product.promotionIdx === 1 && <label className="opo flex-c">1+1</label>}
              {product.promotionIdx === 2 && <label className="tpo flex-c">2+1</label>}
                <img src={product.imageUrl} alt={product.skuName} />
              </div>
              <div className='product-title-box'>
                <p>{product.skuName}</p>
              </div>
              <div className="product-price-box flex-sb">
                <p className="product-original-price">{product.skuCost.toLocaleString()}<span>원</span></p>
                <p className="product-event-price">{product.skuCost.toLocaleString()}<span>원</span></p>
              </div>
              <div className="product-button-box flex-sb">
                <button className="thema-btn-01" onClick={() => handleAddToCart(product)}>장바구니</button>
                <button className="thema-btn-02" onClick={() => handleAddToCart(product)}>바로구매</button>
              </div>
            </div>
          ))}
          <div ref={elementRef}></div>
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
