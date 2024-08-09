import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeComponent from "./pages/HomeComponent";
import ProductComponent from "./pages/ProductComponent";
import ProductComponent2 from "./pages/ProductComponent2";
import ProductComponent3 from "./pages/ProductComponent3";
import RefrigeratorComponent from "./pages/RefrigeratorComponent";
import OrderHistoryComponent from "./pages/OrderHistoryComponent";
import MyInfo from "./pages/MyInfo";
import Cart from "./pages/Cart";
import MyPage from "./pages/MyPage";
import FavoriteComponent from "./pages/FavoriteComponent";
import SignupComponent from "./pages/SignupComponent";
import LoginComponent from "./pages/LoginComponent";
import CheckoutComponent from './pages/CheckoutComponent';
import RootLayout from "./pages/Root";
import ErrorPage from './pages/Error';
import './App.css';

const App = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    phone: {
      part1: '',
      part2: '',
      part3: ''
    },
    email: '',
    address: ''
  });

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
  };

  const [cartItems, setCartItems] = useState([]);
  const [refrigeratorItems, setRefrigeratorItems] = useState([
    { id: 1, name: "Product 1", image: "https://via.placeholder.com/50", quantity: 2 },
  ]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  const moveToRefrigerator = (product, quantity) => {
    setRefrigeratorItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const addToFavorites = (product) => {
    setFavoriteItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromFavorites = (productId) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    const stock = {
      1: 5,
      2: 0,
      3: 10,
    };

    cartItems.forEach((item) => {
      const availableStock = stock[item.id] || 0;
      if (availableStock < item.quantity) {
        const shortage = item.quantity - availableStock;
        moveToRefrigerator(item, shortage);
      }
    });

    setCartItems([]);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/', element: <HomeComponent /> },
        { path: '/signup', element: <SignupComponent /> },
        { path: '/login', element: <LoginComponent /> },
        { path: '/Sku', element: <ProductComponent addToCart={addToCart} addToFavorites={addToFavorites} /> },
        { path: '/product2', element: <ProductComponent2 addToCart={addToCart} addToFavorites={addToFavorites} /> },
        { path: '/product3', element: <ProductComponent3 addToCart={addToCart} addToFavorites={addToFavorites} /> },
        { path: '/refrigerator', element: <RefrigeratorComponent products={refrigeratorItems} /> },
        { path: '/PayOrder', element: <CheckoutComponent cartItems={cartItems} userInfo={userInfo} /> },
        { path: '/MyInfo', element: <MyInfo userInfo={userInfo} updateUserInfo={updateUserInfo} /> },
        { path: '/MyPage', element: <MyPage userInfo={userInfo} setUserInfo={setUserInfo} /> },
        { path: '/orderhistory', element: <OrderHistoryComponent /> },
        { path: '/Wish', element: <FavoriteComponent favoriteItems={favoriteItems} removeFromFavorites={removeFromFavorites} /> },
        { path: '/Cart', element: <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} handleCheckout={handleCheckout} /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
