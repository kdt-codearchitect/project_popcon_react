import { redirect } from 'react-router-dom';

export function action() {
  console.log("localStorage:", localStorage);
  // localStorage.clear()
  localStorage.removeItem('jwtAuthToken');
  localStorage.removeItem('userid');
  return redirect('/');
}