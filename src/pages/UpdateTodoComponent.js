
import './UpdateTodoComponent.css';
import { useEffect, useState } from 'react'
import { getAuthToken } from '../util/auth';
import {useParams, json,  useLoaderData , Form,  redirect,} from 'react-router-dom'

function UpdateTodoComponent() {

  // const params = useParams();  // params.id 로 접근
  const {id} = useParams()

  const xxx= useLoaderData();
  const[description, setDescription] = useState(xxx.description)
  const[targetDate, setTargetDate] = useState(xxx.targetDate)

  console.log("xxx: ", xxx)
  console.log("description:", description)
  console.log("targetDate:", targetDate)

  // useEffect 없이 setDescription(xxx.description) 하면 무한반복됨.
  useEffect(
    () => {
      setDescription(xxx.description)
      setTargetDate(xxx.targetDate)
    },
    [id]
    )

  

  return (
    <div className="container">
      <h1>Todo Update!</h1>
             <div>
                  <Form  method="post" >
                     <input type="hidden" name="id" defaultValue={id} />
                      <fieldset className="form-group">
                          <label>Description</label>
                          <input type="search" className="form-control"  name="description" defaultValue={description}/>
                      </fieldset>
                      <fieldset className="form-group">
                          <label>Target Date</label>
                          <input type="date" className="form-control" name="targetDate" defaultValue={targetDate}/>
                          
                      </fieldset>
                      	   <input type="hidden" name="id" className="form-control"/>
				           <input type="hidden" name="done" className="form-control"/>
                      <div>
                          <button className="btn btn-success m-5">Save</button>
                      </div>
                  </Form>
            </div>
  </div>
  );
}

export async function loader({request, params}){
  alert("UpdateTodoComponent. loader")

  const id = params.id;
  const userid = localStorage.getItem("userid")

  const token = getAuthToken();

  const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos/${id}`, {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    }
  });

  console.log("update화면 요청결과:", response);

  if (response.status === 400 || response.status === 401 || response.status === 422) {
		console.log("response.status>>", response.status);
		return response;
	}
	  

      if (!response.ok) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
      }
      
    const resData = await response.json();
    console.log("resData", resData);
    return resData;

}//end loader


export async function action({request}){

  const userid = localStorage.getItem("userid")
  const token = getAuthToken();

  // 회원가입폼 데이터 얻기
  const data = await request.formData();
  const id =  data.get('id')
  const authData = {
    description: data.get('description'),
    targetDate: data.get('targetDate'),
  };
  console.log("authData>>", authData);

  const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(authData),
  });

  console.log("Todo 수정 요청결과:", response);

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



  return redirect('/todos');
}//end action


export default UpdateTodoComponent;
