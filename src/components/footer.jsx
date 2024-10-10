import React from 'react'
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-10">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Time Pulse</h3>
            <p>An Ecomerce Mern app</p>
            <p>By alexwestcraftert</p>
          </div>
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className='flex flex-col'>
              <Link to='/'>Home</Link>
              <Link to='/About'>About</Link>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/achirshman-deb-02540025a/" className="text-green-400">
                <FaLinkedin size={30}/>
              </a>
              <a href="https://www.instagram.com/alexplays__101/" className="text-red-400">
                <FaInstagram size={30}/>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p>&copy; Copyright {currentYear} Trendify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer