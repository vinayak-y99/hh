import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerPage2_img from "../assets/registerPage2_img.png";
import loginPage_img from "../assets/loginPage_img.webp";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Change_Password = () => {
  const navigate = useNavigate();
  const [ oldPassword, setOldPassword ] = useState("");
  const [ newPassword, setNewPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ showOldPassword, setShowOldPassword ] = useState(false);
  const [ showNewPassword, setShowNewPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ newPasswordLengthError, setNewPasswordLengthError ] = useState(false);
  const [ newPasswordValid, setNewPasswordValid ] = useState(false);
  const [ formErrors, setFormErrors ] = useState({});
  const [ passwordMatchMessage, setPasswordMatchMessage ] = useState(null);
  const [ popupMessage, setPopupMessage ] = useState(null);
  const [ popupType, setPopupType ] = useState("");
  const [ popupOpen, setPopupOpen ] = useState(false);

  const togglePasswordVisibility = (state, setState) => () => setState(!state);

  const validateForm = () => {
    const errors = {};

    if (!oldPassword.trim()) errors.oldPassword = "Please enter old password";

    if (!newPassword.trim()) errors.newPassword = "Please enter new password";
    else if (newPassword.length < 8)
      errors.newPassword = "Password must be at least 8 characters";

    if (!confirmPassword.trim())
      errors.confirmPassword = "Please confirm new password";
    else if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      const mainUser = cookies.get("USERNAME");
      try {
        const changePasswordResponse = await fetch(
          `${import.meta.env.SERVER_HOST}/change_password/${mainUser}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              old_password: oldPassword,
              password: newPassword,
            }),
          },
        );

        if (changePasswordResponse.ok) {
          setPopupMessage("Password Changed Successfully!");
          setPopupType("success");
          setPopupOpen(true);
        } else {
          if (changePasswordResponse.status === 401) {
            setPopupMessage("The Old Password Is Incorrect.");
          } else {
            console.error(
              "Failed to change password:",
              changePasswordResponse.status,
            );
            setPopupMessage(
              "Failed to change password. Please try again later.",
            );
          }
          setPopupType("error");
          setPopupOpen(true);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        setPopupMessage(
          "An error occurred while changing password. Please try again later.",
        );
        setPopupType("error");
        setPopupOpen(true);
      }
    }
  };

  const handleGoBack = () => navigate("/UserProfiles");

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

    if (formErrors.oldPassword || formErrors.newPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        oldPassword: "",
        newPassword: "",
      }));
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

    if (formErrors.confirmPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "",
      }));
    }
  };

  const handleOkClick = () => {
    setPopupMessage(null);
    setPopupOpen(false);
    if (popupType === "success") {
      navigate("/UserProfiles");
    }
  };

  return (
    <div>
      {popupOpen && <div className="overlay1"></div>}
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
            style={{
              height: "400.83",
              left: "249px",
              position: "absolute",
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <div className="right-container-box">
              <h2 className="right-container__h2">Change Password</h2>
              <p className="right-container__p">
                Enter Your New Credentials To Change Your Password
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="oldPassword" className="right-container__label">
                Old Password
              </label>
              <div className="input-container">
                <div className="password-input-container">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    className="right-container__input1"
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Enter Old Password"
                    autoComplete="off"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <div
                    className="password-toggle"
                    onClick={togglePasswordVisibility(
                      showOldPassword,
                      setShowOldPassword,
                    )}
                  >
                    {showOldPassword ? "👁️" : "🔒"}
                  </div>
                </div>
                {formErrors.oldPassword && (
                  <div
                    className="error-message"
                    style={{ color: "red", fontSize: "14px" }}
                  >
                    {formErrors.oldPassword}
                  </div>
                )}
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
                {formErrors.newPassword && (
                  <div
                    className="error-message"
                    style={{ color: "red", fontSize: "14px" }}
                  >
                    {formErrors.newPassword}
                  </div>
                )}
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
                {formErrors.confirmPassword && !confirmPassword && (
                  <div
                    className="error-message"
                    style={{ color: "red", fontSize: "14px" }}
                  >
                    {formErrors.confirmPassword}
                  </div>
                )}
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
              </div>
              <div className="gap" style={{ marginBottom: "30px" }} />
              <button type="submit" className="btn">
                Confirm Password
              </button>
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
        {/* Popup message */}
        {popupMessage && (
          <div className="popup-container">
            <div className="popup-message">
              <p style={{ marginLeft: "50px", marginTop: "10px" }}>
                {popupMessage}
              </p>
              <button
                onClick={handleOkClick}
                style={{
                  padding: "10px 25px",
                  backgroundColor: "green",
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
      </div>
    </div>
  );
};

export default Change_Password;
