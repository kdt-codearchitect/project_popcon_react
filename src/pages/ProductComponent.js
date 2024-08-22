import React, { useState, useEffect, useRef } from 'react';
import './ProductComponent.css';
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const elementRef = useRef(null);

  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭의 인덱스를 저장
  const [skuTypeIdx, setSkuTypeIdx] = useState(1000); // 선택된 skuTypeIdx를 저장

  const url = process.env.REACT_APP_API_BASE_URL;
  const imgSrc = '../image/item_image/'

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    // customerIdx와 token을 상태에 저장
    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);
      // console.log('Stored customerIdx:', storedCustomerIdx);
      // console.log('Stored token:', storedToken);
    }
  }, []);

  const fetchMoreItems = async () => {
    console.log("현제 page : ", page)
    try {
      const response = await axios.get(
        skuTypeIdx !== 1000
        ? `${url}/sku/type/${skuTypeIdx}/${page * 12}`
        : `${url}/sku/${page * 12}`
      );
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        // 기존 데이터와 새로운 데이터를 합칩니다.
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('제품을 가져오는 데 실패했습니다.', error);
    }
  };

  useEffect(()=>{
    console.log("products : ", products)
  },[products])
  
  useEffect(() => {
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
  }, [hasMore, page]);
  
  useEffect(() => {
    // skuTypeIdx가 변경될 때마다 제품을 초기화하고 새 데이터 요청
    if (skuTypeIdx !== null) {
      setProducts([]);
      setPage(0);
      setHasMore(true);
      console.log("탭변경 후 page : ", page)
    }
  }, [skuTypeIdx]);
  
  const handleTabClick = (index, skuType) => {
    setActiveTab(index);
    setSkuTypeIdx(skuType); // skuTypeIdx 업데이트
  };
  

  const handleAddToCart = async (product) => {
    if (!customerIdx) {
      console.log('로그인이 필요합니다.');
      return;
    }
    
    // console.log('Adding to cart with token:', token);
    
    let promotionValue = 1;
    
    if(product.promotionIdx===2){
      promotionValue = 2;
    }else if(product.promotionIdx===3){
      promotionValue = 3;
    }
    
    const cartItem = {
      skuIdx: product.skuIdx,
      skuValue: promotionValue,
      customerIdx: customerIdx,
      cartIdx: customerIdx // 이 예제에서는 customerIdx와 cartIdx가 동일하다고 가정
    };
    
    try {
      const response = await fetch(url+'/sku/addToCart', {
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
        console.log("cartItem : ", cartItem)
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
      const response = await fetch(url+'/wish/add', {
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
            <li className={activeTab === 0 ? 'product-nav-uderbar thema-font-01' : ''} onClick={() => handleTabClick(0, 1000)}>전체목록</li>
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
                {product.favorite === 0 && <button className="product-button" onClick={() => handleAddToWishlist(product)}><FaRegHeart /></button>}
                {product.favorite !== 0 && <button className="product-button-red" onClick={() => handleAddToWishlist(product)}><FaHeart /></button>}
                {product.promotionIdx === 1 && <label className="opo flex-c">1+1</label>}
                {product.promotionIdx === 2 && <label className="tpo flex-c">2+1</label>}
                <img src={imgSrc+product.skuName+'.jpg'} alt={product.skuName} />
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
          {hasMore && (
            <div ref={elementRef}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;