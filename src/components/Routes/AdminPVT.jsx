import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

const AdminPVT = () => {
  const [ok, setOk] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get('/api/user/admin-auth', {
          headers: {
            "Authorization": auth?.token, 
          }
        });
        
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner/>;
};

export default AdminPVT;