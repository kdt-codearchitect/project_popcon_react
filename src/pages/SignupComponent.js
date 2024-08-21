import './SignupComponent.css';
import {
  Form,
  redirect,
  json,
  useActionData
} from 'react-router-dom';
import sign_up from '../image/store_image/sign_up.png'
import { useState,useEffect } from 'react';

const url = process.env.REACT_APP_API_BASE_URL;
var isUnique = false;


function SignupComponent() {

  const [address, setAddress] = useState({
    postcode: '',
    roadAddress: '',
    jibunAddress: '',
    guide: ''
  });

  const [userid, setUserid] = useState("");
  const [isIdUnique, setIsIdUnique] = useState(true);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const url = process.env.REACT_APP_API_BASE_URL;
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Daum Postcode script loaded');
    };
    document.body.appendChild(script);
  }, []);

  const handleAddressChange = (e) => {
    e.preventDefault();
    new window.daum.Postcode({
      oncomplete: function(data) {
        var fullRoadAddr = data.roadAddress;
        var extraRoadAddr = '';
  
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraRoadAddr !== '') {
          fullRoadAddr += ' (' + extraRoadAddr + ')';
        }
  
        setAddress({
          postcode: data.zonecode,
          roadAddress: fullRoadAddr,
          jibunAddress: data.jibunAddress,
          guide: data.autoRoadAddress ? `(예상 도로명 주소: ${data.autoRoadAddress + extraRoadAddr})` 
              : data.autoJibunAddress ? `(예상 지번 주소: ${data.autoJibunAddress})` 
              : ''
        });
      }
    }).open();
  };
  const idcheck = async (e) => {
    e.preventDefault();
      if(userid == ''){
        //setIdCheckMessage("아이디를 입력하세요");
        alert("아이디를 입력하세요");
        return ;
      }
      
    
    const response = await fetch(url + `/check-id?userid=${userid}`);
    const result = await response.json();
      console.log(result);
    if (response.ok) {
      if (result.isUnique) {
        setIsIdUnique(true);
        console.log("아이디없음");
       // setIdCheckMessage("사용 가능한 아이디입니다.");
        alert("사용 가능한 아이디입니다.");
        isUnique = true;
      } 
      else {
        setIsIdUnique(false);
        console.log("아이디있음");
       // setIdCheckMessage("이미 사용 중인 아이디입니다.");
        alert("이미 사용 중인 아이디입니다.");
        isUnique = false;
      }
    } else {
      setIsIdUnique(false);
    //  setIdCheckMessage("아이디 중복 확인에 실패했습니다. 다시 시도해주세요.");
      alert("아이디 중복 확인에 실패했습니다. 다시 시도해주세요.");
    }
    
  };

  //실패경우1 - 400: Bad Request 발생시 에러처리
  const data = useActionData();
  console.log("useActionData:", data);

  return (
        <div className="signUp-container flex-c">
            <div className="signUp-box flex-c flex-d-column">
                <img src={sign_up} alt=""/>
                <Form method="post" className="signUp-form flex-sb flex-d-column">
                    <div className="signUp-name-box flex-sb">
                        <input type="text" name="userid" placeholder="아이디"  value={userid} onChange={(e) => setUserid(e.target.value)} required/>
                        <button className="thema-btn-01" onClick={idcheck}>중복확인</button>
                    </div>
                    <input type="password" name="password" placeholder="비밀번호" required/>
                    <input type="password" placeholder="비밀번호 확인" required/>
                    <input type="text" name="username" placeholder="이름" required/>
                    <input type="date" name="date" placeholder=""/>
                    <div className="signUp-phone-box flex-sb">
                        <input type="text" name="phone1" placeholder="010"/>
                        <input type="text" name="phone2" placeholder="0000"/>
                        <input type="text" name="phone3" placeholder="0000"/>
                    </div>
                    <div className="signUp-email-box flex-sb">
                        <input type="text" name="email"/>
                        <select name="emailDomain">
                            <option value="naver.com">naver.com</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="hanmail.net">hanmail.net</option>
                            <option value="nate.com">nate.com</option>

                        </select>
                    </div>
                    <div className="signUp-address flex-sb">
                        <input type="text" name="add1" value={address.roadAddress}/>
                        <button className="thema-btn-01" onClick={handleAddressChange}>주소찾기</button>
                    </div>
                    <input type="text" name="add2" />
                    <div className="signUp-button-box flex-sb">
                        <button className="thema-btn-01">회원가입</button>
                        <button className="thema-btn-03">취소</button>
                    </div>
                </Form>
            </div>
        </div>
  );
}

export async function action({request}){


  // 회원가입폼 데이터 얻기
  const data = await request.formData();  
  console.log(isUnique);
  if(isUnique != true){
    alert("아이디 중복")
    return redirect('/signup');
  }

  const authData = {
    customerId: data.get('userid'),
    customerPw: data.get('password'),
    customerName: data.get('username'),
    customerPhone: `${data.get('phone1')}-${data.get('phone2')}-${data.get('phone3')}`,
    customerDate: data.get('date'),
    customerAdd: data.get('add1'),  
    customerAddMore: data.get('add2'),
    customerEmail: `${data.get('email')}@${data.get('emailDomain')}`,
    customerEmailDomain: 'naver.com',
    customerRate: '1',
    customerRole: '1',
  };
  console.log("authData>>", authData);

  const response = await fetch(url + '/signup', {
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

  return redirect('/');
}//end action

export default SignupComponent;
