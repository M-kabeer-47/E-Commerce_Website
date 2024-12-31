import { faHeart, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import { FaUser } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
import { MdWorkHistory } from "react-icons/md";

const Sidebar = (props) => {
    // Hardware, Accessories, Console, Deals arrays
    const hardware = ["Processors", "Power supply", "Cases", "Graphic Cards", "Motherboards", "RAMS", "HDDs", "SSDs", "Monitors"];
    const accessories = ["Keyboards", "Mouse", "Headphones", "Cables", "Microphones", "Webcams", "Speakers"];
    const console = ["Playstation", "Xbox", "Nintendo","PS Games", "X-Box Games", "Gift cards", "PS Games", "X-Box Games", "Gift cards"];
    const allOptions = [...hardware, ...accessories, ...console];
    const deals = ["Value deals", "Smash deals", "Rapid deals", "Xtreme deals"];
  
    // Account options
    const user_options = [
      { option: "Profile", element: <FaUser className="user-dropdown-icon" /> },
      { option: "Order History", element: <MdWorkHistory className="user-dropdown-icon" style={{fontSize:"20px" }} /> },
      { option: "Logout", element: <IoMdLogOut className="user-dropdown-icon" /> }
    ];

  const user = useSelector((state) => state.user.user);
  const wishlistCount = useSelector((state) => state.Counts.wishlistCount);

  const [hoveredIcon, setHoveredIcon] = useState(null);
  
  const navigate = useNavigate();

  // Icon hover state logic
  const handleMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  // Style for hover effect on icons
  const iconStyle = (iconName) => ({
    color: hoveredIcon === iconName ? "#FF6347" : "#A0ACBD",
    transition: "color 0.3s ease",
    cursor: "pointer",
  });



  // Handle button clicks for dropdowns
  // Handle button clicks for dropdowns
const handleButtonClick = (e) => {
  const button = e.currentTarget;
  const subMenu = button.nextElementSibling;
  const isActive = button.classList.contains("active");


  // If the clicked button is active (meaning the sub-menu is open), close it
  if (isActive) {
    subMenu.style.height = "0px";
    button.classList.remove("active");
    document.body.style.overflow = "auto";
    
  } else {
    // Close all other sub-menus
    document.querySelectorAll(".sub-menu").forEach((menu) => {
      menu.style.height = "0px";
      document.body.style.overflow = "hidden"
    });
    document.querySelectorAll(".sidebar ul button").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Open the clicked sub-menu and set its height dynamically
    subMenu.style.height = `${subMenu.querySelector("ul").clientHeight}px`;
    button.classList.add("active");
    
  }
};


  // Close all sub-menus when the sidebar is closed
  useEffect(() => {
    if (!props.isOpen) {
      document.querySelectorAll(".sub-menu").forEach((menu) => {
        menu.style.height = "0px";
      });
      document.querySelectorAll(".sidebar ul button").forEach((btn) => {
        btn.classList.remove("active");
      });
    }
  }, [props.isOpen]);

  return (
    <aside className={`sidebar ${props.isOpen ? 'active' : ''}`}>
      <div className="upperSidebar">
        <header>
          <SearchBar expanded={false} />
        </header>
        <ul>
          <li>
            <button type="button" onClick={()=>{
              navigate("/")
            }}>
              <p>Home</p>
            </button>
          </li>
          <li>
            <button type="button" onClick={handleButtonClick}>
              <div className="buttonDiv">
                <p>Products</p>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: "#ffffff", fontSize: "16px" }} />
              </div>
            </button>
            <div className="sub-menu">
              <ul>
                {allOptions.map((option, index) => (
                  <p key={index}>
                    <Link to={`/products/${option.replace(/\s+/g, "-").toLowerCase()}`}>
                      <button onClick={() => props.setIsSidebarOpen(false)} key={index} type="button">
                        {option}
                      </button>
                    </Link>
                  </p>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <button type="button" onClick={handleButtonClick}>
              <div className="buttonDiv">
                <p>Pre Build PC</p>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: "#ffffff", fontSize: "16px" }} />
              </div>
            </button>
            <div className="sub-menu">
              <ul>
                {deals.map((option, index) => (
                  <p key={index}>
                    <Link to={`/products/${option.replace(/\s+/g, "-").toLowerCase()}`}>
                    <button onClick={() => props.setIsSidebarOpen(false)} key={index} type="button">
                        {option}
                      </button>
                    </Link>
                  </p>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="lowerSidebar">
        <Link className="link" onClick={()=>{
          if(props.shortName !== ""){
            navigate("/wishlist")
          }
          else{
            return;
          }
        }} style={{ width: "100%" }}>
          <div className="iconText" style={{ display: "flex", justifyContent: "space-between",position:"relative",top:"4px" }}>
            <p style={{ position: "relative" }} className="wishlist_p">Wishlist</p>
            <div className="icon-container">
              <FontAwesomeIcon
                icon={faHeart}
                className="icons lastIcons"
                style={iconStyle("heart")}
                onMouseEnter={() => handleMouseEnter("heart")}
                onMouseLeave={handleMouseLeave}
              />
              <span className="badge">{wishlistCount}</span>
            </div>
          </div>
        </Link>
        {user ? (
          <li>
            <button type="button" onClick={handleButtonClick}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", position: "relative" }} className="account_div">
                <p>Account</p>
                <div style={{ borderRadius: "50%", backgroundColor: "#007bff", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", color: "white", paddingInline: "7px", position: "relative", left: "-29px" }}>
                  {props.shortName}
                </div>
              </div>
            </button>
            <div className="sub-menu" style={{width:"100%",padding:"0px"}}>
              <ul>
                {user_options.map((option, index) => (
                  <p key={index}>
                   <Link >
                    <button type="button" key={index} style={{width:"100%",paddingInline:"30px"}} onClick={()=>{
                      if(option.option === "Logout"){
                        localStorage.removeItem('uid')
                        localStorage.removeItem('tokenExpiry')
                        window.location.reload();
                        window.location.href = "/";
                      }
                      else if(option.option === "Order History"){
                        navigate("/order-history");
                      }
                      else if(option.option === "Profile"){
                        navigate("/profile");
                      }
                    }}>
                    <li className="dropdown-list" >{option.element} 
                  </li>
                  <li className="dropdown-list">{option.option} 
                  </li>
                    </button>
                      
                    </Link>
                  </p>
                ))}
              </ul>
            </div>
          </li>
        ) : (
          <p className="loginOption login_sidebar" onClick={() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("tokenExpiry");
            navigate("/login")}} style={{ position: "relative" }}>Login/Sign Up</p>
        )}
        <Link className="login" to={"/contact-us"}>
          <p style={{ position: "relative" }} className="contact_sidebar">Contact Us</p>
        </Link>
      </div>
    </aside>
  );
};  

export default Sidebar;
