import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditInfoPage.css";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const EditInfoPage = () => {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitOnce, setSubmitOnce] = useState(false);
  const [success, setSuccess] = useState(false);
const token = localStorage.getItem("uid");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
      const response = await axios.get(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;

        setUser(user);
        setEmail(user.email);
        setFirstName(user.firstName);
        setLastName(user.lastName);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
      setLoading(false);
    };
    setTimeout(()=>{
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    })
    fetchUserData();
  }, []);

  async function handleSubmit() {
    setSubmitOnce(true);

    if (firstName === user.firstName && lastName === user.lastName && (currentPassword === "" || newPassword === "" || confirmPassword === "")) {
      console.log("First Name: " + firstName + " Last Name: " + lastName);

      return;
    } else if (currentPassword !== "") {
      let isCorrect = await axios.get(`${backendUrl}/verifyPassword`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          password: currentPassword,
        },
      });
      console.log(isCorrect.data);

      if (!isCorrect.data) {
        setPasswordIncorrect(true);
        return;
      }
    }

    if (newPassword !== "") {
      if (newPassword !== confirmPassword || newPassword.length < 8) {
        console.log("Inside newPassword");

        return;
      }
    }

    setSuccess(true);
  }

  useEffect(() => {
    if (success) {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      if (newPassword !== "") {
        
        payload.password = newPassword;
      }
      toast.success("Successfully updated user information", {
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
      
      setTimeout(async () => {
        
        
        await axios.put(`${backendUrl}/updateUser`, {user:payload}, {
        headers:{
            Authorization: `Bearer ${token}`
        }
        }
        )
        setSuccess(false);
        setSubmitOnce(false);
        window.location.reload();
      }, 800);
    }
  }, [success]);

  useEffect(() => {
    console.log(
      "First Name: " +
        firstName +
        " Last Name: " +
        lastName +
        " Email: " +
        email +
        " Current Password: " +
        currentPassword +
        " New Password: " +
        newPassword +
        " Confirm Password: " +
        confirmPassword
    );
  }, [
    user,
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  ]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="edit-info-page">
      <h1>Edit Your Information</h1>
      <form className="edit-info-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => {
              setSubmitOnce(false);
              setFirstName(e.target.value);
              setPasswordIncorrect(false);
            }}
          />
          {submitOnce && firstName === "" && (
            <p className="error-message">* First Name is required</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setSubmitOnce(false);
              setLastName(e.target.value);
              setPasswordIncorrect(false);
            }}
          />
          {submitOnce && lastName === "" && (
            <p className="error-message">* Last Name is required</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} readOnly />
        </div>
        <div className="form-group password-container">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="password-field">
            <input
              type={currentPasswordVisible ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => {
                setSubmitOnce(false);
                setCurrentPassword(e.target.value);
                setPasswordIncorrect(false);
              }}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
            >
              <FontAwesomeIcon
                icon={currentPasswordVisible ? faEyeSlash : faEye}
              />
            </button>
          </div>
          {submitOnce && newPassword !== "" && currentPassword === "" && (
            <p className="error-message" style={{bottom:"-35px"}}>
              * Current password is required to set a new password
            </p>
          )}
          {submitOnce && passwordIncorrect && (
            <p className="error-message">* Current password is incorrect</p>
          )}
        </div>
        <div className="form-group password-container">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-field">
            <input
              type={newPasswordVisible ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setSubmitOnce(false);
                setNewPassword(e.target.value);
                setPasswordIncorrect(false);
              }}
            />
            {submitOnce && newPassword.length < 8 && newPassword !== "" && (
              <p
                className="error-message"
                style={{ bottom: "-35px", left: "5px" }}
              >
                * Password must be at least 8 characters long
              </p>
            )}
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setNewPasswordVisible(!newPasswordVisible)}
            >
              <FontAwesomeIcon icon={newPasswordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
        <div className="form-group password-container">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-field">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setSubmitOnce(false);
                setConfirmPassword(e.target.value);
                setPasswordIncorrect(false);
              }}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <FontAwesomeIcon
                icon={confirmPasswordVisible ? faEyeSlash : faEye}
              />
            </button>
          </div>
          {submitOnce &&
            newPassword !== confirmPassword &&
            confirmPassword !== "" && (
              <p className="error-message">* Passwords do not match</p>
            )}
          {submitOnce &&
            newPassword !== "" &&
            confirmPassword === "" &&
            currentPassword !== "" && (
              <p
                className="error-message"
                style={{ bottom: "-35px", left: "5px" }}
              >
                * New password is required to set a new password
              </p>
            )}
        </div>
        <button type="button" className="submit-button" onClick={handleSubmit}>
          Update Information
        </button>
      </form>
    </div>
  );
};

export default EditInfoPage;
