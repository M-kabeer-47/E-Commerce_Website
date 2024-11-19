import React, { useState } from 'react';
import { FaUser, FaChevronDown } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
import { MdWorkHistory } from "react-icons/md";

import Cookies from 'js-cookie';
import './UserDropdown.css';
import { useNavigate } from 'react-router-dom';
const UserDropdown = ({ shortName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  return (
    <div className="user-dropdown">
      <button className="user-dropdown-toggle" onClick={toggleDropdown}>
        <div className="user-avatar">
          {shortName}
        </div>
        <FaChevronDown className={`user-chevron ${isOpen ? 'user-open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="user-dropdown-menu">
          <li className='dropdown-list' onClick={()=>{
            navigate("/profile")
          }}>
            <FaUser className="user-dropdown-icon" />
            Profile
          </li>
          <li className='dropdown-list' style={{position:"relative",left:"-2px"}} onClick={()=>{
            
            
              navigate("/order-history")
          }}>
            <MdWorkHistory className="user-dropdown-icon" style={{fontSize:"25px"}} />
            Order History
          </li>
          <li className='dropdown-list' onClick={()=>{
            localStorage.removeItem('uid')
            localStorage.removeItem('tokenExpiry')

            window.location.href = "https://e-commerce-website-cck4.vercel.app";  // htpps://e-commerce-website-cck4.vercel.app

            
          }} >
            <IoMdLogOut className="user-dropdown-icon" />
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;