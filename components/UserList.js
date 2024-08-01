

function UserList({data}){
    
    return(
        <table border="1">
         <thead>
           <tr>
             <th>id</th>
             <th>email</th>
             <th>first_name</th>
             <th>avatar</th>
           </tr>
           </thead>
           <tbody>
            {
               data.map((row,idx)=>
               <tr key={idx}>
                  <td>{row.id}</td>
                  <td>{row.email}</td>
                  <td>{row.first_name}</td>
                  <td><img src={row.avatar} width={100} height={100} alt="" /></td>
               </tr>
            ) 
            }
           </tbody>
       </table>
    );
}

export default   UserList;