import React, { useEffect, useState } from 'react';
import { IoMdAlert } from "react-icons/io";
import './login.css';
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { FaGoogle } from "react-icons/fa";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
axios.defaults.withCredentials = true;
export default function Login() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [submit,setSubmit] = useState(false);
const [isEmailFocused, setIsEmailFocused] = useState(false);
const [isPasswordFocused, setIsPasswordFocused] = useState(false);  
const [userExists, setUserExists] = useState(true);
const [incorrectPassword, setIncorrectPassword] = useState(false);
const [platform,setPlatform] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function handleChange(event) {
    const { value, name } = event.target;
    switch (name) {
      case "email":
        updateEmail(value);
        if(submit){
          setUserExists(true);
          
        }
        break;
      case "password":
        updatePassword(value);
        if(submit){
          setIncorrectPassword(false);
        }
        break;
    }
  }

  const eyeSvgClosed = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path d="M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white"></path>
    </svg>
  );

  const eyeSvgOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <g fill="white" fillRule="evenodd" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" fill="#ffffff"></path>
      </g>
    </svg>
  );
  useEffect(() => {
    console.log(platform);

  },[platform]
    )
  const handleSubmit = async (event) => {
    setSubmit(true);
    event.preventDefault();
    if(email === "" || password === ""){
      return
    }
    let Email = email.toLowerCase();
    let response = await axios.post(`${backendUrl}/login`,{ email: Email, password: password })
    if(response.data === "User Does Not Exist"){
      setUserExists(false);
      console.log("User Does Not Exist");
      
      
      return;
  }
  if(response.data.data === "Google"){
    console.log("jello");
    
    setPlatform("google");
  return;
}
   else  if(response.data === "Incorrect Password"){

      setUserExists(true);
      setIncorrectPassword(true);
      console.log("Incorrect Password");
      return
  }
    else if(response.data === "Success"){
      setUserExists(true);
      setIncorrectPassword(false);
      localStorage.setItem("uid",response.data.token);
      localStorage.setItem("tokenExpiry",response.data.maxAge);
      window.location.href = "https://e-commerce-website-cck4.vercel.app/";
      
      
        
      
  
  }

}
const navigate = useNavigate();
  return (
    <div className="body">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2 className="login-title">Glitchware</h2>
        <p className="signin">Login</p>
        
        <div className="inputs">
          <div className="input-container email" onFocus={()=>{
            setIsEmailFocused(true);
          }} onBlur={()=>{
            setIsEmailFocused(false);
          }} style={isEmailFocused ? {border:"2px solid  #00A7FF",transition:"0.3s ease all"}:{}}>
            <label htmlFor="input" className='input-label'>Email</label>
            <MdOutlineEmail style={!isEmailFocused ? {position:"absolute",top:"10px",left:"10px",fontSize:"19px",color:"white"}:{position:"absolute",top:"10px",left:"10px",fontSize:"19px",color:"#007bff"}} />
            <input
              id="email"
              placeholder=" "
              className="input-field"
              type="text"
              name="email"
              autoComplete="off"
              onChange={handleChange}
              value={email}
            />
            {(email === "" && userExists && submit && platform  !== "google") && <p style={{color: "red",fontSize: "10px", position: "absolute",left:"0px",top:"44px",fontWeight:"normal"}}>Email is required</p>}
            {(!userExists && email !=="" && submit && platform  !== "google") && <p style={{color: "red",fontSize: "10px", position: "absolute",left:"0px",top:"44px",fontWeight:"normal"}}>User doesn't exist</p>}
            {(userExists && email !=="" && submit && platform  === "google") && <p style={{color: "red",fontSize: "10px", position: "absolute",left:"0px",top:"44px",fontWeight:"normal"}}>This email is already associated with a Google account</p>}

          </div>
          <div className="input-container password" onFocus={()=>{
          setIsPasswordFocused(true);
          }} onBlur={()=>{
          setIsPasswordFocused(false)}} style={isPasswordFocused ? {border:"2px solid  #00A7FF",transition:"0.3s ease all"}:{}}>
          <label htmlFor="password" className='input-label'>
              Password
            </label>
            <RiLockPasswordLine style={!isPasswordFocused ? {position:"absolute",top:"10px",left:"10px",fontSize:"19px",color:"white"}:{position:"absolute",top:"10px",left:"10px",fontSize:"19px",color:"#007bff"}} />
            <input
              id="password"
              placeholder=" "
              className="input-field"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              onChange={handleChange}
              value={password}
            />
            {(password === "" && !incorrectPassword && submit) && <p style={{color: "red",fontSize: "10px", position: "absolute",left:"0px",top:"44px",fontWeight:"normal"}}>Password is required</p>}
            {((incorrectPassword && password !== "" && platform != "google")&& submit) && <p style={{color: "red",fontSize: "10px", position: "absolute",left:"0px",top:"44px",fontWeight:"normal"}}>Incorrect Password</p>}
            <div
              onClick={togglePasswordVisibility}
              style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}
            >
              {passwordVisible ? eyeSvgOpen : eyeSvgClosed}
            </div>
          </div>
        </div>
        <p className='sign-up-option'>Don't have an account?<span className='sign-up-link' onClick={()=>{
          
          navigate('/register');
        }}>Sign up</span></p>
        <button type="submit" className='login-button'>Login</button>
        <h4 style={{color:"white",fontWeight:"normal"}}>or</h4>
        <button  className='login-button google-button' onClick={()=>{
          event.preventDefault();
          window.location.href = "https://e-commerce-website-phi-vert.vercel.app/auth/google"; //
          



          

        }}>
          <FaGoogle style={{fontSize:"20px",marginRight:"10px"}} />
          Sign in with google</button>
      </form>
      {showPopup && (
        <div className="popup">
          <IoMdAlert
          className='alert' />
          <p>User not found</p>
        </div>
      )}
    </div>
  );
}
