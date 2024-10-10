import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [status, setStatus] = useState(['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
    const [orders, setOrders] = useState([]);
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/user/all-orders', {
                headers: {
                    Authorization: auth.token
                }
            });
            console.log(data);
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    const HandleChangeStatus = async (value, orderId) => {
        try {
            await axios.put(`/api/user/change-status/${orderId}`, {
                status: value
            }, {
                headers: {
                    Authorization: auth.token
                }
            });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token]);

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {orders?.length > 0 ? (
                <div className="space-y-4">
                    {orders?.map((order, i) => (
                        <div key={order._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200" onClick={() => navigate(`../OrderDetailsAdmin/${order._id}`)}>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Order ID:</span>
                                    <span>{order._id}</span>
                                </div>
                                <Select
                                    bordered={false}
                                    onChange={(value) => HandleChangeStatus(value, order._id)}
                                    defaultValue={order.status}
                                    className="w-full md:w-1/3"
                                >
                                    {status?.map((s, i) => (
                                        <Option key={i} value={s}>
                                            {s}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-start">
                                <div className="w-full md:w-1/3">
                                    <span className="font-semibold">Order Date:</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full md:w-1/3">
                                    <span className="font-semibold">Payment Status:</span>
                                    <span>{order?.payment ? 'Payment Complete' : 'Payment Incomplete'}</span>
                                </div>
                                <div className="w-full md:w-1/3">
                                    <span className="font-semibold">Buyer:</span>
                                    <span>{order.buyer.name}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="font-semibold">Products:</span>
                                <ul className="list-disc pl-5">
                                    {order?.products?.map((product) => (
                                        <li key={product._id}>
                                            <p className="font-semibold">Name: {product.name}</p>
                                            <p>Price: ${product.price}</p>
                                            <p>Quantity: {product.quantity}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {order.cancelReq && (<div className='mt-1 text-red-600'>
                                Requested to be Cancelled
                            </div>)}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Orders;
