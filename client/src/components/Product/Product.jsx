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
  const [product, updateProduct] = useState(null);
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
  }, []); // Empty dependency array ensures this only runs on mount

  // Fetch product data
  async function fetchProduct() {
    try {
      updateLoading(true);
      let product = await axios.get(`${backendUrl}/product/${id}`);
      updateProduct(product.data);
      setReviews(product.data.reviews);

      

      updateLoading(false);
    } catch (error) {
      console.error(error);
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
          {isLoading ? (
  <div className="Loader"></div>
) : product ? (
  <>
    <div className="productPageDiv">
      <div className={`productImageDiv fade-in ${animationClass}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ objectFit: "contain", height: "400px" }}
        />
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

        <Rating
          name="size-large"
          precision={0.5}
          value={product.rating}
          size="medium"
          style={{ position: "relative", top: "10px" }}
          readOnly
        />
        <p
          className="productPrice"
          style={{ fontSize: "20px", fontWeight: "bold", color: "#00a7ff" }}
        >
          Price: <span style={{ color: "white" }}>{product.price}</span>
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
          <p style={{ color: "red", fontStyle: "italic" }}>Out of stock</p>
        )}

        <div
          className="BUTTONDIV"
          style={{ display: "flex", justifyContent: "start" }}
        >
          {product.quantity !== 0 && (
            <Button
              text={"Add to cart"}
              onClick={async () => {
                // Add-to-cart logic
              }}
            />
          )}

          <Button
            className="redButton"
            text={"Add to wishlist"}
            onClick={async () => {
              // Add-to-wishlist logic
            }}
          />
        </div>
      </div>
    </div>
  </>
) : (
  <p></p>
)}

          <ProductReviews productId={id} backendUrl={backendUrl} reviews={reviews} fetchReviews={fetchReviews} />
          <SimilarProducts category={product.category} currentProductId={id} backendUrl={backendUrl} />
          <Footer />
        </div>
       
      
    </>
  );
}
