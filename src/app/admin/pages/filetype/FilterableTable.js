import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import FileTypeCard from './FileTypeCard';

const FilterableTable = ({ fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filetypes, setFiletypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    fetchData().then(setFiletypes);
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredData(filetypes);
    } else {
      setFilteredData(filetypes.filter(filetype =>
        filetype.title.toLowerCase().includes(filter.toLowerCase())
      ));
    }
  }, [filter, filetypes]);

  const handleAddOrUpdateItem = async (item) => {
    setIsLoading(true);
    const method = item.id ? 'PUT' : 'POST';
    const url = item.id ? `/api/filetype/${item.id}` : '/api/filetype';

    try {
      const response = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add/update item');
      }
      fetchData().then(setFiletypes);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">File Types</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewItem({ title: '' }); // Prepare to add a new item
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <div className="flex flex-wrap justify-start items-stretch">
          {filetypes.map(filetype => (
            <FileTypeCard
              key={filetype.id}
              filetype={filetype}
              onEdit={item => {
                setNewItem(item); // Prepare to edit the item
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <FileTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddOrUpdateItem}
          item={newItem}
        />
      )}
    </div>
  );
};

export default FilterableTable;
