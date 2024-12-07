import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { ErrorContainer } from "../components/ErrorConsole";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setPositions } from "../store/slices/position";
import RightNav from "../components/RightNav";
import { useNavigate } from "react-router-dom";
function Positions() {
  // const tableRef = useRef(null);
  console.log("mahesh")
  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  // Error Message start
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };

  const navigate = useNavigate();

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);
  // Error Message end
  const [PositionColVis, setPositionColVis] = useState(
    allVisState.positionsVis,
  );
  const positionCols = [
    "Action",
    "User ID",
    "Product",
    "Exchange",
    "Symbol",
    "Net Qty",
    "LTP",
    "P&L",
    "P&L%",
    "Buy Qty",
    "Buy Avg Price",
    "Buy Value",
    "Sell Qty",
    "Sell Avg Price",
    "Sell Value",
    "Carry FWD Qty",
    "Realized Profit",
    "Unrealized profit",
    "User Alias",
  ];
  const [positionColsSelectedALL, setpositionColsSelectedALL] = useState(false);

  const positionColSelectALL = () => {
    setpositionColsSelectedALL((prev) => !prev);
    positionCols.map((positionCol) => {
      setPositionColVis((prev) => ({
        ...prev,
        [positionCol]: positionColsSelectedALL,
      }));
    });
  };
  const [positionsSeq, setpositionsSeq] = useState(allSeqState.positionsSeq);
  useEffect(() => {
    setpositionsSeq(allSeqState.positionsSeq);
    setPositionColVis((prev) => {
      const colVis = {};
      Object.keys(PositionColVis).map((col) => {
        if (allSeqState.positionsSeq.includes(col)) {
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
        positionsVis: PositionColVis,
      }),
    );
    if (new Set(Object.values(PositionColVis)).size === 1) {
      if (Object.values(PositionColVis).includes(true)) {
        setpositionsSeq(positionCols);
      } else {
        setpositionsSeq([]);
      }
    }
  }, [PositionColVis]);
  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        positionsSeq: positionsSeq,
      }),
    );
  }, [positionsSeq]);

  const { positions: position } = useSelector((state) => state.positionReducer);

  const [filteredPositions, setfilteredPositions] = useState(position);

  useEffect(() => {
    updateFilteredRows({
      UserIDSelected,
      ProductSelected,
      ExchangeSelected,
      SymbolSelected,

      setuniqueUserID,
      setuniqueProduct,
      setuniqueExchange,
      setuniqueSymbol,
    });
  }, [position]);
  // console.log(position, "position");

  const [showSearchPositions, setshowSearchPositions] = useState({
    showSearchUserID: false,
    showSearchProduct: false,
    showSearchExchange: false,
    showSearchSymbol: false,
  });
  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchPositions((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, false]),
        ),
      );
    }
  };
  const [selectAllUserID, setSelectAllUserID] = useState(false);
  const [uniqueUserID, setuniqueUserID] = useState([]);
  const [UserIDSelected, setUserIDSelected] = useState([]);

  const [selectAllProduct, setSelectAllProduct] = useState(false);
  const [uniqueProduct, setuniqueProduct] = useState([]);
  const [ProductSelected, setProductSelected] = useState([]);

  const [selectAllExchange, setSelectAllExchange] = useState(false);
  const [uniqueExchange, setuniqueExchange] = useState([]);
  const [ExchangeSelected, setExchangeSelected] = useState([]);

  const [selectAllSymbol, setSelectAllSymbol] = useState(false);
  const [uniqueSymbol, setuniqueSymbol] = useState([]);
  const [SymbolSelected, setSymbolSelected] = useState([]);

  useEffect(() => {
    const data = position;
    setuniqueUserID(data ? [...new Set(data.map((d) => d["User ID"]))] : []);
    setuniqueProduct(data ? [...new Set(data.map((d) => d.Product))] : []);
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
  const handleCheckboxChangeProduct = (Product) => {
    const isSelected = ProductSelected.includes(Product);
    if (isSelected) {
      setProductSelected(ProductSelected.filter((item) => item !== Product));
      setSelectAllProduct(false);
    } else {
      setProductSelected((prevSelected) => [...prevSelected, Product]);
      setSelectAllProduct(ProductSelected.length === uniqueProduct.length - 1);
    }
  };
  const handleSelectAllForProduct = () => {
    const allChecked = !selectAllProduct;
    setSelectAllProduct(allChecked);
    if (allChecked) {
      setProductSelected(uniqueProduct.map((d) => d.toLowerCase()));
    } else {
      setProductSelected([]);
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
      ProductSelected,
      ExchangeSelected,
      SymbolSelected,

      setuniqueUserID,
      setuniqueProduct,
      setuniqueExchange,
      setuniqueSymbol,
    });

    setshowSearchPositions((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, false]),
      ),
    );
  };
  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows = ({
    UserIDSelected,
    ProductSelected,
    ExchangeSelected,
    SymbolSelected,

    setuniqueUserID,
    setuniqueProduct,
    setuniqueExchange,
    setuniqueSymbol,
  }) => {
    const rows = position;
    let prevfilteredRows;
    if (UserIDSelected.length !== 0) {
      prevfilteredRows = rows.filter((row) =>
        UserIDSelected.includes(row["User ID"].toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    if (ProductSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ProductSelected.includes(row.Product.toLowerCase()),
      );
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
    const arrayNames = [
      "UserIDSelected",
      "ProductSelected",
      "ExchangeSelected",
      "SymbolSelected",
    ];
    const arrays = [
      UserIDSelected,
      ProductSelected,
      ExchangeSelected,
      SymbolSelected,
    ];
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
    if (NameOfNonEmptyArray !== "ProductSelected") {
      setuniqueProduct(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.Product;
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
    setfilteredPositions(prevfilteredRows);
  };

  const positionsTH = {
    Action: PositionColVis["Action"] && (
      <th >
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
    "User ID": PositionColVis["User ID"] && (
      <th>
        <div>
          <small>User ID</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
            onClick={() => {
              setshowSearchPositions((prev) => ({
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
        {showSearchPositions.showSearchUserID && (
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
                  setshowSearchPositions((prev) =>
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
    Product: PositionColVis["Product"] && (
      <th>
        <div>
          <small>Product</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
            onClick={() => {
              setshowSearchPositions((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchProduct"
                      ? !prev.showSearchProduct
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {/* {showSearchfyersclientId && (
        <div className="Filter-popup">
          <form id="filter-form-user" className="Filter-inputs-container">
            <ul>
              <li>
                <input
                  type="checkbox"
                  style={{ width: "12px" }}
                  checked={selectAllForfyersclientId}
                  onChange={handleSelectAllForFyersClientId}
                />
                Select all
              </li>
              <li>
                {uniqueDatafyersclientId.map((fyersclientId, index) => {
                  return (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "15px",
                        }}
                        checked={fyersclientIdSelected.includes(
                          fyersclientId.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangefyersclient(
                            fyersclientId.toLowerCase(),
                          )
                        }
                      />
                      <label>{fyersclientId}</label>
                    </div>
                  );
                })}
              </li>
            </ul>
          </form>
          <div className="filter-popup-footer">
            <button onClick={handleOkClick}>OK</button>
            <button
              onClick={() => setShowSearchfyersclientId((prev) => !prev)}
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
        {showSearchPositions.showSearchProduct && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllProduct}
                    onChange={handleSelectAllForProduct}
                  />
                  Select all
                </li>
                <li>
                  {uniqueProduct
                    .filter((name) => name !== undefined && name !== "")
                    .map((Product, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={ProductSelected.includes(
                              Product.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeProduct(Product.toLowerCase())
                            }
                          />
                          <label>{Product}</label>
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
                  setshowSearchPositions((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key, value]) => [key, false]),
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
    Exchange: PositionColVis["Exchange"] && (
      <th>
        <div>
          <small>Exchange</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPositions((prev) => ({
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
        {showSearchPositions.showSearchExchange && (
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
                  setshowSearchPositions((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key, value]) => [key, false]),
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
    Symbol: PositionColVis["Symbol"] && (
      <th>
        <div>
          <small>Symbol</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPositions((prev) => ({
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
        {showSearchPositions.showSearchSymbol && (
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
                  setshowSearchPositions((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([key, value]) => [key, false]),
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
    "Net Qty": PositionColVis["Net Qty"] && (
      <th>
        <div>
          <small>Net Qty</small>
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
    LTP: PositionColVis["LTP"] && (
      <th>
        <div>
          <small>LTP</small>
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
    "P&L": PositionColVis["P&L"] && (
      <th>
        <div>
          <small>P&L</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
          />
        </div>
      </th>
    ),
    "P&L%": PositionColVis["P&L%"] && (
      <th>
        <div>
          <small>P&L%</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Buy Qty": PositionColVis["Buy Qty"] && (
      <th>
        <div>
          <small>Buy Qty</small>
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
    "Buy Avg Price": PositionColVis["Buy Avg Price"] && (
      <th>
        <div>
          <small>Buy Avg Price</small>
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
    "Buy Value": PositionColVis["Buy Value"] && (
      <th>
        <div>
          <small>Buy Value</small>
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
    "Sell Qty": PositionColVis["Sell Qty"] && (
      <th>
        <div>
          <small>Sell Qty</small>
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
    "Sell Avg Price": PositionColVis["Sell Avg Price"] && (
      <th>
        <div>
          <small>Sell Avg Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-15px",
            }}
          />
        </div>
        {/* {showSearchSqOffTime && (
        <div className="Filter-popup">
          <form
            id="filter-form-sqOffTime"
            className="Filter-inputs-container"
          >
            <ul>
              <li>
                <input
                  type="checkbox"
                  style={{ width: "12px" }}
                  checked={selectAllSqOffTime}
                  onChange={handleSelectAllForSqOffTime}
                />
                Select all
              </li>
              <li>
                {uniqueDataSqOffTime.map((sqOffTime, index) => (
                  <div key={index} className="filter-inputs">
                    <input
                      type="checkbox"
                      style={{
                        width: "12px",
                      }}
                      checked={sqOffTimeSelected.includes(
                        sqOffTime.toLowerCase(),
                      )}
                      onChange={() =>
                        handleCheckboxChangeSqOffTime(sqOffTime.toLowerCase())
                      }
                    />
                    <label>{sqOffTime}</label>
                  </div>
                ))}
              </li>
            </ul>
          </form>
          <div className="filter-popup-footer">
            <button onClick={handleOkClick}>OK</button>
            <button onClick={() => setShowSearchSqOffTime((prev) => !prev)}>
              Cancel
            </button>
          </div>
        </div>
      )} */}
      </th>
    ),
    "Sell Value": PositionColVis["Sell Value"] && (
      <th>
        <div>
          <small>Sell Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Carry FWD Qty": PositionColVis["Carry FWD Qty"] && (
      <th>
        <div>
          <small>Carry FWD Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Realized Profit": PositionColVis["Realized Profit"] && (
      <th>
        <div>
          <small>Realized Profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Unrealized profit": PositionColVis["Unrealized profit"] && (
      <th>
        <div>
          <small>Unrealized profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
        <div className="Filter-popup">
          <form id="filter-form" className="Filter-inputs-container">
            <ul>
              <li>
                <input
                  type="checkbox"
                  style={{ width: "12px" }}
                  checked={selectAllMaxProfit}
                  onChange={handleSelectAllForMaxProfit}
                />
                Select all
              </li>
              <li>
                {uniqueDataMaxProfit.map((maxProfit, index) => (
                  <div key={index} className="filter-inputs">
                    <input
                      type="checkbox"
                      style={{
                        width: "12px",
                      }}
                      checked={maxProfitSelected.includes(maxProfit)}
                      onChange={() =>
                        handleCheckBoxChangeForMaxProfit(maxProfit)
                      }
                    />
                    <label>{maxProfit}</label>
                  </div>
                ))}
              </li>
            </ul>
          </form>
          <div className="filter-popup-footer">
            <button onClick={handleOkClick}>OK</button>
            <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
              Cancel
            </button>
          </div>
        </div>
      )} */}
      </th>
    ),
    "User Alias": PositionColVis["User Alias"] && (
      <th>
        <div>
          <small>User Alias</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
        <div className="Filter-popup">
          <form id="filter-form" className="Filter-inputs-container">
            <ul>
              <li>
                <input
                  type="checkbox"
                  style={{ width: "12px" }}
                  checked={selectAllMaxProfit}
                  onChange={handleSelectAllForMaxProfit}
                />
                Select all
              </li>
              <li>
                {uniqueDataMaxProfit.map((maxProfit, index) => (
                  <div key={index} className="filter-inputs">
                    <input
                      type="checkbox"
                      style={{
                        width: "12px",
                      }}
                      checked={maxProfitSelected.includes(maxProfit)}
                      onChange={() =>
                        handleCheckBoxChangeForMaxProfit(maxProfit)
                      }
                    />
                    <label>{maxProfit}</label>
                  </div>
                ))}
              </li>
            </ul>
          </form>
          <div className="filter-popup-footer">
            <button onClick={handleOkClick}>OK</button>
            <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
              Cancel
            </button>
          </div>
        </div>
      )} */}
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
              <i class="bi bi-cursor"></i>
                <span className="text-blue-600 font-bold">Positions</span>{" "}
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
            <table>
              <thead style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}>
                {positionsSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {positionsTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody>
                {filteredPositions.map((pos, index) => {
                  const positionsTD = {
                    Action: PositionColVis["Action"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User ID": PositionColVis["User ID"] && (
                      <td>
                        <input
                          value={pos["User ID"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Product: PositionColVis["Product"] && (
                      <td>
                        <input
                          value={pos.Product}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: PositionColVis["Exchange"] && (
                      <td>
                        <input
                          value={pos.Exchange}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    Symbol: PositionColVis["Symbol"] && (
                      <td>
                        <input
                          type="text"
                          value={pos.Symbol}
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    ),
                    "Net Qty": PositionColVis["Net Qty"] && (
                      <td>
                        <input
                          value={pos["Net Qty"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "LTP": PositionColVis["LTP"] && (
                      <td>
                        <input
                          value={
                            pos.LTP !== undefined && pos.LTP !== null && !isNaN(pos.LTP)
                              ? Number(pos.LTP) === 0
                                ? 0
                                : Number(pos.LTP).toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),

                    "P&L": PositionColVis["P&L"] && (
                      <td>
                        <input
                          value={
                            pos["P&L"] !== undefined && pos["P&L"] !== null && !isNaN(pos["P&L"])
                              ? Number(pos["P&L"]) === 0
                                ? 0
                                : Number(pos["P&L"]).toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                            color: Number(pos["P&L"]) < 0 ? "red" : "green",
                          }}
                        />
                      </td>
                    ),
                    "P&L%": PositionColVis["P&L%"] && (
                      <td>
                        <input
                          type="text"
                          value={(() => {
                            const buyAvgPrice = parseFloat(pos["Buy Avg Price"]) || 0;
                            const sellAvgPrice = pos["Sell Avg Price"]
                              ? parseFloat(pos["Sell Avg Price"])
                              : parseFloat(pos["LTP"]) || 0;

                            if (buyAvgPrice !== 0) {
                              const pnlPercentage = ((sellAvgPrice - buyAvgPrice) / buyAvgPrice) * 100;
                              return `${pnlPercentage.toFixed(2)}%`; // Format to 2 decimal places with '%' symbol
                            }

                            if (buyAvgPrice === 0 && sellAvgPrice === 0) {
                              return "0%";
                            }

                            return "N/A";
                          })()}
                          readOnly
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: (() => {
                              const buyAvgPrice = parseFloat(pos["Buy Avg Price"]) || 0;
                              const sellAvgPrice = pos["Sell Avg Price"]
                                ? parseFloat(pos["Sell Avg Price"])
                                : parseFloat(pos["LTP"]) || 0;

                              if (buyAvgPrice !== 0) {
                                const pnlPercentage = ((sellAvgPrice - buyAvgPrice) / buyAvgPrice) * 100;
                                return pnlPercentage >= 0 ? "green" : "red";
                              }

                              return "green"; // Default color for "N/A" or zero values
                            })(),
                            
                          }}
                        />
                      </td>
                    ),

                    "Buy Qty": PositionColVis["Buy Qty"] && (
                      <td>
                        <input
                          type="text"
                          value={pos["Buy Qty"]} // Conditionally round to two decimal points if position.buyQty is a number
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Buy Avg Price": PositionColVis["Buy Avg Price"] && (
                      <td>
                        <input
                          value={
                            pos["Buy Avg Price"] !== undefined && pos["Buy Avg Price"] !== null && !isNaN(pos["Buy Avg Price"])
                              ? Number(pos["Buy Avg Price"]) === 0
                                ? "0"
                                : Number(pos["Buy Avg Price"]).toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            textAlign: "center",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Buy Value": PositionColVis["Buy Value"] && (
                      <td>
                        <input
                          type="text"
                          value={
                            pos["Buy Value"] !== undefined && pos["Buy Value"] !== null && !isNaN(pos["Buy Value"])
                              ? Number(pos["Buy Value"]) === 0
                                ? "0"
                                : Number(pos["Buy Value"]).toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Qty": PositionColVis["Sell Qty"] && (
                      <td>
                        <input
                          value={pos["Sell Qty"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Avg Price": PositionColVis["Sell Avg Price"] && (
                      <td>
                        <input
                          type="number"
                          value={
                            pos["Sell Avg Price"] !== undefined && pos["Sell Avg Price"] !== null && !isNaN(pos["Sell Avg Price"])
                              ? Number(pos["Sell Avg Price"]) === 0
                                ? "0"
                                : Number(pos["Sell Avg Price"]).toFixed(2)
                              : ""
                          }
                          style={{ padding: "6px" }}
                        />
                      </td>
                    ),
                    "Sell Value": PositionColVis["Sell Value"] && (
                      <td>
                        <input
                          type="number"
                          value={
                            pos["Sell Value"] !== undefined && pos["Sell Value"] !== null && !isNaN(pos["Sell Value"])
                              ? Number(pos["Sell Value"]) === 0
                                ? "0"
                                : Number(pos["Sell Value"]).toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Carry FWD Qty": PositionColVis["Carry FWD Qty"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Realized Profit": PositionColVis["Realized Profit"] && (
                      <td>
                        <input
                          value={pos["Realized Profit"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Unrealized profit": PositionColVis[
                      "Unrealized profit"
                    ] && (
                        <td>
                          <input
                            type="number"
                            value={pos["Unrealized profit"]}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                    "User Alias": PositionColVis["User Alias"] && (
                      <td>
                        <input
                          value={pos["User Alias"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {positionsSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {positionsTD[colName]}
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
            handleClearLogs={handleClearLogs}
          />
        </div>
        {/* <RightNav /> */}
      </div>
    </div>
  );
}
export default Positions;
