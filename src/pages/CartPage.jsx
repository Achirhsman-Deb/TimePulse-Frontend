import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MdRemoveShoppingCart } from "react-icons/md";
import { cartActions } from '../store';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRatings from 'react-star-ratings';

const originalConsoleError = console.error;

// console.error = (message, ...args) => {
//     if (message.includes('findDOMNode is deprecated')) {
//         return;
//     }
//     // Call the original console.error method with the message and any other arguments
//     originalConsoleError(message, ...args);
// };

const CartPage = () => {
    const auth = useSelector(state => state.auth);
    const cartState = useSelector(state => state.cart);
    const isLoggedIn = auth?.token && auth?.user?.name;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [clientToken, setClientToken] = useState("");
    const [checkoutButton, setCheckoutButton] = useState(false);
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleRemoveFromCart = (itemId, e) => {
        e.preventDefault(); // Prevent link navigation
        dispatch(cartActions.removeFromCart(itemId));
    };

    const calculateTotalAmt = () => {
        try {
            let total = 0;
            cartState?.forEach(item => { total += item.price * item.quantity });
            return total.toLocaleString("en-IN", {
                style: 'currency',
                currency: 'INR'
            });
        } catch (error) {
            console.log(error);
        }
    }

    const calculateTotalItems = () => {
        try {
            return cartState?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    };

    const getToken = async () => {
        try {
            const { data } = await axios.get('/api/product/braintree/token');
            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`/api/product/braintree/payment`, {
                cart: cartState, nonce
            }, {
                headers: {
                    Authorization: auth?.token
                }
            });
            console.log(data);
            if (data) {
                setLoading(false);
                dispatch(cartActions.clearCart());
                setCheckoutButton(false);
                setPaymentSuccess(true);
                toast.success("Payment successful!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setCheckoutButton(false);
        }
    }

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    return (
        <Layout>
            <ToastContainer />
            <div className='min-h-[89vh] pt-12 flex flex-col p-5 md:p-10 bg-white'>
                <div className='w-full text-center pt-6 md:pt-12 text-xl md:text-2xl'>
                    {cartState?.length > 0 ? (
                        <div className='flex flex-col md:flex-row justify-around'>
                            {checkoutButton ? (
                                <div className='w-full flex justify-center'>
                                    <div className='w-full md:w-[50vw] bg-white shadow-lg rounded-lg p-7'>
                                        <DropIn
                                            options={{ authorization: clientToken }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />
                                        <button
                                            className='p-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded mt-4 transition duration-300 ease-in-out'
                                            onClick={handlePayment}
                                            disabled={!auth?.user?.address || loading || !instance}
                                        >
                                            {loading ? 'Processing...' : 'Make Payment'}
                                        </button>
                                        <button
                                            className='p-3 w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded mt-4 transition duration-300 ease-in-out'
                                            onClick={() => { setCheckoutButton(false); }}
                                        >
                                            Cancel Payment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5'>
                                        {cartState?.map((item) => (
                                            <div key={item.id} className='relative bg-white shadow-lg rounded-lg overflow-hidden'>
                                                <Link to={`../Product/${item.slug}`} className='block'>
                                                    <img
                                                        src={item.photo}
                                                        alt={item.name}
                                                        className='w-full h-48 object-cover transform hover:scale-105 transition duration-300'
                                                    />
                                                    <div className='p-4'>
                                                        <h2 className='text-lg md:text-xl font-bold mb-2'>{item.name}</h2>
                                                        <div className='mb-2'>
                                                            <StarRatings
                                                                rating={item.averageRating || 0}
                                                                starRatedColor="yellow"
                                                                numberOfStars={5}
                                                                starDimension="20px"
                                                                starSpacing="2px"
                                                            />
                                                        </div>
                                                        <p className='text-gray-900 font-semibold'>₹{item.price}</p>
                                                    </div>
                                                </Link>
                                                <button
                                                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
                                                    onClick={(e) => handleRemoveFromCart(item.id, e)}
                                                >
                                                    <MdRemoveShoppingCart />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex flex-col gap-y-5 mt-5 md:mt-0'>
                                        <div className='flex flex-col h-fit w-full md:w-[40vw] bg-white shadow-lg rounded-lg p-7 items-start'>
                                            <p className='text-2xl md:text-4xl mb-3 font-bold'>Cart Summary</p>
                                            <p className='text-lg md:text-xl mb-2'>Items: {calculateTotalItems()}</p>
                                            <p className='text-lg md:text-xl mb-6'>Total: {calculateTotalAmt()}</p>
                                            {isLoggedIn ? (
                                                <button
                                                    className='p-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded transition duration-300 ease-in-out'
                                                    onClick={() => { setCheckoutButton(true); }}
                                                    disabled={!auth?.user?.address}
                                                >
                                                    Checkout
                                                </button>
                                            ) : (
                                                <p className='text-red-500'>Login to checkout</p>
                                            )}
                                        </div>
                                        <div className='flex flex-col h-fit w-full md:w-[40vw] bg-white shadow-lg rounded-lg p-7'>
                                            <div className='mb-4'>
                                                <p className='text-xl md:text-3xl mb-2 font-bold'>Address</p>
                                                <p className='text-lg md:text-xl'>{auth?.user?.address || "No address provided"}</p>
                                            </div>
                                            {isLoggedIn ? (
                                                <button
                                                    className='p-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded transition duration-300 ease-in-out'
                                                    onClick={() => { navigate('/Dashboard/protected/Profile') }}
                                                >
                                                    Change Address
                                                </button>
                                            ) : (
                                                <p className='text-red-500'>Login to change address</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-center flex-col gap-y-3 text-3xl'>
                            <img
                                src={`https://res.cloudinary.com/duyv9y7fc/image/upload/v1724345777/UI/jmow7wfp2iehcykrori3.jpg`}
                                className='w-[150px] md:w-[300px] h-[150px] md:h-[300px]'
                            />
                            <p>Your Cart Is Empty!</p>
                            <Link to='/' className='w-fit text-lg md:text-xl text-blue-500 hover:text-blue-600 underline'>
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
