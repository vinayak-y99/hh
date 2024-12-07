import React, { useState, useRef, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketIndex from "../../components/MarketIndex";
import filterIcon from "../../assets/newFilter.png";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RightNav from "../../components/RightNav";
import "../../styles.css";
import { BsFillCaretLeftFill } from "react-icons/bs";
import AddProfile from "../../assets/Add Profile.png";
import AddPortfolio from "../../assets/Trading tools/Add Portfolio.png";
import Options from "../../assets/Options.png";
import { FaPlus } from "react-icons/fa";
import { ErrorContainer } from "../../components/ErrorConsole";
import Edit from "../../assets/edit.png";
import Recycle from "../../assets/recyclebins.png";
import makecopy from "../../assets/makecopy.png";
import makeascompleted from "../../assets/markascompleted.png";
import reset from "../../assets/reset.png";
import payoff from "../../assets/PayOff.png";
import Start from "../../assets/start_2.png";
import chart from "../../assets/chart.png";
import reexecute from "../../assets/reexecute.png";
import partentry from "../../assets/part-entry.png";
import close from "../../assets/close.png";
import Modal from "react-modal";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useDispatch, useSelector } from "react-redux";
import { setAllSeq } from "../../store/slices/colSeq";
import { setAllVis } from "../../store/slices/colVis";
import { setConsoleMsgs } from "../../store/slices/consoleMsg";
import { setPortfolios } from "../../store/slices/portfolio";

function Portfolio() {
  const errorContainerRef = useRef(null);
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  // Error Message start
  const dispatch = useDispatch();
  const brokerState = useSelector((state) => state.brokerReducer);
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // Error Message end
  // portfolio table
  const mainUser = cookies.get("USERNAME");

  const [editingRow, setEditingRow] = useState(null);
  const [MakeCopy, setMakeCopy] = useState(null);
  const [MakeAsCompleted, setMakeAsCompleted] = useState(null);
  const [Reset, setReset] = useState(null);
  const [PayOff, setPayOff] = useState(null);
  const [Chart, setChart] = useState(null);
  const [Reexecute, setReexecute] = useState(null);
  const [PartEntry, setPartEntry] = useState(null);
  const navigate = useNavigate();

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

  const handleDeletes = async (portfolioname) => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/delete_portfolio/${mainUser}/${portfolioname}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(await response.json());
      }

      handlePageClick();
      handleMsg({
        msg: "Portfolio deleted Successfully",
        logType: "MESSAGE",
        timestamp: ` ${new Date().toLocaleString()}`,
        portfolio: portfolioname,
      });
    } catch (error) {
      //console.error("Error deleting credentials:", error.message);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState("");
  const handleDelete = (portfolioName) => {
    // Show a confirmation modal before actually deleting
    setShowConfirmDeleteModal(true);

    // Set the portfolio name to be deleted in the state
    setPortfolioToDelete(portfolioName);
  };

  const [timerValue, setTimerValue] = useState("");
  const [isTableOpen, setTableOpen] = useState(false);
  const [isTableOpen1, setTableOpen1] = useState(false);
  const [isPlusClicked, setIsPlusClicked] = useState({});
  const [isPlusClicked1, setIsPlusClicked1] = useState({});
  const [subTableData, setsubTableData] = useState([]);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [otherDetails, setotherDetails] = useState([]);
  useEffect(() => {
    setotherDetails(brokerState.brokers);
  }, [brokerState.brokers]);

  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );
  //console.log(portfolioDetails, "portfolioDetails");
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
          const port = extractedPortfolio[i];
          //console.log(port, "port")

          if (execPortNames.includes(port.portfolio_name)) {
            let clickedPortBrokerDetails =
              portfolio_timings[port.portfolio_name];
            //console.log("clickedPortBrokerDetails", clickedPortBrokerDetails)
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

  const [executedportfolios, setexecutedportfolios] = useState([]);

  const { positions: positions } = useSelector(
    (state) => state.positionReducer,
  );
  const { orders } = useSelector((state) => state.orderBookReducer);


  useEffect(() => {
    const fetchExecutedPortfolios = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/get_executed_portfolios/${mainUser}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch executed portfolios");
        }

        const { ExecutedPortfolios } = await response.json();
        // const ExecutedPortfolios = ["a1"]
        setexecutedportfolios(
          ExecutedPortfolios.map((execPort) => execPort.portfolio_name),
        );
      } catch (error) {
        //console.error("Error fetching executed portfolios:", error.message);
      }
    };

    fetchExecutedPortfolios();
  }, [positions, orders]);
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

  //// console.log(positions, "positions");

  const [openedPortfolio, setopenedPortfolio] = useState({});

  const [portfolio_positions, setportfolio_positions] = useState([]);

  const portfoliolevel_positions = async (
    portfolio,
    broker_user_ids,
    broker_names,
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/fetching_portfoliolevel_positions/${portfolio.portfolio_name}`,
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
        responseData[portfolio.portfolio_name],
      );
      //// console.log("portfoliolevel_positio res", portfolio_positions);

      setportfolio_positions(portfolio_positions);
    } catch (error) {
      console.error(
        "Error fetching  portfolios level postions  :",
        error.message,
      );
    }
  };

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
          //console.error(`Broker detail not found for broker ID: ${brokerId}`);
        }
      }
    } else {
      //console.error("Broker IDs are undefined or empty");
    }
  };

  const { brokers: row } = useSelector((state) => state.brokerReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  const marketData = JSON.parse(localStorage.getItem("marketIndexDetails"));

  const placeOrderOptionsQTP = async (item) => {
    try {
      const currentTime = new Date();
      const portfolioname = item.portfolio_name;
      const brokerIds = item.Strategy_accounts_id.split(",");
      const starttime = item.start_time;
      const endtime = item.end_time;
      const strategy = item.strategy;


      brokerIds.forEach(async (userId, index) => {
        const user = row.find((user) => user.userId === userId);
        if (user && user.inputDisabled) {
          let apiEndpoints = [];
          //console.log("mahesh");
          let startTime = starttime || null;
          let endTime = endtime || null;

          if (startTime === "00:00:00") {
            //console.log("mahesh12");
            startTime = null;
          }
          if (endTime === "00:00:00") {
            //console.log("mahesh123");
            endTime = null;
          }
          //console.log("mahesh124");

          const currentTimeStr = currentTime.toLocaleTimeString("en-US", {
            hour12: false,
          });

          if (
            (startTime === null || currentTimeStr >= startTime) &&
            (endTime === null || currentTimeStr <= endTime)
          ) {
            //console.log("mahesh", user.broker);

            if (user.broker === "fyers") {
              apiEndpoints = [
                `${import.meta.env.SERVER_HOST}/place_order/fyers/${mainUser}/${portfolioname}/${user.userId}`,
              ];
            } else if (user.broker === "angelone") {
              apiEndpoints = [
                `${import.meta.env.SERVER_HOST}/angelone_options_place_order/${mainUser}/${portfolioname}/${user.userId}`,
              ];
            } else if (user.broker === "flattrade") {
              apiEndpoints = [
                `${import.meta.env.SERVER_HOST}/flatrade_place_order/${mainUser}/${portfolioname}/${user.userId}`,
              ];
            } else if (user.broker === "pseudo_account") {
              //console.log("mahesh123");
              apiEndpoints = [
                `${import.meta.env.SERVER_HOST}/pseudo_placeorder/${mainUser}/${portfolioname}/${user.userId}`,
              ];
            }

            for (const apiEndpoint of apiEndpoints) {
              try {
                const requestBody = {
                  qtp_lots: 1,
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
                //console.log(res, "res");
                //console.log("mahesh2");

                if (res.ok) {
                  const orderPlaceoptionsQTPRes = await res.json();
                  fetchAccountDetails();

                  const legMsgs = orderPlaceoptionsQTPRes.messages;
                  for (const message of legMsgs) {
                    handleMsg({
                      msg: message.message,
                      logType: "TRADING",
                      timestamp: `${new Date().toLocaleString()}`,
                      user: user.userId,
                      strategy: strategy,
                      portfolio: portfolioname,
                    });
                  }
                  closeModal();
                } else {
                  const orderPlaceoptionsQTPRes = await res.json();
                  handleMsg({
                    msg: orderPlaceoptionsQTPRes[0].message,
                    logType: "MESSAGE",
                    timestamp: `${new Date().toLocaleString()}`,
                    user: user.userId,
                    strategy: strategy,
                    portfolio: portfolioname,
                  });
                  closeModal();
                }
              } catch (e) {
                handleMsg({
                  msg: e.message,
                  logType: "ERROR",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: user.userId,
                  strategy: strategy,
                  portfolio: portfolioname,
                });
                closeModal();
              }
            }
          } else {
            handleMsg({
              msg: `Order not placed for ${user.userId} as current time is outside the allowed time window (Start: ${startTime || "Not specified"}, End: ${endTime || "Not specified"}).`,
              logType: "INFO",
              timestamp: `${new Date().toLocaleString()}`,
              user: user.userId,
              strategy: strategy,
              portfolio: portfolioname,
            });
          }
        } else {
          handleMsg({
            msg: `Login the ${user.userId}, to place an order in this account.`,
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
            user: user.userId,
            strategy: strategy,
            portfolio: portfolioname,
          });
          closeModal();
        }
      });
    } catch (error) {
      //console.log(error.message);
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
        },
      );

      //// console.log(response, "response")
      if (!response.ok) {
        throw new Error("Failed ");
      }
      const responseData = await response.json();
      //// console.log(responseData, "responseData")
      handleMsg({
        msg: responseData.message,
        logType: "MESSAGE",
        timestamp: ` ${new Date().toLocaleString()}`,
        portfolio: portfolioname,
        user: brokerIds,
      });
    } catch (error) {
      //console.error("Error :", error.message);
    }
  };


  const { brokers: brokerDetails } = useSelector(
    (state) => state.brokerReducer,
  );
  const handleReexecute = async (item) => {
    console.log(item, "item");
    try {
      const isExecuted = executedportfolios.includes(item.portfolio_name);

      if (!isExecuted) {
        handleMsg({
          msg: `Portfolio "${item.portfolio_name}" is not completed and cannot be re-executed.`,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }

      const broker_Id = item.Strategy_accounts_id.split(",");
      const users = brokerDetails.filter((user) => broker_Id.includes(user.userId));
      const loggedInUser = users.find((user) => user.inputDisabled);

      if (!loggedInUser) {
        handleMsg({
          msg: `Login required to ReExecute.`,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
          user: broker_Id.join(", "),
        });
        return;
      }

      console.log("Selected Portfolio Details:", item);
      let portfolioName = item.portfolio_name;
      let reExecutionCount = 0;

      const reExecutionMatch = portfolioName.match(/\(re_(\d+)\)$/);

      if (reExecutionMatch) {
        reExecutionCount = parseInt(reExecutionMatch[1], 10);
        if (reExecutionCount > 0) {
          handleMsg({
            msg: `You cannot reexecute for this portfolio name "${portfolioName}" as it was already re-executed.`,
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
          });
          return;
        }
        portfolioName = portfolioName.replace(/\(re_\d+\)$/, `(re_${reExecutionCount + 1})`);
      } else {
        portfolioName += "(re_1)";
      }

      const updatedItem = { ...item, portfolio_name: portfolioName };
      console.log("Updated Item:", updatedItem);

      const apiUrl = `${import.meta.env.SERVER_HOST}/store_portfolio/${mainUser}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        handleMsg({
          msg: `You cannot reexecute for the reexecuted portfolio: ${errorResponse.message}`,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      handleMsg({
        msg: `Portfolio re-executed successfully: ${portfolioName}`,
        logType: "SUCCESS",
        timestamp: `${new Date().toLocaleString()}`,
      });

      handlePageClick();
      handlechangebox(portfolioName, false);

      const strategyName = updatedItem.strategy;
      const brokerIds = updatedItem.Strategy_accounts_id.split(",");

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
            await handleReexecuteWithBroker(portfolioName, brokerId, brokerDetail, strategyName);
          } else {
            console.error(`Broker detail not found for broker ID: ${brokerId}`);
          }
        }
      } else {
        console.error("Broker IDs are undefined or empty");
      }
    } catch (error) {
      console.error("Error in handleReexecute:", error.message);
    }
  };
  const handleReexecuteWithBroker = async (portfolioName, brokerId, brokerDetail, strategyName) => {
    try {
      const username = cookies.get("USERNAME");
      const user = brokerDetails.find((user) => user.userId === brokerId);

      console.log("Matching Portfolio Name:", portfolioName);
      console.log(user, "user");

      if (!user || !user.inputDisabled) {
        handleMsg({
          msg: `Login required to place an order in this account.`,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
          user: brokerId,
          strategy: strategyName,
          portfolio: portfolioName,
        });
        return;
      }

      let apiEndpoints = [];
      let optionType = null;

      const matchingPortfolio = portfolioName;

      if (matchingPortfolio && matchingPortfolio.legs) {
        for (const leg of matchingPortfolio.legs) {
          if (leg.option_type === "FUT") {
            optionType = "FUT";
            break;
          }
        }
      }

      console.log("User Broker:", user.broker);
      if (user.broker === "fyers") {
        apiEndpoints = [
          `${import.meta.env.SERVER_HOST}/${optionType === "FUT" ? "fyers_futures" : "place_order"}/fyers/${username}/${portfolioName}/${brokerId}`,
        ];
      } else if (user.broker === "angelone") {
        apiEndpoints = [
          `${import.meta.env.SERVER_HOST}/${optionType === "FUT" ? "angelone_future" : "angelone_options"}/angelone/${username}/${portfolioName}/${brokerId}`,
        ];
      } else if (user.broker === "flattrade") {
        apiEndpoints = [
          `${import.meta.env.SERVER_HOST}/${optionType === "FUT" ? "flatrade_future" : "flatrade"}/flattrade/${username}/${portfolioName}/${brokerId}`,
        ];
      } else if (user.broker === "pseudo_account") {
        apiEndpoints = [
          `${import.meta.env.SERVER_HOST}/pseudo_placeorder/${username}/${portfolioName}/${brokerId}`,
        ];
      }

      console.log("API Endpoint:", apiEndpoints);
      const requestBody = {
        qtp_lots: 1,
      };

      const response = await fetch(apiEndpoints, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Only parse the response once
      const orderPlaceOptionsQTPRes = await response.json();

      if (response.ok) {
        handlechangebox();
        const legMsgs = orderPlaceOptionsQTPRes.messages;
        for (let index = 0; index < legMsgs.length; index++) {
          const message = legMsgs[index].message;
          handleMsg({
            msg: message,
            logType: "TRADING",
            timestamp: `${new Date().toLocaleString()}`,
            user: brokerId,
            strategy: strategyName,
            portfolio: portfolioName,
          });
        }

        // Call handleReexecute again if order placed successfully
        // await handleReexecute({ ...item, portfolio_name: portfolioName });
      } else {
        // In case of an error response
        handleMsg({
          msg: orderPlaceOptionsQTPRes[0].message,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          user: brokerId,
          strategy: strategyName,
          portfolio: portfolioName,
        });
      }
    } catch (error) {
      handleMsg({
        msg: error.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: brokerId,
        strategy: strategyName,
        portfolio: portfolioName,
      });
    }
  };
  const handleTimerChange = (e) => {
    const inputTime = e.target.value;

    // Format the input time as hh:mm:ss
    const formattedTime = formatInputTime(inputTime);

    // Update the state with the formatted time
    setTimerValue(formattedTime);
  };
  const handlePartEntry = () => {
    setPartEntry();
  };
  const handleMakeCopy = () => {
    setMakeCopy();
  };

  const handleMakeAsCompleted = () => {
    setMakeAsCompleted();
  };

  const handleReset = () => {
    setReset();
  };

  const handlePayOff = () => {
    setPayOff();
  };

  const handleChart = () => {
    setChart();
  };
  const [openPortIndex, setopenPortIndex] = useState("");

  useEffect(() => {
    if (
      openPortIndex !== "" &&
      new Set(Object.values(isPlusClicked)).size > 0
    ) {
      setsubTableData([{ ...portfolioDetails[openPortIndex] }]);
    } else {
      // console.log("making empty")
      setsubTableData([
        { ...portfolioDetails[openPortIndex], brokerDetails: [] },
      ]);
    }
    // }, [isPlusClicked]);
  }, [isPlusClicked]);

  // useEffect(()=> {
  //   setsubTableData([{ ...portfolioDetails[openPortIndex] }]);
  // }, [portfolioDetails])

  const handlePlusClick = async (index) => {
    setopenPortIndex(index);
    // setsubTableData([ { ...portfolioDetails[ index ]} ]);
    //// console.log("  when plus clicked", [ { ...portfolioDetails[ index ]} ])
    // setsubTableData([ { ...{}, brokerDetails: [] } ]);
    const plusState = { ...isPlusClicked };
    Object.keys(plusState).forEach((key) => {
      plusState[key] = false;
    });
    plusState[index] = !isPlusClicked[index];
    //// console.log("otherDetails", otherDetails);
    setTableOpen(Object.values(plusState).includes(true));
    console.log("setIsPlusClicked", plusState)
    setIsPlusClicked(plusState);
    const brokerIds = portfolioDetails[index].Strategy_accounts_id.split(",");
    //// console.log("brokerIds", brokerIds);
    //// console.log("otherDetails", otherDetails);
    const brokerDetails = otherDetails.filter((broker) =>
      brokerIds.includes(broker.userId),
    );
    //// console.log("brokerDetails===", brokerDetails)
    // for (const user of brokerDetails) {
    const broker_user_ids = brokerDetails.map((row) => row.userId);
    const broker_names = brokerDetails.map((row) => row.broker);
    //// console.log("pfname , brokerid", portfolioDetails[ index ], "=", broker_user_ids, "=", broker_names)
    setopenedPortfolio(portfolioDetails[index]);
    await portfoliolevel_positions(
      portfolioDetails[index],
      broker_user_ids,
      broker_names,
    );
    // }
  };

  useState(() => {
    const newBoolObject = {};
    if (subTableData.length !== 0) {
      subTableData[0].Strategy_accounts_id.split(",").forEach((_, index) => {
        const newBoolObject = {};
        newBoolObject[index] = false;
      });
      setIsPlusClicked1(newBoolObject);
    }
  }, [subTableData]);

  useState(() => {
    const newBoolObject = {};
    portfolioDetails.forEach((_, index) => {
      newBoolObject[index] = false;
    });
    console.log("setIsPlusClicked", newBoolObject)
    setIsPlusClicked(newBoolObject);
  }, [portfolioDetails]);

  useEffect(() => {
    setotherDetails(brokerDetails);
  }, []);

  const handlePlusClick1 = (index) => {
    const plusState = { ...isPlusClicked1 };
    Object.keys(plusState).forEach((key) => {
      plusState[key] = false;
    });
    plusState[index] = !isPlusClicked1[index];
    setTableOpen1(Object.values(plusState).includes(true));
    setIsPlusClicked1(plusState);
  };

  const handleEdit = (editablePortfolio) => {
    //// console.log("string params 1 ", editablePortfolio);
    setEditingRow(editablePortfolio);
    const params = JSON.stringify({ ...editablePortfolio, margin: "0" });
    //// console.log("string params 2", {...editablePortfolio, margin:"100"});

    navigate(`/Edit-Portfolio/${params}`, {
      ...editablePortfolio,
      margin: "0",
    });
  };
  useEffect(() => {
    if (portfolioDetails.length === 0) {
      dispatch(
        setPortfolios({
          portfolios: [
            {
              Strategy_accounts_id: "",
              exchange: "",
              expiry_date: "",
              lots: "",
              order_type: "",
              portfolio_name: "",
              quantity: "",
              remarks: "",
              strategy: "",
              strategy_account: "",
              strike: "",
              transaction_type: "",
              user_id: "",
              variety: "",
              stock_symbol: "",
              // "product": "",
            },
          ],
        }),
      );
    }
  }, [portfolioDetails]);

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const portfolioCols = [
    "Enabled",
    "Status",
    "Portfolio Name",
    "PNL",
    "Symbol",
    "Execute/Sq Off",
    "Edit",
    "Delete",
    "Make Copy",
    "Mark As Completed",
    "Reset",
    "Pay Off",
    "Chat",
    "Re Execute",
    "Part Entry/Exit",
    "Current Value",
    "Value Per Lot",
    "Underlying LTP",
    "Positional Portfolio",
    "Product",
    "Strategy",
    "Entry Price",
    "Combined Premuim",
    "Per Lot Premuim",
    "Start Time",
    "End Time",
    "SqOff Time",
    "Range End Time",
    "Delta",
    "Theta",
    "Vega",
    "Remarks",
    "Message",
  ];

  const [colVisPortfolio, setcolVisPortfolio] = useState(
    allVisState.portfolioVis,
  );

  const [portfolioColsSelectedALL, setportfolioColsSelectedALL] =
    useState(false);

  const portfolioColSelectALL = () => {
    setportfolioColsSelectedALL((prev) => !prev);
    portfolioCols.map((portfolioCol) => {
      setcolVisPortfolio((prev) => ({
        ...prev,
        [portfolioCol]: portfolioColsSelectedALL,
      }));
    });
  };

  const [portfolioSeq, setportfolioSeq] = useState(allSeqState.portfolioSeq);

  useEffect(() => {
    setportfolioSeq(allSeqState.portfolioSeq);
    setcolVisPortfolio((prev) => {
      const colVis = {};
      Object.keys(colVisPortfolio).map((col) => {
        if (allSeqState.portfolioSeq.includes(col)) {
          colVis[col] = true;
        } else {
          colVis[col] = false;
        }
      });
      //// console.log("{...prev, ...colVis}", {...prev, ...colVis})
      return { ...colVis };
    });
  }, []);

  useEffect(() => {
    dispatch(
      setAllVis({
        ...allVisState,
        portfolioVis: colVisPortfolio,
      }),
    );
    if (new Set(Object.values(colVisPortfolio)).size === 1) {
      if (Object.values(colVisPortfolio).includes(true)) {
        setportfolioSeq(portfolioCols);
      } else {
        setportfolioSeq([]);
      }
    }
  }, [colVisPortfolio]);

  useEffect(() => {
    dispatch(
      setAllSeq({
        ...allSeqState,
        portfolioSeq: portfolioSeq,
      }),
    );
  }, [portfolioSeq]);

  const [showSearchPortfolio, setshowSearchPortfolio] = useState({
    showSearchPortfolioName: false,
    showSearchSymbol: false,
    showSearchProduct: false,
    showSearchStrategy: false,
  });

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchPortfolio((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, false]),
        ),
      );
    }
  };

  const [selectAllPortfolioName, setSelectAllPortfolioName] = useState(false);
  const [uniquePortfolioName, setuniquePortfolioName] = useState([]);
  const [portfolioNameSelected, setPortfolioNameSelected] = useState([]);

  const [selectAllSymbol, setSelectAllSymbol] = useState(false);
  const [uniqueSymbol, setuniqueSymbol] = useState([]);
  const [SymbolSelected, setSymbolSelected] = useState([]);

  const [selectAllProduct, setSelectAllProduct] = useState(false);
  const [uniqueProduct, setuniqueProduct] = useState([]);
  const [ProductSelected, setProductSelected] = useState([]);

  const [selectAllStrategy, setSelectAllStrategy] = useState(false);
  const [uniqueStrategy, setuniqueStrategy] = useState([]);
  const [StrategySelected, setStrategySelected] = useState([]);

  useEffect(() => {
    const data = portfolioDetails;
    setuniquePortfolioName(
      data ? [...new Set(data.map((d) => d.portfolio_name))] : [],
    );
    setuniqueSymbol(data ? [...new Set(data.map((d) => d.stock_symbol))] : []);
    setuniqueProduct(data ? [...new Set(data.map((d) => d.variety))] : []);
    setuniqueStrategy(data ? [...new Set(data.map((d) => d.strategy))] : []);
  }, [portfolioDetails]);

  const handleCheckboxChangePortfolioName = (portfolioName) => {
    const isSelected = portfolioNameSelected.includes(portfolioName);
    if (isSelected) {
      setPortfolioNameSelected(
        portfolioNameSelected.filter((item) => item !== portfolioName),
      );
      setSelectAllPortfolioName(false);
    } else {
      setPortfolioNameSelected((prevSelected) => [
        ...prevSelected,
        portfolioName,
      ]);
      setSelectAllPortfolioName(
        portfolioNameSelected.length === uniquePortfolioName.length - 1,
      );
    }
  };

  const handleSelectAllForPortfolioName = () => {
    const allChecked = !selectAllPortfolioName;
    setSelectAllPortfolioName(allChecked);
    if (allChecked) {
      setPortfolioNameSelected(uniquePortfolioName.map((d) => d.toLowerCase()));
    } else {
      setPortfolioNameSelected([]);
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

  const handleCheckboxChangeStrategy = (Strategy) => {
    const isSelected = StrategySelected.includes(Strategy);
    if (isSelected) {
      setStrategySelected(StrategySelected.filter((item) => item !== Strategy));
      setSelectAllStrategy(false);
    } else {
      setStrategySelected((prevSelected) => [...prevSelected, Strategy]);
      setSelectAllStrategy(
        StrategySelected.length === uniqueStrategy.length - 1,
      );
    }
  };

  const handleSelectAllForStrategy = () => {
    const allChecked = !selectAllStrategy;
    setSelectAllStrategy(allChecked);
    if (allChecked) {
      setStrategySelected(uniqueStrategy.map((d) => d.toLowerCase()));
    } else {
      setStrategySelected([]);
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

  const handleOkClick = () => {
    updateFilteredRows({
      portfolioNameSelected,
      SymbolSelected,
      ProductSelected,
      StrategySelected,

      setPortfolioNameSelected,
      setSymbolSelected,
      setProductSelected,
      setStrategySelected,

      setSelectAllPortfolioName,
      setSelectAllSymbol,
      setSelectAllProduct,
      setSelectAllStrategy,

      uniquePortfolioName,
      uniqueSymbol,
      uniqueProduct,
      uniqueStrategy,

      setuniquePortfolioName,
      setuniqueSymbol,
      setuniqueProduct,
      setuniqueStrategy,
    });
    setshowSearchPortfolio((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, false]),
      ),
    );
  };

  const [filteredRows, setFilteredRows] = useState(portfolioDetails);

  useEffect(() => {
    setFilteredRows(portfolioDetails);
  }, [portfolioDetails]);

  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows = ({
    portfolioNameSelected,
    SymbolSelected,
    ProductSelected,
    StrategySelected,

    setPortfolioNameSelected,
    setSymbolSelected,
    setProductSelected,
    setStrategySelected,

    setSelectAllPortfolioName,
    setSelectAllSymbol,
    setSelectAllProduct,
    setSelectAllStrategy,

    uniquePortfolioName,
    uniqueSymbol,
    uniqueProduct,
    uniqueStrategy,

    setuniquePortfolioName,
    setuniqueSymbol,
    setuniqueProduct,
    setuniqueStrategy,
  }) => {
    const rows = portfolioDetails;
    let prevfilteredRows;
    if (portfolioNameSelected.length !== 0) {
      //// console.log("portfolioNameSelected", portfolioNameSelected);
      prevfilteredRows = rows.filter((row) =>
        portfolioNameSelected.includes(row.portfolio_name.toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    //// console.log("prevfilteredRows  portfolioNameSelected", prevfilteredRows);
    if (SymbolSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        SymbolSelected.includes(row.stock_symbol.toLowerCase()),
      );
    }
    //// console.log("prevfilteredRows  SymbolSelected", prevfilteredRows);
    if (ProductSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ProductSelected.includes(row.variety.toLowerCase()),
      );
    }
    //// console.log("prevfilteredRows  ProductSelected", prevfilteredRows);
    if (StrategySelected.length !== 0) {
      //// console.log("pStrategySelected", StrategySelected);
      prevfilteredRows = prevfilteredRows.filter((row) =>
        StrategySelected.includes(row.strategy.toLowerCase()),
      );
    }
    //// console.log("prevfilteredRows  StrategySelected", prevfilteredRows);

    const arrayNames = [
      "portfolioNameSelected",
      "SymbolSelected",
      "ProductSelected",
      "StrategySelected,",
    ];

    const arrays = [
      portfolioNameSelected,
      SymbolSelected,
      ProductSelected,
      StrategySelected,
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

    if (NameOfNonEmptyArray !== "SymbolSelected") {
      setuniqueSymbol(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.stock_symbol;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "portfolioNameSelected") {
      setuniquePortfolioName(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.portfolio_name;
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
              return filteredRow.variety;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "StrategySelected") {
      setuniqueStrategy(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.strategy;
            }),
          ),
        );
      });
    }

    setFilteredRows(prevfilteredRows);
  };

  const handlechangebox = async (portfolioname, enabled) => {
    try {
      //// console.log(
      //   "Body",
      //   `${!enabled}`.charAt(0).toUpperCase() + `${!enabled}`.slice(1),
      // );
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/enable_portfolio/${mainUser}/${portfolioname}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enable_status:
              `${!enabled}`.charAt(0).toUpperCase() + `${!enabled}`.slice(1),
          }),
        },
      );
      if (response.ok) {
        const res = await response.json();
        //// console.log("res", res);

        handlePageClick();
        handleMsg({
          msg: res.message,
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
          portfolio: portfolioname,
        });
        // setEnabledStatus(!enabledStatus);
      } else {
        //console.error("Failed to update enable status");
      }
    } catch (error) {
      //console.error("Error updating enable status:", error);
    }
  };

  const { executedPortfolios: executedPortfolio } = useSelector(
    (state) => state.executedPortfolioReducer,
  );


  const portfolioTH = {
    Enabled: colVisPortfolio["Enabled"] && (
      <th colspan="2">
        <div>
          <small>Enabled</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          // onClick={() => {
          //   setShowSelectBox((prev) => !prev);
          // }}
          />
        </div>
        {/* {showSelectBox && (
          <div>
            <select
              type="text"
              // value={enabledFilter}
              // onChange={handleEnabledFilterChange}
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
    Status: colVisPortfolio["Status"] && (
      <th >
        <div>
          <small>Status</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
          />
        </div>
      </th>
    ),
    "Portfolio Name": colVisPortfolio["Portfolio Name"] && (
      <th>
        <div>
          <small>Portfolio Name</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-15px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchPortfolioName"
                      ? !prev.showSearchPortfolioName
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchPortfolio.showSearchPortfolioName && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllPortfolioName}
                    onChange={handleSelectAllForPortfolioName}
                  />
                  Select all
                </li>
                <li>
                  {uniquePortfolioName.map((fyersclientId, index) => {
                    return (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                          }}
                          checked={portfolioNameSelected.includes(
                            fyersclientId.toLowerCase(),
                          )}
                          onChange={() =>
                            handleCheckboxChangePortfolioName(
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
              <button onClick={handleOkClick}>Ok</button>
              <button
                onClick={() => {
                  setshowSearchPortfolio((prev) =>
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
    PNL: colVisPortfolio["PNL"] && (
      <th>
        <div>
          <small>PNL</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-40px",
            }}
            onClick={() => {
              // setShowSearchMTM((prev) => !prev);
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
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMTM((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    Symbol: colVisPortfolio["Symbol"] && (
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
              setshowSearchPortfolio((prev) => ({
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
        {showSearchPortfolio.showSearchSymbol && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
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
                  {uniqueSymbol.map((fyersclientId, index) => {
                    return (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                          }}
                          checked={SymbolSelected.includes(
                            fyersclientId.toLowerCase(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeSymbol(
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
              <button onClick={handleOkClick}>Ok</button>
              <button
                onClick={() => {
                  setshowSearchPortfolio((prev) =>
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
    "Execute/Sq Off": colVisPortfolio["Execute/Sq Off"] && (
      <th>
        <div>
          <small>Execute/Sq Off</small>
        </div>
      </th>
    ),
    Delete: colVisPortfolio["Delete"] && (
      <th>
        <div>
          <small>Delete</small>
        </div>
      </th>
    ),
    Edit: colVisPortfolio["Edit"] && (
      <th>
        <div>
          <small>Edit</small>
        </div>
      </th>
    ),
    "Make Copy": colVisPortfolio["Make Copy"] && (
      <th>
        <div>
          <small>Make Copy</small>
        </div>
      </th>
    ),
    "Mark As Completed": colVisPortfolio["Mark As Completed"] && (
      <th>
        <div>
          <small>Mark As Completed</small>
        </div>
      </th>
    ),
    Reset: colVisPortfolio["Reset"] && (
      <th>
        <div>
          <small>Reset</small>
        </div>
      </th>
    ),
    "Pay Off": colVisPortfolio["Pay Off"] && (
      <th>
        <div>
          <small>Pay Off</small>
        </div>
      </th>
    ),
    Chat: colVisPortfolio["Chat"] && (
      <th>
        <div>
          <small>Chat</small>
        </div>
      </th>
    ),
    "Re Execute": colVisPortfolio["Re Execute"] && (
      <th>
        <div>
          <small>Re Execute</small>
        </div>
      </th>
    ),
    "Part Entry/Exit": colVisPortfolio["Part Entry/Exit"] && (
      <th>
        <div>
          <small>Part Entry/Exit</small>
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
                        style={{ width: "12px" }}
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
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchSqOffTime((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Current Value": colVisPortfolio["Current Value"] && (
      <th>
        <div>
          <small>Current Value</small>
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
      </th>
    ),
    "Value Per Lot": colVisPortfolio["Value Per Lot"] && (
      <th>
        <div>
          <small>Value Per Lot</small>
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
      </th>
    ),
    "Underlying LTP": colVisPortfolio["Underlying LTP"] && (
      <th>
        <div>
          <small>Underlying LTP</small>
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
    "Positional Portfolio": colVisPortfolio["Positional Portfolio"] && (
      <th>
        <div>
          <small>Positional Portfolio</small>
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
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    Product: colVisPortfolio["Product"] && (
      <th>
        <div>
          <small>Product</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
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

        {showSearchPortfolio.showSearchProduct && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
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
                  {uniqueProduct.map((maxLoss, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={ProductSelected.includes(
                          maxLoss.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeProduct(maxLoss.toLowerCase())
                        }
                      />
                      <label>{maxLoss}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>Ok</button>
              <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Strategy: colVisPortfolio["Strategy"] && (
      <th>
        <div>
          <small>Strategy</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchStrategy"
                      ? !prev.showSearchStrategy
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchPortfolio.showSearchStrategy && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllStrategy}
                    onChange={handleSelectAllForStrategy}
                  />
                  Select all
                </li>
                <li>
                  {uniqueStrategy.map((maxLoss, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={StrategySelected.includes(
                          maxLoss.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeStrategy(maxLoss.toLowerCase())
                        }
                      />
                      <label>{maxLoss}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>Ok</button>
              <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Entry Price": colVisPortfolio["Entry Price"] && (
      <th>
        <div>
          <small>Entry Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
            onClick={() => {
              setShowSearchQtyByExposure((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchQtyByExposure && (
          <div className="Filter-popup">
            <form
              id="filter-form-qty-by-exposure"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllQtyByExposure}
                    onChange={handleSelectAllForQtyByExposure}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataQtyByExposure.map((qtyByExposure, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={qtyByExposureSelected.includes(
                          qtyByExposure.toString(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeQtyByExposure(
                            qtyByExposure.toString(),
                          )
                        }
                      />
                      <label>{qtyByExposure}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button
                onClick={() => setShowSearchQtyByExposure((prev) => !prev)}
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Combined Premuim": colVisPortfolio["Combined Premuim"] && (
      <th>
        <div>
          <small>Combined Premuim</small>
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
    "Per Lot Premuim": colVisPortfolio["Per Lot Premuim"] && (
      <th>
        <div>
          <small>Per Lot Premuim</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSearchMaxLossPerTrade((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Start Time": colVisPortfolio["Start Time"] && (
      <th>
        <div>
          <small>Start Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMaxOpenTrades((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "End Time": colVisPortfolio["End Time"] && (
      <th>
        <div>
          <small>End Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchQtyMultiplier((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "SqOff Time": colVisPortfolio["SqOff Time"] && (
      <th>
        <div>
          <small>SqOff Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMobile((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Range End Time": colVisPortfolio["Range End Time"] && (
      <th>
        <div>
          <small>Range End Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-15px",
            }}
            onClick={() => {
              setShowSearchMobile((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Delta: colVisPortfolio["Delta"] && (
      <th>
        <div>
          <small>Delta</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-40px",
            }}
            onClick={() => {
              setShowSearchEmail((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Theta: colVisPortfolio["Theta"] && (
      <th>
        <div>
          <small>Theta</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-40px",
            }}
            onClick={() => {
              setShowSearchNet((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Vega: colVisPortfolio["Vega"] && (
      <th>
        <div>
          <small>Vega</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-40px",
            }}
          />
        </div>
      </th>
    ),
    Remarks: colVisPortfolio["Remarks"] && (
      <th>
        <div>
          <small>Remarks</small>
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
    Message: colVisPortfolio["Message"] && (
      <th>
        <div>
          <small>Message</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
          />
        </div>
      </th>
    ),
  };
  const filterEmptyRows = (rows) => {
    return rows.filter(row => {
      return Object.values(row).some(value => value !== "");
    });
  };
  const validRows = filterEmptyRows(filteredRows);

  const [newcopy, setNewCopy] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState({}); // Store selected portfolio details

  const handleOpenCopy = (item) => {
    setSelectedPortfolio(item);
    setNewCopy(true);
    setPortfolioName(item.portfolio_name || '');
  };

  const handleCloseCopy = () => {
    setNewCopy(false);
    setPortfolioName(''); // Clear input on close
  };

  const handlenewMakeCopy = async () => {
    try {
      console.log("Selected Portfolio Details:", selectedPortfolio);

      let updatedPortfolioName = portfolioName || selectedPortfolio.portfolio_name;

      const updatedItem = { ...selectedPortfolio, portfolio_name: updatedPortfolioName };

      console.log("Updated Item:", updatedItem);

      const apiUrl = `${import.meta.env.SERVER_HOST}/store_portfolio/${mainUser}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      handlePageClick()
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      handleCloseCopy();
    }
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

                <span className="text-blue-600 font-bold">F&O Trading</span>{" "}
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

                <button
                  onClick={() => navigate("/F&O/AddPortfolio")}
                  className="flex overflow-hidden gap-1 justify-center items-center px-2 py-1 text-xs font-medium leading-none text-white whitespace-nowrap bg-blue-700 rounded-md mr-2"
                  style={{ height: "38px", zIndex: "0" }} // Inline height control
                >
                  <FaPlus className="w-3 h-3" />
                  <span className="self-center">ADD Portfolio</span>
                </button>

                {/* <li>
                <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>Options</span>
                  <i className="fas fa-file-export" style={{ fontSize: "18px", color: "#4661bd" }}></i>

                </div>

              
                <div className="three-options" style={{ marginTop: "-14rem" }}>
                  <div
                    // onClick={() => {
                    //   setMessage(
                    //     "Do you really want to enable All Portfolio's?",
                    //   );
                    //   setShowModal(true);
                    // }}
                  >
                    <span>Enable All Portfolio(s)</span>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div
                    // onClick={() => {
                    //   if (placeOrderStart) {
                    //     setMessage(
                    //       "Trading should be stopped to Delete All Portfolio's?",
                    //     );
                    //     setShowModal(true);
                    //   } else {
                    //     setMessage(
                    //       "Do you really want to Delete All Portfolio's?",
                    //     );
                    //     setShowModal(true);
                    //   }
                    // }}
                  >
                    <span>Delete All Portfolio(s)</span>
                    <i className="fas fa-trash-alt"></i>
                  </div>

                  <div
                    // onClick={() => {
                    //   if (placeOrderStart) {
                    //     setMessage(
                    //       "Trading should be stopped to Delete All Enabled Portfolio's?",
                    //     );
                    //     setShowModal(true);
                    //   } else {
                    //     setMessage(
                    //       "Do you really want to Delete Enabled Portfolio's?",
                    //     );
                    //     setShowModal(true);
                    //   }
                    // }}
                  >
                    <span>Delete Enabled Portfolio(s)</span>
                    <i className="fas fa-trash"></i>
                  </div>
                  <div>
                    <span>Delete Multiple Using Condition</span>
                    <i className="fas fa-filter"></i>
                  </div>
                  <div onClick={handleOpenqtp1}>
                    <span>SqOff All Portfolio(s)</span>
                    <i className="fas fa-power-off"></i>
                  </div>
                  <div>
                    <span>Export Grid</span>
                    <i className="fas fa-table-columns" style={{ fontSize: "18px", color: "#4661bd", marginLeft: "10px" }}></i>

                  </div>
                  <div>
                    <span>Reset Portiolio Form</span>
                    <i className="fas fa-columns" style={{ fontSize: "18px", color: "#4661bd", marginLeft: "10px" }}></i>

                  </div>
                  <div>
                    <span>Portfolio Column Settings</span>
                    <i className="fas fa-columns"></i>
                  </div>
                  <div>
                    <span>Portfolio Leg Col Settings</span>
                    <i className="fas fa-table"></i>
                  </div>
                  <div>
                    <span>User Portfolio Col Settings</span>
                    <i className="fas fa-cog"></i>
                  </div>
                  <div>
                    <span>User Leg Column Settings</span>
                    <i className="fas fa-sliders-h"></i>
                  </div>
                  <div>
                    <span>Clear MTM Analyser Data</span>
                    <i className="fas fa-eraser"></i>
                  </div>
                </div>
              </li>
               */}
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
          // ref={tableRef}
          >
            <table className="table">
              <thead style={{ position: "sticky", top: "0px", zIndex: 10 }}>
                {portfolioSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {portfolioTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody
                className="tabletbody"
                style={{ backgroundColor: "#e8e6e6" }}
              >
                {validRows.length > 0 ? (

                  filteredRows.map((item, index) => {
                    const isExecuted = executedportfolios.includes(
                      item.portfolio_name,
                    );

                    const isExecuted1 = executedPortfolio.some(executedItem =>
                      executedItem.portfolio_name === item.portfolio_name
                    );
                    const portfolioTD = {
                      Enabled: colVisPortfolio["Enabled"] && (
                        <td
                          style={{
                            width: "15%",
                            textAlign: "right",
                            paddingRight: "10px",
                          }}
                          colSpan="2"
                        >
                          {index !== undefined && item.portfolio_name !== "" &&
                            (!isPlusClicked[index] ? (
                              <span
                                style={{
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  marginRight: "55px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handlePlusClick(index);
                                }}
                              >
                                +
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  marginRight: "59px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handlePlusClick(index);
                                }}
                              >
                                -
                              </span>
                            ))}
                          {item.portfolio_name !== "" && (<input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() =>
                              handlechangebox(item.portfolio_name, item.enabled)
                            }
                          />)}
                        </td>
                      ),


                      Status: colVisPortfolio["Status"] && (
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                            value={isExecuted ? "Completed" : ""}
                          />
                        </td>
                      ),
                      "Portfolio Name": colVisPortfolio["Portfolio Name"] && (
                        <td>
                          <input
                            type="text"
                            value={item.portfolio_name}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      PNL: colVisPortfolio["PNL"] && (
                        <td>
                          <input
                            type="text"
                            value={
                              (() => {
                                const totalPNL = item.brokerDetails?.reduce((sum, broker) => {
                                  const pnlValue = parseFloat(Object.values(broker)[0]["P&L"]);
                                  return sum + (isNaN(pnlValue) ? 0 : pnlValue);
                                }, 0);
                                return totalPNL === 0 ? "0" : totalPNL?.toFixed(2);
                              })()
                            }
                            onInput={(e) => {
                              const value = e.target.value;
                              const sanitizedValue = value.replace(/[^0-9]/g, "");
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              padding: "6px",
                              color:
                                item.brokerDetails?.reduce((sum, broker) => {
                                  const pnlValue = parseFloat(Object.values(broker)[0]["P&L"]);
                                  return sum + (isNaN(pnlValue) ? 0 : pnlValue);
                                }, 0) < 0
                                  ? "red"
                                  : "green",
                            }}
                          />
                        </td>
                      ),
                      Symbol: colVisPortfolio["Symbol"] && (
                        <td>
                          <input
                            type="text"
                            value={item.stock_symbol}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Execute/Sq Off": colVisPortfolio["Execute/Sq Off"] && (
                        <td style={{ textAlign: "center" }}>
                          {isExecuted1 ? (
                            <span className="tooltip-container">
                              <img
                                src={close}
                                alt="icon"
                                className="cross_icon"
                                style={{
                                  height: "20px",
                                  width: "20px",
                                }}
                                onClick={() => {
                                  handleSqOffClick(item);
                                }}
                              />
                              <span className="tooltiptext delete-tooltip">
                                Sq Off
                              </span>
                            </span>
                          ) : (
                            <span className="tooltip-container">
                              <img
                                src={Start}
                                alt="icon"
                                className="logout_icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  openModal(item);
                                }}
                              // onClick={openModal}
                              />
                              <span className="tooltiptext -tooltip">
                                Execute
                              </span>
                            </span>
                          )}
                        </td>
                      ),

                      Delete: colVisPortfolio["Delete"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={Recycle}
                              alt="icon"
                              className="cross_icon"
                              style={{
                                height: "20px",
                                width: "20px",
                              }}
                              onClick={() => {
                                handleDelete(item.portfolio_name);
                              }}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Delete
                            </span>
                          </span>
                        </td>
                      ),
                      Edit: colVisPortfolio["Edit"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={Edit}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                handleEdit(item);
                              }}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Edit
                            </span>
                          </span>
                        </td>
                      ),

                      "Make Copy": colVisPortfolio["Make Copy"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={makecopy}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => handleOpenCopy(item)}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Make Copy
                            </span>
                          </span>
                        </td>
                      ),
                      "Mark As Completed": colVisPortfolio[
                        "Mark As Completed"
                      ] && (
                          <td style={{ textAlign: "center" }}>
                            <span className="tooltip-container">
                              <img
                                src={makeascompleted}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={handleMakeAsCompleted}
                              />
                              <button
                                className="tooltiptext delete-tooltip"
                                style={{ width: "9.2rem" }}
                              >
                                Make As Completed
                              </button>
                            </span>
                          </td>
                        ),
                      Reset: colVisPortfolio["Reset"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={reset}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={handleReset}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Reset
                            </span>
                          </span>
                        </td>
                      ),
                      "Pay Off": colVisPortfolio["Pay Off"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={payoff}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={handlePayOff}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Pay Off
                            </span>
                          </span>
                        </td>
                      ),
                      Chat: colVisPortfolio["Chat"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={chart}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={handleChart}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Chat
                            </span>
                          </span>
                        </td>
                      ),
                      "Re Execute": colVisPortfolio["Re Execute"] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={reexecute}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                handleReexecute(item);
                              }}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Re execute
                            </span>
                          </span>
                        </td>
                      ),
                      "Part Entry/Exit": colVisPortfolio["Part Entry/Exit"] && (
                        <td
                          style={{
                            textAlign: "center",
                            // backgroundColor: "#e8e6e6",
                          }}
                        >
                          <span className="tooltip-container">
                            <img
                              src={partentry}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={handlePartEntry}
                            />
                            <span className="tooltiptext delete-tooltip">
                              Part Entry
                            </span>
                          </span>
                        </td>
                      ),
                      "Current Value": colVisPortfolio["Current Value"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Value Per Lot": colVisPortfolio["Value Per Lot"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Underlying LTP": colVisPortfolio["Underlying LTP"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            value={
                              item.stock_symbol === "NIFTY"
                                ? marketData?.nifty50.c
                                : item.stock_symbol === "BANKNIFTY"
                                  ? marketData?.niftybank.c
                                  : item.stock_symbol === "FINNIFTY"
                                    ? marketData?.finnifty.c
                                    : ""
                            }
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),

                      "Positional Portfolio": colVisPortfolio[
                        "Positional Portfolio"
                      ] && (
                          <td>
                            <input
                              type="text"
                              style={{
                                disable: "none",
                                padding: "6px",
                              }}
                            />
                          </td>
                        ),
                      Product: colVisPortfolio["Product"] && (
                        <td>
                          <input
                            type="text"
                            value={item.variety}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      Strategy: colVisPortfolio["Strategy"] && (
                        <td>
                          <input
                            type="text"
                            value={item.strategy}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Entry Price": colVisPortfolio["Entry Price"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Combined Premuim": colVisPortfolio["Combined Premuim"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      "Per Lot Premuim": colVisPortfolio["Per Lot Premuim"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",

                              alignItems: "center",
                            }}
                          />
                        </td>
                      ),
                      "Start Time": colVisPortfolio["Start Time"] && (
                        <td>
                          <input
                            type="text"
                            value={item.start_time}
                            style={{
                              padding: "6px",

                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                      "End Time": colVisPortfolio["End Time"] && (
                        <td>
                          <input
                            type="text"
                            value={item.end_time}
                            style={{
                              disable: "none",
                              padding: "6px",

                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                      "SqOff Time": colVisPortfolio["SqOff Time"] && (
                        <td>
                          <input
                            type="text"
                            value={item.square_off_time}
                            style={{
                              disable: "none",
                              padding: "6px",

                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                      "Range End Time": colVisPortfolio["Range End Time"] && (
                        <td>
                          <input
                            type="text"
                            defaultValue="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",

                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                      Delta: colVisPortfolio["Delta"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              const sanitizedValue = value.replace(
                                /[^0-9.]/g,
                                "",
                              );
                              const formattedValue = sanitizedValue.replace(
                                /(\d)(?=(\d{2})+(?!\.\d))$/,
                                "$1,",
                              );
                              e.target.value = formattedValue;
                            }}
                            style={{
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      Theta: colVisPortfolio["Theta"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              const sanitizedValue = value.replace(/[^0-9]/g, "");
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      Vega: colVisPortfolio["Vega"] && (
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              const sanitizedValue = value.replace(/[^0-9]/g, "");
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      Remarks: colVisPortfolio["Remarks"] && (
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                      Message: colVisPortfolio["Message"] && (
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                    };
                    return (
                      <tr key={index}>
                        {portfolioSeq.map((colName, index) => {
                          return (
                            <React.Fragment key={index}>

                              {portfolioTD[colName]}

                            </React.Fragment>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>

            <Modal
              isOpen={showConfirmDeleteModal}
              onRequestClose={() => setShowConfirmDeleteModal(false)}
              contentLabel="Confirm Delete Modal"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                },
                content: {
                  width: "300px",
                  height: "150px",
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "white",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                },
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                If you proceed, you can't retrieve '{portfolioToDelete}'
                portfolio details?
              </p>
              <div style={{ flex: 1 }}></div>
              <div className="modal-buttons" style={{ marginBottom: "20px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleDeletes(portfolioToDelete);
                  }}
                >
                  Confirm
                </button>
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#5cb85c",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowConfirmDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>

            {isTableOpen && (
              <div>
                <table className="table1">
                  <thead>
                    <tr>
                      <th>SNO1</th>
                      <th>ID</th>
                      <th>SqOff</th>
                      <th>Idle</th>
                      <th>Execute</th>
                      <th>Part Entry/Exit</th>
                      <th>Exchange Symbol</th>
                      <th>Transcation</th>
                      <th>Lots</th>
                      <th>Target Type</th>
                      <th>Target Value</th>
                      <th>Profit Locking</th>
                      <th>SL Type</th>
                      <th>SL Value</th>
                      <th>Trailing SL</th>
                      <th>SL Wait</th>
                      <th>On Target</th>
                      <th>On SL</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subTableData > 0 ? (
                      subTableData.map((item, index) => (
                        <React.Fragment key={index}>
                          {item?.legs?.map((leg, legIndex) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="number"
                                  value={index + 1}
                                  style={{
                                    disable: "none",
                                    textAlign: "center",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    // Remove non-numeric characters
                                    const sanitizedValue = value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                    // Update the input value
                                    e.target.value = sanitizedValue;
                                  }}
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  defaultValue="00:00:00"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={`${leg.expiry_date.slice(0, 5)}, ${leg.option_type}, ${leg.strike}`}
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>

                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                  value={leg.transaction_type}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={leg.lots}
                                  style={{
                                    disable: "none",
                                    textAlign: "center",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    // Remove non-numeric characters
                                    const sanitizedValue = value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                    // Update the input value
                                    e.target.value = sanitizedValue;
                                  }}
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    // Remove non-numeric characters
                                    const sanitizedValue = value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                    // Update the input value
                                    e.target.value = sanitizedValue;
                                  }}
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  onInput={(e) => {
                                    const value = e.target.value;
                                    // Remove non-numeric characters
                                    const sanitizedValue = value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                    // Update the input value
                                    e.target.value = sanitizedValue;
                                  }}
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  defaultValue="0"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                    textAlign: "center",
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  style={{
                                    disable: "none",
                                    padding: "6px",
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <input
                            type="number"
                            value="1"
                            style={{
                              disable: "none",
                              textAlign: "center",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            // value={`${leg.expiry_date.slice(0, 5)}, ${leg.option_type}, ${leg.strike}`}
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          // value={leg.transaction_type}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            // value={leg.lots}
                            style={{
                              disable: "none",
                              textAlign: "center",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <table className="table2">
                  <thead>
                    <tr>
                      <th>Option Portfolio</th>
                      <th>User ID</th>
                      <th>User Alias</th>
                      <th>SqOff</th>
                      <th>Mark As Completed</th>
                      <th>Part Entry/Exit</th>
                      <th>Avg Execution Price</th>
                      <th>PNL</th>
                      <th>CE PNL</th>
                      <th>PE PNL</th>
                      <th>Max PNL</th>
                      <th>Max PNL Time</th>
                      <th>Min PNL</th>
                      <th>Min PNL Time</th>
                      <th>Target</th>
                      <th>SL</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log("subTableData", subTableData)} */}
                    {portfolioDetails[openPortIndex].brokerDetails.length > 0 ? (
                      portfolioDetails[openPortIndex].brokerDetails.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingRight: "15px",
                              }}
                            >
                              {!isPlusClicked1[index] ? (
                                <span
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                  }}
                                  onClick={() => {
                                    handlePlusClick1(index);
                                  }}
                                >
                                  +
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    paddingLeft: "13px",
                                    paddingRight: "10px",
                                  }}
                                  onClick={() => {
                                    handlePlusClick1(index);
                                  }}
                                >
                                  -
                                </span>
                              )}
                              <input
                                type="text"
                                style={{
                                  marginLeft: "10px",
                                  backgroundColor: "#A6D8FF",
                                }}
                              />
                            </div>
                          </td>

                          <td>
                            <input
                              type="text"
                              className="Clickable cell"
                              value={Object.keys(item)[0]}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                minWidth: "100%",
                                minHeight: "20px",
                                border: "1px solid transparent",
                                display: "inline-block",
                                alignItems: "center", // Corrected property
                                justifyContent: "center",
                                scrollbarWidth: "thin", // Set the width of the scrollbar (non-WebKit browsers)
                                maxWidth: "11rem",
                                maxHeight: "50px", // Set a maximum height for the span
                                overflowY: "auto",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.display_name}
                              type="text"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              defaultValue="00:00:00"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={Object.values(item)[0]["P&L"]}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                                color:
                                  Number(Object.values(item)[0]["P&L"]) < 0
                                    ? "red"
                                    : "green",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={Object.values(item)[0]["maxPL"] == "Infinity"
                                ? "0.00"
                                : Object.values(item)[0]["maxPL"]}
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                                color:
                                  Number(Object.values(item)[0]["maxPL"]) < 0
                                    ? "red"
                                    : "green",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              // value={timerValue}
                              value={Object.values(item)[0]["maxPLTime"]}
                              placeholder="00:00:00"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={
                                Object.values(item)[0]["minPL"] == "Infinity"
                                  ? "0.00"
                                  : Object.values(item)[0]["minPL"]
                              }
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                                color:
                                  Number(Object.values(item)[0]["minPL"]) < 0
                                    ? "red"
                                    : "green",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              // value={timerValue}
                              value={Object.values(item)[0]["minPLTime"]}
                              // onChange={handleTimerChange}
                              placeholder="00:00:00"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              // value={Object.values(item)[0]["maxP&L"]}
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                disable: "none",
                                padding: "6px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            className="Clickable cell"
                            // value={Object.keys(item)[ 0 ]}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              minWidth: "100%",
                              minHeight: "20px",
                              border: "1px solid transparent",
                              display: "inline-block",
                              alignItems: "center",
                              justifyContent: "center",
                              scrollbarWidth: "thin",
                              maxWidth: "11rem",
                              maxHeight: "50px",
                              overflowY: "auto",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            // value={item.display_name}
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            // value={Object.values(item)[ 0 ]}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={timerValue}
                            onChange={handleTimerChange}
                            placeholder="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={timerValue}
                            onChange={handleTimerChange}
                            placeholder="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {isTableOpen && isTableOpen1 && (
                  <table className="table3">
                    <thead>
                      <tr>
                        <th>SNO</th>
                        <th>SqOff Leg</th>
                        <th>Part Entry/Exit</th>
                        <th>Exchange Symbol</th>
                        <th>LTP</th>
                        <th>PNL</th>
                        <th>Txn</th>
                        <th>Lots</th>
                        <th>Leg Qty</th>
                        <th>Total Entry Qty</th>
                        <th>Avg Entry Price</th>
                        <th>Entry Filled Qty</th>
                        <th>Avg Exit Price</th>
                        <th>Exit Filled Qty</th>
                        <th>Status</th>
                        <th>Target</th>
                        <th>SL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subTableData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="number"
                              value={index + 1}
                              style={{
                                disable: "none",
                                textAlign: "center",
                                padding: "6px",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.lots}
                              style={{
                                disable: "none",
                                textAlign: "center",
                                padding: "6px",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Place Order Modal"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
              content: {
                width: "300px",
                height: "150px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
              },
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              Do you need to place Order?
            </p>
            <div className="modal-buttons" style={{ marginBottom: "20px" }}>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  placeOrderOptionsQTP(selectedItem);
                  closeModal();
                }}
              >
                YES
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  backgroundColor: "#5cb85c",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={closeModal}
              >
                NO
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={newcopy}
            onRequestClose={handleCloseCopy}
            contentLabel="Confirm Make Copy Modal"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
              content: {
                width: "530px",
                maxWidth: "100%",
                height: "auto",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                background: "white",
                borderRadius: "10px",
                padding: "0px",
                position: "relative",
                top: "50%",
                transform: "translateY(-50%)",
              },
            }}
          >
            {/* Modal Header */}
            <div style={{
              color: "white",
              backgroundColor: "#32406D",
              width: "100%",
              padding: "10px",
              textAlign: "center",
              position: "sticky",
              top: 0,
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              zIndex: 1,
            }}>
              Name Of New Options Portfolio
            </div>

            {/* Modal Body */}
            <p style={{ paddingLeft: "30px", fontWeight: "bold", paddingTop: "15px" }}>
              Enter Name for New Options Portfolio
            </p>
            <div style={{ marginLeft: "30px", marginTop: "20px" }}>
              <input
                type="text"
                placeholder="Portfolio Name"
                style={{ height: "35px", width: "300px", paddingLeft: "10px" }}
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
              <button onClick={handleCloseCopy} style={{ marginRight: '20px', borderRadius: "5px", width: "60px", color: "white", backgroundColor: "red", border: "none" }}>Cancel</button>
              <button
                style={{ borderRadius: "5px", width: "60px", color: "white", backgroundColor: "green", border: "none" }}
                onClick={handlenewMakeCopy} // Call the API when confirming
              >
                Confirm
              </button>
            </div>
          </Modal>
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


      </div>
    </div>
  );
}

export default Portfolio;
