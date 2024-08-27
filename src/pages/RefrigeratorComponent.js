import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import KeepModal from './KeepModal';
import EmptyRef from './EmptyRef'; // EmptyRef component imported
import axios from 'axios';
import './RefrigeratorComponent.css';
import SideMenu from './SideMenu';

const RefrigeratorComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keepItems, setKeepItems] = useState([]);
  const [cartIdx, setCartIdx] = useState(null); // cartIdx state added
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // customerIdx and token retrieved from localStorage
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');

  const url = process.env.REACT_APP_API_BASE_URL;
  // fetchKeeps function defined inside RefrigeratorComponent
  const fetchKeeps = async () => {
    try {
      const response = await axios.get(url+`/keep/${customerIdx}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 && response.data.length > 0) {
        const firstKeep = response.data[0];
  
        // Group items with the same SKU and sum quantities
        const groupedItems = firstKeep.keepItems.reduce((acc, item) => {
          const existingItem = acc.find(i => i.skuIdx === item.skuIdx);
          if (existingItem) {
            existingItem.quantity += item.qty;
          } else {
            acc.push({
              skuIdx: item.skuIdx,
              quantity: item.qty,
              name: `SKU ${item.skuIdx}`,
              image: 'https://via.placeholder.com/50', // placeholder used if no image URL
              fridgeIdx: firstKeep.fridgeIdx,
              keepItemIdx: item.keepItemIdx, // this field added
            });
          }
          return acc;
        }, []);
  
        setKeepItems(groupedItems);
      }
  
    } catch (error) {
      console.error('Error fetching keeps:', error);
    }
  };

  useEffect(() => {
    if (!customerIdx || !token) {
      navigate('/login');
      return;
    }

    const fetchCartIdx = async () => {
      try {
        const response = await axios.get(url+`/cart/customer/${customerIdx}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200 && response.data.length > 0) {
          const cartData = response.data[0];
          setCartIdx(cartData.cartIdx); // cartIdx set
        }

      } catch (error) {
        console.error('Error fetching cartIdx:', error);
      }
    };

    fetchCartIdx(); // fetch cartIdx function called
    fetchKeeps(); // fetch Keep Items function called

    // If redirected after payment, open modal automatically
    if (location.state?.openModal) {
      setModalOpen(true);
    }
  }, [customerIdx, token, navigate, location.state]);

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    // Fetch Keep Items again after modal closes.
    fetchKeeps();
  };

  const handlePickup = async (item) => {
    if (!cartIdx) {
      console.error('cartIdx is not set.');
      return;
    }
  
    // Do not handle if quantity is 0 or less
    if (item.quantity <= 0) {
      alert('There is no more quantity available for pickup.');
      return;
    }
  
    try {
      const response = await axios.post(url+'/cart/moveToCart', null, {
        params: {
          keepItemIdx: item.keepItemIdx,
          cartIdx: cartIdx,
          quantity: 1 // Pick up one at a time
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        alert('Item moved to cart.');
  
        // Since one quantity was picked up, subtract one from the remaining quantity
        setKeepItems(prevItems => 
          prevItems.map(i => 
            i.keepItemIdx === item.keepItemIdx 
              ? { ...i, quantity: i.quantity - 1 } 
              : i
          ).filter(i => i.quantity > 0) // Remove from list if quantity is 0
        );
      }
    } catch (error) {
      console.error('Error moving item to cart.', error);
      alert('Error moving item to cart.');
    }
  };

  return (
    <div className="page-container">
      <SideMenu/>
      <div className="refrigerator-container">
        <div className="refrigerator-header">
          <div className="refrigerator-font">
            <h1>Fridge / 나의 냉장고</h1>
          </div>
        </div>
        <div className="refrigerator-content">
          {keepItems.length === 0 ? (
            <EmptyRef />
          ) : (
            <table className="refrigerator-table">
              <thead>
                <tr>
                  <th>상품</th>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {keepItems.map((item, index) => (
                  <tr key={index}>
                    <td><img src={item.image} alt={item.name} /></td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button className="action-button" onClick={() => handleModalOpen(item)}>Manage</button>
                      <button className="action-button" onClick={() => handlePickup(item)}>PICKUP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedItem && (
        <KeepModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          fridgeIdx={selectedItem.fridgeIdx}
        />
      )}
    </div>
  );
};

export default RefrigeratorComponent;