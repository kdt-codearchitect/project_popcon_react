import './FloatingMenu.css';
import { Link } from 'react-router-dom';

const FloatingMenu = () =>{
    
    return(
        <div className="floating-menu flex-sa flex-d-column">
            <div className="floating-menu-top flex-c flex-d-column">
                <i className="fas fa-caret-up"></i>
                <a href="#" className="font-w-b">TOP</a>
            </div>
            <Link to="/maps">매장찾기</Link>
            <Link to="/Cart">장바구니</Link>
            <Link to="/MyPage">마이페이지</Link>
            <Link to="/faq">문의하기</Link>
        </div>
    )
}

export default FloatingMenu;