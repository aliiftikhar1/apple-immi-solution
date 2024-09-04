import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaEye, FaStreetView } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { EyeDropperIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AdminDetailsCard = ({ admin, handleEditAdmin, handleDeleteAdmin }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userBranch, setUserBranch] = useState('');
  const [userRole, setUserRole] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileCount, setFileCount] = useState(0); // State to hold file count
  const [isLoadingFiles, setIsLoadingFiles] = useState(true); // Loading state for file count

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
  }, []);

  // Fetch file count if admin role is 'employee'
  useEffect(() => {
    if (admin.role === 'employee') {
      const fetchFileCount = async () => {
        try {
          setIsLoadingFiles(true); // Set loading state to true before fetching
          const response = await fetch(`/api/employeefiles/${admin.id}`);
          const data = await response.json();
          console.log(data);
          setFileCount(data[0].customerCount);
        } catch (error) {
          console.error('Error fetching file count:', error);
        } finally {
          setIsLoadingFiles(false); // Set loading state to false after fetching
        }
      };
      fetchFileCount();
    }
  }, [admin.role, admin.id]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative p-4">
      <div className="flex justify-center items-center p-4 border-b">
        <div className='flex flex-col justify-center items-center'>
          <img className='w-[150px] h-[150px] rounded-full object-cover' src={`http://admin.applelegal.co/uploads/${admin.imgurl}` || 'https://via.placeholder.com/150'} alt="Admin Profile" />
          <h2 className="text-2xl font-semibold mt-2">{admin.name}</h2>
          <p className="text-md text-gray-500">{admin.role}</p>
          <p className="text-md text-gray-500">{admin.branch}</p>
          {admin.role === 'employee' && (
            <p className="text-md text-gray-500">
              Files added: {isLoadingFiles ? 'Loading...' : fileCount}
              
            </p>
          )}
          <div className="p-4 flex justify-center items-center">
            <button onClick={openModal} className="px-4 py-2 bg-white border-blue-500 border-2 text-blue-500 rounded-full hover:text-white hover:bg-blue-600 flex items-center focus:outline-none">
              <FaEye className="mr-2" /> View Details
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none">
              <FaTimes className="h-6 w-6" />
            </button>
            <div>
              <h3 className="text-2xl font-bold mb-4">Admin Details</h3>
              <div className='grid grid-cols-2'>
                <div>
                  <table className="min-w-full text-xl">
                    <tbody className='text-left'>
                      <tr><th>Name:</th><td>{admin.name}</td></tr>
                      <tr><th>Email:</th><td>{admin.email}</td></tr>
                      <tr><th>Role:</th><td>{admin.role}</td></tr>
                      <tr><th>Branch:</th><td>{admin.branch || 'Not assigned'}</td></tr>
                      <tr><th>City:</th><td>{admin.city}</td></tr>
                      <tr><th>Country:</th><td>{admin.country}</td></tr>
                      {admin.role === 'employee' && (
                      <tr><th> Files added:</th><td> {isLoadingFiles ? (
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        <span className="ml-2">Loading...</span>
      </span>
    ) : (
      <div className='flex gap-4 justify-start items-center'>
      {fileCount}
      <a className='' href={`/admin/pages/employeefiles/${admin.id}` }>
              <EyeIcon width={20} />
              </a>
      </div>
      )}</td></tr>
   
)}

                    </tbody>
                  </table>
                  <div className="flex justify-start mt-4 space-x-2">
                    {(userRole !== 'manager' || admin.role !== 'super admin') && (
                      <>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none flex items-center"
                          onClick={() => {
                            handleEditAdmin(admin);
                            closeModal();
                          }}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none flex items-center"
                          onClick={() => {
                            handleDeleteAdmin(admin.id);
                            closeModal();
                          }}
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <img src={`http://admin.applelegal.co/uploads/${admin.imgurl}` || 'https://via.placeholder.com/150'} alt="Profile" className="rounded-full w-[250px] h-[250px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetailsCard;
