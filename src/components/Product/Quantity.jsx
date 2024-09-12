import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { incrementQuantity,decrementQuantity, setProduct } from "../../store/product";
import { toggleLoader } from "../../store/loader";

const IncrementDecrementBtn = ({ count, maxValue, cart, product,requestBackend,style,type }) => {
  const [incrementButtonClicked, setIncrementButtonClicked] = useState(false);
  const [decrementButtonClicked, setDecrementButtonClicked] = useState(false);
  const [disabled,setDisabled] = useState(false)
  const [incrementClicks,setIncrementClicks] = useState(0);
  const [decrementClicks,setDecrementClicks] = useState(0);
  const [quantity, setQuantity] = useState(count);
  const dispatch = useDispatch();
  const ProductPageQuantity = useSelector((state) => state.product.quantity); 
  async function Increment(token) {
    if (token) {
      try {
        dispatch(toggleLoader());
        await axios.put(
          `http://localhost:3000/increment/${product}`,
          { quantity: incrementClicks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Incremented successfully");
          setTimeout(()=>{
            dispatch(toggleLoader())
          },600);
        requestBackend();
        

        setIncrementClicks(0); // Reset quantity after successful increment
      } catch (err) {
        console.error(err);
      }
    }
  }
  useEffect(() => {
    setQuantity(count);
  }, [count]);
  
  useEffect(() => {
    const token = Cookies.get("uid");
  let debounceTimeout;

    if (incrementButtonClicked) {
      if(type==="page"){
        
        dispatch(incrementQuantity())
        setIncrementButtonClicked(false); // Reset state
        
      }
      else{
        debounceTimeout = setTimeout(() => {
          Increment(token); 
          setIncrementButtonClicked(false); // Reset state
        }, 800); // Debounce delay
      }
       
     
      return () => clearTimeout(debounceTimeout);
    }
    
    // Clean up timeout on component unmount
  }, [incrementButtonClicked,incrementClicks]);

  async function decrement(token) {
    if (token) {
      
      try {
        dispatch(toggleLoader());
        await axios.put(
          `http://localhost:3000/decrement/${product}`,
          { quantity: decrementClicks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Decremented successfully");
        setTimeout(()=>{
          dispatch(toggleLoader())
        },600);
        requestBackend();
        setDecrementClicks(0); // Reset quantity after successful decrement
      } catch (err) {
        console.error(err);
      }
    }
  }
  useEffect(() => {
    let token = Cookies.get("uid");
    let debounceTimeout;
    if(decrementButtonClicked){
      if(type==="page"){
        
        dispatch(decrementQuantity())
        setIncrementButtonClicked(false); // Reset state
        
      }
      else{
        debounceTimeout = setTimeout(()=>{
          decrement(token)
          setDecrementButtonClicked(false);
        },800);
      }
      
      return () => clearTimeout(debounceTimeout);
    }
  },[decrementButtonClicked,decrementClicks]);
  const handleIncrementCounter = () => {
    if(type==="page"){
      if(quantity < maxValue -1){
        setIncrementClicks((prevState)=>prevState+1);
      setQuantity((prevState) => prevState + 1)
        setIncrementButtonClicked(true);
      }
    }
    else{
    if (quantity < maxValue) {
      setIncrementClicks((prevState)=>prevState+1);
      setQuantity((prevState) => prevState + 1)
        setIncrementButtonClicked(true);  
    }
  }
  };

  const handleDecrementCounter = () => {
    if (quantity > 1) {
      setQuantity((prevState) => prevState - 1);
      setDecrementClicks((prevState)=>prevState+1);
      setDecrementButtonClicked(true);
      
      // Handle decrement logic if needed
    }
  };

  return (
    <div className="btn-group" style={cart ? { width: "80px" } : {width:"100px",paddingBlock:"0px"}}>
      <button className="btn" onClick={handleDecrementCounter}  style={style && {height:"30px",width:"60px"}}>
        <FaMinus />
      </button>
      {type === "page" ? <p className="count">{ProductPageQuantity}</p> : <p className="count">{quantity}</p>}      
      <button className="btn" onClick={handleIncrementCounter} style={style && {height:"30px",width:"60px"}}>
        <FaPlus />
      </button>
    </div>
  );
};

export default IncrementDecrementBtn;
