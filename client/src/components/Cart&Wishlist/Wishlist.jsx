import axios from "axios";
import { useEffect, useState } from "react";


import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import { CiHeart } from "react-icons/ci";
import Footer from "../HomePage/Footer/Footer";
import { incrementCartCount,setWishlistCount } from "../../store/Counts";
import Cookies from "js-cookie";




import { MdOutlineDelete } from "react-icons/md";


import { useDispatch } from "react-redux";

import Button from "../Products/Button";

import { toast,Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import WishlistCardLayout from "./WishlistCardLayout";
import { useSelector } from "react-redux";
export default function wishlistPage() {
  const token = localStorage.getItem("uid");
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [wishlist, setWishlist] = useState([]);
  const [EmptyWishlist, setEmptyWishlist] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
    setScreenWidth(window.innerWidth);
  };
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Scroll to the top when the component is mounted
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, []); // Empty dependency array ensures this only runs on mount
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getWishlist = async () => {
    try {
      const wishlist = await axios.get(`${backendUrl}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (wishlist.data.length === 0) {
        setEmptyWishlist(true);
      }
      setWishlist(wishlist.data);
      console.log(wishlist.data);
      setTimeout(() => {
        setLoading(false);
      }, 700);
      
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getWishlist();
  }, [wishlist]);
  function convertPrice(price, quantity) {
    let Price =
      parseFloat(price.replace("PKR", "").replace(",", "")) * quantity;
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Price);

    return formattedTotal;
  }
  function total() {
    let total = 0;
    wishlist.map((product) => {
      total +=
        parseFloat(product.price.replace("PKR", "").replace(",", "")) *
        product.quantity;
    });
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
    return formattedTotal;
  }
  const navigate = useNavigate();
  return (
    <>
    
      
    <div className="" style={{minHeight:"600px",maxHeight:"fit-content",marginBottom:"200px"}}>

      {isWideScreen ? <Navbar /> : <Navbar2 />}
      {loading ? <div className="Loader"></div> :
      <div
        style={{ width: "100%", position: "relative",paddingInline:"20px",height:"auto" }}
        // className="wishlistPage"
      >
        {EmptyWishlist ? (
          <h1
            style={{
              color: "white",
              width: "100%",
              height: "50px",
              position: "relative",
              top: "250px",
              textAlign: "center",
            }}
          >
            Wishlist is Empty
          </h1>
        ) : (
          <>
            <h1
              style={{
                color: "white",
                width: "100%",
                height: "50px",
                position: "relative",
                top: "100px",
                textAlign: "center",
                display:"flex",
                gap:"30px",
                alignItems:"center",
                justifyContent:"center"
              }}
            >
              Wishlist 
              <CiHeart style={{ color: "#E7314E", fontSize: "70px" }} />
              

            </h1>

            {screenWidth > 950 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    position: "relative",
                    top: "150px",
                    left: "0px",
                    boxSizing: "border-box",

                    padding: "10px 0",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      width: "400px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Product
                  </h3>
                  <h3
                    style={{
                      width: "100px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Price
                  </h3>
                  <h3
                    style={{
                      width: "220px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Add
                  </h3>
                  <h3
                    style={{
                      width: "50px",
                      textAlign: "center",
                      position: "relative",
                      left: "-50px",
                      color: "white",
                    }}
                  >
                    Remove
                  </h3>
                </div>

                <div
                  className="wishlistSidebar-products"
                  style={{
                    paddingTop: "20px",
                    position: "relative",
                    top: "150px",
                    overflowY: "auto",
                    minHeight:"fit-content",
                    maxHeight: "600px",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #ccc",
                    gap: "20px",
                    marginBottom: "300px",
                  }}
                >
                  {wishlist.map((product, index) => (
                    <div key={index}>
                      <div
                        className="wishlistSidebar-product"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "2px solid #00A7FF",
                          paddingBottom: "10px",
                          paddingRight: "20px",
                        }}
                      >
                        <div
                        onClick={()=>{
                          navigate(`/product/${product._id}`)
                        }}
                          style={{
                            display: "flex",
                            width: "400px",
                            height: "120px",
                            alignItems: "center",
                            cursor:"pointer"
                          }
                          
                        }
                        
                        >
                          <img
                            src={product.imageUrl}
                            alt=""
                            style={{
                              width: "80%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                          <p
                            style={{
                              fontSize: "15px",
                              marginLeft: "10px",

                              width: "350px",
                            }}
                          >
                            {product.name}
                          </p>
                        </div>

                        <p
                          style={{
                            fontSize: "14px",
                            color: "#6f94bc",
                            width: "100px",
                            textAlign: "center",
                          }}
                        >
                          {product.price}
                    
                        </p>

                        <div
                          style={{
                            width: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div className="BUTTONDIV">
                            {product.quantity !== 0 ? (
        <Button 
          text={"Add to cart"}

        onClick={async ()=>{
          
            if(token){
                try{
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
                  else{
                let response = await axios.post(`${backendUrl}/addToCart/${product._id}`,{
                    quantity:1
                },{
                    headers:{
                    "Authorization":`Bearer ${token}`
                    }
                })
                if(response.data !== "Product Already Exists in Cart"){
                  dispatch(incrementCartCount());
                }
                
                console.log(response.data);
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
                }
              }
                catch(Err){
                console.error(Err);
                }
            }
                    
        }}
        />)
        :<p style={{color:"red",fontStyle:"italic"}}>Out of stock</p>}
        </div>
                        </div>

                        <MdOutlineDelete
                          style={{
                            color: "#E7314E",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            await axios.put(
                              `${backendUrl}/removeWishlist/${product._id}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            getWishlist();
                            dispatch(setWishlistCount(wishlist.length - 1));
                            toast.info('Successfully removed!', {
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
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <WishlistCardLayout
                wishlist={wishlist}
                getWishlist={getWishlist}
                convertPrice={convertPrice}
                total={total}
              />
            )}
          </>
        )}
         
      </div>
}
     
    
  
    </div>

    <Footer />
  
  </>
  );
}
