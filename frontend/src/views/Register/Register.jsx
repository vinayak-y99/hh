import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";

import { useNavigate } from "react-router-dom";
import "./Register.css";
import registerPage_img from "../../assets/registerPage_img.webp";
import registerPage2_img from "../../assets/registerPage2_img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
// import '../../views/Login/Login.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // const [register, setRegister] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [usernameFormatError, setUsernameFormatError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");

  // helper functions
  const isValidName = (name) => {
    const usernamePattern = /^[A-Za-z\s]+$/;
    return usernamePattern.test(name);
  };

  const isValidMobile = (number) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(number);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const isValidUsername = (username) => {
    const usernamePattern = /^(?![0-9])(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/i;
    return usernamePattern.test(username);
  };
  const isValidPassword = (password) => {
    // Password must be at least 8 characters long
    // It can include any characters (letters, digits, special characters)
    const passwordPattern = /^.{8,}$/;
    return passwordPattern.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notifyError = (errMsg, field) => {
    if (field === "name") {
      setNameError(errMsg);
    } else if (field === "email") {
      setEmailError(errMsg);
    } else if (field === "mobile") {
      setMobileError(errMsg);
    } else if (field === "username") {
      setUsernameFormatError(errMsg);
    } else if (field === "password") {
      setPasswordError(errMsg);
    } else if (field.length == 0) {
      setGlobalError(errMsg);
    }
  };

  const notifySuccess = (sucMsg) => {
    toast.success(sucMsg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const handleSubmit = async () => {
    setGlobalError("");
    try {
      if (!name || !email || !mobile || !username || !password) {
        if (!name) {
          notifyError("*Field is required", "name");
        }
        if (!email) {
          notifyError("*Field is required", "email");
        }
        if (!username) {
          notifyError("*Field is required", "username");
        }
        if (!password) {
          notifyError("*Field is required", "password");
        }
        if (mobile.length !== 10) {
          notifyError("Mobile number must be exactly 10 digits.", "mobile");
        }
        return;
      }

      if (!isValidName(name)) {
        notifyError("enter a valid Name", "name");
        return;
      }

      if (!isValidEmail(email)) {
        notifyError("enter a valid email address.", "email");
        return;
      }

      if (!isValidMobile(mobile)) {
        notifyError("enter a valid 10-digit mobile number.", "mobile");
        return;
      }
      if (!isValidPassword(password)) {
        notifyError(
          "Password must be 8 characters .",
          "password"
        );
        return;
      }
      if (!isValidUsername(username)) {
        let usernameError = "Username must ";
        usernameError += !/^\D/.test(username) ? "start with an alphabet" : "";
        usernameError +=
          username.length < 8 ? " ,be at least 8 characters long" : "";
        usernameError += !/\d/.test(username)
          ? ", contain at least one digit"
          : "";
        usernameError += !/[a-z]/.test(username)
          ? ", contain at least one letter"
          : "";
        usernameError += !/^[a-z\d]+$/.test(username)
          ? "consist of lowercase letters and digits only"
          : "";
        notifyError(usernameError.trim(), "username");
        return;
      }
      const data = {
        name,
        email,
        mobile,
        username,
        password,
      };

      // post request
      const response = await fetch(`${import.meta.env.SERVER_HOST}/api/registration/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convert the data to JSON format
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw {
          message:
            errorData.message || "Something bad happened. Please try again",
          field: errorData.field || "",
          // Add any other properties you need
        };
      }

      const responseData = await response.json();

      notifySuccess("Your account created successfully.");
      setName("");
      setEmail("");
      setMobile("");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);

      notifyError(error.message || "An error occurred", error.field || "");
    }
  };
  return (
    <div className="body">
      <div className="right-container">
        <div
          className="right-container__box"
          style={{
            width: "300px",
            height: "400.83",
            left: "249px",
            position: "absolute",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <div className="right-container-box">
            <h2 className="right-container__h2">Get Started Now</h2>
          </div>

          {globalError && <span className="error-message">{globalError}</span>}

          <div className="input-container">
            {/* name */}
            <label htmlFor="name" className="right-container__label">
              Name
            </label>
            <input
              type="text"
              className="right-container__input"
              name="name"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {nameError && <span className="error-message">{nameError}</span>}

            {/* email */}
            <label htmlFor="email" className="right-container__label">
              Email address
            </label>
            <input
              type="email"
              className="right-container__input"
              name="email"
              id="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && <span className="error-message">{emailError}</span>}

            {/* username */}
            <label htmlFor="username" className="right-container__label">
              User ID
            </label>
            <input
              type="text"
              className="right-container__input"
              name="username"
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => {
                const value = e.target.value.toLocaleLowerCase();
                setUsername(value);
                setUsernameFormatError("");
                if (!isValidUsername(value)) {
                  let usernameError = "Username must ";
                  if (/^\d/.test(value)) {
                    usernameError = "Username must start with an alphabet";
                  } else if (!/\d/.test(value)) {
                    usernameError = "Username must contain at least one digit";
                  } else if (!/[a-z]/.test(value)) {
                    usernameError = "Username must contain at least one letter";
                  } else if (!/^[a-z\d]+$/.test(value)) {
                    usernameError =
                      "Username must consist of lowercase letters and digits only";
                  } else if (value.length < 8) {
                    usernameError =
                      "Username must be at least 8 characters long";
                  }
                  setUsernameFormatError(usernameError);
                }
              }}
            />
            {usernameFormatError && (
              <span className="error-message">{usernameFormatError}</span>
            )}

            {/* mobile */}
            <label htmlFor="mobile" className="right-container__label">
              Mobile Number
            </label>
            <input
              type="text"
              className="right-container__input"
              name="mobile"
              id="mobile"
              placeholder="Your mobile"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setMobileError("");
                if (!isValidMobile(e.target.value)) {
                  setMobileError(
                    "enter a valid 10-digit mobile number.",
                    "mobile",
                  );
                }
              }}
            />
            {mobileError && (
              <span className="error-message">{mobileError}</span>
            )}

            {/* password */}
            <label htmlFor="password" className="right-container__label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="right-container__input"
                name="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  if (!isValidPassword(e.target.value)) {
                    setPasswordError(
                      "Password must be 8 characters .",
                      "password",
                    );
                  }
                }}
              />
              <div
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "🔒"}
              </div>
            </div>
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
          </div>

          <div className="checkbox-container">
            <input type="checkbox" className="checkbox" id="termsCheckbox" />
            <div className="IAgreeToTheTermsPolicy">
              <span className="label" style={{ wordWrap: "break-word" }}>
                I agree to the
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: 18,
                  fontFamily: "Roboto",
                  fontWeight: "500",
                  textDecoration: "underline",
                  wordWrap: "break-word",
                }}
              >
                terms & policy
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "10px" }} />
          <button
            className="btn button-container"
            type="submit"
            onClick={handleSubmit}
          >
            Signup
          </button>

          <div className="social-sign-in">
            <div
              className="SignInWithGoogle"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                fontSize: 14,
                fontFamily: "Roboto",
                fontWeight: "500",
                wordWrap: "break-word",
                border: "1px solid #000",
                borderRadius: "5px",
                width: "190px",
                height: "25px",
              }}
            >
              <img src={google} style={{ marginRight: "4px" }} /> Sign in with
              Google
            </div>
            <div
              className="SignInWithApple"
              style={{
                color: "black",
                fontSize: 13,
                fontFamily: "Roboto",
                fontWeight: "500",
                wordWrap: "break-word",
                padding: 5,
                display: "flex",
                border: "1px solid #000",
                borderRadius: "5px",
                width: "190px",
                height: "25px",
              }}
            >
              <img src={apple} style={{ marginRight: "4px" }} /> Sign in with
              Apple
            </div>
          </div>

          <p className="right-container__bottom-text">
            <span className="have-account">Have an account? </span>

            <span className="sign-in" style={{ marginLeft: 8 }}>
              <Link to="/">Sign in </Link>
            </span>
          </p>
        </div>
        <div className="image-container">
          <div>
            <img src={registerPage_img} alt="img" className="image1" />
            <img
              src={registerPage2_img}
              alt="img"
              className="image2"
              style={{
                // width: 450,
                height: "100vh",
                right: 0,
              }}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
