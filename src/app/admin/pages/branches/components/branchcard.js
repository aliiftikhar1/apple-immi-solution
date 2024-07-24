import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const BranchCard = ({ branch, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden p-4 m-4 transition duration-300 ease-in-out transform hover:scale-105">
         <h1 className='py-2 font-bold text-lg text-center text-gray-400'>Title:</h1>
         <h1 className='py-2 font-bold text-xl text-center text-gray-700'>{branch.title}</h1>
      <table className="min-w-full text-md text-left">
        <tbody>
          <tr className="border-b">
            <th className="py-2 font-medium text-gray-700">City:</th>
            <td className="py-2 text-gray-600">{branch.city}</td>
          </tr>
          <tr>
            <th className="py-2 font-medium text-gray-700">Address:</th>
            <td className="py-2 text-gray-600">{branch.address}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 px-2">
        <button onClick={() => onEdit(branch)}
          className="flex items-center px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
          <FaEdit className="mr-2" />Edit
        </button>
        <button onClick={() => onDelete(branch.id)}
          className="flex items-center px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150 ease-in-out">
          <FaTrash className="mr-2" />Delete
        </button>
      </div>
    </div>
  );
};

export default BranchCard;
