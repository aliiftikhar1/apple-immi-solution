'use client';
import { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  //----------------------------------------------
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail]= useState('')
  const [userImage, setUserImage]= useState('')
  const [userBranch, setUserBranch] = useState('');
  const [userRole, setUserRole]= useState('')
  
//-------------------------------------------------

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin');
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert("Login to see the dashboard!");
      // router.push('/admin');
    } else {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name); 
      setUserImage(decodedToken.image); 
      setUserEmail(decodedToken.email); 
      setUserBranch(decodedToken.branch); 
      setUserId(decodedToken.id); 
      setUserRole(decodedToken.role); 
     
      console.log("User name is: " + decodedToken.name);
      console.log("User image link is: " + decodedToken.image);
    }
    fetchData();
  }, []);

  return (
    <div className="container bg-white mx-auto ">
      {isLoading ? (
        <div className="text-center text-2xl p-4">Loading...</div>
      ) : (
        <FilterableTable data={data} userRole={userRole} userBranch={userBranch} userId={userId}  fetchData={fetchData} />
      )}
    </div>
  );
};

export default AdminPage;
