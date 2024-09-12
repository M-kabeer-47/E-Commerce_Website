import Navbar from '../HomePage/Navbar';
import Navbar2 from '../HomePage/Navbar2';
import FilterDiv from './FilterDiv';
import ProductDisplay from './productsDisplay.jsx';
import Footer from "../HomePage/Footer/Footer.jsx"
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategory } from "../../store/category.js";
import { useNavigate } from 'react-router-dom';



import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Products() {
  useEffect(()=>{
    setTimeout(window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),100)
  },[])
  
  
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);

  let stored_category = useSelector((state) => state.category.category);
  
  

  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className=""  style={{maxHeight:"fit-content"}}>
        {isWideScreen ? <Navbar /> : <Navbar2 />}
        <div className="main">
          
          
              <FilterDiv />
              <ProductDisplay  />
            
          
          
        </div>
        <Footer />
      </div>
    </>
  );
}

