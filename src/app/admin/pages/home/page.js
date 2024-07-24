'use client';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [customer, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filetypes, setFiletypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData('users');
    fetchData('customer');
    fetchData('branches');
    fetchData('filetypes');
  }, []);

  const fetchData = async (type) => {
    try {
      let endpoint = '';
      if (type === 'users') {
        endpoint = '/api/admin';
      } else if (type === 'customer') {
        endpoint = '/api/user';
      } else if (type === 'branches') {
        endpoint = '/api/branches';
      } else if (type === 'filetypes') {
        endpoint = '/api/filetype';
      }
      const response = await fetch(endpoint);
      const result = await response.json();
      if (type === 'users') {
        setUsers(result);
      } else if (type === 'customer') {
        setCustomers(result);
      } else if (type === 'branches') {
        setBranches(result);
      } else if (type === 'filetypes') {
        setFiletypes(result);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      setIsLoading(false);
    }
  };

  const HomeCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-4 text-center gap-4 px-4 sm:px-10 mt-5">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:shadow-2xl rounded-lg p-6 hover:scale-105 transform transition-transform duration-300">
        <h2 className="text-2xl font-bold mb-4">Total Users</h2>
        <p className="text-4xl">{users.length}</p>
      </div>
      <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-md hover:shadow-2xl rounded-lg p-6 hover:scale-105 transform transition-transform duration-300">
        <h2 className="text-2xl font-bold mb-4">Total Customers</h2>
        <p className="text-4xl">{customer.length}</p>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-md hover:shadow-2xl rounded-lg p-6 hover:scale-105 transform transition-transform duration-300">
        <h2 className="text-2xl font-bold mb-4">Total Branches</h2>
        <p className="text-4xl">{branches.length}</p>
      </div>
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md hover:shadow-2xl rounded-lg p-6 hover:scale-105 transform transition-transform duration-300">
        <h2 className="text-2xl font-bold mb-4">Total File Types</h2>
        <p className="text-4xl">{filetypes.length}</p>
      </div>
    </div>
  );

  const chartData = {
    labels: ['Users', 'Customers', 'Branches', 'File Types'],
    datasets: [
      {
        label: 'Count',
        data: [users.length, customer.length, branches.length, filetypes.length],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <>
          <HomeCards />
          {/* <div className="p-6 h-4/6 flex justify-center items-center">
            <Bar data={chartData} />
          </div> */}
        </>
      )}
    </>
  );
}
