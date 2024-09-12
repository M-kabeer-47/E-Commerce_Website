import { CiFaceFrown } from "react-icons/ci";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer";
import { useEffect, useState } from "react";
import './error.css'
export default function ErrorPage(){
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize); 
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  

  return (
    <>
      <div className="homePage">
        {isWideScreen ? <Navbar /> : <Navbar2 />}
        <div className="errordiv">
    <CiFaceFrown className="face" />
    <h1>Sorry we couldn't find what you are looking for!</h1>
        </div>
        <Footer />
      </div>
    </>
  );
}

