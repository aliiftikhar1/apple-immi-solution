import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FileTypeCard = ({ filetype, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 m-4 transition duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold">{filetype.title}</h3>
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={() => onEdit(filetype)}
          className="flex items-center text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out">
          <FaEdit className="mr-2" />Edit
        </button>
        <button onClick={() => onDelete(filetype.id)}
          className="flex items-center text-red-500 hover:text-red-700 transition duration-150 ease-in-out">
          <FaTrash className="mr-2" />Delete
        </button>
      </div>
    </div>
  );
};
export default FileTypeCard;