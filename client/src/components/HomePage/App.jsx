import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar.jsx";
import Navbar2 from "./Navbar2.jsx";
import BackgroundPic from "./BackgroundPic.jsx";
import { Carousel1 } from "./Carousel1/Carousel1.jsx";
import FeaturedProduct from "./featuredProducts/FeaturedProduct.jsx";
import Slider from "../HomePage/featuredPreBuids/PreBuilds.jsx";
import VideoDiv from "../videoDiv/VideoDiv.jsx";
import Footer from "./Footer/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import './index.css';
import axios from "axios";
import { setUser } from "../../store/user.js";
import { useLocation } from "react-router-dom";
import { setCartCount, setWishlistCount } from "../../store/Counts.js";
import isTokenExpired from "../tokenExpiry.js";

export default function App() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [userLoading,setUserLoading] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const [shortName, setShortName] = useState("");
  const popularRef = useRef(null);
  const token = localStorage.getItem("uid");
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search)
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
      
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 200);
  }, []); 

  async function getUser() {
    let User;
    let Token = query.get("token");
    
    if ((token && !isTokenExpired()) || Token) {

      if (user === null && token) {
        setUserLoading(true);
        User = await axios.get(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        setUserLoading(false);

      }
      else if(user === null && Token){
        localStorage.setItem("uid",Token);
        localStorage.setItem("tokenExpiry",query.get("maxAge"));
        setUserLoading(true);
         User = await axios.get(`${backendUrl}/user`, {  
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        setUserLoading(false);
      }

       dispatch(setUser(User.data));
       dispatch(setCartCount(User.data.cart.length)); 
       dispatch(setWishlistCount(User.data.wishlist.length));
      
      if (!Object.hasOwn(User.data, "lastName")) {
        setShortName(
          User.data.firstName[0].toUpperCase() + User.data.firstName[1].toUpperCase()
        );
      } else {
        setShortName(
          User.data.firstName[0].toUpperCase() + User.data.lastName[0].toUpperCase()
        );
      }
      
      
 
    }  
    else {
      dispatch(setUser(null));
    }
  }
  useEffect(()=>{
    if(user!=undefined || user!=null){
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

  },[])
  useEffect(() => {
    getUser();
  }, [user,token]);

  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  const handleScroll = () => {
    if (popularRef.current) {
      const rect = popularRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        popularRef.current.classList.add("animate");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
   

    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  
  
  return (
    <>
      {isWideScreen ? <Navbar isWideScreen={isWideScreen} userLoading={userLoading} setUserLoading={setUserLoading} /> : <Navbar2 isWideScreen={isWideScreen}/>}
      
      
      
      <BackgroundPic />
      <div className="gap">
        <h2 ref={popularRef} className="popular">MOST POPULAR</h2>
      </div>
      <Carousel1 />
      <FeaturedProduct />
      <Slider />
      <VideoDiv />
      <Footer />
    </>
  );
}
