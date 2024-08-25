import React, { useEffect, useState } from 'react';
import './MyPage.css';
import { Link, useNavigate } from "react-router-dom";
import SideMenu from './SideMenu';

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
    <div className="page-container">
      <SideMenu/>
      <div className="section-container">
        <div className="mypage-header">
          <div className="section-font">
            <h1>My Page / 나의 정보</h1>
          </div>
        </div>
        <div className="section-content">
          <div className="mypage-info">
            
            <h2>All Members</h2>
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
