import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerPage2_img from "../assets/registerPage2_img.png";
import password_img from "../assets/password_img.webp";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState("");
  const [ error, setError ] = useState("");
  const [ popupMessage, setPopupMessage ] = useState(null);
  const [ popupType, setPopupType ] = useState("");
  const [ popupOpen, setPopupOpen ] = useState(false);
  const [ otpSent, setOtpSent ] = useState(false);

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/forgot_password/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setPopupMessage("OTP Sent Successfully!");
        setPopupType("success");
        setPopupOpen(true);
        setOtpSent(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Username does not match.");
        setPopupMessage("The User Name Is Incorrect.");
        setPopupType("failure");
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Error validating UserName:", error);
      setError("Please Enter a User Name.");
      setPopupType("failure");
      setPopupOpen(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePopupOK = () => {
    setPopupOpen(false);
    setPopupMessage(null);
    if (otpSent) {
      navigate(`/SecurityCode/${email}`);
    }
  };
  const handleGoBack = () => navigate("/");

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
            <h2
              className="right-container__h2"
              style={{
                color: "black",
                fontSize: 32,
                fontFamily: "Roboto",
                fontWeight: "500",
                wordWrap: "break-word",
              }}
            >
              Password Recovery
            </h2>
            <p
              className="right-container__p"
              style={{
                color: "#727272",
                fontSize: 16,
                fontFamily: "Roboto",
                fontWeight: "400",
                wordWrap: "break-word",
              }}
            >
              Enter your username to change your password
            </p>
          </div>

          <div
            className="input-container"
            style={{
              color: "black",
              fontSize: 18,
              fontFamily: "Roboto",
              fontWeight: "500",
              wordWrap: "break-word",
            }}
          >
            {" "}
            {/* email */}
            <label
              htmlFor="email"
              className="right-container__label"
              style={{ marginBottom: "10px" }}
            >
              Username
            </label>
            <input
              type="email"
              className="right-container__input"
              name="email"
              value={email}
              id="email"
              onChange={handleEmailChange}
              placeholder=" Enter your username"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          <div style={{ marginBottom: "30px" }} />
          <button
            className="btn button-container"
            type="submit"
            onClick={handleButtonClick}
          >
            Reset Password
          </button>
          {popupMessage && true && (
            <div className="popup-container">
              <div className="popup-message">
                <p style={{ marginLeft: "70px", marginTop: "10px" }}>
                  {popupMessage}
                </p>
                <button
                  style={{
                    padding: "10px 25px",
                    backgroundColor:
                      popupType === "success"
                        ? "green"
                        : popupType === "failure"
                          ? "red"
                          : "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginLeft: "125px",
                    marginTop: "40px",
                  }}
                  onClick={handlePopupOK}
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
          <button className="btn2" onClick={handleGoBack}>
            Go Back
          </button>
        </div>
        <div className="image-container">
          <div>
            <img src={password_img} alt="img" className="image1" />
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
    </div>
  );
};

export default PasswordRecovery;
