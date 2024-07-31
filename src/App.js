
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData} from "react-router-dom";
import HomeComponent from "./pages/HomeComponent";
import SignupComponent, {action as signUpAction} from "./pages/SignupComponent";
import LoginComponent , {action as authAction} from "./pages/LoginComponent";
import RootLayout from "./pages/Root";
import ErrorPage from './pages/Error';

import { tokenLoader } from './util/auth';
import {action as logoutAction} from './pages/Logout'


import ListTodosComponent,{loader as todosLoader}  from "./pages/ListTodosComponent";
import AddTodoComponent , {action as addTodoAction} from "./pages/AddTodoComponent";
import UpdateTodoComponent , {loader as updateTodoLoader, action as updateTodoAction}  from "./pages/UpdateTodoComponent";

const router = createBrowserRouter([
  {
    path:"/",
    element:<RootLayout/>,
    errorElement: <ErrorPage />,
    id:'tokenRoot',
    loader:tokenLoader,
    children:[ 
      /*  path:'/' 대신에 index:true 사용할 수 있다.  */
      {path:'/', element:<HomeComponent />},
      {path:'/signup', 
       element:<SignupComponent/>,
       
      },
      {path:'/login', element:<LoginComponent  />, 
       action: authAction
       
       
      },
      {path:'/logout' , 
       action: logoutAction
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
