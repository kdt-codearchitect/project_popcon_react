import { useRef,forwardRef, useImperativeHandle } from 'react';
import './LoginModal.css'

const LoginModal = forwardRef((props, ref)=> {

  const dialog_x = useRef(null)

  useImperativeHandle(ref,()=>({modal_open}));

  function modal_open(){
    dialog_x.current.showModal();
  }

  return (
    <dialog ref={dialog_x}>
    <div class="modal-login-box flex-d-column flex-c">
        <div class="modal-login-img flex-s flex-d-column">
            <img src="./images/store_image/PopconG.png"/>
            <img src="./images/store_image/popcon_logo2.png"/>
        </div>
        <form class="modal-login-form flex-sb flex-d-column">
            <div class="flex-sb flex-d-column">
                <input type="text" placeholder="아이디"/>
                <input type="text" placeholder="비밀번호"/>
            </div>
            <div class="modal-login-botton-box flex-sb">
                <button class="thema-btn-01">로그인</button>
                <button class="thema-btn-02">회원가입</button>
            </div>
        </form>
    </div>
    </dialog>
  );
})

export default LoginModal;
