import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate , Link } from 'react-router-dom';
import { Select } from 'antd';

const { Option } = Select;

const Products = () => {
    const [EProducts, setEProducts] = useState([]);

    const getProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/get-products');
            setEProducts(data.Products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className='flex flex-col h-full w-full gap-y-5 mb-24 p-6 bg-gray-100 min-h-screen'>
            <h1 className='text-5xl mb-20'>Manage Products</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {EProducts?.map((p) => (
                    <Link key={p._id} className='bg-white shadow-lg rounded-lg overflow-hidden' to={`/Admin-Dashboard/protected1/Products/${p.slug}`}>
                        <img
                            src={p.photo}
                            alt={p.name}
                            className='w-full h-48 object-cover'
                        />
                        <div className='p-4'>
                            <h2 className='text-xl font-bold mb-2'>{p.name}</h2>
                            <p className='text-gray-700 mb-4'>{p.description}</p>
                            <p className='text-gray-900 font-semibold'>₹{p.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Products;
