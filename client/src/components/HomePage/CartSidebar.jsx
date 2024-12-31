import axios from "axios";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import IncrementDecrementBtn from "../Product/Quantity";
// import {
//   closeCart,
  
// } from "../../store/sidebars.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import "./index.css";
import { useNavigate } from "react-router-dom";


import { setCartCount } from "../../store/Counts.js";

import { useSelector } from "react-redux";
axios.defaults.withCredentials = true;
export default function CartSidebar(props) {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const token = localStorage.getItem("uid");

  const [cart, setCart] = useState([]);
  const [EmptyCart, setEmptyCart] = useState(false);
  const [style, setStyle] = useState(false);
 
  const [loading, setLoading] = useState(false);
//  const loader = useSelector((state)=>state.loader.cartUpdate) 
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
  useEffect(() => {
    if (EmptyCart) {
      if (token) {
        try {
          axios.post(
            `${backendUrl}/emptyCart`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCart([]);

          setEmptyCart(false);
        } catch (Err) {
          console.error(Err);
        }
      }
    }
  }, [EmptyCart]);
  const requestBackend = async () => {
    
    

    if (props.isOpen) {
      setLoading(true);

      try {
        let cart = await axios.get(`${backendUrl}/cart`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
       
        
        setCart(cart.data);
        setTimeout(() => {
          setLoading(false);
        }, 700);
        
        

        
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    requestBackend();
  }, [props.isOpen]);
  useEffect(() => {});
  return (
    <aside className={` cartSidebar ${props.isOpen ? "active" : ""}`}>
      {(loading ) ? (
        <div className="Loader"></div>
      ) : (
        <>
          <div
            className="cartSidebar-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "white" }}>Shopping cart</h4>
            <div
              className="close-icon"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                props.setIsCartOpen(false);
                // dispatch(closeCart());
                document.body.style.overflow = "auto";
              }}
            >
              <h4 style={{ color: "white" }}>Close</h4>
              <IoCloseOutline style={{ color: "white", fontSize: "18px" }} />
            </div>
          </div>
          <hr
            style={{
              border: "1px solid #00A7FF",
              width: "120%",
              position: "relative",
              left: "-10px",
              marginTop: "10px",
            }}
          />
          <div
            className="cart-container"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height:"100%"
            }}
          >
            {cart.length === 0 ? (
             <div style={{height:"400px",display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
              <div style={{display: "flex",gap:"10px"}}>
              <h3 style={{color:"white"}}>Your cart is empty</h3>
              <FontAwesomeIcon icon={faCartShopping} style={{color:"white",fontSize:"30px"}}/>
              </div>
             </div>) :
             <>
           <div
              className="cartSidebar-products"
              
            >
              {cart.map((product, index) => (
                <div>
                  <div
                    className="cartSidebar-product"
                    style={{
                      boxSizing: "border-box",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "100%",
                      borderBottom: "3px solid #00A7FF",
                      paddingBottom: "10px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "5px" }}>
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="cartSidebar-image"
                        style={{
                          width: "100px",
                          height: "80px",
                          margin: "0px",
                          
                        }}
                      />
                      <div>
                        <p
                          style={{
                            textAlign: "start",
                            fontSize: "15px",
                            margin: "0px",
                          }}
                        >
                          {product.name}
                        </p>
                        <p
                          style={{
                            textAlign: "start",
                            fontSize: "14px",
                            color: "#6f94bc",
                          }}
                        >
                          {"PKR " +
                            convertPrice(product.price, product.quantityInCart)}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "end",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
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
                          requestBackend();
                          dispatch(setCartCount(cart.length - 1));
                        }}
                      >
                        <IoCloseOutline
                          style={{ color: "white", fontSize: "18px" }}
                        />
                      </div>

                      <IncrementDecrementBtn
                        cart={true}
                        count={product.quantityInCart}
                        maxValue={product.quantity}
                        product={product._id}
                        requestBackend={requestBackend}
                      />
                    </div>
                  </div>
                </div>

              ))}
            
            </div>
            </>
            }

            

            <div className="cart-footer">
              <div
                className="cartSidebar-footer"
                style={{
                  marginTop:"10px",
                  
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ color: "white" }}>Total</h4>
                <h4 style={{ color: "#00a7ff" }}>{"PKR " + total()}</h4>
                </div>

                <div
                  className="clear-cart"
                  style={{ marginTop:"10px",display: "flex", justifyContent: "space-between" }}
                >
                  <h4 style={{ color: "white" }}>Clear cart</h4>
                  <MdOutlineDelete
                    style={
                      style
                        ? {
                            color: "#E7314E",
                            fontSize: "25px",
                            zIndex: "1000000",
                            cursor: "pointer",
                          }
                        : {
                            color: "#E7314E",
                            fontSize: "25px",
                            zIndex: "100000000000",
                            cursor: "pointer",
                          }
                    }
                    onClick={async () => {
                      setEmptyCart(true);
                      dispatch(setCartCount(0));
                    }}
                    onMouseEnter={() => setStyle(true)}
                    onMouseLeave={() => setStyle(false)}
                  />
                </div>
                <button
                  className=""
                  style={{
                    
                    marginTop:"20px",
                    width: "100%",
                    padding: "8px 15px",
                    backgroundColor: "#00a7ff",
                    textAlign: "center",
                    color: "white",
                    marginBottom:"10px",
                    borderRadius:"5px"

                  }}
                  onClick={() => {
                    // dispatch(closeCart());
                    props.setIsCartOpen(false);
                    document.body.style.overflow ="auto";
                    navigate("/cart");

                  }}
                >
                  View cart
                </button>
                <button
                  className="checkout-button cart-checkout"
                  style={{maxWidth:"100%"}}
                  onClick={() => {
                    // dispatch(closeCart());
                    navigate("/shipping");
                    document.body.style.overflow = "auto";
                  }}
                  
                >
                  Proceed to checkout
                </button>
              </div>
            
          </div>
        </>
      )}
    </aside>
  );
}
