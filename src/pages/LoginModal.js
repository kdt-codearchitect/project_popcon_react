import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import './LoginModal.css';
import PopconG from '../image/store_image/PopconG.png';
import popcon_logo2 from '../image/store_image/popcon_logo2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  redirect,
  json,
  useActionData
} from 'react-router-dom';

const LoginModal = forwardRef((props, ref) => {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => ({
    modal_open: () => dialogRef.current.showModal(),
    modal_close: () => dialogRef.current.close()
  }));

  const handleClose = (e) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  //실패경우1 - 
  const data = useActionData();
  console.log("useActionData:", data);

  return (
    <dialog ref={dialogRef} className="modal-login-box" onClick={handleClose}>
      <div className="modal-content flex-sa flex-d-column">
        <FontAwesomeIcon icon={faXmark} className='modal-close' onClick={() => dialogRef.current.close()} />
        <div className="modal-login-img flex-sa flex-d-column">
          <img src={PopconG} alt="PopconG" />
          <img src={popcon_logo2} alt="Popcon Logo" />
        </div>
        <Form method="post" className="modal-login-form flex-sb flex-d-column">
          <div className="flex-sa flex-d-column">
            <input type="text" name="userid" placeholder="아이디" />
            <input type="password" name="password" placeholder="비밀번호" />
          </div>
          <div className="modal-login-botton-box flex-sb">
            <button name="login" className="thema-btn-01">로그인</button>
            <button className="thema-btn-02">회원가입</button>
          </div>
        </Form>
      </div>
    </dialog>
  );
});

export async function action({request}){

  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  const authData = {
    userid: data.get('userid'),
    password: data.get('password'),
  };
  console.log("authData>>", authData);

  const response = await fetch('http://localhost:8090/todo/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  console.log("회원가입 요청결과:", response);

  //실패경우1 - 400: Bad Request 와 401: Unauthorized
  //  실습은 스프리의 @Valid 위반시 400 에러가 발생됨. 이 경우 response를 바로 리턴하면 
  //  폼에서 useActionData()로 에러를 처리할 수 있음.
  if (response.status === 400 || response.status === 401 || response.status === 422) {
    console.log("response.status>>", response.status);
    return response;
  }
  
  //실패경우2- 전반적인 서버에러 ( 예> userid 중복에러 )
  if (!response.ok) {
    console.log("response.status>>", response.status);
    throw  json(
      {
        message:'요청에 대한 처리 불가.',
        title:'요청에러',
        email:'inky4832@daum.net'
      },
      {status:500}
   )
  } 


  //성공경우
  const resData = await response.json();
  console.log("resData>>>>>>", resData);

  // 응답받은 token과 userid  로컬 스토리지에 저장
  const token = resData.token;
  localStorage.setItem('jwtAuthToken', token);
  localStorage.setItem('userid', authData.userid);


  return redirect('/');
}//end action

export default LoginModal;
