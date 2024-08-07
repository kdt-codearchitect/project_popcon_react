import { Link, useRouteLoaderData, Form } from "react-router-dom";
import './Header.css';
import React from "react";
import LoginModal from "../pages/LoginModal";
import {useRef} from 'react';
import PopconB from '../image/store_image/PopconB.png';
import popcon_logo3 from '../image/store_image/popcon_logo3.png';

function Header() {

    const token = useRouteLoaderData('tokenRoot');
    console.log("MainNavigation.token", token);

    const xxx = useRef(null)

    function show_modal(){
    xxx.current.modal_open();
  }

    return (

        <header>
            <div className="header-container">
                <div className="header-top-box flex-sb">
                    <Link to="/">
                        <div className="header-logo flex-c">
                            <img src={PopconB} alt=""/>
                            <img src={popcon_logo3} alt=""/>
                        </div>
                    </Link>
                    <div className="header-mymenu flex-sa">

                        { !token && 
                            <a href="#" onClick={show_modal}>로그인</a>
                        }

                        { token && <Form action="/logout" method="post">
                                <button className='btn btn-success' >Logout</button>
                                </Form>
                        }

                        <Link to="/faq">고객센터</Link>
                        <LoginModal ref={xxx}/>
                    </div>
                </div>
                <div className="header-bottom-box">
                    <div className="header-search-box flex-c">
                        <input type="text"/>
                    </div>
                    <nav>
                        <ul className="flex-sa">
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
