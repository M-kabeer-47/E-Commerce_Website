import { useEffect, useState, useRef } from "react";

import "./RegisterUser.css";

import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "mongoose";

export default function RegisterUser() {
  const [submiting, setSubmitting] = useState(false);
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const navigate = useNavigate();
  
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [focused, setFocused] = useState({
    firstName: true,
    lastName: false,

    email: false,
    password: false,
    confirmPassword: false,
  });

  const [platform, setPlatform] = useState("");

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  

  const userSchema = z
    .object({
      firstName: z.string().min(1, { message: "First Name is required" }),
      lastName: z.string().min(1, { message: "Last Name is required" }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email" }),
      password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be 8 characters long" }),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirm Password is required" })
        .min(8, { message: "Password must be 8 characters long" }),
      // confirm password must match password
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

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

  async function emailExistsCheck(EMAIL) {
    let Email = EMAIL.toLowerCase();
    let response = await axios.post(`${backendUrl}/checkEmail`, {
      email:Email,
    });
    
    if (response.data.data === "Google") {
      setPlatform("google");
      return true;
    }
    return response.data;
  }

  const onSubmit = async (data) => {
    if (await emailExistsCheck(data.email)) {
      setError("email", { type: "manual", message: "Email already exists" });
      return;
    }
    setSubmitting(true);
    await sendData(data);
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
    setSubmitting(false);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  async function sendData(user) {
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
        setSubmitting(false);
        console.log(err);
        return false;
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(userSchema),
  });
  return (
    <>
      <ToastContainer />
      <div className="body" style={{ paddingTop: "60px" }}>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
            onFocus={() => {
              setFocused((prev) => {
                return { ...prev, firstName: true };
              });
            }}
            onBlur={() => {
              setFocused((prev) => {
                return { ...prev, firstName: false };
              });
            }}
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
                {...register("firstName")}
                
              />

              {errors.firstName && (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                  }}
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div
              className="input-container lName"
              onFocus={() => {
                setFocused((prev) => {
                  return { ...prev, lastName: true };
                });
              }}
              onBlur={() => {
                
                setFocused((prev) => {
                  return { ...prev, lastName: false };
                });
              }}
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
                
                {...register("lastName")}
              />

              {errors.lastName ? (
                <p
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                    left: "0px",
                    top: "44px",
                  }}
                >
                  {errors.lastName.message}{" "}
                </p>
              ) : (
                ""
              )}
            </div>
            <div
             onFocus={() => {
              setFocused((prev) => {
                return { ...prev, email: true };
              });
            }}
            onBlur={() => {
              setFocused((prev) => {
                return { ...prev, email: false };
              });
            }}
              className={`input-container email `}
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
               
                {...register("email")}
              />

              {errors.email && platform != "google" && (
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
                  {errors.email.message}
                </p>
              )}

              {platform === "google" && !errors.email && (
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
            onFocus={() => {
              setFocused((prev) => {
                return { ...prev, password: true };
              });
            }}
            onBlur={() => {
              setFocused((prev) => {
                return { ...prev, password: false };
              });
            }}
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
                
                {...register("password")}
              />

              {errors.password && (
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
                  {errors.password.message}{" "}
                </p>
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
              onFocus={() => {
                setFocused((prev) => {
                  return { ...prev, confirmPassword: true };
                });
              }}
              onBlur={() => {
                setFocused((prev) => {
                  return { ...prev, confirmPassword: false };
                });
              }}
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
                {...register("confirmPassword")}
              
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
              {errors.confirmPassword && (
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
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <button type="submit" className="login-button">
            {submiting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}
