import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer";
import Cookies from "js-cookie";
import IncrementDecrementBtn from "../Product/Quantity";
import { MdOutlineDelete } from "react-icons/md";
import {decrementCartCount} from "../../store/Counts"
import CardLayout from "./CardLayout";
import { BsCart2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function CartPage() {
  const token = localStorage.getItem('uid');


const tokenExpiry = localStorage.getItem('tokenExpiry');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [cart, setCart] = useState([]);
  const [EmptyCart, setEmptyCart] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
    setScreenWidth(window.innerWidth);
  };
  
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

  const getCart = async () => {
    try {
      const cart = await axios.get(`${backendUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (cart.data.length === 0) {
        setEmptyCart(true);
      }
      setCart(cart.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getCart();
  }, []);
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
    cart.map((product) => {
      total +=
        parseFloat(product.price.replace("PKR", "").replace(",", "")) *
        product.quantityInCart;
    });
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
    return formattedTotal;
  }
  return (
    <>
    
    {/* <ReactNotification /> Make sure this is rendered */}
    
    <div className="homePage" style={{height:"fit-content"}}>

      {isWideScreen ? <Navbar
      page={"cart"} /> : <Navbar2 />}
      {loading ? <div className="Loader"></div> :
      <div
        style={{ width: "100%", position: "relative" }}
        className="cartPage" 
      >
        {EmptyCart ? (
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
            Cart is Empty
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap:"30px"

              }}
            >
              Cart <BsCart2 style={{ fontSize: "70px",color:"#00a7ff" }} />
            </h1>
              
            {(screenWidth > 950) ? (
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
                    Total
                  </h3>
                  <h3
                    style={{
                      width: "100px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Quantity
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
                  className="cartSidebar-products"
                  style={{
                    paddingTop: "20px",
                    position: "relative",
                    top: "150px",
                    overflowY: "auto",
                    
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #ccc",
                    minHeight:"fit-content",
                    maxHeight:"1000px",
                    gap: "20px",
                  }}
                >
                  {cart.map((product, index) => (
                    <div key={index}>
                      <div
                        className="cartSidebar-product"
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
                          style={{
                            display: "flex",
                            width: "400px",
                            height: "120px",
                            alignItems: "center",
                            cursor:"pointer"
                          }}
                          onClick={()=>{
                            navigate(`/product/${product._id}`)
                          }}
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
                          {"PKR " +
                            convertPrice(product.price, product.quantityInCart)}
                        </p>

                        <div
                          style={{
                            width: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IncrementDecrementBtn
                            cart={false}
                            count={product.quantityInCart}
                            maxValue={product.quantity}
                            product={product._id}
                            requestBackend={getCart}
                            style={true}
                          />
                        </div>

                        <MdOutlineDelete
                          style={{
                            color: "#E7314E",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            await axios.put(
                              `${backendUrl}/remove/${product._id}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                             
                            );
                            dispatch(decrementCartCount());
                            toast.info('Successfully removed from cart!', {
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
                            )

                            getCart();
                            
                            
                                                      }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <CardLayout
                cart={cart}
                getCart={getCart}
                convertPrice={convertPrice}
                total={total}
              />
            )}
          </>
        )}
         {!EmptyCart && (
        <>
          <div className="totalDiv"
            style={{
              position: "relative",
              top: "200px",
              display: "flex",
              
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "25px", fontWeight: "bold" }}>Subtotal</p>
            <p
              style={{ fontSize: "25px", fontWeight: "bold", color: "#00a7ff" }}
            >
              {"PKR " + total()}
            </p>
          </div>
          <div className="checkout"
            style={{
              position: "relative",
              top: "220px",
              display: "flex",
              
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {screenWidth > 600 && <p style={{ fontSize: "25px", fontWeight: "bold",marginBottom:"200px" }}>Checkout</p>}
            <button
              className="checkout-button"
              onClick={()=>{
                navigate("/shipping")
              }}
              style={{
                position: "relative",
                top: "0px",
                display: "flex",
                paddingInline: "20px",
                minWidth: "30%",
                marginBottom:"200px",
                textAlign: "center",
              }}
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
      </div>
}
     
    
  
    
</div>
    <Footer />
   

  </>
  );
}
