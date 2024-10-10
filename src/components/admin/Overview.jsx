import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SalesGraph from '../miscs/SalesGraph';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const auth = useSelector(state => state.auth);
  const [SalesMonth, setSalesMonth] = useState("");
  const [PendingOrders, setPendingOrders] = useState("");
  const [ReviewsCount, setReviewsCount] = useState("");
  const [MostSoldProduct, setMostSoldProduct] = useState(null);
  const [MostSoldProductCount, setMostSoldProductCount] = useState("");
  const navigate = useNavigate();

  const getSalesThisMonth = async () => {
    try {
      const { data } = await axios.get('/api/product/sales-price-month', {
        headers: {
          Authorization: auth.token,
          'Content-Type': 'multipart/form-data'
        }
      });

      const formatSales = (sales) => {
        if (sales >= 1000000) {
          return (sales / 1000000).toFixed(1) + "M"; // Format to millions (M)
        } else if (sales >= 1000) {
          return (sales / 1000).toFixed(1) + "k"; // Format to thousands (k)
        } else {
          return sales; // Return raw sales if below 1000
        }
      };

      // Format the totalSales from the API before setting it
      setSalesMonth(formatSales(data.totalSales));
    } catch (error) {
      console.log(error);
    }
  };


  const getPendingOrders = async () => {
    try {
      const { data } = await axios.get('/api/product/pending-orders', {
        headers: {
          Authorization: auth.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setPendingOrders(data.pendingOrdersCount);
    } catch (error) {
      console.log(error);
    }
  }

  const getReviewCount = async () => {
    try {
      const { data } = await axios.get('/api/review/reviewcount', {
        headers: {
          Authorization: auth.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setReviewsCount(data.count);
    } catch (error) {
      console.log(error);
    }
  }

  const getMostSoldProduct = async () => {
    try {
      const { data } = await axios.get('/api/product/top-selling', {
        headers: {
          Authorization: auth.token,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(data);
      setMostSoldProductCount(data.count);
      setMostSoldProduct(data.product);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSalesThisMonth();
    getPendingOrders();
    getReviewCount();
    getMostSoldProduct();
  }, [auth.token]);

  return (
    <div className="flex flex-col h-full w-full gap-y-5 mb-24 p-6 bg-gray-100 min-h-screen">

      <div className="flex flex-col lg:flex-row lg:gap-x-6 gap-y-6">
        {/* Card 1 */}
        <div className="w-full lg:w-[20vw] bg-white rounded-lg h-[12vh] p-5 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex items-center justify-between">
          <div className="flex items-center justify-center w-16 h-16 border-4 border-green-500 rounded-full text-md font-medium text-green-600 p-2 overflow-hidden text-center">
            ₹<span className="text-[clamp(0.8rem, 1.5vw, 1rem)]">{SalesMonth}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Sales This Month</h2>
        </div>

        {/* Card 2 */}
        <div className="w-full lg:w-[20vw] bg-white rounded-lg h-[12vh] p-5 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex items-center justify-between" onClick={() => navigate('../orders')}>
          <div className="flex items-center justify-center w-16 h-16 border-4 border-yellow-500 rounded-full text-md font-medium text-yellow-600 p-2 overflow-hidden text-center">
            <span className="text-[clamp(0.8rem, 1.5vw, 1rem)]">{PendingOrders}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Pending Orders</h2>
        </div>

        {/* Card 3 */}
        <div className="w-full lg:w-[20vw] bg-white rounded-lg h-[12vh] p-5 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex items-center justify-between">
          <div className="flex items-center justify-center w-16 h-16 border-4 border-orange-400 rounded-full text-md font-medium text-green-600 p-2 overflow-hidden text-center">
            <span className="text-[clamp(0.8rem, 1.5vw, 1rem)]">{ReviewsCount}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Reviews This Month</h2>
        </div>
      </div>

      {/* graph */}
      <SalesGraph />

      {/* Most Sold Product Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700">Most Sold Product</h2>
        {MostSoldProduct ? (
          <div
            className="mt-4 bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center"
            onClick={() => navigate(`../../Product/${MostSoldProduct.slug}`)}
          >
            {/* Product Image */}
            <div className="w-full md:w-1/4"> {/* Adjust width */}
              <img
                src={MostSoldProduct.photo}
                alt={MostSoldProduct.name}
                className="w-fit h-auto rounded-lg shadow-md max-h-24"
              />
            </div>
            {/* Product Details */}
            <div className="mt-2 md:mt-0 md:ml-2 flex-grow"> {/* Reduced ml-3 to ml-2 */}
              <h3 className="text-lg font-medium text-gray-800">{MostSoldProduct.name}</h3>
              <p className="text-sm text-gray-600">Price: ₹{MostSoldProduct.price}</p>
              <p className="text-sm text-gray-600">Sold: {MostSoldProductCount} times</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Fetching most sold product...</p>
        )}
      </div>
    </div>
  )
}

export default Overview;
