import { Link } from "react-router-dom";
import './Header.css';
import React from "react";
import LoginModal from "../pages/LoginModal";
import {useRef} from 'react'

function Header() {

    const xxx = useRef(null)

    function show_modal(){
    xxx.current.modal_open();
  }

    return (

        <header>
        <div class="header-container">
            <div class="header-top-box flex-sb">
                <Link to="/">
                    <div class="header-logo flex-c">
                        <img src="./images/store_image/PopconB.png" alt=""/>
                        <img src="./images/store_image/popcon_logo3.png" alt=""/>
                    </div>
                </Link>
                <div class="header-mymenu flex-sa">
                    <a href="#" onClick={show_modal}>로그인</a>
                    <a href="#">고객센터</a>
                    <LoginModal ref={xxx}/>
                </div>
            </div>
            <div class="header-bottom-box">
                <div class="header-search-box flex-c">
                    <input type="text"/>
                </div>
                <nav>
                    <ul class="flex-sa">
                        <li><Link to="/MyPage">마이페이지</Link></li>
                        <li><Link to="/Sku">1 + 1</Link></li>
                        <li><Link to="/product2">2 + 1</Link></li>
                        <li><Link to="/usersAdd">이벤트</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    );
}

export default Header;
