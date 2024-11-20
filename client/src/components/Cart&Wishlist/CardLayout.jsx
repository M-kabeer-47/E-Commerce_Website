import React from "react";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";

import IncrementDecrementBtn from "../Product/Quantity";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CardLayout({cart,getCart,convertPrice,total}) {
  const navigate = useNavigate();
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const token = localStorage.getItem('uid');


const tokenExpiry = localStorage.getItem('tokenExpiry');
    return(

    
    <div
  className="cartSidebar-products"
  style={{
    paddingTop: "20px",
    position: "relative",
    top: "150px",
    overflowY: "scroll",
    height: "800px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
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
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "2px solid #00A7FF",
          paddingBottom: "10px",
          paddingRight: "20px",
          gap:"20px"
          
        }}
      >
        {/* Image and Product Name */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",cursor:"pointer"}} onClick={()=>{
          navigate(`/product/${product._id}`)
        }}>
        <div style={{ display: "flex",  height: "200px", alignItems: "center",width:"200px",justifyContent:"center" }}>
          <img
            src={product.imageUrl}
            alt=""
            style={{ width: "90%", height: "100%", objectFit: "contain" }}
          />
         
            
            
         
        </div>    
        <p
              style={{
                fontSize: "15px",
                textAlign:"end",
                
                
                width:"100%"
              }}
            >
              {product.name}
            </p>
        
        </div>
        

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
        
          <p className="cardsTitle" >Total</p>
          <p style={{ fontSize: "14px", color: "#6f94bc" }}>
            {"PKR " + convertPrice(product.price, product.quantityInCart)}
          </p>
        
        </div>

        {/* Quantity */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
          <p className="cardsTitle" >Quantity</p>
          <div
            style={{
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
        </div>

        {/* Remove Button */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
          <p className="cardsTitle" >Remove</p>
          <MdOutlineDelete
            style={{ color: "#E7314E", fontSize: "25px", cursor: "pointer" }}
            onClick={async () => {
              if (token && new Date().getTime() < tokenExpiry) {
              await axios.put(
                `${backendUrl}/remove/${product._id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              getCart();
            }
            }}
          />
        </div>
      </div>
    </div>
  ))}
</div>
    )
}