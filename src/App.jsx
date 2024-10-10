import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/user/Dashboard';
import Private from './components/Routes/Private';
import Forgot_pass from './pages/Forgot_pass';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPVT from './components/Routes/AdminPVT';
import CreateCatagory from './components/admin/CreateCatagory';
import UsersCheck from './components/admin/UsersCheck';
import CreateProduct from './components/admin/CreateProduct';
import UserProfile from './components/user/UserProfile';
import UserOrder from './components/user/UserOrder';
import Products from './components/admin/Products';
import UpdateProduct from './components/admin/updateProduct';
import Product from './pages/product';
import Search from './pages/Search';
import Catagory from './pages/Catagory';
import CartPage from './pages/CartPage';
import Orders from './components/admin/Orders';
import { useDispatch } from 'react-redux';
import About from './components/About';
import OrderDetails from './components/user/OrderDetails';
import OrderDetailsAdmin from './components/admin/OrderDetailsAdmin';
import Overview from './components/admin/Overview';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {

      dispatch(authActions.login({ token }));
    }
  }, [dispatch]);
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/product/:slug' element={<Product/>} />
          <Route path='/category/:slug' element={<Catagory />} />
          <Route path='/Login' element={<Login/>} />
          <Route path='/Forgot-Password' element={<Forgot_pass/>} />
          <Route path='/Dashboard' element={<Private/>}>
            <Route path='/Dashboard/protected' element={<Dashboard/>}>
              <Route path='/Dashboard/protected/Profile' element={<UserProfile/>}/>
              <Route path='/Dashboard/protected/Orders' element={<UserOrder/>}/>
              <Route path='/Dashboard/protected/OrderDetails/:orderId' element={<OrderDetails/>}/>
            </Route>
          </Route>
          <Route path='/Admin-Dashboard' element={<AdminPVT/>}>
            <Route path='/Admin-Dashboard/protected1' element={<AdminDashboard/>}>
              <Route path='/Admin-Dashboard/protected1/Overview' element={<Overview/>} />
              <Route path='/Admin-Dashboard/protected1/CreateCatagory' element={<CreateCatagory/>} />
              <Route path='/Admin-Dashboard/protected1/CreateProduct' element={<CreateProduct/>} />
              <Route path='/Admin-Dashboard/protected1/Products' element={<Products/>} />
              <Route path='/Admin-Dashboard/protected1/Products/:slug' element={<UpdateProduct/>} />
              <Route path='/Admin-Dashboard/protected1/Users' element={<UsersCheck/>} />
              <Route path='/Admin-Dashboard/protected1/Orders' element={<Orders/>}/>
              <Route path='/Admin-Dashboard/protected1/OrderDetailsAdmin/:orderId' element={<OrderDetailsAdmin/>} />
            </Route>
          </Route>
          <Route path='/About' element={<About/>} />
        </Routes>
    </Router>
  );
}

export default App;
