import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCartArrowDown } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { cartActions } from '../store';
import StarRatings from 'react-star-ratings';
import { toast, ToastContainer } from 'react-toastify';

const Catagory = () => {
    const [Products, setProducts] = useState([]);
    const [Catagory, setCatagory] = useState([]);
    const params = useParams();
    const dispatch = useDispatch();

    const handleCart = (p, e) => {
        e.preventDefault();
        dispatch(cartActions.addToCart(p));
        toast.success('Registration Successful!', {
            position: "bottom-center", // Adjust toast position for mobile view
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const getProducts = async () => {
        try {
            const { data } = await axios.get(`/api/product/product-catagory/${params.slug}`);
            setCatagory(data?.catagory);
            setProducts(data?.Products);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) {
            getProducts();
        }
    }, [params?.slug]);

    return (
        <Layout>
            <div className='min-h-[89vh] pt-12 flex flex-col items-center'>
                <p className='text-center text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-gray-800'>{Catagory?.name}</p>
                <div className='h-auto w-full px-4 sm:px-8 lg:px-12'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12'>
                        {Products?.map((p) => (
                            <Link
                                key={p._id}
                                className='relative bg-white shadow-lg rounded-lg overflow-hidden'
                                to={`../Product/${p.slug}`}
                            >
                                <div className='relative'>
                                    <img
                                        src={p.photo}
                                        alt={p.name}
                                        className='w-full h-48 sm:h-56 lg:h-64 object-cover'
                                    />
                                    {p.shipping && (
                                        <button
                                            className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full absolute top-2 right-2 z-10 transition duration-300'
                                            onClick={(e) => handleCart(p, e)}
                                        >
                                            <FaCartArrowDown size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className='p-4 space-y-2'>
                                <h2 className='text-lg font-bold mb-2'>{p?.name?.length > 46 ? `${p.name.substring(0, 46)}...` : p.name}</h2>
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
                                            <span className='text-sm text-gray-600'>
                                                ({p.averageRating.toFixed(1)})
                                            </span>
                                        </>
                                    ) : (
                                        <span className='text-sm text-gray-600'>(No reviews yet)</span>
                                    )}
                                    <p className='text-gray-700 mb-4 text-sm'>
                                        {p?.description?.length > 100 ? `${p.description.substring(0, 100)}...` : p.description}
                                    </p>
                                    <p className='text-lg text-green-700 font-semibold'>₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </Layout>
    );
}

export default Catagory;
