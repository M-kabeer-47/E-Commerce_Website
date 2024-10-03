import React from "react";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "../Products/Button";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function WishlistCardLayout({ wishlist, getWishlist, convertPrice }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("uid");
    const backendUrl = useSelector((state) => state.user.backendUrl);
  return (
    <div
      className="wishlist-products"
      style={{
        paddingTop: "20px",
        position: "relative",
        top: "150px",
        overflowY: "scroll",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        marginInline: "20px",
        gap: "20px",
        marginBottom: "300px",
      }}
    >
      {wishlist.map((product, index) => (
        <div key={index}>
          <div
            className="wishlist-product"
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
              borderBottom: "2px solid #00A7FF",
              paddingBottom: "10px",
              paddingRight: "20px",
              gap: "20px",
            }}
          >
            {/* Product Image and Name */}
            <div 
            onClick={()=>{
              navigate(`/product/${product._id}`)
            }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",cursor:"pointer"}}>
              <div style={{ display: "flex", height: "200px", alignItems: "center", width: "200px", justifyContent: "center" }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "90%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <p style={{ fontSize: "15px", width: "100%", textAlign: "end" }}>{product.name}</p>
            </div>

            {/* Price */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <p className="cardsTitle">Price</p>
              <p style={{ fontSize: "14px", color: "#6f94bc" }}>
                {"PKR " + convertPrice(product.price, 1)}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <p className="cardsTitle">Add to Cart</p>
              {product.quantity !== 0 ? (
              <Button
                text="Add to cart"
                onClick={async () => {
                  
                  if (token) {
                    

                    try {
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
                      let response = await axios.post(
                        `${backendUrl}/addToCart/${product._id}`,
                        { quantity: 1 },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      toast.success('Successfully added to cart!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                        transition: Bounce,
                      });
                    }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />)
              : <p style={{color:"red",fontStyle:"italic"}}>Out of stock</p>}
            </div>

            {/* Remove from Wishlist Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <p className="cardsTitle">Remove</p>
              <MdOutlineDelete
                style={{ color: "#E7314E", fontSize: "25px", cursor: "pointer" }}
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
                  toast.info('Successfully removed from wishlist!', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    transition: Bounce,
                  });
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
