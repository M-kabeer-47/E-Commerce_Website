import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/Navbar";
import Navbar2 from "../HomePage/Navbar2";
import { Gamepad2, Mail, MessageSquare, Phone, Star } from "lucide-react";
import "./ContactPage.css";
import Footer from "../HomePage/Footer/Footer";
import axios from "axios";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function ContactPage() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if the name is empty
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Check if the email is empty or invalid
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Check if the subject is empty
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Check if the message is empty
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    // If no errors, return true; otherwise, return false
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
      
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, []); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, submit form

      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };
      console.log(payload);

      await axios.post(
        `${backendUrl}/sendEmail`,
        payload,
        
      );
      console.log("Form submitted successfully");
      toast.info('Message has been sent successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
        setTimeout(()=>
        {
          window.location.reload();
        }
        ,3000)
    } else {
      console.log("Form contains errors");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {isWideScreen ? <Navbar /> : <Navbar2 />}
      <div className="contact-page">
        <div className="contact-container">
          <h1 className="contact-title">Contact Us</h1>
          <div className="contact-grid">
            <div className="contact-form-container">
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <Phone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-info-item">
                  <Mail className="contact-icon" />
                  <span>support.gw@gmail.com</span>
                </div>
                <div className="contact-info-item">
                  <MessageSquare className="contact-icon" />
                  <span>Contact Us: 9AM - 6PM EST</span>
                </div>
                <div className="contact-info-item">
                  <Gamepad2 className="contact-icon" />
                  <span>Game On: 24/7</span>
                </div>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`form-input ${errors.name ? "invalid" : ""}`}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`form-input ${errors.email ? "invalid" : ""}`}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`form-input ${errors.subject ? "invalid" : ""}`}
                  />
                  {errors.subject && (
                    <span className="error-message">{errors.subject}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`form-textarea ${
                      errors.message ? "invalid" : ""
                    }`}
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <button type="submit" className="submit-button">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            <div className="additional-content">
              <h2 className="section-title">Why Choose Us?</h2>
              <ul className="feature-list">
                <li className="feature-item">
                  <Star className="feature-icon" />
                  <span>Widest selection of games and gaming accessories</span>
                </li>
                <li className="feature-item">
                  <Star className="feature-icon" />
                  <span>Competitive prices and regular discounts</span>
                </li>
                <li className="feature-item">
                  <Star className="feature-icon" />
                  <span>Expert customer support from fellow gamers</span>
                </li>
                <li className="feature-item">
                  <Star className="feature-icon" />
                  <span>Fast shipping and easy returns</span>
                </li>
              </ul>
              <div className="commitment-section">
                <h3 className="subsection-title">Our Commitment</h3>
                <p>
                  At our gaming e-commerce store, we're dedicated to providing
                  the best possible experience for gamers. Whether you're a
                  casual player or a hardcore enthusiast, we've got everything
                  you need to elevate your gaming setup. Our team is always here
                  to assist you with any questions or concerns.
                </p>
              </div>
              <div className="community-section">
                <h3 className="subsection-title">Join Our Community</h3>
                <p>
                  Connect with fellow gamers, stay updated on the latest
                  releases, and participate in exclusive events. Follow us on
                  social media or join our Discord server to become part of our
                  thriving gaming community.
                </p>
                <div className="social-buttons">
                  <button variant="outline" className="social-button">
                    Discord
                  </button>
                  <button variant="outline" className="social-button">
                    Twitter
                  </button>
                  <button variant="outline" className="social-button">
                    Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
