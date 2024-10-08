import React, { useRef, forwardRef, useImperativeHandle,useState,useEffect } from 'react';
import {useCookies} from 'react-cookie';
import './LoginModal.css';
import PopconG from '../image/store_image/PopconG.png';
import popcon_logo2 from '../image/store_image/popcon_logo2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, Form, redirect, json, useActionData } from 'react-router-dom';  // Add 'json' and 'redirect' imports


const url = process.env.REACT_APP_API_BASE_URL;
const LoginModal = forwardRef((props, ref) => {
  const dialogRef = useRef(null);
  const data = useActionData();
  const [userid,setUserid] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [cookies,setCookie,removeCookie] = useCookies(['rememberId']);
  const [prevPath, setPrevPath] = useState('/');

  useEffect(() => {
    setPrevPath(window.location.pathname);
  }, []);

  useImperativeHandle(ref, () => ({
    modal_open: () => dialogRef.current.showModal(),
    modal_close: () => dialogRef.current.close()
  }));

  const handleClose = (e) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
     
    }
  };
    const handleOnChange = (e) => {
    setIsRemember(e.target.checked); 
    if (!isRemember) {
        setCookie('rememberId', userid, { maxAge: 3000 });
      } else {
        removeCookie('rememberId');
      }
  };
  const modal_exit = () => {
    dialogRef.current.close();
  };
  useEffect(() => {
    if(cookies.rememberId != undefined){
      setUserid(cookies.rememberId);
      setIsRemember(true);
    }
  },[cookies.rememberId]);
 

  return (
    <dialog ref={dialogRef} className="modal-login-box" onClick={handleClose}>
      <div className="modal-contents flex-c flex-d-column">
        <FontAwesomeIcon icon={faXmark} className='modal-close' onClick={() => dialogRef.current.close()} />
        <div className="modal-login-img flex-sa flex-d-column">
          <img src={PopconG} alt="PopconG" />
          <img src={popcon_logo2} alt="Popcon Logo" />
        </div>
        <Form method="post" action="/login" className="modal-login-form flex-sb flex-d-column" >
          <div className="flex-sa flex-d-column">
            <input type="text" name="userid" placeholder="아이디" required value={userid}  onChange={(e) => setUserid(e.target.value)} />
            <input type="password" name="password" placeholder="비밀번호" required />
          </div>
          {data?.error && <div className="error-message">{data.error}</div>}
          <div className='remember-id-box'>
            <input type="checkbox" id='id-checked' onChange={handleOnChange} checked={isRemember} placeholder='체크'/>
            <label htmlFor='id-checked'>아아디 기억하기</label>
          </div>
          <input type="hidden" name="prevPath" value={prevPath} />
          <div className="modal-login-botton-box flex-sb">
            <button type="submit" className="login-modal-btn thema-btn-01" onClick={modal_exit} >로그인</button>
            <Link className="flex-c thema-btn-02" to="/signup" onClick={modal_exit}>회원가입</Link>
          </div>
        </Form>
      </div>
    </dialog>
  );
});

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    userid: data.get('userid'),
    password: data.get('password'),
  };
  const prevPath = data.get('prevPath') || '/';
  const fetch_url = url + '/authenticate'
  const response = await fetch(fetch_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 400 || response.status === 401 || response.status === 422) {
    return response;
  }
 
  if (!response.ok) {
    throw json(
      {
        message: '요청에 대한 처리 불가.',
        title: '요청에러',
        email: 'system421@gmail.com'
      },
      { status: 500 }
    );
  } 

  const resData = await response.json();
  const token = resData.token;
  console.log("token",token);
  localStorage.setItem('jwtAuthToken', token);
  localStorage.setItem('userid', authData.userid);
  localStorage.setItem('customerRole',resData.customerRole);
  localStorage.setItem('customerIdx', resData.customerIdx);


  window.location.href = prevPath;
  return null; // redirect 대신 null 반환

}

export default LoginModal;