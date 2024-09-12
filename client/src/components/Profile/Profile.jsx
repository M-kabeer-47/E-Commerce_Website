import React, { useEffect, useState } from "react";


import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer";
import EditInfoPage from "./EditInfo";





const OrderHistoryPage = () => {
  
  
  
  
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1050);
  
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1050);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <>
    <div className={"orderHistoryPage"}>
      {isWideScreen ? <Navbar /> : <Navbar2 /> }
      
      <EditInfoPage />
    </div>
    
    <Footer />
    </>
    
  );
};

export default OrderHistoryPage;
