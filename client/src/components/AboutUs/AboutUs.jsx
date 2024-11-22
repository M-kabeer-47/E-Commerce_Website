import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer.jsx";
import gsap from "gsap";
import {
  SiLg,
  SiSamsung,
  SiIntel,
  SiAmd,
  SiSony,
  SiRazer,
  SiLogitechg,
  SiAsus,
  SiCorsair,
  SiSteelseries,
} from "react-icons/si";
import { GrHpi } from "react-icons/gr";
import { BsNvidia, BsNintendoSwitch } from "react-icons/bs";
import { FaPlaystation, FaXbox } from "react-icons/fa6";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./aboutus.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  // State to track the screen width for logos
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsWideScreen(window.innerWidth >= 1050);
    });
    return () =>
      window.removeEventListener("resize", () => {
        setIsWideScreen(window.innerWidth >= 1050);
      });
  });
  useEffect(() => {
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, []); 


  
  const updateSlidesToShow = () => {
    if (window.innerWidth >= 1200) {
      setSlidesToShow(5); // Large screens
    } else if (window.innerWidth >= 768) {
      setSlidesToShow(3); // Medium screens
    } else {
      setSlidesToShow(1); // Small screens
    }
  };

  useEffect(() => {
    updateSlidesToShow(); 
    window.addEventListener("resize", updateSlidesToShow); 
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // Define logos
  const logos = [
    <SiSamsung style={{ fontSize: "120px", color: "#1428A0" }} />,
    <GrHpi style={{ fontSize: "60px", color: "#0096D6" }} />,
    <SiIntel style={{ fontSize: "100px", color: "#0071C5" }} />,
    <SiAmd style={{ fontSize: "100px", color: "#ED1C24" }} />,
    <BsNvidia style={{ fontSize: "60px", color: "#76B900" }} />,
    <SiSony style={{ fontSize: "120px", color: "black" }} />,
    <FaPlaystation style={{ fontSize: "60px", color: "#003087" }} />,
    <FaXbox style={{ fontSize: "60px", color: "#107C10" }} />,
    <SiRazer style={{ fontSize: "60px", color: "#00FF00" }} />,
    <SiLogitechg style={{ fontSize: "50px", color: "#00B9F1" }} />,
    <BsNintendoSwitch style={{ fontSize: "50px", color: "#E60012" }} />,
    <SiAsus style={{ fontSize: "100px", color: "#0033A0" }} />,
    <SiCorsair style={{ fontSize: "60px", color: "#FEDD00" }} />,
    <SiLg style={{ fontSize: "100px", color: "#A50034" }} />,
    <SiSteelseries style={{ fontSize: "60px", color: "#FF7300" }} />,
  ];

  // Splitting logos into chunks based on slidesToShow
  const logoChunks = [];
  for (let i = 0; i < logos.length; i += slidesToShow) {
    logoChunks.push(logos.slice(i, i + slidesToShow));
  }

  // Slide update logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === logoChunks.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [logoChunks.length]);
  useEffect(() => {
    gsap.fromTo(
      ".about-us-section::before",
      { y: "0%" },
      {
        y: "-50%",
        ease: "none",
        scrollTrigger: {
          trigger: ".about-us-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);
  return (
    <div>
      <div >
        {isWideScreen ? <Navbar /> : <Navbar2 />}
        <section className="about-us-section">
          <header className="about-us-titles" style={{paddingInline:"20px"}}>
            <h2 style={{textAlign:"center"}} className="pic-h2">Leading the Way in Gaming PC Innovation</h2>
            <p className="pic_p">
              Your Gaming PC Store - Delivering Top-Quality Performance Systems
              Worldwide.
            </p>
          </header>
        </section>
        <div className="about-us-details" style={{paddingInline:"10px"}}>
          <h2 className="company-title">Company Overview</h2>
          <p className="company-details">
            Founded in 2014, our e-commerce gaming store began as a small
            venture with a modest starting capital of PKR 500. Over the years,
            what started as a humble initiative has transformed into a
            significant player in Pakistan's IT and gaming product industry.
            Driven by a passion for gaming and technology, we are dedicated to
            bringing top-quality products to our customers at affordable prices.
          </p>

          <p className="company-details">
            Our mission from day one has been simple: to make high-quality
            gaming and IT products accessible to everyone without compromising
            on affordability or reliability. We believe that gaming enthusiasts
            and tech lovers should have access to the latest gear and equipment
            without breaking the bank. With that vision in mind, we worked
            tirelessly to expand our product range, offering everything from
            gaming laptops and accessories to high-performance PC components.
          </p>

          <p className="company-details">
            Over the past decade, we have grown from a small startup into a
            reputable brand, earning the trust of thousands of customers across
            the country. Our success stems from a relentless pursuit of customer
            satisfaction and a commitment to providing unbeatable prices, fast
            shipping, and reliable service. Today, our online store is
            recognized as one of the leading destinations for gaming and tech
            products, consistently delivering on our promise of affordability
            and excellence.
          </p>

          <p className="company-details">
            As we look to the future, we remain focused on our core values:
            innovation, customer-centricity, and quality. We are continuously
            expanding our product lineup, partnering with top global brands to
            bring you the best the gaming world has to offer. Our journey has
            only just begun, and we are excited to continue growing, innovating,
            and serving the gaming community for years to come.
          </p>

          <p className="company-details">
            {" "}
            Thank you for being a part of our journey. Whether you're a casual
            gamer or a hardcore enthusiast, we've got you covered with products
            that cater to every need. Together, let's keep pushing the
            boundaries of what's possible in gaming and technology.
          </p>
          
        
        <h2 className="company-title">Our Mission</h2>
        <p className="company-details">
          At the core of our company lies a mission that has guided us from the
          very beginning: to bring the best in gaming and IT technology to
          customers at prices that don't break the bank. We believe that every
          gamer and tech enthusiast deserves access to high-quality products,
          regardless of budget. Our commitment to affordability and excellence
          is what sets us apart in the industry.
        </p>
        <h2 className="company-title">Our Vision</h2>
        <p className="company-details">
          Looking ahead, our vision is to continue expanding our presence in the
          gaming and tech industry by staying ahead of the latest trends and
          innovations. We aim to become more than just a store – we want to be a
          hub for the gaming community, where gamers of all levels can come
          together to share their passion, learn from one another, and discover
          the latest advancements in gaming technology.
        </p>
        <h2 className="company-title">Why Choose Us</h2>
        <p className="company-details">
          In a crowded market, what sets us apart? It’s simple: we understand
          gamers because we are gamers. We know what it’s like to search for
          that perfect piece of equipment, the one that fits your needs without
          emptying your wallet. That’s why we’re committed to offering products
          that provide the best value for money without sacrificing quality.
          From the moment you visit our store to the second your order arrives
          at your doorstep, we’re here to make your shopping experience as
          seamless as possible. Our customer service team is always ready to
          assist you with any questions or concerns, ensuring you have all the
          support you need when making a purchase. Plus, we’re constantly
          updating our inventory with the latest products and exclusive deals,
          so you’ll always find something new and exciting to elevate your
          gaming setup. Another reason to choose us is our dedication to
          delivering products quickly and efficiently. We understand that when
          you order something, you want it in your hands as soon as possible –
          and we make that happen. With fast shipping options and easy returns,
          shopping with us is hassle-free.
        </p>
        
      </div>
      </div>
      <h2
        className="company-title carousel-title"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Powered by the Best
      </h2>
      <div className="carousel-container">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {logoChunks.map((logoSet, index) => (
            <div className="carousel-item" key={index}>
              {logoSet.map((logo, logoIndex) => (
                <div className="logo" key={logoIndex}>
                  {logo}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      

      <Footer />
    </div>
  );
}

// Slide update logic for logos
