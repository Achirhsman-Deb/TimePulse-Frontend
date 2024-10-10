import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Forgotpass_Component = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        question: "",
        newPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/user/forgotPassword`, inputs);
            if (res.data.success) {
                alert("Password reset successful.");
                navigate('/Login');
            } else {
                alert("Incorrect email or answer.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className='h-screen w-full flex items-center justify-center bg-gray-100'>
            <div className='flex flex-col items-center p-8 w-full max-w-md bg-white rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>Password Reset</h1>
                <form className='w-full flex flex-col gap-y-4' onSubmit={handleSubmit}>
                    <label className='flex flex-col'>
                        <span className='text-lg font-medium text-gray-700'>Email</span>
                        <input
                            type="email"
                            name='email'
                            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3'
                            placeholder="example@gmail.com"
                            onChange={handleChange}
                            value={inputs.email}
                            required
                        />
                    </label>
                    <label className='flex flex-col'>
                        <span className='text-lg font-medium text-gray-700'>Your Best Friend's Name?</span>
                        <input
                            type="text"
                            name='question'
                            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3'
                            placeholder="Security question answer"
                            onChange={handleChange}
                            value={inputs.question}
                            required
                        />
                    </label>
                    <label className='flex flex-col'>
                        <span className='text-lg font-medium text-gray-700'>New Password</span>
                        <input
                            type="password"
                            name='newPassword'
                            className='bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-3'
                            placeholder='New password'
                            onChange={handleChange}
                            value={inputs.newPassword}
                            required
                        />
                    </label>
                    <button
                        type='submit'
                        className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-6'
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Forgotpass_Component;
