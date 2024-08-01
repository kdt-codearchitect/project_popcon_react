
import './ListTodosComponent.css';

import { useState } from "react"
import { getAuthToken } from '../util/auth';
import { json,  useLoaderData, useNavigate} from 'react-router-dom';

function ListTodosComponent() {

	const xxx= useLoaderData();
	const navigate = useNavigate()
	
	 const [todos, setTodos] = useState(xxx)

	async function refreshTodos() {
        
		const token = getAuthToken();
		const userid = localStorage.getItem("userid");
		// console.log("token:", token);
		console.log("userid:" , userid);

        const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos/`, {
			method: "GET", 
			headers: {
			//   'Content-Type': 'application/json',
			//   'jwtAuthToken': token
			// Authorization: Bearer TOKEN_VALUE   
			   Authorization: `Bearer ${token}`
	
			}
		  });
       
		  
          if(response.ok){
			var resData = await response.json()
            console.log("refreshTodos()",  resData)
			setTodos(resData)
		  }
    
    }
	async function deleteTodo(id) {
        console.log('clicked ' + id)
		const token = getAuthToken();
		const userid = localStorage.getItem("userid");
		// console.log("token:", token);
		console.log("userid:" , userid);
	
		const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos/${id}`, {
			method: "DELETE", 
			headers: {
			//   'Content-Type': 'application/json',
			//   'jwtAuthToken': token
			// Authorization: Bearer TOKEN_VALUE   
			   Authorization: `Bearer ${token}`
	
			}
		  });
		
		  if(response.ok){
			refreshTodos()
		  }

    }//end deleteTodo

	async function updateTodo(id) {
		console.log('clicked ' + id)
		navigate(`/updateTodo/${id}`)
	}//end updateTodo

	async function addTodo() {
		navigate("/addTodo")
	}//end addTodo

  return (
	<div className="container">
	<h1>Todo List!</h1>
	<div>
		<table className="table">
			<thead>
					<tr>
						<th>id</th>
						<th>Description</th>
						<th>Is Done?</th>
						<th>Target Date</th>
						<th>Delete</th>
						<th>Update</th>
					</tr>
			</thead>
			<tbody>
			{
              todos.map(
                     todo => (
						<tr key={todo.id}>
									<td>{todo.id}</td>
                                    <td>{todo.description}</td>
                                    <td>{todo.done.toString()}</td>
                                    {/* <td>{todo.targetDate.toDateString()}</td> */}
                                    <td>{todo.targetDate.toString()}</td>
                                    <td> <button className="btn btn-warning" 
									  onClick={() => deleteTodo(todo.id)}
									  >Delete</button> </td>
                                    <td> <button className="btn btn-success"
									  onClick={() => updateTodo(todo.id)} 
									>Update</button> </td>
                        </tr>
					)
				)
			}					
			</tbody>

		  </table>
		</div>
		<div className="btn btn-success m-5" onClick={() => addTodo()}>Add New Todo</div>
	</div>


  );
}

export async function loader({ request }) {
    console.log("ListTodosComponent,loader>>>>>>>>>>>>.",request)
    const token = getAuthToken();
    const userid = localStorage.getItem("userid");
    console.log("token:", token);
    console.log("userid:" , userid);

    const response = await fetch(`http://localhost:8090/todo/users/${userid}/todos`, {
        method: "GET", 
        headers: {
        //   'Content-Type': 'application/json',
        //   'jwtAuthToken': token
		// Authorization: Bearer TOKEN_VALUE   
		   Authorization: `Bearer ${token}`

        }
      });
     
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
  }
export default ListTodosComponent;
