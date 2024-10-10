import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartArrowDown } from "react-icons/fa";
import { Checkbox, Radio, Avatar, Dropdown, Menu, Button } from 'antd';
import { FilterPrice } from './miscs/Filter';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/index';
import StarRatings from 'react-star-ratings';
import { toast, ToastContainer } from 'react-toastify';

const Items = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [Products, setProducts] = useState([]);
    const [Catagory, setCatagory] = useState([]);
    const [Checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [Total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [Loading, setLoading] = useState(false);

    const GetTotal = async () => {
        try {
            const { data } = await axios.get('/api/product/product-count');
            setTotal(data?.Total);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/product/product-list/${page}`);
            setProducts(data.Products);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getCatagory = async () => {
        try {
            const { data } = await axios.get('/api/catagory/get-categories');
            if (data.success) {
                setCatagory(data.catagories);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterCatagory = (value, id) => {
        let all = [...Checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
    };

    const getFilteredProducts = async () => {
        try {
            const { data } = await axios.post('/api/product/filter-products', { checked: Checked, radio });
            setProducts(data?.Products);
        } catch (error) {
            console.log(error);
        }
    };

    const LoadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/product/product-list/${page}`);
            setProducts([...Products, ...data?.Products]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleCart = (p, e) => {
        e.preventDefault();
        dispatch(cartActions.addToCart(p));
        toast.success('Product added to cart!', {
            position: "bottom-center", // Adjust toast position for mobile view
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const filterMenu = (
        <Menu>
            <Menu.Item>
                <p className='text-base sm:text-lg'>Category</p>
                {Catagory?.map(c => (
                    <Checkbox
                        key={c._id}
                        onChange={(e) => handleFilterCatagory(e.target.checked, c._id)}
                    >
                        {c.name}
                    </Checkbox>
                ))}
            </Menu.Item>
            <Menu.Item>
                <p className='text-base sm:text-lg'>Price</p>
                <Radio.Group onChange={e => setRadio(e.target.value)}>
                    {FilterPrice?.map(p => (
                        <div key={p._id}>
                            <Radio value={p.array}>
                                {p.name}
                            </Radio>
                        </div>
                    ))}
                </Radio.Group>
            </Menu.Item>
            <Menu.Item>
                <Button
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit mt-4'
                    onClick={() => window.location.reload()}
                >
                    Reset filters
                </Button>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        if (!Checked?.length && !radio?.length) {
            getAllProducts();
        }
        GetTotal();
        getCatagory();
    }, []);

    useEffect(() => {
        if (page === 1) {
            return;
        }
        LoadMore();
    }, [page]);

    useEffect(() => {
        if (Checked?.length || radio?.length) {
            getFilteredProducts();
        }
    }, [Checked, radio]);

    return (
        <div className='flex flex-col h-auto mb-12 px-4 sm:px-8 gap-y-6'>
            <p className='text-2xl sm:text-3xl lg:text-5xl mb-8 text-center'>
                THE BEST WAY TO FIND YOUR PRODUCTS YOU LOVE
            </p>
            <div className='flex flex-wrap justify-center gap-6 mb-8 \'>
                {Catagory?.map(c => (
                    <Avatar
                        key={c._id}
                        size={160}
                        className='text-base sm:text-lg md:text-xl cursor-pointer'
                        src={c.image}
                        alt={c.name}
                        onClick={() => nav(`/category/${c.slug}`)}
                    >
                        {c.name}
                    </Avatar>
                ))}
            </div>
            <p className='text-2xl sm:text-3xl lg:text-5xl mb-8 text-center'>Our HandPicked Products</p>
            <div className='flex flex-col lg:flex-row gap-12'>
                {/* Filter Section */}
                <div className='flex flex-col gap-y-8 lg:w-1/4 lg:border-r lg:border-gray-300 pr-4'>
                    <p className='text-xl sm:text-2xl hidden lg:block'>Filter</p>
                    <Dropdown overlay={filterMenu} trigger={['click']} className='lg:hidden'>
                        <Button className='w-full text-lg'>Filter</Button>
                    </Dropdown>
                    <div className='hidden lg:flex flex-col text-lg'>
                        <p className='text-base sm:text-lg'>Category</p>
                        {Catagory?.map(c => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleFilterCatagory(e.target.checked, c._id)}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    <div className='hidden lg:flex flex-col text-lg'>
                        <p className='text-base sm:text-lg'>Price</p>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {FilterPrice?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>
                                        {p.name}
                                    </Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <button
                        className='hidden lg:block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit'
                        onClick={() => window.location.reload()}
                    >
                        Reset filters
                    </button>
                </div>
                <div className='flex flex-col gap-8 lg:w-3/4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {Products?.map((p) => (
                            <Link
                                key={p._id}
                                className='relative bg-white shadow-lg rounded-lg overflow-hidden'
                                to={`Product/${p.slug}`}
                            >
                                {p.shipping && (
                                    <button
                                        className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full absolute top-2 right-2 z-10 transition duration-300'
                                        onClick={(e) => handleCart(p, e)}
                                    >
                                        <FaCartArrowDown size={18} />
                                    </button>
                                )}
                                <img
                                    src={p.photo}
                                    alt={p.name}
                                    className='w-full h-48 object-cover transition-transform transform hover:scale-105 duration-300'
                                />
                                <div className='p-4'>
                                    <h2 className='text-lg font-bold mb-2'>{p?.name?.length > 46 ? `${p.name.substring(0, 46)}...` : p.name}</h2>
                                    <div className='flex items-center mb-2'>
                                        {p.averageRating && p.averageRating > 0 ? (
                                            <>
                                                <StarRatings
                                                    rating={Math.min(p.averageRating, 5)}
                                                    starRatedColor="gold"
                                                    numberOfStars={5}
                                                    starDimension="20px"
                                                    starSpacing="2px"
                                                    isSelectable={false}
                                                />
                                                <span className='text-sm text-gray-600 ml-2'>
                                                    ({p.averageRating.toFixed(1)})
                                                </span>
                                            </>
                                        ) : (
                                            <span className='text-sm text-gray-600'>No reviews yet</span>
                                        )}
                                    </div>
                                    <p className='text-gray-700 mb-4 text-sm'>
                                        {p?.description?.length > 100 ? `${p.description.substring(0, 100)}...` : p.description}
                                    </p>
                                    <p className='text-lg font-semibold text-gray-900'>₹{p.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {Products?.length < Total && (
                        <button
                            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-auto block mt-4'
                            onClick={() => setPage(page + 1)}
                        >
                            {Loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </div>


                <ToastContainer />
            </div>
        </div>
    );
};

export default Items;
