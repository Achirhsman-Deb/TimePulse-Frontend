import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/layout';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../store/index';
import StarRatings from 'react-star-ratings';
import { FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import BuyNow from '../components/miscs/BuyNow';
import Slider from 'react-slick';

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const auth = useSelector(state => state.auth);
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [updatedReview, setUpdatedReview] = useState({
    rating: 0,
    comment: ''
  });
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [editingReview, setEditingReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const reviewSectionRef = useRef(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/get-product/${params.slug}`);
      if (data?.Product) {
        setProduct(data.Product);
        getSimilarProducts(data.Product._id, data.Product.catagory._id);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/product/product-similar/${pid}/${cid}`);
      setSimilarProducts(data?.Products || []);
    } catch (error) {
      console.log('Error fetching similar products:', error);
    }
  };

  const getReviews = async () => {
    try {
      const { data } = await axios.get(`/api/review/${product._id}`);
      setReviews(data.reviews || []);
    } catch (error) {
      console.log('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      if (editingReview) {
        // Editing review
        await axios.put(
          `/api/review/review/${editingReview._id}`,
          updatedReview,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        setEditingReview(null);
        setUpdatedReview({ rating: 0, comment: '' });
      } else {
        // Adding new review
        const response = await axios.post(
          `/api/review/product/${product._id}`,
          newReview,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        if (response.data.message === 'Review updated successfully') {
          setHasReviewed(true);
        }
        setNewReview({ rating: 0, comment: '' });
      }
      getReviews();
      getProduct();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setUpdatedReview({
      rating: review.rating,
      comment: review.comment
    });
    // Scroll to the write review section
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setUpdatedReview({ rating: 0, comment: '' });
  };

  const handleCart1 = () => {
    if (product._id) {
      dispatch(cartActions.addToCart(product));
      setIsAddingToCart(true); // Trigger animation

      // Show toast notification
      toast.success('Product added to cart!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset animation state after 1 second
      setTimeout(() => setIsAddingToCart(false), 1000);
    } else {
      console.warn('Product is not available.');
    }
  };

  const handleLoadMore = () => {
    setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 3);
  };

  const handleStarClick = (rating) => {
    if (editingReview) {
      setUpdatedReview({ ...updatedReview, rating });
    } else {
      setNewReview({ ...newReview, rating });
    }
  };

  const handleBuyNowClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  useEffect(() => {
    if (product._id) {
      getReviews();
    }
  }, [product._id]);

  const sliderSettings = {
    dots: true,
    autoplay: false,
    infinite: true, // Allows the slider to loop through images
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1, // Scroll one image at a time
    adaptiveHeight: false, // Disable adaptiveHeight to avoid layout issues
    arrows: true,
  };

  return (
    <Layout>
      <div className='min-h-[89vh] flex flex-col items-center p-4 md:p-8 gap-y-10'>
        {/* Product Details */}
        <div className='bg-white shadow-lg rounded-lg p-8 max-w-[85vw] w-full flex flex-col lg:flex-row'>
          {/* Product Image */}
          <div className='w-full lg:w-1/2 flex justify-center rounded-md border border-gray-200 p-5'>
            {product?.extraPhotos && product?.extraPhotos?.length > 0 ? (
              <Slider {...sliderSettings} className="w-full h-fit max-h-[50vh] lg:max-h-[60vh]">
                {/* Main Image */}
                <div>
                  <img
                    src={product.photo}
                    alt={product.name || 'Product Image'}
                    className='object-contain w-full max-h-[30vh] sm:max-h-[40vh] lg:max-h-[60vh]'
                  />
                </div>
                {/* Extra Images */}
                {product?.extraPhotos?.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={photo}
                      alt={`Extra Image ${index + 1}`}
                      className='object-contain w-full max-h-[30vh] sm:max-h-[40vh] lg:max-h-[60vh]'
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={product.photo}
                alt={product.name || 'Product Image'}
                className='object-contain w-full max-h-[30vh] sm:max-h-[40vh] lg:max-h-[60vh]'
              />
            )}
          </div>

          {/* Product Info */}
          <div className='w-full lg:w-1/2 flex flex-col justify-between p-4 lg:p-6'>
            <h1 className='text-3xl lg:text-4xl font-bold mb-4 text-gray-800'>{product.name}</h1>
            <div className='flex items-center mb-4'>
              {product.averageRating && product.averageRating > 0 ? (
                <>
                  <StarRatings
                    rating={Math.min(product.averageRating, 5)}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    isSelectable={false}
                  />
                  <span className='text-sm text-gray-600'>
                    ({product.averageRating.toFixed(1)})
                  </span>
                </>
              ) : (
                <span className='text-sm text-gray-600'>(No reviews yet)</span>
              )}
            </div>
            <p className='text-gray-700 mb-4'>{product.description}</p>
            <div className='text-2xl lg:text-3xl font-bold mb-4 text-green-700'>₹{product.price}</div>
            {product.shipping ? (
              <div className='flex flex-col space-y-2'>
                {isLoggedIn && (
                  <button
                    className="bg-yellow-500 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-md hover:bg-yellow-600 transition duration-300"
                    onClick={handleBuyNowClick}
                  >
                    Buy Now
                  </button>
                )}
                <button
                  className={`bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-md hover:from-green-500 hover:to-blue-600 transition duration-300 ${isAddingToCart ? 'animate-wiggle' : ''}`}
                  onClick={handleCart1}
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className='text-red-600 py-2 lg:py-3 px-4 lg:px-6'>
                Out Of Stock
              </div>
            )}
          </div>
        </div>


        {/* Similar Products Section */}
        <div className='w-full mt-10'>
          <h2 className='text-3xl font-semibold mb-6 text-gray-800'>Similar Products</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {similarProducts?.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className='bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl'
                onClick={getReviews()}
              >
                <div className='relative'>
                  <img
                    src={p.photo}
                    alt={p.name}
                    className='w-full h-48 object-cover'
                  />
                </div>
                <div className='p-4 space-y-2'>
                  <h2 className='text-lg font-semibold mb-1 text-gray-800'>{p.name}</h2>
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
                  <p className='text-gray-600 mb-2 line-clamp-2'>{p.description}</p>
                  <p className='text-green-700 font-semibold'>₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className='w-full mt-10 space-y-5'>
          <h2 className='text-3xl font-semibold mb-6 text-gray-800'>Customer Reviews</h2>

          {/* Write/Edit Review Section */}
          {isLoggedIn && (
            <div ref={reviewSectionRef} className='bg-white shadow-lg rounded-lg p-6'>
              <h3 className='text-2xl font-semibold mb-4 text-gray-800'>{editingReview ? 'Edit Review' : 'Write a Review'}</h3>
              <div className='bg-white rounded-lg p-6'>
                <StarRatings
                  rating={editingReview ? updatedReview.rating : newReview.rating}
                  starRatedColor="gold"
                  numberOfStars={5}
                  starDimension="25px"
                  starSpacing="2px"
                  changeRating={handleStarClick}
                />
                <textarea
                  value={editingReview ? updatedReview.comment : newReview.comment}
                  onChange={(e) => (editingReview ? setUpdatedReview({ ...updatedReview, comment: e.target.value }) : setNewReview({ ...newReview, comment: e.target.value }))}
                  placeholder='Write your review here...'
                  className='w-full mt-4 p-3 border border-gray-300 rounded-md'
                  rows={4}
                />
                {hasReviewed && (
                  <span className='text-l text-green-500'>Review updated.</span>
                )}
                <div className='flex justify-end mt-4'>
                  {editingReview ? (
                    <>
                      <button
                        className='bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300'
                        onClick={handleReviewSubmit}
                      >
                        Save
                      </button>
                      <button
                        className='ml-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300'
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300'
                      onClick={handleReviewSubmit}
                    >
                      Submit Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews?.slice(0, visibleReviews).map((review) => (
            <div key={review._id} className="bg-white shadow-lg rounded-lg p-4 md:p-6 relative">
              {/* Edit button for PC view */}
              {isLoggedIn && review.user.name === auth.user.name && (
                <button
                  className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => handleEditClick(review)}
                >
                  <FaEdit />
                </button>
              )}

              {/* Review Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <StarRatings
                    rating={review.rating}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    isSelectable={false}
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-800 mt-2">{review.user.name.split(' ')[0]}</span>

                  {/* Show green tick beside name on mobile */}
                  {review.verifiedPurchase && (
                    <span className="ml-2 text-green-600 bg-green-200 p-1 rounded-sm block md:hidden mt-2">
                      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Show "Verified Purchase" text on larger screens */}
                {review.verifiedPurchase && (
                  <span className="hidden md:inline-block text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full mt-2 ml-4">
                    Verified Purchase
                  </span>
                )}

                {/* Review Date */}
                <span className="text-sm text-gray-600 md:ml-auto mt-2">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 text-sm md:text-base">{review.comment}</p>
            </div>
          ))}

          {reviews?.length > visibleReviews && (
            <button
              className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300'
              onClick={handleLoadMore}
            >
              Load More Reviews
            </button>
          )}
        </div>
        <BuyNow
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); getReviews(); }}
          product={product}
        />
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Product;
