
import './SignupComponent.css';
import {
  Form,
  redirect,
  json,
  useActionData
} from 'react-router-dom';

function SignupComponent() {

  //실패경우1 - 400: Bad Request 발생시 에러처리
  const data = useActionData();
  console.log("useActionData:", data);

  return (
    <div className="container">
		 <div className="signup">
            <div className="signUpForm">
              <Form  method="post" >
              {data && data.message && <p>{data.message}</p>}
                <div>
                    <label htmlFor="userid">userid:</label>
                    <input type="text" name="userid" id="userid" />
                </div>
                <div>
                    <label htmlFor="password">password:</label>
                    <input type="password" name="password" id="password" defaultValue={1234} />
                    
                </div>
                 <div>
                    <label htmlFor="username">username:</label>
                    <input type="text" name="username" id="username" />
                </div>
                <div>
                    <button name="signup" className="btn btn-success m-5" >signup</button>
                </div>
               </Form> 
            </div>
         </div>
	</div>
  );
}

export async function action({request}){

  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  const authData = {
    userid: data.get('userid'),
    password: data.get('password'),
    username:data.get("username")
  };
  console.log("authData>>", authData);

  const response = await fetch('http://localhost:8090/todo/users', {
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
