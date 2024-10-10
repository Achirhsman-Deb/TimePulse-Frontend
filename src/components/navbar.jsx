import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions, searchActions, cartActions } from '../store';
import { RxHamburgerMenu } from "react-icons/rx";
import useCatagory from './Hooks/useCatagory.js';
import { FaSearch } from "react-icons/fa";
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const Catagory = useCatagory();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const auth = useSelector(state => state.auth);
  const searchState = useSelector(state => state.search);
  const cartState = useSelector(state => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    navigate('../');
    sessionStorage.clear();
    localStorage.clear();
    dispatch(authActions.logout());
    dispatch(cartActions.clearCart());
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdownMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchQuery(keyword);
    dispatch(searchActions.search({ keyword }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/product/product-search`, {
        params: { keyword: searchState.keyword }
      });
      dispatch(searchActions.setResults({ results: data.results }));
      navigate('/search');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className='w-full flex justify-between items-center bg-transparent sm:px-16 px-8 py-4 border-b-black z-10'>
      <NavLink to="/" className="w-12 h-12 flex items-center justify-center drop-shadow-xl rounded-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/duyv9y7fc/image/upload/v1725018504/UI/qywsb8qmjg6fquvo5lui.png"
          alt="Company Logo"
          className="w-full h-full object-cover"
        />
      </NavLink>

      {/* Search Bar for Mobile */}
      <form onSubmit={handleSearchSubmit} className="relative flex md:hidden mx-4 flex-grow">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg">
          <FaSearch />
        </button>
      </form>

      <RxHamburgerMenu className="md:hidden text-2xl cursor-pointer" onClick={toggleMobileMenu} />

      <nav className='hidden md:flex text-lg gap-7 font-medium items-center relative'>
        <form onSubmit={handleSearchSubmit} className="relative flex mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg">
            <FaSearch />
          </button>
        </form>

        {/* Category Button */}
        <div className='relative'>
          <button onClick={toggleCategoryDropdown} className='hidden md:block text-black text-lg font-semibold'>
            Category
          </button>
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-20">
              {Catagory?.map((cat, index) => (
                <NavLink
                  key={index}
                  to={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => {
                    setIsCategoryOpen(false);
                  }}
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Cart Button */}
        <NavLink to='/cart' className='hidden md:block text-lg text-gray-800 hover:text-blue-600'>
          Cart ({cartState?.length})
        </NavLink>

        {/* Dropdown Menu Button */}
        <button
          onClick={isLoggedIn ? toggleDropdownMenu : () => navigate('/Login')}
          className='flex flex-col gap-y-0 rounded-lg p-2 h-auto bg-blue-600 w-32 text-white shadow-lg hover:bg-blue-700'
        >
          <p className='text-sm font-light'>{isLoggedIn ? 'Welcome,' : ''}</p>
          <p className='text-md font-semibold'>{isLoggedIn ? auth.user.name.split(' ')[0] : 'Sign In'}</p>
        </button>

        {isLoggedIn && isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md max-h-80 overflow-y-auto z-20">
            <NavLink
              to={`${auth?.role === 1 ? "/Admin-Dashboard/protected1/Overview" : "/Dashboard/protected/Profile"}`}
              className={({ isActive }) => isActive ? 'block px-4 py-2 text-blue-600 font-semibold' : 'block px-4 py-2 text-gray-800 hover:bg-gray-200'}
              onClick={() => setIsDropdownOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="#"
              className='block px-4 py-2 text-blue-600'
              onClick={() => { logout(); setIsDropdownOpen(false); }}
            >
              Sign-out
            </NavLink>
          </div>
        )}

        {!isLoggedIn && isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md max-h-80 overflow-y-auto z-20">
            <NavLink
              to="/Login"
              className={({ isActive }) => isActive ? 'block px-4 py-2 text-white bg-blue-600 rounded-md' : 'block px-4 py-2 text-white bg-blue-600 rounded-md'}
              onClick={() => setIsDropdownOpen(false)}
            >
              Login
            </NavLink>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-lg z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Menu</h2>
          <AiOutlineClose className="text-2xl cursor-pointer" onClick={toggleMobileMenu} />
        </div>
        <nav className="flex flex-col p-4 space-y-4 max-h-screen overflow-y-auto">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'text-black font-medium'} onClick={toggleMobileMenu}>
            Home
          </NavLink>
          <div className="relative">
            <button onClick={toggleCategoryDropdown} className='text-black text-lg font-semibold w-full text-left'>
              Category
            </button>
            {isCategoryOpen && (
              <div className="mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-20">
                {Catagory?.map((cat, index) => (
                  <NavLink
                    key={index}
                    to={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => {
                      setIsCategoryOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {cat.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <NavLink to='/cart' className='md:block text-lg hover:text-blue-600 text-black font-medium'>
            Cart ({cartState?.length})
          </NavLink>
          {isLoggedIn && (
            <NavLink to={`${auth?.role === 1 ? "/Admin-Dashboard/protected1/Overview" : "/Dashboard/protected/Orders"}`} className={({ isActive }) => isActive ? 'text-blue-600 font-semibold' : 'text-black font-medium'} onClick={toggleMobileMenu}>
              Dashboard
            </NavLink>
          )}
          {isLoggedIn ? (
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-black font-medium">
              Sign-out
            </button>
          ) : (
            <NavLink to="/Login" className="text-black font-medium" onClick={toggleMobileMenu}>
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
