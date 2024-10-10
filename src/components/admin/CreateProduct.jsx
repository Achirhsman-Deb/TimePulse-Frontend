import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { TiTick } from "react-icons/ti";
import { Select } from 'antd';
const { Option } = Select;

const CreateProduct = () => {
  const [Catagory, setCatagory] = useState("");
  const [Shipping, setShipping] = useState("");
  const [Success, setSuccess] = useState(false);
  const [catagories, setCatagories] = useState([]);
  const auth = useSelector(state => state.auth);
  const nav = useNavigate();
  const [Products, setProducts] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [photo, setPhoto] = useState("");
  const [extraPhotos, setExtraPhotos] = useState([]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleExtraPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setExtraPhotos([...extraPhotos, ...files]);
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = extraPhotos.filter((_, i) => i !== index);
    setExtraPhotos(updatedPhotos);
  };

  const change = (e) => {
    const { name, value } = e.target;
    setProducts({ ...Products, [name]: value });
  };

  const getCatagory = async () => {
    try {
      const { data } = await axios.get('/api/catagory/get-categories');
      if (data.success) {
        setCatagories(data.catagories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCatagory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const ProductData = new FormData();
      ProductData.append("name", Products.name);
      ProductData.append("description", Products.description);
      ProductData.append("price", Products.price);
      ProductData.append("quantity", Products.quantity);
      ProductData.append("photo", photo);
      ProductData.append("shipping", Shipping);
      ProductData.append("catagory", Catagory);

      extraPhotos.forEach((extraPhoto) => {
        ProductData.append("extraPhotos", extraPhoto);
      });

      const { data } = await axios.post('/api/product/create-product', ProductData, {
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        setSuccess(true);
        setTimeout(() => nav('/Admin-Dashboard/CreateProduct'), 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col items-center h-full w-full p-6 bg-gray-100'>
      <h1 className='text-4xl font-bold mb-8'>Add Product</h1>
      <div className='w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg'>
        <form onSubmit={handleCreate} className='flex flex-col gap-y-6'>
          <Select
            placeholder='Select Category'
            size='large'
            showSearch
            className='w-full mb-4'
            onChange={(value) => { setCatagory(value); }}
          >
            {catagories?.map(c => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>

          {/* Main Photo */}
          <label htmlFor="upload-photo" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-center mb-4'>
            {photo ? photo.name : "Upload Main Photo"}
            <input
              type="file"
              id="upload-photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          {photo && (
            <div className='mb-4'>
              <img src={URL.createObjectURL(photo)} alt='Preview' className='w-full h-40 object-cover rounded-lg border border-gray-300' />
            </div>
          )}

          {/* Extra Photos */}
          <label className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-center mb-4'>
            Upload Extra Photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraPhotosChange}
              className="hidden"
            />
          </label>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            {extraPhotos?.map((extraPhoto, index) => (
              <div key={index} className='relative'>
                <img src={URL.createObjectURL(extraPhoto)} alt='Extra Preview' className='w-full h-40 object-cover rounded-lg border border-gray-300' />
                <button
                  type='button'
                  className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full'
                  onClick={() => handleDeletePhoto(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Other fields */}
          <label className='text-lg font-semibold'>Product Name</label>
          <input
            type="text"
            name='name'
            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3 mb-4'
            placeholder="Adidas shoes"
            onChange={change}
            value={Products.name}
          />

          <label className='text-lg font-semibold'>Product Description</label>
          <textarea
            name='description'
            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3 mb-4'
            placeholder="New stylish shoes"
            onChange={change}
            value={Products.description}
          />

          <label className='text-lg font-semibold'>Price</label>
          <input
            type="number"
            name='price'
            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3 mb-4'
            placeholder="899"
            onChange={change}
            value={Products.price}
          />

          <Select
            placeholder='Select Shipping'
            name='shipping'
            size='large'
            className='w-full mb-4'
            onChange={(value) => { setShipping(value); }}
          >
            <Option value='1'>Yes</Option>
            <Option value='0'>No</Option>
          </Select>

          <label className='text-lg font-semibold'>Net Quantity</label>
          <input
            type="number"
            name='quantity'
            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3 mb-4'
            placeholder="100, 200..."
            onChange={change}
            value={Products.quantity}
          />

          <button
            type='submit'
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full'
          >
            Create Product
          </button>

          {Success && (
            <div className='flex items-center bg-green-100 text-green-700 p-4 rounded-lg mt-4'>
              <TiTick size={24} className='mr-2' />
              Product successfully added!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
