import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FaStripe, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegCopyright } from "react-icons/fa";
import './checkout.css';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import Cookies from "js-cookie";
import { setCartCount } from "../../store/Counts";
import { useDispatch,useSelector } from "react-redux";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CheckoutForm() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch= useDispatch();
  const token = localStorage.getItem("uid");
  const { usdAmount, total, subtotal ,order,cart,order_for_admin} = location.state || {};
  const [paymentSuccess, setPaymentSuccess] = useState(false);  // State for tracking payment success
  const [isLoading,setLoading] = useState(true)
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Pay button clicked");
    console.log(order);
    

    if (!stripe || !elements) {
      toast.error("Stripe.js has not yet loaded.",{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/shipping",
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error(error.message);
      
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentSuccess(true);  // Set success state
      setTimeout(() => {
        navigate("/");
      }, 3000);  // Redirect after 3 seconds
      axios.post(`${backendUrl}/emptyCart`,{
        
      },{
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
      let response = await axios.post(`${backendUrl}/admin_order`, {
        order_for_admin: order_for_admin
        },{
          headers:{
            "Authorization": `Bearer ${token}` 
          }
        }
        )
      await axios.put(`${backendUrl}/orderHistory`, 
        
        {order: response.data.id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      axios.put(`${backendUrl}/updateStocks`,{
        order:cart
      },{
        headers:{
          "Authorization": `Bearer ${token}`
        }
      })
      
      dispatch(setCartCount(0))
    }
  };
  useEffect(()=>{

    if(!usdAmount || !total || !subtotal){
      navigate("/");
    }
    setTimeout(()=>{
      setLoading(false)
    },1000)
  },[])
  

  return (
    <div className="stripeContainer" style={{ marginInline: "20px" }}>
      {paymentSuccess && (
        <>
        <div style={{height:"100vh",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0px",padding:"0px"}}>
  <div className="successBox" style={{position:"relative",top:"-50px"}}>
    <FaCheckCircle className="tickAnimation" />
    <h3>Payment Successful!</h3>
    
  </div>
  </div>
  </>
)}  {(!paymentSuccess && !isLoading) &&
        (
        <>
          <div className="paymentInfo">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <header>
                <h3
                  style={{
                    fontFamily: "Audiowide",
                    textAlign: "start",
                    color: "#00a7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBlock: "15px",
                    marginBottom: "40px",
                    fontSize: "25px",
                  }}
                >
                  Glitchware
                </h3>
              </header>
              <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ textAlign: "start", marginBottom: "20px", fontSize: "20px" }}>Payment Summary</p>
                <div className="price-info" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Sub-Total</p>
                  <p style={{ color: "#00a7ff" }}>Rs {subtotal}</p>
                </div>
                <div className="price-info" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Shipping</p>
                  <p style={{ color: "#00a7ff" }}>Rs 300</p>
                </div>
                <div className="price-info" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Subtotal</p>
                  <p style={{ color: "#00a7ff" }}>Rs {total}</p>
                </div>
              </section>
            </div>
            <footer style={{position:"relative",top:"0px"}}>
              <FaRegCopyright style={{ fontSize: "16px" }} />
              <p style={{ display: "flex", alignItems: "center", position: "relative", top: "2px",height:"20px" }}>
                Glitchware
              </p>
            </footer>
          </div>
          <form
            style={{
              backgroundColor: "white",
              height: "auto",
              maxWidth: "600px",
              display: "flex",
              paddingTop: "30px",
            }}
            onSubmit={handleSubmit}
          >
            <div
              className="stripelogo"
              style={{
                display: "flex",
                justifyContent: "start",
                width: "100%",
                paddingInline: "20px",
                position:"relative",
                top:"-20px"
              }}
            >
              <FaStripe style={{ fontSize: "50px", color: "#675dff" }} />
            </div>

            <PaymentElement />
            <button
              type="submit"
              disabled={!stripe || !elements}
              style={{
                backgroundColor: "#1f1f1f",
                maxWidth: "300px",
                width: "100%",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginTop: "20px",
              }}
            >
              Pay
            </button>
          </form>
        </>
      )}
    </div>
  );
}




export default function StripeCard() {
    const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");
const [stripePromise, setStripePromise] = useState(null);
const {usdAmount} = location.state || {};

const backendUrl = useSelector((state) => state.user.backendUrl);

const navigate = useNavigate();
const token = localStorage.getItem("uid");
useEffect(()=>{
    const fetchPublishableKey = async () => {
        try {
            const response = await axios.get(`${backendUrl}/stripePublishableKey`,{
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            console.log(response.data.publishableKey);
            
            setStripePromise(loadStripe(response.data.publishableKey));
        } catch (error) {
            console.error("Error fetching publishable key:", error);
            toast.error("Please try again later",{
              position: "bottom-right",
              autoClose: 6000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
        });
            setTimeout(()=>{
              navigate("/");
            },6000)
           
        }
        }
        fetchPublishableKey();
},[])
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        
        
        const response = await axios.post(`${backendUrl}/create-payment-intent`, {
          amount: usdAmount * 100,
        },{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setClientSecret(response.data.clientSecret);
        console.log(response.data.clientSecret);
        
      } catch (error) {
        console.error("Error fetching client secret:", error);
        toast.error("Please try again later",

          {
            position: "bottom-right",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
        setTimeout(()=>{
          navigate("/");
        },6000)
      }
    };

    fetchClientSecret();
  }, []);
  

  return (
    <>
    <div className="striePage" style={{minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>

    
      {(clientSecret && stripePromise) && (
         <Elements stripe={stripePromise} options={{
          clientSecret: clientSecret,
          appearance: {
              theme: 'stripe', 
              variables: {
                  colorPrimary: '#00a7ff',
                  colorText: 'black',
                  spacingUnit: '8px',  // Controls the spacing within the PaymentElement
              },
              rules: {
                  '.Input': {
                      padding: '10px',  // Controls padding inside input elements
                      
                  },
              }
          }
      }}>
          <CheckoutForm />
      </Elements>
      )}
      </div>
    </>
  );
}
