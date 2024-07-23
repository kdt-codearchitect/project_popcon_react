
import './Footer.css';
import React from "react";

function Footer(){
    return(
      <footer>

        <div className="footer-container">
          <div className="footer-links">
         
            <a href="/terms">이용약관</a>
            <span>|</span>
            <a href="/privacy">개인정보 처리방침</a>
            <span>|</span>
            <a href="/notices">공지사항</a>
            <span>|</span>
            <a href="/support">고객센터</a>
            <span>|</span>
            <a href="/sitemap">사이트맵</a>
          </div>
          <div className="footer-info">
            ©Pop-Con Korea Corporation All Rights Reserved.
            <br />
            ㈜팝콘코리아 대표이사 : 김기윤 부산광역시 해운대구 APEC로 17 연락처 : 1588-7701
            <br />
            E-mail: contact-us@popcon.co.kr 사업자등록번호 : 220-87-17483
          </div>
          <div className="footer-social-icons">
            <div className="Images">
            <img src="/path/to/linkedin.png" alt="LinkedIn" />
            <img src="/path/to/instagram.png" alt="Instagram" />
            <img src="/path/to/facebook.png" alt="Facebook" />
            <img src="https://e7.pngegg.com/pngimages/521/673/png-clipart-computer-icons-youtube-youtube-text-logo.png" />
            </div>
          </div>
        </div>
      </footer>
  
  );
}

export default Footer;