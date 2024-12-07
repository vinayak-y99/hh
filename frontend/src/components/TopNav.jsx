import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import Draggable from "react-draggable"; // Import Draggable

import "../styles.css";

export const TopNav = ({
  pageCols,
  colsSelectedAll,
  setColsSelectedALL,
  selectAll,
  colVis,
  setColVis,
  setSeq,
  rows,
}) => {
  const [orderflow, setorderflow] = useState(false);
  const [ordermanagement, setordermanagement] = useState(false);
  const [holdings, setholdings] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [columnHideDropDown, setcolumnHideDropDown] = useState(false);

  const dropdownRef = useRef(null);

  const [totalAccounts, setTotalAccounts] = useState(0);
  useEffect(() => {
    if (rows) {
      const count = rows.filter(
        (row) =>
          row.userId !== "" &&
          row.broker !== "" &&
          row.apiKey !== "" &&
          row.password !== "" &&
          row.qrCode !== "" &&
          row.name !== "",
      ).length;
      setTotalAccounts(rows.length);
    }
  }, [rows]);

  const [loggedAccounts, setLoggedAccounts] = useState(0);
  useEffect(() => {
    if (rows) {
      const loggedAccountsArray = rows.filter((item) => {
        return item.inputDisabled === true;
      });
      setLoggedAccounts(loggedAccountsArray.length);
    }
  }, [rows]);

  const totalAccountsStyle = { color: "red" };
  const loggedAccountsStyle = { color: "green" };

  const { positions: netPositions } = useSelector(
    (state) => state.positionReducer,
  );

  const [openPosition, setopenPosition] = useState(0);
  const [closePosition, setclosePosition] = useState(0);
  useEffect(() => {
    let openPos = 0;
    let closePos = 0;
    netPositions.forEach((positionRow) => {
      if (positionRow.side === 0) {
        closePos += 1;
      } else if (positionRow.side === 1 || positionRow.side === -1) {
        openPos += 1;
      }
    });
    setclosePosition(closePos);
    setopenPosition(openPos);
  }, [netPositions]);

  const buttonRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && columnHideDropDown) {
        setcolumnHideDropDown(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setcolumnHideDropDown(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [columnHideDropDown]);
  // Define the column groups
  const firstColumn = [
    'Select All',
    "Client Id",
    'Broker',
    'Available margin',
    'Utilized Margin',
    'Mobile',
    'API Key',
    'API Secret Key',
  ];

  const secondColumn = [
    'QR code',
    'Pin',
    'API User Details',
    'Display Name',
    '2FA',
    'Auto Login',
    'Max Profit',
    'Profit Locking',
    'Max Loss Wait',
  ];

  const thirdColumn = [
    'Max Loss Per Trade',
    'Market Orders',
    'Max Open Trades',
    'Qty Multiplier',
    'Exit Order Type',
    'Enable CNC sqOff',
    'Enable NRML sqoff',
    'Manual Exit',
    'Mtm (All)',
  ];
  const fourthColumn = [

    'Qty on Max Loss Per Trade',
    'Qty By Exposure',
    'Commodity Margin',
    "Action",
    "Data API",
    "Net",
    "Exit Time",
    "Trading Authorization Req",
  ]
  const handleSelectAll = (select) => {
    const updatedColVis = {};
    const updatedSeq = [];

    if (select) {
      [...firstColumn.slice(1), ...secondColumn, ...thirdColumn, ...fourthColumn].forEach(colName => {
        updatedColVis[colName] = false;
        updatedSeq.push(colName);
      });
    } else {
      [...firstColumn.slice(1), ...secondColumn, ...thirdColumn, ...fourthColumn].forEach(colName => {
        updatedColVis[colName] = true;
      });
      updatedSeq.length = 0;
    }

    setColVis(updatedColVis);
    setSeq(updatedSeq);
    setColsSelectedALL(select);
  };
  const handleCheckboxChange = (columnName) => {
    setColVis((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
    setSeq((prev) => {
      if (prev.includes(columnName)) {
        return prev.filter((col) => col !== columnName);
      } else {
        return [...prev, columnName];
      }
    });
  };


  return (
    <div className="second-navbar">
      <div>
        <h1>
          {pathname.includes("UserProfiles") ? (
            <>
              User Profiles(
              <span style={loggedAccountsStyle}>{loggedAccounts}</span>/
              <span style={totalAccountsStyle}>{totalAccounts}</span>)
            </>
          ) : pathname.includes("Strategies") ? (
            "Strategies"
          ) : pathname.includes("F&O") ? (
            "F & O Trading"
          ) : pathname.includes("Positions") ? (
            <>
              Positions(
              <span style={{ color: "green" }}>{openPosition}</span> /
              <span style={{ color: "red" }}>{closePosition}</span>)
            </>
          ) : pathname.includes("Holdings") ? (
            "Holdings"
          ) : pathname.includes("OrderFlow") ? (
            "Order Flow"
          ) : pathname.includes("OrderManagement") ? (
            "Order Management"
          ) : pathname.includes("Equity") ? (
            "Equity Trading"
          ) : pathname.includes("Option_Chain") ? (
            "Option Chain"
          ) : pathname.includes("Master_accounts") ? (
            "Master Child"
          ) : null}
        </h1>
      </div>
      <div className="second-potions-div">
        {/* <div
          id="hide_btn_ref"

        >
          {!pathname.includes("Option_Chain") && (
            // <button
            //   className="hideBtn topNavBtn"
            //   style={{
            //     cursor: "pointer",
            //     display: "flex",
            //     alignItems: "center",
            //     gap: "8px",
            //     backgroundColor: columnHideDropDown ? "#4661bd" : "#d8e1ff",
            //     color: columnHideDropDown ? "white" : "black",
            //   }}
            //   ref={buttonRef}
            //   onClick={() => {
            //     setcolumnHideDropDown((prev) => !prev);
            //     console.log("maheshhh");
            //   }}
            // >
            //   Hide{" "}
            //   <FaEye
            //     color={columnHideDropDown ? "white" : "black"}
            //     className="eye-icon"
            //   />
            // </button>
          )}


        </div> */}
        <div className="flex gap-4">
          <div className="grow my-auto font-semibold text-neutral-600">
            <span>27-11-2024 </span>
            <span className="text-xl font-black">10:50 PM</span>
          </div>

          <button  className="flex overflow-hidden gap-2 justify-end items-center px-2.5 py-1.5 font-medium text-right text-white rounded-md bg-blue-600 border border-blue-700 border-solid shadow-[0px_1px_4px_rgba(0,0,0,0.25)] mr-2">
            <div className="flex gap-2 items-center self-stretch my-auto mr-2">
              <div className="self-stretch my-auto ">Confirm Broker Login</div>
              <i
                className="bi bi-people object-contain shrink-0 self-stretch my-auto w-6 aspect-square text-lg"
                aria-hidden="true"
                title="Broker Login Icon"
              />

            </div>
          </button>

        </div>
        {columnHideDropDown && pathname.includes("UserProfiles") && (
          <Draggable>
            <div
              ref={dropdownRef}
              id="dropdown-menu"
              className="dropdown-menu hidedrop-down"
            >
              <div>
                {/* Column Group 1: Select All and firstColumn */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: colsSelectedAll ? '#d3f9d8' : '#f9d8d8',
                      padding: '5px', // Slightly increased padding
                      borderRadius: '4px',
                      marginBottom: '5px', // Increased margin for better spacing
                      marginRight: "4px",
                      marginLeft: "0px" // Adjusted margin to align with other elements
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={colsSelectedAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label>Select All</label>
                  </div>
                </div>
                <label style={{ display: 'block', marginTop: '5px', fontWeight: 'bold' }}>
                  User Account & Access
                </label>
                {firstColumn.slice(1).map((columnName, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: !colVis[columnName] ? '#f9d8d8' : '#d3f9d8',
                      padding: '2px', // Slightly increased padding
                      borderRadius: '4px',
                      marginBottom: '5px', // Increased margin for better spacing
                      marginRight: "4px",
                      marginLeft: "0px" // Adjusted margin to align with other elements
                    }}
                  >
                    <input
                      id={`checkbox-${columnName}`}
                      type="checkbox"
                      checked={!colVis[columnName]}
                      onClick={() => handleCheckboxChange(columnName)}
                    />

                    <label htmlFor={`checkbox-${columnName}`}>
                      <span
                        style={{
                          color: 'black',
                          fontWeight: 'normal',
                        }}
                      >
                        {columnName}
                      </span>
                    </label>
                  </div>
                ))}
              </div>


              <div>

                {secondColumn.map((columnName, index) => (
                  <React.Fragment key={index}>
                    {columnName === 'Max Profit' && (
                      <label style={{ display: 'block', marginTop: '5px', fontWeight: 'bold' }}>
                        Risk Management Options
                      </label>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: !colVis[columnName] ? '#f9d8d8' : '#d3f9d8', // Change background color based on visibility
                        padding: '2px',
                        borderRadius: '4px',
                        marginBottom: '2px',
                        marginRight: "4px"
                      }}
                    >
                      <input
                        id={`checkbox-${columnName}`}
                        type="checkbox"
                        checked={!colVis[columnName]}
                        onClick={() => handleCheckboxChange(columnName)}
                      />

                      <label htmlFor={`checkbox-${columnName}`}>
                        <span
                          style={{
                            color: !colVis[columnName] ? 'black' : 'black',
                            fontWeight: !colVis[columnName] ? 'normal' : 'normal',
                          }}
                        >
                          {columnName}
                        </span>
                      </label>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'center', }}>Trading Options</label>
                {thirdColumn.map((columnName, index) => (

                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: !colVis[columnName] ? '#f9d8d8' : '#d3f9d8', // Change background color based on visibility
                      padding: '2px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      marginRight: "4px"
                    }}
                  >
                    <input
                      id={`checkbox-${columnName}`}
                      type="checkbox"
                      checked={!colVis[columnName]}
                      onClick={() => handleCheckboxChange(columnName)}
                    />

                    <label htmlFor={`checkbox-${columnName}`}>
                      <span
                        style={{
                          color: !colVis[columnName] ? 'black' : 'black',
                          fontWeight: !colVis[columnName] ? 'normal' : 'normal',
                        }}
                      >
                        {columnName}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div>
                {fourthColumn.map((columnName, index) => (
                  <React.Fragment key={index}>
                    {
                      columnName === "Action" && (
                        <label style={{ display: 'block', marginTop: '5px', fontWeight: 'bold', textAlign: 'center', }}>
                          General                        </label>

                      )}
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: !colVis[columnName] ? '#f9d8d8' : '#d3f9d8', // Change background color based on visibility
                        padding: '2px',
                        borderRadius: '4px',
                        marginBottom: '2px',
                        marginRight: "-20px"
                      }}
                    >
                      <input
                        id={`checkbox-${columnName}`}
                        type="checkbox"
                        checked={!colVis[columnName]}
                        onClick={() => handleCheckboxChange(columnName)}
                      />

                      <label htmlFor={`checkbox-${columnName}`}>
                        <span
                          style={{
                            color: !colVis[columnName] ? 'black' : 'black',
                            fontWeight: !colVis[columnName] ? 'normal' : 'normal',
                          }}
                        >
                          {columnName}
                        </span>
                      </label>
                    </div>
                  </React.Fragment>


                ))}
              </div>
            </div>
          </Draggable>
        )}
        {columnHideDropDown && !pathname.includes("UserProfiles") && (
          <Draggable>
            <div ref={dropdownRef} id="dropdown-menu" className="dropdown-menu hidedrop-downs">
              <div style={{ backgroundColor: colsSelectedAll ? '#d3f9d8' : '#f9d8d8', }}>
                <label>
                  <input
                    checked={colsSelectedAll}
                    type="checkbox"
                    onClick={selectAll}

                  />
                  Select All
                </label>
              </div>

              {Array.from(new Set(pageCols?.map((data) => data)))
                .sort()
                .map((columnName, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: !colVis[columnName] ? '#f9d8d8' : '#d3f9d8', // Change background color based on visibility
                      padding: '2px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      marginRight: '4px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!colVis[columnName]}
                      onClick={() => {
                        setColVis((prev) => ({
                          ...prev,
                          [columnName]: !prev[columnName],
                        }));
                        setSeq((prev) => {
                          if (prev.includes(columnName)) {
                            return prev.filter((col) => col !== columnName);
                          } else {
                            return [...prev, columnName];
                          }
                        });

                      }}
                    />
                    <label>
                      <span
                        style={{
                          color: !colVis[columnName] ? 'black' : 'black',
                          fontWeight: !colVis[columnName] ? 'normal' : 'normal',
                        }}
                      >
                        {columnName}
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </Draggable>
        )}

        {/* <button className="helpBtn" style={{ margin: " 0 10px" }}>
          Help
        </button> */}
        {/* <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          <li className="topNavBtn">
            <button
              className={
                "topbtn" + (pathname === "/Positions" ? " selected" : "")
              }
              style={{
                padding: "11px 15px",
                border: "none",
                backgroundColor:
                  pathname === "/Positions" ? "#4661bd" : "transparent",
                transition: "background-color 0.3s",
              }}
              onClick={() => {
                navigate("/Positions");
              }}
            >
              Positions
            </button>
            <span className="tooltip">Positions</span>
          </li>
          <li className="topNavBtn">
            <button
              className={
                "topbtn" + (pathname === "/Holdings" ? " selected" : "")
              }
              style={{
                padding: "11px 15px",
                border: "none",
                backgroundColor:
                  pathname === "/Holdings" ? "#4661bd" : "transparent",
                transition: "background-color 0.3s",
              }}
              onClick={() => {
                navigate("/Holdings");
              }}
            >
              Holdings
            </button>
            <span className="tooltip">Holdings</span>
          </li>
          <li className="topNavBtn">
            <button
              className={
                "topbtn" + (pathname === "/OrderFlow" ? " selected" : "")
              }
              style={{
                padding: "11px 10px",
                border: "none",
                backgroundColor:
                  pathname === "/OrderFlow" ? "#4661bd" : "transparent",
                transition: "background-color 0.3s",
              }}
              onClick={() => {
                navigate("/OrderFlow");
              }}
            >
              Order Flow
            </button>
            <span className="tooltip">Order Flow</span>
          </li>
          <li className="topNavBtn">
            <button
              className={
                "topbtn" + (pathname === "/OrderManagement" ? " selected" : "")
              }
              style={{
                padding: "11px 10px",
                border: "none",
                backgroundColor:
                  pathname === "/OrderManagement" ? "#4661bd" : "transparent",
                transition: "background-color 0.3s",
              }}
              onClick={() => {
                navigate("/OrderManagement");
              }}
            >
              Order Management
            </button>
            <span className="tooltip">Order Management</span>
          </li>
        </ul> */}
      </div>
    </div>
  );
};
