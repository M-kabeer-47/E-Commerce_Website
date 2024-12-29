import "./checkout.css";
import { useState, useEffect } from "react";
import OrderDetails from "./OrderDetails";
import { BsCreditCard2Front } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import axios from "axios";

import { FaCheckCircle } from "react-icons/fa";
import "./checkout.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../store/Counts";

import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { set } from "mongoose";
export default function Shipping() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const token = localStorage.getItem("uid");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const location = useLocation();
  const [stockLoader, setStockLoader] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const { failure } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [focusedInput, setFocusedInput] = useState(null);
  const [submitOnce, setSubmitOnce] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [usdAmount, setUSDAmount] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [details, updateDetails] = useState({
    
    name: "",
    city: "",
    state: "",
    zip: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  async function convertPKRtoUSD(pkrAmount) {
    const response = await axios.get(
      `https://api.currencyapi.com/v3/latest?apikey=cur_live_k1jO0sXBPn9DlQjS1vtUamQ9Ua3ekv5guYHKovSN`
    );
    let { data } = response.data;
    let { PKR } = data;
    let rate = PKR.value;

    const usdAmount = pkrAmount / rate;
    return usdAmount;
  }
  function Total(tax) {
    let total = tax;
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
  async function getTotal(tax) {
    let total = tax;
    cart.map((product) => {
      total +=
        parseFloat(product.price.replace("PKR", "").replace(",", "")) *
        product.quantityInCart;
    });
    let price = await convertPKRtoUSD(total);
    console.log(price);
    setUSDAmount(price);
  }

  useEffect(() => {
    setTotal(Total(300));
    setSubtotal(Total(0));
  }, [cart]);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  let verifyStock = async (Cart) => {
    if (Cart.length > 0) {
      console.log("Insdie function verifyStock:" + Cart);

      let response = await axios.get(`${backendUrl}/verifyStock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          order: Cart,
        },
      });

      if (response.data.status) {
        setOutOfStock(true);
        setOutOfStockProducts(response.data.products);
        setStockLoader(false);
      }
    }
  };
  const requestBackend = async () => {
    console.log("Requesting Backend");

    console.log("Inside true");

    try {
      let cart = await axios.get(`${backendUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (cart.data.length === 0) {
        navigate("/");
      }

      await verifyStock(cart.data);
      setCart(cart.data);

      console.log(cart.data);
    } catch (error) {
      toast.error("Error fetching cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };
  useEffect(() => {
    requestBackend();
    if (failure) {
      toast.error("Payment Failed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);
  const phoneRegex = /^[+]?[0-9]{10,15}$/; // Example regex for phone numbers

  function handleChange(e) {
    setSubmitOnce(false);
    updateDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  }
  const dispatch = useDispatch();
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  async function handleSubmit(event, payment) {
    event.preventDefault();
    setSubmitOnce(true);

    if (
      details.name === "" ||
      details.city === "" ||
      details.state === "" ||
      details.zip === "" ||
      details.address === "" ||
      details.phone === "" ||
      paymentMethod === ""
    ) {
      return;
    } else if (!phoneRegex.test(details.phone)) {
      return;
    } else {
      const date = new Date();
      // Get date in day/month/year format
      const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' locale gives dd/mm/yyyy format

      // Get time in 12-hour format with AM/PM
      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };
      const formattedTime = date.toLocaleTimeString("en-US", options);
      
      
      const order = {
        total: total,
        items: cart,
        customer_name: details.name,
        customer_address: details.address,
        customer_phone: details.phone,
        payment_method: paymentMethod,
        status: "Processing",
        date: formattedDate,  
      };

      if (payment === "card") {
        console.log(total, subtotal, usdAmount, cart, order);

        navigate("/stripe", {
          state: {
            total: total,
            subtotal: subtotal,
            usdAmount: usdAmount,
            order: order,
            cart: cart,
            order_for_admin: order,
            
          },
        });
      } else {
        try{

        
        setPlacingOrder(true);
        let response = await axios.post(
          `${backendUrl}/admin_order`,
          {
            order_for_admin: order,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let id = response.data.id;
        console.log(response.data);
        console.log("Placing Order");
        await axios.post(
          `${backendUrl}/emptyCart`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.put(
          `${backendUrl}/updateStocks`,
          {
            order: cart,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await axios.put(
          `${backendUrl}/orderHistory`,
          { order: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimeout(() => {
          setOrderPlaced(true);
          setPlacingOrder(false);
        }, 2000);
        dispatch(setCartCount(0));
        setTimeout(() => {
          console.log("Redirecting to home");

          navigate("/");  
        }, 3000);
      }
      catch(error){
        setPlacingOrder(false);
        toast.error("Error fetching cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    }
    
    }
  }
  if (!token) {
    navigate("/login");
  }
  if (!token) {
    return null;
  }

  const inputStyle = (inputName) => ({
    width: "100%",
    height: "46px",
    paddingLeft: "8px",
    borderRadius: "4px",
    border: focusedInput === inputName ? "2px solid #00a7ff" : "2px solid #ccc",
    outline: "none",
    backgroundColor: "transparent",
    color: "white",
    boxShadow:
      focusedInput === inputName ? "0 0 8px rgba(0, 167, 255, 0.5)" : "none",
  });

  return (
    <>
      {orderPlaced && (
        <>
          <div
            style={{
              height: "100vh",
              width: "100%",
              backgroundColor: "#1f1f1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="successBox"
              style={{ width: "300px", backgroundColor: "black" }}
            >
              <FaCheckCircle className="tickAnimation" />
              <h3>Order placed successfully!</h3>
            </div>
          </div>
        </>
      )}
      {!orderPlaced && stockLoader && cart.length === 0 && (
        <>
          <div
            className="shipping"
            style={{
              backgroundColor: "#191919",
              width: "100%",
              paddingBottom: "100px",
              height: "100vh",
            }}
          >
            <div
              className="shipping-nav"
              style={{
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                boxSizing: "border-box",
                height: "70px",
                paddingTop: "25px",
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Audiowide",
                  fontSize: "30px",
                  color: "#00a7ff",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Glitchware
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </div>
          </div>
        </>
      )}
      {outOfStock && !orderPlaced && (
        <div
          style={{
            height: "100vh",
            width: "100%",
            backgroundColor: "#1f1f1f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="outOfStock"
            style={{
              minWidth: "40%",
              backgroundColor: "black",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px 10px #191919",
            }}
          >
            <h3 style={{ color: "#00a7ff", textAlign: "center" }}>
              Product quantities have updated
            </h3>
            <ul style={{ color: "white" }}>
              <div>
                <ul
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBlock: "15px",
                    marginTop: "30px",
                  }}
                >
                  <li style={{ color: "#B4B4B4" }}>Product</li>
                  <li style={{ color: "#B4B4B4" }}>Quantity</li>
                </ul>
              </div>
              {outOfStockProducts.map((product) => (
                <ul
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingRight: "30px",
                    marginBottom: "20px",
                  }}
                >
                  <li key={product._id}>{product.name}</li>
                  <li
                    key={product._id}
                    style={{ textAlign: "start", color: "#00a7ff" }}
                  >
                    {product.quantity}
                  </li>
                </ul>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!orderPlaced && !outOfStock && cart.length !== 0 && (
        <div
          className="shipping"
          style={{
            backgroundColor: "#191919",
            width: "100%",
            
            height: "100vh",
            paddingBottom: "100px",
          }}
        >
          <div
            className="shipping-nav"
            style={{
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              boxSizing: "border-box",
              height: "70px",
              paddingTop: "25px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontFamily: "Audiowide",
                fontSize: "30px",
                color: "#00a7ff",
              }}
            >
              Glitchware
            </h2>
          </div>
          <div className="shipping-main" style={{ width: "100%", gap: "50px" }}>
            <div className="shipping-container" style={{ paddingLeft: "20px" }}>
              <h3
                style={{
                  color: "white",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                Shipping Details
              </h3>
              <div className="shipping-inputs">
                {["Name", "City", "State", "Zip", "Address", "Phone"].map(
                  (input) => (
                    <div className="shipping-input" key={input}>
                      <label htmlFor={input} style={{ color: "#6f94bc" }}>
                        {input}
                      </label>
                      {input === "Phone" ? (
                        <>
                          <PhoneInput
                            defaultCountry="ua"
                            value={details.phone}
                            onChange={(phone) =>
                              updateDetails({ ...details, phone })
                            }
                            inputStyle={{
                              width: "100%",
                              height:
                                "36px" /* Match height with other inputs */,
                              paddingLeft: "8px",
                              borderRadius: "4px",
                              // border:
                              //   focusedInput === "Phone"
                              //     ? "2px solid #00a7ff"
                              //     : "2px solid #ccc",
                              outline: "none",
                              color: "white",
                              backgroundColor: "transparent",
                              boxShadow:
                                focusedInput === "Phone"
                                  ? "0 0 8px rgba(0, 167, 255, 0.5)"
                                  : "none",
                            }}
                            buttonStyle={{
                              backgroundColor: "orange",
                              // Custom background color
                              border:
                                focusedInput === "Phone"
                                  ? "0 0 8px rgba(0, 167, 255, 0.5)"
                                  : "none",
                              color: "white",
                            }}
                            onFocus={() => handleFocus("Phone")}
                            onBlur={handleBlur}
                          />
                          {details.phone === "" && submitOnce && (
                            <p
                              style={{
                                color: "red",
                                margin: "0",
                                fontSize: "12px",
                                textAlign: "start",
                              }}
                            >
                              Phone is required
                            </p>
                          )}
                          {submitOnce && !phoneRegex.test(details.phone) && (
                            <p
                              style={{
                                color: "red",
                                margin: "0",
                                fontSize: "12px",
                                textAlign: "start",
                              }}
                            >
                              Phone number is invalid
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            name={input.toLowerCase()}
                            id={input}
                            placeholder={`Enter ${input}`}
                            style={inputStyle(input)}
                            onFocus={() => handleFocus(input)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {details[input.toLowerCase()] === "" &&
                            submitOnce && (
                              <p
                                style={{
                                  color: "red",
                                  margin: "0",
                                  fontSize: "12px",
                                  textAlign: "start",
                                }}
                              >
                                {input} is required
                              </p>
                            )}
                        </>
                      )}
                    </div>
                  )
                )}
              </div>

              <h3
                style={{
                  color: "white",
                  fontWeight: "500",
                  marginBottom: "10px",
                }}
              >
                Select a payment method
              </h3>
              <div className="payment" style={{ gap: "20px", width: "100%" }}>
                <div
                  className="payment-option"
                  onClick={() => {
                    getTotal(300);
                    setPaymentMethod("card");
                  }}
                  style={
                    paymentMethod === "card"
                      ? { border: "2px solid  #1e88e5" }
                      : {}
                  }
                >
                  <h4>Credit/Debit Card</h4>
                  <BsCreditCard2Front
                    className="credit-card-icon"
                    style={{ fontSize: "30px" }}
                  />
                </div>
                <div
                  className="payment-option"
                  onClick={() => setPaymentMethod("cash")}
                  style={
                    paymentMethod === "cash"
                      ? { border: "2px solid  #1e88e5" }
                      : {}
                  }
                >
                  <h4>Cash on delivery</h4>
                  <TbTruckDelivery
                    className="credit-card-icon"
                    style={{ fontSize: "30px" }}
                  />
                </div>
              </div>
              <div
                className="placeOrder"
                style={{
                  width: "100%",
                  height: "fit-content",
                  marginTop: "50px",
                }}
              >
                {paymentMethod === "card" && (
                  <button
                    className="shipping-button"
                    style={{
                      padding: "15px",
                      backgroundColor: "#00a7ff",
                      textAlign: "center",
                      color: "white",
                      marginTop: "70px",
                    }}
                    onClick={() => {
                      handleSubmit(event, "card");
                    }}
                  >
                    Pay with stripe
                  </button>
                )}

                {paymentMethod === "cash" && (
                  <button
                    className="shipping-button"
                    style={{
                      padding: "15px",
                      backgroundColor: "#00a7ff",
                      textAlign: "center",
                      color: "white",
                      marginTop: "70px",
                    }}
                    onClick={() => {
                      handleSubmit(event, "cash");
                    }}
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"

                      }
                  </button>
                )}
              </div>
            </div>
            {cart.length !== 0 && (
              <>
                <div
                  style={{ border: "1px solid #ccc", height: "fit-content" }}
                  className="order-details-div"
                >
                  <OrderDetails cart={cart} total={Total} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
