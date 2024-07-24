import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState } from 'react';
import HomeComponent from "./pages/HomeComponent";
import ProductComponent from "./pages/ProductComponent";
import ProductComponent2 from "./pages/ProductComponent2";
import ProductComponent3 from "./pages/ProductComponent3";
import RefrigeratorComponent from "./pages/RefrigeratorComponent";
import OrderHistoryComponent from "./pages/OrderHistoryComponent";
import Cart from "./pages/Cart";
import FavoriteComponent from "./pages/FavoriteComponent";
import SignupComponent, { action as signUpAction } from "./pages/SignupComponent";
import LoginComponent, { action as authAction } from "./pages/LoginComponent";
import RootLayout from "./pages/Root";
import ErrorPage from './pages/Error';
import './App.css';

import { tokenLoader } from './util/auth';
import { action as logoutAction } from './pages/Logout';

import ListTodosComponent, { loader as todosLoader } from "./pages/ListTodosComponent";
import AddTodoComponent, { action as addTodoAction } from "./pages/AddTodoComponent";
import UpdateTodoComponent, { loader as updateTodoLoader, action as updateTodoAction } from "./pages/UpdateTodoComponent";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [refrigeratorItems, setRefrigeratorItems] = useState([
    { id: 1, name: "Product 1", image: "https://via.placeholder.com/50", quantity: 2 },
    { id: 2, name: "Product 2", image: "https://via.placeholder.com/50", quantity: 5 },
    { id: 3, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 4, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 5, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 6, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 7, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 8, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 9, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 10, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 11, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 12, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 13, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 14, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 15, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 },
    { id: 16, name: "Product 3", image: "https://via.placeholder.com/50", quantity: 3 }
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
    // 예시 재고 데이터
    const stock = {
      1: 5, // productId: 재고 수량
      2: 0, // 재고가 없는 경우
      3: 10,
      // 다른 제품들...
    };

    cartItems.forEach((item) => {
      const availableStock = stock[item.id] || 0;
      if (availableStock < item.quantity) {
        const shortage = item.quantity - availableStock;
        moveToRefrigerator(item, shortage);
      }
    });

    // 결제 성공으로 간주하고 장바구니 비우기 (필요시 실제 결제 로직 추가)
    setCartItems([]);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      id: 'tokenRoot',
      loader: tokenLoader,
      children: [
        { path: '/', element: <HomeComponent /> },
        { path: '/signup', element: <SignupComponent />, action: signUpAction },
        { path: '/login', element: <LoginComponent />, action: authAction },
        { path: '/product', element: <ProductComponent addToCart={addToCart}  addToFavorites={addToFavorites}/> },
        { path: '/product2', element: <ProductComponent2 addToCart={addToCart}  addToFavorites={addToFavorites}/> },
        { path: '/product3', element: <ProductComponent3 addToCart={addToCart}  addToFavorites={addToFavorites} /> },
        { path: '/refrigerator', element: <RefrigeratorComponent products={refrigeratorItems} /> },
        { path: '/orderhistory', element: <OrderHistoryComponent  /> },
        { path: '/favorites', element: <FavoriteComponent favoriteItems={favoriteItems} removeFromFavorites={removeFromFavorites} /> },
        { path: '/cart', element: <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} handleCheckout={handleCheckout} /> },
        { path: '/logout', action: logoutAction },
        { path: '/todos', element: <ListTodosComponent />, loader: todosLoader },
        { path: '/addTodo', element: <AddTodoComponent />, action: addTodoAction },
        { path: '/updateTodo/:id', element: <UpdateTodoComponent />, loader: updateTodoLoader, action: updateTodoAction }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
