'use client'
import { useState } from 'react';

const UploadImages = () => {
  const [images, setImages] = useState([]);
  const [type, setType] = useState('');
  const [file, setFile] = useState(null);

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

  const handleSubmit = async () => {
    if (images.length !== 3) {
      alert('Please add exactly three images: CNIC, Passport, and Letter');
      return;
    }

    const userId = 'SomeUserId'; // Replace with actual user ID if available

    try {
      const response = await fetch('/api/uploadimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userId, images }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Images uploaded successfully');
        setImages([]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Upload Images</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Image Type</label>
        <select value={type} onChange={handleTypeChange} className="mt-1 p-2 border border-gray-300 rounded w-full">
          <option value="">Select Type</option>
          <option value="CNIC">CNIC</option>
          <option value="Passport">Passport</option>
          <option value="Letter">Letter</option>
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
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit
      </button>
    </div>
  );
};

export default UploadImages;
