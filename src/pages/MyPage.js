import React, { useEffect, useState } from 'react';
import './MyPage.css';
import { Link, useNavigate } from "react-router-dom";
import SideMenu from './SideMenu';
import cart from '../image/mypage_cart.png';
import checkouts from '../image/mypage_checkouts.png';
import delivery from '../image/mypage_delivery.png';
import fridge from '../image/mypage_fridge.png';
import profile from '../image/mypage_profile.png';





const MyPage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const url = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    
    const fetchMembers = async () => {
      try {
        const response = await fetch(url+'/MyPage');  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setUserList(json);
      } catch (error) {
        console.error("There was an error fetching the members!", error);
      }
    };

    fetchMembers();
  }, []);
  console.log(localStorage.getItem('customerIdx'));
  console.log(localStorage.getItem('userid'));
  return (

    <div className="page-container black-bg">
    <div className="page-container">
      <SideMenu/>
      <div className="section-container">
        <div className="mypage-header">
          <div className="section-font">
            <h1>My Page</h1>
          </div>
        </div>
        <div className="section-content">
          <div className="">
            
          <div>
            <img src={profile} className='mypage-icon'/>
            <img src={cart} className='mypage-icon'/>
            <img src={delivery} className='mypage-icon'/>
            <img src={fridge} className='mypage-icon'/>
            <img src={checkouts} className='mypage-icon'/>
          </div>
            <ul>
              {userList.map(member => (
                <li key={member.id}>
                  {member.name} ({member.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
