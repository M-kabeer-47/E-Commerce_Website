import React, { useEffect, useRef, useState } from 'react';
import './PoliciesPage.css';
import Navbar2 from '../HomePage/Navbar2';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer/Footer';
const PolicySection = ({ title, content }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="policy-section">
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
};

const PoliciesPage = () => {
    const [isWideScreen,setIsWideScreen] = useState(window.innerWidth > 1050);
    useEffect(()=>{
        window.addEventListener("resize",()=>{
            setIsWideScreen(window.innerWidth > 1050)
        })
        setTimeout(()=>{
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          },100)
        return ()=>{
            window.removeEventListener("resize",()=>{
                setIsWideScreen(window.innerWidth > 1050)
            })  
        }
    })
  return (
    <>
    {isWideScreen ? <Navbar /> : <Navbar2 />}
    <div className="policies-page">
      <div className="policies-container">
        <h1>Our Policies</h1>
        
        <PolicySection
          title="Privacy Policy"
          content="We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you. We only collect data that is necessary for providing our services and improving your experience on our website. Your data will be used responsibly, whether for order processing, personalization, or communications. We ensure your data is protected through encryption and other industry-standard practices. We will never sell your information to third parties, and you have the right to request the deletion or modification of your data at any time. For more details, please read our full Privacy Policy."
        />
        
        <PolicySection
          title="Terms of Service"
          content="By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. We reserve the right to modify these terms at any time, and your continued use of the site indicates your acceptance of any changes. You must be at least 18 years of age to use our services or have parental consent. Any misuse of our services, including attempts to hack, distribute viruses, or disrupt operations, will result in immediate termination of your account and possible legal action. We are not liable for any damages arising from the use or inability to use our services. Full terms are available for review."
        />
        
        <PolicySection
          title="Refund Policy"
          content="We offer a 30-day money-back guarantee on all our digital products. If you are not satisfied with your purchase, you can request a full refund within 30 days of the purchase date. To initiate a refund, please contact our customer service team with your order number and a brief explanation of your issue. We aim to process refunds within 5-7 business days. Please note that refunds may take additional time to appear in your account, depending on your payment method. Physical products must be returned in their original packaging, and customers are responsible for return shipping costs unless the item was damaged or defective upon arrival. Refunds for physical products will be issued once the return is received and inspected."
        />
        
        <PolicySection
           title ="Shipping Policy"
  content = "We aim to ship all physical products within 1-3 business days. Shipping times may vary depending on your location within Pakistan, and delays may occur during holidays or peak seasons. We offer free shipping on orders over PKR 60,000 within Pakistan. For international orders, shipping fees and delivery times will vary based on the destination country. Once your order has been shipped, you will receive a confirmation email with tracking information. Please allow up to 24 hours for tracking updates to appear. We are not responsible for customs fees or import duties for international orders. In the event of a lost or delayed shipment, please contact us immediately, and we will assist you in resolving the issue."
        />
        
        <div className="contact-section">
          <p>Have questions about our policies?</p>
          <a href="/contact" className="contact-button">
            Contact Us
          </a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PoliciesPage;
