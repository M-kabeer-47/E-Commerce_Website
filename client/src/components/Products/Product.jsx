import React, { act, useState } from "react";
import { Rating } from "@mui/material";
import Button from "./Button";
import "./products.css";

import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { incrementCartCount, incrementWishlistCount } from "../../store/Counts";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInView } from "react-intersection-observer"; 
import { useSelector } from "react-redux";
import isTokenExpired from "../tokenExpiry";
const Product = ({ product, index }) => {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const dispatch = useDispatch();
  const token = localStorage.getItem("uid");  
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.2, 
  });

  return (
    <>
      <div
        ref={ref} 
        className={`featuredProduct Product ${inView ? "animate" : ""}`} 
        onMouseEnter={() => setHoveredProduct(index)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        <Link to={`/product/${product._id}`} onClick={() => {}}>
          <img src={product.imageUrl} className="images" />
          <p className="title">{product.name}</p>
          <Tooltip title={product.rating.toFixed(1)}>
            <Rating
              name="half-rating-read"
              value={product.rating}
              precision={0.1}
              readOnly
              size="large"
            />
          </Tooltip>
          <p className="category">{product.category}</p>
          <p className="price">{product.price}</p>
        </Link>
        {product.quantity===0 && <p className="product-stock-error" style={{color:"red",fontStyle:"italic",textAlign:"start",display:"flex",justifyContent:"start",width:"100%",height:"20px",margin:"0px",position:"absolute"}}>Out of stock</p> }
        <div className="BUTTONDIV">
          <Button
            text={"Add to cart"}
            onClick={async () => {
              
              console.log("Hello");

              if (token && !isTokenExpired()) {
                if (product.quantity === 0) {
                  toast.error("Out of Stock", {
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
                        quantityInCart = quantityInCart.data.quantityInCart;
                        console.log(
                          "Quantity in Cart:" +
                            quantityInCart +
                            "Quantity " +
                            1
                        );
                        let actualQuantity = await axios.get(`${backendUrl}/getProductQuantity`, {
                          params: {
                            productId: product._id,
                          },
                        });
                        if (
                          quantityInCart + 1 >
                          actualQuantity.data.quantity
                        ) {
                          toast.error(
                            `Quantity exceeds stock. Only ${actualQuantity.data.quantity}  units available. Please adjust.`,
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
                
                        else if(actualQuantity.data.quantity === 0){
                          toast.error("Out of Stock", {
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
                        
                else {
                  let response = await axios.post(
                    `${backendUrl}/addToCart/${product._id}`,
                    {
                      quantity: 1,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  toast.success("Successfully added to cart!", {
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
                    
                    dispatch(incrementCartCount())
                    
                }
              }
              } 
              else {
                toast.info("Please Login", {
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
            }}
          />
          <Button
            className="redButton"
            text={"Add to wishlist"}
            onClick={async () => {
              
              if (token && !isTokenExpired()) {
                try {
                  let response = await axios.post(
                    `${backendUrl}/addToWishlist`,
                    {
                      productId: product._id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log(response.data);
                  if (response.data !== "Product Already Exists in Wishlist") {
                    console.log("Setting Wishlist Count");

                    dispatch(incrementWishlistCount());

                    toast.success("Successfully added to wishlist!", {
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
                    toast.error("Product Already Exists in Wishlist", {
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
                } catch (Err) {
                  console.error(Err);
                }
              } 
              else {
                

                toast.info("Please Login", {
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
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Product;
