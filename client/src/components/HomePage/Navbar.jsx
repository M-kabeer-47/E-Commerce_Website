import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import SmallDropdown from "./SmallDropdown.jsx";
import SearchBar from "./SearchBar";
import CartSidebar from "./CartSidebar.jsx";
import "./index.css"; 
import { useDispatch, useSelector } from "react-redux";
import {openCart,} from "../../../waste/sidebars.js";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/user.js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast,Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCartCount, setWishlistCount } from "../../store/Counts.js";
import UserDropdown from "./userDropdown/UserDropdown.jsx";
import isTokenExpired from "../tokenExpiry.js";
export default function Navbar({page}) {
  
 
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSmallDropdownVisible, setIsSmallDropdownVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
 
  const [userLoading,setUserLoading] = useState(false);
  const [shortName, setShortName] = useState("");

  const dropdownRef = useRef(null);
  const productsRef = useRef(null); 
  const dealsRef = useRef(null); 

  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.Counts.cartCount);
  const wishlistCount = useSelector((state) => state.Counts.wishlistCount);
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const user = useSelector((state) => state.user.user);
  const query = new URLSearchParams(useLocation().search)
  const token = localStorage.getItem("uid"); 

  const handleMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  };
  
  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const handleCartClick = () => {
    if(page === "cart"){
      return;
    }

    if(!token || isTokenExpired()){
      toast.error('Please Login', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    }
else{
    setIsCartOpen(true);
    dispatch(openCart());
    document.body.style.overflow = "hidden";
}
    

    
  };
  async function getUser() {
    let User;
    let Token = query.get("token");
    
    if ((token && !isTokenExpired()) || Token) {
      
      if (user === null) {
        if(Token){
          localStorage.setItem("uid",Token);
          localStorage.setItem("tokenExpiry",query.get("maxAge"));
        }
        setUserLoading(true);
        User = await axios.get(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token || Token}`,
          },
        });
        setUserLoading(false);
        dispatch(setUser(User.data));
        dispatch(setCartCount(User.data.cart.length));
        dispatch(setWishlistCount(User.data.wishlist.length));

        if (!Object.hasOwn(User.data, "lastName")) {
          setShortName(
            User.data.firstName[0].toUpperCase() +
              User.data.firstName[1].toUpperCase()
          );
        } else {
          setShortName(
            User.data.firstName[0].toUpperCase() +
              User.data.lastName[0].toUpperCase()
          );
        }
        
        

      }
      else if(user!=undefined || user!=null){
        if (!Object.hasOwn(user, "lastName")) {
                setShortName(
                  user.firstName[0].toUpperCase() + user.firstName[1].toUpperCase()
                );
              } else {
                setShortName(
                  user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
                );
              }
      }
    }  
    else {
      dispatch(setUser(null));
    }
  }
  useEffect(() => {
    getUser();
  }, []);
// useEffect(()=>{
//   if(user!=undefined || user!=null){
//     if (!Object.hasOwn(user, "lastName")) {
//       setShortName(
//         user.firstName[0].toUpperCase() + user.firstName[1].toUpperCase()
//       );
//     } else {
//       setShortName(
//         user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
//       );
//     }
//   }
// },[user])
  
  
  const iconStyle = (iconName) => ({
    color: hoveredIcon === iconName ? "#FF6347" : null,
    transition: "color 0.3s ease",
    cursor: "pointer",
  });

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      productsRef.current &&
      !productsRef.current.contains(event.target) &&
      dealsRef.current &&
      !dealsRef.current.contains(event.target)
    ) {
      setIsDropdownVisible(false); 
      setIsSmallDropdownVisible(false); 
    }
  };

  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductsClick = () => {
    setIsDropdownVisible((prev) => !prev); 
  };

  const handleDealsClick = () => {
    setIsSmallDropdownVisible((prev) => !prev); 
  };

  const navigate = useNavigate();
  return (
    <>
   
    <ToastContainer />
    <div>
      {isCartOpen && <div className="overlay"></div>}
      <div className="navbar">
        <div className="navbar NAVBAR ">
          <div className="logo">
            <h2>GlitchWare</h2>
          </div>
          <div className="navOptions">
            <p
              onClick={() => {
                navigate("/");
              }}
            >
              HOME
            </p>
            <div
              className=""
              onClick={handleProductsClick}
              ref={productsRef} 
            >
              <div
                className="prod"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <p>PRODUCTS</p>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  style={{ color: "#ffffff", fontSize: "11px" }}
                />
              </div>
              <Dropdown isVisible={isDropdownVisible} ref={dropdownRef} />
            </div>
            <div
              className="deals"
              onClick={handleDealsClick}
              ref={dealsRef} 
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <p>Pre BUILD PC</p>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  style={{ color: "#ffffff", fontSize: "11px" }}
                />
              </div>
              <SmallDropdown isVisible={isSmallDropdownVisible} />
            </div>
          </div>
          <SearchBar expanded={true} /> {/* Use the SearchBar component */}
          <div className="lastOptions">
          
  {(() => {
    if ((token || query.get("token")) && userLoading && !isTokenExpired()) {
      
      
      return <div className="user-skeleton"></div>;
    } else if ((token || query.get("token")) && !userLoading && !isTokenExpired()) {
      
      return <UserDropdown shortName={shortName} />;
    } else {
      
      return (
        <p
          className="loginOption"
          onClick={() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("tokenExpiry");
            navigate("/login");
          }}
        >
          Login/Sign Up
        </p>
      );
    }
  })()}


            <div
              className="icon-container"
              onClick={() => {
                if((token || query.get("token")) && !isTokenExpired()){
                navigate("/wishlist");
              }
              else{
                toast.error('Please Login', {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Bounce,
                  });
              }
            }
            }
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="icons lastIcons"
                style={iconStyle("heart")}
                onMouseEnter={() => handleMouseEnter("heart")}
                onMouseLeave={handleMouseLeave}
              />
                          {wishlistCount > 0 && (
            <span className="badge badge2">{wishlistCount}</span>
          )}
            </div>
            <div
              className="icon-container"
              style={{ cursor: "pointer" }}
              onClick={handleCartClick}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                className="icons lastIcons"
                style={hoveredIcon === "cart" ? { color: "#00a7ff" } : null}
                onMouseEnter={() => handleMouseEnter("cart")}
                onMouseLeave={handleMouseLeave}
              />
                          {cartCount > 0 && (
            <span className="badge badge2">{cartCount}</span>
          )}
            </div>
          </div>
        </div>
      </div>
      <CartSidebar
        isOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        navbar={true}
      />
    </div>
    </>
  );
}
