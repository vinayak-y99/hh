'use client';
import React, { useState, useRef, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketIndex from "../components/MarketIndex";
import { FaPlus } from "react-icons/fa"; // Make sure to install react-icons if you haven't already
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { ErrorContainer } from "../components/ErrorConsole";
import RightNav from "../components/RightNav";
import filterIcon from "../assets/newFilter.png";
import Delete from "../assets/recycle5.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Log from "../assets/log.png";
import Start from "../assets/start_2.png";
import Logout from "../assets/logout.png";
import Stop from "../assets/stop.png";
import Stop2 from "../assets/stop2.png";
import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import strategy, { setStrategies } from "../store/slices/strategy";
import { setPortfolios } from "../store/slices/portfolio";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Modal from "react-modal";
import Draggable from "react-draggable";
import TimePicker from 'react-time-picker'

import 'react-time-picker/dist/TimePicker.css';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Strategies() {
  const tableRef = useRef(null);
  const mainUser = cookies.get("USERNAME");

  const { collapsed } = useSelector((state) => state.collapseReducer);

  const dispatch = useDispatch();
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  const [showSelectBox1, setShowSelectBox1] = useState(false);
  const [clearedCells, setClearedCells] = useState([]);
  const [columnHideDropDown, setcolumnHideDropDown] = useState(false);

  const { strategies: data } = useSelector((state) => state.strategyReducer);


  const { executedPortfolios } = useSelector((state) => state.executedPortfolioReducer);
  // console.log(order, "order")



  // const [ data, setData ] = useState(startegyState.strategies);

  // useEffect(() => {
  //   setData(startegyState.strategies);
  // }, [ startegyState.strategies ]);

  // useEffect(() => {
  //   dispatch(
  //     setStrategies({
  //       strategies: data,
  //     }),
  //   );
  // }, [ data ]);

  const [marketOrdersOpen, setMarketOrdersOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedName, setSelectedName] = useState('');


  const handleOpenMarketOrders = (userId, broker, name) => {
    console.log('Opening Market Orders Modal');
    setSelectedUserId(userId);
    setSelectedBroker(broker);
    setSelectedName(name);
    setMarketOrdersOpen(true);
  };

  const handleCloseMarketOrders = () => {
    setMarketOrdersOpen(false);
    setSelectedUserId('');
    setSelectedBroker('');
    setSelectedName('');
    setIsCheckboxChecked(false)
  };

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState("");

  const handleMarketCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };
  const handleOrderTypeChange = (e) => {
    setSelectedOrderType(e.target.value);
  };

  const [brokerName, setBrokerName] = useState([]);
  const [rowData, setRowData] = useState({
    broker: '',
    inputDisabled: true,
  });

  const handleClickOutside = (e) => {
    const allowedElements = [".dropdown-menu", ".popTableHead img"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      setIsdropDownOpenMargin(false);
      setIsdropDownOpenBroker(false);
      setIsdropDownOpenUserID(false);
    }
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  const [filteredRows1, setFilteredRows1] = useState(data);
  // console.log(data,"opoapvk")
  useEffect(() => {
    setFilteredRows1(data);
  }, [data]);

  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows1 = ({
    userIdSelected1,
    maxProfitSelected1,
    maxLossSelected1,
    netSelected1,
    setuniqueDatauserId1,
    setuniqueDataNet1,
    setuniqueDataMaxProfit1,
    setuniqueDataMaxLoss1,
  }) => {
    let prevfilteredRows;
    if (userIdSelected1.length !== 0) {
      prevfilteredRows = data.filter((row) =>
        userIdSelected1.includes(row.StrategyLabel.toLowerCase()),
      );
    } else {
      prevfilteredRows = data;
    }
    if (netSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        netSelected1.includes(row.PL.toLowerCase()),
      );
    }
    if (maxProfitSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxProfitSelected1.includes(row.MaxProfit.toLowerCase()),
      );
    }
    if (maxLossSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossSelected1.includes(row.MaxLoss.toLowerCase()),
      );
    }
    setFilteredRows1(prevfilteredRows);

    const arrayNames = [
      "userIdSelected1",
      "maxProfitSelected1",
      "netSelected1",
      "maxLossSelected1",
    ];

    const arrays = [
      userIdSelected1,
      maxProfitSelected1,
      netSelected1,
      maxLossSelected1,
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

    if (NameOfNonEmptyArray !== "userIdSelected1") {
      setuniqueDatauserId1(() => {
        return Array.from(
          new Set(prevfilteredRows.map((row) => row.StrategyLabel)),
        );
      });
    }
    if (NameOfNonEmptyArray !== "netSelected1") {
      setuniqueDataNet1(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((row) => {
              if (row.PL !== "") {
                return row.PL;
              }
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxProfitSelected1") {
      setuniqueDataMaxProfit1(() => {
        return Array.from(
          new Set(prevfilteredRows.map((row) => row.MaxProfit)),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxLossSelected1") {
      setuniqueDataMaxLoss1(() => {
        return Array.from(new Set(prevfilteredRows.map((row) => row.MaxLoss)));
      });
    }
  };

  const handleOkClick1 = () => {
    updateFilteredRows1({
      userIdSelected1,
      setuserIdSelected1,
      setSelectAllForId1,
      maxProfitSelected1,
      maxLossSelected1,
      setMaxProfitSelected1,
      setMaxLossSelected1,
      setSelectAllMaxProfit1,
      setSelectAllMaxLoss1,
      netSelected1,
      setNetSelected1,
      setSelectAllNet1,
      setuniqueDatauserId1,
      setuniqueDataNet1,
      setuniqueDataMaxProfit1,
      setuniqueDataMaxLoss1,
    });
    if (userIdSelected1) {
      setShowSearchId1(false);
    }
    if (maxProfitSelected1) {
      setShowSearchMaxProfit1(false);
    }
    if (maxLossSelected1) {
      setShowSearchMaxLoss1(false);
    }
    if (netSelected1) {
      setShowSearchNet1(false);
    }
  };

  const [showSearchId1, setShowSearchId1] = useState(false);
  const [showSearchMaxProfit1, setShowSearchMaxProfit1] = useState(false);
  const [showSearchMaxLoss1, setShowSearchMaxLoss1] = useState(false);
  const [showSearchNet1, setShowSearchNet1] = useState(false);

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setShowSearchId1(false);
      setShowSearchMaxProfit1(false);
      setShowSearchMaxLoss1(false);
      setShowSearchNet1(false);
    }
  };

  const [selectAllForId1, setSelectAllForId1] = useState(false);
  const [selectAllNet1, setSelectAllNet1] = useState(false);
  const [selectAllMaxProfit1, setSelectAllMaxProfit1] = useState(false);
  const [selectAllMaxLoss1, setSelectAllMaxLoss1] = useState(false);

  const [uniqueDatauserId1, setuniqueDatauserId1] = useState([]);
  const [uniqueDataNet1, setuniqueDataNet1] = useState([]);
  const [uniqueDataMaxProfit1, setuniqueDataMaxProfit1] = useState([]);
  const [uniqueDataMaxLoss1, setuniqueDataMaxLoss1] = useState([]);

  const [userIdSelected1, setuserIdSelected1] = useState([]);
  const [maxProfitSelected1, setMaxProfitSelected1] = useState([]);
  const [netSelected1, setNetSelected1] = useState([]);
  const [maxLossSelected1, setMaxLossSelected1] = useState([]);

  useEffect(() => {
    //// console.log("stpage data", data)
    setuniqueDatauserId1(
      data ? [...new Set(data.map((d) => d.StrategyLabel))] : [],
    );

    setuniqueDataMaxProfit1(
      data ? [...new Set(data.map((d) => d.MaxProfit))] : [],
    );

    setuniqueDataMaxLoss1(data ? [...new Set(data.map((d) => d.MaxLoss))] : []);

    setuniqueDataNet1([
      ...new Set(
        data.map((d) => {
          if (d.PL !== "") {
            return d.PL;
          }
        }),
      ),
    ]);
  }, [data]);

  const handleCheckboxChangeNet1 = (PL) => {
    const isSelected = netSelected1.includes(PL);
    if (isSelected) {
      setNetSelected1(netSelected1.filter((item) => item !== PL));
      setSelectAllNet1(false);
    } else {
      setNetSelected1((prevSelected) => [...prevSelected, PL]);
      setSelectAllNet1(netSelected1.length === uniqueDataNet1.length - 1);
    }
  };

  const handleSelectAllForNet1 = () => {
    const allChecked = !selectAllNet1;
    setSelectAllNet1(allChecked);

    if (allChecked) {
      setNetSelected1(uniqueDataNet1.map((d) => d));
    } else {
      setNetSelected1([]);
    }
  };

  const handleCheckboxChangeUser1 = (StrategyLabel) => {
    const isSelected = userIdSelected1.includes(StrategyLabel);
    if (isSelected) {
      setuserIdSelected1(
        userIdSelected1.filter((item) => item !== StrategyLabel),
      );
      setSelectAllForId1(false);
    } else {
      setuserIdSelected1((prevSelected) => [...prevSelected, StrategyLabel]);
      setSelectAllForId1(
        userIdSelected1.length === uniqueDatauserId1.length - 1,
      );
    }
  };

  const handleSelectAllForUserId1 = () => {
    const allChecked = !selectAllForId1;
    setSelectAllForId1(allChecked);
    if (allChecked) {
      setuserIdSelected1(uniqueDatauserId1.map((d) => d.toLowerCase()));
    } else {
      setuserIdSelected1([]);
    }
  };

  const handleCheckBoxChangeForMaxProfit1 = (MaxProfit) => {
    const isSelected = maxProfitSelected1.includes(MaxProfit);
    if (isSelected) {
      setMaxProfitSelected1((prevSelected) =>
        prevSelected.filter((item) => item !== MaxProfit),
      );
      setSelectAllMaxProfit1(false);
    } else {
      setMaxProfitSelected1((prevSelected) => [...prevSelected, MaxProfit]);
      setSelectAllMaxProfit1(
        maxProfitSelected1.length === uniqueDataMaxProfit1.length - 1,
      );
    }
  };

  const handleCheckBoxChangeForMaxLoss1 = (MaxLoss) => {
    const isSelected = maxLossSelected1.includes(MaxLoss);
    if (isSelected) {
      setMaxLossSelected1((prevSelected) =>
        prevSelected.filter((item) => item !== MaxLoss),
      );
      setSelectAllMaxLoss1(false);
    } else {
      setMaxLossSelected1((prevSelected) => [...prevSelected, MaxLoss]);
      setSelectAllMaxLoss1(
        maxLossSelected1.length === uniqueDataMaxLoss1.length - 1,
      );
    }
  };

  const handleSelectAllForMaxProfit1 = () => {
    const allChecked = !selectAllMaxProfit1;
    setSelectAllMaxProfit1(allChecked);

    if (allChecked) {
      setMaxProfitSelected1(uniqueDataMaxProfit1.map((d) => d.toString()));
    } else {
      setMaxProfitSelected1([]);
    }
  };

  const handleSelectAllForMaxLoss1 = () => {
    const allChecked = !selectAllMaxLoss1;
    setSelectAllMaxLoss1(allChecked);

    if (allChecked) {
      setMaxLossSelected1(uniqueDataMaxLoss1.map((d) => d.toString()));
    } else {
      setMaxLossSelected1([]);
    }
  };
  const [dataNew, setDataNew] = useState([
    // {
    //   Select: false,
    //   UserID: "1234567",
    //   Alias: "name",
    //   Multiplier: 1,
    //   Broker: "pseudoaccount",
    //   Margin: "100000",
    // },
    // Add more objects for additional rows...
  ]);

  const errorContainerRef = useRef(null);
  // Error Message start
  const [msgs, setMsgs] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [filteredDataNew, setfilteredDataNew] = useState([]);

  useEffect(() => {
    setfilteredDataNew(dataNew);
  }, [dataNew]);

  // useEffect(() => {
  ////   console.log("filteredDataNew", filteredDataNew)
  // }, [ filteredDataNew ])

  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
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
  // Error Message end
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  // st colvisible
  const addNewRow = () => {
    const mandatoryFields = ["StrategyLabel", "TradingAccount"];

    const lastRow = data[data.length - 1];
    const allFieldsFilled = mandatoryFields.every((field) => lastRow[field]);

    if (allFieldsFilled) {
      setIsErrorDisplayed(false);

      const newStrategyLabel = lastRow["StrategyLabel"];
      const isUnique =
        data.length < 2 ||
        data
          .slice(0, -1)
          .every((row) => row["StrategyLabel"] !== newStrategyLabel);

      if (isUnique) {
        setIsErrorDisplayed(false);

        const newRow = {
          // Action: {
          enabled: true,
          logged: false,
          // },
          ManualSquareOff: "",
          StrategyLabel: "",
          PL: "0",
          TradeSize: "0",
          DuplicateSignalPrevention: "0",
          OpenTime: "00:00:00",
          CloseTime: "00:00:00",
          SqOffTime: "00:00:00",
          TradingAccount: "",
          MaxProfit: "0",
          MaxLoss: "0",
          MaxLossWaitTime: "00:00:00",
          ProfitLocking: "0",
          DelayBetweenUsers: "0",
          UniqueIDReqforOrder: "",
          CancelPreviousOpenSignal: "",
          StopReverse: "",
          PartMultiExists: "",
          HoldSellSeconds: "00",
          AllowedTrades: true,
          EntryOrderRetry: false,
          EntryRetryCount: "0",
          EntryRetryWaitSeconds: "00",
          ExitOrderRetry: false,
          ExitRetryCount: "0",
          ExitRetryWaitSeconds: "00",
          ExitMaxWaitSeconds: "00",
          SqOffDone: "",
          Delta: "0",
          Theta: "0",
          Vega: "0",
        };

        // setData((prevData) => [ ...prevData, newRow ]);
        dispatch(
          setStrategies({
            strategies: [...data, newRow],
          }),
        );
      } else {
        if (!isErrorDisplayed) {
          handleMsg({
            msg: "Please enter a unique strategy label before adding a new row.",
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
            strategy: "strategy",
          });
          setIsErrorDisplayed(true);
        }
      }
    } else {
      if (!isErrorDisplayed) {
        handleMsg({
          msg: "Please enter strategy label and trading account before adding a new row.",
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: "strategy",
        });
        setIsErrorDisplayed(true);
      }
    }
  };

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = 0; /* Set to a larger value */
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    }, 100); // Adjust the timeout as needed

    return () => clearTimeout(scrollTimeout); // Clear the timeout if the component unmounts or data changes
  }, [data.length]);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleCellClick = (tradingAccountData, index) => {
    //console.log(tradingAccountData, "tradingAccountData")
    if (!data[index].StrategyLabel) {
      handleMsg({
        msg: "Please enter the Strategy Label",
        logType: "WARNING",
        timestamp: ` ${new Date().toLocaleString()}`,
        strategy: "strategy",
      });
    } else {
      setSelectedTradingAccount({
        ...tradingAccountData,
        StrategyLabel: data[index].StrategyLabel,
      });
      setModalOpen(true);
      setClickedRowIndex(index); // Save the index of the clicked row
      // setting checkbox ticked
      const checkedboxes = data[index].TradingAccount.split(",").map((item) =>
        item.trim(),
      );

      setDataNew((prevData) => {
        return prevData.map((item) => {
          if (checkedboxes.includes(item.UserID.trim())) {
            return { ...item, Select: true };
          }
          return item; // Return unchanged for other objects
        });
      });
    }
  };
  const [selectedTradingAccount, setSelectedTradingAccount] = useState(null);

  const handleCloseModal = () => {
    setSelectedTradingAccount(null);
    setModalOpen(false);
    // Unchecking all checkboxes
    setDataNew((prevData) => {
      return prevData.map((item) => {
        return { ...item, Select: false };
      });
    });
  };
  const [clickedRowIndex, setClickedRowIndex] = useState(-1);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAll = () => {
    setisPopUpDataChanged(true);
    const allChecked = dataNew.every((item) => item.Select);
    setSelectAllChecked(!allChecked);
    setDataNew((prevData) =>
      prevData.map((item) => {
        return { ...item, Select: !allChecked };
      }),
    );
  };

  const [isdropDownOpenUserID, setIsdropDownOpenUserID] = useState(false);
  const [isdropDownOpenBroker, setIsdropDownOpenBroker] = useState(false);
  const [isdropDownOpenMargin, setIsdropDownOpenMargin] = useState(false);
  const [isdropDownOpenAlias, setIsdropDownOpenAlias] = useState(false);

  const [isPopUpDataChanged, setisPopUpDataChanged] = useState(false);

  const handleCheckboxChange = (index) => {
    //// console.log("handleCheckboxChange ");
    setisPopUpDataChanged(true);
    // const newData = dataNew.map((item, i) => ({
    //   ...item,
    //   Select: i === index ? !item.Select : item.Select,
    // }));
    setDataNew((prevDaata) => {
      const newData = prevDaata.map((item, i) => ({
        ...item,
        Select: i === index ? !item.Select : item.Select,
      }));
      //// console.log("newData", newData);
      setSelectAllChecked(newData.every((item) => item.Select));
      return newData;
    });
  };

  useEffect(() => {
    setSelectAllChecked(
      dataNew.length > 0 && dataNew.every((item) => item.Select),
    );
  }, [dataNew]);

  const isAtLeastOneItemSelected = () => {
    const selectedItems = dataNew
      // .slice(1)
      .filter((item) => item.Select === true);
    return selectedItems.length > 0;
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
      console.error("Error:", error);
    }
  };

  const handleConfirm = () => {
    setisPopUpDataChanged(false);
    const selectedStrategies = dataNew.filter((item) => item.Select === true);
    const stringVal = selectedStrategies.map((item) => item.UserID).join(", ");
    const newData = [...data];
    if (clickedRowIndex !== -1) {
      newData[clickedRowIndex] = {
        ...newData[clickedRowIndex],
        TradingAccount: stringVal || "",
      };
      //// console.log("Updated Data:", newData);
    }
    dispatch(
      setStrategies({
        strategies: newData,
      }),
    );
    const postBroker = async () => {
      const username = cookies.get("USERNAME");
      try {
        const postdata = {
          broker_user_id: selectedStrategies.map((item) => {
            return item.UserID;
          }),
          broker: selectedStrategies.map((item) => {
            return item.Broker;
          }),
          multiplier: selectedStrategies.map((item) => {
            return item.Multiplier !== undefined ? item.Multiplier : "1";
          }),
          strategy_tag: data[clickedRowIndex].StrategyLabel,
          alias: selectedStrategies.map((item) => {
            return item.Alias;
          }),
        };
        //// console.log(postdata, "postdata");
        //// console.log(selectedStrategies, "selectedStrategies");
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/store_broker_and_strategy_info`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postdata),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          //// console.log("error-post", errorData);
          throw {
            message:
              errorData.message || "Something bad happened. Please try again",
          };
        }
        const responseData = await response.json();
        handleMsg({
          msg: responseData.message,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: data[clickedRowIndex].StrategyLabel,
        });
      } catch (error) {
        //// console.log(error.message);

        handleMsg({
          msg: error.message,
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: data[clickedRowIndex].StrategyLabel,
        });
      }
    };

    handleCloseModal();
    postBroker().then(() => {
      handlePageClick();
    });
  };

  const { brokers } = useSelector((state) => state.brokerReducer);
  // console.log(brokers, "brokers")

  const handleBrokerSquareOff = async (rowData, strategyLabel, brokerType) => {
    const response1 = await fetch(
      `${import.meta.env.SERVER_HOST}/${brokerType}_strategy_options_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response1.ok) {
      const errorData1 = await response1.json();
      handleMsg({
        msg: errorData1.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId,
        strategy: strategyLabel,
      });
    } else {
      const responseData1 = await response1.json();
      handleMsg({
        msg: responseData1.message,
        logType: "TRADING",
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId,
        strategy: strategyLabel,
      });
    }

    const response2 = await fetch(
      `${import.meta.env.SERVER_HOST}/${brokerType}_strategy_equity_sqoff/${mainUser}/${strategyLabel}/${rowData.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response2.ok) {
      const errorData2 = await response2.json();
      handleMsg({
        msg: errorData2.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId,
        strategy: strategyLabel,
      });
    } else {
      const responseData2 = await response2.json();
      handleMsg({
        msg: responseData2.message,
        logType: "TRADING",
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId,
        strategy: strategyLabel,
      });
    }
  };

  const handleManualSquareOff = async (strategyLabel, TradingAccount) => {
    try {
      const mappedUserIds = TradingAccount.split(", ");
      const requests = [];

      for (let index = 0; index < mappedUserIds.length; index++) {
        const rowData = brokers.find(
          (row) => row.userId === mappedUserIds[index],
        );

        if (rowData.inputDisabled) {
          switch (rowData.broker) {
            case "fyers":
              requests.push(
                handleBrokerSquareOff(rowData, strategyLabel, "fyers"),
              );
              break;
            case "flattrade":
              requests.push(
                handleBrokerSquareOff(rowData, strategyLabel, "flattrade"),
              );
              break;
            case "angelone":
              requests.push(
                handleBrokerSquareOff(rowData, strategyLabel, "angelone"),
              );
              break;
            case "pseudo_account":
              requests.push(
                handleBrokerSquareOff(rowData, strategyLabel, "pseudo"),
              );
            default:
              break;
          }
        } else {
          handleMsg({
            msg: "Please Login to Broker Account",
            logType: "TRADING",
            timestamp: `${new Date().toLocaleString()}`,
            user: rowData.userId,
            strategy: strategyLabel,
          });
        }
      }
      await Promise.all(requests);
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  const handleInputChangeInputs = (index, fieldName, value) => {
    setDataNew((prevData) => {
      const selectedStrategies = prevData.filter(
        (item) => item.Select === true,
      );

      if (
        selectedStrategies.find(
          (item) => item.UserID === prevData[index].UserID,
        )
      ) {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          [fieldName]: value,
        };
        return newData;
      }

      return prevData;
    });
  };

  useEffect(() => {
    const fetchData = async (username, strategy_tag) => {
      try {
        const response = await fetch(`${import.meta.env.SERVER_HOST}/get_startegy_account/${username}/${strategy_tag}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);

        const newData = data.data.map((account) => ({
          Select: false,
          UserID: account.broker_id,
          Broker: account.broker,
          Alias: account.display_name,
          Multiplier: selectedTradingAccount
            ? account.multiplier[selectedTradingAccount.StrategyLabel]
            : 1,
          Margin: brokers.filter((row) => account.broker_id === row.userId)[0]
            ? brokers.filter((row) => account.broker_id === row.userId)[0]
              .availableMargin
            : 0,
        }));

        // const postData = [
        //   {
        //     Select: false,
        //     UserID: "1234567",
        //     Alias: "name",
        //     Multiplier: 1,
        //     Broker: "pseudoaccount",
        //     Margin: "100000",
        //   },
        //   ...newData, // Include the remaining newData
        // ];

        const updatedDataNew = newData.map((item, index) => ({
          ...item,
          Select: dataNew[index] ? dataNew[index].Select : false,
        }));

        setDataNew(updatedDataNew);
        setfilteredDataNew(updatedDataNew);

        //// console.log(newData, 'newdataprinting');
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(cookies.get("USERNAME","strategy_tag"));
  }, [selectedTradingAccount]);

  const [allStrategiesList, setallStrategiesList] = useState([]);

  const stPageCols = [
    "Action",
    "Manual Square Off",
    "Strategy Label",
    "P L",
    "Trade Size",
    "Duplicate Signal Prevention",
    "Open Time",
    "Close Time",
    "Sq Off Time",
    "Trading Account",
    "Max Profit",
    "Max Loss",
    "Max Loss Wait Time",
    "Profit Locking",
    "Market Orders",
    "Delay Between Users",
    "Unique ID Req for Order",
    "Cancel Previous Open Signal",
    "Stop Reverse",
    "Part Multi Exists",
    "Hold Sell Seconds",
    "Allowed Trades",
    "Entry Order Retry",
    "Entry Retry Count",
    "Entry Retry Wait Seconds",
    "Exit Order Retry",
    "Exit Retry Count",
    "Exit Retry Wait Seconds",
    "Exit Max Wait Seconds",
    "Sq Off Done",
    "Delta",
    "Theta",
    "Vega",
  ];

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const [stColVis, setstColVis] = useState(allVisState.strategiesVis);

  // empty state define
  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );
  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const username = cookies.get("USERNAME");

  const handleStrategyRowDelete = async (index) => {
    try {
      const strategyLabel = data[index]?.StrategyLabel;
      const tradingAccount = data[index]?.TradingAccount;
      const portfolios = portfolioDetails.filter(
        (portfolio) => portfolio.strategy === strategyLabel,
      );
      const names = portfolios.map((port) => {
        return port.portfolio_name;
      });

      if (portfolios.length !== 0) {
        setErrorMessage(
          `Please delete the portfolios linked with ${strategyLabel} strategy: ${names.join(", ")}. `,
        );
        setShowModal(true);
        return;
      }

      if (!username || !strategyLabel || !tradingAccount) {
        // If required data is not present, only update UI state without fetch request
        const updatedRows = data.filter((_, i) => i !== index);
        dispatch(
          setStrategies({
            strategies: updatedRows,
          }),
        );

        // Display success message for row deletion
        handleMsg({
          msg: `Row Deleted  Successfully`,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: "strategy",
        });

        return; // Exit the function without making a fetch request
      }

      // Make DELETE request
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/delete_strategy_tag/${userId}/${strategyLabel}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something bad hapened. Please try again",
        );
      }

      // Update UI state after successful fetch request
      const updatedRows = data.filter((_, i) => i !== index);
      dispatch(
        setStrategies({
          strategies: updatedRows,
        }),
      );

      // Display success message for fetch request
      const responseData = await response.json();
      handleMsg({
        msg: `${responseData.message} - ${strategyLabel}`,
        logType: "MESSAGE",
        timestamp: `${new Date().toLocaleString()}`,
        strategy: strategyLabel,
      });
    } catch (error) {
      // Handle errors during the fetch request or invalid data
      // console.error("Error:", error.message);
      handleMsg({
        msg: error.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        strategy: "strategy",
      });
    }
  };

  const handleInputChange = (index, fieldName, value) => {
    let newData = [...data];
    const newStrategyLabel = value.toUpperCase().trim();

    const setCellAndFocus = (message) => {
      newData[index] = {
        ...newData[index],
        [fieldName]: "",
      };

      setClearedCells((prevClearedCells) => [...prevClearedCells, index]);

      const currentRowInput = document.getElementById(
        `input_${index}_StrategyLabel`,
      );
      if (currentRowInput) {
        currentRowInput.focus();
      }

      handleMsg({
        msg: message,
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
        strategy: "strategy",
      });
    };

    if (fieldName === "StrategyLabel" && newStrategyLabel !== "") {
      const isAlphaOnly = /^[a-zA-Z]+$/.test(newStrategyLabel);
      const isAlphaNumeric = /^[a-zA-Z0-9]+$/.test(newStrategyLabel);
      const isNumericOnly = /^[0-9]+$/.test(newStrategyLabel);

      if (!isAlphaOnly && (!isAlphaNumeric || isNumericOnly)) {
        setCellAndFocus("Strategy Label must start with alphabets.");
        return;
      }

      const isUnique =
        newData.length < 2 ||
        newData
          .slice(0, -1)
          .every(
            (row) => row["StrategyLabel"].toUpperCase() !== newStrategyLabel,
          );

      if (!isUnique) {
        setCellAndFocus("Strategy tag must be unique");
        return;
      } else {
        setClearedCells((prevClearedCells) =>
          prevClearedCells.filter((clearedIndex) => clearedIndex !== index),
        );
      }
    }

    newData[index] = {
      ...newData[index],
      [fieldName]: newStrategyLabel,
    };

    dispatch(
      setStrategies({
        strategies: newData,
      }),
    );
  };

  const updateActionProperty = (index, property, value) => {
    // setData((prevData) => {
    // Create a copy of the data array
    let newData = data.map((rowData, i) => {
      if (index === i) {
        const updatedRow = { ...rowData };
        updatedRow[property] = value;
        return updatedRow;
      } else {
        return rowData;
      }
    });
    //// console.log("newData 1", newData)
    // Create a copy of the Action object for the specified index
    // newData[index][property] = value
    //// console.log("newData 2", newData)
    // const updatedAction = { ...newData[index] };

    // // Update the specified property inside the Action object
    // updatedAction[property] = value;

    // // Update the Action object inside the data array for the specified index
    // newData[index] = { ...newData[index]};

    // return newData;
    dispatch(
      setStrategies({
        strategies: newData,
      }),
    ); // Update the state with the new data array
    // });
  };

  const [stColsSelectedALL, setstColsSelectedALL] = useState(false);

  const stPageColSelectAll = () => {
    setstColsSelectedALL((prev) => !prev);
    stPageCols.map((stPageCol) => {
      setstColVis((prev) => ({
        ...prev,
        [stPageCol]: stColsSelectedALL,
      }));
    });
  };

  const [strategiesSeq, setstrategiesSeq] = useState(allSeqState.strategiesSeq);

  useEffect(() => {
    setstrategiesSeq(allSeqState.strategiesSeq);
    setstColVis((prev) => {
      const colVis = {};
      Object.keys(stColVis).map((col) => {
        if (allSeqState.strategiesSeq.includes(col)) {
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
        strategiesVis: stColVis,
      }),
    );
    if (new Set(Object.values(stColVis)).size === 1) {
      if (Object.values(stColVis).includes(true)) {
        setstrategiesSeq(stPageCols);
      } else {
        setstrategiesSeq([]);
      }
    }
  }, [stColVis]);

  useEffect(() => {
    //// console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        strategiesSeq: strategiesSeq,
      }),
    );
  }, [strategiesSeq]);

  const [actionFilter, setActionFilter] = useState("all");

  const maxProfitLoss = async (maxProfit, maxLoss, strategyLabel, OpenTime, CloseTime, SqOffTime) => {
    try {
      // if (maxProfit !== "0" && maxLoss !== "0") {
      const maxValues = {
        max_profit: maxProfit,
        max_loss: maxLoss,
        open_time: OpenTime,
        close_time: CloseTime,
        square_off_time: SqOffTime,
      };

      console.log(maxValues, "maxValues")

      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/${mainUser}/${strategy_tag}/max_profit_loss`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(maxValues),
        },
      );
      //// console.log(response, "response")

      if (response.ok) {
        const res = await response.json();
        //// console.log("res", res);
      } else {
        console.error("Failed to update maxProfitLoss");
      }
      // } else {
      ////   console.log("Both maxProfit and maxLoss should be non-zero to make the API call.");
      // }
    } catch (error) {
      console.error("Error updating maxProfitLoss:", error);
    }
  };


  const [showPopup, setShowPopup] = useState(false);
  const [popupValues, setPopupValues] = useState({
    index: "",
    profitReaches: "",
    lockMinimumProfit: "",
    increaseInProfit: "",
    trailProfitBy: "",
  });

  useEffect(() => {
    if (!showPopup) {
      setPopupValues({
        index: "",
        profitReaches: "",
        lockMinimumProfit: "",
        increaseInProfit: "",
        trailProfitBy: "",
      });
    }
  }, [showPopup]);
  const popupRef = useRef(null);

  const handleClickOutsidePtLock = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsidePtLock);
    return () => {
      document.removeEventListener("click", handleClickOutsidePtLock);
    };
  }, []);

  const togglePopup = (index) => {
    const profitLocking = data
      .filter((row, i) => index === i)[0]
      ?.ProfitLocking.split("~");
    //// console.log("profitlocking of row", profitLocking)
    const profitReaches = profitLocking[0];
    const lockMinimumProfit = profitLocking[1];
    const increaseInProfit = profitLocking[2];
    const trailProfitBy = profitLocking[3];
    setPopupValues((prev) => ({
      ...prev,
      profitReaches: profitReaches,
      lockMinimumProfit: lockMinimumProfit,
      increaseInProfit: increaseInProfit,
      trailProfitBy: trailProfitBy,
    }));
    setShowPopup(!showPopup);
  };

  const handleInputChangePtLock = (name, value) => {
    setPopupValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const updateUserProfitLocking = async (
    strategy_tag,
    profitReachesValue,
    lockProfitValue,
    increaseInProfit,
    trailProfitBy,
  ) => {
    //// console.log("abc", popupValues.index, `${profitReachesValue}~${lockProfitValue}~${increaseInProfit}~${trailProfitBy}`)
    const response = await fetch(
      `${import.meta.env.SERVER_HOST}/update_strategy_profit_locking/${mainUser}/${strategy_tag}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profit_locking: `${profitReachesValue},${lockProfitValue},${increaseInProfit},${trailProfitBy}`,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json();
      //console.log("error", err);
    }
  };

  const handleSetTrailTGT = () => {
    let profitReachesValue = document.getElementById("trail_tgt_0").value;
    let lockProfitValue = document.getElementById("trail_tgt_1").value;
    let increaseInProfitValue = document.getElementById("trail_tgt_2").value;
    let trailProfitByValue = document.getElementById("trail_tgt_3").value;

    document.getElementById("profitReachesError").innerText = "";
    document.getElementById("lockProfitError").innerText = "";
    document.getElementById("increaseInProfitError").innerText = "";
    document.getElementById("trailProfitByError").innerText = "";

    if (
      (profitReachesValue && !lockProfitValue) ||
      (!profitReachesValue && lockProfitValue)
    ) {
      if (!profitReachesValue) {
        document.getElementById("profitReachesError").innerText =
          "Value is required.";
      } else {
        document.getElementById("lockProfitError").innerText =
          "Value is required.";
      }
      return;
    }

    if (
      (increaseInProfitValue && !trailProfitByValue) ||
      (!increaseInProfitValue && trailProfitByValue)
    ) {
      if (!increaseInProfitValue) {
        document.getElementById("increaseInProfitError").innerText =
          "Value is required.";
      } else {
        document.getElementById("trailProfitByError").innerText =
          "Value is required.";
      }
      return;
    }
    //// console.log("abc", popupValues.index, `${profitReachesValue}~${lockProfitValue}~${increaseInProfitValue}~${trailProfitByValue}`)
    let updatestrategies = [...data];
    const strategy = { ...updatestrategies[popupValues.index] };
    strategy.ProfitLocking = `${profitReachesValue}~${lockProfitValue}~${increaseInProfitValue}~${trailProfitByValue}`;
    updatestrategies[popupValues.index] = strategy;
    dispatch(
      setStrategies({
        strategies: updatestrategies,
      }),
    );

    const strategy_tag = data.filter((row, i) => popupValues.index === i)[0]
      ?.StrategyLabel;

    updateUserProfitLocking(
      strategy_tag,
      profitReachesValue,
      lockProfitValue,
      increaseInProfitValue,
      trailProfitByValue,
    );
    setShowPopup(false);
  };

  const handleInputDelete = () => {
    let updatestrategies = [...data];
    const strategy = { ...updatestrategies[popupValues.index] };
    strategy.ProfitLocking = "~~~";
    updatestrategies[popupValues.index] = strategy;
    dispatch(
      setStrategies({
        strategies: updatestrategies,
      }),
    );

    const strategy_tag = data.filter((row, i) => popupValues.index === i)[0]
      ?.StrategyLabel;

    updateUserProfitLocking(strategy_tag, "", "", "", "");

    setPopupValues((prev) => ({
      // index : '',
      ...prev,
      profitReaches: "",
      lockMinimumProfit: "",
      increaseInProfit: "",
      trailProfitBy: "",
    }));
  };


  const strategiesTH = {
    Action: stColVis["Action"] && (
      <th>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "5px",
            }}
            onClick={() => {
              setShowSelectBox1((prev) => !prev);
            }}
          />
        </div>
        {showSelectBox1 && (
          <div>
            {/* Inside your <select> element */}
            <select
              type="text"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{
                padding: "0.1rem 0.3rem",
                width: "100%",
                margin: "1px",
              }}
            >
              <option value="all">All</option>
              <option value="checked">Enable</option>
              <option value="unchecked">Disable</option>
            </select>
          </div>
        )}
      </th>
    ),
    "Manual Square Off": stColVis["Manual Square Off"] && (
      <th>
        <div>
          <small>Manual Square Off</small>
        </div>
      </th>
    ),
    "Strategy Label": stColVis["Strategy Label"] && (
      <th>
        <div>
          <small>Strategy Label</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-15px",
            }}
            onClick={() => {
              setShowSearchId1((prev) => !prev);
              setShowSearchMaxProfit1(false);
              setShowSearchMaxLoss1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>
        {showSearchId1 && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllForId1}
                    onChange={handleSelectAllForUserId1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDatauserId1
                    .filter((name) => name !== undefined)
                    .map((StrategyLabel, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={userIdSelected1.includes(
                              StrategyLabel.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeUser1(
                                StrategyLabel.toLowerCase(),
                              )
                            }
                          />
                          <label>{StrategyLabel}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>

            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchId1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "P L": stColVis["P L"] && (
      <th>
        <div>
          <small>P&L</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setShowSearchNet1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxProfit1(false);
              setShowSearchMaxLoss1(false);
            }}
          />
        </div>

        {showSearchNet1 && (
          <div className="Filter-popup">
            <form id="filter-form-net" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllNet1}
                    onChange={handleSelectAllForNet1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNet1
                    .filter((name) => name !== undefined)
                    .map((PL, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={netSelected1.includes(PL)}
                          onChange={() => handleCheckboxChangeNet1(PL)}
                        />
                        <label>{PL}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchNet1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Trade Size": stColVis["Trade Size"] && (
      <th>
        <div>
          <small>Trade Size</small>
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
    "Duplicate Signal Prevention": stColVis["Duplicate Signal Prevention"] && (
      <th>
        <div>
          <small>
            Duplicate Signal
            Prevention
          </small>
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
    "Open Time": stColVis["Open Time"] && (
      <th>
        <div>
          <small>Open Time</small>
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
    "Close Time": stColVis["Close Time"] && (
      <th>
        <div>
          <small>Close Time</small>
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
    "Sq Off Time": stColVis["Sq Off Time"] && (
      <th>
        <div>
          <small>Sq Off Time</small>
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
    "Trading Account": stColVis["Trading Account"] && (
      <th>
        <div style={{ display: "flex", alignItems: "center" }}>
          <small>Trading Account</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginRight: "36%",
            }}
          />
        </div>
      </th>
    ),
    "Max Profit": stColVis["Max Profit"] && (
      <th>
        <div>
          <small>Max Profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-18px",
            }}
            onClick={() => {
              setShowSearchMaxProfit1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxLoss1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>
        {showSearchMaxProfit1 && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllMaxProfit1}
                    onChange={handleSelectAllForMaxProfit1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit1
                    .filter((name) => name !== undefined)
                    .map((MaxProfit, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxProfitSelected1.includes(MaxProfit)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxProfit1(MaxProfit)
                          }
                        />
                        <label>{MaxProfit}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchMaxProfit1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Loss": stColVis["Max Loss"] && (
      <th>
        <div>
          <small>Max Loss</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMaxLoss1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxProfit1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>

        {showSearchMaxLoss1 && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxLoss1}
                    onChange={handleSelectAllForMaxLoss1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLoss1
                    .filter((name) => name !== undefined)
                    .map((MaxLoss, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossSelected1.includes(MaxLoss)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxLoss1(MaxLoss)
                          }
                        />
                        <label>{MaxLoss}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchMaxLoss1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Loss Wait Time": stColVis["Max Loss Wait Time"] && (
      <th>
        <div>
          <small>Max Loss Wait Time</small>
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
    "Profit Locking": stColVis["Profit Locking"] && (
      <th>
        <div>
          <small>Profit Locking</small>
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
    "Market Orders": stColVis["Market Orders"] && (
      <th>
        <div>
          <small>Market Orders</small>
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
    "Delay Between Users": stColVis["Delay Between Users"] && (
      <th>
        <div>
          <small>Delay Between Users</small>
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
    "Unique ID Req for Order": stColVis["Unique ID Req for Order"] && (
      <th>
        <div>
          <small>
            Unique ID Req for  Order
          </small>
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
    "Cancel Previous Open Signal": stColVis["Cancel Previous Open Signal"] && (
      <th>
        <div>
          <small>
            Cancel Previous Open

            Signal
          </small>
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
    "Stop Reverse": stColVis["Stop Reverse"] && (
      <th>
        <div>
          <small>Stop & Reverse</small>
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
    "Part Multi Exists": stColVis["Part Multi Exists"] && (
      <th>
        <div>
          <small>Part / Multi Exists</small>
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
    "Hold Sell Seconds": stColVis["Hold Sell Seconds"] && (
      <th>
        <div>
          <small>Hold Sell Seconds</small>
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
    "Allowed Trades": stColVis["Allowed Trades"] && (
      <th>
        <div>
          <small>Allowed Trades</small>
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
    "Entry Order Retry": stColVis["Entry Order Retry"] && (
      <th>
        <div>
          <small>Entry Order Retry</small>
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
    "Entry Retry Count": stColVis["Entry Retry Count"] && (
      <th>
        <div>
          <small>Entry Retry Count</small>
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
    "Entry Retry Wait Seconds": stColVis["Entry Retry Wait Seconds"] && (
      <th>
        <div>
          <small>
            Entry Retry  Wait (Seconds)
          </small>
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
    "Exit Order Retry": stColVis["Exit Order Retry"] && (
      <th>
        <div>
          <small>Exit Order Retry</small>
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
    "Exit Retry Count": stColVis["Exit Retry Count"] && (
      <th>
        <div>
          <small>Exit Retry Count</small>
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
    "Exit Retry Wait Seconds": stColVis["Exit Retry Wait Seconds"] && (
      <th>
        <div>
          <small>
            Exit Retry Wait (Seconds)
          </small>
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
    "Exit Max Wait Seconds": stColVis["Exit Max Wait Seconds"] && (
      <th>
        <div>
          <small>
            Exit Max
            Wait (Seconds)
          </small>
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
    "Sq Off Done": stColVis["Sq Off Done"] && (
      <th>
        <div>
          <small>Sq Off Done</small>
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
    Delta: stColVis["Delta"] && (
      <th>
        <div>
          <small>Delta</small>
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
    Theta: stColVis["Theta"] && (
      <th>
        <div>
          <small>Theta</small>
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
    Vega: stColVis["Vega"] && (
      <th>
        <div>
          <small>Vega</small>
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
  };

  const [userIDSelected, setuserIDSelected] = useState([]);
  const [aliasSelected, setaliasSelected] = useState([]);
  const [brokerSelected, setBrokerSelected] = useState([]);
  const [marginSelected, setmarginSelected] = useState([]);

  const handleUserIDSelected = (userid) => {
    setuserIDSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(userid)) {
        return prevSelectedValues.filter((item) => item !== userid);
      } else {
        return [...prevSelectedValues, userid];
      }
    });
  };
  const handleAliasSelected = (alias) => {
    setaliasSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(alias)) {
        return prevSelectedValues.filter((item) => item !== alias);
      } else {
        return [...prevSelectedValues, alias];
      }
    });
  };

  const handleBrokerSelected = (broker) => {
    setBrokerSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(broker)) {
        return prevSelectedValues.filter((item) => item !== broker);
      } else {
        return [...prevSelectedValues, broker];
      }
    });
  };
  const handleMarginSelected = (margin) => {
    setmarginSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(margin)) {
        return prevSelectedValues.filter((item) => item !== margin);
      } else {
        return [...prevSelectedValues, margin];
      }
    });
  };
  useEffect(() => {
    setfilteredDataNew(dataNew);
  }, [dataNew]);

  useEffect(() => {
    // update rows
    if (userIDSelected.length !== 0) {
      setfilteredDataNew(() =>
        dataNew.filter((data) => {
          return userIDSelected.includes(data.UserID);
        }),
      );
    } else {
      setfilteredDataNew(dataNew);
    }
    if (brokerSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return brokerSelected.includes(data.Broker);
        }),
      );
    }
    if (marginSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return marginSelected.includes(data.Margin);
        }),
      );
    }
    if (aliasSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return aliasSelected.includes(data.Alias);
        }),
      );
    }
  }, [userIDSelected, aliasSelected, brokerSelected, marginSelected]);

  const handleInputChangeFortrade = async (index, key, value) => {
    // Update local state
    const updatedRows = [...filteredRows1];
    const updatedRow = { ...updatedRows[index] };
    updatedRow[key] = value;
    updatedRows[index] = updatedRow;
    setFilteredRows1(updatedRows);
    const row = updatedRows[index];
    dispatch(
      setStrategies({
        strategies: updatedRows,
      })
    );

    const requestBody = {
      allowed_trades: row.AllowedTrades,
      entry_order_retry: row.EntryOrderRetry,
      entry_retry_count: String(row.EntryRetryCount),
      entry_retry_wait: row.EntryRetryWaitSeconds,
      exit_order_retry: row.ExitOrderRetry,
      exit_retry_count: String(row.ExitRetryCount),
      exit_retry_wait: String(row.ExitRetryWaitSeconds),
      exit_max_wait: String(row.ExitMaxWaitSeconds),
    };

    try {
      console.log("Making API call");
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/${username}/${row.strategy_tag}/update_wait_time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("API call successful");
      } else {
        console.error("API call failed", response.statusText);
      }
    } catch (error) {
      console.error("Error in API call", error);
    }
  };

  // const fetchStrategy = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.SERVER_HOST}/retrieve_strategy_info/${username}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const responseData = await response.json();

  //     const resetRowsData = responseData.strategies.map((item) => {
  //       const multipliers = item.broker_user_id
  //         .map((id) => item.multiplier[id] || "1")
  //         .join(", ");

  //       return {
  //         enabled: true,
  //         logged: false,
  //         ManualSquareOff: "",
  //         StrategyLabel: item.strategy_tag,
  //         PL: "0",
  //         TradeSize: "0",
  //         DuplicateSignalPrevention: "0",
  //         OpenTime: item.open_time || "00:00:00",
  //         CloseTime: item.close_time || "00:00:00",
  //         SqOffTime: item.square_off_time || "00:00:00",
  //         TradingAccount: item.broker_user_id.join(", "),
  //         Multiplier: multipliers,
  //         MaxProfit: item.max_profit || "0",
  //         MaxLoss: item.max_loss || "0",
  //         MaxLossWaitTime: "00:00:00",
  //         ProfitLocking: item.profit_locking
  //           ? item.profit_locking.split(",").join("~")
  //           : "~~~",
  //         reached_profit: item.reached_profit || "0",
  //         locked_min_profit: item.locked_min_profit || "0",
  //         DelayBetweenUsers: "0",
  //         UniqueIDReqforOrder: "",
  //         CancelPreviousOpenSignal: "",
  //         StopReverse: "",
  //         PartMultiExists: "",
  //         HoldSellSeconds: "00",
  //         AllowedTrades: item.allowed_trades,
  //         EntryOrderRetry: item.entry_order_retry,
  //         EntryRetryCount: item.entry_retry_count,
  //         EntryRetryWaitSeconds: item.entry_retry_wait,
  //         ExitOrderRetry: item.exit_order_retry,
  //         ExitRetryCount: item.exit_retry_count,
  //         ExitRetryWaitSeconds: item.exit_retry_wait,
  //         ExitMaxWaitSeconds: item.exit_max_wait,
  //         SqOffDone: "",
  //         Delta: "0",
  //         Theta: "0",
  //         Vega: "0",
  //       };
  //     });

  //     setFilteredRows1(resetRowsData);

  //     // Update Redux store if needed
  //     if (resetRowsData.length > 0) {
  //       dispatch(
  //         setStrategies({
  //           strategies: resetRowsData,
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

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
                <i className="bi bi-chess"></i>

                <span className="text-blue-600 font-bold">Strategies</span>{" "}
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
                  <i class="bi bi-eye" title="Hide" style={{ cursor: 'pointer', fontSize: '1.3rem' }} onClick={() => {
                setcolumnHideDropDown((prev) => !prev);
                
              }}></i>
                </div>

                <div class="icon-box custom-icon-2">
                  <i class="bi bi-question-circle" title="Help" style={{ cursor: 'pointer', fontSize: '1.3rem' }}></i>
                </div>
                <button
                  onClick={addNewRow}
                  className="flex overflow-hidden gap-2 justify-center items-center px-3 py-2.5 text-sm font-semibold leading-none text-white whitespace-nowrap bg-blue-700 rounded-md mr-2"
                  style={{ zIndex: "0" }} // Keeping your zIndex style inline if necessary
                >
                  <FaPlus className="w-4 h-4" />
                  <span className="self-stretch">ADD</span>
                </button>
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
            style={{ overflow: "auto", height: "92%" }}
            ref={tableRef}
          >
            <table>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: "10",
                }}
              >
                {strategiesSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {strategiesTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>

              <tbody>
                {filteredRows1
                  .filter((row) => {
                    if (actionFilter === "all") {
                      return true; // Display all rows
                    } else if (actionFilter === "checked") {
                      return row.enabled;
                    } else if (actionFilter === "unchecked") {
                      return !row.enabled;
                    }
                    return true; // Default to displaying all rows
                  })
                  .map((row, index) => {
                    return (
                      <tr key={index}>
                        {strategiesSeq.map((keyName) => {
                          const key = keyName.replace(/\s/g, "");
                          if (
                            key === "UniqueIDReqforOrder"
                              ? stColVis["Unique ID Req for Order"]
                              : stColVis[
                              key
                                .replace(/\s/g, "")
                                .replace(/([A-Z])/g, " $1")
                                .slice(1)
                              ]
                          ) {
                            return (
                              <td
                                key={key}
                                className={
                                  key === "StrategyLabel" &&
                                    clearedCells.includes(index)
                                    ? "cleared-cell"
                                    : ""
                                }
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {key === "TradingAccount" ? (
                                  <span
                                    className="clickable-cell"
                                    onClick={() => handleCellClick(row, index)}
                                    style={{
                                      minWidth: "100%",
                                      minHeight: "20px",
                                      border: "1px solid transparent",
                                      display: "inline-block",
                                      alignItems: "center", // Corrected property
                                      justifyContent: "center",
                                      scrollbarWidth: "thin", // Set the width of the scrollbar (non-WebKit browsers)
                                      maxWidth: "11rem",
                                      maxHeight: "50px", // Set a maximum height for the span
                                      overflowY: "auto", // Enable smooth scrolling on iOS devices
                                    }}
                                  >
                                    {row[key]}
                                  </span>
                                ) : key === "StrategyLabel" ? (
                                  <input
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                    type="text"
                                    value={row[key]}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        key,
                                        e.target.value,
                                      )
                                    }
                                  />
                                ) : key === "Action" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      paddingLeft: "9px",
                                    }}
                                  >
                                   
                                    <div className="tooltip-container">
                                      {actionFilter === "all" ||
                                        (actionFilter === "checked" &&
                                          row.enabled) ||
                                        (actionFilter === "unchecked" &&
                                          !row.enabled) ? (
                                        <>
                                          {row.enabled ? (
                                            <i className="bi bi-stop-circle" style={{ color: 'red' }} onClick={() => {
                                              updateActionProperty(
                                                index,
                                                "enabled",
                                                false,
                                              );
                                            }} ></i>

                                          ) : (
                                            <i class="bi bi-play" style={{ color: 'green' }} onClick={() => {
                                              updateActionProperty(
                                                index,
                                                "enabled",
                                                true,
                                              );
                                            }} ></i>

                                          )}
                                          <span className="tooltiptexts">
                                            {row.enabled ? "Disable" : "Enable"}
                                          </span>
                                        </>
                                      ) : null}
                                    </div>
                                   

                                    {/* --------- */}
                                    <span className="tooltip-container">
                                      {/*  */}

                                      {row.logged ? (
                                        <>
                                          <img
                                            src={Logout}
                                            alt="icon"
                                            className="logout_icon"
                                            style={{
                                              height: "25px",
                                              width: "25px",
                                            }}
                                          />

                                          <span
                                            className={`tooltiptext login-tooltip`}
                                          >
                                            complete
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="bi bi-download" style={{
                                            transform: 'rotate(90deg)',
                                            display: 'inline-block',
                                            WebkitTransform: 'rotate(90deg)', // Adding vendor prefix
                                            msTransform: 'rotate(90deg)', // Adding vendor prefix
                                            transition: 'transform 0.2s' // Smooth rotation if needed
                                          }} ></i>


                                          <span
                                            className={`tooltiptext login-tooltip`}
                                          >
                                            complete
                                          </span>
                                        </>
                                      )}
                                    </span>

                                    {/* ---- */}
                                    <span className="tooltip-container">
                                      <i className="bi bi-trash3" style={{ color: "red" }} onClick={() => {
                                        handleStrategyRowDelete(index);
                                      }}
                                      ></i>

                                      <span className="tooltiptext delete-tooltip">
                                        Delete
                                      </span>
                                    </span>
                                  </div>
                                ) : key === "ManualSquareOff" ? (
                                  <img
                                    src={Log}
                                    alt="icon"
                                    className="logout_icon"
                                    style={{
                                      height: "25px",
                                      width: "25px",
                                    }}
                                    onClick={() =>
                                      handleManualSquareOff(
                                        row["StrategyLabel"],
                                        row["TradingAccount"],
                                      )
                                    }
                                  />
                                ) : key === "UniqueIDReqforOrder" ? (
                                  <input
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                    type="checkbox"
                                  />
                                ) : key === "PL" ? (
                                  <input
                                    type="text"
                                    value={
                                      row[key] !== undefined && row[key] !== null
                                        ? parseFloat(row[key]) === 0 || 0.00
                                          ? 0
                                          : parseFloat(row[key]).toFixed(2)
                                        : ""
                                    }
                                    // onChange={(e) =>
                                    //   handleInputChange(
                                    //     index,
                                    //     key,
                                    //     e.target.value,
                                    //   )
                                    // }
                                    readOnly
                                    style={{
                                      textAlign: "center",
                                      color: parseFloat(row[key]) < 0 ? "red" : "green",
                                    }}
                                  />
                                )
                                  : key === "CancelPreviousOpenSignal" || key === "StopReverse" || key === "PartMultiExists" ? (
                                    <input
                                      style={{
                                        padding: "8px",
                                        textAlign: "center",
                                      }}
                                      type="checkbox"
                                    />
                                  ) : key === "OpenTime" ? (

                                    <TimePicker
                                      onChange={(newTime) => {
                                        // Update the time in the row when it changes
                                        handleInputChange(index, key, newTime);
                                      }}
                                      value={row[key]}
                                      disableClock={true}
                                      format="HH:mm:ss"
                                      maxDetail={'second'}
                                      clearIcon={null}
                                      clockIcon={null}

                                      onBlur={() =>
                                        maxProfitLoss(
                                          row["MaxLoss"],
                                          row["StrategyLabel"],
                                          row["OpenTime"],
                                          row["CloseTime"],
                                          row["SqOffTime"], row["MaxProfit"],

                                        )
                                      }
                                    />

                                  ) : key === "CloseTime" ? (

                                    <TimePicker

                                      value={row[key]}
                                      onChange={(newTime) => {
                                        // Update the time in the row when it changes
                                        handleInputChange(index, key, newTime);
                                      }}
                                      disableClock={true}
                                      format="HH:mm:ss"
                                      maxDetail={'second'}

                                      clearIcon={null}

                                      onBlur={() =>
                                        maxProfitLoss(
                                          row["MaxProfit"],
                                          row["MaxLoss"],
                                          row["StrategyLabel"],
                                          row["OpenTime"],
                                          row["CloseTime"],
                                          row["SqOffTime"],
                                        )
                                      }
                                    />

                                  ) : key === "SqOffTime" ? (

                                    <TimePicker

                                      value={row[key]}
                                      onChange={(newTime) => {
                                        // Update the time in the row when it changes
                                        handleInputChange(index, key, newTime);
                                      }}
                                      disableClock={true}
                                      format="HH:mm:ss"
                                      style={{
                                        textAlign: "center",
                                        color: key === "MaxLoss" ? "red" : "green",
                                      }}
                                      maxDetail={'second'}

                                      clearIcon={null}

                                      onBlur={() =>
                                        maxProfitLoss(
                                          row["MaxProfit"],
                                          row["MaxLoss"],
                                          row["StrategyLabel"],
                                          row["OpenTime"],
                                          row["CloseTime"],
                                          row["SqOffTime"],
                                        )
                                      }
                                    />

                                  ) : key === "MaxProfit" || key === "MaxLoss" ? (
                                    <input
                                      type="text"
                                      value={row[key]}
                                      onChange={(e) =>
                                        handleInputChange(index, key, e.target.value)
                                      }

                                      onBlur={() =>
                                        maxProfitLoss(
                                          row["MaxProfit"],
                                          row["MaxLoss"],
                                          row["StrategyLabel"],
                                          row["OpenTime"],
                                          row["CloseTime"],
                                          row["SqOffTime"],
                                        )
                                      }
                                      style={{
                                        textAlign: "center",
                                        color: key === "MaxLoss" ? "red" : "green",
                                      }}
                                    />
                                  ) : key === "MaxLossWaitTime" ? (
                                    <TimePicker
                                      value={row[key]}

                                      disableClock={true}
                                      onChange={(newTime) => {
                                        // Update the time in the row when it changes
                                        handleInputChange(index, key, newTime);
                                      }}
                                      format="HH:mm:ss"
                                      maxDetail={'second'}
                                      clearIcon={null}
                                      clockIcon={null}
                                    />
                                  )
                                    : key === "ProfitLocking" ? (
                                      <td style={{ padding: 0, position: "relative" }}>
                                        <input
                                          type="text"
                                          value={row[key]}
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                          }}

                                        />

                                        <KeyboardArrowDownIcon
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPopupValues((prev) => ({
                                              ...prev,
                                              index: index,
                                            }));
                                            togglePopup(index);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            position: "absolute",
                                            right: "0px",
                                            top: "8px",
                                            fontSize: "18px",
                                            borderWidth: "0 2px 2px 0",
                                          }}
                                        />

                                      </td>
                                    ) : key === "AllowedTrades" ? (

                                      <td style={{ textAlign: "center", }}>

                                        <select
                                          className="custom-select"
                                          value={row[key] || "Both"} // Set default value to "Both"
                                          onChange={(e) => handleInputChangeFortrade(index, key, e.target.value)}
                                          style={{
                                            width: '180px',
                                            padding: "8px",
                                            color: "#000",
                                          }}
                                        >
                                          <option value="Both">Both</option>
                                          <option value="Long">Long</option>
                                          <option value="Short">Short</option>

                                        </select>
                                      </td>
                                    ) : key === "EntryOrderRetry" || key === "ExitOrderRetry" ? (
                                      <input
                                        type="checkbox"
                                        checked={row[key] || false} // Ensures that the checkbox is correctly checked/unchecked
                                        onChange={(e) => handleInputChangeFortrade(index, key, e.target.checked)}

                                        style={{
                                          padding: "8px",
                                          textAlign: "center",
                                        }}
                                      />
                                    ) :
                                      key === "ExitMaxWaitSeconds" || key === "ExitRetryWaitSeconds" || key === "ExitRetryCount" || key === "EntryRetryWaitSeconds" || key === "EntryRetryCount" ? (
                                        <input
                                          type="number"
                                          value={row[key] || ""}
                                          onChange={(e) => handleInputChangeFortrade(index, key, e.target.value)}
                                          readOnly={
                                            key === "ExitMaxWaitSeconds" && !row["ExitOrderRetry"] ||
                                            key === "ExitRetryWaitSeconds" && !row["ExitOrderRetry"] ||
                                            key === "ExitRetryCount" && !row["ExitOrderRetry"] ||
                                            key === "EntryRetryWaitSeconds" && !row["EntryOrderRetry"] ||
                                            key === "EntryRetryCount" && !row["EntryOrderRetry"]
                                          }
                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                          }}
                                        />
                                      ) : key === "SqOffDone" ? (
                                        <input
                                          type="checkbox"
                                          checked={row[key] || false} // Ensures that the checkbox is correctly checked/unchecked
                                          // onChange={(e) => handleInputChangeFortrade(index, key, e.target.checked)}

                                          style={{
                                            padding: "8px",
                                            textAlign: "center",
                                          }}
                                        />
                                      ) : key === "MarketOrders" ? (
                                        <td onClick={() => {
                                          console.log('Cell clicked');
                                          handleOpenMarketOrders(rowData.userId, rowData.broker, rowData.name);
                                        }}>
                                          <input type="text" value="" />
                                        </td>

                                      ) : (
                                        <input
                                          type="text"
                                          value={row[key]}
                                          onChange={(e) =>
                                            handleInputChange(
                                              index,
                                              key,
                                              e.target.value,
                                            )
                                          }
                                          style={{ textAlign: "center" }}
                                        />
                                      )}
                              </td>
                            );
                          }
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
          {showPopup && (
            <div
              ref={popupRef}
              className="popupContainer"
              style={{
                position: "fixed",
                bottom: "6%",
                right: "10%",
                transform: "translate(-20%, 10%)",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "20px",
                width: "400px",
                height: "420px",
                zIndex: 1000,
                borderRadius: "5px",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="popupContent"
                style={{
                  border: "1px solid #d3d3d3",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                <h4
                  style={{
                    marginLeft: "0px",
                    fontFamily: "roboto",
                    fontSize: "14",
                  }}
                >
                  Profit Locking
                </h4>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div className="input-box">
                    <span
                      className="SLT"
                      style={{
                        display: "flex",
                        textAlign: "start",
                        color: "#4661bd",
                        fontFamily: "roboto",
                        fontSize: "14",
                      }}
                    >
                      If Profit Reaches
                    </span>
                    <input
                      className="number1"
                      type="number"
                      id="trail_tgt_0"
                      value={popupValues.profitReaches}
                      style={{
                        display: "flex",
                        border: "none",
                        width: "160px",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        boxSizing: "border-box",
                        padding: "10px",
                      }}
                      onChange={(e) =>
                        handleInputChangePtLock("profitReaches", e.target.value)
                      }
                    />
                    <p
                      id="profitReachesError"
                      style={{
                        color: "red",
                        height: "18px",
                        marginTop: "4px",
                        marginLeft: "0px",
                      }}
                    ></p>
                  </div>
                  <div className="input-box" style={{ marginTop: "-5px" }}>
                    <span
                      className="SLT"
                      style={{
                        display: "flex",
                        color: "#4661bd",
                        fontFamily: "roboto",
                        fontSize: "14",
                        marginBottom: "-14px",
                        marginLeft: "10px",
                      }}
                    >
                      Lock Minimum <br />
                      Profit At
                    </span>
                    <input
                      className="number1"
                      type="number"
                      id="trail_tgt_1"
                      value={popupValues.lockMinimumProfit}
                      style={{
                        display: "flex",
                        border: "none",
                        width: "160px",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        boxSizing: "border-box",
                        padding: "6px",
                        marginLeft: "10px",
                        marginTop: "8px",
                      }}
                      onChange={(e) =>
                        handleInputChangePtLock(
                          "lockMinimumProfit",
                          e.target.value,
                        )
                      }
                    />
                    <p
                      id="lockProfitError"
                      style={{
                        color: "red",
                        height: "18px",
                        marginTop: "4px",
                        marginLeft: "10px",
                      }}
                    ></p>
                  </div>
                </div>
              </div>
              <div
                className="popupContent"
                style={{
                  border: "1px solid #d3d3d3",
                  padding: "8px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              >
                <h4
                  style={{
                    marginLeft: "0px",
                    fontFamily: "roboto",
                    fontSize: "14",
                  }}
                >
                  Profit Trailing
                </h4>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div className="input-box">
                    <span
                      className="SLT"
                      style={{
                        display: "flex",
                        color: "#4661bd",
                        fontFamily: "roboto",
                        fontSize: "14",
                        textAlign: "start",
                      }}
                    >
                      Then Every Increase <br /> In Profit By
                    </span>
                    <input
                      className="number1"
                      type="number"
                      id="trail_tgt_2"
                      value={popupValues.increaseInProfit}
                      style={{
                        display: "flex",
                        border: "none",
                        width: "160px",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        boxSizing: "border-box",
                        padding: "10px",
                      }}
                      onChange={(e) =>
                        handleInputChangePtLock(
                          "increaseInProfit",
                          e.target.value,
                        )
                      }
                    />
                    <p
                      id="increaseInProfitError"
                      style={{
                        color: "red",
                        height: "18px",
                        marginTop: "4px",
                        marginLeft: "0px",
                      }}
                    ></p>
                  </div>
                  <div className="input-box">
                    <span
                      className="SLT"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#4661bd",
                        fontFamily: "roboto",
                        fontSize: "14",
                        marginTop: "17px",
                        marginLeft: "10px",
                      }}
                    >
                      Trail Profit By
                    </span>
                    <input
                      className="number1"
                      type="number"
                      id="trail_tgt_3"
                      value={popupValues.trailProfitBy}
                      style={{
                        display: "flex",
                        border: "none",
                        width: "160px",
                        borderBottom: "1px solid #000",
                        outline: "none",
                        boxSizing: "border-box",
                        padding: "10px",
                        marginTop: "2px",
                        marginLeft: "10px",
                      }}
                      onChange={(e) =>
                        handleInputChangePtLock("trailProfitBy", e.target.value)
                      }
                    />
                    <p
                      id="trailProfitByError"
                      style={{
                        color: "red",
                        height: "18px",
                        marginTop: "4px",
                        marginLeft: "10px",
                      }}
                    ></p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: "roboto",
                  fontSize: "12px",
                  marginTop: "10px",
                  color: "orange",
                }}
              >
                VALUES SHOULD BE IN RUPEES ONLY
              </div>

              <div
                style={{
                  fontFamily: "roboto",
                  fontSize: "12px",
                  marginTop: "5px",
                  color: "#4661bd",
                  marginLeft: "0px",
                }}
              >
                LOCKING AND TRAILING CAN BE USED INDEPENDENTLY
              </div>
              <div
                style={{
                  fontFamily: "roboto",
                  fontSize: "12px",
                  marginTop: "5px",
                  color: "green",
                  marginLeft: "0px",
                }}
              >
                TGT/ SL ON PER LOT BASIS IF TICKED WILL BE APPLICABLE HERE
              </div>
              <div>
                <button
                  style={{
                    marginTop: "20px",
                    padding: "4px 8px",
                    marginLeft: "4px",
                    backgroundColor: "#28A745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s",
                  }}
                  onClick={handleSetTrailTGT}
                >
                  OK
                </button>
                <button
                  style={{
                    marginTop: "20px",
                    padding: "4px 8px",
                    marginLeft: "3px",
                    backgroundColor: "#DC3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s",
                    fontWeight: "normal",
                  }}
                  onClick={handleInputDelete}
                >
                  DELETE
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    marginTop: "20px",
                    padding: "4px 7px",
                    marginLeft: "3px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s",
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          )}

          <ErrorContainer
            ref={errorContainerRef}
            msgs={msgs}
            handleClearLogs={handleClearLogs}
          />
        </div>

        <div onClick={handleClickOutside}>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Trading Account Modal"
            center
            style={{
              content: {
                overflow: "hidden",
                width: "100%",
                height: "100",
                margin: "auto",
                // marginLeft: "-40px",
                marginTop: "-40px",
                marginBottom: "-40px",
                overflowX: "hidden",
                backgroundColor: "transparent",
                border: "transparent",
                padding: "0",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
            }}
          >
            <Draggable>
              <div
                style={{
                  backgroundColor: "white",
                  height: 410,
                  width: 700,
                  margin: "auto",
                  borderRadius: "6px",
                  marginTop: "9%",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    backgroundColor: "#d8e1ff",
                    borderRadius: "6px",
                    marginBottom: "2px",
                    padding: "10px ",
                    overflowX: "hidden",
                  }}
                >
                  Select User(s) for Strategies:{" "}
                  {selectedTradingAccount ? (
                    <span style={{ color: "blue" }}>
                      {selectedTradingAccount.StrategyLabel}
                    </span>
                  ) : (
                    ""
                  )}
                </h2>

                {selectedTradingAccount && (
                  <div
                    className="container"
                    style={{ height: "300px", overflow: "auto" }}
                  >
                    <table className="custom-table">
                      <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                        <tr
                          className="header-row"
                          style={{
                            background: "#d8e1ff",
                            height: 30,
                          }}
                        >
                          <th
                            style={{
                              textAlign: "center",
                              width: "13%",
                            }}
                          >
                            <small>
                              <input
                                type="checkbox"
                                checked={selectAllChecked}
                                onChange={handleSelectAll}
                                style={{ marginRight: "5px" }}
                              />
                              Select
                            </small>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "17%",
                            }}
                          >
                            <div className="popTableHead ">
                              <small>User ID</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID(
                                    !isdropDownOpenUserID,
                                  );
                                }}
                              />
                              {isdropDownOpenUserID && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => data["UserID"]),
                                    ),
                                  ).map((userid, index) => {
                                    return (
                                      <label key={index}>
                                        <input
                                          type="checkbox"
                                          checked={userIDSelected.includes(
                                            userid,
                                          )}
                                          onClick={() => {
                                            handleUserIDSelected(userid);
                                          }}
                                        />
                                        {userid}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "18%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Alias</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenAlias(!isdropDownOpenAlias);
                                }}
                              />
                              {isdropDownOpenAlias && (
                                <div className="dropdown-menu">
                                  //
                                  {/* {console.log("DaaaataNEeww", dataNew)} */}
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => {
                                        if (userIDSelected.length === 0) {
                                          return data["Alias"];
                                        } else {
                                          if (
                                            userIDSelected.includes(data.UserID)
                                          ) {
                                            return data["Alias"];
                                          }
                                        }
                                      }),
                                    ),
                                  )
                                    .filter((broker) => broker !== undefined)
                                    .filter((broker) => broker !== "")
                                    .map((alias, index) => {
                                      return (
                                        <label key={index}>
                                          <input
                                            type="checkbox"
                                            checked={aliasSelected.includes(
                                              alias,
                                            )}
                                            onClick={() => {
                                              handleAliasSelected(alias);
                                            }}
                                          />
                                          {alias}
                                        </label>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "18%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Multiplier</small>
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Broker</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker(
                                    !isdropDownOpenBroker,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                }}
                              />
                              {isdropDownOpenBroker && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => {
                                        if (userIDSelected.length === 0) {
                                          return data["Broker"];
                                        } else {
                                          if (
                                            userIDSelected.includes(data.UserID)
                                          ) {
                                            return data["Broker"];
                                          }
                                        }
                                      }),
                                    ),
                                  )
                                    .filter((broker) => broker !== undefined)
                                    .map((broker, index) => {
                                      return (
                                        <label key={index}>
                                          <input
                                            type="checkbox"
                                            checked={brokerSelected.includes(
                                              broker,
                                            )}
                                            onClick={() => {
                                              handleBrokerSelected(broker);
                                            }}
                                          />{" "}
                                          {broker}
                                        </label>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Margin</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenMargin(
                                    !isdropDownOpenMargin,
                                  );
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                }}
                              />
                              {isdropDownOpenMargin && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => data["Margin"]),
                                    ),
                                  ).map((margin, index) => {
                                    return (
                                      <label key={index}>
                                        <input
                                          type="checkbox"
                                          checked={marginSelected.includes(
                                            margin,
                                          )}
                                          onClick={() => {
                                            handleMarginSelected(margin);
                                          }}
                                        />{" "}
                                        {margin}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDataNew.map((account, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "even-row" : "odd-row"}
                          >
                            <td
                              style={{
                                padding: "15px",
                                textAlign: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={account.Select}
                                onChange={() => handleCheckboxChange(index)}
                              />
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.UserID}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Alias}
                            </td>
                            <td>
                              <input
                                type="text"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    "",
                                  ); // Allow only numbers
                                }}
                                value={account.Multiplier}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  textAlign: "center",
                                }}
                                readOnly={!account.Select}
                                className={
                                  account.Select ? "editable" : "not-editable"
                                }
                                onChange={(e) => {
                                  setisPopUpDataChanged(true);
                                  handleInputChangeInputs(
                                    index,
                                    "Multiplier",
                                    e.target.value,
                                  );
                                }}
                              />
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Broker}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Margin}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    bottom: "20px", // Adjust the distance from the bottom as needed
                    width: "100%",
                  }}
                >
                  <button
                    disabled={
                      !isPopUpDataChanged || !isAtLeastOneItemSelected()
                    }
                    style={
                      isPopUpDataChanged && isAtLeastOneItemSelected()
                        ? {
                          backgroundColor: "#0BDA51",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          width: "75px",
                          overflowX: "hidden",
                        }
                        : {
                          padding: "10px",
                          borderRadius: "10px",
                          cursor: "default",
                          width: "75px",
                        }
                    }
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      backgroundColor: "#FF2400",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      marginLeft: "25px",
                      marginRight: "10px",
                      width: "75px",
                      overflowX: "hidden",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Draggable>
          </Modal>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Error Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            width: "300px",
            height: "160px",
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
          {errorMessage}
        </p>
        <div style={{ flex: 1 }}></div>
        <div className="modal-buttons" style={{ marginBottom: "10px" }}>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "5px",
              backgroundColor: "#5cb85c",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(false)}
          >
            OK
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={marketOrdersOpen}
        onRequestClose={handleCloseMarketOrders}
        contentLabel="Market Orders Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            width: "530px",
            maxWidth: "100%",
            height: "auto",
            margin: "auto",
            marginTop: "-20px",
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "10px",
            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "0px",
            position: "relative",
          },
        }}
      >
        {/* Header */}
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
          MTI BRIDGE
        </div>
        <div style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* <div style={{
            width: "50%",
            marginRight: "225px",
            marginTop: "10px"

          }}>
            <p >
              <span style={{ color: "black", paddingLeft: "15px", fontWeight: "bold" }}>Client ID: </span>
              <span style={{ fontWeight: "bold", color: "green", paddingLeft: "5px", }}>{selectedUserId}</span>
            </p>
            <p >
              <span style={{ paddingLeft: "30px", fontWeight: "bold", color: "black" }}>Broker:</span>
              <span style={{ fontWeight: "bold", color: "green", paddingLeft: "10px", }}>{selectedBroker}</span>
            </p>
            <p >
              <span style={{ paddingLeft: "38px", fontWeight: "bold", color: "black" }}>Name:</span>
              <span style={{ fontWeight: "bold", color: "green", paddingLeft: "5px", }}> {selectedName || '-'}</span>
            </p>
          </div> */}
          <div style={{ marginLeft: "15px" }}>
            <h5 style={{ paddingTop: "10px", fontSize: "14px", color: "orange" }}> SET IF "MARKET" ORDERS ARE NOT ALLOWED FOR THE STRATEGY</h5>
          </div>
          <div style={{ marginTop: "10px", marginLeft: "15px" }}>
            If this is set then MTI will Internally change all MARKET orders to the LIMIT orders as per the below settings for the Selected Strategy
          </div>


          <div className="checkbox" style={{ marginTop: "-5px" }}>

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
                id="marketCheck"
                checked={isCheckboxChecked}
                onChange={handleMarketCheckboxChange}
                style={{ opacity: "1", accentColor: "green" }}
              />
              <span
                style={{
                  marginLeft: "9px",
                  display: "inline-block",
                  fontFamily: "Roboto",
                }}
              >
                Market Orders are not Allowed
              </span>
            </div>
          </div>
          {isCheckboxChecked && (
            <div>
              <div style={{ marginLeft: "10px", marginTop: "5px", display: "flex", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", marginRight: "20px" }}>
                  <label htmlFor="orderType" style={{ color: "#32406D", fontWeight: "bold" }}>Limit Price Selection Based on Order Type:</label>
                  <select
                    id="orderType"
                    value={selectedOrderType}
                    onChange={handleOrderTypeChange}
                    style={{ padding: "5px", borderRadius: "5px", border: "1px solid gray" }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="BidAsk">BidAsk</option>
                    <option value="PriceSpread">PriceSpread</option>
                    <option value="BidAskAgressive">BidAskAgressive</option>
                    <option value="BidAskkeepOnTop">BidAsk_keepOnTop</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="spreadUp" style={{ color: "#32406D", fontWeight: "bold" }}>Limit Price Adjust:</label>
                  <input type="number" id="spreadUp" style={{ padding: "5px", width: "140px", borderRadius: "5px", border: "1px solid gray" }} />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <label
                  htmlFor="maxModifications"
                  style={{ color: "purple", fontWeight: "bold" }}
                >
                  (Limit Price can be Negative,In Points or % Eg 1,0.2%,-0.10 etc)
                </label>
              </div>

              {selectedOrderType === "BidAsk" && (
                <div style={{ marginTop: "5px", marginLeft: "15px" }}>
                  Limit Price will be derived using the current Bid & Ask data by applying some buffer. If Bid/Ask is not avalable with Broker Feed then LTP will be used with some higher buffer. Limit Price Adjust can also be applied
                </div>
              )}
              {selectedOrderType === "PriceSpread" && (
                <div style={{ marginTop: "5px", marginLeft: "15px" }}>
                  Limit Price will be derived using the Current LTP by applying the "Limit Price Adjust" Mentioned above.Price Adjust can be in Point/%/Negative. Eg If LTP is 500 and adjust was mentioned as 10% then for Buy Limit Price would be 550.
                </div>
              )}
              {selectedOrderType === "BidAskAgressive" && (
                <div style={{ marginTop: "5px", marginLeft: "15px" }}>
                  Limit Price will be derived using the best Bid & Ask data by applying some nominal buffer If Bid/Ask is not available from Feed then LTP will be used with slightly higher buffer 'Limit Price Adjust' can also be applied.
                </div>
              )}
              {selectedOrderType === "BidAskkeepOnTop" && (
                <div style={{ marginTop: "5px", marginLeft: "15px" }}>
                  In this MTI will try to keep you on the Top of the Bid for Buy and Ask for the Sell However you can use Limit Price Adjust to adjust the price further
                </div>
              )}
              <div style={{ display: "flex", gap: "20px", marginTop: "10px", marginLeft: "10px" }}>
                <div style={{ display: "flex" }}>
                  <label htmlFor="maxModifications" style={{ color: "#32406D", fontWeight: "bold", }}>Max Modifications</label>
                  <input type="number" id="maxModifications" style={{ width: "60px", borderRadius: "5px", border: "1px solid gray" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <label htmlFor="modificationTime" style={{ color: "#32406D", fontWeight: "bold" }}>Modification time in seconds</label>
                  <input type="number" id="modificationTime" style={{ width: "60px", borderRadius: "5px", border: "1px solid gray" }} />
                </div>
              </div>
              <div className="checkbox">

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
                    id="marketCheck"
                    checked={isCheckboxChecked}
                    onChange={handleMarketCheckboxChange}
                    style={{ opacity: "1", accentColor: "green" }}
                  />
                  <span
                    style={{
                      marginLeft: "9px",
                      display: "inline-block",
                      fontFamily: "Roboto",
                    }}
                  >
                    Force Execute On that Last Attempt
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "10px", marginLeft: "15px" }}>
                After specified time, MTI will check for the Order and if that is still not filled then it will re-modify the order as per above selection. If you don't want modifications then set Max Modifications as 0
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "10px", marginLeft: "10px" }}>
                <div style={{ display: "flex" }}>
                  <label htmlFor="maxModifications" style={{ color: "#32406D", fontWeight: "bold", }}>Max Chase Limit</label>
                  <input type="number" id="maxModifications" style={{ width: "60px", borderRadius: "5px", border: "1px solid gray" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <label htmlFor="maxModifications" style={{ color: "purple", fontWeight: "bold", }}>(Can be in Points or % Eg 1,0.2% etc)</label>
                  {/* <input type="number" id="maxModifications" style={{ width: "60px", borderRadius: "5px", border: "1px solid gray" }} /> */}
                </div>
              </div>
              <div style={{ marginLeft: "15px", marginTop: "10px", }}>
                If Specified then MTI will stop modifying the Order if the price is moved beyond the chasing limit specified can be very helpful where the market moves very sharply and continuous modification can give fill at the worst
              </div>
              <div style={{ textAlign: "center", marginTop: "10px", color: "orange", }}>
                <p style={{ paddingLeft: "7px" }}>
                  These all Settings will be applicable only when Original Order was MARKET and MTI converts that to LIMIT.
                </p>
              </div>
            </div>
          )}

          <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0px",
            marginRight: "-260px",
            // borderTop: "1px solid #ddd",
            backgroundColor: "white",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}>
            <button style={{
              backgroundColor: "Green",
              color: "White",
              border: "none",
              borderRadius: "5px",
              width: "70px",
              margin: "0 10px",
              cursor: "pointer",
            }}>
              OK
            </button>
            <button onClick={handleCloseMarketOrders} style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              width: "70px",
              margin: "0 10px",
              cursor: "pointer",
            }}>
              Cancel
            </button>

          </div>

        </div>
      </Modal>
    </div>
  );
}

export default Strategies;
