// components/Header.js
'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode'; // Ensure proper import for jwt-decode

const Header = () => {
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(''); // Changed setImage to setUserImage for consistency
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert("Login to see the dashboard!");
      // router.push('/admin');
    } else {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name); // Assuming the token contains the user's name in the 'name' field
      setUserImage(decodedToken.image); // Set the user image
      console.log("User name is: " + decodedToken.name);
      console.log("User image link is: " + decodedToken.image);
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-gray-800 p-3">
      <div className="flex items-center">
        <div className="flex items-center ml-4">
          <h1 className='text-4xl text-yellow-500 font-bold'>Apple Legal Immi Solutions</h1>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        
        <div className="flex items-center">
          {userImage && (
            <img
              src={`https://admin.applelegal.co/uploads/${userImage}`} 
              alt="Profile Picture"
              className="rounded-full w-[50px] h-[50px]"
            />
          )}
          <span className="text-white text-lg ml-2">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
