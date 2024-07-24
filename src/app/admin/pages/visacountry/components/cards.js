import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaDownload, FaTimes, FaPrint } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const UserDetailsCard = ({ item, handleEditItem, handleDeleteItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
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
          setUploadedFiles(result);
        } else {
          throw new Error(result.message || 'Failed to fetch files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    if (isModalOpen) {
      fetchFiles();
    }
  }, [isModalOpen, item.Email]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //--------------------
  const handleDownload = async (url, filename) => {
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up the object URL after the download
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  
  
  
  
  //--------------------
  const printUserDetails = () => {
    const printContent = document.getElementById(`print-content-${item.id}`).innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .print-content { padding: 20px; }
            .print-content h2 { font-size: 24px; margin-bottom: 0px; }
            .print-content .header { display: flex;  margin-bottom: 20px; }
            .print-content .header img { width: 150px; height: 150px; object-fit: cover; margin-right: 20px; }
            .print-content .details { margin-left:50px; }
            .print-content .details p { margin: 0; font-size: 18px; }
            .print-content .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .print-content .column { padding: 10px; box-sizing: border-box; }
            .print-content .column table { width: 100%; border-collapse: collapse; }
            .print-content .column table, .print-content .column th, .print-content .column td { text-align:right;  }
            .print-content .column th, .print-content .column td { padding: 8px; text-align: left; }
            .print-content ul { list-style-type: disc; padding-left: 20px; }
          </style>
        </head>
        <body>
          <div class="print-content">
            <div class="header">
              <img src="https://appstore.store2u.ca/uploads/${item.imgurl}" alt="User Profile" />
              <div class="details">
                <h2>${item.Full_Name}</h2>
                <p>Branch: ${item.branch}</p>
                <p>Status: ${item.status}</p>
              </div>
            </div>
            <div class="grid">
              <div class="column">
                <h3>Personal & Visa Details</h3>
                <table>
                  <tbody>
                    ${Object.entries(item).filter(([key]) => 
                      key.includes('Name') || key.includes('No') || key === 'Email' || key.includes('Visa')).map(([key, value]) => `
                      <tr>
                        <th>${key.replace('_', ' ')}</th>
                        <td>${value}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <div class="column">
                <h3>Educational & Other Details</h3>
                <table>
                  <tbody>
                    ${Object.entries(item).filter(([key]) => 
                      !key.includes('Name') && !key.includes('No') && key !== 'Email' && !key.includes('Visa') && key !== 'imgurl' && key !== 'imageurl').map(([key, value]) => `
                      <tr>
                        <th>${key.replace('_', ' ')}</th>
                        <td>${value}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };



  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative p-4">
      <div className="flex justify-center items-center p-4 border-b">
        <div className='flex flex-col justify-center items-center'>
          <img className='w-[150px] h-[150px] rounded-full mr-4 object-cover' src={`https://appstore.store2u.ca/uploads/${item.imgurl}`} alt="User Profile" />
          <div className='text-center py-2'>
            <h2 className="text-2xl font-semibold">{item.Full_Name}</h2>
            <p className="text-sm text-gray-500 flex justify-center items-center">{item.status}
              {item.status === 'processing' && (
                <div className='rounded-full bg-orange-500 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
              {item.status === 'initiated' && (
                <div className='rounded-full bg-blue-500 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
              {item.status === 'pending' && (
                <div className='rounded-full bg-yellow-500 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
              {item.status === 'Rejected' && (
                <div className='rounded-full bg-red-500 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
              {item.status === 'approved' && (
                <div className='rounded-full bg-green-300 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
              {item.status === 'completed' && (
                <div className='rounded-full bg-green-600 w-[10px] h-[10px] mx-2 my-2'></div>
              )}
            </p>
            <p className="text-sm text-gray-500">{item.Visa_Type}</p>
            <p className="text-sm text-gray-500">{item.Address}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-center items-center">
        <button onClick={openModal} className="px-4 py-2 bg-white border-blue-500 border-2 text-blue-500 rounded-full hover:text-white hover:bg-blue-600 flex items-center focus:outline-none">
          <FaEye className="mr-2" /> View Details
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div id={`print-content-${item.id}`} className="hidden print:block">
              <div class="header">
                <img src={`https://appstore.store2u.ca/uploads/${item.imgurl}`} alt="User Profile" style={{ objectFit: 'cover' }} />
                <h2>${item.Full_Name}</h2>
              </div>
              <div class="grid">
                <div class="column">
                  <h3>Personal Details</h3>
                  <table>
                    <tbody>
                      ${Object.entries(item).filter(([key]) => key.includes('Name') || key.includes('No') || key === 'Email').map(([key, value]) => `
                        <tr>
                          <th>${key.replace('_', ' ')}</th>
                          <td>${value}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                <div class="column">
                  <h3>Other Details</h3>
                  <table>
                    <tbody>
                      ${Object.entries(item).filter(([key]) => !key.includes('Name') && !key.includes('No') && key !== 'Email').map(([key, value]) => `
                        <tr>
                          <th>${key.replace('_', ' ')}</th>
                          <td>${value}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Tabs>
              <TabList>
                <Tab>Personal & Visa Details</Tab>
                <Tab>Education & Other Details</Tab>
                <Tab>Uploaded Documents</Tab>
              </TabList>
              <div className='h-[70vh] overflow-y-auto'>
              <TabPanel>
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <tbody>
                    {Object.entries(item).filter(([key]) => key.includes('Name') || key.includes('No') || key === 'Email' || key.includes('Visa')).map(([key, value]) => (
                      <tr key={key}>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{key.replace('_', ' ')}</th>
                        <td className="px-6 py-4 whitespace-nowrap">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel>
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <tbody>
                    {Object.entries(item).filter(([key]) => !key.includes('Name') && !key.includes('No') && key !== 'Email' && !key.includes('Visa')).map(([key, value]) => (
                      <tr key={key}>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{key.replace('_', ' ')}</th>
                        <td className="px-6 py-4 whitespace-nowrap">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel>
              <div className="grid grid-cols-2 gap-4">
    {uploadedFiles.map((file, index) => (
      <div key={index} className="flex flex-col items-center border rounded p-2">
        <img src={`https://appstore.store2u.ca/uploads/${file.imgurl}`} alt={file.image_name} className="w-full h-48 object-cover mb-2" />
        <p className="text-sm">{file.image_name}</p>
        <div className="flex mt-2">
          <a href={`https://appstore.store2u.ca/uploads/${file.imgurl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline px-2">
            <FaEye />
          </a>
          <button onClick={() => handleDownload(`https://appstore.store2u.ca/uploads/${file.imgurl}`, file.type)} className="text-green-500 hover:underline px-2">
            <FaDownload />
          </button>
        </div>
      </div>
    ))}
  </div>

              </TabPanel>
              </div>
            </Tabs>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={printUserDetails} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center focus:outline-none">
                <FaPrint className="mr-2" /> Print
              </button>
              <button onClick={() => { closeModal(); setTimeout(() => handleEditItem(item), 0);}} className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 flex items-center focus:outline-none">
                <FaEdit className="mr-2" /> Edit
              </button>
              <button onClick={() => handleDeleteItem(item.id)} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center focus:outline-none">
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsCard;
