import React, { useState, useRef } from "react";
import registerPage2_img from "../assets/registerPage2_img.png";
import securityCode_img from "../assets/securityCode_img.webp";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { json, useParams, useSearchParams } from "react-router-dom";

const cookies = new Cookies();
const SecurityCode = () => {
  const [ popupMessage, setPopupMessage ] = useState(null);
  const [ popupType, setPopupType ] = useState("");
  const [ popupOpen, setPopupOpen ] = useState(false);
  const [ otpvalid, setOtpvalid ] = useState(false);
  const navigate = useNavigate();
  const [ otp, setOTP ] = useState([ "", "", "", "" ]); // Initialize with empty values
  const refs = [ useRef(), useRef(), useRef(), useRef() ];

  const handleOTPChange = (index, value) => {
    // Check if the entered value is a number or if it's empty
    if (!isNaN(value) || value === "") {
      const newOTP = [ ...otp ];
      newOTP[ index ] = value;
      setOTP(newOTP);

      // Move focus to the next input field if available
      if (index < refs.length - 1 && value !== "") {
        refs[ index + 1 ].current.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    // If backspace is pressed and the input field is empty, move focus to the previous field
    if (event.key === "Backspace" && otp[ index ] === "" && index > 0) {
      refs[ index - 1 ].current.focus();
    }
  };

  const handleButtonClick = () => {
    navigate("/passwordRecovery");
  };

  const params = useParams();

  const handleContinueClick = () => {
    const enteredOTP = otp.join(""); // Joining individual OTP digits into a single string
    // console.log("params", params)
    const mainUser = cookies.get("USERNAME");
    // Make an API call to validate the OTP
    // Replace 'apiEndpoint' with your actual API endpoint
    fetch(`${import.meta.env.SERVER_HOST}/verify_otp/${params.username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: enteredOTP }),
    })
      .then((response) => {
        if (response.ok) {
          // If OTP is correct, navigate to NewPassword page
          // console.log("response otp", response);

          setOtpvalid(true);
          setPopupMessage("Valid OTP!");
          setPopupType("success");
          setPopupOpen(true);
        } else {
          // If OTP is incorrect, display an error message
          console.error("Incorrect OTP");
          // You can handle displaying error message to the user here
          setPopupMessage("Invalid OTP, Please try again.");
          setPopupType("failure");
          setPopupOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error validating OTP:", error);
        // You can handle displaying error message to the user here
      });
  };
  const handlePopupOK = () => {
    setPopupOpen(false);
    setPopupMessage(null);
    if (otpvalid) {
      navigate(`/New_Password/${params.username}`);
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
            <h2
              className="right-container__h2"
              style={{
                color: "black",
                fontSize: 32,
                fontFamily: "Roboto",
                fontWeight: "500",
                wordWrap: "break-word",
                width: 350,
              }}
            >
              Enter your security code
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
              We texted your code to your Mail
            </p>
          </div>

          {/* OTP input container with background */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            {/* OTP input boxes */}
            {otp.map((value, index) => (
              <input
                key={index}
                ref={refs[ index ]}
                type="text"
                className="otp-input"
                value={value}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                style={{
                  width: "30px",
                  height: "30px",
                  fontSize: "16px",
                  background: "#D9D9D9",
                  borderRadius: "11px",
                  border: "none",
                  textAlign: "center",
                  marginRight: "5px",
                }}
              />
            ))}
          </div>

          <div style={{ marginBottom: "30px" }} />
          <button
            className="btn button-container"
            type="submit"
            onClick={handleContinueClick}
          >
            Continue
          </button>
          {popupMessage && (
            <div className="popup-container">
              <div className="popup-message">
                <p
                  style={{
                    marginTop: "25px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  {popupMessage}
                </p>
                {otpvalid ? (
                  <button
                    onClick={handlePopupOK}
                    style={{
                      padding: "10px 25px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      marginTop: "20px",
                      marginLeft: "125px",
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePopupOK}
                    style={{
                      padding: "10px 25px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      marginTop: "20px",
                      marginLeft: "125px",
                    }}
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className="gap"
          style={{
            marginBottom: "20px",
            color: "black",
            backgroundColor: "transparent",
            border: "none",
          }}
        />
        <button
          className="btn2"
          onClick={handleButtonClick}
          style={{ marginRight: "46rem", marginTop: "15rem" }}
        >
          Go Back
        </button>
        <div className="image-container">
          <div>
            <img src={securityCode_img} alt="img" className="image1" />
            <img
              src={registerPage2_img}
              alt="img"
              className="image2"
              style={{ width: 450, height: "100vh", right: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCode;
