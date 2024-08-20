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
                    <Link to="/MyInfo"><span>MyInfo</span><span><span> / </span></span>개인정보수정<span></span></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/Wish"><span>Favorites</span><span> / </span><span>나의 찜 목록</span></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/MyDelivery"><span>Delivery</span><span> / </span><span>배송 상황</span></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/refrigerator"><span>Fridge</span><span> / </span><span>나의 냉장고</span></Link>
                </div>
                <div className='sidebar-menu-box'>
                    <Link to="/orderhistory"><span>History</span><span> / </span><span>주문 내역</span></Link>
                </div>
            </div>
        </div>

    )
}

export default SideMenu;