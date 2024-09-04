'use client';
import { useEffect, useState } from 'react';
import FilterableTable from '../FilterableTable';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function CustomerFiles() {
  const [data, setData] = useState([]);
  const [filetypedata, setfiletypedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null); // State to store admin data
  const param = useParams();
  console.log("params", param.id);
  // -------------------------------------
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userBranch, setUserBranch] = useState('');
  const [userRole, setUserRole] = useState('');

  // Fetch individual customer details based on ID
  const fetchCustomerById = async (customerId) => {
    try {
      const response = await fetch(`/api/user/${customerId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return null;
    }
  };

  // Fetch admin user data based on the param.id
  const fetchAdminUser = async () => {
    try {
      const response = await fetch(`/api/admin/${param.id}`);
      const adminResult = await response.json();
      setAdminData(adminResult); // Store admin user data
    } catch (error) {
      console.error('Error fetching admin user data:', error);
    }
  };

  // Function to fetch employee files and then fetch customer details
  const fetchData = async () => {
    try {
      // First, fetch the employee files data
      const response = await fetch(`/api/employeefiles/${param.id}`);
      const result = await response.json();
      console.log("Result", result);

      const customerIds = result[0]?.customers || [];

      // Use map to fetch details for each customer ID and resolve all promises
      const customerDetailsPromises = customerIds.map((id) => fetchCustomerById(id));
      const customersData = await Promise.all(customerDetailsPromises);

      // Filter out any null responses in case of errors
      const validCustomers = customersData.filter((customer) => customer !== null);
      console.log("customers:", validCustomers);
      setData(validCustomers); // Set the fetched customer data

      // Fetch file type data
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
    fetchAdminUser(); // Fetch admin user data
    fetchData(); // Fetch customer data when component mounts
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      {isLoading ? (
        <div className="text-center text-2xl font-semibold p-4">Loading...</div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Files Added by: 
              <span className="text-blue-600">
                {adminData ? ` ${adminData.name}` : ' Loading admin data...'}
              </span>
            </h1>
            {adminData?.email && (
              <p className="text-lg text-gray-500 mt-2">{adminData.email}</p>
            )}
          </div>
          <FilterableTable 
            data={data} 
            userRole={userRole} 
            userBranch={userBranch} 
            userId={userId} 
            filetypedata={filetypedata} 
            fetchData={fetchData} 
          />
        </>
      )}
    </div>
  );
}
