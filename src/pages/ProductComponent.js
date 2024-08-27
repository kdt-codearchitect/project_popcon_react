import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProductComponent.css';
import axios from 'axios';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import LoginModal from './LoginModal';
import Loading from './Loading'; // Loading 컴포넌트를 import 

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const elementRef = useRef(null);

  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭의 인덱스를 저장
  const [skuTypeIdx, setSkuTypeIdx] = useState(1000); // 선택된 skuTypeIdx를 저장
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef(null)

  const url = process.env.REACT_APP_API_BASE_URL;
  const imgSrc = '../image/item_image/'

  function show_modal(){
      modalRef.current.modal_open();
  }

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

  const fetchMoreItems = useCallback(async () => {
    console.log("현재 page : ", page);
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
  }, [page, skuTypeIdx, url, customerIdx]);

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
      console.log('로그인이 필요');
      show_modal(); // 로그인 모달을 띄웁니다.
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
        // 플로팅 텍스트 표시
        setFloatingTexts(prev => ({...prev, [product.skuIdx]: true}));
        setTimeout(() => {
          setFloatingTexts(prev => ({...prev, [product.skuIdx]: false}));
        }, 500);
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
      console.log('로그인이 필요');
      show_modal(); // 로그인 모달을 띄웁니다.
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

        // 제품 리스트 상태를 업데이트하여 UI에 반영
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

  const handleRemove = async (product) => {
    console.log("product.wishIdx : ", customerIdx)
    console.log("product.skuIdx : ", product.skuIdx)
    try {
      const response = await axios.delete(`${url}/wish/delete/${customerIdx}/${product.skuIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204) {
        console.log('상품이 찜 목록에서 성공적으로 삭제되었습니다.');

        // 제품 리스트 상태를 업데이트하여 UI에 반영
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.skuIdx === product.skuIdx
              ? { ...prod, favorite: 0 } // favorite을 0으로 변경
              : prod
          )
        );
      } else {
        console.error('찜 목록에서 상품을 삭제하는 중 문제가 발생했습니다!');
      }
    } catch (error) {
      console.error('찜 목록에서 상품을 삭제하는 중 오류가 발생했습니다!', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // 로딩이 끝난 후 제품조회
      fetchMoreItems();
    }, 1000);

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearTimeout(timer);
  }, []);

  const [floatingTexts, setFloatingTexts] = useState({});

  return (
    <div className="productList-container">

      {isLoading ? (
        <Loading /> // 로딩 중일 때 Loading 컴포넌트를 표시
      ) : (
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
                  {product.favorite === 0 && (
                    <button 
                      className="product-button" 
                      onClick={() => customerIdx ? handleAddToWishlist(product) : show_modal()}
                    >
                      <FaRegStar />
                    </button>
                  )}
                  {product.favorite !== 0 && <button className="product-button-click" onClick={() => handleRemove(product)}><FaStar /></button>}
                  {product.promotionIdx === 1 && <label className="opo flex-c">1+1</label>}
                  {product.promotionIdx === 2 && <label className="tpo flex-c">2+1</label>}
                  <img src={imgSrc+product.skuName+'.jpg'} alt={product.skuName} />
                </div>
                <div className='product-title-box'>
                  <p>{product.skuName}</p>
                </div>
                <div className="product-price-box flex-sb">
                  {/* <p className="product-original-price">{product.skuCost.toLocaleString()}<span>원</span></p> */}
                  <p className="product-original-price"></p>
                  <p className="product-event-price">{product.skuCost.toLocaleString()}<span>원</span></p>
                </div>
                <div className="product-button-box flex-sb">
                  <button 
                    className="thema-btn-01" 
                    onClick={() => customerIdx ? handleAddToCart(product) : show_modal()}
                  >
                    장바구니
                    {floatingTexts[product.skuIdx] && <span className="float-text">+1</span>}
                  </button>
                  <button 
                    className="thema-btn-02" 
                    onClick={() => customerIdx ? handleAddToCart(product) : show_modal()}
                  >
                    바로구매
                  </button>
                </div>

              </div>
            ))}
            {hasMore && (
              <div ref={elementRef}></div>
            )}
            <LoginModal ref={modalRef}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductComponent;