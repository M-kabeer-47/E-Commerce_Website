import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CartSidebar from "./CartSidebar";
import isTokenExpired from "../tokenExpiry";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { setCartCount, setWishlistCount } from "../../store/Counts.js";
import { setUser } from "../../store/user";


export default function Navbar2() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const cartCount = useSelector((state) => state.Counts.cartCount);
  const wishlistCount = useSelector((state) => state.Counts.wishlistCount);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shortName, setShortName] = useState("");

  const token = localStorage.getItem("uid");
  const user = useSelector((state) => state.user.user);
  const query = new URLSearchParams(useLocation().search);

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
    document.body.style.overflow = "hidden";
    
  };
  const handleCartClick = () => {
    if (!token || isTokenExpired()) {
      toast.error("Please Login", {
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
    } else {
      setIsCartOpen(true);
      document.body.style.overflow = "hidden";
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
    document.body.style.overflow = "auto";
    
  };

  async function getUser() {
    let User;
    let Token = query.get("token");

    if ((token && !isTokenExpired()) || Token) {
      if (user === null) {
        if (Token) {
          localStorage.setItem("uid", Token);
          localStorage.setItem("tokenExpiry", query.get("maxAge"));
        }

        
        User = await axios.get(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token || Token}`,
          },
        });

        
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
    } else {
      dispatch(setUser(null));
    }
  }
  // useEffect(() => {
  //   if (user != undefined || user != null) {
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
  // }, [user]);

  useEffect(() => {
    getUser();
  }, []);
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
          <Sidebar
            isOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            shortName={shortName}
            wishlistCount={wishlistCount}
            
          />
          <div className="logo">
            <Link to={"/"}>
              <h2>GlitchWare</h2>
            </Link>
          </div>
          <div
            className="icon-container"
            onClick={handleCartClick}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="icons lastIcons"
              style={iconStyle("cart")}
              onMouseEnter={() => handleMouseEnter("cart")}
              onMouseLeave={handleMouseLeave}
            />
            {cartCount > 0 && <span className="badge badge2">{cartCount}</span>}
          </div>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
}
