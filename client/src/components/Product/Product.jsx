import { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import "./product.css";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import SimilarProducts from "./SimilarProducts.jsx";
import ProductReviews from "./ProductReviews";
import Button from "../Products/Button";
import IncrementDecrementBtn from "./Quantity";
import { useSelector, useDispatch } from "react-redux";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { incrementCartCount, incrementWishlistCount } from "../../store/Counts";

import Footer from "../HomePage/Footer/Footer";
import isTokenExpired from "../tokenExpiry";
import { Rating } from "@mui/material";


export default function Product() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const [product, updateProduct] = useState("");
  const [isLoading, updateLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState(""); // State for animation class
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("uid");
  const { product: id } = useParams();
  const dispatch = useDispatch();
  const ProductPageQuantity = useSelector((state) => state.product.quantity);

  // Handle screen resize
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  useEffect(() => {
    // Scroll to the top when the component is mounted
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
    window.addEventListener("resize", handleResize);
    fetchProduct();

    
    const timer = setTimeout(() => {
      setAnimationClass("visible");
    }, 100); 

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer); 
    };
  }, []); 

  
  async function fetchProduct() {
    try {
      updateLoading(true);
      let product = await axios.get(`${backendUrl}/product/${id}`);
      updateProduct(product.data);
      setReviews(product.data.reviews);

      

      updateLoading(false);
    } catch (error) {
      console.error(error);
      updateLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    fetchProduct();

    
    const timer = setTimeout(() => {
      setAnimationClass("visible");
    }, 100); 

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer); 
    };
  }, [location.search, id]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/reviews/${id}`);
      setReviews(response.data);
      
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  return (
    <>
      
      
        <div className="homePage">
          {isWideScreen ? <Navbar /> : <Navbar2 />}

          <div className="productPageDiv">
          {isLoading || !product ? <div className="Loader" style={{position:"absolute",left:"47%",top:"200px"}}></div>
      :  (
        <>
            <div className={`productImageDiv fade-in ${animationClass}`}>
              <img src={product.imageUrl} alt={product.name} style={{objectFit:"contain",height:"400px"}}/>
            </div>

            <div className={`productDetailsDiv fade-in ${animationClass}`}>
              <h2 className="productTitle">{product.name}</h2>
              <p className="productCategory">{product.category}</p>
              <p className="productDescription">{product.description}</p>
              <h3>Specifications</h3>
              <div className="specsDiv">
                {product.longDescription.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </div>
              
               <Rating name="size-large" precision={0.5} value={product.rating} size="medium" style={{position:"relative",top:"10px"}}  readOnly/>
              <p className="productPrice" style={{fontSize:"20px",fontWeight:"bold",color:"#00a7ff"}}>
                Price: <span style={{color:"white"}}>{product.price }</span> 
              </p>
              {product.quantity !== 0 ? (
                <div className="BUTTONDIV button-div">
                  <IncrementDecrementBtn
                    count={0}
                    maxValue={product.quantity}
                    type={"page"}
                  />
                </div>
              ) : (
                <p style={{ color: "red", fontStyle: "italic" }}>
                  Out of stock
                </p>
              )}
           
              <div
                className="BUTTONDIV"
                style={{ display: "flex", justifyContent: "start" }}
              >
                {product.quantity !== 0 && (
                  <Button
                    text={"Add to cart"}
                    onClick={async () => {
                      console.log("Hello");

                      if (token && !isTokenExpired()) {
                        
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
                            ProductPageQuantity
                        );
                        let actualQuantity = await axios.get(`${backendUrl}/getProductQuantity`, {
                          params: {
                            productId: product._id,
                          },
                        });
                        if (
                          quantityInCart + ProductPageQuantity >
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
                        else if(actualQuantity.data.quantity===0){
                          toast.error(
                            `Product is out of stock`,
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


                        let response = await axios.post(
                          `${backendUrl}/addToCart/${product._id}`,
                          { quantity: ProductPageQuantity },
                          { headers: { Authorization: `Bearer ${token}` } }
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
                        setTimeout(() => {
                          window.location.reload();
                        }
                        , 1000);
                        
                          
                        if (
                          response.data !== "Product Already Exists in Cart"
                        ) {
                          dispatch(incrementCartCount());
                          

                        }
                      } else {
                        console.log("Please Login");

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
                )}

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
                    } else {
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
)}
          </div>
        
          <ProductReviews productId={id} backendUrl={backendUrl} reviews={reviews} fetchReviews={fetchReviews} />
          <SimilarProducts category={product.category} currentProductId={id} backendUrl={backendUrl} />
          <Footer />
        </div>
       
      
    </>
  );
}
