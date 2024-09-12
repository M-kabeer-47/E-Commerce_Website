import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CartSidebar from "./CartSidebar";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast,Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCartCount, setWishlistCount } from "../../store/Counts.js";
import { setUser } from "../../store/user";
export default function Navbar2() {
  const cartCount = useSelector((state) => state.Counts.cartCount);
  const wishlistCount = useSelector((state) => state.Counts.wishlistCount);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const token = Cookies.get("uid");
  const [shortName,setShortName]  = useState("");
  const handleMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  };

  const dispatch = useDispatch();
  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const iconStyle = (iconName) => ({
    color: hoveredIcon === iconName ? "#FF6347" : "#A0ACBD",
    transition: "color 0.3s ease",
    cursor: "pointer",
  });

  const handleHamburgerClick = () => {
    setIsSidebarOpen(true);
  };
  const handleCartClick = () => {
    if(!token){
      toast.info('Please Login', {
        position: "top-right",
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
}
    
  };
  const handleOutsideClick = (event) => {
    if (
      event.target.closest(".sidebar") ||
      event.target.closest(".hamburger")
    ) {
      return;
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  async function getUser(){
    const token = Cookies.get("uid");
    console.log("hui");
    
    if(token){
      
      console.log(user);
      
      if(user===null){
        
        console.log("nigga");
          
        let res = await axios.get("https://e-commerce-website-hzldz0138.vercel.app/user",{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
          console.log(res.data);
          dispatch(setUser(res.data));
          console.log("cha haal aa");        
          dispatch(setCartCount(res.data.cart.length)); 
          dispatch(setWishlistCount(res.data.wishlist.length));
          if(!Object.hasOwn(res.data,"lastName")){
            setShortName(res.data.firstName[0].toUpperCase()+res.data.firstName[1].toUpperCase())
          }
          else{
            setShortName(res.data.firstName[0].toUpperCase()+res.data.lastName[0].toUpperCase())
          }
        }
      
      
       
      else{
        if(!Object.hasOwn(user,"lastName")){
          setShortName(user.firstName[0].toUpperCase()+user.firstName[1].toUpperCase())
        }
        else{
          setShortName(user.firstName[0].toUpperCase()+user.lastName[0].toUpperCase())
        }
      }
      
    
  }
  else{
    dispatch(setUser(null))
  }
    
  
  }
  
    useEffect(()=>{
     getUser()
    },[user])
  return (
    <div>
      {isCartOpen && <div className="overlay"></div>}
      <div className="navbar">
        <div className="navbar NAVBAR">
          <GiHamburgerMenu
            className="hamburger"
            style={{ color: "white", fontSize: "20px" }}
            onClick={handleHamburgerClick}
          />
          <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} shortName={shortName} wishlistCount={wishlistCount}/>
          <div className="logo">
            <Link to={"/"}>
              <h2>GlitchWare</h2>
            </Link>
          </div>
          <div className="icon-container" onClick={handleCartClick} style={{cursor:"pointer"}}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="icons lastIcons"
              style={iconStyle("cart")}
              onMouseEnter={() => handleMouseEnter("cart")}
              onMouseLeave={handleMouseLeave}
            />
            {cartCount > 0 && (
            <span className="badge badge2">{cartCount}</span>
          )}
          </div>
        </div>
        
      </div>
      <CartSidebar isOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
}
