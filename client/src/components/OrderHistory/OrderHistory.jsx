import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistoryPage.css";
import Cookies from "js-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer";



const OrderCard = ({ order, index }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);

    };
  }, []);
  if (!order) return null;

  return (
    <>
      <div className={"orderCard"}>
        <div className={"orderHeader"}>
          <div className={"orderInfo"}>
            <span className={"orderId"}>Order #{index}</span>
            <span className={"orderDate"}>{order.date + " " + order.time}</span>
          </div>
          <div className={"orderTotal"}>
            Total: <span>Rs {order.total}</span>
          </div>
        </div>
        <div className={"orderDetails"}>
          <div className={"paymentMethod"}>
            <span className={"label"}>Payment Method:</span> {order.payment}
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
                        {parseFloat(item.price.replace(/[^0-9.-]+/g, "")) *
                          item.quantity.toFixed(0)}
                      </span>
                    </div>
                  ) : (
                    <span className="span-subtotal">
                      {parseFloat(item.price.replace(/[^0-9.-]+/g, "")) *
                        item.quantityInCart.toFixed(0)}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  
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
      const token = Cookies.get("uid");
      const response = await axios.get(
        `https://e-commerce-website-78cl.vercel.app/orderHistory?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
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
      {!loading && <>
      <InfiniteScroll
      dataLength={orders.length}
      next={getOrders}
      hasMore={hasMore}
      // loader={<h4 style={{position:"relative",left:"50%",width:"100px"}}>Loading...</h4>}
      



      
      >
        
        
        <div className={"orderList"}>
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
