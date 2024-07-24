function FileTypeModal({ isOpen, onClose, onSave, item }) {
    const [title, setTitle] = useState(item ? item.title : '');
  
    useEffect(() => {
      setTitle(item ? item.title : ''); // Reset title when item changes
    }, [item]);
  
    const handleSubmit = () => {
      onSave({ ...item, title });
      onClose(); // Close modal after save
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-xl mb-4">{item ? 'Edit File Type' : 'Add New File Type'}</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
  