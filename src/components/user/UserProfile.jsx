import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../miscs/modal';
import { authActions } from '../../store/index';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { user, token } = auth;

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    question: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUser = () => {
    try {
      setInputs({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        question: user.question || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleUpdate = async (confirmPassword) => {
    setIsModalOpen(false);
    try {
      const res = await axios.post(
        `/api/user/update-auth`,
        { ...inputs, password: confirmPassword },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      if (res.data.success) {
        setInputs({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          question: res.data.question,
        });
        dispatch(authActions.updateUser(res.data.UpdatedUser));
        toast.success('Details Updated!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('Error!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('Error!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className='flex flex-col h-full p-6 sm:p-8 md:p-12 lg:p-16 w-full gap-y-8 bg-gray-100'>
      <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center text-black'>Update Profile</h1>
      <form className='flex flex-col gap-y-6 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg w-[90%]' onSubmit={handleSubmit}>
        <label className='flex flex-col'>
          <span className='text-lg md:text-xl font-medium text-blue-900'>Username</span>
          <input
            type="text"
            name='name'
            className='bg-blue-50 border border-blue-700 text-blue-900 text-sm md:text-base rounded-lg block w-full p-3 mt-2'
            placeholder="Your name"
            onChange={handleChange}
            value={inputs.name}
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-lg md:text-xl font-medium text-blue-900'>Email <span className='text-xs text-gray-500'>(You cannot change this)</span></span>
          <input
            type="text"
            name='email'
            className='bg-blue-50 border border-blue-700 text-blue-900 text-sm md:text-base rounded-lg block w-full p-3 mt-2'
            placeholder="Your email"
            onChange={handleChange}
            value={inputs.email}
            disabled
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-lg md:text-xl font-medium text-blue-900'>Phone</span>
          <input
            type="text"
            name='phone'
            className='bg-blue-50 border border-blue-700 text-blue-900 text-sm md:text-base rounded-lg block w-full p-3 mt-2'
            placeholder="Your phone number"
            onChange={handleChange}
            value={inputs.phone}
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-lg md:text-xl font-medium text-blue-900'>Address</span>
          <textarea
            type="text"
            name='address'
            className='bg-blue-50 border border-blue-700 text-blue-900 text-sm md:text-base rounded-lg block w-full p-3 mt-2'
            placeholder="Your address"
            onChange={handleChange}
            value={inputs.address}
          />
        </label>
        <label className='flex flex-col'>
          <span className='text-lg md:text-xl font-medium text-blue-900'>Your Best Friend's Name?</span>
          <input
            type="text"
            name='question'
            className='bg-blue-50 border border-blue-700 text-blue-900 text-sm md:text-base rounded-lg block w-full p-3 mt-2'
            placeholder="Security question"
            onChange={handleChange}
            value={inputs.question}
          />
        </label>
        <button
          type='submit'
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mt-6'
        >
          Update Details
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdate}
        initialPassword={inputs.password} // Pass the initial password to the modal
      />
      <ToastContainer/>
    </div>
  );
};

export default UserProfile;
