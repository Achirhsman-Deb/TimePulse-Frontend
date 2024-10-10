import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate
import { FaArrowLeft } from 'react-icons/fa';  // Import FontAwesome's back arrow icon

const OrderDetails = () => {
    const { orderId } = useParams();
    const auth = useSelector(state => state.auth);
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();  // Initialize useNavigate hook

    const HandleCancel = async (id) => {
        try {
            await axios.post(`/api/product/cancelOrder/${id}`);
            fetchOrderDetails();
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const { data } = await axios.get(`/api/user/order/${orderId}`, {
                headers: {
                    Authorization: auth.token,  // Ensure to use Bearer token
                }
            });
            console.log(data.order)
            setOrder(data.order);
        } catch (error) {
            console.error('Error fetching order details', error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId, auth.token]);

    if (!order) {
        return (
            <div className='flex flex-col space-y-6 p-6 bg-gray-100 min-h-screen'>
                <button
                    className="flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 shadow-md w-fit p-3 rounded-md"
                    onClick={() => navigate(-1)}  // Navigate to the previous page
                >
                    <FaArrowLeft className="text-xl" /> {/* Back icon */}
                </button>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col space-y-6 p-6 bg-gray-100 min-h-screen">

            {/* Back button at the top left */}
            <button
                className="flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 shadow-md w-fit p-3 rounded-md"
                onClick={() => navigate(-1)}  // Navigate to the previous page
            >
                <FaArrowLeft className="text-xl" /> {/* Back icon */}
            </button>

            {/* Product Information */}
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Product Details</h3>
                {order?.products?.map((product) => (
                    <div className="flex items-center space-x-4 pb-4" key={product._id}>
                        <img src={product.photo} alt={product.name} className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <h4 className="text-lg font-medium">{product.name}</h4>
                            <p className="text-sm">Quantity: {product.quantity}</p>
                            <p className="text-sm">Price: ${product.price}</p>
                        </div>
                    </div>
                ))}
                {(order.status === 'Not Process' || order.status === 'Processing') && (
                    <button
                        className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300'
                        onClick={(e) => {
                            HandleCancel(order._id);
                        }}
                    >
                        Cancel Order
                    </button>
                )}
            </div>

            {/* Order Status with Progress Bar */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold">Order Status</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${getProgress(order.status)}%` }}
                    />
                </div>
                <p className='text-lg mt-2'>{order.status}</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold">Delivery Address</h3>
                <p className="text-sm mt-3">{order.address}</p>
            </div>

            {/* Bill Information */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold">Bill</h3>
                <div className="flex justify-between mt-3">
                    <p className="text-sm">Subtotal:</p>
                    <p className="text-sm">₹{order.price}</p>
                </div>
            </div>
        </div>
    );
};

// Helper function to get progress percentage based on order status
const getProgress = (status) => {
    const progressMap = {
        'Not Process': 5,
        'Processing': 40,
        'Shipped': 70,
        'Delivered': 100,
        'Cancelled': 0,
    };

    return progressMap[status] || 0;
};

export default OrderDetails;
