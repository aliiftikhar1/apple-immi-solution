'use client'
import { useState } from 'react';

export default function Convert() {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [imageFromBase64, setImageFromBase64] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBase64Input = (e) => {
    const value = e.target.value;
    setBase64Input(value);
    setImageFromBase64(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Image to Base64 and Base64 to Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image to Base64 */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Image to Base64</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            {image && (
              <div className="mb-4">
                <img src={image} alt="Uploaded" className="max-w-full h-auto" />
              </div>
            )}
            {base64 && (
              <div className="bg-gray-200 p-4 rounded">
                <p className="break-words">
                  <strong>Base64:</strong> 
                  <textarea className='h-[200px] w-full'>
                  {base64}
                  </textarea>
                  
                 
                </p>
              </div>
            )}
          </div>

          {/* Base64 to Image */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Base64 to Image</h3>
            <textarea
              value={base64Input}
              onChange={handleBase64Input}
              rows="6"
              className="w-full p-2 border rounded mb-4"
              placeholder="Paste Base64 string here..."
            ></textarea>
            {imageFromBase64 && (
              <div className="mb-4">
                <img src={imageFromBase64} alt="Base64 Converted" className="max-w-full h-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
