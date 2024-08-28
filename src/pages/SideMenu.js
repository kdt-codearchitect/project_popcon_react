import { Link, useLocation } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = () => {
    const location = useLocation();

    const getTitle = () => {
        switch(location.pathname) {
            case '/MyPage': return '마이페이지';
            case '/MyInfo': return '개인정보수정';
            case '/Wish': return '나의 찜 목록';
            case '/MyDelivery': return '배송 상황';
            case '/refrigerator': return '나의 냉장고';
            case '/orderhistory': return '주문 내역';
            default: return '마이페이지';
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? 'side-menu-active' : '';
    };

    return (
        <div className="mypage-sidebar">
            <div className="sidebar-top">
                <div className="sidebar-title">
                    <h1>{getTitle()}</h1>
                </div>
            </div>
            <div className="sidebar-bot">
                <div className={`sidebar-menu-box ${isActive('/MyPage')}`}>
                    <Link to="/MyPage"><p>MyPage</p><p> / </p><p>마이페이지</p></Link>
                </div>
                <div className={`sidebar-menu-box ${isActive('/MyInfo')}`}>
                    <Link to="/MyInfo"><p>MyInfo</p><p> / </p><p>개인정보수정</p></Link>
                </div>
                <div className={`sidebar-menu-box ${isActive('/Wish')}`}>
                    <Link to="/Wish"><p>Favorites</p><p> / </p><p>나의 찜 목록</p></Link>
                </div>
                {/* <div className={`sidebar-menu-box ${isActive('/refrigerator')}`}>
                    <Link to="/refrigerator"><p>Fridge</p><p> / </p><p>나의 냉장고</p></Link>
                </div> */}
                <div className={`sidebar-menu-box ${isActive('/orderhistory')}`}>
                    <Link to="/orderhistory"><p>History</p><p> / </p><p>주문 내역</p></Link>
                </div>
            </div>
        </div>
    )
}

export default SideMenu;