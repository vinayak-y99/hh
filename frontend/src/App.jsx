import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
// import Register from './views/Register';
// import Login from './views/Login';
import UserProfiles from "./views/UserProfiles";
import Strategies from "./views/Strategies";
import Equity from "./views/Equity";
import Portfolio from "./views/F&O/Portfolio";
import AddPortfolio from "./views/F&O/AddPortfolio";
import OrderFlow from "./views/OrderFlow";
import OrderManagement from "./views/OrderManagement";
import Positions from "./views/Positions";
import Holdings from "./views/Holdings";
import ProtectedRoute from "./components/ProtectedRoute";
// import Positions from './views/Positions';
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import Dashboard from "./components/Dashboard.jsx";
import { useDispatch, useSelector } from "react-redux";
import broker, { setBrokers } from "./store/slices/broker.js";
import { setAuth } from "./store/slices/auth.js";
import { setStrategies } from "./store/slices/strategy.jsx";
import { setPortfolios } from "./store/slices/portfolio.jsx";
import { setExpiries } from "./store/slices/expiries.js";
import { setConsoleMsgs } from "./store/slices/consoleMsg.js";
import { setOrders } from "./store/slices/orderBook.jsx";
import { setPositions } from "./store/slices/position.jsx";
import { setHoldings } from "./store/slices/holding.js";
import Change_Password from "./components/Change_Password.jsx";
import { useNavigate, useLocation } from "react-router-dom";


import Option_Chain from "./components/Option_Chain.jsx";
import Subscription from "./components/Subscription.jsx";
import ImagePreloader from "./components/preloadImages.jsx";
import SecurityCode from "./components/SecurityCode.jsx";
import New_Password from "./components/New_Password.jsx";
import PasswordRecovery from "./components/PasswordRecovery.jsx";
import Master_child from "./views/Master_child.jsx";
import Master_accounts from "./views/Master_accounts.jsx";

import executedPortfolios, {
  setexecutedPortfolios,
} from "./store/slices/executedPortfolios.js";
import { setmasterChildAccounts } from "./store/slices/master_child.js";

import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
  const { pathname } = useLocation();

  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const expiryState = useSelector((state) => state.expiryReducer);
  const mainUser = cookies.get("USERNAME");
  const navigate = useNavigate();


  const [isSubscribed, setIsSubscribed] = useState(null);

  useEffect(() => {

    const status = cookies.get('subscription_type');
    if (status) {
      setIsSubscribed(status);
    } else {
      setIsSubscribed(null);
    }
  }, [mainUser]);

  const [marketData, setMarketData] = useState({
    sensex: {},
    nifty50: {},
    niftybank: {},
    finnifty: {},
  });

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
      //// console.log("ExecutedPortfolios===", ExecutedPortfolios.filter(execPort => execPort.portfolio_name === portfolio.portfolio_name)[0]["square_off"])
      dispatch(
        setexecutedPortfolios({
          executedPortfolios: ExecutedPortfolios,
        }),
      );
    } catch (error) {
      console.error("Error fetching executed portfolios:", error.message);
      console.log("error came Check")
      console.log("error")

    }
  };
  const fetchMasterAccounts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/fetch_master_child_accounts/${mainUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      //// console.log(response, "response");

      if (!response.ok) {
        throw new Error("Failed to fetch executed portfolios");
      } else {
        const MasterChildAccounts = await response.json();
        //// console.log("mahesh ", MasterChildAccounts, response)
        dispatch(
          setmasterChildAccounts({
            masterChildAccounts: MasterChildAccounts,
          }),
        );
      }
    } catch (error) {
      console.error(`Error occurred while calling  API:`, error.message);
    }
  };

  useEffect(() => {
    if (mainUser !== undefined && mainUser !== "") {
      dispatch(
        setAuth({
          isAuthenticated: true,
        }),
      );
      const fetchAccountDetails = async () => {
        try {
          const username = cookies.get("USERNAME");
          //// console.log(username);
          // post request
          const response = await fetch(
            `${import.meta.env.SERVER_HOST}/get_user_data/${username}`,

            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const responseData = await response.json();
          // console.log("------------ responseData", responseData);
          const newFilledData = responseData.broker_credentials.map((data) => {
            return {
              enabled: true,
              mtmAll: "0",
              net: "0",
              availableMargin: "0.00",
              name: data.display_name,
              userId: data.broker_user_id || "",
              fyersclientId: data.client_id || "",
              broker: data.broker || "",
              secretKey: data.secret_key || "",
              apiKey: data.api_key || "",
              qrCode: data.qr_code || "",
              maxProfit: data.max_profit,
              maxLoss: data.max_loss,
              profitLocking: data.profit_locking
                ? data.profit_locking.split(",").join("~")
                : "~~~",
              reached_profit: data.reached_profit,
              locked_min_profit: data.locked_min_profit,
              qtyByExposure: "0",
              maxLossPerTrade: data.max_loss_per_trade,
              qtyMultiplier: data.user_multiplier, //Decimal
              mobile: "",
              email: "",
              apiUserDetails: "",
              password: data.password,
              autoLogin: true,
              historicalApi: false,
              inputDisabled: false,
              showPopup: false,
              utilized_Margin: data.utilized_margin,
              maxOpenTrades: data.max_open_trades,
              sqOffTime: data.exit_time,
            };
          });

          dispatch(
            setBrokers({
              brokers: newFilledData,
            }),
          );
          // updating row state
          // setRows(dummyAndFilledData);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchAccountDetails();


      const fetchStrategy = async (username) => {
        try {
          const response = await fetch(
            `${import.meta.env.SERVER_HOST}/retrieve_strategy_info/${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const responseData = await response.json();
          // console.log(responseData, "responseData");

          const resetRowsData = responseData.strategies.map((item) => {
            const multipliers = item.broker_user_id
              .map((id) => item.multiplier[id] || "1")
              .join(", ");

            return {
              enabled: true,
              logged: false,
              ManualSquareOff: "",
              StrategyLabel: item.strategy_tag,
              PL: "0",
              TradeSize: "0",
              DuplicateSignalPrevention: "0",
              OpenTime: item.open_time || "00:00:00",
              CloseTime: item.close_time || "00:00:00",
              SqOffTime: item.square_off_time || "00:00:00",
              TradingAccount: item.broker_user_id.join(", "),
              Multiplier: multipliers,
              MaxProfit: item.max_profit || "0",
              MaxLoss: item.max_loss || "0",
              MaxLossWaitTime: "00:00:00",
              ProfitLocking: item.profit_locking
                ? item.profit_locking.split(",").join("~")
                : "~~~",
              reached_profit: item.reached_profit || "0",
              locked_min_profit: item.locked_min_profit || "0",
              DelayBetweenUsers: "0",
              UniqueIDReqforOrder: "",
              CancelPreviousOpenSignal: "",
              StopReverse: "",
              PartMultiExists: "",
              HoldSellSeconds: "00",
              AllowedTrades: item.allowed_trades,
              EntryOrderRetry: item.entry_order_retry,
              EntryRetryCount: item.entry_retry_count,
              EntryRetryWaitSeconds: item.entry_retry_wait,
              ExitOrderRetry: item.exit_order_retry,
              ExitRetryCount: item.exit_retry_count,
              ExitRetryWaitSeconds: item.exit_retry_wait,
              ExitMaxWaitSeconds: item.exit_max_wait,
              SqOffDone: "",
              Delta: "0",
              Theta: "0",
              Vega: "0",
            };
          });
          // console.log(resetRowsData, "strategies")

          if (resetRowsData.length > 0) {
            dispatch(
              setStrategies({
                strategies: resetRowsData,
              }),
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // Display a user-friendly message or perform a fallback action here.
        }
      };

      fetchStrategy(mainUser);

      fetchExecutedPortfolios();
      fetchMasterAccounts();

      const fetchPortfolios = async () => {
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
          let extractedPortfolio = responseData["Portfolio details"];
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
          // console.log("portfolio_timings useff", portfolio_timings)
          //// console.log("extractedPortfolio useff", extractedPortfolio)
          dispatch(async (dispatch, getState) => {
            // const portfolios = getState().portfolioReducer.portfolios;
            const executedPortfolios =
              getState().executedPortfolioReducer.executedPortfolios;
            let portfolios = [];
            //// console.log(executedPortfolios, "executedPortfolios")

            const execPortNames = executedPortfolios.map(
              (port) => port.portfolio_name,
            );

            //// console.log("execPortNames", execPortNames)

            for (let i = 0; i < extractedPortfolio.length; i++) {
              const port = extractedPortfolio[i];
              //// console.log(port, "port")

              if (execPortNames.includes(port.portfolio_name)) {
                let clickedPortBrokerDetails =
                  portfolio_timings[port.portfolio_name];
                //// console.log("clickedPortBrokerDetails", clickedPortBrokerDetails)
                let prevbrokerDetails = [];
                for (let brokerId in clickedPortBrokerDetails) {
                  let brokerData = clickedPortBrokerDetails[brokerId];
                  prevbrokerDetails.push({
                    [brokerId]: {
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

            // console.log("portfolios changed", portfolios)

            dispatch(
              setPortfolios({
                portfolios: portfolios,
              }),
            );
          });
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchPortfolios();

      let expiries = {
        NIFTY: [],
        FINNIFTY: [],
        BANKNIFTY: [],
      };

      let futexpiries = {
        NIFTY: [],
        FINNIFTY: [],
        BANKNIFTY: [],
      };

      const fetchExpiries = async (symbols) => {
        try {
          const body = {
            symbols: symbols,
          };
          console.log("calling fetchexpiries ");
          const responseExpiries = await fetch(
            `${import.meta.env.SERVER_HOST}/get_expiry_list_blueprint/${mainUser}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            },
          );

          if (!responseExpiries.ok) {
            const errorData = await responseExpiries.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const { BANKNIFTY, FINNIFTY, NIFTY } = await responseExpiries.json();
          //// console.log("responseData", "=", BANKNIFTY, FINNIFTY, NIFTY);

          expiries["NIFTY"] = NIFTY;
          expiries["FINNIFTY"] = FINNIFTY;
          expiries["BANKNIFTY"] = BANKNIFTY;
          //// console.log("expiries obj", expiries);

          dispatch(
            setExpiries({
              NIFTY: expiries["NIFTY"].map(date => date.toUpperCase()),
              BANKNIFTY: expiries["BANKNIFTY"].map(date => date.toUpperCase()),
              FINNIFTY: expiries["FINNIFTY"].map(date => date.toUpperCase()),
              // FUTNIFTY: futexpiries["NIFTY"],
              // FUTBANKNIFTY: futexpiries["BANKNIFTY"],
              // FUTFINNIFTY: futexpiries["FINNIFTY"],
            }),
          );

          // for futures
          const futbody = {
            symbols: symbols,
            FUT: "FUTIDX",
            exch_seg: "NFO",
          };
          const futresponseExpiries = await fetch(
            `${import.meta.env.SERVER_HOST}/get_future_expiry_list_blueprint/${mainUser}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(futbody),
            },
          );

          if (!futresponseExpiries.ok) {
            const errorData = await futresponseExpiries.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const FutExpirylist = await futresponseExpiries.json();

          futexpiries["NIFTY"] = FutExpirylist["NIFTY"];
          futexpiries["FINNIFTY"] = FutExpirylist["FINNIFTY"];
          futexpiries["BANKNIFTY"] = FutExpirylist["BANKNIFTY"];
          //// console.log("futexpiries obj", futexpiries);
          dispatch(
            setExpiries({
              NIFTY: expiries["NIFTY"].map(date => date.toUpperCase()),
              BANKNIFTY: expiries["BANKNIFTY"].map(date => date.toUpperCase()),
              FINNIFTY: expiries["FINNIFTY"].map(date => date.toUpperCase()),
              FUTNIFTY: futexpiries["NIFTY"].map(date => date.toUpperCase()),
              FUTBANKNIFTY: futexpiries["BANKNIFTY"].map(date => date.toUpperCase()),
              FUTFINNIFTY: futexpiries["FINNIFTY"].map(date => date.toUpperCase()),
            }),
          );
        } catch (error) {
          console.error("Error:", error);
        }
      };
      // const fetchFUTExpiries = async (symbol) => {

      // }
      // Object.keys(expiries).map((symbol) => {
      fetchExpiries(Object.keys(expiries));
      // });
    } else if (pathname.includes("Register")) {
      navigate("/Register");
    } else {
      navigate("/");
    }
  }, [mainUser]);

  useEffect(() => {
    let isFetching = false;

    const fetchMarketIndexDetails = async () => {
      if (isFetching) return;

      isFetching = true;

      try {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        const handleStoredData = () => {
          const storedData = JSON.parse(localStorage.getItem("marketIndexDetails"));
          if (storedData && storedData.nifty50?.c !== "") {
            setMarketData(storedData);
          } else {
            const defaultData = { c: "0", ch: "0", chp: "0" };
            setMarketData({
              sensex: defaultData,
              nifty50: defaultData,
              niftybank: defaultData,
              finnifty: defaultData,
            });
          }
        };

        // Check if the market is open
        if (
          (currentHours === 9 && currentMinutes >= 15) ||
          (currentHours > 9 && currentHours < 15) ||
          (currentHours === 15 && currentMinutes <= 40)
        ) {
          const response = await fetch(`${import.meta.env.SERVER_HOST}/get_live_feed`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Failed to fetch market index details");

          const responseData = await response.json();

          if (Object.keys(responseData).length !== 0) {
            const marketData = {
              sensex: {
                c: responseData["BSE:SENSEX-INDEX"].ltp.toFixed(2),
                ch: (responseData["BSE:SENSEX-INDEX"].ltp - responseData["BSE:SENSEX-INDEX"].prev_close_price).toFixed(2),
                chp: (((responseData["BSE:SENSEX-INDEX"].ltp - responseData["BSE:SENSEX-INDEX"].prev_close_price) / responseData["BSE:SENSEX-INDEX"].ltp) * 100).toFixed(2),
              },
              nifty50: {
                c: responseData["NSE:NIFTY50-INDEX"].ltp.toFixed(2),
                ch: (responseData["NSE:NIFTY50-INDEX"].ltp - responseData["NSE:NIFTY50-INDEX"].prev_close_price).toFixed(2),
                chp: (((responseData["NSE:NIFTY50-INDEX"].ltp - responseData["NSE:NIFTY50-INDEX"].prev_close_price) / responseData["NSE:NIFTY50-INDEX"].ltp) * 100).toFixed(2),
              },
              niftybank: {
                c: responseData["NSE:NIFTYBANK-INDEX"].ltp.toFixed(2),
                ch: (responseData["NSE:NIFTYBANK-INDEX"].ltp - responseData["NSE:NIFTYBANK-INDEX"].prev_close_price).toFixed(2),
                chp: (((responseData["NSE:NIFTYBANK-INDEX"].ltp - responseData["NSE:NIFTYBANK-INDEX"].prev_close_price) / responseData["NSE:NIFTYBANK-INDEX"].ltp) * 100).toFixed(2),
              },
              finnifty: {
                c: responseData["NSE:FINNIFTY-INDEX"].ltp.toFixed(2),
                ch: (responseData["NSE:FINNIFTY-INDEX"].ltp - responseData["NSE:FINNIFTY-INDEX"].prev_close_price).toFixed(2),
                chp: (((responseData["NSE:FINNIFTY-INDEX"].ltp - responseData["NSE:FINNIFTY-INDEX"].prev_close_price) / responseData["NSE:FINNIFTY-INDEX"].ltp) * 100).toFixed(2),
              },
            };

            setMarketData(marketData);
            localStorage.setItem("marketIndexDetails", JSON.stringify(marketData));
          } else {
            handleStoredData();
          }
        } else {
          handleStoredData();
        }
      } catch (error) {
        handleStoredData();
      } finally {
        isFetching = false;
      }
    };

    fetchMarketIndexDetails();
    if (mainUser) {
      const intervalId = setInterval(fetchMarketIndexDetails, 1000);
      return () => clearInterval(intervalId);
    }


  }, [mainUser]);

  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  const handleMsg = (Msg) => {
    dispatch((dispatch, getState) => {
      const previousConsoleMsgs = getState().consoleMsgsReducer.consoleMsgs;

      const lastMsg = previousConsoleMsgs[0];
      if (
        lastMsg &&
        lastMsg.msg === Msg.msg &&
        lastMsg.user === Msg.user &&
        lastMsg.strategy === Msg.startegy &&
        lastMsg.portfolio === Msg.porttfolio
      ) {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [Msg, ...previousConsoleMsgs.slice(1)],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [Msg, ...previousConsoleMsgs],
          }),
        );
      }
    });
  };

  const [Broker, setBroker] = useState({
    angelone: [],
    fyers: [],
    flattrade: [],
    pseudo_account: []
  });

  const loggInStatus = useMemo(
    () => rows.map((row) => row.inputDisabled),
    [rows],
  );

  useEffect(() => {
    //// console.log("loggedi in userchane", rows.map(row => row.inputDisabled))
    const loggedInRows = rows.filter((row) => row.inputDisabled);

    let updatedBroker = {
      angelone: [],
      fyers: [],
      flattrade: [],
      pseudo_account: [],
    };

    loggedInRows.forEach((row) => {
      if (row.broker === "angelone") {
        updatedBroker.angelone.push(row.userId);
      } else if (row.broker === "fyers") {
        updatedBroker.fyers.push(row.userId);
      } else if (row.broker === "flattrade") {
        updatedBroker.flattrade.push(row.userId);
      } else if (row.broker === "pseudo_account") {
        updatedBroker.pseudo_account.push(row.userId);
      }
    });

    setBroker((prev) => {
      if (
        prev.angelone !== updatedBroker.angelone ||
        prev.fyers !== updatedBroker.fyers ||
        prev.flattrade !== updatedBroker.flattrade ||
        prev.pseudo_account !== updatedBroker.pseudo_account
      ) {
        return updatedBroker;
      } else {
        return prev;
      }
    });
  }, [loggInStatus]);


  // const [tokensPseudo, setTokensPseudo] = useState([]);

  const handleManualSquareOffUserPL = async (rowData) => {
    try {
      const mappedUserIds = rows.filter((row) => row.inputDisabled);
      if (mappedUserIds.length === 0) {
        handleMsg({
          msg: "Please log in at least one broker account",
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
      }
      // const rowData = mappedUserIds[ index ];
      if (rowData.inputDisabled) {
        let endpoint = "";
        let endpoint2 = "";
        if (rowData.broker === "angelone") {
          endpoint = `${import.meta.env.SERVER_HOST}/angelone_user_equity_sqoff/${mainUser}/${rowData.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/angelone_user_options_sqoff/${mainUser}/${rowData.userId}`;
          await callEndpoint(endpoint, rowData);
          await callEndpoint(endpoint2, rowData);
        } else if (rowData.broker === "fyers") {
          endpoint = `${import.meta.env.SERVER_HOST}/fyers_user_equity_sqoff/${mainUser}/${rowData.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/fyers_user_options_sqoff/${mainUser}/${rowData.userId}`;
          await callEndpoint(endpoint, rowData);
          await callEndpoint(endpoint2, rowData);
        } else if (rowData.broker === "flattrade") {
          endpoint = `${import.meta.env.SERVER_HOST}/flattrade_user_equity_sqoff/${mainUser}/${rowData.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/flattrade_user_options_sqoff/${mainUser}/${rowData.userId}`;
          await callEndpoint(endpoint, rowData);
          await callEndpoint(endpoint2, rowData);
        } else if (rowData.broker === "pseudo_account") {
          endpoint = `${import.meta.env.SERVER_HOST}/pseudo_user_options_sqoff/${mainUser}/${rowData.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/pseudo_user_equity_sqoff/${mainUser}/${rowData.userId}`
          await callEndpoint(endpoint, rowData);
          await callEndpoint(endpoint2, rowData);
        }
      }

      // setShowModal(false);
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };
  const squareOffTrade = async (row, tradingSymbol, isEquityTrade) => {
    const username = cookies.get("USERNAME");

    const endpoint = isEquityTrade
      ? `${import.meta.env.SERVER_HOST}/square_off_equity_maxloss_per_trade/${username}/${tradingSymbol}/${row.broker}/${row.userId}`
      : `${import.meta.env.SERVER_HOST}/square_off_maxloss_per_trade/${username}/${tradingSymbol}/${row.broker}/${row.userId}`;

    const requestBody = isEquityTrade
      ? {
        trading_symbol: tradingSymbol,
        broker_user_id: row.userId,
        broker_type: row.broker,
      }
      : {};  // Send an empty body for non-equity trades

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message;
        handleMsg({
          msg: message,
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          user: row.userId,
        });
      } else {
        const responseData = await response.json();
        const message = responseData.message;
        handleMsg({
          msg: message,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          user: row.userId,
        });
      }
    } catch (error) {
      console.error('Error making square-off request:', error);
    }
  };



  const callEndpoint = async (endpoint, rowData, endpointType) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message;
        handleMsg({
          msg: message,
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      } else {
        const responseData = await response.json();
        const message = responseData.message;
        handleMsg({
          msg: message,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      }
    } catch (error) {
      console.error(
        `Error occurred while calling ${endpointType} API:`,
        error.message,
      );
    }
  };

  // const handleManualSquareOffStrategyPL = async (
  //   strategyLabel,
  //   TradingAccount,
  // ) => {
  //   try {
  //     const mappedUserIds = TradingAccount.split(", ");
  //     const requests = [];


  //     for (let index = 0; index < mappedUserIds.length; index++) {
  //       const rowData = rows.find((row) => row.userId === mappedUserIds[index]);

  //       if (rowData) {
  //         if (rowData.broker === "fyers") {
  //           requests.push(handleFyers(rowData, strategyLabel));
  //         } else if (rowData.broker === "flattrade") {
  //           requests.push(handleFlattrade(rowData, strategyLabel));
  //         } else if (rowData.broker === "angelone") {
  //           requests.push(handleAngelone(rowData, strategyLabel));
  //         } else if (rowData.broker === "pseudo_account") {
  //           requests.push(handlePseudo(rowData, strategyLabel));
  //         }
  //       }
  //     }
  //     await Promise.all(requests);
  //   } catch (error) {
  //     console.error("Error occurred:", error.message);
  //   }
  // };

  // const handleFyers = async (rowData, strategyLabel) => {
  //   const response = await fetch(
  //     `${import.meta.env.SERVER_HOST}/fyers_strategy_options_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData = await response.json();
  //     handleMsg({
  //       msg: responseData.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }
  //   const response2 = await fetch(
  //     `${import.meta.env.SERVER_HOST}/fyers_strategy_equity_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   if (!response2.ok) {
  //     const errorData = await response2.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData2 = await response2.json();
  //     handleMsg({
  //       msg: responseData2.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }
  // };

  // const handleFlattrade = async (rowData, strategyLabel) => {
  //   const response = await fetch(
  //     `${import.meta.env.SERVER_HOST}/flattrade_strategy_options_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log1", response);

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData = await response.json();
  //     handleMsg({
  //       msg: responseData.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }

  //   const response2 = await fetch(
  //     `${import.meta.env.SERVER_HOST}/flattrade_strategy_equity_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log2", response2);

  //   if (!response2.ok) {
  //     const errorData = await response2.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData2 = await response2.json();
  //     handleMsg({
  //       msg: responseData2.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }
  // };

  // const handleAngelone = async (rowData, strategyLabel) => {
  //   const response = await fetch(
  //     `${import.meta.env.SERVER_HOST}/angelone_strategy_options_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log1", response);

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData = await response.json();
  //     handleMsg({
  //       msg: responseData.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }

  //   const response2 = await fetch(
  //     `${import.meta.env.SERVER_HOST}/angelone_strategy_equity_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log2", response2);
  //   if (!response2.ok) {
  //     const errorData = await response2.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData2 = await response2.json();
  //     handleMsg({
  //       msg: responseData2.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }
  // };
  // const handlePseudo = async (rowData, strategyLabel) => {
  //   const response = await fetch(
  //     `${import.meta.env.SERVER_HOST}/pseudo_strategy_options_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log1", response);

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData = await response.json();
  //     handleMsg({
  //       msg: responseData.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }

  //   const response2 = await fetch(
  //     `${import.meta.env.SERVER_HOST}/pseudo_strategy_equity_sqoff/pseudo/${mainUser}/${strategyLabel}/${rowData.userId}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   //// console.log("log2", response2);
  //   if (!response2.ok) {
  //     const errorData = await response2.json();
  //     handleMsg({
  //       msg: errorData.message,
  //       logType: "ERROR",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   } else {
  //     const responseData2 = await response2.json();
  //     handleMsg({
  //       msg: responseData2.message,
  //       logType: "TRADING",
  //       timestamp: `${new Date().toLocaleString()}`,
  //       user: rowData.userId,
  //       strategy: strategyLabel,
  //     });
  //   }
  // };

  // Set to keep track of strategies that have already been processed
  const processedStrategiesSqoff = new Set();


  const handleManualSquareOffStrategyPL = async (strategyLabel, TradingAccount) => {
    try {
      // If the strategy is already processed, skip the API calls
      if (processedStrategiesSqoff.has(strategyLabel)) {
        console.log(`Strategy "${strategyLabel}" has already been processed.`);
        return;
      }

      const mappedUserIds = TradingAccount.split(", ");
      const requests = mappedUserIds.map((userId) => {
        const rowData = rows.find((row) => row.userId === userId);

        if (rowData) {
          return handleBrokerSquareOff(rowData, strategyLabel);
        }
      }).filter(Boolean); // Filter out any undefined values

      await Promise.all(requests);

      // After all requests are completed, mark the strategy as processed
      processedStrategiesSqoff.add(strategyLabel);

    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  // Generic function to handle different brokers
  const handleBrokerSquareOff = async (rowData, strategyLabel) => {
    const brokerEndpoints = {
      fyers: ["fyers_strategy_options_sqoff", "fyers_strategy_equity_sqoff"],
      flattrade: ["flattrade_strategy_options_sqoff", "flattrade_strategy_equity_sqoff"],
      angelone: ["angelone_strategy_options_sqoff", "angelone_strategy_equity_sqoff"],
      pseudo_account: ["pseudo_strategy_options_sqoff", "pseudo_strategy_equity_sqoff"]
    };

    const brokerApi = brokerEndpoints[rowData.broker];

    if (!brokerApi) {
      console.warn(`No API found for broker: ${rowData.broker}`);
      return;
    }

    // Make both API requests in parallel
    await Promise.all(brokerApi.map(endpoint => executeSquareOff(rowData, strategyLabel, endpoint)));
  };

  // Helper function to handle the API request
  const executeSquareOff = async (rowData, strategyLabel, endpoint) => {
    const url = `${import.meta.env.SERVER_HOST}/${endpoint}/${mainUser}/${strategyLabel}/${rowData.userId}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const logType = response.ok ? "TRADING" : "ERROR";

      handleMsg({
        msg: responseData.message,
        logType: logType,
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId,
        strategy: strategyLabel,
      });

    } catch (error) {
      console.error("Error in API call:", error.message);
    }
  };


  const handleLegSquareOff = async (
    portfolio_name,
    broker_type,
    broker_user_id,
    portfolio_leg_id,
    strategy_tag,
  ) => {
    const response = await fetch(
      `${import.meta.env.SERVER_HOST}/square_off_portfolio_leg_level/${mainUser}/${portfolio_name}/${broker_type}/${broker_user_id}/${portfolio_leg_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    //// console.log("log1", response);

    if (!response.ok) {
      const errorData = await response.json();
      handleMsg({
        msg: errorData.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: broker_user_id,
        strategy: strategy_tag,
        portfolio: portfolio_name,
      });
    } else {
      const responseData = await response.json();
      handleMsg({
        msg: responseData.message,
        logType: "TRADING",
        timestamp: `${new Date().toLocaleString()}`,
        user: broker_user_id,
        strategy: strategy_tag,
        portfolio: portfolio_name,
      });
    }
  };

  const [tokens, setTokens] = useState([]);
  const [previousTokens, setPreviousTokens] = useState([]);
  const [previousTokensPseudo, setPreviousTokensPseudo] = useState([]);
  const [tokensfyers, setTokensfyers] = useState([]);

  useEffect(() => {
    console.log("previousTokensPseudo updated:", previousTokensPseudo);
  }, [previousTokensPseudo]);



  const fetchOrderData = async () => {
    let allOrders = [];
    let allPositions = [];
    let allHoldings = [];
    //// console.log("order book input ", Broker)
    const response = await fetch(`${import.meta.env.SERVER_HOST}/order_book/${mainUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...Broker }),
    });
    const responseData = await response.json();
    // console.log("api", responseData);

    if (!response.ok) {
      handleMsg({
        msg: responseData.Message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: "Order Book",
      });
      return;
    }

    dispatch(async (dispatch, getState) => {
      const orders = getState().orderBookReducer.orders;
      const positions = getState().positionReducer.positions;
      const holdings = getState().holdingReducer.holdings;
      const strategies = getState().strategyReducer.strategies;
      const portfolios = getState().portfolioReducer.portfolios;
      const executedPortfolios =
        getState().executedPortfolioReducer.executedPortfolios;

      if (responseData.angelone && responseData.angelone.length > 0) {
        for (let index = 0; index < responseData.angelone.length; index++) {
          const keys = Object.keys(responseData.angelone[index]);
          const clientId = keys.length > 0 ? keys[0] : null;
          const allOrderDetails = clientId
            ? responseData.angelone[index][clientId].orderbook?.data
            : undefined;
          //// console.log("allOrderDetails", clientId, "=", allOrderDetails);

          if (allOrderDetails && allOrderDetails.length > 0) {
            const angeloneOB = allOrderDetails.map((order) => ({
              "Client ID": clientId,
              "Stock Symbol": order.tradingsymbol,
              Exchange: order.exchange,
              "Order Time": order.updatetime,
              "Execution Quantity": order.quantity,
              "Trade Type": order.transactiontype,
              Price: order.averageprice,
              "Trade ID": order.orderid,
              Instrument: order.instrumenttype,
              "Trade Status": order.status,
              "Avg Price": order.averageprice,
              StrategyLabel: order.ordertag,
              Label: order.ordertag,
            }));

            // Find existing orders for the client
            const existingOrders = orders.filter(order => order["Client ID"] === clientId);

            // Check if the length is different or if the orders have changed
            const hasNewData = existingOrders.length !== angeloneOB.length ||
              angeloneOB.some((newOrder, index) => {
                const existingOrder = existingOrders[index];
                return (
                  existingOrder["Stock Symbol"] !== newOrder["Stock Symbol"] ||
                  existingOrder["Execution Quantity"] !== newOrder["Execution Quantity"] ||
                  existingOrder["Trade Type"] !== newOrder["Trade Type"] ||
                  existingOrder.Price !== newOrder.Price ||
                  existingOrder["Order Time"] !== newOrder["Order Time"] ||
                  existingOrder["Trade Status"] !== newOrder["Trade Status"]
                );
              });


            if (hasNewData) {
              // Log only when new data is received
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              });

              // Update the allOrders array with the new data
              allOrders.push(...angeloneOB);
            }
          } else {
            // In case no new data is received, keep existing orders
            allOrders.push(...orders.filter(order => order["Client ID"] === clientId));
          }
          const allPositionDetailsAngelOne =
            responseData.angelone[index][clientId].positions?.data;
          //// console.log("allPositionDetailsAngelOne", allPositionDetailsAngelOne)
          if (
            allPositionDetailsAngelOne &&
            allPositionDetailsAngelOne.length > 0
          ) {
            const angelOnePosNoPL = allPositionDetailsAngelOne.map(
              (position) => {
                const matchingOrder = allOrderDetails.find(
                  (order) =>
                    order.tradingsymbol === position.tradingsymbol &&
                    order.status === "complete",
                );
                const orderTag = matchingOrder ? matchingOrder.ordertag : "";
                //// console.log(matchingOrder, "matchingOrder", orderTag, "orderTag");s

                return {
                  "User ID": clientId,
                  Product: position.producttype,
                  Exchange: position.exchange,
                  Symbol: position.tradingsymbol,
                  "Net Qty": position.netqty,
                  LTP: position.ltp,
                  "P&L": position.pnl,
                  "Buy Qty": position.buyqty,
                  "Buy Avg Price": position.buyavgprice,
                  "Buy Value": position.buyamount,
                  "Sell Qty": position.sellqty,
                  "Sell Avg Price": position.sellavgprice,
                  "Sell Value": position.sellamount,
                  "Realized Profit": position.realised,
                  "Unrealized profit": position.unrealised,
                  side: position.buyqty === position.sellqty ? 0 : 1,
                  token: position.symboltoken,
                  "User Alias": orderTag,
                };
              },
            );
            if (angelOnePosNoPL.length > 0) {
              const newTokens = angelOnePosNoPL.map((pos) => pos.token);

              // Compare new tokens with previous tokens
              const tokensHaveChanged = JSON.stringify(newTokens) !== JSON.stringify(previousTokens);
              console.log()

              if (tokensHaveChanged && newTokens.length > 0) {
                console.log(newTokens, previousTokens, "websocket")
                setPreviousTokens(newTokens); // Update previous tokens

                // Prepare token payload
                const filteredPositions = angelOnePosNoPL.filter(
                  (pos) => pos.Exchange === "NSE" || pos.Exchange === "NFO"
                );
                const tokenPayload = {};
                ["NSE", "NFO"].forEach((exchange) => {
                  const tokensForExchange = filteredPositions
                    .filter((pos) => pos.Exchange === exchange)
                    .map((pos) => pos.token);
                  tokenPayload[exchange] = tokensForExchange;
                });

                // Establish WebSocket connection
                const responsetoken = await fetch(
                  `${import.meta.env.SERVER_HOST}/angelone_ltp_websocket/${mainUser}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tokens: tokenPayload }),
                  }
                );
                const responseDatatoken = await responsetoken.json();

                if (!responsetoken.ok) {
                  return;
                }
              }
              const responseltp = await fetch(`${import.meta.env.SERVER_HOST}/get_ltp/${mainUser}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              const responseDataLtp = await responseltp.json();
              //// console.log("angelone", responseDataLtp);

              const ltpData = responseDataLtp.message;
              const angelOnePos = angelOnePosNoPL.map((position) => {
                const symbolToken = position.token;
                let posPL = 0;
                if (
                  ltpData &&
                  typeof ltpData === "object" &&
                  symbolToken in ltpData
                ) {
                  //// console.log("p&L", (Number(ltpData[ symbolToken ]) - Number(position[ "Buy Avg Price" ])) * Number(position[ "Buy Qty" ]))
                  const ltp = Number(ltpData[symbolToken]).toFixed(2);

                  const execPorts = executedPortfolios.filter(
                    (execPort) =>
                      execPort.trading_symbol === position["Symbol"],
                  );
                  //console.log("ltp", ltp);
                  //console.log("execPorts", execPorts);
                  execPorts.map((execPort) => {
                    if (
                      execPort.sell_price !== 0 &&
                      execPort.sell_price !== null &&
                      execPort.sell_price !== undefined
                    ) {
                      //console.log(
                      //   "1",
                      //   posPL,
                      //   Number(execPort.sell_price),
                      //   Number(execPort.buy_price),
                      //   Number(execPort.netqty)
                      // );
                      posPL =
                        Number(posPL) +
                        Number(
                          (Number(execPort.sell_price) -
                            Number(execPort.buy_price)) *
                          Number(execPort.netqty),
                        );
                    } else {
                      //console.log(
                      //   "2",
                      //   posPL,
                      //   Number(ltp),
                      //   Number(execPort.buy_price),
                      //   Number(execPort.netqty)
                      // );
                      posPL =
                        Number(posPL) +
                        Number(
                          (Number(ltp) - Number(execPort.buy_price)) *
                          Number(execPort.netqty),
                        );
                    }
                  });
                  getState;
                  return {
                    ...position,
                    LTP: ltp,
                    "P&L": posPL
                      .toFixed(2)
                      ?.replace(/^0+/g, "")
                      ?.replace(/^$/, "0"),
                  };
                } else {
                  return position;
                }
              });
              if (!responseltp.ok) {
                return;
              }
              //sqoff based on PL
              rows.map((row) => {
                if (
                  angelOnePos.filter((pos) => pos["User ID"] === row.userId)
                    .length > 0
                ) {
                  const userPos = angelOnePos.map((pos) => {
                    if (pos["User ID"] === row.userId) {
                      return Number(pos["P&L"]);
                    } else {
                      return 0;
                    }
                  });
                  const userPL = userPos.reduce(
                    (total, current) => total + current,
                    0,
                  );
                  //// console.log("user pl ==", userPos.reduce((total, current) => total + current, 0))
                  //// console.log("Number(row.maxLoss", Number(row.maxLoss) * -1, "Number(row.maxProfit)", Number(row.maxProfit));
                  if (
                    row.maxLoss != 0 &&
                    row.maxProfit != 0 &&
                    (userPL <= Number(row.maxLoss) * -1 ||
                      userPL >= Number(row.maxProfit))
                  ) {
                    handleManualSquareOffUserPL(row);
                  }
                }
              });
              //console.log("angelon psoitons ", angelOnePos);
              allPositions.push(...angelOnePos);
            }
          } else {
            allPositions.push(
              ...positions.filter((row) => row["User ID"] === clientId),
            );
          }

          const allHoldingDetailsAngelone =
            responseData.angelone[index][clientId].holdings?.data;
          if (
            allHoldingDetailsAngelone &&
            allHoldingDetailsAngelone?.length > 0
          ) {
            const angelOneHold = allHoldingDetailsAngelone.map((holding) => ({
              "User ID": clientId,
              Exchange: holding.exchange,
              Symbol: holding.tradingsymbol,
              LTP: holding.ltp,
              "P&L%": holding.pnlpercentage,
              "Current value": holding.ltp,
              "Avg Price": holding.averageprice,
              "Buy Value": holding.averageprice,
              "Collateral Qty": holding.collateralquantity,
            }));
            //// console.log("angleone holdings", angelOneHold)

            if (
              angelOneHold.length !==
              holdings.filter((row) => row["User ID"] === clientId).length
            ) {
              allHoldings.push(...angelOneHold);
              if (
                allOrderDetails?.length == 0 &&
                allPositionDetailsAngelOne.length == 0
              ) {
                handleMsg({
                  msg: `Data received successfully. - ${clientId}`,
                  logType: "MESSAGE",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: clientId,
                });
              }
            } else {
              allHoldings.push(
                ...holdings.filter((row) => row["User ID"] === clientId),
              );
            }
          } else {
            allHoldings.push(
              ...holdings.filter((row) => row["User ID"] === clientId),
            );
          }
        }
      }
      if (responseData.flattrade && responseData.flattrade.length > 0) {
        for (let index = 0; index < responseData.flattrade.length; index++) {
          let openOrders = {};
          let limitPrices = [];
          const keys = Object.keys(responseData.flattrade[index]);
          const clientId = keys.length > 0 ? keys[0] : null;

          const allOrderDetailsFlat = clientId
            ? responseData.flattrade[index][clientId]?.orderbook || []
            : [];

          const allPositionDetailsFlattrade =
            responseData.flattrade[index][clientId]?.positions || [];

          if (allOrderDetailsFlat && allOrderDetailsFlat.length > 0) {
            const flattradeOB = allOrderDetailsFlat.map((order) => ({
              "Client ID": clientId,
              "Stock Symbol": order.tsym,
              Exchange: order.exch,
              "Order Time": order.norentm,
              "Execution Quantity": order.qty,
              "Trade Type": order.trantype === "S" ? "SELL" : "BUY",
              Price: order.avgprc,
              "Trade ID": order.norenordno,
              "Trade Status": order.status,
              token: order.token,
              "Limit Price": order.prc,
              Label: order.remarks,
            }));

            // Filtering for open trade status and updating limitPrices
            flattradeOB
              .filter((order) => order["Trade Status"].toLowerCase() === "open")
              .forEach((order) => {
                limitPrices.push({ [order.token]: order["Limit Price"] });
              });

            // Creating token format for opening socket per exchange
            const exchanges = ["NSE", "NFO"];
            exchanges.forEach((exchange) => {
              const tokensForExchange = flattradeOB
                .filter((order) => order["Trade Status"].toLowerCase() === "open")
                .filter((order) => order.Exchange === exchange)
                .map((order) => order.token);
              openOrders[exchange] = tokensForExchange;
            });

            // Find existing orders for the client
            const existingOrders = orders.filter((order) => order["Client ID"] === clientId);

            // Check if there's new data by comparing length and contents
            const hasNewData = existingOrders.length !== flattradeOB.length ||
              flattradeOB.some((newOrder, index) => {
                const existingOrder = existingOrders[index];
                return (
                  existingOrder["Stock Symbol"] !== newOrder["Stock Symbol"] ||
                  existingOrder["Execution Quantity"] !== newOrder["Execution Quantity"] ||
                  existingOrder["Trade Type"] !== newOrder["Trade Type"] ||
                  existingOrder.Price !== newOrder.Price ||
                  existingOrder["Order Time"] !== newOrder["Order Time"] ||
                  existingOrder["Trade Status"] !== newOrder["Trade Status"]
                );
              });

            // Also, check if positions data has changed
            // const hasNewPositionData =
            //   responseData.flattrade[ index ][ clientId ]?.positions?.length !==
            //   positions.filter((pos) => pos[ "User ID" ] === clientId).length;

            // If there's new data or new position data, log and update
            if (hasNewData) {
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              });
              allOrders.push(...flattradeOB);
            } else {
              // Add the existing data to allOrders if nothing has changed
              allOrders.push(...flattradeOB);
            }
          } else {
            // If there's no new data, retain existing orders for the client
            allOrders.push(...orders.filter((order) => order["Client ID"] === clientId));
          }

          //// console.log(
          //   "1 flttr ppos",
          //   responseData.flattrade[ index ][ clientId ]?.positions,
          // );
          let flattradePosNoPL = [];
          if (
            allPositionDetailsFlattrade &&
            allPositionDetailsFlattrade.length > 0
          ) {
            flattradePosNoPL = allPositionDetailsFlattrade.map((position) => ({
              "User ID": clientId,
              Product:
                position.prd === "I"
                  ? "INTRADAY"
                  : position.prd === "C"
                    ? "CARRYFRWARD"
                    : "",
              Exchange: position.exch,
              Symbol: position.tsym,
              "Net Qty": position.netqty,
              LTP: position.lp,
              "P&L": position.rpnl,
              "Buy Qty": position.daybuyqty,
              "Buy Avg Price": position.daybuyavgprc,
              "Buy Value": position.daybuyamt,
              "Sell Qty": position.daysellqty,
              "Sell Avg Price": position.daysellavgprc,
              "Sell Value": position.daysellamt,
              "Realized Profit": position.rpnl,
              "Unrealized profit": position.urmtom,
              "Carry FWD Qty": position.cfbuyqty,
              token: position.token,
              side: position.daybuyqty === position.daysellqty ? 0 : 1,
            }));
          } else {
            allPositions.push(
              ...positions.filter((row) => row["User ID"] === clientId),
            );
          }
          if (flattradePosNoPL.length > 0) {
            const token =
              flattradePosNoPL.map((pos) => pos.token) +
              Object.values(openOrders).flat();
            const tokensString = JSON.stringify(tokens);
            const tokenString = JSON.stringify(token);

            const filteredPositions = flattradePosNoPL.filter(
              (pos) => pos.Exchange === "NSE" || pos.Exchange === "NFO",
            );
            const tokenPayload = {};
            ["NSE", "NFO"].forEach((exchange) => {
              const tokensForExchange = filteredPositions
                .filter((pos) => pos.Exchange === exchange)
                .map((pos) => pos.token);
              tokenPayload[exchange] = tokensForExchange;
            });

            //  merging positons and open order tokens to ge the ltp
            const mergedtokenPayload = {};
            const keys2 = new Set([
              ...Object.keys(openOrders),
              ...Object.keys(tokenPayload),
            ]);
            keys2.forEach((key) => {
              mergedtokenPayload[key] = (openOrders[key] || []).concat(
                tokenPayload[key] || [],
              );
            });

            //console.log("mergedtokenPayload,", mergedtokenPayload)

            if (tokensString !== tokenString && token.length > 0) {
              setTokens(token);
              const responsetoken = await fetch(
                `${import.meta.env.SERVER_HOST}/angelone_ltp_websocket/${mainUser}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ tokens: mergedtokenPayload }),
                },
              );
              const responseDatatoken = await responsetoken.json();
              //// console.log("angelone", responseDatatoken);
              if (!responseDatatoken.ok) {
                //console.log(responsetoken, "error responseData");
                // handleMsg({
                //   msg: responseDatatoken.message,
                //   logType: "ERROR",
                //   timestamp: `${new Date().toLocaleString()}`,
                //   user: "Order Book",
                // });
                // return;
              }
            }

            //// console.log("making get ltp api call")
            const responseltp = await fetch(`${import.meta.env.SERVER_HOST}/get_ltp/${mainUser}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const responseDataLtp = await responseltp.json();
            //console.log("angelone LTP", responseDataLtp);

            if (!responseltp.ok) {
              //console.log(responseltp, "error responseltp");
              // return;
            }

            const ltpData = responseDataLtp.message;
            //console.log("flattrade LTP Data", ltpData, limitPrices)
            limitPrices.map(async (lp) => {
              if (
                Number(ltpData[Object.keys(lp)[0]]) <=
                Number(Object.values(lp)[0])
              ) {
                //console.log("calling to update orderbook", Object.keys(lp)[ 0 ], Number(ltpData[ Object.keys(lp)[ 0 ] ]), Number(Object.values(lp)[ 0 ]))
                try {
                  const response = await fetch(`${import.meta.env.SERVER_HOST}/get_latest/${mainUser}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      broker_name: "flattrade",
                      broker_user_id: clientId,
                    }),
                  });
                  if (!response.ok) {
                    throw new Error("Failed to tell them to update orderbook");
                  }

                  const responseData = await response.json();
                  //console.log("first")
                  // setallPortSubData(responseData)
                } catch (error) {
                  console.error(
                    "Failed to tell them to update orderbook:",
                    error.message,
                  );
                }
              }
            });

            const flattradePos = flattradePosNoPL.map((position) => {
              const symbolToken = position.token;
              //console.log("symbolToken", symbolToken);
              let posPL = 0;
              if (
                ltpData &&
                typeof ltpData === "object" &&
                symbolToken in ltpData
              ) {
                //// console.log("p&L", (Number(ltpData[ symbolToken ])))
                const ltp = Number(ltpData[symbolToken]).toFixed(2);
                // const ltp = (Math.random() * (60 - 40) + 40).toFixed(2);
                //console.log("ltp==", ltp);
                const execPorts = executedPortfolios.filter(
                  (execPort) => execPort.trading_symbol === position["Symbol"],
                );
                //console.log("execPorts 123", execPorts);
                if (position["Net Qty"] != 0 && execPorts.length != 0) {
                  execPorts.map((execPort) => {
                    if (
                      execPort.sell_price !== 0 &&
                      execPort.sell_price !== null &&
                      execPort.sell_price !== undefined
                    ) {
                      ////     console.log("posPL 1", Number(
                      //       (Number(execPort.sell_price) - Number(execPort.buy_price)) *  Number(execPort.netqty)
                      // ).toFixed(2))
                      posPL =
                        Number(posPL) +
                        Number(
                          (Number(execPort.sell_price) -
                            Number(execPort.buy_price)) *
                          Number(execPort.netqty),
                        );
                    } else {
                      //// console.log("posPL 2", Number(
                      //   (Number(ltp) - Number(execPort.buy_price)) *  Number(execPort.netqty)
                      // ).toFixed(2))
                      posPL =
                        Number(posPL) +
                        Number(
                          (Number(ltp) - Number(execPort.buy_price)) *
                          Number(execPort.netqty),
                        );
                    }
                  });
                  return {
                    ...position,
                    LTP: ltp,
                    "P&L": posPL
                      .toFixed(2)
                      ?.replace(/^0+/g, "")
                      ?.replace(/^$/, "0"),
                  };
                } else {
                  return {
                    ...position,
                    LTP: ltp,
                  };
                }
              } else {
                return position;
              }
            });

            //sqoff based on PL
            rows.map((row) => {
              if (
                flattradePos.filter((pos) => pos["User ID"] === row.userId)
                  .length > 0
              ) {
                const userPos = flattradePos.map((pos) => {
                  if (pos["User ID"] === row.userId) {
                    return Number(pos["P&L"]);
                  } else {
                    return 0;
                  }
                });
                const userPL = userPos.reduce(
                  (total, current) => total + current,
                  0,
                );
                //// console.log("user pl ==", userPos.reduce((total, current) => total + current, 0))
                //// console.log("Number(row.maxLoss", Number(row.maxLoss) * -1, "Number(row.maxProfit)", Number(row.maxProfit));
                if (
                  row.maxLoss != 0 &&
                  row.maxProfit != 0 &&
                  (userPL <= Number(row.maxLoss) * -1 ||
                    userPL >= Number(row.maxProfit))
                ) {
                  handleManualSquareOffUserPL(row);
                }
              }
            });
            //// console.log("flattrade psoitons ", flattradePos)
            allPositions.push(...flattradePos);
          }
        }
        //console.log(allPositions, "allPositions Flattrade");
      }

      if (responseData.fyers && responseData.fyers.length > 0) {
        for (let index = 0; index < responseData.fyers.length; index++) {
          const keys = responseData?.fyers?.[index]
            ? Object.keys(responseData.fyers[index])
            : [];
          const clientId = keys.length > 0 ? keys[0] : null;
          const fyersOrders =
            responseData.fyers[index][clientId]?.orderbook?.orderBook;
          //// console.log(fyersOrders, "fyersOrders");
          if (clientId && fyersOrders && fyersOrders.length > 0) {
            const allOrderDetails =
              responseData.fyers[index][clientId]?.orderbook?.orderBook;

            const fyersOB = allOrderDetails.map((order) => ({
              Label: order.orderTag.split(":")[1],
              "Client ID": clientId,
              "Stock Symbol": order.symbol,
              Exchange:
                order.exchange === 10
                  ? "NSE"
                  : order.exchange === 11
                    ? "MCX"
                    : order.exchange === 12
                      ? "BSE"
                      : "",
              "Order Time": order.orderDateTime,
              "Execution Quantity": order.qty,
              "Trade Type": order.side === 1 ? "BUY" : order.side === -1 ? "SELL" : "",
              Price: order.tradedPrice,
              "Trade ID": order.id,
              Instrument:
                order.instrument === 11
                  ? "FUTIDX"
                  : order.instrument === 12
                    ? "FUTIVX"
                    : order.instrument === 13
                      ? "FUTSTK"
                      : order.instrument === 14
                        ? "OPTIDX"
                        : order.instrument === 15
                          ? "OPTSTK"
                          : null,
              "Trade Status":
                order.status === 1
                  ? "Cancelled"
                  : order.status === 2
                    ? "Traded / Filled"
                    : order.status === 3
                      ? "For future use"
                      : order.status === 4
                        ? "Transit"
                        : order.status === 5
                          ? "Rejected"
                          : order.status === 6
                            ? "Pending"
                            : null,
            }));

            // Find existing orders for the client
            const existingOrders = orders.filter((order) => order["Client ID"] === clientId);

            // Check if there's new data by comparing length and contents
            const hasNewData = existingOrders.length !== fyersOB.length ||
              fyersOB.some((newOrder, index) => {
                const existingOrder = existingOrders[index];
                return (
                  existingOrder["Stock Symbol"] !== newOrder["Stock Symbol"] ||
                  existingOrder["Execution Quantity"] !== newOrder["Execution Quantity"] ||
                  existingOrder["Trade Type"] !== newOrder["Trade Type"] ||
                  existingOrder.Price !== newOrder.Price ||
                  existingOrder["Order Time"] !== newOrder["Order Time"] ||
                  existingOrder["Trade Status"] !== newOrder["Trade Status"]
                );
              });

            if (hasNewData) {
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              });
              allOrders.push(...fyersOB);
            } else {
              allOrders.push(...orders.filter((order) => order["Client ID"] === clientId));
            }
          } else {
            // If no new data or fyersOrders is empty, retain existing orders
            allOrders.push(...orders.filter((order) => order["Client ID"] === clientId));
          }

          if (responseData.fyers[index]) {
            const allPositionDetails =
              responseData.fyers[index][clientId]?.positions?.netPositions;
            //// console.log(allPositionDetails, "allPositionDetails")
            if (allPositionDetails && allPositionDetails.length > 0) {
              const fyersPosNoPL = allPositionDetails.map((position) => ({
                "User ID": clientId,
                Product: position.productType,
                Exchange:
                  position.exchange === 10
                    ? "NSE"
                    : position.exchange === 11
                      ? "MCX"
                      : position.exchange === 12
                        ? "BSE"
                        : "",
                Symbol: position.symbol,
                "Net Qty": position.netQty,
                LTP: position.ltp,
                "P&L": position.pl,
                "Buy Qty": position.buyQty,
                "Buy Avg Price": position.buyAvg,
                "Buy Value": position.buyVal,
                "Sell Qty": position.sellQty,
                "Sell Avg Price": position.sellAvg,
                "Sell Value": position.sellVal,
                "Realized Profit": position.realized_profit,
                "Unrealized profit": position.unrealized_profit,
                side: position.side,
              }));

              if (fyersPosNoPL.length > 0) {
                const filteredPositions = fyersPosNoPL;
                const symbol = filteredPositions.map(
                  (position) => position.Symbol,
                );

                //// console.log(Symbol);

                const tradingSymbol = {
                  symbol: {
                    Subscribe: symbol,
                    Unsubscribe: [],
                  },
                };
                //// console.log(tradingSymbol, "body");
                const tokensString2 = JSON.stringify(tradingSymbol);
                const tokenString2 = JSON.stringify(tokensfyers);

                //// console.log(tokensString2, tokenString2, "123");
                if (tokensString2 !== tokenString2 && symbol.length > 0) {
                  setTokensfyers(tradingSymbol);
                  const responsetoken = await fetch(
                    `${import.meta.env.SERVER_HOST}/fyers_websocket_ltp/${mainUser}/XG07853`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(tradingSymbol),
                    },
                  );
                  //// console.log(responsetoken, 'tradingSymbol')

                  const responseDatatoken = await responsetoken.text();
                  //// console.log("fyers", responseDatatoken);
                  if (!responsetoken.ok) {
                    return;
                  }
                }

                const responseltp = await fetch(
                  `${import.meta.env.SERVER_HOST}/get_fyers_ltp/fyers/${mainUser}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                );
                //// console.log(responseltp, "responseltp");

                const responseDataLtp = await responseltp.json();
                const ltpData = responseDataLtp.message;
                //// console.log(ltpData, "ltpData fyers");

                const fyersPos = fyersPosNoPL.map((position) => {
                  symbolSymbol = position.Symbol;

                  let posPL = 0;
                  if (
                    ltpData &&
                    typeof ltpData === "object" &&
                    symbolSymbol in ltpData
                  ) {
                    //console.log(
                    //   "p&L",
                    //   (Number(ltpData[ symbolSymbol ]) -
                    //     Number(position[ "Buy Avg Price" ])) *
                    //   Number(position[ "Buy Qty" ])
                    // );
                    const ltp = ltpData[symbolSymbol].toFixed(2);

                    const execPorts = executedPortfolios.filter(
                      (execPort) => execPort.trading_symbol === symbolSymbol,
                    );
                    execPorts.map((execPort) => {
                      if (
                        execPort.sell_price !== 0 &&
                        execPort.sell_price !== null &&
                        execPort.sell_price !== undefined
                      ) {
                        posPL =
                          posPL +
                          Number(
                            (Number(execPort.sell_price) -
                              Number(execPort.buy_price)) *
                            Number(execPort.netqty),
                          );
                      } else {
                        posPL =
                          posPL +
                          Number(
                            (Number(ltp) - Number(execPort.buy_price)) *
                            Number(execPort.netqty),
                          );
                      }
                    });
                    return {
                      ...position,
                      LTP: ltp,
                      "P&L": posPL
                        .toFixed(2)
                        ?.replace(/^0+/g, "")
                        ?.replace(/^$/, "0"),
                    };
                  } else {
                    return position;
                  }
                });
                if (!responseltp.ok) {
                  return;
                }
                rows.map((row) => {
                  if (
                    fyersPos.filter((pos) => pos["User ID"] === row.userId)
                      .length > 0
                  ) {
                    const userPos = fyersPos.map((pos) => {
                      if (pos["User ID"] === row.userId) {
                        return Number(pos["P&L"]);
                      } else {
                        return 0;
                      }
                    });

                    //// console.log("user pos pl==", userPos);
                    const userPL = userPos.reduce(
                      (total, current) => total + current,
                      0,
                    );

                    //// console.log(
                    //   "user pl ==",
                    //   userPos.reduce((total, current) => total + current, 0),
                    // );
                    //// console.log(
                    //   "Number(row.maxLoss",
                    //   Number(row.maxLoss) * -1,
                    //   "Number(row.maxProfit)",
                    //   Number(row.maxProfit),
                    // );
                    if (
                      row.maxLoss != 0 &&
                      row.maxProfit != 0 &&
                      (userPL <= Number(row.maxLoss) * -1 ||
                        userPL >= Number(row.maxProfit))
                    ) {
                      handleManualSquareOffUserPL(row);
                    }
                  }
                });
              }
              //// console.log(allPositionDetails, "allPositionDetails")

              //// console.log("fyersPos psoitons ", fyersPos)
              allPositions.push(...fyersPos);
            }
          } else {
            allPositions.push(
              ...positions.filter((row) => row["User ID"] === clientId),
            );
          }
          const allHoldingDetailsFyers = clientId
            ? responseData.fyers[index][clientId]?.holdings?.holdings
            : [];
          if (allHoldingDetailsFyers) {
            const fyersHold = allHoldingDetailsFyers.map((holding) => ({
              "User ID": clientId,
              Exchange:
                holding.exchange === 10
                  ? "NSE"
                  : holding.exchange === 11
                    ? "MCX"
                    : holding.exchange === 12
                      ? "BSE"
                      : "",
              Symbol: holding.symbol,
              LTP: holding.ltp,
              "P&L%": (
                (((holding.ltp - holding.costPrice) * holding.quantity) /
                  holding.costPrice) *
                100
              ).toFixed(2),
              "Current value": holding.ltp,
              "Avg Price": holding.costPrice,
              "Buy Value": holding.marketVal,
              "Collateral Qty": holding.collateralQuantity,
            }));

            if (
              fyersHold.length !==
              holdings.filter((row) => row["User ID"] === clientId).length
            ) {
              allHoldings.push(...fyersHold);
              //// console.log(
              //   responseData.fyers[ index ][ clientId ]?.order_book_info?.orderBook,
              // );
              if (
                fyersOrders.length == 0 &&
                responseData.fyers[index][clientId]?.positions_info
                  ?.netPositions?.length == 0
              ) {
                handleMsg({
                  msg: `Data received successfully. - ${clientId}`,
                  logType: "MESSAGE",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: clientId,
                });
              }
            } else {
              allHoldings.push(
                ...holdings.filter((row) => row["User ID"] === clientId),
              );
            }
          } else {
            allHoldings.push(
              ...holdings.filter((row) => row["User ID"] === clientId),
            );
          }
        }
        //// console.log(allPositions, "allPositions");
      }
      if (
        responseData.pseudo_account &&
        responseData.pseudo_account.length > 0
      ) {
        for (
          let index = 0;
          index < responseData.pseudo_account.length;
          index++
        ) {
          //console.log("pseudoOBpseudoOB")
          const keys = responseData?.pseudo_account?.[index]
            ? Object.keys(responseData.pseudo_account[index])
            : [];
          const clientId = keys.length > 0 ? keys[0] : null;
          const pseudoOrders =
            responseData.pseudo_account[index][clientId]?.orderbook;
          //// console.log("pseudoOBpseudoOB1", clientId, pseudoOrders)
          if (clientId && pseudoOrders && pseudoOrders.length > 0) {
            const allOrderDetails =
              responseData.pseudo_account[index][clientId]?.orderbook;

            const pseudoOB = allOrderDetails.map((order) => ({
              Label: order.orderTag,
              "Client ID": clientId,
              "Stock Symbol": order.symbol,
              Exchange: order.exchange,
              "Order Time": order.orderDateTime,
              "Execution Quantity": order.qty,
              "Trade Type": order.side,
              Price: order.tradedPrice,
              "Trade ID": order.id,
              "Trade Status": order.status,
            }));

            // Find existing orders for the client
            const existingOrders = orders.filter((order) => order["Client ID"] === clientId);

            // Check if there's new data by comparing length and contents
            const hasNewData = existingOrders.length !== pseudoOB.length ||
              pseudoOB.some((newOrder, index) => {
                const existingOrder = existingOrders[index];
                return (
                  existingOrder["Stock Symbol"] !== newOrder["Stock Symbol"] ||
                  existingOrder["Execution Quantity"] !== newOrder["Execution Quantity"] ||
                  existingOrder["Trade Type"] !== newOrder["Trade Type"] ||
                  existingOrder.Price !== newOrder.Price ||
                  existingOrder["Order Time"] !== newOrder["Order Time"] ||
                  existingOrder["Trade Status"] !== newOrder["Trade Status"]
                );
              });

            if (hasNewData) {
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              });
              allOrders.push(...pseudoOB);
            } else {
              allOrders.push(...orders.filter((order) => order["Client ID"] === clientId));
            }
          } else {
            // If no new data or pseudoOrders is empty, retain existing orders
            allOrders.push(...orders.filter((order) => order["Client ID"] === clientId));
          }
          if (responseData.pseudo_account[index]) {
            const allPositionDetails =
              responseData.pseudo_account[index][clientId]?.positions;
            //// console.log(allPositionDetails, "allPositionDetails")
            if (allPositionDetails && allPositionDetails.length > 0) {
              const pseudoPosNoPL = allPositionDetails.map((position) => ({
                "User ID": clientId,
                Product: position.productType,
                Exchange: position.exchange,
                Symbol: position.symbol,
                "Net Qty": position.netQty,
                LTP: position.ltp,
                "P&L": position.pl,
                "Buy Qty": position.buyQty,
                "Buy Avg Price": position.buyAvg,
                "Buy Value": position.buyVal,
                "Sell Qty": position.sellQty,
                "Sell Avg Price": position.sellAvg,
                "Sell Value": position.sellVal,
                "Realized Profit": position.realized_profit,
                "Unrealized profit": position.unrealized_profit,
                token: position.token,
                side: position["netQty"] === 0 ? 0 : 1,
              }));

              if (pseudoPosNoPL.length > 0) {
                const newTokens = pseudoPosNoPL.map((pos) => pos.token);

                // Check if tokens have changed
                const tokensHaveChanged = JSON.stringify(newTokens) !== JSON.stringify(previousTokensPseudo);

                if (tokensHaveChanged && newTokens.length > 0) {
                  console.log(newTokens, previousTokensPseudo, "websocket");
                  setPreviousTokensPseudo(newTokens);

                  console.log(previousTokensPseudo, newTokens)// Update previous tokens

                  // Prepare token payload
                  const filteredPositions = pseudoPosNoPL.filter(
                    (pos) => pos.Exchange === "NSE" || pos.Exchange === "NFO"
                  );
                  const tokenPayload = {};
                  ["NSE", "NFO"].forEach((exchange) => {
                    const tokensForExchange = filteredPositions
                      .filter((pos) => pos.Exchange === exchange)
                      .map((pos) => pos.token);
                    tokenPayload[exchange] = tokensForExchange;
                  });

                  // Establish WebSocket connection
                  const responsetoken = await fetch(`${import.meta.env.SERVER_HOST}/angelone_ltp_websocket/${mainUser}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tokens: tokenPayload }),
                  });

                  if (!responsetoken.ok) {
                    return;
                  }

                  await responsetoken.json(); // Consume the response
                }

                const responseltp = await fetch(`${import.meta.env.SERVER_HOST}/get_ltp/${mainUser}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                const responseDataLtp = await responseltp.json();
                // console.log("pseudo ltp", responseDataLtp);

                const ltpData = responseDataLtp.message;
                const pseudoPos = pseudoPosNoPL.map((position) => {
                  const symbolToken = position.token;
                  // console.log("symbolToken", symbolToken)
                  let posPL = 0;
                  if (
                    ltpData &&
                    typeof ltpData === "object" &&
                    symbolToken in ltpData
                  ) {
                    //// console.log("p&L", (Number(ltpData[ symbolToken ]) - Number(position[ "Buy Avg Price" ])) * Number(position[ "Buy Qty" ]))
                    const ltp = Number(ltpData[symbolToken]).toFixed(2);
                    // const ltp = (Math.random() * (160 - 120) + 120).toFixed(2);
                    // console.log("ltp", symbolToken, "==", ltp)
                    const execPorts = executedPortfolios.filter(
                      (execPort) =>
                        execPort.trading_symbol === position["Symbol"] && execPort["broker_user_id"] === position["User ID"],
                    );
                    // console.log("ltp", ltp);
                    // console.log("execPorts", execPorts);
                    execPorts.map((execPort) => {
                      if (
                        execPort.sell_price !== "0" &&
                        execPort.sell_price !== null &&
                        execPort.sell_price !== undefined
                      ) {
                        //console.log(
                        //   "1",
                        //   posPL,
                        //   Number(posPL),
                        //   Number(execPort.sell_price),
                        //   Number(execPort.buy_price),
                        //   Number(execPort.netqty),
                        //   Number(
                        //     (Number(execPort.sell_price) - Number(execPort.buy_price)) *
                        //     Number(execPort.netqty)
                        //   ),
                        //   Number(posPL) + Number(
                        //     (Number(execPort.sell_price) - Number(execPort.buy_price)) *
                        //     Number(execPort.netqty)
                        //   )
                        //   // execPort
                        // );
                        posPL =
                          Number(posPL) +
                          Number(
                            (Number(execPort.sell_price) -
                              Number(execPort.buy_price)) *
                            Number(execPort.sell_qty),
                          );
                      } else {
                        // console.log(
                        //   "2",
                        //   posPL,
                        //   Number(posPL),
                        //   Number(ltp),
                        //   Number(execPort.buy_price),
                        //   Number(execPort.netqty),
                        //   Number(posPL) + Number(
                        //     (Number(ltp) - Number(execPort.buy_price)) *
                        //     Number(execPort.netqty)
                        //   ),
                        //   execPort
                        // );
                        posPL =
                          Number(posPL) +
                          Number(
                            (Number(ltp) - Number(execPort.buy_price)) *
                            Number(execPort.buy_qty),
                          );
                      }
                      // console.log("execport pl", posPL)
                    });
                    // console.log("pos", )
                    return {
                      ...position,
                      LTP: ltp,
                      "P&L":
                        posPL == "0"
                          ? "0"
                          : posPL
                            .toFixed(2)
                            ?.replace(/^0+/g, "")
                            ?.replace(/^$/, "0"),
                    };
                  } else {
                    return position;
                  }
                });
                if (!responseltp.ok) {
                  return;
                }
                //sqoff based on PL
                rows.map((row) => {
                  if (
                    pseudoPos.filter((pos) => pos["User ID"] === row.userId)
                      .length > 0
                  ) {
                    const userPos = pseudoPos.map((pos) => {
                      if (pos["User ID"] === row.userId) {
                        return Number(pos["P&L"]);
                      } else {
                        return 0;
                      }
                    });
                    const userPL = userPos.reduce(
                      (total, current) => total + current,
                      0,
                    );
                    // // console.log("user pl ==", userPL)
                    // console.log("Number(row.maxLoss", Number(row.maxLoss) * -1, "Number(row.maxProfit)", Number(row.maxProfit));
                    if (
                      (row.maxLoss != 0 && userPL <= (Number(row.maxLoss) * -1) ||
                        (row.maxProfit != 0 && userPL >= Number(row.maxProfit)))
                    ) {
                      // if atlease one open pos is present only
                      // console.log("abvcddef",pseudoPos.filter(pos => pos["User ID"] === row.userId).filter(pos => pos.side===1))

                      if (pseudoPos.filter(pos => pos["User ID"] === row.userId).filter(pos => pos.side === 1).length > 0) {
                        // console.log("max min pl user sqoff", userPL, row.maxLoss, row.maxProfit)
                        handleManualSquareOffUserPL(row);
                      }
                    }
                  }
                });
                //sqofff based on maxLossPerTrade
                rows.map((row) => {
                  const userPositions = pseudoPos.filter((pos) => pos["User ID"] === row.userId);

                  if (userPositions.length > 0) {
                    const tradesBySymbol = userPositions.reduce((acc, pos) => {
                      const symbol = pos["Symbol"];
                      const exchange = pos["Exchange"];  // Check the exchange field

                      if (!acc[symbol]) {
                        acc[symbol] = [];
                      }
                      acc[symbol].push(pos);
                      return acc;
                    }, {});

                    // Iterate over each symbol group
                    Object.keys(tradesBySymbol).forEach((symbol) => {
                      const trades = tradesBySymbol[symbol];
                      const totalPL = trades.reduce((sum, pos) => sum + Number(pos["P&L"]), 0);

                      if (
                        (row.maxLossPerTrade != 0 && totalPL <= Number(row.maxLossPerTrade) * -1)
                      ) {
                        // If the aggregated trade P&L exceeds thresholds, handle the square-off
                        if (trades.filter(pos => pos.side === 1).length > 0) {
                          // console.log("Aggregated Trade PL for symbol exceeds threshold", totalPL, Number(row.maxLossPerTrade) * -1);

                          const exchange = trades[0]["Exchange"];  // Assuming all trades in the same symbol have the same exchange
                          const isEquityTrade = exchange === "NSE";  // Determine if it's an equity trade

                          squareOffTrade(row, symbol, isEquityTrade);
                        }
                      }
                    });
                  }
                });

                //console.log("angelon psoitons ", pseudoPos);
                allPositions.push(...pseudoPos);
              }
            }
          } else {
            allPositions.push(
              ...positions.filter((row) => row["User ID"] === clientId),
            );
          }
        }
        //// console.log(allPositions, "allPositions");
      }
      //// console.log(strategies, "strategies");
      const isPositionActive = positions.some((position) => position.side === 1);

      if (allPositions.length > 0 && isPositionActive) {
        const execPortNames = executedPortfolios.map(
          (port) => port.portfolio_name,
        );
        const execportfolioDetails = portfolios.filter((port) =>
          execPortNames.includes(port.portfolio_name),
        );
        let updatedPorts = portfolios
        for (let i = 0; i < execportfolioDetails.length; i++) {
          const execPort = execportfolioDetails[i];
          const brokerIds = execPort.Strategy_accounts_id.split(",");
          const brokerDetails = rows.filter((broker) =>
            brokerIds.includes(broker.userId),
          );
          const broker_user_ids = brokerDetails.map((row) => row.userId);
          const broker_names = brokerDetails.map((row) => row.broker);
          const response = await fetch(
            `${import.meta.env.SERVER_HOST}/fetching_portfoliolevel_positions/${execPort.portfolio_name}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ broker_user_ids, broker_names }),
            },
          );
          if (!response.ok) {
            throw new Error("Failed to fetch executed portfolios");
          }

          const responseData = await response.json();
          const portfolio_positions = Object.values(
            responseData[execPort.portfolio_name],
          );
          // console.log("portfolio level pos",execPort.portfolio_name, portfolio_positions)
          const portfolio_PL = {};
          let subtablebrokerdetails = [];

          for (let j = 0; j < portfolio_positions.length; j++) {
            // portfolio_positions.map(async (portfolio_pos) => {
            // console.log("portfolio_pos", portfolio_pos);
            const portfolio_pos = portfolio_positions[j]
            const brokerId = Object.keys(portfolio_pos)[0];
            const brokerName = brokerDetails.filter(
              (broker) => broker.userId === brokerId,
            )[0]["broker"];

            const portfolio_broker_positions = [
              ...Object.values(portfolio_pos)[0]["completed"],
              ...Object.values(portfolio_pos)[0]["running"],
            ];
            if (portfolio_broker_positions.length > 0) {
              let result = {};
              for (let item of execPort["brokerDetails"]) {
                for (let key in item) {
                  result[key] = {
                    maxPL: item[key]["maxPL"],
                    maxPLTime: item[key]["maxPLTime"],
                    minPL: item[key]["minPL"],
                    minPLTime: item[key]["minPLTime"],
                  };
                }
              }
              let clickedPortBrokerDetails = result;
              // console.log("p", execPort.portfolio_name, clickedPortBrokerDetails )
              // console.log("clickedPortBrokerDetails", clickedPortBrokerDetails)

              let brokerPL = 0;
              // let maxPL = 0;
              let maxPL =
                clickedPortBrokerDetails[brokerId] && clickedPortBrokerDetails[brokerId]["maxPL"] !== undefined
                  ? clickedPortBrokerDetails[brokerId]["maxPL"] === "-Infinity"
                    ? -Infinity
                    : clickedPortBrokerDetails[brokerId]["maxPL"]
                  : null; // Or any default value you prefer

              // let minPL = Infinity;
              let minPL =
                clickedPortBrokerDetails[brokerId] && clickedPortBrokerDetails[brokerId]["minPL"] !== undefined
                  ? clickedPortBrokerDetails[brokerId]["minPL"] === "Infinity"
                    ? Infinity
                    : clickedPortBrokerDetails[brokerId]["minPL"]
                  : null; // Or any default value you prefer

              let maxPLTime =
                clickedPortBrokerDetails[brokerId] && clickedPortBrokerDetails[brokerId]["maxPLTime"] !== undefined
                  ? clickedPortBrokerDetails[brokerId]["maxPLTime"]
                  : null; // Or any default value you prefer

              let minPLTime =
                clickedPortBrokerDetails[brokerId] && clickedPortBrokerDetails[brokerId]["minPLTime"] !== undefined
                  ? clickedPortBrokerDetails[brokerId]["minPLTime"]
                  : null; // Or any default value you prefer

              //console.log("checking ", maxPL, minPL, maxPLTime, minPLTime)
              //console.log("portfolio_broker_positions", portfolio_broker_positions)
              // console.log("pp", execPort.portfolio_name, brokerId, portfolio_broker_positions)
              for (let k = 0; k < portfolio_broker_positions.length; k++) {
                const portfolio_broker_pos = portfolio_broker_positions[k]
                // portfolio_broker_positions.map((portfolio_broker_pos) => {
                // console.log("portfolio_broker_pos", portfolio_broker_pos)
                for (let index = 0; index < allPositions.length; index++) {
                  const position = allPositions[index];
                  if (brokerName === "flattrade") {
                    if (
                      position["User ID"] === brokerId &&
                      position["Symbol"] === portfolio_broker_pos["tsym"] &&
                      position["Buy Qty"] === portfolio_broker_pos["daybuyqty"] &&
                      position["Buy Avg Price"] ===
                      portfolio_broker_pos["daybuyavgprc"]
                    ) {
                      //console.log("mapped psoition", position)
                      brokerPL = brokerPL + Number(position["P&L"]);
                    }
                  }
                  if (brokerName === "angelone") {
                    if (
                      position["User ID"] === brokerId &&
                      position["Symbol"] ===
                      portfolio_broker_pos["tradingsymbol"] &&
                      position["Buy Qty"] === portfolio_broker_pos["buyqty"] &&
                      position["Buy Avg Price"] ===
                      portfolio_broker_pos["buyavgprice"]
                    ) {
                      brokerPL = brokerPL + Number(position["P&L"]);

                    }
                  }
                  if (brokerName === "fyers") {
                    if (
                      position["User ID"] === brokerId &&
                      position["Symbol"] === portfolio_broker_pos["symbol"] &&
                      position["Buy Qty"] === portfolio_broker_pos["buyQty"] &&
                      position["Buy Avg Price"] === portfolio_broker_pos["buyAvg"]
                    ) {
                      brokerPL = brokerPL + Number(position["P&L"]);
                    }
                  }
                  if (brokerName === "pseudo_account") {
                    if (
                      position["User ID"] === brokerId &&
                      position["Symbol"] === portfolio_broker_pos["symbol"]

                      // && position["Buy Qty"] === Number(portfolio_broker_pos["buyQty"]) &&
                      // position["Buy Avg Price"] === Number(portfolio_broker_pos["buyAvg"])
                    ) {
                      if (portfolio_broker_pos["side"] == "Close") {

                        brokerPL = brokerPL + Number((Number(portfolio_broker_pos["sellAvg"]) - Number(portfolio_broker_pos["buyAvg"])) * Number(portfolio_broker_pos["buyQty"]));
                        // console.log("=======", execPort.portfolio_name, brokerPL)
                      } else {
                        brokerPL = brokerPL + Number((Number(position["LTP"]) - Number(portfolio_broker_pos["buyAvg"])) * Number(portfolio_broker_pos["buyQty"]));
                        // console.log("--------", execPort.portfolio_name, brokerPL)
                      }
                      // brokerPL = brokerPL + Number(position["P&L"]);
                      // open (ltp - buyAvg)*buyQty
                      // close (sellAvg - buyAvg)*buyQty
                    }
                  }
                }
              };

              // const prevbrokerDetails = subTableData[ 0 ].brokerDetails;
              //console.log("execPort[brokerDetails]", execPort[ "brokerDetails" ]);
              let changed = false;

              // console.log("brokerPL", brokerPL)
              for (
                let index = 0;
                index < execPort["brokerDetails"].length;
                index++
              ) {
                const prevBroker = execPort["brokerDetails"][index];
                //// console.log('Number(Object.values(prevBroker)[ 0 ][ "minP&L" ])', Object.values(prevBroker)[ 0 ][ "minP&L" ])
                if (brokerId === Object.keys(prevBroker)[0]) {
                  const currentTime = new Date().toLocaleTimeString("en-GB", {
                    hour12: false,
                  });
                  if (
                    Number(Object.values(prevBroker)[0]["maxPL"]) <
                    Number(brokerPL)
                  ) {
                    //console.log("changin maxPL 1", Number(Object.values(prevBroker)[ 0 ][ "maxPL" ]), Number(brokerPL))
                    maxPL = Number(brokerPL);
                    maxPLTime = currentTime;
                    changed = true;
                  } else {
                    //console.log("changin maxPL 2", Number(Object.values(prevBroker)[ 0 ][ "maxPL" ]), Number(brokerPL))

                    maxPL = Number(Object.values(prevBroker)[0]["maxPL"]);
                    maxPLTime = Object.values(prevBroker)[0]["maxPLTime"];
                  }

                  // if(Number(Object.values(prevBroker)[ 0 ][ "minP&L" ]))

                  if (
                    Number(Object.values(prevBroker)[0]["minPL"]) >
                    Number(brokerPL)
                  ) {
                    //console.log("changin minPL 1", Number(Object.values(prevBroker)[ 0 ][ "minPL" ]), Number(brokerPL))

                    minPL = Number(brokerPL);
                    minPLTime = currentTime;
                    changed = true;
                  } else {
                    //console.log("changin minPL 2", Number(Object.values(prevBroker)[ 0 ][ "minPL" ]), Number(brokerPL))

                    minPL = Number(Object.values(prevBroker)[0]["minPL"]);
                    minPLTime = Object.values(prevBroker)[0]["minPLTime"];
                  }
                }
              }
              // console.log("brokerPL", brokerPL)

              portfolio_PL[brokerId] = {
                "P&L": Number(brokerPL).toFixed(2),
                maxPL: Number(maxPL).toFixed(2),
                minPL: Number(minPL).toFixed(2),
                maxPLTime: maxPLTime,
                minPLTime: minPLTime,
              };

              subtablebrokerdetails.push({
                [brokerId]: {
                  "P&L": Number(brokerPL).toFixed(2),
                  maxPL: Number(maxPL).toFixed(2),
                  minPL: Number(minPL).toFixed(2),
                  maxPLTime: maxPLTime,
                  minPLTime: minPLTime,
                },
              });
              // console.log("subtablebrokerdetails app.jsx",  subtablebrokerdetails)

              //api call to save the times in DB
              if (changed) {
                try {
                  //console.log("callign add performa")
                  const response = await fetch(
                    `${import.meta.env.SERVER_HOST}/add_portfolio_performance/${mainUser}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        portfolio_name: execPort.portfolio_name,
                        brokers: portfolio_PL,
                      }),
                    },
                  );
                  if (!response.ok) {
                    throw new Error("Failed to fetch  portfolio subtable data");
                  }

                  const responseData = await response.json();

                  // setallPortSubData(responseData)
                } catch (error) {
                  console.error(
                    "Error fetching  portfolios subtable data:",
                    error.message,
                  );
                }
              }
              // console.log("subtablebrokerdetails app.jsx",execPort.portfolio_name,  subtablebrokerdetails)

              updatedPorts = updatedPorts.map((port) => {
                if (port.portfolio_name === execPort.portfolio_name) {
                  // console.log("making 0")
                  return {
                    ...port,
                    brokerDetails: subtablebrokerdetails,
                  };
                }
                else {
                  // console.log("making 0")
                  return {
                    ...port,
                    // brokerDetails: [],
                  };
                }
              });

              // console.log("updatedPorts with subdata in loop", updatedPorts)

            };
          }
          // console.log("updatedPorts with subdata", updatedPorts)
          dispatch(
            setPortfolios({
              portfolios: updatedPorts,
            }),
          );
        }

        //update ports into redux 

        /// strategy level positions

        const strategylevel_positions_pl = async (startegyData) => {
          console.log("startegyData===", startegyData);
          try {
            const response = await fetch(
              `${import.meta.env.SERVER_HOST}/fetching_strategy_tag_positions`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(startegyData),
              },
            );
            // console.log("response", response, startegyData);
            if (!response.ok) {
              throw new Error("Failed to fetch executed portfolios");
            }

            const responseData = await response.json();
            // console.log("strtgy level pos", responseData)
            const recievedStrategies = Object.keys(responseData);
            let eachStrategyPL = {};

            let isSquaredOff = false;

            for (let index = 0; index < recievedStrategies.length; index++) {
              let hasOpenPos = false;
              const rcvdstg_tag = recievedStrategies[index];
              const mappedPos = responseData[rcvdstg_tag];
              let stgPL = 0;
              let stgPos = [];

              // Iterate over each key in the data object
              // console.log("mapped pso",rcvdstg_tag, mappedPos)
              for (let key in mappedPos) {
                // console.log("key", key)
                if (mappedPos.hasOwnProperty(key)) {
                  // console.log("====>>>", mappedPos.hasOwnProperty(key), Object.values(mappedPos[key])[0])
                  // Combine completed and running arrays for each key
                  stgPos = stgPos.concat(Object.values(mappedPos[key])[0].completed, Object.values(mappedPos[key])[0].running);
                }
              }
              stgPos.map((pos) => {
                const execPorts = executedPortfolios.filter(
                  (execPort) =>
                    execPort.trading_symbol === pos["symbol"] && execPort["strategy_tag"] === rcvdstg_tag,
                );
                // console.log("exeports---------------", pos["symbol"], rcvdstg_tag, execPorts)
                execPorts.map((execPort) => {
                  if (
                    execPort.sell_price !== "0" &&
                    execPort.sell_price !== null &&
                    execPort.sell_price !== undefined
                  ) {
                    stgPL =
                      Number(stgPL) +
                      Number(
                        (Number(execPort.sell_price) -
                          Number(execPort.buy_price)) *
                        Number(execPort.sell_qty),
                      );
                  } else {
                    hasOpenPos = true;
                    const posLTP = allPositions.filter(posltp => posltp["Symbol"] == pos["symbol"])[0]["LTP"]
                    stgPL =
                      Number(stgPL) +
                      Number(
                        (Number(posLTP) - Number(execPort.buy_price)) *
                        Number(execPort.buy_qty),
                      );
                  }
                  //// console.log("execport pl", stgPL)
                });
              });

              const strategy = strategies.filter(
                (stgy) => stgy.StrategyLabel === rcvdstg_tag,
              )[0];
              // console.log(
              //   "stgy ",
              //   strategy.StrategyLabel,
              //   ", PL",
              //   stgPL,
              //   ", max",
              //   strategy.MaxProfit,
              //   ",  min",
              //   strategy.MaxLoss,
              //   strategy
              // );
              if (strategy.StrategyLabel === rcvdstg_tag) {
                if (
                  ((strategy.MaxLoss != 0) && (stgPL <= Number(strategy.MaxLoss) * -1)) ||
                  ((strategy.MaxProfit != 0) && (stgPL >= Number(strategy.MaxProfit)))
                ) {
                  if (hasOpenPos) {
                    // console.log("sq off stg level max min profit", stgPL, strategy.MaxLoss, strategy.MaxProfit)
                    handleManualSquareOffStrategyPL(
                      strategy.StrategyLabel,
                      strategy.TradingAccount
                    );
                    isSquaredOff = true;
                  }
                }
              }
              const profitLocking = strategy?.ProfitLocking.split("~");
              const profitLocking_a = Number(profitLocking[0]);
              const profitLocking_b = Number(profitLocking[1]);
              const prfoitTrailing_a = Number(profitLocking[2]);
              const prfoitTrailing_b = Number(profitLocking[3]);

              // strategy level profit trailing & locking
              if (
                strategy.reached_profit != 0 &&
                strategy.reached_profit !== null &&
                strategy.reached_profit !== undefined &&
                strategy.locked_min_profit != 0 &&
                strategy.locked_min_profit !== null &&
                strategy.locked_min_profit !== undefined
              ) {
                if (stgPL <= strategy.locked_min_profit) {
                  console.log(
                    "handle manuwal square off for min locked profit ",
                    strategy.locked_min_profit,
                    "stgPL",
                    stgPL
                  );
                  handleManualSquareOffStrategyPL(
                    strategy.StrategyLabel,
                    strategy.TradingAccount
                  );
                  isSquaredOff = true;
                }
              }
              if (
                profitLocking_a != 0 &&
                profitLocking_b != 0 &&
                prfoitTrailing_a == 0 &&
                prfoitTrailing_b == 0
              ) {
                if (stgPL >= profitLocking_a) {
                  //// console.log("updatinng min profit lock")
                  let lockNewMinProfit = profitLocking_b;
                  //// console.log('reached_profit', stgPL, "lockNewMinProfit", lockNewMinProfit, "execPort.locked_min_profit", execPort.locked_min_profit)
                  if (lockNewMinProfit > strategy.locked_min_profit) {
                    const response = await fetch(
                      `${import.meta.env.SERVER_HOST}/update_strategy_profit_trail_values/${mainUser}/${strategy.StrategyLabel}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          reached_profit: stgPL,
                          locked_min_profit: lockNewMinProfit,
                        }),
                      },
                    );
                    if (!response.ok) {
                      const errorData = await response.json();
                      //console.log("update_profit_locking error", errorData);
                    }
                    ///// here
                  }
                }
              } else if (
                (profitLocking_a !== 0 &&
                  profitLocking_b !== 0 &&
                  prfoitTrailing_a !== 0 &&
                  prfoitTrailing_b !== 0) ||
                (profitLocking_a === 0 &&
                  profitLocking_b === 0 &&
                  prfoitTrailing_a !== 0 &&
                  prfoitTrailing_b !== 0)
              ) {
                if (
                  stgPL >= profitLocking_a &&
                  stgPL >= strategy.reached_profit
                ) {
                  //console.log("updatinng min profit lock");
                  let lockNewMinProfit =
                    profitLocking_b +
                    prfoitTrailing_b *
                    Math.floor((stgPL - profitLocking_a) / prfoitTrailing_a);
                  //// console.log(
                  //   "reached_profit",
                  //   stgPL,
                  //   "lockNewMinProfit",
                  //   lockNewMinProfit,
                  //   "execPort.locked_min_profit",
                  //   strategy.locked_min_profit
                  // );
                  if (lockNewMinProfit > strategy.locked_min_profit) {
                    const response = await fetch(
                      `${import.meta.env.SERVER_HOST}/update_strategy_profit_trail_values/${mainUser}/${strategy.StrategyLabel}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          reached_profit: stgPL,
                          locked_min_profit: lockNewMinProfit,
                        }),
                      },
                    );
                    if (!response.ok) {
                      const errorData = await response.json();
                      //console.log("update_profit_locking error", errorData);
                    }
                    fetchExecutedPortfolios();
                  }
                }
              }

              eachStrategyPL[rcvdstg_tag] = stgPL.toFixed(2);
            }
            // console.log("eachStrategyPL", eachStrategyPL)
            const updatedStrategies = strategies.map((rdx_stg) => {
              if (Object.keys(eachStrategyPL).includes(rdx_stg.StrategyLabel)) {
                return {
                  ...rdx_stg,
                  PL: eachStrategyPL[rdx_stg.StrategyLabel],
                };
              } else {
                return { ...rdx_stg };
              }
            });
            console.log("updatedStrxategies", updatedStrategies)
            dispatch(
              setStrategies({
                strategies: updatedStrategies,
              }),
            );
          } catch (error) {
            console.error(
              "Error fetching  strategy- level postions  :",
              error.message,
            );
          }
        };

        let strategy_tags_data = [];

        strategies.map((strategy) => {
          //// console.log("each startegy",)
          let strategy_tag = strategy.StrategyLabel;
          let ids = strategy.TradingAccount.split(", ");

          let broker_user_ids = [];
          for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            let loggedinbrokerids = rows.filter(
              (row) => row.userId === id && row.inputDisabled === true,
            );
            if (loggedinbrokerids.length > 0) {
              broker_user_ids.push(loggedinbrokerids[0]["userId"]);
            }
          }
          let broker_names = broker_user_ids.map((id) => {
            let bname = rows.filter((row) => row.userId === id);
            return bname[0]["broker"];
          });
          strategy_tags_data.push({
            strategy_tag: strategy_tag,
            broker_user_ids: broker_user_ids,
            broker_names: broker_names,
          });
          //// console.log("staradata", strategy_tag, )
        });
        //console.log("strategy_tags_data", {
        //   strategy_tags_data: strategy_tags_data,
        // });

        strategylevel_positions_pl({ strategy_tags_data: strategy_tags_data });
      }

      //// console.log("allOrders finaal", allOrders)
      if (allOrders.length !== 0) {
        dispatch(
          setOrders({
            orders: allOrders,
          }),
        );
      }
      //// console.log("allPositions", allPositions)

      if (allPositions.length !== 0) {
        dispatch(
          setPositions({
            positions: allPositions,
          }),
        );
      }

      if (allHoldings.length !== 0) {
        dispatch(
          setHoldings({
            holdings: allHoldings,
          }),
        );
      }

      //  Leg level squareoff
      const filteredExecutedPortfolios = executedPortfolios.filter(
        (execPort) => !execPort.master_account_id,
      );
      filteredExecutedPortfolios.map(async (execPort) => {
        if (execPort.portfolio_name) {
          // console.log("execPort leg leve aqoff", execPort);
          const broker_type = rows.filter(
            (row) => row.userId === execPort.broker_user_id,
          )[0]["broker"];
          const leg = portfolios
            .filter(
              (portfolio) => portfolio.portfolio_name === execPort.portfolio_name,
            )[0]
          ["legs"].filter((leg) => leg.id == execPort.leg_id)[0];
          // console.log("execLeg", leg);

          // premium   abs premium
          const tgt_value = Number(leg.tgt_value); //50         200
          const sl_value = Number(leg.sl_value); //20         130

          if (orders[0]["clientId"] !== "" && positions[0]["User ID"] !== "") {
            const execOrder = orders.filter(
              (order) => order["Trade ID"] === execPort["order_id"],
            )[0];
            //console.log("execOrder", execOrder);
            const buyQty = Number(execOrder["Execution Quantity"]);
            const buyPrice = Number(execOrder["Price"]); //150
            const execPosition = positions.filter(
              (pos) => pos["Symbol"] === execOrder["Stock Symbol"],
            )[0];
            const ltp = Number(execPosition["LTP"]); //200     //130 exit points
            const legPL = (ltp - buyPrice) * buyQty;
            const profitLocking_a = Number(leg.trail_tgt[0]);
            const profitLocking_b = Number(leg.trail_tgt[1]);
            const prfoitTrailing_a = Number(leg.trail_tgt[2]);
            const prfoitTrailing_b = Number(leg.trail_tgt[3]);
            const sl_trail_a = Number(leg.trail_sl[0]);
            const sl_trail_b = Number(leg.trail_sl[1]);
            //tgt  & sl value leg level squreoff
            if (
              Number(execPosition["Net Qty"]) !== 0 &&
              tgt_value !== 0 &&
              sl_value !== 0
            ) {
              if (leg.target === "Premium" && ltp >= buyPrice + tgt_value) {
                //// console.log(
                //   "Reached prem Target",
                //   leg.target,
                //   " legID:",
                //   execPort.leg_id,
                //   "buyPrice",
                //   buyPrice,
                //   "tgt_value",
                //   tgt_value,
                //   "buyPrice+tgt_value",
                //   buyPrice + tgt_value,
                //   "LTP",
                //   ltp
                // );

                handleLegSquareOff(
                  execPort.portfolio_name,
                  broker_type,
                  execPort.broker_user_id,
                  execPort.leg_id,
                  execPort.strategy_tag,
                );
              } else if (leg.target === "Absolute Premium" && ltp >= tgt_value) {
                //// console.log(
                //   "Reached asb prem Target",
                //   leg.target,
                //   " legID:",
                //   execPort.leg_id,
                //   "buyPrice",
                //   buyPrice,
                //   "tgt_value",
                //   tgt_value,
                //   "LTP",
                //   ltp
                // );
                handleLegSquareOff(
                  execPort.portfolio_name,
                  broker_type,
                  execPort.broker_user_id,
                  execPort.leg_id,
                  execPort.strategy_tag,
                );
              }
              if (leg.stop_loss == "Premium" && ltp <= buyPrice - sl_value) {
                //// console.log(
                //   "Reached prem Stoploss",
                //   leg.stop_loss,
                //   " legID:",
                //   execPort.leg_id,
                //   "buyPrice",
                //   buyPrice,
                //   "sl_value",
                //   sl_value,
                //   "buyPrice-sl_value",
                //   buyPrice - sl_value,
                //   "LTP",
                //   ltp
                // );
                handleLegSquareOff(
                  execPort.portfolio_name,
                  broker_type,
                  execPort.broker_user_id,
                  execPort.leg_id,
                  execPort.strategy_tag,
                );
              } else if (leg.stop_loss == "Absolute Premium" && ltp <= sl_value) {
                //// console.log(
                //   "Reached abs prem Stoploss",
                //   leg.stop_loss,
                //   " legID:",
                //   execPort.leg_id,
                //   "buyPrice",
                //   buyPrice,
                //   "sl_value",
                //   sl_value,
                //   "LTP",
                //   ltp
                // );
                handleLegSquareOff(
                  execPort.portfolio_name,
                  broker_type,
                  execPort.broker_user_id,
                  execPort.leg_id,
                  execPort.strategy_tag,
                );
              }

              if (
                (leg.option_type === "FUT" &&
                  leg.target === "Underlying" &&
                  ltp >= tgt_value) ||
                (leg.option_type === "FUT" &&
                  leg.target === "Underlying" &&
                  ltp <= sl_value)
              ) {
                handleLegSquareOff(
                  execPort.portfolio_name,
                  broker_type,
                  execPort.broker_user_id,
                  execPort.leg_id,
                  execPort.strategy_tag,
                );
              }
            }
            // each position level profit trailing & locking
            if (!execPort.square_off) {
              if (
                execPort.reached_profit !== 0 &&
                execPort.reached_profit !== null &&
                execPort.reached_profit !== undefined &&
                execPort.locked_min_profit !== 0 &&
                execPort.locked_min_profit !== null &&
                execPort.locked_min_profit !== undefined
              ) {
                if (
                  legPL <= execPort.locked_min_profit ||
                  legPL <= execPort.trailed_sl
                ) {
                  //// console.log(
                  //   "handle manuwal square off for min locked profit ",
                  //   execPort.locked_min_profit,
                  //   "LTP",
                  //   ltp,
                  //   "legPL",
                  //   legPL
                  // );
                  handleLegSquareOff(
                    execPort.portfolio_name,
                    broker_type,
                    execPort.broker_user_id,
                    execPort.leg_id,
                    execPort.strategy_tag,
                  );
                }
              }
              if (
                profitLocking_a !== 0 &&
                profitLocking_b !== 0 &&
                prfoitTrailing_a === 0 &&
                prfoitTrailing_b === 0
              ) {
                if (legPL >= profitLocking_a && execPort.reached_profit !== 0) {
                  //// console.log("updatinng min profit lock")
                  let lockNewMinProfit = profitLocking_b;
                  let trailed_sl = 0;
                  if (sl_trail_a !== 0 && sl_trail_b !== 0) {
                    trailed_sl =
                      Number(leg.sl_value) + (legPL / sl_trail_a) * sl_trail_b;
                  }
                  //// console.log('reached_profit', legPL, "lockNewMinProfit", lockNewMinProfit, "execPort.locked_min_profit", execPort.locked_min_profit)
                  if (
                    lockNewMinProfit > execPort.locked_min_profit ||
                    trailed_sl > execPort.trailed_sl
                  ) {
                    const response = await fetch(
                      `${import.meta.env.SERVER_HOST}/update_portfolio_leg_profit_trail_values/${mainUser}/${execPort.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          reached_profit: legPL,
                          locked_min_profit: lockNewMinProfit,
                          trailed_sl: trailed_sl,
                        }),
                      },
                    );
                    if (!response.ok) {
                      const errorData = await response.json();
                      //console.log("update_profit_locking error", errorData);
                    }
                    ///// here
                  }
                }
              } else if (
                (profitLocking_a !== 0 &&
                  profitLocking_b !== 0 &&
                  prfoitTrailing_a !== 0 &&
                  prfoitTrailing_b !== 0) ||
                (profitLocking_a === 0 &&
                  profitLocking_b === 0 &&
                  prfoitTrailing_a !== 0 &&
                  prfoitTrailing_b !== 0)
              ) {
                if (
                  legPL >= profitLocking_a &&
                  legPL >= execPort.reached_profit
                ) {
                  //// console.log("updatinng min profit lock")
                  let lockNewMinProfit =
                    profitLocking_b +
                    prfoitTrailing_b *
                    Math.floor((legPL - profitLocking_a) / prfoitTrailing_a);
                  //// console.log('reached_profit', legPL, "lockNewMinProfit", lockNewMinProfit, "execPort.locked_min_profit", execPort.locked_min_profit)
                  let trailed_sl = 0;
                  if (sl_trail_a !== 0 && sl_trail_b !== 0) {
                    trailed_sl =
                      Number(leg.sl_value) + (legPL / sl_trail_a) * sl_trail_b;
                  }
                  if (
                    lockNewMinProfit > execPort.locked_min_profit ||
                    trailed_sl > execPort.trailed_sl
                  ) {
                    const response = await fetch(
                      `${import.meta.env.SERVER_HOST}/update_portfolio_leg_profit_trail_values/${mainUser}/${execPort.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          reached_profit: legPL,
                          locked_min_profit: lockNewMinProfit,
                          trailed_sl: trailed_sl,
                        }),
                      },
                    );
                    if (!response.ok) {
                      const errorData = await response.json();
                      //console.log("update_profit_locking error", errorData);
                    }
                    ///// here
                  }
                }
                if (legPL >= execPort.reached_profit) {
                }
              }

              fetchExecutedPortfolios();
            }
            //// console.log("execPosition", execPosition)
          }
        }
      });
    });
  };

  const { portfolios: Portfolios } = useSelector(
    (state) => state.portfolioReducer,
  );
  const { strategies: strategies } = useSelector((state) => state.strategyReducer);
  const { positions: positions } = useSelector((state) => state.positionReducer);

  const [otherDetails, setOtherDetails] = useState([]);

  useEffect(() => {
    setOtherDetails(rows);
  }, [rows]);

  const handleSqOffClick = async (item) => {
    const portfolioname = item.portfolio_name;
    const brokerIds = item.Strategy_accounts_id.split(",");
    const brokerDetailsMap = {};

    otherDetails.forEach((broker) => {
      if (brokerIds.includes(broker.userId)) {
        brokerDetailsMap[broker.userId] = broker.broker;
      }
    });

    if (brokerIds.length > 0) {
      for (const brokerId of brokerIds) {
        const brokerDetail = brokerDetailsMap[brokerId];
        if (brokerDetail) {
          await handleSqOff(portfolioname, brokerId, brokerDetail);
        } else {
          console.warn(`Broker detail not found for broker ID: ${brokerId}`);
        }
      }
    } else {
      console.error("Broker IDs are undefined or empty");
    }
  };

  const handleSqOff = async (portfolioname, brokerIds, brokerDetails) => {
    const username = cookies.get("USERNAME");
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/square_off_portfolio_level/${username}/${portfolioname}/${brokerDetails}/${brokerIds}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }
      const responseData = await response.json();
      handleMsg({
        msg: responseData.message,
        logType: "MESSAGE",
        timestamp: `${new Date().toLocaleString()}`,
        portfolio: portfolioname,
        user: brokerIds,
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // State to track processed items for each table
  let processedPortfolios = new Set();
  let processedRows = new Set();
  let processedStrategies = new Set();


  const checkTime = () => {
    const currentFormattedTime = new Date().toLocaleTimeString();

    // console.log(currentFormattedTime, "currentFormattedTime"); // Check the current formatted time

    [...Portfolios, ...rows, ...strategies].forEach((item) => {
      const sqTime =
        Portfolios.includes(item)
          ? item.square_off_time
          : rows.includes(item)
            ? item.sqOffTime
            : strategies.includes(item)
              ? item.SqOffTime
              : null;

      // console.log("Square-off time (sqTime):", sqTime); // Log the square-off time for the current item

      if (sqTime && sqTime !== "00:00:00") {
        // console.log("Valid square-off time detected for item:", item); // Log if the square-off time is valid

        if (currentFormattedTime === sqTime) {
          console.log("Current time matches square-off time:", sqTime); // Log when the current time matches the square-off time

          // Process Portfolios table
          if (Portfolios.includes(item) && !processedPortfolios.has(item.portfolio_name)) {
            console.log("Processing portfolio:", item.portfolio_name); // Log the portfolio being processed
            handleSqOffClick(item);
            processedPortfolios.add(item.portfolio_name); // Mark as processed
          }

          // Process rows table
          else if (rows.includes(item) && !processedRows.has(item.id)) {
            // console.log("Processing row item:", item); // Log the row item being processed
            handleManualSquareOffUserPL(item);
            processedRows.add(item.id); // Mark as processed
          }

          // Process strategies table
          else if (strategies.includes(item) && !processedStrategies.has(item.StrategyLabel + item.TradingAccount)) {
            // console.log("Processing strategy:", item.StrategyLabel, item.TradingAccount); // Log the strategy being processed
            handleManualSquareOffStrategyPL(item.StrategyLabel, item.TradingAccount);
            processedStrategies.add(item.StrategyLabel + item.TradingAccount); // Mark as processed
          }
        } else {
          // console.log("Current time does not match square-off time for item:", item); // Log if the times don't match
        }
      } else {
        // console.log("Invalid or empty square-off time for item:", item); // Log if the square-off time is invalid or empty
      }
    });
  };


  useEffect(() => {
    const mappedUserIds = rows.filter((row) => row.inputDisabled);
    const hasValidPositions = positions.some((position) => position["User ID"]);
    const hasSideOne = positions.some((position) => position.side === 1);
    if (!hasValidPositions && !hasSideOne) {
      // handleMsg({
      //   msg: "Please log in at least one broker account",
      //   logType: "WARNING",
      //   timestamp: `${new Date().toLocaleString()}`,
      // });
    } else {

      const intervalId = setInterval(() => {
        checkTime();
      }, 750);
      return () => clearInterval(intervalId);
    }
  }, [Portfolios, strategies, rows]);


  useEffect(() => {
    if (
      Object.values(Broker).reduce((acc, curr) => [...acc, ...curr], [])
        .length > 0
    ) {
      const intervalId = setInterval(fetchOrderData, 2000);

      fetchOrderData();

      return () => clearInterval(intervalId);
    }
  }, [Broker]);

  return (
    <>
      <ImagePreloader />
      <Routes basename="/" hashtype="noslash">
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Subscription" element={<Subscription />} />
        <Route path="/passwordRecovery" element={<PasswordRecovery />} />
        <Route path="/SecurityCode/:username" element={<SecurityCode />} />
        <Route path="/New_Password/:username" element={<New_Password />} />
        <Route path="/Change_Password" element={<Change_Password />} />

        {/* Protected Routes */}
        <Route path="/UserProfiles" element={<UserProfiles />} />
        <Route path="/Strategies" element={<Strategies />} />
        <Route path="/Equity" element={<Equity />} />
        <Route path="/F&O/Portfolio" element={<Portfolio />} />
        <Route path="/F&O/AddPortfolio" element={<AddPortfolio />} />
        <Route path="/Edit-Portfolio/:portfolio" element={<AddPortfolio />} />
        {/* <Route path="/UserProfiles" element={<ProtectedRoute isSubscribed={isSubscribed} element={<UserProfiles />} />} />
        <Route path="/Strategies" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Strategies />} />} />
        <Route path="/Equity" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Equity />} />} /> */}

        {/* <Route path="/F&O/AddPortfolio" element={<ProtectedRoute isSubscribed={isSubscribed} element={<AddPortfolio />} />} /> */}
        {/* <Route path="/Edit-Portfolio/:portfolio" element={<ProtectedRoute isSubscribed={isSubscribed} element={<AddPortfolio />} />} />
        <Route path="/Positions" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Positions />} />} />
        <Route path="/Holdings" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Holdings />} />} />
        <Route path="/OrderFlow" element={<ProtectedRoute isSubscribed={isSubscribed} element={<OrderFlow />} />} />
        <Route path="/OrderManagement" element={<ProtectedRoute isSubscribed={isSubscribed} element={<OrderManagement />} />} />
        <Route path="/Option_Chain" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Option_Chain />} />} />
        <Route path="/Master_child" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Master_child />} />} />
        <Route path="/Master_accounts" element={<ProtectedRoute isSubscribed={isSubscribed} element={<Master_accounts />} />} /> */}
        <Route path='/Positions' element={<Positions />} />
        <Route path='/Holdings' element={<Holdings />} />
        <Route path='/OrderFlow' element={<OrderFlow />} />
        <Route path='/OrderManagement' element={<OrderManagement />} />
      </Routes>
    </>
  );
}

export default App;
