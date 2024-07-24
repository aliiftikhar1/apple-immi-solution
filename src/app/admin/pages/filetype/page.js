'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Card Component
const FileTypeCard = ({ filetype, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 m-4">
      <div className="p-5 text-md">
        <h3 className="text-2xl font-bold text-gray-800">{filetype.title}</h3>
        <p className="text-gray-600">ID: {filetype.id}</p>
        <p className="text-gray-600">Created: {new Date(filetype.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-600">Updated: {new Date(filetype.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="px-5 py-3 flex justify-between bg-gray-100 text-right">
      <button onClick={() => onEdit(filetype)}
          className="flex items-center px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out">
          <FaEdit className="mr-2" />Edit
        </button>
        <button onClick={() => onDelete(filetype.id)}
          className="flex items-center px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150 ease-in-out">
          <FaTrash className="mr-2" />Delete
        </button>
      </div>
    </div>
  );
};

// Main Component
const FilterType = () => {
  const [filetypes, setFiletypes] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFiletype, setNewFiletype] = useState({ id: '', title: '' });

  useEffect(() => {
    fetchFiletypes();
  }, []);

  const fetchFiletypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/filetype');
      const result = await response.json();
      setFiletypes(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching filetypes:', error);
      setIsLoading(false);
    }
  };

  const handleEditFiletype = (filetype) => {
    setNewFiletype(filetype);
    setIsModalOpen(true);
  };

  const handleDeleteFiletype = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/filetype/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete filetype');
      }
      fetchFiletypes(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting filetype:', error);
    }
    setIsLoading(false);
  };

  const handleAddOrUpdateFiletype = async () => {
    setIsLoading(true);
    const method = newFiletype.id ? 'PUT' : 'POST';
    const endpoint = newFiletype.id ? `/api/filetype/${newFiletype.id}` : '/api/filetype';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFiletype),
      });

      if (!response.ok) {
        throw new Error('Failed to save filetype');
      }

      fetchFiletypes(); // Refresh the list
      setIsModalOpen(false);
      setNewFiletype({ id: '', title: '' }); // Reset the form
    } catch (error) {
      console.error('Error saving filetype:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">File Types</h2>
          <button
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => {setIsModalOpen(true); setNewFiletype({ id: '', title: '' });}}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex grid grid-cols-3 justify-start items-stretch">
          {filetypes.filter(filetype => filetype.title.toLowerCase().includes(filter.toLowerCase())).map(filetype => (
            <FileTypeCard
              key={filetype.id}
              filetype={filetype}
              onEdit={handleEditFiletype}
              onDelete={handleDeleteFiletype}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newFiletype.id ? 'Edit File Type' : 'Add New File Type'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newFiletype.title}
                onChange={(e) => setNewFiletype({ ...newFiletype, title: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateFiletype}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newFiletype.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterType;
