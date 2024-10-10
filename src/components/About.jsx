import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { FaLinkedin, FaLaptopCode, FaRocket, FaStar } from 'react-icons/fa';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <Layout>
      <div className="min-h-[89vh] flex flex-col items-center p-4 md:p-8">
        {/* Hero Section */}
        <div className="relative w-full max-w-7xl p-8 mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg text-white text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">About Me</h1>
          <p className="text-lg md:text-xl mb-6">
            A passionate developer with a flair for creating elegant solutions in the least amount of time.
          </p>
          <a
            href="https://www.linkedin.com/in/achirshman-deb-02540025a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition duration-300"
          >
            <FaLinkedin size={24} />
            Visit My LinkedIn
          </a>
        </div>

        {/* Skills and Expertise Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
          {/* Card 1 */}
          <div className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2">
            <FaLaptopCode className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Full-Stack Development</h3>
            <p className="text-gray-700">
              Expert in modern web technologies, frameworks, and libraries such as React, Node.js, Express, MongoDB, and more.
              Transforming complex problems into innovative solutions.
            </p>
          </div>
          {/* Card 2 */}
          <div className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2">
            <FaRocket className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Agile & Fast Development</h3>
            <p className="text-gray-700">
              Applying agile methodologies to deliver efficient, effective, and timely results. Adept at working in fast-paced
              environments with quick learning capabilities.
            </p>
          </div>
        </div>

        {/* Star Ratings Animation */}
        <div className="relative flex justify-center items-center my-12 w-full max-w-7xl">
          <div className="flex gap-1 text-yellow-500">
            <FaStar size={40} />
            <FaStar size={40} />
            <FaStar size={40} />
            <FaStar size={40} />
            <FaStar size={40} />
          </div>
          <p className="absolute bottom-[-2rem] text-lg text-gray-700 font-semibold">
            Rated 5 Stars by Clients & Peers!
          </p>
        </div>

        {/* Animated Background Section */}
        <div className="relative w-full max-w-7xl p-8 mt-12 mb-16 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg shadow-lg text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">Turning Ideas into Reality</h2>
          <p className="text-lg md:text-xl mb-6">
            I am dedicated to delivering creative and functional digital experiences. Let's bring your vision to life with innovative web solutions.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
