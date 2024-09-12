import { act, useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import "./product.css";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "../Products/Button";
import IncrementDecrementBtn from "./Quantity";
import { useSelector, useDispatch } from "react-redux";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { incrementCartCount, incrementWishlistCount } from "../../store/Counts";
import { setProductPageQuantity } from "../../store/product";

export default function Product() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const [product, updateProduct] = useState(null);
  const [isLoading, updateLoading] = useState(true);
  const [animationClass, setAnimationClass] = useState(""); // State for animation class
  const location = useLocation();
  const token = Cookies.get("uid");
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
  }, []); // Empty dependency array ensures this only runs on mount

  // Fetch product data
  async function fetchProduct() {
    try {
      let pr = await axios.get(`${backendUrl}/product/${id}`);
      updateProduct(pr.data);
      console.log(pr.data.quantity);

      updateLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    fetchProduct();

    // Apply animation class after component mounts
    const timer = setTimeout(() => {
      setAnimationClass("visible");
    }, 100); // Delay to ensure loading is complete

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer); // Clean up timer on unmount
    };
  }, [location.search, id]);

  return (
    <>
      <ToastContainer />
      {!isLoading && (
        <div className="homePage">
          {isWideScreen ? <Navbar /> : <Navbar2 />}
          <div className="productPageDiv">
            <div className={`productImageDiv fade-in ${animationClass}`}>
              <img src={"/" + product.imageUrl} alt={product.name} style={{objectFit:"contain",height:"400px"}}/>
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

                      if (token) {
                        
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
                        dispatch(setProductPageQuantity(0));
                          
                        if (
                          response.data !== "Product Already Exists in Cart"
                        ) {
                          dispatch(incrementCartCount());
                          

                        }
                      } else {
                        console.log("Please Login");

                        toast.info("Please Login", {
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
                    }}
                  />
                )}

                <Button
                  className="redButton"
                  text={"Add to wishlist"}
                  onClick={async () => {
                    if (token) {
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
      
                          toast.info("Successfully added to wishlist!", {
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
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
