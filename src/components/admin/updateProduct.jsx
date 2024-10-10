import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from 'react-redux';
import { TiTick } from "react-icons/ti";
import { Select } from 'antd';
import { Spin } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
const { Option } = Select;

const UpdateProduct = () => {
    const auth = useSelector(state => state.auth);
    const [Catagory, setCatagory] = useState("");
    const [Shipping, setShipping] = useState("");
    const [id, setId] = useState("");
    const [catagories, setCatagories] = useState([]);
    const params = useParams();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [Products, setProducts] = useState({
        url: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
    });
    const [photo, setPhoto] = useState("");
    const [existingExtraPhotos, setExistingExtraPhotos] = useState([]); // URLs from server
    const [newExtraPhotos, setNewExtraPhotos] = useState([]); // Files from user input
    const [deleteExtraPhotos, setDeleteExtraPhotos] = useState([]); // URLs to delete

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const change = (e) => {
        const { name, value } = e.target;
        setProducts({ ...Products, [name]: value });
    };

    const handleExtraPhotosChange = (e) => {
        const files = Array.from(e.target.files);
        setNewExtraPhotos([...newExtraPhotos, ...files]);
    };

    // Delete an existing extra photo
    const handleDeleteExistingExtraPhoto = (index) => {
        const urlToDelete = existingExtraPhotos[index];
        setDeleteExtraPhotos([...deleteExtraPhotos, urlToDelete]);
        const updatedPhotos = existingExtraPhotos.filter((_, i) => i !== index);
        setExistingExtraPhotos(updatedPhotos);
    };

    // Delete a new extra photo
    const handleDeleteNewExtraPhoto = (index) => {
        const updatedPhotos = newExtraPhotos.filter((_, i) => i !== index);
        setNewExtraPhotos(updatedPhotos);
    };

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/product/get-product/${params.slug}`);
            setProducts({
                url: data.Product.photo,
                name: data.Product.name,
                description: data.Product.description,
                price: data.Product.price,
                quantity: data.Product.quantity,
            });
            setExistingExtraPhotos(data.Product.extraPhotos || []);
            setShipping(data.Product.shipping ? "1" : "0");
            setCatagory(data.Product.catagory._id);
            setId(data.Product._id);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getCatagory = async () => {
        try {
            const { data } = await axios.get('/api/catagory/get-categories');
            if (data.success) {
                setCatagories(data.catagories);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCatagory();
        getProduct();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!Products.name || !Products.description || !Products.price || !Products.quantity || !Shipping || !Catagory) {
            alert("Please fill out the entire form.");
            return;
        }

        try {
            const ProductData = new FormData();
            ProductData.append("name", Products.name);
            ProductData.append("description", Products.description);
            ProductData.append("price", Products.price);
            ProductData.append("quantity", Products.quantity);
            ProductData.append("shipping", Shipping);
            ProductData.append("catagory", Catagory);

            if (photo) {
                ProductData.append("photo", photo);
            }

            // Append new extra photos
            newExtraPhotos.forEach((file) => {
                ProductData.append("extraPhotos", file);
            });

            // Send the URLs of extra photos to be deleted
            ProductData.append("deleteImages", JSON.stringify(deleteExtraPhotos));

            const { data } = await axios.put(`/api/product/edit-product/${id}`, ProductData, {
                headers: {
                    Authorization: auth.token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Product Updated!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log('Failed to update product:', data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error.message);
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.prompt('Do you really want to delete the Product? \n type "yes" to delete');
            if (answer !== 'Yes') return;
            const { data } = await axios.delete(`/api/product/delete-product/${id}`);
            if (data.success) {
                nav('../Products');
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[100vh]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 p-4 space-y-6 bg-gray-100 min-h-screen">
            {/* Back button mobile*/}
            <button
                className="sm:hidden flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 shadow-md w-fit p-3 rounded-md"
                onClick={() => nav(-1)}  // Navigate to the previous page
            >
                <FaArrowLeft className="text-xl" /> {/* Back icon */}
            </button>
            {/* Back button pc*/}
            <button
                className="hidden sm:flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 shadow-md w-fit p-3 rounded-md absolute"
                onClick={() => nav(-1)}  // Navigate to the previous page
            >
                <FaArrowLeft className="text-xl" /> {/* Back icon */}
            </button>
            <div className="bg-white shadow-md rounded-lg p-8 max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Update Product</h1>

                <Select
                    placeholder="Select Category"
                    size="large"
                    showSearch
                    className="w-full mb-6"
                    onChange={(value) => setCatagory(value)}
                    value={Catagory}
                >
                    {catagories?.map((c) => (
                        <Option key={c._id} value={c._id}>
                            {c.name}
                        </Option>
                    ))}
                </Select>

                {/* Product Photo Section */}
                <div className="mb-6">
                    <label htmlFor="upload-photo" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Photo
                    </label>
                    <div className="flex items-center">
                        <label
                            htmlFor="upload-photo"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mr-4"
                        >
                            {photo ? photo.name : "Upload Photo"}
                            <input
                                type="file"
                                id="upload-photo"
                                name="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                        <div className="w-16 h-16 overflow-hidden rounded-md border">
                            <img
                                src={photo ? URL.createObjectURL(photo) : Products.url}
                                alt="Product Preview"
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Extra Photos Section */}
                <div className="mb-6">
                    <label
                        htmlFor="upload-extra-photos"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer mb-4 inline-block"
                    >
                        Extra Photos
                    </label>
                    <input
                        type="file"
                        id="upload-extra-photos"
                        name="extraPhotos"
                        accept="image/*"
                        multiple
                        onChange={handleExtraPhotosChange}
                        className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Existing Extra Photos */}
                        {existingExtraPhotos?.map((url, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={url}
                                    alt="Extra Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={() => handleDeleteExistingExtraPhoto(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* New Extra Photos */}
                        {newExtraPhotos?.map((extraPhoto, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <img
                                    src={URL.createObjectURL(extraPhoto)}
                                    alt="Extra Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={() => handleDeleteNewExtraPhoto(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={Products.name}
                        onChange={change}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={Products.description}
                        onChange={change}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={Products.price}
                        onChange={change}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={Products.quantity}
                        onChange={change}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="shipping" className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping
                    </label>
                    <Select
                        id="shipping"
                        value={Shipping}
                        onChange={(value) => setShipping(value)}
                        className="w-full"
                    >
                        <Option value="1">Yes</Option>
                        <Option value="0">No</Option>
                    </Select>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg mr-4"
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default UpdateProduct;
