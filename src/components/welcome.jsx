import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Welcome = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false, // No arrows
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: dots => (
      <div style={{ bottom: '10px' }}>
        <ul style={{ margin: '0px', padding: '1px', display: 'flex', justifyContent: 'center' }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '15px',
          height: '15px',
          background: i === activeSlide ? 'grey' : 'white',
          borderRadius: '50%',
          margin: '0 5px',
          transition: 'background 0.3s ease',
        }}
      ></div>
    ),
  };

  const getImage = async () => {
    try {
      const { data } = await axios.get('/api/image/get-image');
      setImages(data.images || []);
    } catch (error) {
      console.log(error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (link) => {
    navigate(link);
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className="relative w-full h-[40vh] mb-2 2xl:h-[67vh] xl:h-[50vh] lg:h-[50vh] md:h-[40vh] overflow-hidden">
      {loading ? (
        // Display animated spinner while images are loading
        <div className="flex items-center justify-center">
          <div className="spinner"></div> {/* Spinner */}
        </div>
      ) : (
        <Slider {...settings} className="w-full h-full">
          {images?.map((image, index) => (
            <div key={index} className="cursor-pointer" onClick={() => handleImageClick(image.link)}>
              <picture>
                <source media="(min-width: 768px)" srcSet={image.image2} />
                <source media="(min-width: 1400px)" srcSet={image.image2} />
                <source media="(min-width: 1700px)" srcSet={image.image2} />
                <img
                  src={image.image1}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover"
                  style={{ height: '100%' }} // Ensure the image height fills the container
                />
              </picture>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Welcome;
