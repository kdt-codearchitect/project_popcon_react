import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerIdx, setCustomerIdx] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleOrder = () => {
    // "KEEP"에서 온 상품이 있는지 확인
    const hasKeepItems = cartItems.some(item => item.isFromKeep);

    if (!hasKeepItems) {
      // Alert를 띄우고 사용자 선택에 따라 이동
      const userChoice = window.confirm("킵하신 상품을 가져가시겠습니까?");
      if (userChoice) {
        navigate('/refrigerator');
      } else {
        navigate('/checkout');
      }
    } else {
      navigate('/checkout');
    }
  };

  useEffect(() => {
    const storedCustomerIdx = localStorage.getItem('customerIdx');
    const storedToken = localStorage.getItem('jwtAuthToken');

    if (storedCustomerIdx && storedToken) {
      setCustomerIdx(storedCustomerIdx);
      setToken(storedToken);

      axios.get(`http://localhost:8090/popcon/cart/customer/${storedCustomerIdx}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('API 응답 데이터:', response.data); // 전체 응답 데이터 확인

          const items = response.data.flatMap(cart => cart.cartItems.map(item => ({
            ...item,
            cartIdx: cart.cartIdx,
            customerIdx: cart.customerIdx,
            skuIdx: item.skuIdx,  // SKU Index를 명시적으로 설정
            isFromKeep: item.keepCost !== null  // keepCost가 null이 아니면 Keep에서 넘어온 것으로 구분
          })));

          console.log('생성된 Cart Items:', items); // 생성된 cartItems 확인
          setCartItems(items);
        })
        .catch(error => {
          console.error('카트에 제품 데이터를 가져오는 데 오류가 발생했습니다', error);
        });
    } else {
      console.error('로그인 정보가 없습니다. customerIdx 또는 token을 찾을 수 없습니다.');
    }
  }, []);

  const removeFromCart = (cartItemIdx) => {
    axios.delete(`http://localhost:8090/popcon/cart/cartitem/${cartItemIdx}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setCartItems(cartItems.filter(item => item.cartItemIdx !== cartItemIdx));
      })
      .catch(error => {
        console.error('제품 데이터를 삭제하는 데 오류가 발생했습니다.', error);
      });
  };

  const updateQuantity = (cartItemIdx, skuValue) => {
    axios.put(`http://localhost:8090/popcon/cart/cartitem/${cartItemIdx}/quantity`, { skuValue }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setCartItems(cartItems.map(item => item.cartItemIdx === cartItemIdx ? { ...item, skuValue } : item));
      })
      .catch(error => {
        console.error('수량 설정하는 데 에러가 발생했습니다.', error);
      });
  };

  const calculateItemCost = (item) => {
    return item.isFromKeep ? item.keepCost : item.skuCost * item.skuValue;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemCost(item), 0);
  };

  const handleQuantityChange = (cartItemIdx, event) => {
    const newQuantity = event.target.value;
    if (newQuantity >= 0) {
      updateQuantity(cartItemIdx, newQuantity);
    }
  };

  const handleIncrement = (cartItemIdx) => {
    const item = cartItems.find(item => item.cartItemIdx === cartItemIdx);
    const newQuantity = item.skuValue + 1;
    updateQuantity(cartItemIdx, newQuantity);
  };

  const handleDecrement = (cartItemIdx) => {
    const item = cartItems.find(item => item.cartItemIdx === cartItemIdx);
    const newQuantity = item.skuValue > 1 ? item.skuValue - 1 : 1;
    updateQuantity(cartItemIdx, newQuantity);
  };

  const moveToCart = (keepItemIdx, cartIdx, quantity) => {
    axios.post(`http://localhost:8090/popcon/cart/moveToCart`, null, {
      params: {
        keepItemIdx: keepItemIdx,
        cartIdx: cartIdx,
        quantity: quantity
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        console.log(response.data);
        // 필요한 경우, UI 갱신
    })
    .catch(error => {
        console.error('Error moving item to cart:', error);
    });
  };

  const handleMoveToCart = (keepItemIdx, cartIdx) => {
    const quantity = prompt('Enter the quantity to move to cart:');
    if (quantity > 0) {
        moveToCart(keepItemIdx, cartIdx, quantity);
    } else {
        alert('Invalid quantity');
    }
  };

  return (
      <div className="cart-container flex-sb flex-d-column">
          <div className="cart-list flex-c flex-d-column">
              <div className="cart-list-title flex-sa">
                  <div className="list-checkbox-box"></div>
                  <p className="list-title-img">상품</p>
                  <p className="list-title-box">상품명</p>
                  <p className="list-stack-box">수량</p>
                  <p className="list-cancel-box">취소</p>
                  <p className="list-cart-box">Cart</p>  {/* SKU에서 온 상품을 위한 칸 */}
                  <p className="list-keep-box">냉장고</p>  {/* Keep에서 온 상품을 위한 칸 */}
                  <p className="list-price-box">주문액</p>
              </div>

              {cartItems.map((item) => (
                <div className="cart-list-item flex-sa" key={item.cartItemIdx}>
                    <div className="list-checkbox-box flex-c">
                        <input type="checkbox"/>
                    </div>
                    <div className="list-img-box flex-c">
                        <img src={item.skuBarcode} alt={item.skuName}/>
                    </div>
                    <div className="list-title-box">
                        <p>{item.skuName}</p>
                    </div>
                    <div className="list-stack-box flex-c"> 
                        <input type="text" value={item.skuValue} onChange={(event) => handleQuantityChange(item.cartItemIdx, event)}/>
                        <div className="list-stack-btn flex-sb flex-d-culumn">
                            <button onClick={() => handleIncrement(item.cartItemIdx)}><FontAwesomeIcon icon={faCaretUp}/></button>
                            <button onClick={() => handleDecrement(item.cartItemIdx)}><FontAwesomeIcon icon={faCaretDown}/></button>
                        </div>
                    </div>
                    <div className="list-cancel-box flex-c">
                        <button onClick={() => removeFromCart(item.cartItemIdx)}><FontAwesomeIcon icon={faXmark}/></button>
                    </div>
                    <div className="list-cart-box flex-c"> {/* SKU에서 온 상품 */}
                        <p>{!item.isFromKeep ? `${item.skuCost.toLocaleString()}원` : '-'}</p>
                    </div>
                    <div className="list-keep-box flex-c"> {/* Keep에서 온 상품 */}
                        <p>{item.isFromKeep ? `${item.keepCost.toLocaleString()}원` : '-'}</p>
                    </div>
                    <div className="list-price-box flex-c">
                        <p>{calculateItemCost(item).toLocaleString()}원</p>
                    </div>
                </div>
              ))}
          </div>
          <div className="cart-price-top">
              <div className="cart-price-top-text flex-c">
                  <p>총 합계 :</p>
                  <p>{(calculateTotal()).toLocaleString()}원</p>
              </div>
          </div>
          <div className="cart-btn-box flex-sb">
              <button className="thema-btn-01" onClick={handleOrder}>주문하기</button>
              <button className="thema-btn-02">뒤로가기</button>
          </div>
          <div className="cart-price-bot">
              <p>총 합계 :</p>
              <p>{(calculateTotal()).toLocaleString()}원</p>
          </div>
      </div>
  );
};

export default Cart;
