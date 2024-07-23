import { Link } from "react-router-dom";
import './Header.css';
import React from "react";

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-top">
                    <div className="header-logo">
                        <Link to="/">
                            <img src={'../image/PopConB.png'} alt="PopConB.png" />
                        </Link>
                        <span className="brand">POP<span className="highlight">CON</span></span>
                    </div>
                    <nav className="header-mymenu">
                        <Link to="/login" className="nav-link">로그인</Link>
                        <Link to="/customer" className="nav-link">고객센터</Link>
                    </nav>
                </div>
                <div className="header-bottom-box">
                    <div className="header-search-box">
                        <input type="text" placeholder="Search" />
                        <button type="submit">Q</button>
                    </div>
                    <nav className="header-bottom-nav">
                        <ul className="nav-links">
                            <li><Link to="/MyPage">마이페이지</Link></li>
                            <li><Link to="/usersSearch">Search</Link></li>
                            <li><Link to="/product">1 + 1</Link></li>
                            <li><Link to="/product2">2 + 1</Link></li>
                            <li><Link to="/product3">할인</Link></li>
                            <li><Link to="/refrigerator">냉장고</Link></li>
                            <li><Link to="/orderhistory">구매내역</Link></li>
                            <li><Link to="/usersAdd">덤증정</Link></li>
                            <li><Link to="/usersAdd">이벤트</Link></li>
                            <li><Link to="/cart">장바구니</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
