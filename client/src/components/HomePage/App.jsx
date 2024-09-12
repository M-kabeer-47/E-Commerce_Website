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
import Cookies from 'js-cookie';
import axios from "axios";
import { setUser } from "../../store/user.js";


export default function App() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const popularRef = useRef(null);
  const cart = useSelector((state) => state.sidebars.isCartOpen);
  const dispatch = useDispatch();

  useEffect(() => {
      
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 200);
  }, []); 

  
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
  useEffect(()=>{
    const token = Cookies.get("uid");
   
    
    if(token){
      axios.get(`${backendUrl}/user`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((res)=>{
        
        dispatch(setUser(res.data));
      })
    }

  },[])

  
  
  return (
    <>
      {isWideScreen ? <Navbar /> : <Navbar2 />}
      
      
      
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
