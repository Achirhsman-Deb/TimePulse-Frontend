import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TiTick } from 'react-icons/ti';
import { FaTrash } from 'react-icons/fa';

const UsersCheck = () => {
  const [success, setSuccess] = useState(false);
  const [photo1, setPhoto1] = useState(""); // For mobile view image
  const [photo2, setPhoto2] = useState(""); // For desktop view image
  const [image, setImage] = useState({
    name: "",
    link: "",
  });
  const [images, setImages] = useState([]);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    // Fetch existing images when the component mounts
    const fetchImages = async () => {
      try {
        const { data } = await axios.get('/api/image/get-image');
        if (data.success) {
          setImages(data.images || []);
        }
      } catch (error) {
        console.log(error);
        setImages([]);
      }
    };
    fetchImages();
  }, []);

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'mobile') {
        setPhoto1(file);
      } else {
        setPhoto2(file);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImage({ ...image, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", image.name);
      formData.append("link", image.link);
      formData.append("photo1", photo1); // Mobile view image
      formData.append("photo2", photo2); // Desktop view image

      const { data } = await axios.post('/api/image/new-image', formData, {
        headers: {
          Authorization: auth.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (data.success) {
        setSuccess(true);
        setImages([...images, data.image]);
        setImage({ name: "", link: "" });
        setPhoto1("");
        setPhoto2("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/image/del-image/${id}`, {
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        setImages(images.filter(image => image._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col h-full w-full gap-y-8 mb-24 p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Add Banners</h1>
      <div className='flex flex-col md:flex-row gap-6 mb-8'>
        <div className='flex flex-col flex-1'>
          <label htmlFor="upload-photo1" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-center'>
            {photo1 ? photo1.name : "Upload Mobile View Photo"}
            <input
              type="file"
              id="upload-photo1"
              name="photo1"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, 'mobile')}
              className="hidden"
            />
          </label>
          {photo1 && (
            <div className='mt-4'>
              <img src={URL.createObjectURL(photo1)} alt='Mobile Preview' className='w-full h-32 object-cover rounded-lg shadow-lg' />
            </div>
          )}
        </div>
        <div className='flex flex-col flex-1'>
          <label htmlFor="upload-photo2" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-center'>
            {photo2 ? photo2.name : "Upload Desktop View Photo"}
            <input
              type="file"
              id="upload-photo2"
              name="photo2"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e, 'desktop')}
              className="hidden"
            />
          </label>
          {photo2 && (
            <div className='mt-4'>
              <img src={URL.createObjectURL(photo2)} alt='Desktop Preview' className='w-full h-32 object-cover rounded-lg shadow-lg' />
            </div>
          )}
        </div>
      </div>
      <form className='flex flex-col gap-6 mb-8'>
        <div>
          <label className='block text-lg font-medium mb-2'>Image Name</label>
          <input
            type="text"
            name='name'
            className='bg-gray-100 border border-gray-300 text-gray-700 text-lg rounded-lg block w-full p-3'
            placeholder="Adidas shoes"
            onChange={handleInputChange}
            value={image.name}
          />
        </div>
        <div>
          <label className='block text-lg font-medium mb-2'>Image Link</label>
          <input
            type="text"
            name='link'
            className='bg-gray-100 border border-gray-300 text-gray-700 text-lg rounded-lg block w-full p-3'
            placeholder="https://example.com"
            onChange={handleInputChange}
            value={image.link}
          />
        </div>
        <div className='flex justify-end gap-4'>
          <button
            type='submit'
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg'
            onClick={handleCreate}
          >
            Add Image
          </button>
          {success && (
            <span className='flex items-center bg-green-100 text-green-700 py-3 px-6 rounded-lg'>
              <TiTick size={24} /> <span className='ml-2'>Images successfully added</span>
            </span>
          )}
        </div>
      </form>

      <h2 className='text-3xl font-bold mb-6'>Current Images</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {images?.length > 0 ? (
          images?.map(image => (
            <div key={image._id} className='relative bg-white rounded-lg shadow-lg overflow-hidden'>
              <img src={image.image1} alt={image.name} className='w-full h-48 object-cover' />
              <img src={image.image2} alt={`${image.name} Desktop`} className='w-full h-48 object-cover absolute top-0 left-0 opacity-50' />
              <button
                onClick={() => handleDelete(image._id)}
                className='absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full'
              >
                <FaTrash />
              </button>
              <p className='text-center mt-2 font-semibold'>{image.name}</p>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No images available</p>
        )}
      </div>
    </div>
  );
};

export default UsersCheck;
