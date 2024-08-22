import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = () => {


    return (

        <div className="mypage-sidebar">
            <div className="sidebar-top">
                <div className="sidebar-title">
                    <h1>마이페이지</h1>
                </div>
            </div>
            <div className="sidebar-bot">
                <div className='sidebar-menu-box'>
                    <Link to="/MyInfo"><p>MyInfo</p><p> / </p><p>개인정보수정</p></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/Wish"><p>Favorites</p><p> / </p><p>나의 찜 목록</p></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/MyDelivery"><p>Delivery</p><p> / </p><p>배송 상황</p></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/refrigerator"><p>Fridge</p><p> / </p><p>나의 냉장고</p></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/orderhistory"><p>History</p><p> / </p><p>주문 내역</p></Link>
                </div>
            </div>
        </div>

    )
}

export default SideMenu;