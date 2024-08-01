
import './AddTodoComponent.css';
import { getAuthToken } from '../util/auth';
import {
  Form,
  redirect,
  json,
  useActionData
} from 'react-router-dom';

function AddTodoComponent() {

   //실패경우1 - 
   const data = useActionData();
   console.log("useActionData:", data);
    

  return (
    <div className="container">
        <h1>Todo Add!</h1>
             <div>
                  <Form  method="post" >
                     {data && data.message && <p>{data.message}</p>}
                      <fieldset className="form-group">
                          <label>Description</label>
                          <input type="search" className="form-control"  name="description"/>
                      </fieldset>
                      <fieldset className="form-group">
                          <label>Target Date</label>
                          <input type="date" className="form-control" name="targetDate"/>
                          
                      </fieldset>
                      	   <input type="text" name="userid" className="form-control" />
				                  <input type="hidden" name="done" className="form-control"/>
                      <div>
                          <button className="btn btn-success m-5">Save</button>
                      </div>
                  </Form>
            </div>
  </div>
  );
}

export async function action({request}){
  alert("AddTodoComponent. action")
  const userid = localStorage.getItem("userid");

  // const token = getAuthToken();
  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  console.log("data>>", data);
  const authData = {
    description: data.get('description'),
    targetDate: data.get('targetDate'),
    userid:userid
  };

  console.log("authData>>", authData);
  const token = getAuthToken();

  const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(authData),
  });

  console.log("회원가입 요청결과:", response);

  //실패경우1 -  14 라인과 23 라인에서 에외처리함
  if (response.status === 400 || response.status === 401 || response.status === 422) {
    console.log("response.status>>", response.status);
    return response;
  }

  return redirect('/Todos');
}//end action

export default AddTodoComponent;
