import './FloatingMenu.css';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import LoginModal from './LoginModal';
import { useState, useEffect } from 'react';

const FloatingMenu = () =>{

    const modalRef = useRef(null)
    const [customerIdx, setCustomerIdx] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // localStorage에서 customerIdx와 토큰을 가져옴
        const stoclickCustomerIdx = localStorage.getItem('customerIdx');
        const stoclickToken = localStorage.getItem('jwtAuthToken');
    
        // customerIdx와 token을 상태에 저장
        if (stoclickCustomerIdx && stoclickToken) {
            setCustomerIdx(stoclickCustomerIdx);
            setToken(stoclickToken);
        }
    }, []);

    function show_modal(){
        modalRef.current.modal_open();
    }
    
    function show_mypageModal(){
        if (!customerIdx) {
            console.log('로그인이 필요합니다.');
            show_modal(); // 로그인 모달을 띄웁니다.
        } else {
            navigate('/MyPage');
        }
    }
    
    function show_cartModal(){
        if (!customerIdx) {
            console.log('로그인이 필요합니다.');
            show_modal(); // 로그인 모달을 띄웁니다.
        } else {
            navigate('/Cart');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return(
        <div className="floating-menu flex-sa flex-d-column">
            <div className="floating-menu-top flex-c flex-d-column" onClick={scrollToTop}>
                <i className="fas fa-caret-up"></i>
                <p className="font-w-b">TOP</p>
            </div>
            <Link to="/maps">매장찾기</Link>
            <p onClick={show_cartModal}>장바구니</p>
            <p onClick={show_mypageModal}>마이페이지</p>
            <Link to="/faq">문의하기</Link>
            <LoginModal ref={modalRef}/>
        </div>
    )
}

export default FloatingMenu;