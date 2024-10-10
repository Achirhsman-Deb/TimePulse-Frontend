import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';

const CreateCatagory = () => {
  const [catagories, setCatagories] = useState([]);
  const [images, setImages] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const auth = useSelector(state => state.auth);
  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  }
  const handlePhotoChange = async(e) =>{
    const file = e.target.files[0];
    if(file){
      setImages(file);
    }
    console.log(images);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", images);
    try{
      const { data } = await axios.post("/api/catagory/create-catagory", formData ,{
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        console.log("success");
        getCatagory();
        setImages("");
        setName("");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const handleSave = async (id) => {
    try {
      console.log(editingName);
      const { data } = await axios.put(`/api/catagory/update-catagory/${id}`, {
        name: editingName,
      }, {
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        setEditingId(null);
        getCatagory();
      }
    } catch (error) {
      console.log(error);
    }
  }

  

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/catagory/delete-catagory/${id}`, {
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        getCatagory();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCatagory = async () => {
    try {
      const { data } = await axios.get('/api/catagory/get-categories');
      if (data.success) {
        setCatagories(data.catagories);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCatagory();
  }, []);

  return (
    <div className='flex flex-col h-[100%] w-[100%] gap-y-5 p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-5xl mb-[10vh]'>Manage Catagories</h1>
      <label htmlFor="upload-photo" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-center mb-4'>
          {images ? images.name : "Upload Photo"}
          <input
            type="file"
            id="upload-photo"
            name="photo"
            accept="image/*"
            onChange={(e) =>handlePhotoChange(e)}
            className="hidden"
          />
        </label>
      <div className='p-3 w-[50%]'>
        <form className='flex gap-x-6'>  
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter new name' className='bg-[#dfdfdf] border border-[#302899] text-black text-sm rounded-lg block w-[30vw] p-2.5' />
          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSubmit}>New Catagory</button>
        </form>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catagories?.map((category) => (
            <tr key={category._id} className="border-t">
              <td className="px-4 py-2 text-xl">
                {editingId === category._id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className='bg-[#dfdfdf] border border-[#302899] text-black text-sm rounded-lg block w-full p-2.5'
                  />
                ) : (
                  category.name
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2 justify-center">
                {editingId === category._id ? (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleSave(category._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEdit(category._id, category.name)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CreateCatagory
