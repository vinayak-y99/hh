import React, { useState, useRef, memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MarketIndex from "../components/MarketIndex";
import LeftNav from "./Dashboard";
import RightNav from "../components/RightNav";
import { TopNav } from "../components/TopNav";
import "./Option_Chain.css";
import refreshImg from "../assets/refresh.png";

function Option_Chain() {
  const [ optionChainParams, setoptionChainParams ] = useState({
    symbol: "",
    underlying: "FUT",
    strike_step: "",
    depth: 10,
    sec: 30,
    expiry_date: "",
    expiry_type: "Weekly",
  });

  const [ optionChain, setoptionChain ] = useState([]);

  const [ formattedDate, setFormattedDate ] = useState("");

  const getoptionChain = async () => {
    // console.log("getoptionChain  called", optionChainParams);
    try {
      const responseExpiries = await fetch(`${import.meta.env.SERVER_HOST}/get_option_chain/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(optionChainParams),
      });

      if (!responseExpiries.ok) {
        const errorData = await responseExpiries.json();
        throw {
          message:
            errorData.message || "Something bad happened. Please try again",
        };
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      setFormattedDate(formattedDate);

      const optionchain = await responseExpiries.json();
      // console.log("optionChain", "=", optionchain["Option Chain Data"])
      const storedData = JSON.parse(localStorage.getItem("marketIndexDetails"));
      const nifty50Value = parseFloat(storedData.nifty50.c);
      const roundedValue = Math.round(nifty50Value / 50) * 50;

      const niftybankValue = parseFloat(storedData.niftybank.c);
      const finniftyValue = parseFloat(storedData.finnifty.c);

      const roundedNiftybankValue = Math.round(niftybankValue / 100) * 100;
      const roundedFinniftyValue = Math.round(finniftyValue / 50) * 50;
      let index;
      if (optionChainParams.symbol === "NIFTY") {
        index = optionchain[ "Option Chain Data" ].findIndex(
          (option) => option.strikePrice === roundedValue,
        );
      } else if (optionChainParams.symbol === "FINNIFTY") {
        index = optionchain[ "Option Chain Data" ].findIndex(
          (option) => option.strikePrice === roundedFinniftyValue,
        );
      } else {
        index = optionchain[ "Option Chain Data" ].findIndex(
          (option) => option.strikePrice === roundedNiftybankValue,
        );
      }
      const ul =
        Number(index) - optionChainParams.depth < 0
          ? 0
          : Number(index) - optionChainParams.depth;
      const ll =
        Number(index) + optionChainParams.depth >
          optionchain[ "Option Chain Data" ].length
          ? optionchain[ "Option Chain Data" ].length
          : Number(index) + optionChainParams.depth;
      setoptionChain(optionchain[ "Option Chain Data" ].slice(ul, ll + 1));
      // console.log("expiries obj", expiries)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { NIFTY, FINNIFTY, BANKNIFTY } = useSelector(
    (state) => state.expiryReducer,
  );

  useEffect(() => {
    const formateDate = (inputDateStr) => {
      const formattedDate = `${inputDateStr.substr(0, 2)}-${inputDateStr.substr(2, 3).charAt(0).toUpperCase() + inputDateStr.substr(2, 3).slice(1).toLowerCase()}-${inputDateStr.substr(5, 4)}`;
      // console.log("formattedDate", formattedDate);
      return formattedDate;
    };

    const expiries =
      optionChainParams.symbol === "NIFTY"
        ? NIFTY
        : optionChainParams.symbol === "FINNIFTY"
          ? FINNIFTY
          : optionChainParams.symbol === "BANKNIFTY"
            ? BANKNIFTY
            : null;
    if (
      optionChainParams.expiry_type !== "" &&
      optionChainParams.symbol !== "" &&
      expiries.length !== 0
    ) {
      const month = expiries[ 0 ].substr(2, 3);
      const monthExpiries = expiries.filter((expiry) => expiry.includes(month));
      if (optionChainParams.expiry_type === "Weekly") {
        setoptionChainParams((prev) => ({
          ...prev,
          expiry_date: formateDate(monthExpiries[ 0 ]),
        }));
      } else {
        setoptionChainParams((prev) => ({
          ...prev,
          expiry_date: formateDate(monthExpiries[ monthExpiries.length - 1 ]),
        }));
      }
    }
    // }, [NIFTY, FINNIFTY, BANKNIFTY, optionChainParams.symbol, optionChainParams.expiry_type])
  }, [
    NIFTY,
    FINNIFTY,
    BANKNIFTY,
    optionChainParams.expiry_type,
    optionChainParams.symbol,
  ]);

  const tableRef = useRef(null);

  const [ optionChainvis, setOptionChainvis ] = useState({
    OI: true,
    "CHNG IN OI": true,
    VOLUME: true,
    IV: true,
    LTP: true,
    Strike: true,
  });
  const [ optionChainvis1, setOptionChainvis1 ] = useState({
    LTP: true,
    IV: true,
    VOLUME: true,
    "CHNG IN OI": true,
    OI: true,
  });

  const optionchainCols = [
    "CALLS",
    "OI",
    "CHNG IN OI",
    "VOLUME",
    "IV",
    "LTP",
    "Strike",
  ];
  const optionchainCols1 = [ "CALLS", "OI", "CHNG IN OI", "VOLUME", "IV", "LTP" ];
  const [ optionchainSeq, setOptionchainSeq ] = useState(optionchainCols);
  const [ optionchainSeq1, setOptionchainSeq1 ] = useState(optionchainCols1);

  const optionchainTH = {
    OI: optionChainvis[ "OI" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>OI</small>
        </div>
      </th>
    ),
    "CHNG IN OI": optionChainvis[ "CHNG IN OI" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>CHNG IN OI</small>
        </div>
      </th>
    ),
    VOLUME: optionChainvis[ "VOLUME" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>VOLUME</small>
        </div>
      </th>
    ),
    IV: optionChainvis[ "IV" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>IV</small>
        </div>
      </th>
    ),
    LTP: optionChainvis[ "LTP" ] && (
      <th
        style={{ width: "100px", marginLeft: "100px" }}
        colSpan={1}
        rowSpan={1}
      >
        <div>
          <small>LTP</small>
        </div>
      </th>
    ),
  };
  const optionchainTH1 = {
    LTP: optionChainvis1[ "LTP" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>LTP</small>
        </div>
      </th>
    ),
    IV: optionChainvis1[ "IV" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>IV</small>
        </div>
      </th>
    ),
    VOLUME: optionChainvis1[ "VOLUME" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>VOLUME</small>
        </div>
      </th>
    ),
    "CHNG IN OI": optionChainvis1[ "CHNG IN OI" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>CHNG IN OI</small>
        </div>
      </th>
    ),
    OI: optionChainvis1[ "OI" ] && (
      <th style={{ width: "100px" }} colSpan={1} rowSpan={1}>
        <div>
          <small>OI</small>
        </div>
      </th>
    ),
  };

  const totalRows = optionChain.length;
  const halfRows = Math.ceil(totalRows / 2);

  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />
        <div className="middle-main-container">
          <TopNav />
          <div style={{ display: "flex", border: "black" }}>
            <div>
              <div
                className="nifty2"
                style={{ marginBottom: "9px", marginLeft: "15px" }}
              >
                Stock Symbol
              </div>
              <select
                className="exchange-dropdown1"
                style={{ cursor: "pointer" }}
                onChange={(e) => {
                  setoptionChainParams((prev) => ({
                    ...prev,
                    symbol: e.target.value,
                    strike_step:
                      e.target.value === "NIFTY" ||
                        e.target.value === "FINNIFTY"
                        ? 50
                        : 100,
                  }));
                }}
              >
                {optionChainParams.symbol === "" && (
                  <option value="" color="black"></option>
                )}
                <option
                  value="NIFTY"
                  color="black"
                  selected={optionChainParams.symbol === "NIFTY"}
                >
                  NIFTY
                </option>
                <option
                  value="BANKNIFTY"
                  color="black"
                  selected={optionChainParams.symbol === "BANKNIFTY"}
                >
                  BANKNIFTY
                </option>
                <option
                  value="FINNIFTY"
                  color="black"
                  selected={optionChainParams.symbol === "FINNIFTY"}
                >
                  FINNIFTY
                </option>
              </select>
            </div>
            <div>
              <div
                className="nifty2"
                style={{ marginBottom: "9px", marginLeft: "15px" }}
              >
                Underlying
              </div>
              <select
                className="under"
                style={{ cursor: "pointer" }}
                onChange={(e) => {
                  setoptionChainParams((prev) => ({
                    ...prev,
                    underlying: e.target.value,
                  }));
                }}
              >
                <option
                  value="FUT"
                  selected={optionChainParams.underlying === "FUT"}
                >
                  FUT
                </option>
                <option
                  value="SPOT"
                  selected={optionChainParams.underlying === "SPOT"}
                >
                  SPOT
                </option>
              </select>
            </div>
            <div>
              <div className="nifty2" style={{ marginLeft: "17px" }}>
                Strike Step
              </div>
              <input
                type="number strikeStep"
                value={optionChainParams.strike_step}
                style={{
                  marginTop: "2px",
                  marginLeft: "15px",
                  height: "35px",
                  borderRadius: "5px",
                  border: "1px solid black",
                  width: "80px",
                  paddingLeft: "15px",
                }}
              />
            </div>
            <div>
              <div className="nifty2" style={{ marginLeft: "20px" }}>
                Depth
              </div>
              <input
                // className="number1 portfolioLots"
                type="number"
                step={5}
                value={optionChainParams.depth}
                onInput={(e) => {
                  const value = parseInt(e.target.value);
                  if (value <= 10) {
                    e.target.value = 10; // Clear the input value
                  }
                  if (value > 60) {
                    e.target.value = 60; // Clear the input value
                  }
                }}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value <= 10) {
                    e.target.value = 10; // Clear the input value
                  }
                  if (value > 60) {
                    e.target.value = 60; // Clear the input value
                  }
                  setoptionChainParams((prev) => ({
                    ...prev,
                    depth: Number(e.target.value),
                  }));
                }}
                style={{
                  marginTop: "3px",
                  marginLeft: "15px",
                  height: "35px",
                  borderRadius: "5px",
                  border: "1px solid black",
                  width: "80px",
                  paddingLeft: "15px",
                  cursor: "pointer",
                }}
              />
            </div>

            <div style={{ marginLeft: "5px" }}>
              <div
                className="nifty2"
                style={{ marginBottom: "10px", marginLeft: "15px" }}
              >
                Expiry
              </div>
              <select
                className="exchange-dropdown1"
                style={{ cursor: "pointer" }}
                onChange={(e) => {
                  setoptionChainParams((prev) => ({
                    ...prev,
                    expiry_type: e.target.value,
                  }));
                }}
              >
                <option selected disabled>
                  {" "}
                  Select{" "}
                </option>
                <option
                  color="black"
                  value={"Weekly"}
                  selected={optionChainParams.expiry_type === "Weekly"}
                >
                  Weekly
                </option>
                <option
                  color="black"
                  value={"Monthly"}
                  selected={optionChainParams.expiry_type === "Monthly"}
                >
                  Monthly
                </option>
              </select>
            </div>
            {formattedDate !== "" && (
              <div className="timeDiv">As on {formattedDate} IST</div>
            )}
            <div
              className="refreshBtn"
              style={{
                marginTop: "21px",
                marginLeft: formattedDate === "" ? "450px" : "10px",
              }}
            >
              <button
                onClick={() => {
                  // console.log("optionChainParams", optionChainParams)
                  if (optionChainParams.expiry_date !== "") {
                    getoptionChain();
                  }
                }}
                style={{
                  width: "140px",
                  backgroundColor: "#d8e1ff",
                  color: "black",
                  border: "none",
                  height: "38px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 10px",
                }}
              >
                <span
                  style={{
                    marginLeft: "5px",
                    verticalAlign: "middle",
                    color: "black",
                    fontFamily: "Roboto-Bold, sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Refresh
                </span>
                <img
                  src={refreshImg}
                  alt="Refresh Icon"
                  style={{
                    verticalAlign: "middle",
                    marginRight: "5px",
                    width: "30px",
                  }}
                />
              </button>
            </div>
          </div>
          <div
            className="main-table optionChainTableDiv"
            style={{ overflowY: "auto", overflowX: "hidden", height: "92%" }}
            ref={tableRef}
          >
            <table className="orderflowtable-alt">
              <thead>
                <tr
                  style={{
                    height: " 40px",
                    position: "sticky",
                  }}
                >
                  <th className="calls" colSpan={5}>
                    <div>
                      <small>CALLS</small>
                    </div>
                  </th>
                  <th className="strike" colSpan={1} rowSpan={2}>
                    <div>
                      <small>STRIKE</small>
                    </div>
                  </th>
                  <th className="puts" colSpan={5}>
                    <div>
                      <small>PUTS</small>
                    </div>
                  </th>
                </tr>
                <tr
                  style={{
                    height: " 40px",
                  }}
                >
                  {optionchainSeq.map(
                    (colName, index) =>
                      optionchainTH[ colName ] && (
                        <th key={index} colSpan={1} rowSpan={1}>
                          <div>
                            <small>{colName}</small>
                          </div>
                        </th>
                      ),
                  )}
                  {optionchainSeq1.map(
                    (colName, index) =>
                      optionchainTH1[ colName ] && (
                        <th key={index} colSpan={1} rowSpan={1}>
                          <div>
                            <small>{colName}</small>
                          </div>
                        </th>
                      ),
                  )}
                </tr>
              </thead>

              <tbody className="tabletbody" style={{ textAlign: "center" }}>
                {optionChain.map((option, index) => {
                  const optionchainTD = {
                    OI: optionChainvis[ "OI" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index < halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.openInterest_CE !== 0
                          ? option.openInterest_CE
                          : "-"}
                      </td>
                    ),
                    "CHNG IN OI": optionChainvis[ "CHNG IN OI" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index < halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.changeinOpenInterest_CE !== 0
                          ? option.changeinOpenInterest_CE
                          : "-"}
                      </td>
                    ),
                    VOLUME: optionChainvis[ "VOLUME" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index < halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.totalTradedVolume_CE !== 0
                          ? option.totalTradedVolume_CE
                          : "-"}
                      </td>
                    ),
                    IV: optionChainvis[ "IV" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index < halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.impliedVolatility_CE !== 0
                          ? option.impliedVolatility_CE
                          : "-"}
                      </td>
                    ),
                    LTP: optionChainvis[ "LTP" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index < halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.lastPrice_CE !== 0 ? option.lastPrice_CE : "="}
                      </td>
                    ),
                  };
                  const optionchainTD1 = {
                    LTP: optionChainvis1[ "LTP" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index >= halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.lastPrice_PE !== 0 ? option.lastPrice_PE : "="}
                      </td>
                    ),
                    IV: optionChainvis1[ "IV" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index >= halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.impliedVolatility_PE !== 0
                          ? option.impliedVolatility_PE
                          : "-"}
                      </td>
                    ),
                    VOLUME: optionChainvis1[ "VOLUME" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index >= halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.totalTradedVolume_PE !== 0
                          ? option.totalTradedVolume_PE
                          : "-"}
                      </td>
                    ),
                    "CHNG IN OI": optionChainvis1[ "CHNG IN OI" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index >= halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.changeinOpenInterest_PE !== 0
                          ? option.changeinOpenInterest_PE
                          : "-"}
                      </td>
                    ),
                    OI: optionChainvis1[ "OI" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          background: index >= halfRows ? "#EEE8AA" : "inherit",
                        }}
                      >
                        {option.openInterest_PE !== 0
                          ? option.openInterest_PE
                          : "-"}
                      </td>
                    ),
                  };

                  return (
                    <tr key={index}>
                      {optionchainSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {optionchainTD[ colName ]}
                          </React.Fragment>
                        );
                      })}
                      <td style={{ textAlign: "center" }}>
                        {option.strikePrice}
                      </td>
                      {optionchainSeq1.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {optionchainTD1[ colName ]}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <RightNav />
      </div>
    </div>
  );
}

export default Option_Chain;
