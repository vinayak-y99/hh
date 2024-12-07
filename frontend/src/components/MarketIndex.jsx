import { useState, useEffect } from "react";
// import React, { useState, useRef, memo, useEffect } from "react";
import "../styles.css";
import profile from "../assets/profile.png";
import loguser from "../assets/loguser.png";
import pas from "../assets/password.png";
import out from "../assets/out.png";
import sub from "../assets/sub.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setAuth } from "../store/slices/auth.js";
import { setPositions } from "../store/slices/position.jsx";
import { setOrders } from "../store/slices/orderBook.jsx";
import { setHoldings } from "../store/slices/holding.js";

function MarketIndex() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainUser = cookies.get("USERNAME");

  const logout = () => {
    cookies.remove("TOKEN", {
      path: "/",
    });
    cookies.remove("USERNAME", {
      path: "/",
    });
    navigate("/");
    window.location.reload();
  };

  const [marketData, setMarketData] = useState({
    sensex: {},
    nifty50: {},
    niftybank: {},
    finnifty: {},
  });

  useEffect(() => {
    const fetchMarketIndexDetails = async () => {
      const storedData = JSON.parse(localStorage.getItem("marketIndexDetails"));
      if (storedData && storedData.nifty50.c !== "") {
        // console.log("4")
        setMarketData(storedData);
      } else {
        const defaultData = {
          c: "0",
          ch: "0",
          chp: "0",
        };
        setMarketData({
          sensex: defaultData,
          nifty50: defaultData,
          niftybank: defaultData,
          finnifty: defaultData,
        });
      }
    };

    fetchMarketIndexDetails();
    const intervalId = setInterval(fetchMarketIndexDetails, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        {/* <img src="" alt="logo-img" /> */}
      </div>
      <div className="sensex-container">
        <div style={{ width: "290px" }}>
          <span className="sensex-one">
            SENSEX <span>{marketData.sensex.c}</span>{" "}
          </span>
          <span className="sensex-two">
            {marketData.sensex.ch !== null &&
              marketData.sensex.ch !== undefined &&
              marketData.sensex.ch !== "" && (
                <span
                  style={marketData.sensex.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.sensex.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.sensex.ch} ({marketData.sensex.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "290px" }}>
          <span className="sensex-one">
            NIFTY50 <span>{marketData.nifty50.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.nifty50.ch !== null &&
              marketData.nifty50.ch !== undefined &&
              marketData.nifty50.ch !== "" && (
                <span
                  style={marketData.nifty50.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.nifty50.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.nifty50.ch} ({marketData.nifty50.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "320px" }}>
          <span className="sensex-one">
            BANKNIFTY <span>{marketData.niftybank.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.niftybank.ch !== null &&
              marketData.niftybank.ch !== undefined &&
              marketData.niftybank.ch !== "" && (
                <span
                  style={marketData.niftybank.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.niftybank.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.niftybank.ch} ({marketData.niftybank.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "310px" }}>
          <span className="sensex-one">
            FINNIFTY <span>{marketData.finnifty.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.finnifty.ch !== null &&
              marketData.finnifty.ch !== undefined &&
              marketData.finnifty.ch !== "" && (
                <span
                  style={marketData.finnifty.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.finnifty.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.finnifty.ch} ({marketData.finnifty.chp}%)
                </span>
              )}
          </span>
        </div>
      </div>
      <div className="options-div">
        <ul className="link">
          <li>
            <a>
              <img src={profile} alt="profile-pic" className="profile-pic" />
            </a>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                {" "}
                <span>{mainUser}</span>
                <img src={loguser} alt="profile-pic" className="profile-pic" />
              </li>
              <li style={{ cursor: "pointer" }}>
                <a
                  onClick={() => {
                    navigate("/Change_Password");
                  }}
                >
                  Change Password
                </a>
                <img src={pas} alt="profile-pic" className="profile-pic" />
              </li>
              <li style={{ cursor: "pointer" }}>
                <a onClick={() => {
                    navigate("/Subscription");
                  }}>Subscription</a>
                <img src={sub} alt="profile-pic" className="profile-pic" />
              </li>
              <li
                onClick={() => {
                  // const navigate = useNavigate();

                  // Call the logout function when the "Logout" button is clicked
                  logout();
                }}
                style={{ cursor: "pointer" }}
              >
                <a style={{ textAlign: "right" }}>Logout</a>
                <img src={out} alt="profile-pic" className="profile-pic" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MarketIndex;
