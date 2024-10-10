import React from 'react';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaCartArrowDown } from "react-icons/fa6";
import { cartActions } from '../store';
import StarRatings from 'react-star-ratings';

const Search = () => {
    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);

    const handleCart = (p, e) => {
        e.preventDefault();
        dispatch(cartActions.addToCart(p));
    };

    return (
        <Layout>
            <div className='min-h-[89vh] pt-12 flex flex-col'>
                <p className='w-[100vw] text-center text-6xl'>Search Result</p>
                <p className='w-[100vw] text-center text-2xl'>
                    {searchState?.results?.length < 1 ? (
                        <div className='w-full h-full flex items-center justify-center text-center flex-col gap-y-3 text-3xl'>
                            <img
                                src='https://res.cloudinary.com/duyv9y7fc/image/upload/v1724346327/UI/ypkklhj2cl8hhbxnjrgg.jpg'
                                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 object-cover"
                                alt="Empty Cart"
                            />
                            <p className='text-2xl md:text-3xl mt-4'>Not found</p>
                        </div>
                    ) : `Found ${searchState?.results?.length} results`}
                </p>
                <div className='h-auto w-[100vw] p-[10vw]'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {searchState?.results?.map((p) => (
                            <Link key={p._id} className='bg-white shadow-lg rounded-lg overflow-hidden' to={`../Product/${p.slug}`}>
                                <img
                                    src={p.photo}
                                    alt={p.name}
                                    className='w-full h-48 object-cover'
                                />
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
                                    <p className='text-gray-900 font-semibold'>₹{p.price}</p>
                                </div>

                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Search;
