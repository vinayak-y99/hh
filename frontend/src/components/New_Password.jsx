import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registerPage2_img from "../assets/registerPage2_img.png";
import loginPage_img from "../assets/loginPage_img.webp";
import { json, useParams, useSearchParams } from "react-router-dom";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const New_Password = () => {
  const navigate = useNavigate();
  const [ oldPassword, setOldPassword ] = useState("");
  const [ newPassword, setNewPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ showNewPassword, setShowNewPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ newPasswordLengthError, setNewPasswordLengthError ] = useState(false);
  const [ newPasswordValid, setNewPasswordValid ] = useState(false);
  const [ passwordMatchMessage, setPasswordMatchMessage ] = useState(null);
  const [ passwordChangedSuccessfully, setPasswordChangedSuccessfully ] =
    useState(false);
  const [ popupMessage, setPopupMessage ] = useState(null);
  const [ popupType, setPopupType ] = useState("");
  const [ popupOpen, setPopupOpen ] = useState(false);

  const togglePasswordVisibility = (state, setState) => () => setState(!state);

  useEffect(() => {
    if (newPassword === confirmPassword) {
      setPasswordChangedSuccessfully(true);
    }
  }, [ newPassword, confirmPassword ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (newPassword === confirmPassword) {
    //   setPasswordChangedSuccessfully(true);
    // } else {
    //   console.error("New password and confirm new password do not match");
    //   setNewPassword("");
    //   setConfirmPassword("");
    // }
  };

  const handleGoBack = () => navigate("/");

  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setNewPasswordLengthError(newPass.length < 8);
    setNewPasswordValid(newPass.length >= 8);
    if (confirmPassword && confirmPassword.length > 0) {
      setPasswordMatchMessage(
        newPass === confirmPassword
          ? "Passwords matched"
          : "Passwords do not match",
      );
    } else {
      setPasswordMatchMessage(null);
    }
  };

  const handleChangeConfirmPassword = (e) => {
    const newPass = e.target.value;
    setConfirmPassword(newPass);
    if (newPassword && newPassword.length > 0) {
      setPasswordMatchMessage(
        newPass === newPassword
          ? "Passwords matched"
          : "Passwords do not match",
      );
    } else {
      setPasswordMatchMessage(null);
    }
  };

  const params = useParams();

  const handleResetPassword = async () => {
    fetch(`${import.meta.env.SERVER_HOST}/change_user_password/${params.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
        confirm_password: confirmPassword,
      }),
    })
      .then(async (response) => {
        const res = await response.json();
        console.error("res pass msg", res);
        if (res.message === "Password Changed Successfully !!") {
          setPopupType("success");
        } else {
          setPopupType("failure");
        }
        setPopupMessage(res.message);
        setPopupOpen(true);
        // }
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  };

  const handleOkClick = () => {
    setPopupMessage(null);
    setPopupOpen(false);
    if (popupType === "success") {
      navigate("/");
    }
  };

  return (
    <div>
      <div className="body">
        <div className="image-container">
          <div>
            <img src={loginPage_img} alt="img" className="image1" />
            <img
              src={registerPage2_img}
              alt="img"
              className="image2"
              style={{ height: "100vh", right: 0 }}
            />
          </div>
        </div>
        <div className="right-container">
          <div
            className="right-container__box"
            style={{ marginRight: "35rem" }}
          >
            <div className="right-container-box">
              <h2 className="right-container__h2">Change Password</h2>
              <p className="right-container__p">
                Enter Your New Credentials To Change Your Password
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="newPassword" className="right-container__label">
                New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="right-container__input1"
                  name="newPassword"
                  id="newPassword"
                  autoComplete="off"
                  placeholder="Enter New password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <div
                  className="password-toggle"
                  onClick={togglePasswordVisibility(
                    showNewPassword,
                    setShowNewPassword,
                  )}
                >
                  {showNewPassword ? "👁️" : "🔒"}
                </div>
              </div>
              {newPasswordLengthError && (
                <div
                  className="error-message"
                  style={{ color: "red", fontSize: "14px" }}
                >
                  Password must be at least 8 characters
                </div>
              )}
              {newPasswordValid && (
                <div
                  className="success-message"
                  style={{ color: "green", fontSize: "14px" }}
                >
                  Password is valid
                </div>
              )}
              <label
                htmlFor="confirmPassword"
                className="right-container__label"
                style={{ marginTop: "20px" }}
              >
                Confirm New Password
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="right-container__input1"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Enter Confirm New Password"
                  value={confirmPassword}
                  onChange={handleChangeConfirmPassword}
                  autoComplete="off"
                />
                <div
                  className="password-toggle"
                  onClick={togglePasswordVisibility(
                    showConfirmPassword,
                    setShowConfirmPassword,
                  )}
                >
                  {showConfirmPassword ? "👁️" : "🔒"}
                </div>
              </div>
              {passwordMatchMessage && (
                <div
                  className={
                    passwordMatchMessage === "Passwords matched"
                      ? "success-message"
                      : "error-message"
                  }
                  style={{
                    fontSize: "14px",
                    color:
                      passwordMatchMessage === "Passwords matched"
                        ? "green"
                        : "red",
                  }}
                >
                  {passwordMatchMessage}
                </div>
              )}
              <div className="gap" style={{ marginBottom: "30px" }} />
              <button
                disabled={!passwordChangedSuccessfully}
                type="submit"
                className="btn"
                onClick={handleResetPassword}
              >
                Confirm Password
              </button>
              {popupOpen && (
                <div className="popup-container">
                  <div className="popup-message">
                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                      {popupMessage}
                    </p>
                    <button
                      onClick={handleOkClick}
                      style={{
                        padding: "10px 25px",
                        backgroundColor:
                          popupType === "success"
                            ? "green"
                            : popupType === "failure"
                              ? "red"
                              : "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        marginLeft: "125px",
                        marginTop: "40px",
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
              <div
                className="gap"
                style={{
                  marginBottom: "20px",
                  color: "black",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              />
              <button className="btn1" onClick={handleGoBack}>
                Go Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New_Password;
