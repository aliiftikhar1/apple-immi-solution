import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FaDownload, FaTimes } from 'react-icons/fa';
import UserDetailsCard from './components/card';

const visaTypes = ["Skilled Immigration", "Business Immigration", "Student Immigration", "Citizenship Immigration", "Recruitment", "Citizenship by Investment"];
const visaCountries = ["UK", "USA", "Canada", "Australia","Ireland", "Hungary", "Italy","Europe", "Finland", "France", "Poland", "Germany", "Sweden", "Austria", "Portugal", "Netherlands", "Belgium", "Norway"];

const FilterableTable = ({ data, userRole, userBranch, userId, filetypedata, fetchData }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [filetypes, setfiletypes] = useState(filetypedata);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  //--------------------------------------
  const [images, setImages] = useState([]);
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);
  //--------------------------------------

  const [previewurl, setpreviewurl] = useState('');
  //-----------------------------------------

  useEffect(() => {
    let filtered = data;

    if (userRole === 'employee') {
      filtered = filtered.filter(item => item.addedby === userId);
    }
    if (userRole === 'manager') {
      fetch(`/api/branchuser/${userId}`)
        .then(response => response.json())
        .then(branchUsers => {
          setFilteredData(
            branchUsers.filter(item =>
              Object.values(item).some(val =>
                String(val).toLowerCase().includes(filter.toLowerCase())
              )
            )
          );
        })
        .catch(error => {
          console.error('Error fetching branch users:', error);
        });
    } else {
      setFilteredData(
        filtered.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
  }, [filter, data, filetypes, userRole, userId, userBranch]);

  //------------------------Image  Upload----------------
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleAddImage = () => {
    if (!type || !file || images.some(img => img.type === type)) {
      alert('Please select a type and choose an image. Each type must have exactly one image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prevImages => [...prevImages, { base64: reader.result, type }]);
      setType('');
      setFile(null);
      document.getElementById('file-input').value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  //------------------------------------------------------
  const handleAddOrUpdateItem = async (item) => {
    setIsLoading(true);
    const method = item.id ? 'PUT' : 'POST';
    const url = item.id ? `/api/user/${item.id}` : '/api/user';

    const itemToSend = { ...item, addedby: userId, images };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemToSend),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add/update item');
      }
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
      const response = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete item');
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditItem = async (item) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/getimages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: item.Email }),
      });

      const result = await response.json();
      if (response.ok) {
        setImages(result.map(img => ({ base64: `http://admin.applelegal.co/uploads/${img.imgurl}`, type: img.type })));
      } else {
        throw new Error(result.message || 'Failed to fetch files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }

    setCurrentItem({ ...item, uploadedFiles: item.uploadedFiles || [] });
    setIsModalOpen(true);
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setpreviewurl(imageUrl);
      console.log('preview url is:' + previewurl);
      console.log('the url of new image is :'+imageUrl);
      setCurrentItem(current => ({
        ...current,
        imgurl: imageUrl,
        base64: ''
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem(current => ({
          ...current,
          base64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getSectionCompletion = (section) => {
    switch (section) {
      case 'visaDetails':
        return currentItem?.Visa_Type && currentItem?.Visa_Country && currentItem?.status;
      case 'personalDetails':
        return currentItem?.Full_Name && currentItem?.imgurl && currentItem?.addedby && currentItem?.base64 && currentItem?.Passport_No && currentItem?.CNIC_No && currentItem?.Father_Name && currentItem?.Nationality && currentItem?.City && currentItem?.Address && currentItem?.Email && currentItem?.Phone_No1 && currentItem?.Phone_No2 && currentItem?.Gender && currentItem?.Age && currentItem?.Interested_Country;
      case 'educationalDetails':
        return currentItem?.Educational_Activity && currentItem?.List_degree_completed;
      case 'otherDetails':
        return currentItem?.Marital_Status && currentItem?.NTN_No && currentItem?.Employment_Status && currentItem?.Parents_CNIC_No && currentItem?.Birth_Place && currentItem?.Note;
      case 'fileUploads':
        return currentItem?.uploadedFiles?.length > 0;
      default:
        return false;
    }
  };


  const previewimageurl = (previewurl) || (`http://admin.applelegal.co/uploads/`+ currentItem?.imgurl) ;

  return (
    <div className="p-6 bg-white min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-gray-200 shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Files List</h2>
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
                setCurrentItem(null);
                setIsModalOpen(true);
              }}
            >
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
        <div className="grid grid-cols-3 gap-4">
          {filteredData.map((item, index) => (
            <UserDetailsCard
              key={index}
              item={item}
              images={images}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 w-[900px]  rounded-xl  shadow-lg">
            <h2 className="text-2xl mb-4  font-bold">{currentItem?.id ? 'Edit File' : 'Add New File'}</h2>
            <div className='max-h-[80vh] overflow-y-auto'>
              <div className="relative flex">
                <div className="w-1 bg-gray-500 absolute left-4 top-0 bottom-0"></div>
                <div className="flex flex-col items-center mr-11 space-y-[90px]">
                </div>
                <div className="flex-grow space-y-8 pr-5">
                  {/* Visa Details */}
                  <div>
                    <div className={`absolute left-1 w-6 h-6 rounded-full border-black border-2 ml-[1.5px] ${getSectionCompletion('visaDetails') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h3 className="text-xl font-bold">Visa Details</h3>
                    <div className="flex w-full flex-row">
                    <div className="grid grid-cols-2 gap-x-4 ">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Visa Type</label>
                        <select
                          value={currentItem?.Visa_Type || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Visa_Type: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {visaTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Visa Country</label>
                        <select
                          value={currentItem?.Visa_Country || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Visa_Country: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {visaCountries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select value={currentItem?.status} onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })} className="p-2 border border-gray-300 rounded w-full">
                          <option value="" disabled>Select</option>
                          <option value="pending">Pending</option>
                          <option value="initiated">Initiated</option>
                          <option value="processing">Processing</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="ml-7 mx-auto flex justify-center items-center">
                        
                      <img src={ previewimageurl} placeholder='image' className='w-[200px] h-[200px] rounded-xl'/>
                          
                      </div>
                      </div>
                  </div>
                  {/* Personal Information Section */}
                  <div>
                    <div className={`absolute left-1 w-6 h-6 rounded-full border-black border-2 ml-[1.5px] ${getSectionCompletion('personalDetails') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h3 className="text-xl font-bold">Personal Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={currentItem?.Full_Name || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Full_Name: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Passport No</label>
                        <input
                          type="text"
                          value={currentItem?.Passport_No || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Passport_No: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex mb-4">
                        <div className='flex flex-col justify-center'>
{/*                           
                            <img src={ previewimageurl} placeholder='image' className='w-[100px] h-[100px]'/>
                           */}
                          <label className="block text-sm font-medium text-gray-700">Image</label>
                          <input type="file" onChange={handleImageChange} className="p-2 border border-gray-300 rounded w-full" accept="image/*" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNIC No</label>
                        <input
                          type="text"
                          value={currentItem?.CNIC_No || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, CNIC_No: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Father Name</label>
                        <input
                          type="text"
                          value={currentItem?.Father_Name || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Father_Name: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <input
                          type="text"
                          value={currentItem?.Nationality || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Nationality: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          value={currentItem?.City || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, City: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          value={currentItem?.Address || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Address: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={currentItem?.Email || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Email: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone No1</label>
                        <input
                          type="text"
                          value={currentItem?.Phone_No1 || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Phone_No1: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone No2</label>
                        <input
                          type="text"
                          value={currentItem?.Phone_No2 || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Phone_No2: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <input
                          type="text"
                          value={currentItem?.Gender || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Gender: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                          type="text"
                          value={currentItem?.Age || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Age: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Interested Country</label>
                        <input
                          type="text"
                          value={currentItem?.Interested_Country || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Interested_Country: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`absolute left-1 w-6 h-6 rounded-full border-black border-2 ml-[1.5px] ${getSectionCompletion('educationalDetails') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h3 className="text-xl font-bold">Educational Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Educational Activity</label>
                        <input
                          type="text"
                          value={currentItem?.Educational_Activity || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Educational_Activity: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">List of Degrees Completed</label>
                        <input
                          type="text"
                          value={currentItem?.List_degree_completed || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, List_degree_completed: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`absolute left-1 w-6 h-6 rounded-full border-black border-2 ml-[1.5px] ${getSectionCompletion('otherDetails') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h3 className="text-xl font-bold">Other Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <input
                          type="text"
                          value={currentItem?.Marital_Status || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Marital_Status: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">NTN No</label>
                        <input
                          type="text"
                          value={currentItem?.NTN_No || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, NTN_No: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                        <input
                          type="text"
                          value={currentItem?.Employment_Status || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Employment_Status: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Parents CNIC No</label>
                        <input
                          type="text"
                          value={currentItem?.Parents_CNIC_No || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Parents_CNIC_No: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Birth Place</label>
                        <input
                          type="text"
                          value={currentItem?.Birth_Place || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Birth_Place: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Note</label>
                        <textarea
                          value={currentItem?.Note || ''}
                          onChange={(e) => setCurrentItem({ ...currentItem, Note: e.target.value })}
                          className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        ></textarea>
                      </div>
                  </div>
                  {/* File Upload Section */}
                  <div>
                    <div className={`absolute left-1 w-6 h-6 rounded-full border-black border-2 ml-[1.5px] ${getSectionCompletion('fileUploads') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <h3 className="text-xl font-bold mb-2">File Upload</h3>
                    <div className="container mx-auto p-4">
                      <h1 className="text-2xl mb-4">Upload Images</h1>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Image Type</label>
                        <select value={type} onChange={handleTypeChange} className="mt-1 p-2 border border-gray-300 rounded w-full">
                        {filetypes.map((fileType, index) => (
          <option key={index} value={fileType.title}>
            {fileType.title}
          </option>
        ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Choose Image</label>
                        <input type="file" id="file-input" onChange={handleFileChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                      </div>
                      <button
                        onClick={handleAddImage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                      >
                        Add Image
                      </button>
                      <div>
                        <h2 className="text-xl mb-4">Selected Images</h2>
                        <ul className="list-disc pl-5">
                          {images.map((img, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <strong>Type:</strong> {img.type} - <img src={img.base64} alt={img.type} className="w-16 h-16 inline-block" />
                              <button onClick={() => handleRemoveImage(index)} className="text-red-500 hover:text-red-700 ml-4">Remove</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setIsLoading(true);
                          handleAddOrUpdateItem(currentItem);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {currentItem?.id ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;
