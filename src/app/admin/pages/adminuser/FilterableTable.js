import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import AdminDetailsCard from './components/admincards';

const FilterableTable = ({ data, fetchData,userRole, userBranch }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newItem, setNewItem] = useState({
    id: null,
    name: '',
    age: '',
    cnic: '',
    country: '',
    city: '',
    branch: '',
    role: '',
    email: '',
    password: '',
    imgurl: '',
    base64:'',
  });
  
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    let filtered = data;
    if (userRole === 'manager') {
      filtered = filtered.filter(item => (item.branch === userBranch && item.branch !== 'super admin'));
      console.log(filtered)
      console.log("User branch is"+userBranch)
      console.log(userRole)
      setFilteredData(filtered)
      
    }
    if (userRole === 'super admin') {
      setFilteredData(data.filter(item =>
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      ));
      console.log(filtered)
      console.log(userBranch)
      console.log(userRole)
      
    }
    
    fetchBranches();
  }, [filter, data, userBranch, userRole]);

  const fetchBranches = async () => {
    try {
     const response = await fetch('/api/branches');
      const result = await response.json();
      setBranches(result);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleAddOrUpdateItem = async () => {
    setIsLoading(true);
    const method = newItem.id ? 'PUT' : 'POST';
    const url = newItem.id ? `/api/admin/${newItem.id}` : '/api/admin';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to add/update item');
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding/updating item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete item');
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setIsModalOpen(true);
  };

  // Handle image change
  const handleImageChange = (e) => {
    setNewItem({ ...newItem, base64: '' });
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewItem({ ...newItem, imgurl: imageUrl });
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, base64: reader.result });
        
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-gray-200 shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Users List</h2>
          <div className="flex space-x-2">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}>
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewItem({ id: null, name: '', age: '', cnic: '', country: '', city: '', branch: '', role: '', email: '', password: '', imgurl: '' });
                setIsModalOpen(true);
              }}>
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((admin) => (
            <AdminDetailsCard
              key={admin.id}
              admin={admin}
              handleEditAdmin={handleEditItem}
              handleDeleteAdmin={handleDeleteItem}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 w-full max-w-5xl h-[90vh] overflow-auto rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-10">
              <div> {/* Left column for input fields */}
                <h2 className="text-2xl font-semibold mb-6">{newItem.id ? 'Edit Admin User' : 'Add New Admin User'}</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  <input type="text" placeholder="Age" value={newItem.age} onChange={(e) => setNewItem({ ...newItem, age: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  <input type="text" placeholder="CNIC" value={newItem.cnic} onChange={(e) => setNewItem({ ...newItem, cnic: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  <input type="text" placeholder="Country" value={newItem.country} onChange={(e) => setNewItem({ ...newItem, country: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  <input type="text" placeholder="City" value={newItem.city} onChange={(e) => setNewItem({ ...newItem, city: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  {userRole === 'super admin' && (
                    <select value={newItem.branch} onChange={(e) => setNewItem({ ...newItem, branch: e.target.value })} className="p-2 border border-gray-300 rounded w-full">
                    <option value="" disabled>Select Branch</option>
                    {branches.map(branch => (<option key={branch.id} value={branch.title}>{branch.title}</option>))}
                  </select>
                  )}
                  {userRole === 'manager' &&(
                    <select value={newItem.branch} onClick={(e) => setNewItem({ ...newItem, branch: e.target.value })} className="p-2 border border-gray-300 rounded w-full">
                    <option value={userBranch} >{userBranch}</option>
                  </select>
                  )}
                  <select value={newItem.role} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })} className="p-2 border border-gray-300 rounded w-full">
                    <option value="" disabled>Select Role</option>
                    {userRole === 'super admin' &&( <><option value="super admin">Super Admin</option>
                  <option value="manager">Manager</option></>)}
                    <option value="employee">Employee</option>
                    
                  </select>
                  <input type="email" placeholder="Email" value={newItem.email} onChange={(e) => setNewItem({ ...newItem, email: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                  <div className="flex items-center">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} className="p-2 border border-gray-300 rounded w-full" />
                    <button onClick={togglePasswordVisibility} className="ml-2">
                      {showPassword ? <EyeSlashIcon className="h-6 w-6 text-gray-600" /> : <EyeIcon className="h-6 w-6 text-gray-600" />}
                    </button>
                  </div>
                  <input type="file" onChange={handleImageChange} className="p-2 border border-gray-300 rounded w-full" accept="image/*" />
                </div>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg"> {/* Right column for displaying entered data */}
                <h2 className="text-2xl font-semibold mb-6">Preview</h2>
                
                <div className='flex justify-center mb-4'>
                  <img src={ `http://admin.applelegal.co/uploads/${newItem.imgurl}`}  alt="Profile" className="rounded-full shadow-md h-40 w-40 object-cover"/>
                  </div>
                <div className="space-y-4">
                  <p><strong>Name:</strong> {newItem.name}</p>
                  <p><strong>Age:</strong> {newItem.age}</p>
                  <p><strong>CNIC:</strong> {newItem.cnic}</p>
                  <p><strong>Country:</strong> {newItem.country}</p>
                  <p><strong>City:</strong> {newItem.city}</p>
                  <p><strong>Email:</strong> {newItem.email}</p>
                  <p><strong>Branch:</strong> {newItem.branch}</p>
                  <p><strong>Role:</strong> {newItem.role}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
              <button onClick={() => { setIsModalOpen(false); setIsLoading(true); handleAddOrUpdateItem();}}
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{newItem.id ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
