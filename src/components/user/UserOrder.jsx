import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserOrder = () => {
  const auth = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/user/orders', {
        headers: {
          Authorization: auth?.token,
        }
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <div className="mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>
      {orders?.length > 0 ? (
        <div className="space-y-6">
          {orders?.map((order, i) => (
            <div
              key={order._id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 space-y-4 cursor-pointer"
              onClick={() => navigate(`../OrderDetails/${order._id}`)} // Navigate to the order details page
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                <span className="text-lg font-semibold">Order #{i + 1}</span>
                <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Order Info */}
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Order ID:</span> {order._id}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Status:</span> {order.status}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Buyer:</span> {order.buyer.name}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Payment:</span> {order.payment ? 'Complete' : 'Incomplete'}
                </div>
              </div>

              {/* Products List */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold mb-2">Products Purchased:</h3>
                {order?.products?.length > 0 ? (
                  <div className="space-y-2">
                    {order?.products?.map((product) => (
                      <div key={product._id} className="flex items-center space-x-4">
                        <img
                          src={product.photo}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-xs text-gray-600">Quantity: {product.quantity}</p>
                          <p className="text-xs text-gray-600">Price: ₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No products found.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrder;
