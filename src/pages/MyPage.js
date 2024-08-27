
import './MyPage.css';
import { Link, useNavigate } from "react-router-dom";
import SideMenu from './SideMenu';
import cart from '../image/mypage_cart.png';
import checkouts from '../image/mypage_checkouts.png';
import delivery from '../image/mypage_delivery.png';
import fridge from '../image/mypage_fridge.png';
import profile from '../image/mypage_profile.png';


const MyPage = () => {

  return (
    <div className="page-container">
      <SideMenu/>
      <div className="section-container">
        <div className="section-header">
          <div className="section-font">
            <h1>My Page</h1>
          </div>
        </div>
        <div className="section-content">
          <div className="flex-sa flex-width">
            <div className='mypage-text'>
              <Link to="/MyInfo"><img src={profile} className='mypage-icon'/></Link>
              <p>나의정보</ p></div>
            <div className='mypage-text'>
              <Link to="/Cart"><img src={cart} className='mypage-icon'/></Link>
              <p>장바구니</p></div>
            <div className='mypage-text'>
              <Link to="/Maps"><img src={delivery}  className='mypage-icon'/></Link>
              <p>배송지정보</p></div>
            <div className='mypage-text'>
              <Link to="/refrigerator"><img src={fridge} className='mypage-icon'/></Link>
              <p>냉장고</p></div>
            <div className='mypage-text'>
              <Link to="/orderhistory"><img src={checkouts} className='mypage-icon'/></Link>
              <p>주문내역</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
