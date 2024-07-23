
import './Error.css'
import MainNavigation from '../components/Header';

import { useRouteError } from "react-router-dom";

function ErrorPage() {

  const error = useRouteError();
  console.log("error: ",  error);

  
  let title = 'Error 발생';
  let message = '의도하지 않은 요청에러';
  let email ='';

  if (error.status === 500) {
    title = error.data.title;
    message = error.data.message;
    email = error.data.email;
  }
  if (error.status === 404) {

    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <>
      <MainNavigation />
      <main className='ErrorPage'>
          <h1>{error.status}</h1>
          <h1>{title}</h1>
			    <p>{message}</p>
			    <p>{email}</p>
      </main>
    </>
  );
}
export default ErrorPage;

