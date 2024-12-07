import React, { useState, useEffect, useRef } from "react";
import shape from "../assets/shape.png";
import Modal from "react-modal";
import pencil from "../assets/pencil.png";
import minus from "../assets/minus-sign.png";
import plus from "../assets/plus-sign.png";
import Draggable from "react-draggable";
import push from "../assets/push-pin.png";
import reuse from "../assets/reuse.png";
import disk from "../assets/diskette.png";
import recycle from "../assets/recycle-bin.png";
import { Oval } from "react-loader-spinner";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import strategy from "../store/slices/strategy";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setBrokers } from "../store/slices/broker.js";
import executedPortfolios, {
  setexecutedPortfolios,
} from "../store/slices/executedPortfolios.js";


const cookies = new Cookies();

export const QuickTradePanel = ({
  isOpen,
  handleClose,
  colopen,
  toggleOpen,
  position,
  resetPosition,
  handleDrag,
}) => {



  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { strategies: Strategydata } = useSelector(
    (state) => state.strategyReducer,
  );
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);

  const handleMsg = (Msg) => {
    dispatch((dispatch, getState) => {
      const previousConsoleMsgs = getState().consoleMsgsReducer.consoleMsgs;

      const lastMsg = previousConsoleMsgs[ 0 ];
      if (
        lastMsg &&
        lastMsg.msg === Msg.msg &&
        lastMsg.user === Msg.user &&
        lastMsg.strategy === Msg.startegy &&
        lastMsg.portfolio === Msg.porttfolio
      ) {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...previousConsoleMsgs.slice(1) ],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...previousConsoleMsgs ],
          }),
        );
      }
    });
  };

  const [ placeOrderOptionsQTPBtn, setplaceOrderOptionsQTPBtn ] = useState(false);

  const [ optionsQTP, setOptionsQTP ] = useState({
    exchange: "",
    stock_symbol: "",
    userIds: "",
    lots: "",
    variety: "",
    strategy_tag: "",
    portfolio_name: "",
    quantity: "",
    order_type: "",
    price: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setOptionsQTP({
        exchange: "",
        stock_symbol: "",
        userIds: "",
        lots: "",
        variety: "",
        strategy_tag: "",
        portfolio_name: "",
        quantity: "",
        order_type: "",
        price: "",
      });
      setSymbolLTP(0);
    }
  }, [ isOpen ]);

  const [ updateKey, setUpdateKey ] = useState(0);

  const close = () => {
    setOptionsQTP({
      exchange: '',
      stock_symbol: '',
      lots: '',
      variety: '',
      strategy: '',
      userIds: '',
      portfolio_name: '',
      Option_Strategy: '',
    });
    handleClose();
    resetPosition();
    forceUpdate(); // Call forceUpdate after state change
  };

  // Function to force re-render
  const forceUpdate = () => {
    setUpdateKey(prev => prev + 1);
  };


  const [ symbols, setsymbols ] = useState([]);
  const [ symbolsLtp, setSymbolLTP ] = useState(0);

  const [ filteredData, setFilteredData ] = useState([]);
  const [ showDropdown, setShowDropdown ] = useState(false);

  const [ broker, setBroker ] = useState(null);
  const [ rowData, setRowData ] = useState(null);


  const mainUser = cookies.get("USERNAME");


  const fetchExecutedPortfolios = async () => {

    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/get_executed_portfolios/${mainUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch executed portfolios");
      }
      const { ExecutedPortfolios } = await response.json();
      dispatch(
        setexecutedPortfolios({
          executedPortfolios: ExecutedPortfolios,
        }),
      );
      //// console.log("Executed ", ExecutedPortfolios)
    } catch (error) {
      console.error("Error fetching executed portfolios:", error.message);
    }
  };

  const getSymbols = async () => {
    // const mainUser = cookies.get("USERNAME");
    try {
      const mappedUserIds = rows.filter((row) => row.inputDisabled);
      const exchange = optionsQTP.exchange;

      if (mappedUserIds.length === 0) {
        handleMsg({
          msg: "Please login at least one broker account",
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
        setTimeout(close, 500);

        return;
      }
      const brokers = {};

      for (let index = 0; index < mappedUserIds.length; index++) {
        const rowData = mappedUserIds[ index ];
        if (rowData.inputDisabled) {
          if (!brokers[ rowData.broker ]) {
            brokers[ rowData.broker ] = rowData;
          }
        }
      }

      for (const [ broker, rowData ] of Object.entries(brokers)) {
        let endpoint = "";
        if (broker === "angelone") {
          endpoint = `${import.meta.env.SERVER_HOST}/angelone_symbols/${mainUser}/${rowData.userId}`;
        } else if (broker === "fyers") {
          endpoint = `${import.meta.env.SERVER_HOST}/fyers_equity_symbols/${mainUser}/${rowData.userId}`;
        }
        if (endpoint) {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              exchange: exchange,
            }),
          });

          //console.log(response, "response mahesh");
          //// console.log(endpoint, "endpoint"
          // );

          if (response.ok) {
            const data = await response.json();
            if (broker === "angelone") {
              if (
                data.angelone_bse_symbols_data !== undefined &&
                Array.isArray(data.angelone_bse_symbols_data) &&
                data.angelone_bse_symbols_data.length > 0
              ) {
                setsymbols(data.angelone_bse_symbols_data);
              } else {
                setsymbols(data.angelone_nse_symbols_data);
              }
            } else if (broker === "fyers") {
              if (data.fyers_bse_equity_symbols_data != null) {
                setsymbols(data.fyers_bse_equity_symbols_data);
              } else {
                setsymbols(data.fyers_nse_equity_symbols_data);
              }
            }
          }
          setBroker(broker);
          setRowData(rowData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  const getSymbolLTP = async () => {
    // const mainUser = cookies.get("USERNAME");
    //// console.log(broker, "broker")
    //// console.log(rowData, "rowData.userId")
    try {
      let endpoint = "";
      if (broker === "angelone") {
        endpoint = `${import.meta.env.SERVER_HOST}/get_angelone_equity_price_details/${mainUser}/${rowData.userId}`;
      } else if (broker === "fyers") {
        endpoint = `${import.meta.env.SERVER_HOST}/get_fyers_equity_price_details/${mainUser}/${rowData.userId}`;
      } else {
        throw new Error("Invalid broker specified");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: optionsQTP.stock_symbol,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSymbolLTP(data.ltp);
      } else {
        setSymbolLTP(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (broker && rowData) {
      getSymbolLTP(broker, rowData);
    }
  }, [ broker, rowData ]);

  useEffect(() => {
    if (optionsQTP.stock_symbol !== "") {
      getSymbolLTP();
    }
  }, [ optionsQTP.stock_symbol ]);

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/get_user_data/${mainUser}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong. Please try again.");
      }

      const responseData = await response.json();


      const brokerData = responseData.broker_credentials.find(
        (row) => row.broker === "pseudo_account"
      );

      if (!brokerData) {
        throw new Error("Pseudo account not found.");
      }

      const newMargin = brokerData.available_balance ?? "0.00";
      const newUtilizedMargin = brokerData.utilized_margin ?? "0.00";

      const newFilledData = rows.map((account) => {
        if (account.userId === brokerData.broker_user_id) {
          return {
            ...account,
            availableMargin: newMargin,
            utilized_Margin: newUtilizedMargin,
          };
        }
        return account;
      });
      console.log("newFilledData", newFilledData, newUtilizedMargin, newMargin)

      dispatch(
        setBrokers({
          brokers: newFilledData,
        })
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  const handlePlaceOrderOptionsQTP = async (transactionType) => {
    try {
      const linkedList = Strategydata.filter(
        (strategie) => strategie.StrategyLabel === optionsQTP.strategy_tag,
      );
      const mapedUserIds = linkedList[ 0 ].TradingAccount.split(", ");
      //console.log(linkedList, mapedUserIds, "mahesh");

      mapedUserIds.map(async (userId, index) => {
        const user = rows.find((user) => user.userId === userId);
        if (user && user.inputDisabled) {
          let apiUrl, orderType;
          if (user.broker === "fyers") {
            apiUrl = `${import.meta.env.SERVER_HOST}/fyers_place_equity_order/fyers/${mainUser}/${user.userId}`;
          } else if (user.broker === "angelone") {
            apiUrl = `${import.meta.env.SERVER_HOST}/angelone_place_equity_order/angelone/${mainUser}/${user.userId}`;
          } else if (user.broker === "flattrade") {
            apiUrl = `${import.meta.env.SERVER_HOST}/flattrade_equity_place_order/flattrade/${mainUser}/${user.userId}`;
          } else if (user.broker === "pseudo_account") {
            apiUrl = `${import.meta.env.SERVER_HOST}/pseudo_equity_place_order/pseudo/${mainUser}/${user.userId}`;
          }

          const requestData = {
            symbol: optionsQTP.stock_symbol,
            quantity: Number(optionsQTP.quantity),
            strategy: optionsQTP.strategy_tag,
            transaction_type: transactionType,
            product_type: optionsQTP.variety,
            order_type: optionsQTP.order_type
              ? optionsQTP.order_type
              : orderType,
            limitPrice: Number(optionsQTP.price ? optionsQTP.price : 0),
          };

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
          //console.log(res, "mahesh", requestData);

          try {
            if (res.ok) {
              const orderPlaceoptionsQTPRes = await res.json();
              //console.log(orderPlaceoptionsQTPRes, "orderPlaceoptionsQTPRes");
              fetchExecutedPortfolios();
              fetchAccountDetails();

              setplaceOrderOptionsQTPBtn(false);
              close(true);
              handleMsg({
                msg: orderPlaceoptionsQTPRes.message,
                logType: "TRADING",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
                strategy: optionsQTP.strategy_tag,
              });
            } else {
              setplaceOrderOptionsQTPBtn(false);
              const orderPlaceoptionsQTPRes = await res.json();
              //// console.log(
              //   orderPlaceoptionsQTPRes,
              //   "orderPlaceoptionsQTPRes err",
              // );

              handleMsg({
                msg: orderPlaceoptionsQTPRes[ 0 ].message,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
                strategy: optionsQTP.strategy_tag,
              });
            }
          } catch (e) {
            setplaceOrderOptionsQTPBtn(false);
            close(true);
            handleMsg({
              msg: e.message,
              logType: "ERROR",
              timestamp: `${new Date().toLocaleString()}`,
              user: user.userId,
              strategy: optionsQTP.strategy_tag,
            });
          }
        } else {
          handleMsg({
            msg: `Login to ${user.userId} to place an order in this account.`,
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
            user: user.userId,
            strategy: optionsQTP.strategy_tag,
          });

          if (
            optionsQTP.userIds.length === 1 ||
            index === optionsQTP.userIds.length - 1
          ) {
            setplaceOrderOptionsQTPBtn(false);
            close(true);
          }
        }
      });
      close(true);
    } catch (error) {
      //console.log(error.message);
    }
  };

  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  useEffect(() => {
    if (optionsQTP.exchange !== "") {
      getSymbols();
      setOptionsQTP((prev) => ({
        ...prev,
        stock_symbol: "",
        userIds: "",
        lots: "",
        variety: "",
        strategy_tag: "",
        portfolio_name: "",
        quantity: "",
        order_type: "",
        price: "",
      }));
      setSymbolLTP(0);
    }
  }, [ optionsQTP.exchange ]);

  const filterData = async () => {
    const searchQuery = optionsQTP.stock_symbol.toLowerCase();

    if (searchQuery !== "" && optionsQTP.exchange !== "") {
      try {
        const filteredData = symbols
          .filter(
            (item) =>
              item.Symbol.toLowerCase().includes(searchQuery) &&
              item.Symbol.trim() !== optionsQTP.stock_symbol, // Exclude the selected item
          )
          .map((item) => item.Symbol.trim());

        setFilteredData(filteredData);
        //console.log(symbols, filteredData, "mahesh");
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredData([]);
        setShowDropdown(false);
      }
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    filterData();
  }, [ optionsQTP.stock_symbol ]);

  const handleSelectItem = (item) => {
    setOptionsQTP((prev) => ({
      ...prev,
      stock_symbol: item,
    }));
    setShowDropdown(false);
    getSymbolLTP();
  };

  const generateDropdownItems = (item) => {
    const input = optionsQTP.stock_symbol.toLowerCase();
    const startIndex = item.toLowerCase().indexOf(input);
    const endIndex = startIndex + input.length;
    return (
      <>
        {item.slice(0, startIndex)}
        <span style={{ backgroundColor: "yellow" }}>
          {item.slice(startIndex, endIndex)}
        </span>
        {item.slice(endIndex)}
      </>
    );
  };

  return (
    <div style={{ zIndex: "1000" }}>
      <Draggable
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }} // Set default position
        position={position} // Set position from state
        onDrag={handleDrag}
      >
        <div // Quick Trade Panel
          isOpen={isOpen}
          onRequestClose={close}
          key={updateKey}
          className="your-modal-button"
          style={{
            display: isOpen ? "block" : "none",
            border: "none",
            // overlay: {
            //   backgroundColor: "rgba(0, 0, 0, 0.1)",
            //   zIndex: 1000,
            //   border: "none",
            // },
            top: "25%",
            left: "25%",

            overlay: {
              backgroundColor: "visible",
              zIndex: 1000,
              pointerEvents: "none",
            },
            content: {
              pointerEvents: "auto",
            },
          }}
        >
          <div className="containerin  handle">
            <div className="title"></div>
            <h2
              style={{
                marginTop: "5px",
                color: "#4661bd",
                fontFamily: "Roboto",
                fontSize: "24px",
              }}
            >
              Stock Trading Panel
            </h2>
            <div className="content">
              <div className="user-details">
                <div className="input-box">
                  <select
                    className="one"
                    style={{
                      border: "0.5px solid #cacaca",
                      color: "GrayText",
                      paddingLeft: "7px",
                    }}
                    onChange={(e) => {
                      setOptionsQTP((prev) => ({
                        ...prev,
                        exchange: e.target.value,
                      }));
                    }}
                  >
                    <option disabled selected>
                      Exchange
                    </option>
                    <option style={{ color: "black" }} value={"BFO"}>
                      BFO
                    </option>
                    <option style={{ color: "black" }} value={"NFO"}>
                      NFO
                    </option>
                    <option style={{ color: "black" }} value={"MCX"}>
                      MCX
                    </option>
                    <option style={{ color: "black" }} value={"NSE"}>
                      NSE
                    </option>
                    <option style={{ color: "black" }} value={"BSE"}>
                      BSE
                    </option>
                  </select>
                </div>

                <div type="text" className="two" style={{ marginTop: "-55px" }}>
                  <img
                    src={pencil}
                    style={{
                      padding: "5px",
                      height: "38px",
                      width: "36px",
                    }}
                    alt="profile-pic"
                  />
                  <img
                    style={{
                      cursor: "pointer",
                      padding: "5px",
                      height: "38px",
                      width: "36px",
                    }}
                    src={colopen ? plus : minus}
                    onClick={toggleOpen}
                    id="colopen"
                    alt="profile-pic"
                  />
                  <img
                    src={push}
                    style={{
                      padding: "5px",
                      height: "38px",
                      width: "36px",
                    }}
                    alt="profile-pic"
                  />
                  <img
                    src={shape}
                    style={{ cursor: "pointer", padding: "5px" }}
                    onClick={close}
                    alt="profile-pic"
                  />
                </div>
                <div className="input-box5" ref={inputRef}>
                  <input
                    type="text"
                    className="details"
                    style={{
                      color: "black",
                      textTransform: "uppercase",
                      marginBottom: "11px",
                      left: "4px",
                    }}
                    value={optionsQTP.stock_symbol}
                    onChange={(e) => {
                      setOptionsQTP((prev) => ({
                        ...prev,
                        stock_symbol: e.target.value.toUpperCase(),
                      }));
                      setShowDropdown(false);
                    }}
                    disabled={!optionsQTP.exchange}
                  />
                  {showDropdown && optionsQTP.exchange && (
                    <div
                      className="dropdown"
                      style={{
                        position: "absolute",
                        top: "137px",
                        left: 16,
                        width: "100PX",
                        zIndex: 0,
                      }}
                    >
                      <div className="dropdown-content">
                        {filteredData.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelectItem(item)}
                          >
                            {generateDropdownItems(item)}
                          </div>
                        ))}
                        {filteredData.length > 5 && (
                          <div className="scroll-bar">
                            {filteredData.slice(5).map((item, index) => (
                              <div
                                key={index}
                                className="dropdown-item"
                                onClick={() => {
                                  handleSelectItem(item);
                                  setShowDropdown(false);
                                }}
                              >
                                {generateDropdownItems(item)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="input-box"
                  style={{ alignItems: "top", marginTop: "-50px" }}
                >
                  <div type="text" className="four">
                    <img
                      src={reuse}
                      style={{
                        padding: "5px",
                        marginBottom: "20px",
                        height: "43px",
                        width: "40px",
                      }}
                      alt="profile-pic"
                    />
                    <img
                      src={disk}
                      style={{
                        padding: "9px",
                        marginBottom: "20px",
                        height: "43px",
                        width: "40px",
                      }}
                      alt="profile-pic"
                    />
                    <img
                      src={recycle}
                      style={{
                        paddingTop: "5px",
                        marginBottom: "25px",
                        width: "40px",
                      }}
                      alt="profile-pic"
                    />
                  </div>
                </div>
                <div className="input-box">
                  <select
                    className="five"
                    style={{
                      border: "0.5px solid #cacaca",
                      color: "GrayText",
                    }}
                    onChange={(e) => {
                      setOptionsQTP((prev) => ({
                        ...prev,
                        strategy_tag: e.target.value,
                      }));
                    }}
                  >
                    <option disabled selected>
                      Strategy
                    </option>
                    {Strategydata.filter((row) => row.enabled) // Filter rows where Action.enabled is true
                      .map((row, index) => (
                        <option key={index} value={row.StrategyLabel}>
                          {row.StrategyLabel}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="input-box">
                  <span
                    style={{
                      padding: "5px",
                      marginLeft: "3px",
                      fontSize: "20px",
                      fontWeight: "400",
                      color: "black",
                      fontFamily: "Roboto",
                    }}
                  >
                    {" "}
                    Qty
                  </span>
                  <input
                    onChange={(e) => {
                      setOptionsQTP((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }));
                    }}
                    value={optionsQTP.quantity}
                    type="number"
                    className="six"
                  />
                </div>
              </div>

              <div
                className="gender-details"
                id="gender-details"
                style={{
                  border: "1px solid #cacaca",
                  margin: "5px",
                  display: "none",
                  padding: "10px",
                }}
              >
                <span className="gender-title">Optional Parameters</span>

                <div className="user-details" style={{ margin: "5px" }}>
                  <div className="input-box">
                    <select
                      className="fives"
                      style={{
                        border: "0.5px solid #cacaca",
                        color: "GrayText",
                      }}
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          variety: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Product
                      </option>
                      <option style={{ color: "black" }} value={"NRML"}>
                        NRML
                      </option>
                      <option style={{ color: "black" }} value={"MIS"}>
                        MIS
                      </option>
                    </select>
                  </div>
                  <div className="input-box">
                    <select
                      className="fives"
                      style={{
                        border: "0.5px solid #cacaca",
                        color: "GrayText",
                      }}
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          order_type: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Order Type
                      </option>
                      <option style={{ color: "black" }} value={"MARKET"}>
                        MARKET
                      </option>
                      <option style={{ color: "black" }} value={"LIMIT"}>
                        LIMIT
                      </option>
                    </select>
                  </div>
                  <div className="input-box">
                    <span className="details">Price</span>
                    <input
                      type="number"
                      style={{ width: "65%", WebkitAppearance: "none" }}
                      value={symbolsLtp}
                    />
                  </div>
                  <div className="input-box">
                    <span className="details" style={{ marginLeft: "-85px" }}>
                      Trigger
                    </span>
                    <input
                      style={{ marginLeft: "-43%", width: "65%" }}
                      type="number"
                      defaultValue={0}
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }));
                      }}
                      disabled={optionsQTP.order_type === "MARKET"}
                    />
                  </div>
                </div>

                <div className="user-details-bottom">
                  <div className="input-box">
                    <span className="details">Target</span>
                    <input type="number" value="0" />
                  </div>
                  <div className="input-box">
                    <span className="details">S</span>
                    <input type="number" value="0" />
                  </div>
                  <div className="input-box">
                    <span className="details">SL Trail</span>
                    <input type="number" value="0" />
                  </div>
                </div>
              </div>
              <div className="user-details-button">
                <div className="input-box">
                  {/* {!placeOrderBtn ? ( */}
                  <button
                    // onClick={() => { handlePlaceOrderOptionsQTP('BUY'); }}
                    style={{ background: "#618F00" }}
                    onClick={() => {
                      if (placeOrderStart) {
                        //console.log("mahesh", "hello");
                        handlePlaceOrderOptionsQTP("BUY");
                      } else {
                        close(false);
                        handleMsg({
                          msg: "To place an Order, Start the Trading.",
                          logType: "WARNING",
                          timestamp: `${new Date().toLocaleString()}`,
                        });
                      }
                    }}
                  >
                    LE
                  </button>
                  {/* )  */}
                </div>
                <div className="input-box">
                  <button
                    onClick={() => {
                      if (placeOrderStart) {
                        handlePlaceOrderOptionsQTP("SELL");
                      } else {
                        close(false);
                        handleMsg({
                          msg: "To place an Order, Start the Trading.",
                          logType: "WARNING",
                          timestamp: `${new Date().toLocaleString()}`,
                        });
                      }
                    }}
                    style={{ background: "#890000" }}
                  >
                    LX
                  </button>
                </div>
                <div className="input-box">
                  <div className="check">
                    <input
                      type="checkbox"
                      style={{ opacity: "1", accentColor: "green" }}
                    />
                    <label
                      htmlFor="legSlCheckbox2"
                      style={{
                        cursor: "pointer",
                        border: "2px solid green",
                        marginLeft: "-20.5px",
                        height: "21.3px",
                        width: "21.9px",
                        marginTop: "-25px",
                      }}
                    ></label>
                  </div>
                </div>
                <div className="input-box">
                  <button style={{ background: "#FF0000" }}>SE</button>
                </div>
                <div className="input-box">
                  <button style={{ background: "#81430B" }}>SX </button>
                </div>
              </div>

              <div className="user-details-button">
                <p
                  style={{
                    color: "blue",
                    fontSize: "19px",
                    fontFamily: "Roboto",
                    padding: "10px",
                    display: "none",
                  }}
                  className="sl"
                >
                  Target, SL in Points. For Percentage, Tick Value in %
                </p>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};
