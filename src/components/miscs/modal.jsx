import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(confirmPassword);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 md:w-1/3'>
        <h2 className='text-xl mb-4'>Confirm Password</h2>
        <form onSubmit={handleSubmit}>
          <label className='block mb-4'>
            <span className='text-sm'>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='bg-gray-200 border border-blue-700 text-black text-sm rounded-lg block w-full p-2.5'
              placeholder="Enter your password"
              required
            />
          </label>
          <div className='flex gap-x-4'>
            <button
              type='submit'
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
            >
              Confirm
            </button>
            <button
              type='button'
              onClick={onClose}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
