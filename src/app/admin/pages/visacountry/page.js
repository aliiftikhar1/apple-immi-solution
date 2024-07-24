'use client';
import { useEffect, useState } from 'react';
import FilterableTable from './filterabletable';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useSearchParams } from 'next/navigation';

const CustomersPage = () => {
  const [data, setData] = useState([]);
  const [filetypedata, setfiletypedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userBranch, setUserBranch] = useState('');
  const [userRole, setUserRole] = useState('');

  const searchParams = useSearchParams();
  const country = searchParams.get('country');

  const fetchData = async () => {
    try {
      let response, result;

      if ({country}) {
        if (userRole === 'manager') {
          response = await fetch(`/api/visacountrymanager`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country, userId }),
          });
        }
        if (userRole ==='employee' || userRole === 'super admin') {
          
          response = await fetch(`/api/visacountry`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country }),
          });
        }
        result = await response.json();
        setData(result);
      }

      const response2 = await fetch('/api/filetype');
      const result2 = await response2.json();
      setfiletypedata(result2);

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
  }, [country]);

  return (
    <div className="container bg-white mx-auto">
      {isLoading ? (
        <div className="text-center text-2xl p-4">Loading...</div>
      ) : (
        <FilterableTable
          data={data}
          userRole={userRole}
          userBranch={userBranch}
          country = {country}
          userId={userId}
          filetypedata={filetypedata}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default CustomersPage;
