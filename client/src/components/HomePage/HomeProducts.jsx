import React, { useEffect, useState, useRef } from 'react';
import { IoCartOutline } from "react-icons/io5";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Cookies from "js-cookie"
import { useDispatch } from 'react-redux';
import{ incrementCartCount } from '../../store/Counts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import isTokenExpired from '../tokenExpiry';
import { useLocation } from 'react-router-dom';
const HomeProducts = ({ product, index, type }) => {
    const backendUrl = useSelector((state) => state.user.backendUrl);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [animationClass, setAnimationClass] = useState(""); // State for animation class
    const productRef = useRef(null); // Ref for the product element
    const dispatch = useDispatch()
    const navigate = useNavigate();

    
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimationClass("visible");
                }
            },
            { threshold: 0.1 } // Adjust based on when you want the animation to trigger
        );

        if (productRef.current) {
            observer.observe(productRef.current);
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (productRef.current) {
                observer.unobserve(productRef.current);
            }
        };
    }, []);
    async function handleAddToCart(){
        let token = localStorage.getItem("uid")
        if(!token || isTokenExpired()){
            toast.error('Please login', {
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
              return;
        } 
        
        let quantityInCart = await axios.get(
            `${backendUrl}/quantityInCart`,
            {
              params: { imageUrl: product.imageUrl },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          quantityInCart = quantityInCart.data;
          console.log(
            "Quantity in Cart:" +
              quantityInCart +
              "Quantity " +
              1
          );

          if (
            quantityInCart + 1 >
            product.quantity
          ) {
            toast.error(
              `Quantity exceeds stock. Only ${product.quantity}  units available. Please adjust.`,
              {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              }
            );
            return;
          }
       let response = await axios.post(`${backendUrl}/addToCart/${product._id}`,{
            quantity: 1
        },{
            headers:{"Authorization": `Bearer ${token}`
        }
        })
        
        toast.success('Successfully added to cart!', {
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
          if(response.data !== "Product Already Exists in Cart"){
            dispatch(incrementCartCount());
          }
        
    }


    return (
        <div
            className={`${type === 'prebuild' ? 'productCard' : 'featuredProduct'} fade-in ${animationClass}`}
            onMouseEnter={() => setHoveredProduct(index)}
            onMouseLeave={() => setHoveredProduct(null)}
            ref={productRef}
        >
            <div>
                <img src={product.imageUrl} alt={product.title} className={type === 'prebuild' ? 'productImage' : 'images'} onClick={()=>{
                    navigate(`/product/${product._id}`)
                }}
                style={{cursor:"pointer"}}
                />
                {(hoveredProduct === index && screenWidth > 1000 && product.quantity!==0) && (
                    <div className="cart visible" style={{ position: "relative", top: "-30px", cursor: "pointer" }} onClick={async ()=>{
                       handleAddToCart();
                    }}>
                        {product.quantity!==0 && <p>Add to cart</p>}
                        
                    </div>
                )}
                {(screenWidth < 1000 && type !== "prebuild" && product.quantity!==0) && (
                    <div className='cartWrapper2' >
                        <div className={`cartIconDiv ${type === 'prebuild' && 'preBuildCart'}`} onClick={()=>{
                        handleAddToCart();
                    }}>
                            <IoCartOutline className='productCart' />
                        </div>
                    </div>
                )}
                {(screenWidth < 1000 && type === "prebuild" && product.quantity !== 0) && (
                    <div className='cartWrapper' >
                        <div className={`cartIconDiv ${type === 'prebuild' && 'preBuildCart'}`} onClick={()=>{
                        handleAddToCart();
                    }}>
                            <IoCartOutline className='productCart' />
                        </div>
                    </div>
                )}
                {product.quantity === 0 && (<p style={{color:"red",fontStyle:"italic",minWidth:"100%",display:"flex",justifyContent:"center"}}>Out of stock</p>)}
            </div>
            <p className="title">{product.name}</p>
            <p className="category">{product.category}</p>
            <p className="price">{product.price}</p>
        </div>
    );
};

export default HomeProducts;
