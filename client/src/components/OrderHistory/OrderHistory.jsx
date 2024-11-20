import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistoryPage.css";
import Cookies from "js-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";


const OrderCard = ({ order, index }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  function convertPrice(price) {
    const formattedTotal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    return formattedTotal;
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#32CD32"; // Bright Green
      case "Cancelled":
        return "#FF4500"; // Bright Red
      case "Processing":
        return "#ffc107"; // Yellowish Gold
      case "Shipped":
        return "#00a7ff"; // Light Blue
      default:
        return "#D3D3D3"; // Light Gray for unknown statuses
    }
  };

  if (!order) return null;

  return (
    <div className={"orderCard"}>
      <div className={"orderHeader"}>
        <div className={"orderInfo"}>
          <span className={"orderId"}>Order #{index}</span>
          <span className={"orderDate"}>{order.date}</span>
        </div>
        <div className={"orderTotal"}>
          Total: <span>Rs {order.total}</span>
        </div>
      </div>
      <div className={"orderDetails"}>
        <div className={"paymentMethod"}>
          <div style={{ display: "flex", gap: "5px" }}>
            <span className={"label"}>Payment Method: </span> {order.payment_method}
          </div>
          <div style={{ display: "flex", alignItems: "center",gap:"5px" }}>
            
            <div
              style={{
                height: "22px",
                padding: "5px",
                paddingInline:"7px",
                width: "95px",
                borderRadius: "10px",
                textAlign:"center",
                display:"flex",
                color:"black",
                fontStyle: "bold",
                alignItems:"center",
                justifyContent:"center",
                fontSize:"14px",
                backgroundColor: getStatusColor(order.status),
              }}
            >
              {order.status}
            </div>
          </div>
        </div>
        <div className={"itemsHeader"}>
          <span className="span-item">Item</span>
          <span className="span-price">Price</span>
          <span className="span-Quantity">Quantity</span>
          <span className="span-Subtotal">Subtotal</span>
        </div>
        <ul className={"itemList"}>
          {Array.isArray(order.items) &&
            order.items.map((item, index) => (
              <li key={index} className={"item"}>
                {screenWidth < 480 ? (
                  <div className="span-row">
                    <span className={"itemLabel"}>Item:</span>
                    <span className="span-item">{item.name}</span>
                  </div>
                ) : (
                  <span>{item.name}</span>
                )}
                {screenWidth < 480 ? (
                  <div className="span-row">
                    <span className={"itemLabel"}>Price:</span>
                    <span className="span-price">{item.price}</span>
                  </div>
                ) : (
                  <span className="span-price">{item.price}</span>
                )}
                {screenWidth < 480 ? (
                  <div className="span-row">
                    <span className={"itemLabel"}>Quantity:</span>
                    <span className="span-quantity">{item.quantityInCart}</span>
                  </div>
                ) : (
                  <span className="span-quantity">{item.quantityInCart}</span>
                )}
                {screenWidth < 480 ? (
                  <div className="span-row">
                    <span className={"itemLabel"}>Subtotal:</span>
                    <span className="span-subtotal">
                      {convertPrice(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) *
                        item.quantityInCart.toFixed(0))}
                    </span>
                  </div>
                ) : (
                  <span className="span-subtotal">
                    {convertPrice(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) *
                      item.quantityInCart.toFixed(0))}
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};


const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1050);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1050);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getOrders = async () => {
    try {
      const token = localStorage.getItem("uid");
      const response = await axios.get(
        `${backendUrl}/orderHistory?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(()=>{
        setLoading(false)
      },600)
      
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setOrders([...orders, ...response.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching order history", error);
    }
  };
  
  useEffect(() => { 
    getOrders();
    setTimeout(()=>{
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    })
  }, []);
  return (
    <>
    <div className={"orderHistoryPage"}>
      {isWideScreen ? <Navbar /> : <Navbar2 /> }
      <h1 className={"order-title"}>Your Order History</h1>
      {loading ? <CircularProgress style={{position:"absolute",left:"48%",top:"40%"}} /> : <>
      <InfiniteScroll
      dataLength={orders.length}
      next={getOrders}
      hasMore={hasMore}
      scrollThreshold={0.7}
      // loader={<h4 style={{position:"relative",left:"50%",width:"100px"}}>Loading...</h4>}
      



      
      >
        
        
        <div className={"orderList"} id="orderList">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index + 1000} />
            ))
          ) : (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"50vh"}}>
              <p style={{fontSize:"30px"}}>No orders found.</p>
            </div>
          )}
        </div>
      </InfiniteScroll>
      </>}
    </div>
    
    <Footer />
    </>
    
  );
};

export default OrderHistoryPage;
