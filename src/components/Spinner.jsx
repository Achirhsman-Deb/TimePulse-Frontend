import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => {
        if (prevValue <= 1) {
          navigate('/Login',{
            state: location.pathname
          });
          clearInterval(interval);
          return 0;
        }
        return prevValue - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate,location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p>Redirecting in {count} seconds...</p>
    </div>
  );
}

export default Spinner;
