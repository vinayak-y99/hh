import React, { useState, useEffect } from "react";
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
import { setPortfolios } from "../store/slices/portfolio";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import Cookies from "universal-cookie";
import executedPortfolios, {
  setexecutedPortfolios,
} from "../store/slices/executedPortfolios.js";
import { setBrokers } from "../store/slices/broker.js";
const cookies = new Cookies();

export const OptionQuickTradePanel = ({
  handleClose1,
  isOpen1,
  colopen1,
  toggleOpen1,
  setIsOpen1,
  resetPositionoq,
  // executedPortfolios,
  positionOq,
  handleDragoq,
}) => {

  // Initialize to falsed
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();
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

  const fetchAccountDetails = async () => {
    try {
      const username = cookies.get("USERNAME");

      const response = await fetch(`${import.meta.env.SERVER_HOST}/get_user_data/${username}`, {
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

      dispatch(
        setBrokers({
          brokers: newFilledData,
        })
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

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
      //// console.log("Executed ", ExecutedPortfolios, response)
      // let ExecutedPortfolios = ["a2"];
      //console.log("ExecutedPortfolios===", ExecutedPortfolios.filter(execPort => execPort.portfolio_name === portfolio.portfolio_name)[0]["square_off"])
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

  const handlePageClick = async () => {
    try {
      const responsePortfolioData = await fetch(
        `${import.meta.env.SERVER_HOST}/get_portfolio/${mainUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!responsePortfolioData.ok) {
        const errorData = await responsePortfolioData.json();
        throw {
          message:
            errorData.message || "Something bad happened. Please try again",
        };
      }
      const responseData = await responsePortfolioData.json();
      //// console.log("responseData",responseData)
      let extractedPortfolio = responseData[ "Portfolio details" ];
      //// console.log("extractedPortfolio", extractedPortfolio);

      extractedPortfolio.forEach((portfolio) => {
        portfolio.legs.forEach((leg) => {
          leg.showPopupSL1 = false;
          leg.showPopupSL = false;
        });
      });
      //// console.log("added legs", extractedPortfolio);

      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/get_portfolio_performance/${mainUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch  portfolio subtable data");
      }
      const portfolio_timings = await response.json();
      //// console.log("portfolio_timings useff", portfolio_timings)
      //// console.log("extractedPortfolio useff", extractedPortfolio)
      dispatch(async (dispatch, getState) => {
        // const portfolios = getState().portfolioReducer.portfolios;
        const executedPortfolios =
          getState().executedPortfolioReducer.executedPortfolios;
        let portfolios = [];
        //console.log(executedPortfolios, "executedPortfolios")

        const execPortNames = executedPortfolios.map(
          (port) => port.portfolio_name,
        );

        //console.log("execPortNames", execPortNames)

        for (let i = 0; i < extractedPortfolio.length; i++) {
          const port = extractedPortfolio[ i ];
          //console.log(port, "port")

          if (execPortNames.includes(port.portfolio_name)) {
            let clickedPortBrokerDetails =
              portfolio_timings[ port.portfolio_name ];
            //console.log("clickedPortBrokerDetails", clickedPortBrokerDetails)
            let prevbrokerDetails = [];
            for (let brokerId in clickedPortBrokerDetails) {
              let brokerData = clickedPortBrokerDetails[ brokerId ];
              prevbrokerDetails.push({
                [ brokerId ]: {
                  "P&L": "0.00", // Assuming brokerPL is 0 for the example. Adjust accordingly.
                  maxPL: Number(brokerData.maxPL).toFixed(2),
                  minPL:
                    brokerData.minPL === "Infinity"
                      ? Infinity
                      : Number(brokerData.minPL).toFixed(2),
                  maxPLTime: brokerData.maxPLTime,
                  minPLTime: brokerData.minPLTime,
                },
              });
            }
            portfolios.push({ ...port, brokerDetails: prevbrokerDetails });
          } else {
            //console.log("making empty")
            portfolios.push({ ...port, brokerDetails: [] });
          }
        }

        //console.log("portfolios changed", portfolios)

        dispatch(
          setPortfolios({
            portfolios: portfolios,
          }),
        );
      });
    } catch (error) {
      //console.error("Error:", error);
    }
  };


  //  empty state
  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );

  const { executedPortfolios } = useSelector(
    (state) => state.executedPortfolioReducer,
  );
  // const { strategies } = useSelector(
  //   (state) => state.strategyReducer,
  // );
  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  //console.log("portfolioDetails", portfolioDetails)
  const [ linkedPortfolios, setlinkedPortfolios ] = useState([]);
  const [ allStrategiesList, setallStrategiesList ] = useState([]);
  const [ placeOrderBtn, setplaceOrderBtn ] = useState(false);

  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const [ optionsQTP, setOptionsQTP ] = useState({
    exchange: "",
    stock_symbol: "",
    lots: "",
    variety: "",
    strategy: "",
    userIds: "",
    portfolio_name: "",
    Option_Strategy: "",
  });

  useEffect(() => {
    if (!isOpen1) {
      setplaceOrderOptionsQTPBtn(false);
      setOptionsQTP({
        exchange: "",
        stock_symbol: "",
        lots: "",
        variety: "",
        strategy: "",
        userIds: "",
        portfolio_name: "",
        Option_Strategy: "",
      });
    }
  }, [ isOpen1 ]);
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
    handleClose1();
    resetPositionoq();
    forceUpdate(); // Call forceUpdate after state change
  };

  // Function to force re-render
  const forceUpdate = () => {
    setUpdateKey(prev => prev + 1);
  };



  const [ placeOrderOptionsQTPBtn, setplaceOrderOptionsQTPBtn ] = useState(false);
  // const getCurrentTime = () => {
  //   const now = new Date();
  //   const hours = now.getHours();
  //   const minutes = now.getMinutes();
  //   const seconds = now.getSeconds();
  //   return new Date(0, 0, 0, hours, minutes, seconds); // Date with only time information
  // };

  // rows.forEach((user) => {
  //   if (user.inputDisabled && user.broker === "pseudo account") {

  //     const margin = localStorage.getItem("marginRequired");
  //     // const portfolio = localStorage.getItem("storageKey");

  //console.log("Retrieved margin from localStorage:", margin, portfolio);

  //console.log(user.availableMargin, margin, "mar");
  //   }
  // });

  const placeOrderOptionsQTP = async () => {
    try {
      const currentTime = new Date();
      //// console.log("mahesh");

      // Retrieve market data once
      const marketData = JSON.parse(localStorage.getItem("marketIndexDetails"));

      optionsQTP.userIds.forEach(async (userId, index) => {
        const user = rows.find((user) => user.userId === userId);
        if (user && user.inputDisabled) {
          let apiEndpoints = [];
          const matchingPortfolio = portfolioDetails.find(
            (portfolio) =>
              portfolio.portfolio_name === optionsQTP.Option_Strategy,
          );

          if (matchingPortfolio) {
            //// console.log("mahesh");
            let startTime = matchingPortfolio.start_time || null;
            let endTime = matchingPortfolio.end_time || null;

            if (startTime === "00:00:00") {
              //// console.log("mahesh12");
              startTime = null;
            }
            if (endTime === "00:00:00") {
              //// console.log("mahesh123");
              endTime = null;
            }
            //// console.log("mahesh124");

            const currentTimeStr = currentTime.toLocaleTimeString("en-US", {
              hour12: false,
            });

            if (
              (startTime === null || currentTimeStr >= startTime) &&
              (endTime === null || currentTimeStr <= endTime)
            ) {
              let optionType = null;
              for (const leg of matchingPortfolio.legs) {
                if (leg.option_type === "FUT") {
                  optionType = "FUT";
                  break;
                }
              }
              //// console.log("mahesh", user.broker);

              if (user.broker === "fyers") {
                apiEndpoints =
                  optionType === "FUT"
                    ? [
                      `${import.meta.env.SERVER_HOST}/fyers_futures_place_order/fyers/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
                    ]
                    : [
                      `${import.meta.env.SERVER_HOST}/place_order/fyers/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
                    ];
              } else if (user.broker === "angelone") {
                apiEndpoints =
                  optionType === "FUT"
                    ? [
                      `${import.meta.env.SERVER_HOST}/angleone_future_place_order/angelone/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
                    ]
                    : [ `${import.meta.env.SERVER_HOST}/angelone_options_place_order/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}` ];
              } else if (user.broker === "flattrade") {
                apiEndpoints =
                  optionType === "FUT"
                    ? [
                      `${import.meta.env.SERVER_HOST}/flatrade_future_place_order/flattrade/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
                    ]
                    : [ `${import.meta.env.SERVER_HOST}/flatrade_place_order/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}` ];
              } else if (user.broker === "pseudo_account") {
                //// console.log("mahesh123");
                apiEndpoints = [
                  `${import.meta.env.SERVER_HOST}/pseudo_placeorder/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
                ];
              }

              for (const apiEndpoint of apiEndpoints) {
                try {
                  const requestBody = {
                    qtp_lots: optionsQTP.lots || 1,
                  };

                  if (user.broker === "pseudo_account") {
                    requestBody.underlying_price = marketData;
                  }

                  const res = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                  });
                  //// console.log(res, "res");
                  //// console.log("mahesh2");

                  if (res.ok) {
                    fetchAccountDetails();
                    fetchExecutedPortfolios();
                    handlePageClick();
                    const orderPlaceoptionsQTPRes = await res.json();
                    setplaceOrderOptionsQTPBtn(false);
                    close();

                    const legMsgs = orderPlaceoptionsQTPRes.messages;
                    for (const message of legMsgs) {
                      handleMsg({
                        msg: message.message,
                        logType: "TRADING",
                        timestamp: `${new Date().toLocaleString()}`,
                        user: user.userId,
                        strategy: matchingPortfolio.strategy,
                        portfolio: optionsQTP.Option_Strategy,
                      });
                    }
                  } else {
                    setplaceOrderOptionsQTPBtn(false);
                    close();
                    const orderPlaceoptionsQTPRes = await res.json();
                    handleMsg({
                      msg: orderPlaceoptionsQTPRes[ 0 ].message,
                      logType: "MESSAGE",
                      timestamp: `${new Date().toLocaleString()}`,
                      user: user.userId,
                      strategy: matchingPortfolio.strategy,
                      portfolio: optionsQTP.Option_Strategy,
                    });
                  }
                } catch (e) {
                  setplaceOrderOptionsQTPBtn(false);
                  close();
                  handleMsg({
                    msg: e.message,
                    logType: "ERROR",
                    timestamp: `${new Date().toLocaleString()}`,
                    user: user.userId,
                    strategy: matchingPortfolio.strategy,
                    portfolio: optionsQTP.Option_Strategy,
                  });
                }
              }
            } else {
              handleMsg({
                msg: `Order not placed for ${user.userId} as current time is outside the allowed time window (Start: ${startTime || "Not specified"}, End: ${endTime || "Not specified"}).`,
                logType: "INFO",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
                strategy: matchingPortfolio.strategy,
                portfolio: optionsQTP.Option_Strategy,
              });
              setplaceOrderOptionsQTPBtn(false);
              close();
            }
          }
        } else {
          handleMsg({
            msg: `Login the ${user.userId}, to place an order in this account.`,
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
            user: user.userId,
            strategy: portfolioDetails.find(
              (row) => row.portfolio_name === optionsQTP.Option_Strategy,
            ).strategy,
            portfolio: optionsQTP.Option_Strategy,
          });
          if (
            optionsQTP.userIds.length === 1 ||
            index === optionsQTP.userIds.length - 1
          ) {
            setplaceOrderOptionsQTPBtn(false);
            close();
          }
        }
      });
    } catch (error) {
      //// console.log(error.message);
    }
  };

  const { strategies } = useSelector((state) => state.strategyReducer);

  return (
    <div style={{ zIndex: "1000" }}>
      <Draggable
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }} // Set default position
        position={positionOq} // Set position from state
        onDrag={handleDragoq}
      >
        <div // Options Quick Trade Panel
          isOpen={isOpen1}
          onRequestClose={close}
          key={updateKey}
          className="your-modal-button"
          style={{
            display: isOpen1 ? "block" : "none",
            top: "25%",
            left: "25%",
            // overlay: {
            //   backgroundColor: "rgba(0, 0, 0, 0.5)",
            //   zIndex: 1000,
            // },
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
          <div className="container1 handle">
            <div
              className="title"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <h2
                style={{
                  marginLeft: "-329px",
                  marginTop: "5px",
                  color: "#4661bd",
                  fontFamily: "Roboto",
                  fontSize: "24px",
                }}
              >
                Options Quick Trade Panel
              </h2>
              <div style={{ marginLeft: "43px" }}></div>
              <img src={pencil} style={{ padding: "5px" }} alt="" />
              <img
                src={colopen1 ? minus : plus}
                style={{ cursor: "pointer", padding: "8px" }}
                onClick={toggleOpen1}
                id="colopen1"
                alt=""
              />
              <img src={push} style={{ padding: "5px" }} alt="" />
              <img
                src={shape}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={close}
                alt=""
              />
            </div>
            <div className="content">
              <form>
                <div className="user-details">
                  <div className="MCX">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.exchange !== "" ? optionsQTP.exchange : null
                      }
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
                      <option style={{ color: "black" }}>BFO</option>
                      <option style={{ color: "black" }}>NFO</option>
                      <option style={{ color: "black" }}>MCX</option>
                    </select>
                  </div>
                  <div className="EFS">
                    <input
                      value={
                        optionsQTP.stock_symbol !== ""
                          ? optionsQTP.stock_symbol
                          : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          stock_symbol: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder="Enter Future Stock"
                    />
                  </div>
                  <div className="OS">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.Option_Strategy !== ""
                          ? optionsQTP.Option_Strategy
                          : null
                      }
                      onChange={(e) => {
                        const portfolio = portfolioDetails.filter(
                          (portfolio) =>
                            portfolio.portfolio_name === e.target.value,
                        );

                        const mappedbrokerIds =
                          portfolio[ 0 ][ "Strategy_accounts_id" ].split(",");

                        const loggedInbrokers = rows.filter((row) => {
                          if (
                            row.inputDisabled &&
                            mappedbrokerIds.includes(row.userId)
                          ) {
                            return row;
                          }
                        });
                        const loggedInbrokerIds = loggedInbrokers.map(
                          (row) => row.userId,
                        );
                        const loggedOutbrokers = rows.filter((row) => {
                          if (
                            !row.inputDisabled &&
                            mappedbrokerIds.includes(row.userId)
                          ) {
                            return row;
                          }
                        });
                        const loggedOutbrokerIds = loggedOutbrokers.map(
                          (row) => row.userId,
                        );
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: [
                            ...loggedOutbrokerIds,
                            ...loggedInbrokerIds,
                          ],
                          exchange: portfolio[ 0 ].exchange,
                          stock_symbol: portfolio[ 0 ].stock_symbol,
                          lots: Number(portfolio[ 0 ].lots),
                          variety: portfolio[ 0 ].variety,
                          strategy: portfolio[ 0 ].strategy,
                          Option_Strategy: e.target.value,
                        }));
                      }}
                    >
                      <option selected disabled>
                        Portfolio
                      </option>
                      {portfolioDetails
                        .filter(
                          (port) =>
                            !executedPortfolios
                              .map((execPort) => execPort.portfolio_name)
                              .includes(port.portfolio_name),
                        )
                        .filter(
                          (portfolioItem) => portfolioItem.enabled === true,
                        )
                        .filter((portfolioItem) => {
                          const linkedStrategy = strategies.find(
                            (strategy) =>
                              strategy.StrategyLabel === portfolioItem.strategy,
                          );
                          return linkedStrategy && linkedStrategy.enabled;
                        })
                        .map((portfolioItem, index) => (
                          <option key={index} style={{ color: "black" }}>
                            {portfolioItem.portfolio_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="Lots">
                    <span
                      className="label"
                      style={{ fontFamily: "Roboto", fontSize: "19px" }}
                    >
                      {" "}
                      Lots{" "}
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      placeholder="1"
                      value={optionsQTP.lots}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        setOptionsQTP((prev) => ({
                          ...prev,
                          lots: inputValue === '' ? '' : Math.max(Number(inputValue), 1),
                        }));
                      }}
                    />
                  </div>
                  <div className="NRML">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.variety !== "" ? optionsQTP.variety : null
                      }
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
                      <option value="NORMAL" style={{ color: "black" }}>
                        NRML
                      </option>
                      <option value="MIS" style={{ color: "black" }}>
                        MIS
                      </option>
                    </select>
                  </div>
                  <div className="DEFAULT">
                    <select
                      value={
                        optionsQTP.strategy !== "" ? optionsQTP.strategy : null
                      }
                      onChange={(e) => {
                        const linkedList = portfolioDetails.filter(
                          (portfolio) => portfolio.strategy === e.target.value,
                        );
                        //// console.log("linkedList", linkedList)
                        const brokerIds =
                          linkedList[ 0 ][ "Strategy_accounts_id" ].split(",");
                        //// console.log("brokerIds ===", brokerIds);
                        setlinkedPortfolios(linkedList);
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: brokerIds,
                          strategy: e.target.value,
                        }));
                      }}
                      className="details"
                      style={{ color: "GrayText" }}
                    >
                      <option selected disabled>
                        Strategy
                      </option>
                      {strategies
                        .filter((row) => row.enabled) // Filter rows where Action.enabled is true
                        .map((row, index) => (
                          <option key={index} value={row.StrategyLabel}>
                            {row.StrategyLabel}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div
                  className="OP-details"
                  id="OP-details"
                  style={{
                    border: "1px solid #cacaca",
                    padding: "10px",
                    margin: "2px",
                    display: "none",
                  }}
                >
                  <span className="OP-title" style={{ padding: "10px" }}>
                    Optional Parameters
                  </span>
                  <div className="UD-bottom">
                    <div class="input-box">
                      <span className="details">Entry Price</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Combt Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Comb SL</span>
                      <input type="text" />
                    </div>
                  </div>

                  <div
                    className="UD"
                    style={{ display: "flex", margin: "5px" }}
                  >
                    <div class="input-box">
                      <span className="details">Leg Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box" style={{ marginLeft: "0px" }}>
                      <span className="details">Leg SL</span>
                      <input type="text" />
                    </div>
                    <div className="checkbox1">
                      {/* Checkbox with content */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10px",
                          marginTop: "17px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="legSlCheckbox"
                          style={{ opacity: "1", accentColor: "green" }}
                        />
                        <label
                          htmlFor="legSlCheckbox"
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            border: "2px solid green",
                            marginLeft: "-20.8px",
                            height: "20.3px",
                            width: "23.9px",
                          }}
                        ></label>
                        {/* Additional content */}
                        <span
                          style={{
                            marginLeft: "9px",
                            display: "inline-block",
                            fontFamily: "Roboto",
                          }}
                        >
                          Move SL To Cost
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box2">
                  <select
                    className="detail"
                    style={{ color: "GrayText" }}
                    onChange={(e) => {
                      // Handle portfolio selection here if needed
                      setOptionsQTP((prev) => ({
                        ...prev,
                        portfolio_name: e.target.value,
                      }));
                    }}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      style={{ fontFamily: "Roboto" }}
                    >
                      Executed Portfolios
                    </option>
                    {
                      //console.log("executedPortfolios 098", executedPortfolios)
                    }
                    {executedPortfolios.map((portfolio, index) => (
                      <option key={index} value={portfolio}>
                        {portfolio.portfolio_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="box2">
                      <select
                        value={
                          optionsQTP.portfolio_name !== ""
                            ? optionsQTP.portfolio_name
                            : null
                        }
                        onChange={(e) => {
                          const portfolio = portfolioDetails.filter(
                            (portfolio) =>
                              portfolio.portfolio_name === e.target.value,
                          );
                          setOptionsQTP((prev) => ({
                            ...prev,
                            exchange: portfolio[ 0 ].exchange,
                            stock_symbol: portfolio[ 0 ].stock_symbol,
                            lots: Number(portfolio[ 0 ].lots),
                            variety: portfolio[ 0 ].variety,
                            strategy: portfolio[ 0 ].strategy,
                            portfolio_name: e.target.value,
                          }));
                        }}
                        className="detail"
                        style={{ color: "GrayText" }}
                      >
                        <option
                          value="option1"
                          disabled
                          selected
                          style={{ fontFamily: "Roboto" }}
                        >
                          Executed Portfolios
                        </option>
                        {linkedPortfolios.map((linkedPortfolio, index) => (
                          <option
                            key={index}
                            value={linkedPortfolio.portfolio_name}
                            style={{ color: "black" }}
                          >
                          </option>
                        ))}
                      </select>
                    </div> */}

                <div className="user-details-start">
                  <div class="input-box">
                    {!placeOrderOptionsQTPBtn ? (
                      <button
                        disabled={optionsQTP.Option_Strategy === ""}
                        type="button"
                        onClick={() => {
                          if (placeOrderStart) {
                            setplaceOrderOptionsQTPBtn(true);
                            placeOrderOptionsQTP();
                          } else {
                            setIsOpen1(false);
                            handleMsg({
                              msg: "To place an Order, Start the Trading.",
                              logType: "WARNING",
                              timestamp: `${new Date().toLocaleString()}`,
                            });
                          }
                        }}
                        style={
                          optionsQTP.Option_Strategy !== ""
                            ? { background: "#85e657" }
                            : {
                              background: "#ccc",
                              color: "#666",
                              cursor: "not-allowed",
                            }
                        }
                      >
                        ENTRY
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{ background: "#618F00", cursor: "default" }}
                      >
                        <Oval
                          className
                          height="20"
                          width="255"
                          color="white"
                          strokeWidth={3}
                        />
                      </button>
                    )}
                  </div>
                  <div class="input-box">
                    <button
                      type="button"
                      text="exit"
                      style={{ background: "#ff0000" }}
                      onClick={close}
                    >
                      EXIT
                    </button>
                  </div>
                  <div className="UD-button">
                    <p
                      style={{
                        color: "blue",
                        fontSize: "18px",
                        padding: "2px",
                        display: "none",
                        fontFamily: "roboto",
                      }}
                      className="SL1"
                    >
                      Target, SL in Points. For Percentage, Tick Value in %
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};
