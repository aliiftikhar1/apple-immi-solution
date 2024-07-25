'use client';
import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  HomeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';

const Sidebar = ({ setActiveComponent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    customers: false,
    branches: false,
    adminUsers: false,
    filetypes: false,
    clientCountries: false,
  });

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert('Login to see the dashboard!');
      router.push('/admin');
    } else {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name);
      setUserEmail(decodedToken.email);
      setUserRole(decodedToken.role);
    }
  }, []);

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/admin';
  };

  const handleCountryClick = (country) => {
    router.push(`/admin/pages/visacountry/${country}`);
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="px-2 text-center">
        <div className="flex items-center justify-center mb-3 mt-2 ml-4">
          <img
            className="w-[150px] rounded px-6 py-2"
            src="/assets/apple logo.png"
            alt="Logo"
          />
        </div>
        <h2 className="text-lg font-bold">{userEmail}</h2>
        <h2 className="text-lg font-semibold text-yellow-300">{userRole}</h2>
        <p className="text-green-400">● Online</p>
      </div>
      <div className="p-4 border-t border-gray-700">
        <ul className="mt-4 space-y-2">
          <li>
            <a href="/admin/pages/home">
              <button className="flex items-center p-2 hover:bg-blue-700 rounded">
                <HomeIcon className="h-5 w-5" />
                <span className="ml-2">Home</span>
              </button>
            </a>
          </li>
          {(userRole === 'manager' ||
            userRole === 'employee' ||
            userRole === 'super admin') && (
            <li>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                onClick={() => toggleDropdown('customers')}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span className="ml-2">Clients</span>
                <ChevronDownIcon className="h-5 w-5 ml-auto" />
              </button>
              {isDropdownOpen.customers && (
                <ul className="ml-8 mt-2 space-y-2">
                  <li>
                    <a href="/admin/pages/customers">
                      <button className="flex w-full items-center p-2 hover:bg-blue-700 rounded">
                        <span className="ml-2">View Files</span>
                      </button>
                    </a>
                  </li>
                </ul>
              )}
            </li>
          )}
          {(userRole === 'manager' || userRole === 'super admin') && (
            <>
              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('adminUsers')}
                >
                  <BriefcaseIcon className="h-5 w-5" />
                  <span className="ml-2">Admin Users</span>
                  <ChevronDownIcon className="h-5 w-5 ml-auto" />
                </button>
                {isDropdownOpen.adminUsers && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/admin/pages/adminuser">
                        <button className="flex w-full items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Admin Users</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
          {userRole === 'super admin' && (
            <>
              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('branches')}
                >
                  <UserGroupIcon className="h-5 w-5" />
                  <span className="ml-2">Branches</span>
                  <ChevronDownIcon className="h-5 w-5 ml-auto" />
                </button>
                {isDropdownOpen.branches && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/admin/pages/branches">
                        <button className="flex w-full items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Branches</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                  onClick={() => toggleDropdown('filetypes')}
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  <span className="ml-2">Filetypes</span>
                  <ChevronDownIcon className="h-5 w-5 ml-auto" />
                </button>
                {isDropdownOpen.filetypes && (
                  <ul className="ml-8 mt-2 space-y-2">
                    <li>
                      <a href="/admin/pages/filetype">
                        <button className="flex w-full items-center p-2 hover:bg-blue-700 rounded">
                          <span className="ml-2">View Filetypes</span>
                        </button>
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
          {(userRole === 'manager' ||
            userRole === 'super admin' ||
            userRole === 'employee') && (
            <li>
              <button
                className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
                onClick={() => toggleDropdown('clientCountries')}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span className="ml-2">Client Countries</span>
                <ChevronDownIcon className="h-5 w-5 ml-auto" />
              </button>
              {isDropdownOpen.clientCountries && (
                <ul className="ml-8 mt-2 space-y-2">
                  <li>
                    <button
                      className="flex w-full items-center p-2 hover:bg-blue-700 rounded"
                      onClick={() => handleCountryClick('Ireland')}
                    >
                      <span className="ml-2">Ireland</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full items-center p-2 hover:bg-blue-700 rounded"
                      onClick={() => handleCountryClick('Germany')}
                    >
                      <span className="ml-2">Germany</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full items-center p-2 hover:bg-blue-700 rounded"
                      onClick={() => handleCountryClick('USA')}
                    >
                      <span className="ml-2">USA</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full items-center p-2 hover:bg-blue-700 rounded"
                      onClick={() => handleCountryClick('Canada')}
                    >
                      <span className="ml-2">Canada</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full items-center p-2 hover:bg-blue-700 rounded"
                      onClick={() => handleCountryClick('Australia')}
                    >
                      <span className="ml-2">Australia</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
          <li>
            <button
              className="flex items-center w-full p-2 hover:bg-blue-700 rounded focus:outline-none"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
