import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { TopNav } from "../components/TopNav";
import { ErrorContainer } from "../components/ErrorConsole";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setBrokers } from "../store/slices/broker";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setHoldings } from "../store/slices/holding";
import RightNav from "../components/RightNav";

function Holdings() {

  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.collapseReducer);
  //error console
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // error console
  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);
  const { holdings: holding } = useSelector((state) => state.holdingReducer);

  const [filteredHoldings, setfilteredHoldings] = useState(holding);

  useEffect(() => {
    updateFilteredRows({
      UserIDSelected,
      ExchangeSelected,
      SymbolSelected,

      setuniqueUserID,
      setuniqueExchange,
      setuniqueSymbol,
    });
  }, [holding]);
  // console.log(holding, "holding")

  const navigate = useNavigate();

  const [holdingsColVis, setholdingsColVis] = useState(allVisState.holdingsVis);
  const holdingsCols = [
    "Action",
    "Exchange",
    "Symbol",
    "Avg Price",
    "Buy Value",
    "LTP",
    "Current Value",
    "P&L%",
    "Collateral Qty",
    "T1 Qty",
    "Cns Sell  Quantity",
    "User ID",
    "User Alias",
  ];

  const [holdingColsSelectedALL, setholdingColsSelectedALL] = useState(false);

  const holdingColSelectALL = () => {
    setholdingColsSelectedALL((prev) => !prev);
    holdingsCols.map((holdingsCol) => {
      setholdingsColVis((prev) => ({
        ...prev,
        [holdingsCol]: holdingColsSelectedALL,
      }));
    });
  };

  const [holdingsSeq, setholdingsSeq] = useState(allSeqState.holdingsSeq);

  useEffect(() => {
    setholdingsSeq(allSeqState.holdingsSeq);
    setholdingsColVis((prev) => {
      const colVis = {};
      Object.keys(holdingsColVis).map((col) => {
        if (allSeqState.holdingsSeq.includes(col)) {
          colVis[col] = true;
        } else {
          colVis[col] = false;
        }
      });
      // console.log("{...prev, ...colVis}", {...prev, ...colVis})
      return { ...colVis };
    });
  }, []);

  useEffect(() => {
    dispatch(
      setAllVis({
        ...allVisState,
        holdingsVis: holdingsColVis,
      }),
    );
    if (new Set(Object.values(holdingsColVis)).size === 1) {
      if (Object.values(holdingsColVis).includes(true)) {
        setholdingsSeq(holdingsCols);
      } else {
        setholdingsSeq([]);
      }
    }
  }, [holdingsColVis]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        holdingsSeq: holdingsSeq,
      }),
    );
  }, [holdingsSeq]);

  const [showSearchHoldings, setshowSearchHoldings] = useState({
    showSearchUserID: false,
    showSearchExchange: false,
    showSearchSymbol: false,
  });
  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchHoldings((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, false]),
        ),
      );
    }
  };
  const [selectAllUserID, setSelectAllUserID] = useState(false);
  const [uniqueUserID, setuniqueUserID] = useState([]);
  const [UserIDSelected, setUserIDSelected] = useState([]);

  const [selectAllExchange, setSelectAllExchange] = useState(false);
  const [uniqueExchange, setuniqueExchange] = useState([]);
  const [ExchangeSelected, setExchangeSelected] = useState([]);

  const [selectAllSymbol, setSelectAllSymbol] = useState(false);
  const [uniqueSymbol, setuniqueSymbol] = useState([]);
  const [SymbolSelected, setSymbolSelected] = useState([]);
  useEffect(() => {
    const data = holding;
    setuniqueUserID(data ? [...new Set(data.map((d) => d["User ID"]))] : []);
    setuniqueExchange(data ? [...new Set(data.map((d) => d.Exchange))] : []);
    setuniqueSymbol(data ? [...new Set(data.map((d) => d.Symbol))] : []);
  }, []);
  const handleCheckboxChangeUserID = (UserID) => {
    const isSelected = UserIDSelected.includes(UserID);
    if (isSelected) {
      setUserIDSelected(UserIDSelected.filter((item) => item !== UserID));
      setSelectAllUserID(false);
    } else {
      setUserIDSelected((prevSelected) => [...prevSelected, UserID]);
      setSelectAllUserID(UserIDSelected.length === uniqueUserID.length - 1);
    }
  };
  const handleSelectAllForUserID = () => {
    const allChecked = !selectAllUserID;
    setSelectAllUserID(allChecked);
    if (allChecked) {
      setUserIDSelected(uniqueUserID.map((d) => d.toLowerCase()));
    } else {
      setUserIDSelected([]);
    }
  };
  const handleCheckboxChangeExchange = (Exchange) => {
    const isSelected = ExchangeSelected.includes(Exchange);
    if (isSelected) {
      setExchangeSelected(ExchangeSelected.filter((item) => item !== Exchange));
      setSelectAllExchange(false);
    } else {
      setExchangeSelected((prevSelected) => [...prevSelected, Exchange]);
      setSelectAllExchange(
        ExchangeSelected.length === uniqueExchange.length - 1,
      );
    }
  };
  const handleSelectAllForExchange = () => {
    const allChecked = !selectAllExchange;
    setSelectAllExchange(allChecked);
    if (allChecked) {
      setExchangeSelected(uniqueExchange.map((d) => d.toLowerCase()));
    } else {
      setExchangeSelected([]);
    }
  };
  const handleCheckboxChangeSymbol = (Symbol) => {
    const isSelected = SymbolSelected.includes(Symbol);
    if (isSelected) {
      setSymbolSelected(SymbolSelected.filter((item) => item !== Symbol));
      setSelectAllSymbol(false);
    } else {
      setSymbolSelected((prevSelected) => [...prevSelected, Symbol]);
      setSelectAllSymbol(SymbolSelected.length === uniqueSymbol.length - 1);
    }
  };
  const handleSelectAllForSymbol = () => {
    const allChecked = !selectAllSymbol;
    setSelectAllSymbol(allChecked);
    if (allChecked) {
      setSymbolSelected(uniqueSymbol.map((d) => d.toLowerCase()));
    } else {
      setSymbolSelected([]);
    }
  };
  const handleOkClick = () => {
    updateFilteredRows({
      UserIDSelected,
      ExchangeSelected,
      SymbolSelected,

      setuniqueUserID,
      setuniqueExchange,
      setuniqueSymbol,
    });

    setshowSearchHoldings((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, false]),
      ),
    );
  };
  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows = ({
    UserIDSelected,
    ExchangeSelected,
    SymbolSelected,

    setuniqueUserID,
    setuniqueExchange,
    setuniqueSymbol,
  }) => {
    const rows = holding;
    let prevfilteredRows;
    if (UserIDSelected.length !== 0) {
      prevfilteredRows = rows.filter((row) =>
        UserIDSelected.includes(row["User ID"].toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    if (ExchangeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ExchangeSelected.includes(row.Exchange.toLowerCase()),
      );
    }
    if (SymbolSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        SymbolSelected.includes(row.Symbol.toLowerCase()),
      );
    }
    const arrayNames = ["UserIDSelected", "ExchangeSelected", "SymbolSelected"];
    const arrays = [UserIDSelected, ExchangeSelected, SymbolSelected];
    const emptyArraysCount = arrays.filter((arr) => arr.length !== 0).length;

    let NameOfNonEmptyArray = nameOfNonEmptyArray;
    if (emptyArraysCount === 1) {
      arrays.forEach((arr, index) => {
        if (arr.length > 0) {
          NameOfNonEmptyArray = arrayNames[index];
        }
      });
    } else if (emptyArraysCount === 0) {
      NameOfNonEmptyArray = null;
    }
    setnameOfNonEmptyArray(NameOfNonEmptyArray);

    if (NameOfNonEmptyArray !== "UserIDSelected") {
      setuniqueUserID(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow["User ID"];
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "ExchangeSelected") {
      setuniqueExchange(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.Exchange;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "SymbolSelected") {
      setuniqueSymbol(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.Symbol;
            }),
          ),
        );
      });
    }

    setfilteredHoldings(prevfilteredRows);
  };

  const holdingsTH = {
    Action: holdingsColVis["Action"] && (
      <th>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSelectBox((prev) => !prev);
            }}
          />
        </div>
        {/* {showSelectBox && (
        <div>
          <select
            type="text"
            value={enabledFilter}
            onChange={handleEnabledFilterChange}
            style={{
              padding: "0.1rem 0.3rem",
              width: "100%",
              margin: "1px",
            }}
          >
            <option value="">All</option>
            <option value="checked">checked</option>
            <option value="unchecked">unchecked</option>
          </select>
        </div>
      )} */}
      </th>
    ),
    Exchange: holdingsColVis["Exchange"] && (
      <th>
        <div>
          <small>Exchange</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
            onClick={() => {
              setshowSearchHoldings((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchExchange"
                      ? !prev.showSearchExchange
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchHoldings.showSearchExchange && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllExchange}
                    onChange={handleSelectAllForExchange}
                  />
                  Select all
                </li>
                <li>
                  {uniqueExchange
                    .filter((name) => name !== undefined && name !== "")
                    .map((Exchange, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={ExchangeSelected.includes(
                              Exchange.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeExchange(
                                Exchange.toLowerCase(),
                              )
                            }
                          />
                          <label>{Exchange}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchHoldings((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key]) => [key, false]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Symbol: holdingsColVis["Symbol"] && (
      <th>
        <div>
          <small> Symbol</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
            onClick={() => {
              setshowSearchHoldings((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchSymbol" ? !prev.showSearchSymbol : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchHoldings.showSearchSymbol && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllSymbol}
                    onChange={handleSelectAllForSymbol}
                  />
                  Select all
                </li>
                <li>
                  {uniqueSymbol
                    .filter((name) => name !== undefined && name !== "")
                    .map((Symbol, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={SymbolSelected.includes(
                              Symbol.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeSymbol(Symbol.toLowerCase())
                            }
                          />
                          <label>{Symbol}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchHoldings((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key]) => [key, false]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Avg Price": holdingsColVis["Avg Price"] && (
      <th>
        <div>
          <small>Avg Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMTM && (
        <div className="Filter-popup">
          <form id="filter-form-mtm" className="Filter-inputs-container">
            <ul>
              <li>
                <input
                  type="checkbox"
                  style={{ width: "12px" }}
                  checked={selectAllMTM}
                  onChange={handleSelectAllForMTM}
                />
                Select all
              </li>
              <li>
                {uniqueDataMTM.map((mtm, index) => (
                  <div key={index} className="filter-inputs">
                    <input
                      type="checkbox"
                      style={{
                        width: "12px",
                      }}
                      checked={mtmSelected.includes(mtm)}
                      onChange={() => handleCheckboxChangeMTM(mtm)}
                    />
                    <label>{mtm}</label>
                  </div>
                ))}
              </li>
            </ul>
          </form>
          <div className="filter-popup-footer">
            <button onClick={handleOkClick}>OK</button>
            <button onClick={() => setShowSearchMTM((prev) => !prev)}>
              Cancel
            </button>
          </div>
        </div>
      )} */}
      </th>
    ),
    "Buy Value": holdingsColVis["Buy Value"] && (
      <th>
        <div>
          <small>Buy Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchMTM((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    LTP: holdingsColVis["LTP"] && (
      <th>
        <div>
          <small>LTP</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Current Value": holdingsColVis["Current Value"] && (
      <th>
        <div>
          <small>Current Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "P&L%": holdingsColVis["P&L%"] && (
      <th>
        <div>
          <small>P&L%</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Collateral Qty": holdingsColVis["Collateral Qty"] && (
      <th>
        <div>
          <small>Collateral Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "T1 Qty": holdingsColVis["T1 Qty"] && (
      <th>
        <div>
          <small>T1 Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Cns Sell  Quantity": holdingsColVis["Cns Sell  Quantity"] && (
      <th>
        <div>
          <small>Cns Sell Quantity</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "User ID": holdingsColVis["User ID"] && (
      <th>
        <div>
          <small>User ID</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              setshowSearchHoldings((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchUserID" ? !prev.showSearchUserID : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchHoldings.showSearchUserID && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllUserID}
                    onChange={handleSelectAllForUserID}
                  />
                  Select all
                </li>
                <li>
                  {uniqueUserID
                    .filter((name) => name !== undefined && name !== "")
                    .map((UserID, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={UserIDSelected.includes(
                              UserID.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeUserID(UserID.toLowerCase())
                            }
                          />
                          <label>{UserID}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchHoldings((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key]) => [key, false]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "User Alias": holdingsColVis["User Alias"] && (
      <th>
        <div>
          <small>User Alias</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
  };

  return (
    <div onClick={handleCloseAllSearchBox}>
      <div className="dashboard-header">
        <MarketIndex />
        <RightNav />
      </div>
      <div className="main-section">


        <div className="middle-main-container">
          <div>
            <div className="add_collapse -mt-4">
              <div className="self-stretch my-auto w-[238px] flex items-center gap-1">
                <i className="bi bi-person"></i>
                <span className="text-blue-600 font-bold">Holdings</span>{" "}
                <span className="text-base font-extrabold">- (</span>
                <span className="text-base font-extrabold text-green-600">0</span>
                <span className="text-base font-extrabold">/</span>
                <span className="text-base font-extrabold text-rose-500">1</span>
                <span className="text-base font-extrabold">)</span>
              </div>

              <div class="icon-container -mr-5">
                <div class="icon-box custom-icon">
                  <i class="bi bi-power" title="Manual Square Off" style={{ cursor: 'pointer' }}></i>
                </div>

                <div class="icon-box custom-icon-2">
                  <i class="bi bi-eye" title="Hide" style={{ cursor: 'pointer', fontSize: '1.3rem' }}></i>
                </div>

                <div class="icon-box custom-icon-2">
                  <i class="bi bi-question-circle" title="Help" style={{ cursor: 'pointer', fontSize: '1.3rem' }}></i>
                </div>

                <i
                  className="bi bi-x-lg custom-icon-3"
                  onClick={() => navigate('/')}
                  style={{ cursor: 'pointer', fontWeight: 1500 }}
                ></i>

              </div>
            </div>

          </div>
          <div
            className="main-table"

          >
            <table >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                {holdingsSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {holdingsTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody>
                {filteredHoldings.map((hold, index) => {
                  const holdingsTD = {
                    Action: holdingsColVis["Action"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: holdingsColVis["Exchange"] && (
                      <td>
                        <input
                          value={hold.Exchange}
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Symbol: holdingsColVis["Symbol"] && (
                      <td>
                        <input
                          value={hold.Symbol}
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Avg Price": holdingsColVis["Avg Price"] && (
                      <td>
                        <input
                          value={hold["Avg Price"]}
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Buy Value": holdingsColVis["Buy Value"] && (
                      <td>
                        <input
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    LTP: holdingsColVis["LTP"] && (
                      <td>
                        <input
                          value={hold.LTP}
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Current Value": holdingsColVis["Current Value"] && (
                      <td>
                        <input
                          value={hold.LTP}
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "P&L%": holdingsColVis["P&L%"] && (
                      <td>
                        <input
                          value={hold["P&L%"]}
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Collateral Qty": holdingsColVis["Collateral Qty"] && (
                      <td>
                        <input
                          value={hold["Collateral Qty"]}
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "T1 Qty": holdingsColVis["T1 Qty"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Cns Sell  Quantity": holdingsColVis[
                      "Cns Sell  Quantity"
                    ] && (
                        <td>
                          <input
                            type="text"
                            style={{ disabled: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "User ID": holdingsColVis["User ID"] && (
                      <td>
                        <input
                          value={hold["User ID"]}
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User Alias": holdingsColVis["User Alias"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {holdingsSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {holdingsTD[colName]}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="error99">
            <div className="flex items-center gap-2">
              <WarningAmberIcon style={{ color: "#fc844b" }} />
              <span className="text-blue-600 font-bold">Error Messages</span>
            </div>
            <button
              style={{ zIndex: "0" }}
              onClick={() => {
                errorContainerRef.current.toggleCollapse();
              }}
              className="button"
              id="collapse"
            >
              {collapsed ? "+" : "-"}
            </button>
          </div>


          <ErrorContainer
            ref={errorContainerRef}
            msgs={msgs}
            handleClearLogs={handleClearLogs}
          />
        </div>
        {/* <RightNav /> */}
      </div>
    </div>
  );
}

export default Holdings;
