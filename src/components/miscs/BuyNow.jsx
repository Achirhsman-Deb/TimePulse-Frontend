import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { useNavigate } from 'react-router-dom';

const BuyNow = ({ isOpen, onClose, product }) => {
  const [step, setStep] = useState(1);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);
  const handleComplete = () => {
    setShowSuccess(false);
    onClose();
    setStep(1); // Reset to first step for next usage
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get('/api/product/braintree/token');
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post('/api/product/braintree/payment', {
        cart: [{ ...product, quantity: 1 }], nonce
      }, {
        headers: {
          Authorization: auth?.token
        }
      });
      if (data) {
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          handleComplete();
        }, 3000); // Adjust delay as needed
        handleComplete(); 
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3) getToken();
  }, [step]);

  if (!isOpen) return null;

  const getProgressPercentage = () => {
    if (showSuccess) {
      return 100; // 100% when order is successful
    }
    return (step - 1) * 50; // 0% at step 1, 50% at step 2, and 100% at step 3
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        {/* Cancel Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {showSuccess ? (
          <div className="text-center animate-fade-in">
            <h3 className="text-2xl font-semibold mb-2">Order Successful!</h3>
            <p className="text-gray-700 mb-4">Thank you for your purchase. Your order will be processed shortly.</p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
              onClick={handleComplete}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="flex flex-col md:flex-row mb-4 animate-slide-up">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-md transition-transform transform hover:scale-105"
                  />
                </div>
                <div className="w-full md:w-1/2 md:pl-4 space-y-5">
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-700 mb-2">Price: ₹{product.price}</p>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleNext}
                  >
                    Proceed to Address
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="pt-4 mb-4 animate-slide-up">
                <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
                <p className="text-gray-700 mb-2">{auth?.user?.address || "No address provided"}</p>
                {auth?.user?.address ? (
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
                    onClick={() => navigate('/Dashboard/protected/Profile')}
                  >
                    Change Address
                  </button>
                ) : (
                  <p className='text-red-500 mt-2'>Login to add/change address</p>
                )}
                <div className="flex flex-col md:flex-row justify-between mt-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 mb-2 md:mb-0"
                    onClick={handlePrevious}
                  >
                    Back to Product
                  </button>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleNext}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="pt-4 mb-4 animate-slide-up">
                <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                {clientToken ? (
                  <>
                    <DropIn
                      options={{ authorization: clientToken }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <div className="flex flex-col md:flex-row justify-between mt-4">
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 mb-2 md:mb-0"
                        onClick={handlePrevious}
                      >
                        Back to Address
                      </button>
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        onClick={handlePayment}
                        disabled={loading || !instance}
                      >
                        {loading ? 'Processing...' : 'Confirm Purchase'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Loading payment options...</p>
                )}
              </div>
            )}
          </>
        )}
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-300 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
