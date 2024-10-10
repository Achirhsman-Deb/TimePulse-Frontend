import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaClipboardList } from 'react-icons/fa';

const UserDashboardComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const menuItems = [
        { name: 'Profile', icon: <FaUser />, route: 'Profile' },
        { name: 'Orders', icon: <FaClipboardList />, route: 'Orders' },
    ];

    return (
        <section className="w-full p-4 flex flex-col items-center">
            {/* Heading */}
            <h1 className="text-5xl text-center mb-5 p-3 w-full sm:w-auto bg-gray-100 rounded-lg">
                Dashboard
            </h1>
            
            {/* Mobile View: Centered Icons */}
            <div className="sm:hidden flex justify-around mb-4 w-full">
                {menuItems?.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.route)}
                        className="flex justify-center items-center text-3xl text-blue-600 hover:text-blue-800 transition transform hover:scale-110 w-[60px] h-[60px]"
                    >
                        {item.icon}
                    </button>
                ))}
            </div>

            {/* Desktop View: Icons with Text */}
            <div className="hidden sm:flex flex-wrap justify-center gap-4 w-full">
                {menuItems?.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.route)}
                        className="bg-blue-600 text-white active:bg-blue-700 text-lg font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-500 transition flex flex-col items-center justify-center w-[10rem] h-[8rem]"
                    >
                        <div className="text-3xl">{item.icon}</div>
                        <span className="mt-2">{item.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default UserDashboardComponent;
