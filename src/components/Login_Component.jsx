import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';
import { toast, ToastContainer } from 'react-toastify';

const AuthComponent = () => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        question: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/user/login`, { email: inputs.email, password: inputs.password });
            if (res.data.success) {
                dispatch(authActions.login({
                    user: res.data.user,
                    token: res.data.token,
                    role: res.data.user.role
                }));
                toast.success(`Welcome ${res.data.user.name}!`, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => navigate(location.state || '/'), 1000);
            } else {
                toast.warning('Password or Email is not correct', {
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
            toast.error('Error', {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log(error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/user/register`, inputs);
            console.log('Register Response:', res.data); // Debugging line
            if (res.data.success) {
                dispatch(authActions.login({
                    user: res.data.user,
                    token: res.data.token,
                    role: res.data.user.role
                }));
                toast.success(`Welcome ${res.data.user.name}!`, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => navigate(location.state || '/'), 1000);
            } else {
                toast.warning('Please fill the form correctly!', {
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
            console.log('Error during signup:', error); // Debugging line
        }
    };

    return (
        <section className='flex items-center justify-center min-h-screen bg-gray-100 p-6'>
            <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-300'>
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>{isLogin ? 'Log In' : 'Sign Up'}</h1>
                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-1' htmlFor='email'>Email</label>
                        <input
                            type="email"
                            name='email'
                            id='email'
                            className='w-full border border-gray-300 rounded-lg p-2.5'
                            placeholder="you@example.com"
                            onChange={handleChange}
                            value={inputs.email}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <>
                            <div className='mb-4'>
                                <label className='block text-gray-700 mb-1' htmlFor='name'>Username</label>
                                <input
                                    type="text"
                                    name='name'
                                    id='name'
                                    className='w-full border border-gray-300 rounded-lg p-2.5'
                                    placeholder='Your username'
                                    onChange={handleChange}
                                    value={inputs.name}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700 mb-1' htmlFor='phone'>Phone</label>
                                <input
                                    type="text"
                                    name='phone'
                                    id='phone'
                                    className='w-full border border-gray-300 rounded-lg p-2.5'
                                    placeholder='Your phone number'
                                    onChange={handleChange}
                                    value={inputs.phone}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700 mb-1' htmlFor='address'>Address</label>
                                <input
                                    type="text"
                                    name='address'
                                    id='address'
                                    className='w-full border border-gray-300 rounded-lg p-2.5'
                                    placeholder='Your address'
                                    onChange={handleChange}
                                    value={inputs.address}
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700 mb-1' htmlFor='question'>Your Best Friend's Name?</label>
                                <input
                                    type="text"
                                    name='question'
                                    id='question'
                                    className='w-full border border-gray-300 rounded-lg p-2.5'
                                    placeholder='Security question'
                                    onChange={handleChange}
                                    value={inputs.question}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-1' htmlFor='password'>Password</label>
                        <input
                            type="password"
                            name='password'
                            id='password'
                            className='w-full border border-gray-300 rounded-lg p-2.5'
                            placeholder='Your password'
                            onChange={handleChange}
                            value={inputs.password}
                            required
                        />
                    </div>
                    {isLogin && (
                        <div className='text-center mb-4'>
                            <NavLink className='text-blue-600 hover:underline' to='/Forgot-Password'>
                                Forgot password?
                            </NavLink>
                        </div>
                    )}
                    <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    <div className='text-center mt-4'>
                        <p className='text-gray-600'>
                            {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
                            <button
                                type='button'
                                className='text-blue-600 hover:underline'
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </section>
    );
};

export default AuthComponent;
