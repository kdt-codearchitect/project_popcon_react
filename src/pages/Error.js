
import './Error.css'
import MainNavigation from '../components/Header';
import { Link } from 'react-router-dom';
import { useRouteError } from "react-router-dom";
import popcon_error from '../image/popcon_error.png';


function ErrorPage() {

  const error = useRouteError();
  console.log("error: ",  error);

  
  let title = 'Error 발생';
  let message = '무엇인가 잘못되었네요. 아래를 시도해보세요!';
  let email ='';

  if (error.status === 500) {
    title = error.data.title;
    message = error.data.message;
    email = error.data.email;
  }
  if (error.status === 404) {

    title = 'Not found!';
    message = '어? 길을 잃으셨군요. 이쪽으로 오세요.';
  }

  return (
    <>
      <MainNavigation />
      <main className='ErrorPage'>
          <img src={popcon_error} />
          <h1>{error.status} {title}</h1> 
			    <p>{message}</p>
			    <p>{email}</p>
          <h1><Link to="/faq">고객센터</Link></h1>
      </main>
    </>
  );
}
export default ErrorPage;

