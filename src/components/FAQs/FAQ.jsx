import React, { useState,useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import Footer from "../HomePage/Footer/Footer.jsx";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import './faqs.css';
import { MdExpandMore } from 'react-icons/md';
export default function FAQ() {
  useEffect(() => {
      
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, []); 
    const faqs = [
        {
          question: "What are the payment methods available?",
          answer: "We accept all major credit cards and bank transfers. Financing options are also available at checkout for larger purchases. Please note that we do not accept PayPal."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship internationally to most countries. Shipping fees and delivery times vary depending on your location."
        },
        {
          question: "How long does it take to build and ship a custom PC?",
          answer: "Typically, it takes 3-5 business days to build your custom PC. Once completed, shipping usually takes 3-7 business days, depending on your location."
        },
        {
          question: "Can I upgrade my gaming PC in the future?",
          answer: "Absolutely! Our PCs are built with standard components, allowing easy upgrades to your GPU, RAM, storage, and more as needed."
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy on all purchases. Items must be in their original condition. Custom-built PCs may be subject to a restocking fee."
        },
        {
          question: "Do your PCs come with warranties?",
          answer: "Yes, all of our gaming PCs come with a 2-year warranty on parts and labor. Extended warranties are also available."
        },
        {
          question: "How can I track my order?",
          answer: "You can track your order through your account on our website. Once your order has shipped, you'll also receive a tracking number via email to monitor its progress."
        },
        {
          question: "Do you offer technical support?",
          answer: "Yes, we provide free lifetime technical support for all our gaming PCs. You can reach our support team via email, phone, or live chat."
        },
        {
          question: "Are your gaming PCs VR-ready?",
          answer: "Yes, many of our gaming PCs are VR-ready. We clearly label the specifications on each product page to ensure you get the right system for your needs."
        },
        {
          question: "Can I customize my order?",
          answer: "Yes, you can fully customize your gaming PC by selecting components such as CPU, GPU, storage, and cooling options from our configurator."
        }
      ];
      
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
    useEffect(()=>{
        window.scrollTo(0,0);
        window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    }
    
    ,[])
    const handleResize = () => {
        setIsWideScreen(window.innerWidth >= 1050);
        }
    
  return (
    <>
      <div className="homePage">
        {isWideScreen ? <Navbar /> : <Navbar2 />}
    <section className="faqs-section">
        <h2 className="faqs-title">Frequently Asked Questions</h2>
{faqs.map((faq, index) => (
    <Accordion key={index} style={{backgroundColor:"black",borderRadius:"6px",minHeight:"70px",display:"flex",justifyContent:"center",flexDirection:"column",boxShadow:"0 0 5px 5px"}}>
        <AccordionSummary
            expandIcon={<MdExpandMore
                style={
                    {
                        color: "#00a7ff",
                        fontSize: "2rem"
                    }
                } />
            }
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
        >
            <h3 style={{color:"white"}}>{faq.question}</h3>
        </AccordionSummary>
        <AccordionDetails>
            <p style={{color:"#94B1D2",minWidth:"100%",textAlign:"start"}}>{faq.answer}</p>
        </AccordionDetails>
    </Accordion>
))}


    </section>
      </div>
      <Footer />
    </>
  );
}
