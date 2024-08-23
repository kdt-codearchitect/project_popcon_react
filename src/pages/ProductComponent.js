import React, { useState, useEffect, useRef } from 'react';
import './ProductComponent.css';
import axios from 'axios';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const elementRef = useRef(null);

  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭의 인덱스를 저장
  const [skuTypeIdx, setSkuTypeIdx] = useState(1000); // 선택된 skuTypeIdx를 저장

  const url = process.env.REACT_APP_API_BASE_URL;
  const imgSrc = '../image/item_image/'

  useEffect(() => {
    // localStorage에서 customerIdx와 토큰을 가져옴
    const stoclickCustomerIdx = localStorage.getItem('customerIdx');
    const stoclickToken = localStorage.getItem('jwtAuthToken');

    // customerIdx와 token을 상태에 저장
    if (stoclickCustomerIdx && stoclickToken) {
      setCustomerIdx(stoclickCustomerIdx);
      setToken(stoclickToken);
      // console.log('Stoclick customerIdx:', stoclickCustomerIdx);
      // console.log('Stoclick token:', stoclickToken);
    }
  }, []);

  const fetchMoreItems = async () => {
    console.log("현제 page : ", page)
    try {
      const response = await axios.get(
        skuTypeIdx !== 1000
          ? `${url}/sku/type/${skuTypeIdx}/${page * 12}/${customerIdx}`
          : `${url}/sku/${page * 12}/${customerIdx}`
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

  useEffect(() => {
    console.log("products : ", products)
  }, [products])

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

    if (product.promotionIdx === 2) {
      promotionValue = 2;
    } else if (product.promotionIdx === 3) {
      promotionValue = 3;
    }

    const cartItem = {
      skuIdx: product.skuIdx,
      skuValue: promotionValue,
      customerIdx: customerIdx,
      cartIdx: customerIdx // 이 예제에서는 customerIdx와 cartIdx가 동일하다고 가정
    };


    try {
      const response = await fetch(url + '/cart/sku/addToCart', {
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

    console.log('찜 목록에 추가 중, 토큰:', token);
    console.log("찜할 제품:", product);

    const wishItem = {
      skuIdx: product.skuIdx,
      wishIdx: Number.parseInt(customerIdx, 10)
    };

    try {
      const response = await fetch(`${url}/wish/add/${Number.parseInt(customerIdx, 10)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wishItem)
      });

      if (response.ok) {
        console.log('상품이 찜 목록에 성공적으로 담겼습니다.');

        // 제품 리스트 상태를 업데이트하여 UI에 반영합니다.
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.skuIdx === product.skuIdx
              ? { ...prod, favorite: prod.favorite === 0 ? 1 : prod.favorite } // 0일 때만 1로 변경
              : prod
          )
        );
      } else {
        console.error('찜 목록에 상품을 담는 중 문제가 발생했습니다!');
      }
    } catch (error) {
      console.error('찜 목록에 상품을 담는 중 오류가 발생했습니다!', error);
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
                {product.favorite === 0 && <button className="product-button" onClick={() => handleAddToWishlist(product)}><FaRegStar /></button>}
                {product.favorite !== 0 && <button className="product-button-click" onClick={() => handleAddToWishlist(product)}><FaStar /></button>}
                {product.promotionIdx === 1 && <label className="opo flex-c">1+1</label>}
                {product.promotionIdx === 2 && <label className="tpo flex-c">2+1</label>}
                <img />
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