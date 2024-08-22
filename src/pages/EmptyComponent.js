
import './EmptyComponent.css'
import MainNavigation from '../components/Header';
import { Link } from 'react-router-dom';
import { useRouteError } from "react-router-dom";
import popcon_error from '../image/popcon_error.png';


function EmptyComponent() {

  const error = useRouteError();
  console.log("error: ",  error);

  
  

  return (
    <>
      
    </>
  );
}
export default EmptyComponent;

