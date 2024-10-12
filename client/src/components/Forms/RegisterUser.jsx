import { useEffect, useState, useRef } from "react";

import "./RegisterUser.css";

import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function RegisterUser() {
  const [submit, updateSubmit] = useState(false);
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const navigate = useNavigate();
  const [emailExists, setEmailExists] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const [user, updateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [focused, setFocused] = useState({
    firstName: true,
    lastName: false,
  
    email: false,
    password: false,
    confirmPassword: false,
})

  const [platform, setPlatform] = useState("");

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [submitOnce, setSubmitOnce] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  function handleChange(event) {
    const { value, name, checked, type } = event.target;
    setSubmitOnce(false);
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
    updateUser((prevValue) => {
      if (type === "checkbox") {
        return { ...prevValue, isActive: checked };
      }
      return { ...prevValue, [name]: value };
    });
  }

  const eyeSvgClosed = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="20"
      height="20"
    >
      <path
        d="M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
        fill="white"
      ></path>
    </svg>
  );

  const eyeSvgOpen = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <g
        fill="white"
        fillRule="evenodd"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
          fill="#ffffff"
        ></path>
      </g>
    </svg>
  );

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }
  async function emailExistsCheck() {
    let email = user.email.toLowerCase();

    let response = await axios.post(`${backendUrl}/checkEmail`, {
      email,
    });
    if (response.data.data === "Google") {
      setPlatform("google");
      return true;
    }
    return response.data;
  }

    
  const handleSubmit = async (event) => {
    console.log("I got clicked");

    setSubmitOnce(true);

    event.preventDefault();

    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.password === "" ||
      user.password.length < 8 ||
      invalidEmail
    ) {
      return;
    }
    if (await emailExistsCheck()) {
      console.log("Email already exists");
      setEmailExists(true);
      return;
    }
    if (confirmPassword != user.password) {
      console.log("Passwords do not match");
      return;
    } else {
      updateSubmit(true);
      console.log("Submitted");
    }
  };

  async function sendData() {
    let email = user.email.toLowerCase();
    let User = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: email,
      password: user.password,
    };
    await axios
      .post(`${backendUrl}/register`, {
        User,
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  useEffect(() => {
    console.log(submit);

    if (submit) {
      console.log("HELLO");
console.log(user);

      sendData();
      toast.success("User Registered Successfully", {
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
      setTimeout(() => {
        navigate("/login")
      }, 3000);
    }
  }, [submit]);

  return (
    <>
      <ToastContainer />
      <div className="body" style={{ paddingTop: "60px" }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h3
            className="login-title"
            style={{ textAlign: "start", width: "100%" }}
          >
            Glitchware
          </h3>
          <h2
            style={{
              textAlign: "center",
              width: "100%",
              fontWeight: "normal",
              color: "white",
              fontSize: "35px",
              margin: "0px",
            }}
          >
            Register User
          </h2>

          <div className="inputs reg-inputs ">
            <div
              className="input-container fName"
              
              
              style={
                focused.firstName
                  ? {
                      border: "2px solid  #00A7FF",
                      transition: "0.3s ease all",
                    }
                  : {}
              }
            >
              <label htmlFor="fName" className="input-label">
                First Name
              </label>
              <input
                id="fName"
                placeholder=" "
                className="input-field registerInput"
                type="text"
                name="firstName"
                autoComplete="off"
                onChange={handleChange}
                onFocus={()=>{setFocused((prev) => {
                  return { ...prev, firstName: true };
                })}
              }
                onBlur={()=>{setFocused((prev) => {
                  return { ...prev, firstName: false };
                })}
              }
              />

              {user.firstName === "" && submitOnce ? (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                  }}
                >
                  First Name is required
                </p>
              ) : (
                ""
              )}
            </div>
            <div
              className="input-container lName"
              style={
                focused.lastName
                  ? {
                      border: "2px solid  #00A7FF",
                      transition: "0.3s ease all",
                    }
                  : {}
              }
              
            >
              <label htmlFor="lName" className="input-label ">
                Last Name
              </label>
              <input
                id="lName"
                placeholder=" "
                className="input-field registerInput"
                type="text"
                name="lastName"
                autoComplete="off"
                onFocus={()=>{setFocused((prev) => {
                  return { ...prev, lastName: true };
                })}
              }
                onBlur={()=>{setFocused((prev) => {
                  return { ...prev, lastName: false };
                })}
              }
                onChange={handleChange}
              />

              {user.lastName === "" && submitOnce ? (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                  }}
                >
                  Last Name is required
                </p>
              ) : (
                ""
              )}
            </div>
            <div
              className={`input-container email ${
                emailExists && user.email !== "" && "exists"
              }`}
              style={
                focused.email
                  ? {
                      border: "2px solid  #00A7FF",
                      transition: "0.2s ease all",
                    }
                  : {}
              }
              
            >
              <label htmlFor="email" className="input-label ">
                Email
              </label>
              <input
                id="email"
                placeholder=" "
                className={`input-field registerInput`}
                type="text"
                name="email"
                autoComplete="off"
                onFocus={()=>{setFocused((prev) => {
                  return { ...prev, email: true };
                })}
              }
                onBlur={()=>{setFocused((prev) => {
                  return { ...prev, email: false };
                })}
              }
                onChange={handleChange}
              />

              {user.email === "" && submitOnce && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  Email is required
                </p>
              )}
              {!isValidEmail(user.email) &&
                user.email != "" &&
                platform !== "google" &&
                submitOnce && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "10px",
                      position: "absolute",
                      left: "0px",
                      top: "44px",
                      fontWeight: "normal",
                    }}
                  >
                    Enter a valid Email
                  </p>
                )}
              {emailExists && user.email != "" && submitOnce && platform!=="google" &&(
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  Email already exists
                </p>
              )}
              {platform === "google" && user.email != "" && submitOnce && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  This email is already associated with a Google account
                </p>
              )}
            </div>
            <div
              className="input-container password"
              
              style={
                focused.password
                  ? {
                      border: "2px solid  #00A7FF",
                      transition: "0.3s ease all",
                    }
                  : {}
              }
            >
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                placeholder=" "
                className={`input-field registerInput`}
                type={passwordVisible ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                onFocus={()=>{setFocused((prev) => {
                  return { ...prev, password: true };
                })}
              }
                onBlur={()=>{setFocused((prev) => {
                  return { ...prev, password: false };
                })}
              }
                onChange={handleChange}
              />

              {user.password === "" && submitOnce && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  Password is required
                </p>
              )}
              {user.password !== "" &&
              user.password.length < 8 &&
              submitOnce ? (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  Password should have 8 characters{" "}
                </p>
              ) : (
                ""
              )}

              <div
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
              >
                {passwordVisible ? eyeSvgOpen : eyeSvgClosed}
              </div>
            </div>
            <div
              className="input-container confirmPassword"
              
              style={
                focused.confirmPassword
                  ? {
                      border: "2px solid  #00A7FF",
                      transition: "0.3s ease all",
                    }
                  : {}
              }
            >
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                placeholder=" "
                className={`input-field registerInput`}
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                onChange={handleChange}
                onFocus={()=>{setFocused((prev) => {
                  return { ...prev, confirmPassword: true };
                })}
              }
                onBlur={()=>{setFocused((prev) => {
                  return { ...prev, confirmPassword: false };
                })}
              }
              />

              <div
                onClick={toggleConfirmPasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  cursor: "pointer",
                }}
              >
                {confirmPasswordVisible ? eyeSvgOpen : eyeSvgClosed}
              </div>
              {}
              {user.password != confirmPassword &&
                confirmPassword.length != 0 &&
                submitOnce && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "10px",
                      position: "absolute",
                      left: "0px",
                      top: "44px",
                      fontWeight: "normal",
                    }}
                  >
                    Passwords do not match
                  </p>
                )}
              {confirmPassword === "" && submitOnce && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                    fontWeight: "normal",
                  }}
                >
                  Confirm password is required
                </p>
              )}
            </div>
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
