import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  'https://via.placeholder.com/1920x500?text=Image+1',
  'https://via.placeholder.com/1920x500?text=Image+2',
  'https://via.placeholder.com/1920x500?text=Image+3',
  // Add more image URLs as needed
];

const FullWidthCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="relative w-full">
      <Slider {...settings} className="w-full">
        {images?.map((image, index) => (
          <div key={index} className="w-full h-64 md:h-80 lg:h-96">
            <img src={image} alt={`Slide ${index}`} className="object-cover w-full h-full" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FullWidthCarousel;
