import './FloatingMenu.css';

const FloatingMenu = () =>{


    return(
        <div class="floating-menu flex-sa flex-d-column">
            <div class="floating-menu-top flex-c flex-d-column">
                <i class="fas fa-caret-up"></i>
                <a href="#" class="font-w-b">TOP</a>
            </div>
            <a href="#">매장찾기</a>
            <a href="/Cart">장바구니</a>
            <a href="/MyPage">마이페이지</a>
            <a href="#">문의하기</a>
        </div>
    )
}

export default FloatingMenu;