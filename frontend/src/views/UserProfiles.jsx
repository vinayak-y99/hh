import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketIndex from "../components/MarketIndex";
import { FaPlus } from "react-icons/fa"; // Make sure to install react-icons if you haven't already
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { ErrorContainer } from "../components/ErrorConsole";
import RightNav from "../components/RightNav";
import filterIcon from "../assets/newFilter.png";
import Delete from "../assets/delete.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Log from "../assets/log.png";
import Start from "../assets/start_2.png";
import Logout from "../assets/logout.png";
import Stop from "../assets/stop.png";
import Stop2 from "../assets/stop2.png";
import leftSideBar1active from "../assets/1leftactive.png";
import zIndex from "@mui/material/styles/zIndex";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useSelector, useDispatch } from "react-redux";
import { setBrokers } from "../store/slices/broker";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setStrategies } from "../store/slices/strategy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Modal from "react-modal";
import TimePicker from 'react-time-picker'

import 'react-time-picker/dist/TimePicker.css';
import { Navigate, NavLink } from "react-router-dom";

function UserProfiles() {
  //hello
  const tableRef = useRef(null);
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();

  const consoleMsgsState = useSelector((state) => state.consoleMsgsReducer);
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [colFilter, setcolFilter] = useState({
    asPerCol: "",
    val: "",
  });
  const [showSearchProfile, setshowSearchProfile] = useState({
    showSearchName: false,
    showSearchId: false,
    showSearchMobile: false,
    showSearchMaxProfit: false,
    showSearchMaxLoss: false,
    showSearchMTM: false,
    showSearchNet: false,
    showSearchAvailableMargin: false,
    showSearchQtyByExposure: false,
    showSearchMaxLossPerTrade: false,
    showSearchMaxOpenTrades: false,
    showSearchQtyMultiplier: false,
    showSearchEmail: false,
    showSearchSqOffTime: false,
    showSearchBroker: false,
  });

  // Error Message start
  const errorContainerRef = useRef(null);

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

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };





  const closeModal = () => {
    setIsOpen(false);
  };

  const isStarted = useSelector(
    (state) => state.placeOrderStartReducer.placeOrderStart,
  );

  const handleLogout = async (rowData, index) => {
    let count = 0;
    for (let j = 0; j < rows.length; j++) {
      if (rows[j].inputDisabled === true) {
        count++;
      }
    }
    //// console.log("count", count, "= ", isStarted);
    if (isStarted && count <= 1) {
      openModal();
      return;
    }
    try {
      if (rowData.broker !== "pseudo_account") {
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/api/broker/logout/${rowData.broker}/${rowData.username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        //// console.log("Response received:", response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Something bad happened. Please try again",
          );
        }

        const responseData = await response.json();

        //// console.log("Success:", responseData);
        const updatedBrokers = [...rows];

        //// console.log("rdxIndex", rdxIndex, "rdxValue", rdxValue)
        updatedBrokers[index] = {
          ...updatedBrokers[index],
          apiUserDetails: "",
          availableMargin: 0,
          net: 0,
          inputDisabled: false,
        };

        dispatch(
          setBrokers({
            brokers: updatedBrokers,
          }),
        );
        handleMsg({
          msg: `Logged out Successfully. - ${rowData.userId}`,
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      } else {
        const updatedBrokers = [...rows];
        updatedBrokers[index] = {
          ...updatedBrokers[index],
          apiUserDetails: "",
          availableMargin: 0,
          net: 0,
          inputDisabled: false,
        };

        dispatch(
          setBrokers({
            brokers: updatedBrokers,
          }),
        );
        handleMsg({
          msg: `Logged out Successfully. - ${rowData.userId}`,
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  // handlelog out
  const handleDelete = async (rowData, index) => {
    try {
      if (rowData.broker !== "" && rowData.userId != "") {
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/api/broker/delete_broker_account/${mainUser}/${rowData.userId}/${rowData.broker}`,
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

        // If successful, you might want to handle the response here
        //// console.log("Credentials deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting credentials:", error.message);
    } finally {
      const updatedRows = rows.filter((_, i) => i !== index);
      // setRows([ ...updatedRows ]);
      dispatch(
        setBrokers({
          brokers: updatedRows,
        }),
      );
      const fetchStrategy = async (username) => {
        try {
          const response = await fetch(
            `${import.meta.env.SERVER_HOST}/api/broker/get_strategy_account/${username}`,
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
          //// console.log("startegyState", responseData.strategies)
          const extractedStrategyTags = responseData.strategies.map(
            (strategy) => strategy.strategy_tag,
          );
          // setallStrategiesList(extractedStrategyTags);
          const resetRowsData = responseData.strategies.map((item) => {
            return {
              Action: {
                enabled: false,
                logged: false,
              },
              ManualSquareOff: "",
              StrategyLabel: item.strategy_tag,
              PL: "0",
              TradeSize: "0",
              DuplicateSignalPrevention: "0",
              OpenTime: "00:00:00",
              CloseTime: "00:00:00",
              SqOffTime: "00:00:00",
              TradingAccount: item.broker_user_id.join(", "),
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
          });

          if (resetRowsData.length > 0) {
            //// console.log("startegyState", resetRowsData)
            dispatch(
              setStrategies({
                strategies: resetRowsData,
              }),
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchStrategy(mainUser);

      handleMsg({
        msg: `Row Deleted Successfully. - ${rowData.userId}`,
        logType: "MESSAGE",
        timestamp: ` ${new Date().toLocaleString()}`,
        user: rowData.userId,
      });
    }
  };
  // handle select change
  const handleSelectChange = (e, index) => {
    const selectedBroker = e.target.value;
    updateRowData(index, { broker: selectedBroker });

    if (selectedBroker === "flattrade") {
      setShowSecretKey(true);
      setShowRedirectAPI(false);
      setShowImei(false); // Resetting setShowImei for other brokers
    } else if (selectedBroker === "fyers") {
      setShowSecretKey(true);
      setShowRedirectAPI(true);
      setShowImei(false); // Resetting setShowImei for other brokers
    } else if (selectedBroker === "finvasia") {
      setShowSecretKey(false);
      setShowRedirectAPI(false); // Assuming 'finvasia' requires redirect API
      setShowImei(true); // Setting setShowImei specifically for Finvasia
    } else {
      setShowSecretKey(false);
      setShowRedirectAPI(false);
      setShowImei(false);
      // Resetting setShowImei for other brokers
    }
  };
  // handle select change
  // passsword hide unhide

  const [showPasswordqr, setShowPasswordqr] = useState(false);
  const togglePasswordQrVisibility = () => {
    setShowPasswordqr(!showPasswordqr);
  };
  // passsword hide unhide

  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  // console.log(rows, "rows")
  const { positions: position } = useSelector((state) => state.positionReducer);

  const updateBrokersWithTotalPL = (brokers, positions) => {
    let oldMtMbrokers = brokers.map(broker => ({ ...broker }));
    let updatedBrokers = brokers.map(broker => ({ ...broker }));
    let isThrottled = false; // Throttle flag

    oldMtMbrokers.forEach(async (userRow, rowIndex) => {
      const totalPL = positions
        .filter(item => item["User ID"] === userRow.userId)
        .reduce((acc, curr) => acc + parseFloat(curr["P&L"]), 0);

      // profit trailing & locking
      const profitLocking = userRow?.profitLocking.split("~");
      const profitLocking_a = Number(profitLocking[0]);
      const profitLocking_b = Number(profitLocking[1]);
      const prfoitTrailing_a = Number(profitLocking[2]);
      const prfoitTrailing_b = Number(profitLocking[3]);
      // console.log("profitLocking")

      // Throttle logic to prevent multiple API calls
      if (!isThrottled) {
        if (
          userRow.reached_profit != 0 &&
          userRow.reached_profit !== null &&
          userRow.reached_profit !== undefined &&
          userRow.locked_min_profit != 0 &&
          userRow.locked_min_profit !== null &&
          userRow.locked_min_profit !== undefined &&
          profitLocking_a !== 0 &&
          profitLocking_a !== undefined &&
          profitLocking_a !== null
        ) {
          if (totalPL <= userRow.locked_min_profit && userRow.locked_min_profit != 0) {
            const positionsToSquareOff = positions.filter(
              pos => pos["User ID"] === userRow.userId && pos.side === 1
            );

            if (positionsToSquareOff.length > 0) {
              console.log(
                "handle manual square off for min locked profit ",
                userRow.locked_min_profit,
                "totalPL",
                totalPL
              );

              // Set throttle flag to true and prevent multiple calls
              isThrottled = true;

              // Call square off function
              handleManualSqOff(rowIndex).then(() => {
                // Clear throttle after 500ms (or other delay)
                setTimeout(() => {
                  isThrottled = false;
                }, 5000);
              });
            }
          }
        }
      }

      if (
        profitLocking_a !== 0 &&
        profitLocking_b !== 0 &&
        prfoitTrailing_a === 0 &&
        prfoitTrailing_b === 0
      ) {
        if (totalPL >= profitLocking_a) {
          let lockNewMinProfit = profitLocking_b;
          console.log(
            "reached_profit",
            totalPL,
            "lockNewMinProfit",
            lockNewMinProfit,
            "userRow.locked_min_profit",
            userRow.locked_min_profit
          );
          if (lockNewMinProfit > userRow.locked_min_profit) {
            const response = await fetch(
              `${import.meta.env.SERVER_HOST}/api/broker/update_user_profit_trail_values/${mainUser}/${userRow.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  reached_profit: totalPL,
                  locked_min_profit: lockNewMinProfit,
                }),
              }
            );
            if (!response.ok) {
              const errorData = await response.json();
            }
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
        if (totalPL >= profitLocking_a && totalPL >= userRow.reached_profit) {
          let lockNewMinProfit =
            profitLocking_b +
            prfoitTrailing_b *
            Math.floor((totalPL - profitLocking_a) / prfoitTrailing_a);
          console.log(
            "reached_profit",
            totalPL,
            "lockNewMinProfit",
            lockNewMinProfit,
            "userRow.locked_min_profit",
            userRow.locked_min_profit
          );
          if (lockNewMinProfit > userRow.locked_min_profit) {
            const response = await fetch(
              `${import.meta.env.SERVER_HOST}/api/broker/update_user_profit_trail_valuesdata/${mainUser}/${userRow.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  reached_profit: totalPL,
                  locked_min_profit: lockNewMinProfit,
                }),
              }
            );
            if (!response.ok) {
              const errorData = await response.json();
            }
            updateRowData(rowIndex, {
              ...userRow,
              reached_profit: totalPL,
              locked_min_profit: lockNewMinProfit,
            });
          }
        }
      }

      const updatedRow = {
        ...userRow,
        mtmAll: totalPL,
      };

      updatedBrokers = updatedBrokers.map((row, index) =>
        index === rowIndex ? updatedRow : row
      );
    });

    return updatedBrokers;
  };


  useEffect(() => {
    const updatedBrokers = updateBrokersWithTotalPL(rows, position);
    //// console.log(updatedBrokers);
    dispatch(
      setBrokers({
        brokers: updatedBrokers,
      }),
    );

    return () => { };
  }, [position]);

  const [showPasswordRowsApi, setShowPasswordRowsApi] = useState(
    Array(rows.length).fill(false),
  );
  const [showPasswordRowsQr, setShowPasswordRowsQr] = useState(
    Array(rows.length).fill(false),
  );
  // Define functions to toggle password visibility for each column and each row separately
  const togglePasswordVisibilityForRowApi = (index) => {
    setShowPasswordRowsApi((prevState) => {
      const updatedState = [...prevState]; // Create a copy of the previous state array
      updatedState[index] = !updatedState[index]; // Toggle the value at the specified index
      return updatedState;
    });
  };
  const togglePasswordVisibilityForRowQr = (index) => {
    setShowPasswordRowsQr((prevState) => {
      const updatedState = [...prevState]; // Create a copy of the previous state array
      updatedState[index] = !updatedState[index]; // Toggle the value at the specified index
      return updatedState;
    });
  };
  const [showPasswordRowsSecretKey, setShowPasswordRowsSecretKey] = useState(
    Array(rows.length).fill(false),
  );

  // Define function to toggle password visibility for the "API Secret Key" column for each row
  const togglePasswordVisibilityForRowSecretKey = (index) => {
    setShowPasswordRowsSecretKey((prevState) => {
      const updatedState = [...prevState]; // Create a copy of the previous state array
      updatedState[index] = !updatedState[index]; // Toggle the value at the specified index
      return updatedState;
    });
  };

  const [showSelectBox, setShowSelectBox] = useState(false);
  const [enabledFilter, setEnabledFilter] = useState("");

  const [selectAll, setSelectAll] = useState(false);
  const [uniqueDataNames, setuniqueDataNames] = useState([]);
  const [nameSelected, setNameSelected] = useState([]);

  const [selectAllBroker, setSelectAllBroker] = useState(false);
  const [uniqueDataBroker, setuniqueDataBroker] = useState([]);
  const [brokerSelected, setBrokerSelected] = useState([]);

  const [selectAllForId, setSelectAllForId] = useState(false);
  const [uniqueDatauserId, setuniqueDatauserId] = useState([]);
  const [userIdSelected, setuserIdSelected] = useState([]);

  const [selectAllSqOffTime, setSelectAllSqOffTime] = useState(false);
  const [uniqueDataSqOffTime, setuniqueDataSqOffTime] = useState([]);
  const [sqOffTimeSelected, setSqOffTimeSelected] = useState([]);

  const [selectAllEmail, setSelectAllEmail] = useState(false);
  const [uniqueDataEmail, setuniqueDataEmail] = useState([]);
  const [emailSelected, setEmailSelected] = useState([]);

  const [selectAllQtyMultiplier, setSelectAllQtyMultiplier] = useState(false);
  const [uniqueDataQtyMultiplier, setuniqueDataQtyMultiplier] = useState([]);
  const [qtyMultiplierSelected, setQtyMultiplierSelected] = useState([]);
  const [uniqueDataMaxOpenTrades, setuniqueDataMaxOpenTrades] = useState([]);
  const [selectAllMaxOpenTrades, setSelectAllMaxOpenTrades] = useState(false);
  const [maxOpenTradesSelected, setMaxOpenTradesSelected] = useState([]);

  const [selectAllQtyByExposure, setSelectAllQtyByExposure] = useState(false);
  const [uniqueDataQtyByExposure, setuniqueDataQtyByExposure] = useState([]);
  const [qtyByExposureSelected, setQtyByExposureSelected] = useState([]);

  const [selectAllMaxLossPerTrade, setSelectAllMaxLossPerTrade] =
    useState(false);
  const [uniqueDataMaxLossPerTrade, setuniqueDataMaxLossPerTrade] = useState(
    [],
  );
  const [maxLossPerTradeSelected, setMaxLossPerTradeSelected] = useState([]);

  const [selectAllNet, setSelectAllNet] = useState(false);
  const [uniqueDataNet, setuniqueDataNet] = useState([]);
  const [netSelected, setNetSelected] = useState([]);

  const [selectAllMaxProfit, setSelectAllMaxProfit] = useState(false);
  const [uniqueDataMaxProfit, setuniqueDataMaxProfit] = useState([]);
  // const uniqueDataMaxProfit = [ ...new Set(data.map((d) => d.maxProfit)) ];
  const [maxProfitSelected, setMaxProfitSelected] = useState([]);

  const [selectAllMaxLoss, setSelectAllMaxLoss] = useState(false);
  const [uniqueDataMaxLoss, setuniqueDataMaxLoss] = useState([]);
  // const uniqueDataMaxLoss = [ ...new Set(data.map((d) => d.maxLoss)) ];
  const [maxLossSelected, setMaxLossSelected] = useState([]);

  const [selectAllMobile, setSelectAllMobile] = useState(false);
  const [uniqueDataMobile, setuniqueDataMobile] = useState([]);
  // const uniqueDataMobile = [ ...new Set(data.map((d) => d.mobile)) ];
  const [mobileSelected, setMobileSelected] = useState([]);

  const [selectAllMTM, setSelectAllMTM] = useState(false);
  const [uniqueDataMTM, setuniqueDataMTM] = useState([]);
  // const uniqueDataMTM = [ ...new Set(data.map((d) => d.mtmAll)) ];
  const [mtmSelected, setMTMSelected] = useState([]);

  const [selectAllAvailableMargin, setSelectAllAvailableMargin] =
    useState(false);
  const [uniqueDataAvailableMargin, setuniqueDataAvailableMargin] = useState(
    [],
  );

  const [availableMarginSelected, setAvailableMarginSelected] = useState([]);

  useEffect(() => {
    const data = rows;
    setuniqueDataNames(data ? [...new Set(data.map((d) => d.name))] : []);

    setuniqueDatauserId(data ? [...new Set(data.map((d) => d.userId))] : []);

    setuniqueDataMobile(data ? [...new Set(data.map((d) => d.mobile))] : []);

    setuniqueDataMaxProfit(
      data ? [...new Set(data.map((d) => d.maxProfit))] : [],
    );

    setuniqueDataMaxLoss(data ? [...new Set(data.map((d) => d.maxLoss))] : []);

    setuniqueDataMTM(data ? [...new Set(data.map((d) => d.mtmAll))] : []);

    setuniqueDataNet(data ? [...new Set(data.map((d) => d.net))] : []);

    setuniqueDataAvailableMargin(
      data ? [...new Set(data.map((d) => d.availableMargin))] : [],
    );

    setuniqueDataQtyByExposure(
      data ? [...new Set(data.map((d) => d.qtyByExposure))] : [],
    );
    setuniqueDataMaxLossPerTrade(
      data ? [...new Set(data.map((d) => d.maxLossPerTrade))] : [],
    );

    setuniqueDataMaxOpenTrades(
      data ? [...new Set(data.map((d) => d.maxOpenTrades))] : [],
    );
    setuniqueDataQtyMultiplier(
      data ? [...new Set(data.map((d) => d.qtyMultiplier))] : [],
    );

    setuniqueDataEmail(data ? [...new Set(data.map((d) => d.email))] : []);

    setuniqueDataSqOffTime(
      data ? [...new Set(data.map((d) => d.sqOffTime))] : [],
    );

    setuniqueDataBroker(data ? [...new Set(data.map((d) => d.broker))] : []);
  }, [rows]);

  const handleCheckboxChange = (name) => {
    const isSelected = nameSelected.includes(name);
    if (isSelected) {
      setNameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== name),
      );
      setSelectAll(false);
    } else {
      setNameSelected((prevSelected) => [...prevSelected, name]);
      setSelectAll(nameSelected.length === uniqueDataNames.length - 1);
    }
  };

  const handleCheckboxChangeBroker = (broker) => {
    const isSelected = brokerSelected.includes(broker);
    if (isSelected) {
      setBrokerSelected((prevSelected) =>
        prevSelected.filter((item) => item !== broker),
      );
      setSelectAllBroker(false);
    } else {
      setBrokerSelected((prevSelected) => [...prevSelected, broker]);
      setSelectAllBroker(brokerSelected.length === uniqueDataBroker.length - 1);
    }
  };

  const handleSelectAllForName = () => {
    const allChecked = !selectAll;
    setSelectAll(allChecked);

    if (allChecked) {
      setNameSelected(uniqueDataNames.map((d) => d.toLowerCase()));
    } else {
      setNameSelected([]);
    }
  };

  const handleSelectAllForBroker = () => {
    const allChecked = !selectAllBroker;
    setSelectAllBroker(allChecked);

    if (allChecked) {
      setBrokerSelected(uniqueDataBroker.map((d) => d));
    } else {
      setBrokerSelected([]);
    }
  };

  const handleCheckBoxChangeForMobile = (mobile) => {
    const isSelected = mobileSelected.includes(mobile);
    if (isSelected) {
      setMobileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== mobile),
      );
      setSelectAllMobile(false);
    } else {
      setMobileSelected((prevSelected) => [...prevSelected, mobile]);
      setSelectAllMobile(mobileSelected.length === uniqueDataMobile.length - 1);
    }
  };

  const handleCheckBoxChangeForMaxProfit = (maxProfit) => {
    const isSelected = maxProfitSelected.includes(maxProfit);
    if (isSelected) {
      setMaxProfitSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxProfit),
      );
      setSelectAllMaxProfit(false);
    } else {
      setMaxProfitSelected((prevSelected) => [...prevSelected, maxProfit]);
      setSelectAllMaxProfit(
        maxProfitSelected.length === uniqueDataMaxProfit.length - 1,
      );
    }
  };

  const handleCheckBoxChangeForMaxLoss = (maxLoss) => {
    const isSelected = maxLossSelected.includes(maxLoss);
    if (isSelected) {
      setMaxLossSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxLoss),
      );
      setSelectAllMaxLoss(false);
    } else {
      setMaxLossSelected((prevSelected) => [...prevSelected, maxLoss]);
      setSelectAllMaxLoss(
        maxLossSelected.length === uniqueDataMaxLoss.length - 1,
      );
    }
  };

  const handleSelectAllForMobile = () => {
    const allChecked = !selectAllMobile;
    setSelectAllMobile(allChecked);

    if (allChecked) {
      setMobileSelected(uniqueDataMobile.map((d) => d.toString()));
    } else {
      setMobileSelected([]);
    }
  };
  const handleSelectAllForMaxProfit = () => {
    const allChecked = !selectAllMaxProfit;
    setSelectAllMaxProfit(allChecked);

    if (allChecked) {
      setMaxProfitSelected(uniqueDataMaxProfit.map((d) => d.toString()));
    } else {
      setMaxProfitSelected([]);
    }
  };

  const handleSelectAllForMaxLoss = () => {
    const allChecked = !selectAllMaxLoss;
    setSelectAllMaxLoss(allChecked);

    if (allChecked) {
      setMaxLossSelected(uniqueDataMaxLoss.map((d) => d.toString()));
    } else {
      setMaxLossSelected([]);
    }
  };

  const handleCheckboxChangeMTM = (mtmAll) => {
    const isSelected = mtmSelected.includes(mtmAll);
    if (isSelected) {
      setMTMSelected((prevSelected) =>
        prevSelected.filter((item) => item !== mtmAll),
      );
      setSelectAllMTM(false);
    } else {
      setMTMSelected((prevSelected) => [...prevSelected, mtmAll]);
      setSelectAllMTM(mtmSelected.length === uniqueDataMTM.length - 1);
    }
  };

  const handleSelectAllForMTM = () => {
    const allChecked = !selectAllMTM;
    setSelectAllMTM(allChecked);

    if (allChecked) {
      setMTMSelected(uniqueDataMTM.map((d) => d.toString()));
    } else {
      setMTMSelected([]);
    }
  };

  const handleCheckboxChangeNet = (net) => {
    const isSelected = netSelected.includes(net);
    if (isSelected) {
      setNetSelected((prevSelected) =>
        prevSelected.filter((item) => item !== net),
      );
      setSelectAllNet(false);
    } else {
      setNetSelected((prevSelected) => [...prevSelected, net]);
      setSelectAllNet(netSelected.length === uniqueDataNet.length - 1);
    }
  };

  const handleSelectAllForNet = () => {
    const allChecked = !selectAllNet;
    setSelectAllNet(allChecked);

    if (allChecked) {
      setNetSelected(uniqueDataNet.map((d) => d));
    } else {
      setNetSelected([]);
    }
  };

  const handleCheckboxChangeAvailableMargin = (availableMargin) => {
    const isSelected = availableMarginSelected.includes(availableMargin);
    if (isSelected) {
      setAvailableMarginSelected((prevSelected) =>
        prevSelected.filter((item) => item !== availableMargin),
      );
      setSelectAllAvailableMargin(false);
    } else {
      setAvailableMarginSelected((prevSelected) => [
        ...prevSelected,
        availableMargin,
      ]);
      setSelectAllAvailableMargin(
        availableMarginSelected.length === uniqueDataAvailableMargin.length - 1,
      );
    }
  };

  const handleSelectAllForAvailableMargin = () => {
    const allChecked = !selectAllAvailableMargin;
    setSelectAllAvailableMargin(allChecked);

    if (allChecked) {
      setAvailableMarginSelected(
        uniqueDataAvailableMargin.map((d) => d.toString()),
      );
    } else {
      setAvailableMarginSelected([]);
    }
  };

  const handleCheckboxChangeQtyByExposure = (qtyByExposure) => {
    const isSelected = qtyByExposureSelected.includes(qtyByExposure);
    if (isSelected) {
      setQtyByExposureSelected((prevSelected) =>
        prevSelected.filter((item) => item !== qtyByExposure),
      );
      setSelectAllQtyByExposure(false);
    } else {
      setQtyByExposureSelected((prevSelected) => [
        ...prevSelected,
        qtyByExposure,
      ]);
      setSelectAllQtyByExposure(
        qtyByExposureSelected.length === uniqueDataQtyByExposure.length - 1,
      );
    }
  };

  const handleSelectAllForQtyByExposure = () => {
    const allChecked = !selectAllQtyByExposure;
    setSelectAllQtyByExposure(allChecked);

    if (allChecked) {
      setQtyByExposureSelected(
        uniqueDataQtyByExposure.map((d) => d.toString()),
      );
    } else {
      setQtyByExposureSelected([]);
    }
  };

  const handleCheckboxChangeMaxOpenTrades = (maxOpenTrades) => {
    const isSelected = maxOpenTradesSelected.includes(maxOpenTrades);
    if (isSelected) {
      setMaxOpenTradesSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxOpenTrades),
      );
      setSelectAllMaxOpenTrades(false);
    } else {
      setMaxOpenTradesSelected((prevSelected) => [
        ...prevSelected,
        maxOpenTrades,
      ]);
      setSelectAllMaxOpenTrades(
        maxOpenTradesSelected.length === uniqueDataMaxOpenTrades.length - 1,
      );
    }
  };

  const handleSelectAllForMaxOpenTrades = () => {
    const allChecked = !selectAllMaxOpenTrades;
    setSelectAllMaxOpenTrades(allChecked);

    if (allChecked) {
      setMaxOpenTradesSelected(
        uniqueDataMaxOpenTrades.map((d) => d.toString()),
      );
    } else {
      setMaxOpenTradesSelected([]);
    }
  };

  const handleCheckboxChangeQtyMultiplier = (qtyMultiplier) => {
    const isSelected = qtyMultiplierSelected.includes(qtyMultiplier);
    if (isSelected) {
      setQtyMultiplierSelected((prevSelected) =>
        prevSelected.filter((item) => item !== qtyMultiplier),
      );
      setSelectAllQtyMultiplier(false);
    } else {
      setQtyMultiplierSelected((prevSelected) => [
        ...prevSelected,
        qtyMultiplier,
      ]);
      setSelectAllQtyMultiplier(
        qtyMultiplierSelected.length === uniqueDataQtyMultiplier.length - 1,
      );
    }
  };

  const handleSelectAllForQtyMultiplier = () => {
    const allChecked = !selectAllQtyMultiplier;
    setSelectAllQtyMultiplier(allChecked);

    if (allChecked) {
      setQtyMultiplierSelected(
        uniqueDataQtyMultiplier.map((d) => d.toString()),
      );
    } else {
      setQtyMultiplierSelected([]);
    }
  };

  const handleCheckboxChangeEmail = (email) => {
    const isSelected = emailSelected.includes(email);
    if (isSelected) {
      setEmailSelected((prevSelected) =>
        prevSelected.filter((item) => item !== email),
      );
      setSelectAllEmail(false);
    } else {
      setEmailSelected((prevSelected) => [...prevSelected, email]);
      setSelectAllEmail(emailSelected.length === uniqueDataEmail.length - 1);
    }
  };

  const handleSelectAllForEmail = () => {
    const allChecked = !selectAllEmail;
    setSelectAllEmail(allChecked);

    if (allChecked) {
      setEmailSelected(uniqueDataEmail.map((d) => d.toLowerCase()));
    } else {
      setEmailSelected([]);
    }
  };
  const handleCheckboxChangeSqOffTime = (sqOffTime) => {
    const isSelected = sqOffTimeSelected.includes(sqOffTime);
    if (isSelected) {
      setSqOffTimeSelected((prevSelected) =>
        prevSelected.filter((item) => item !== sqOffTime),
      );
      setSelectAllSqOffTime(false);
    } else {
      setSqOffTimeSelected((prevSelected) => [...prevSelected, sqOffTime]);
      setSelectAllSqOffTime(
        sqOffTimeSelected.length === uniqueDataSqOffTime.length - 1,
      );
    }
  };

  const handleSelectAllForSqOffTime = () => {
    const allChecked = !selectAllSqOffTime;
    setSelectAllSqOffTime(allChecked);

    if (allChecked) {
      setSqOffTimeSelected(uniqueDataSqOffTime.map((d) => d.toLowerCase()));
    } else {
      setSqOffTimeSelected([]);
    }
  };

  const handleCheckboxChangeUser = (userId) => {
    const isSelected = userIdSelected.includes(userId);
    if (isSelected) {
      setuserIdSelected(userIdSelected.filter((item) => item !== userId));
      setSelectAllForId(false);
    } else {
      setuserIdSelected((prevSelected) => [...prevSelected, userId]);
      setSelectAllForId(userIdSelected.length === uniqueDatauserId.length - 1);
    }
  };

  const handleSelectAllForUserId = () => {
    const allChecked = !selectAllForId;
    setSelectAllForId(allChecked);
    if (allChecked) {
      setuserIdSelected(uniqueDatauserId.map((d) => d.toLowerCase()));
    } else {
      setuserIdSelected([]);
    }
  };
  const handleCheckboxChangeMaxLossPerTrade = (maxLossPerTrade) => {
    const isSelected = maxLossPerTradeSelected.includes(maxLossPerTrade);
    if (isSelected) {
      setMaxLossPerTradeSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxLossPerTrade),
      );
      setSelectAllMaxLossPerTrade(false);
    } else {
      setMaxLossPerTradeSelected((prevSelected) => [
        ...prevSelected,
        maxLossPerTrade,
      ]);
      setSelectAllMaxLossPerTrade(
        maxLossPerTradeSelected.length === uniqueDataMaxLossPerTrade.length - 1,
      );
    }
  };

  const handleSelectAllForMaxLossPerTrade = () => {
    const allChecked = !selectAllMaxLossPerTrade;
    setSelectAllMaxLossPerTrade(allChecked);

    if (allChecked) {
      setMaxLossPerTradeSelected(
        uniqueDataMaxLossPerTrade.map((d) => d.toString()),
      );
    } else {
      setMaxLossPerTradeSelected([]);
    }
  };

  const handleOkClick = () => {
    updateFilteredRows({
      nameSelected,
      userIdSelected,
      mobileSelected,
      maxProfitSelected,
      maxLossSelected,
      mtmSelected,
      netSelected,
      availableMarginSelected,
      qtyByExposureSelected,
      maxLossPerTradeSelected,
      maxOpenTradesSelected,
      qtyMultiplierSelected,
      emailSelected,
      sqOffTimeSelected,
      brokerSelected,
      setNameSelected,
      setuserIdSelected,
      setMobileSelected,
      setMaxProfitSelected,
      setMaxLossSelected,
      setSelectAll,
      setSelectAllForId,
      setSelectAllMobile,
      setSelectAllMaxProfit,
      setSelectAllMaxLoss,
      setMTMSelected,
      setSelectAllMTM,
      setNetSelected,
      setSelectAllNet,
      setAvailableMarginSelected,
      setSelectAllAvailableMargin,
      setQtyByExposureSelected,
      setSelectAllQtyByExposure,
      setMaxLossPerTradeSelected,
      setSelectAllMaxLossPerTrade,
      setMaxOpenTradesSelected,
      setSelectAllMaxOpenTrades,
      setQtyMultiplierSelected,
      setSelectAllQtyMultiplier,
      setEmailSelected,
      setSelectAllEmail,
      setSqOffTimeSelected,
      setSelectAllSqOffTime,
      setSelectAllBroker,
      setBrokerSelected,

      setuniqueDataNames,
      setuniqueDataBroker,
      setuniqueDatauserId,
      setuniqueDataSqOffTime,
      setuniqueDataEmail,
      setuniqueDataQtyMultiplier,
      setuniqueDataMaxOpenTrades,
      setuniqueDataQtyByExposure,
      setuniqueDataMaxLossPerTrade,
      setuniqueDataNet,
      setuniqueDataMaxProfit,
      setuniqueDataMaxLoss,
      setuniqueDataMobile,
      setuniqueDataMTM,
      setuniqueDataAvailableMargin,
    });
    setshowSearchProfile((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, false]),
      ),
    );
  };

  //// console.log("rows", brokerState)
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const handleAddRow = (rowData) => {
    const mandatoryFields = ["userId", "name", "broker", "qrCode", "password"];
    let fieldsWithError = {};

    const hasMissingFields = rows.some((row) => {
      if (row.broker === "pseudo_account") {
        return false; // Skip validation for pseudo account
      }
      const missingFields = mandatoryFields.filter((field) => !row[field]);
      missingFields.forEach((field) => (fieldsWithError[field] = true));
      return missingFields.length > 0;
    });
    const isDuplicateUserId = rows.some(
      (row, index) =>
        rows
          .slice(0, index)
          .some((otherRow) => otherRow.userId === row.userId) ||
        rows
          .slice(index + 1)
          .some((otherRow) => otherRow.userId === row.userId)
    );

    if (isDuplicateUserId) {
      handleMsg({
        msg: "Duplicate clientId detected. Please use a Different userId.",
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
        user: rowData.userId || "USER",
      });
      return; // Prevent adding a new row if userId is duplicate
    }

    if (!hasMissingFields && !isDuplicateUserId) {
      setErrorDisplayed(false); // Reset error display status
      const newRow = {
        enabled: true,
        mtmAll: "0",
        net: "0",
        availableMargin: 0,
        name: "",
        userId: "",
        broker: "",
        secretKey: "",
        apiKey: "",
        qrCode: "",
        sqOffTime: "00:00:00",
        maxProfit: "0",
        maxLoss: "0",
        profitLocking: "",
        qtyByExposure: "0",
        maxLossPerTrade: "0",
        maxOpenTrades: "0",
        qtyMultiplier: 0.0,
        mobile: "",
        email: "",
        password: "",
        autoLogin: false,
        historicalApi: false,
        inputDisabled: false,
        Utilized_Margin: 0.0,
        max_open_trades: 0,
      };

      const updatedRows = [...rows, newRow];
      dispatch(
        setBrokers({
          brokers: updatedRows,
        }),
      );
    } else {
      const missingFields = mandatoryFields.filter(
        (field) => fieldsWithError[field],
      );
      if (missingFields.length > 0) {
        const errorMsg = `Please enter ${missingFields.join(", ")} before adding a new row.`;
        handleMsg({
          msg: errorMsg,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
          user: rows.userId ? rows.userId : "USER",
        });
      }
      setErrorDisplayed(true);
    }
  };

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = 0;
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [rows.length]);

  const updateRowData = async (index, updatedData) => {
    const updatedRows = [...rows];
    const existingRow = updatedRows[index];

    updatedRows[index] = { ...existingRow, ...updatedData };

    dispatch(
      setBrokers({
        brokers: updatedRows,
      })
    );
  };


  // const handleValidateRefs = useRef([]);
  // const handleVerifyLogin = () => {
  //   handleValidateRefs.current.forEach((validateRef) => {
  //     setInterval(validateRef, 3000);
  //     // validateRef();
  //   });
  //   if (tableRef.current) {
  //     tableRef.current.scrollLeft = 0;
  //   }
  // };
  const [filteredRows, setFilteredRows] = useState(rows);
  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);


  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows = ({
    nameSelected,
    userIdSelected,
    mobileSelected,
    maxProfitSelected,
    maxLossSelected,
    mtmSelected,
    netSelected,
    availableMarginSelected,
    qtyByExposureSelected,
    maxLossPerTradeSelected,
    maxOpenTradesSelected,
    qtyMultiplierSelected,

    emailSelected,
    brokerSelected,
    sqOffTimeSelected,
    setuniqueDataNames,
    setuniqueDataBroker,
    setuniqueDatauserId,
    setuniqueDataSqOffTime,
    setuniqueDataEmail,
    setuniqueDataQtyMultiplier,
    setuniqueDataMaxOpenTrades,
    setuniqueDataQtyByExposure,
    setuniqueDataMaxLossPerTrade,
    setuniqueDataNet,
    setuniqueDataMaxProfit,
    setuniqueDataMaxLoss,
    setuniqueDataMobile,
    setuniqueDataMTM,
    setuniqueDataAvailableMargin,
  }) => {
    let prevfilteredRows;
    if (userIdSelected.length !== 0) {
      prevfilteredRows = rows.filter((row) =>
        userIdSelected.includes(row.userId.toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    if (nameSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        nameSelected.includes(row.name.toLowerCase()),
      );
    }
    if (mobileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        mobileSelected.includes(row.mobile.toString()),
      );
    }
    if (maxProfitSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxProfitSelected.includes(row.maxProfit.toString()),
      );
    }
    if (maxLossSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossSelected.includes(row.maxLoss.toString()),
      );
    }
    if (mtmSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        mtmSelected.includes(row.mtmAll.toString()),
      );
    }
    if (qtyByExposureSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        qtyByExposureSelected.includes(row.qtyByExposure.toString()),
      );
    }
    if (netSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        netSelected.includes(row.net.toString()),
      );
    }
    if (availableMarginSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        availableMarginSelected.includes(row.availableMargin.toString()),
      );
    }
    if (maxLossPerTradeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossPerTradeSelected.includes(row.maxLossPerTrade.toString()),
      );
    }
    if (maxOpenTradesSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxOpenTradesSelected.includes(row.maxOpenTrades.toString()),
      );
    }
    if (qtyMultiplierSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        qtyMultiplierSelected.includes(row.qtyMultiplier.toString()),
      );
    }
    if (emailSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        emailSelected.includes(row.email.toLowerCase()),
      );
    }
    if (sqOffTimeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        sqOffTimeSelected.includes(row.sqOffTime.toLowerCase()),
      );
    }
    if (brokerSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        brokerSelected.includes(row.broker.toLowerCase()),
      );
    }

    const arrayNames = [
      "nameSelected",
      "brokerSelected",
      "userIdSelected",
      "sqOffTimeSelected",
      "emailSelected",
      "qtyMultiplierSelected",
      "maxOpenTradesSelected",
      "qtyByExposureSelected",
      "maxLossPerTradeSelected",
      "setNetSelected",
      "maxProfitSelected",
      "maxLossSelected",
      "mobileSelected",
      "mtmSelected",
      "availableMarginSelected",
    ];

    const arrays = [
      nameSelected,
      brokerSelected,
      userIdSelected,
      sqOffTimeSelected,
      emailSelected,
      qtyMultiplierSelected,
      maxOpenTradesSelected,
      qtyByExposureSelected,
      maxLossPerTradeSelected,
      netSelected,
      maxProfitSelected,
      maxLossSelected,
      mobileSelected,
      mtmSelected,
      availableMarginSelected,
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

    if (NameOfNonEmptyArray !== "nameSelected") {
      setuniqueDataNames(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.name;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "brokerSelected") {
      setuniqueDataBroker(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.broker;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "userIdSelected") {
      setuniqueDatauserId(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.userId;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "sqOffTimeSelected") {
      setuniqueDataSqOffTime(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.sqOffTime;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "emailSelected") {
      setuniqueDataEmail(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.email;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "qtyMultiplierSelected") {
      setuniqueDataQtyMultiplier(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.qtyMultiplier;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxOpenTradesSelected") {
      setuniqueDataMaxOpenTrades(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.maxOpenTrades;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "qtyByExposureSelected") {
      setuniqueDataQtyByExposure(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.qtyByExposure;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxLossPerTradeSelected") {
      setuniqueDataMaxLossPerTrade(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.maxLossPerTrade;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "setNetSelected") {
      setuniqueDataNet(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.net;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxProfitSelected") {
      setuniqueDataMaxProfit(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.maxProfit;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "maxLossSelected") {
      setuniqueDataMaxLoss(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.maxLoss;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "mobileSelected") {
      setuniqueDataMobile(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.mobile;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "mtmSelected") {
      setuniqueDataMTM(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.mtmAll;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "availableMarginSelected") {
      setuniqueDataAvailableMargin(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.availableMargin;
            }),
          ),
        );
      });
    }
    setFilteredRows(prevfilteredRows);
  };

  const [showSecretKey, setShowSecretKey] = useState(true);

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const userProfPageCols = [
    "Action",
    "Client Id",
    "Manual Exit",
    "Mtm (All)",
    "Available margin",
    "Display Name",
    "Broker",
    "API Key",
    "API Secret Key",
    "Data API",
    "QR code",
    "Exit Time",
    "Auto Login",
    "Pin",
    "Max Profit",
    "Max Loss",
    "Profit Locking",
    "Qty By Exposure",
    // "Qty on Max",
    // "Max Loss Per",
    "Qty on Max Loss Per Trade",
    "Max Loss Per Trade",
    "Max Open Trades",
    "Qty Multiplier",
    "Mobile",
    "Email",
    "Net",
    "Market Orders",
    "Enable NRML sqoff",
    "Enable CNC sqOff",
    "Exit Order Type",
    "2FA",
    "Max Loss Wait",
    "Trading Authorization Req",
    "Commodity Margin",
    "API User Details",
    "Utilized Margin",
  ];

  const [userProfColVis, setuserProfColVis] = useState(allVisState.userProfVis);

  const [profColsSelectedALL, setprofColsSelectedALL] = useState(false);

  const profPageColSelectAll = () => {
    //// console.log("profPageColSelectAll");
    setprofColsSelectedALL((prev) => !prev);
    userProfPageCols.map((userSettingCol) => {
      setuserProfColVis((prev) => ({
        ...prev,
        [userSettingCol]: profColsSelectedALL,
      }));
    });
  };

  const [userProfSeq, setuserProfSeq] = useState(allSeqState.userProfSeq);
  useEffect(() => {
    setuserProfSeq(allSeqState.userProfSeq);
    setuserProfColVis((prev) => {
      const colVis = {};
      Object.keys(userProfColVis).map((col) => {
        if (allSeqState.userProfSeq.includes(col)) {
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
        userProfVis: userProfColVis,
      }),
    );
    //// console.log("userProfColVis", userProfColVis)
    if (new Set(Object.values(userProfColVis)).size === 1) {
      if (Object.values(userProfColVis).includes(true)) {
        setuserProfSeq(userProfPageCols);
      } else {
        setuserProfSeq([]);
      }
    }
  }, [userProfColVis]);

  useEffect(() => {
    //// console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        userProfSeq: userProfSeq,
      }),
    );
  }, [userProfSeq]);

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchProfile((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, false]),
        ),
      );
    }
  };

  const handleManualSqOff = async (index) => {
    try {
      const row = rows[index];
      if (!row || !row.inputDisabled) {
        handleMsg({
          msg: "Please log in the broker account",
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }

      let endpoint = "";
      let endpoint2 = "";

      switch (row.broker) {
        case "angelone":
          endpoint = `${import.meta.env.SERVER_HOST}/api/broker/angelone_user_equity_sqoff/${mainUser}/${row.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/api/broker/angelone_user_options_sqoff/${mainUser}/${row.userId}`;
          break;
        case "fyers":
          endpoint = `${import.meta.env.SERVER_HOST}/api/broker/fyers_user_equity_sqoff/${mainUser}/${row.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/api/broker/fyers_user_options_sqoff/${mainUser}/${row.userId}`;
          break;
        case "flattrade":
          endpoint = `${import.meta.env.SERVER_HOST}/api/broker/flattrade_user_equity_sqoff/${mainUser}/${row.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/api/broker/flattrade_user_options_sqoff/${mainUser}/${row.userId}`;
          break;
        case "pseudo_account":
          endpoint = `${import.meta.env.SERVER_HOST}/api/broker/pseudo_user_options_sqoff/${mainUser}/${row.userId}`;
          endpoint2 = `${import.meta.env.SERVER_HOST}/api/broker/pseudo_user_equity_sqoff/${mainUser}/${row.userId}`
          break;
        default:
          return;
      }

      await callEndpoint(endpoint, row);
      await callEndpoint(endpoint2, row);

      // setShowModal(false);
    } catch (error) {
      console.error("Error occurred:", error.message);
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

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleUpdateValues = async (
    maxProfit,
    maxLoss,
    maxLossPerTrade,
    qtyMultiplier,
    maxOpenTrades,
    sqOffTime,
    index
  ) => {
    const row = rows[index];
    try {
      const maxValues = {
        max_profit: maxProfit,
        max_loss: maxLoss,
        max_loss_per_trade: maxLossPerTrade,
        user_multiplier: qtyMultiplier,
        max_open_trades: maxOpenTrades,
        exit_time: sqOffTime,

        // Include this value
      };

      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/api/broker/update_user_data/${mainUser}/${row.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(maxValues),
        }
      );

      if (response.ok) {
        const res = await response.json();

        console.log("Response:", res);
      } else {
        console.error("Failed to update maxProfitLoss");
      }
    } catch (error) {
      console.error("Error updating maxProfitLoss:", error);
    }
  };

  // const checkTimeAndTriggerApi = (sqOffTime) => {
  //   const targetTime = new Date();
  //   const [hours, minutes, seconds] = sqOffTime.split(':').map(Number);
  //   targetTime.setHours(hours, minutes, seconds, 0);

  //   const checkInterval = setInterval(() => {
  //     const now = new Date();
  //     if (now >= targetTime) {
  //       clearInterval(checkInterval);
  //       handleManualSqOff();
  //     }
  //   }, 1000); // Check every second
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(checkTimeAndTriggerApi, 1000);
  //   return () => clearInterval(intervalId);
  // }, [rows]);

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

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const togglePopup = (index) => {
    const profitLocking = rows
      .filter((row, i) => index === i)[0]
      ?.profitLocking.split("~");
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

  const handleInputChange = (name, value) => {
    setPopupValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const updateUserProfitLocking = async (
    brokerID,
    profitReachesValue,
    lockProfitValue,
    increaseInProfit,
    trailProfitBy,
  ) => {
    //// console.log("abc", popupValues.index, `${profitReachesValue}~${lockProfitValue}~${increaseInProfit}~${trailProfitBy}`)
    const response = await fetch(
      `${import.meta.env.SERVER_HOST}/api/broker/update_user_profit_lockingdata/${mainUser}/${brokerID}`,
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
    //// console.log("handleSetTrailTGT")
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
    // const newprofitLocking =
    updateRowData(popupValues.index, {
      profitLocking: `${profitReachesValue}~${lockProfitValue}~${increaseInProfitValue}~${trailProfitByValue}`,
    });
    const brokerID = rows.filter((row, i) => popupValues.index === i)[0]
      ?.userId;

    updateUserProfitLocking(
      brokerID,
      profitReachesValue,
      lockProfitValue,
      increaseInProfitValue,
      trailProfitByValue,
    );
    setShowPopup(false)

  };

  const handleInputDelete = () => {
    updateRowData(popupValues.index, {
      profitLocking: "~~~",
    });

    const brokerID = rows.filter((row, i) => popupValues.index === i)[0]
      ?.userId;

    updateUserProfitLocking(brokerID, "", "", "", "");

    setPopupValues((prev) => ({
      // index : '',
      ...prev,
      profitReaches: "",
      lockMinimumProfit: "",
      increaseInProfit: "",
      trailProfitBy: "",
    }));
  };

  const userProfTH = {
    Action: userProfColVis["Action"] && (
      <th colSpan="2"
        style={{ width: '400px', textAlign: 'center' }}>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-13px",
            }}
            onClick={() => {
              setShowSelectBox((prev) => !prev);
            }}
          />


        </div>
        {showSelectBox && (
          <div>
            <select
              type="text"
              value={colFilter.val}
              onChange={(e) => {
                setcolFilter({
                  asPerCol: "Action",
                  val: e.target.value,
                });
              }}
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
    "Client Id": userProfColVis["Client Id"] && (
      <th>
        <div>
          <small>Client Id</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-13px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchId" ? !prev.showSearchId : false,
                  ]),
                ),
              }));
            }}
          />


        </div>
        {showSearchProfile.showSearchId && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllForId}
                    onChange={handleSelectAllForUserId}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDatauserId
                    .filter((name) => name !== undefined)
                    .map((userId, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={userIdSelected.includes(
                              userId.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeUser(userId.toLowerCase())
                            }
                          />
                          <label>{userId}</label>
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
                  setshowSearchProfile((prev) =>
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

    // "Manual Exit": userProfColVis["Manual Exit"] && (
    //   <th>
    //     <div>
    //       <small>Manual Exit</small>
    //     </div>
    //   </th>
    // ),
    "Mtm (All)": userProfColVis["Mtm (All)"] && (
      <th>
        <div>
          <small>Mtm (All)</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-13px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMTM" ? !prev.showSearchMTM : false,
                  ]),
                ),
              }));
            }}
          />


        </div>
        {showSearchProfile.showSearchMTM && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMTM}
                    onChange={handleSelectAllForMTM}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMTM
                    .filter((name) => name !== undefined)
                    .map((mtm, index) => (
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
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Available margin": userProfColVis["Available margin"] && (
      <th>
        <div>
          <small>Available margin</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-13px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchAvailableMargin"
                      ? !prev.showSearchAvailableMargin : false,
                  ]),
                ),
              }));
            }}
          />



        </div>
        {showSearchProfile.showSearchAvailableMargin && (
          <div className="Filter-popup">
            <form
              id="filter-form-available-margin"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllAvailableMargin}
                    onChange={handleSelectAllForAvailableMargin}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataAvailableMargin
                    .filter((name) => name !== undefined)
                    .map((availableMargin, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={availableMarginSelected.includes(
                            availableMargin,
                          )}
                          onChange={() =>
                            handleCheckboxChangeAvailableMargin(availableMargin)
                          }
                        />
                        <label>{availableMargin}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Display Name": userProfColVis["Display Name"] && (
      <th>
        <div>
          <small>Display Name</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-13px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchName" ? !prev.showSearchName : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchName && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAll}
                    onChange={handleSelectAllForName}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNames
                    .filter((name) => name !== undefined)
                    .map((name, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={nameSelected.includes(name.toLowerCase())}
                          onChange={() =>
                            handleCheckboxChange(name.toLowerCase())
                          }
                        />
                        <label>{name}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    Broker: userProfColVis["Broker"] && (
      <th>
        <div>
          <small>Broker</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-10px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchBroker" ? !prev.showSearchBroker : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchBroker && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllBroker}
                    onChange={handleSelectAllForBroker}
                  />
                  Select all
                </li>
                {uniqueDataBroker
                  .filter((name) => name !== undefined)
                  .map((broker, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={brokerSelected.includes(broker)}
                        onChange={() => handleCheckboxChangeBroker(broker)}
                      />
                      <label>{broker}</label>
                    </div>
                  ))}
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "API Key": userProfColVis["API Key"] && (
      <th>
        <div>
          <small>API Key</small>
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
    "API Secret Key": userProfColVis["API Secret Key"] && (
      <th>
        <div>
          <small>API Secret Key</small>
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
    "Data API": userProfColVis["Data API"] && (
      <th>
        {/* <div>
      <small>Data API</small>
      <div className="icon-container">
        <CiFilter className="filter_icon" />
      </div>
    </div> */}
        <div>
          <small>Data API</small>
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
    "QR code": userProfColVis["QR code"] && (
      <th>
        <div>
          <small>QR code</small>
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
    "Exit Time": userProfColVis["Exit Time"] && (
      <th>
        <div>
          <small>Exit Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-20px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchSqOffTime"
                      ? !prev.showSearchSqOffTime
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchSqOffTime && (
          <div className="Filter-popup">
            <form
              id="filter-form-sqOffTime"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllSqOffTime}
                    onChange={handleSelectAllForSqOffTime}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataSqOffTime
                    .filter((name) => name !== undefined)
                    .map((sqOffTime, index) => (
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
                            handleCheckboxChangeSqOffTime(
                              sqOffTime.toLowerCase(),
                            )
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
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Auto Login": userProfColVis["Auto Login"] && (
      <th>
        <div>
          <small>Auto Login</small>
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
    Pin: userProfColVis["Pin"] && (
      <th>
        <div>
          <small>Pin</small>
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
    "Max Profit": userProfColVis["Max Profit"] && (
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
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxProfit"
                      ? !prev.showSearchMaxProfit
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit
                    .filter((name) => name !== undefined)
                    .map((maxProfit, index) => (
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
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Max Loss": userProfColVis["Max Loss"] && (
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
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxLoss"
                      ? !prev.showSearchMaxLoss
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchMaxLoss && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxLoss}
                    onChange={handleSelectAllForMaxLoss}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLoss
                    .filter((name) => name !== undefined)
                    .map((maxLoss, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossSelected.includes(maxLoss)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxLoss(maxLoss)
                          }
                        />
                        <label>{maxLoss}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Profit Locking": userProfColVis["Profit Locking"] && (
      <th>
        <div>
          <small>Profit Locking</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-5px",
            }}
          />
        </div>
      </th>
    ),
    "Qty By Exposure": userProfColVis["Qty By Exposure"] && (
      <th>
        <div>
          <small>Qty By Exposure</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchQtyByExposure"
                      ? !prev.showSearchQtyByExposure
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchQtyByExposure && (
          <div className="Filter-popup">
            <form
              id="filter-form-qty-by-exposure"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllQtyByExposure}
                    onChange={handleSelectAllForQtyByExposure}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataQtyByExposure
                    .filter((name) => name !== undefined)
                    .map((qtyByExposure, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Qty on Max Loss Per Trade": userProfColVis[
      "Qty on Max Loss Per Trade"
    ] && (
        <th>
          <div>
            <small>Qty on Max Loss Per Trade</small>
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
    "Max Loss Per Trade": userProfColVis["Max Loss Per Trade"] && (
      <th>
        <div>
          <small>Max Loss Per Trade</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxLossPerTrade"
                      ? !prev.showSearchMaxLossPerTrade
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxLossPerTrade && (
          <div className="Filter-popup">
            <form
              id="filter-form-max-loss-per-trade"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxLossPerTrade}
                    onChange={handleSelectAllForMaxLossPerTrade}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLossPerTrade
                    .filter((name) => name !== undefined)
                    .map((maxLossPerTrade, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossPerTradeSelected.includes(
                            maxLossPerTrade.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeMaxLossPerTrade(
                              maxLossPerTrade.toString(),
                            )
                          }
                        />
                        <label>{maxLossPerTrade}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Max Open Trades": userProfColVis["Max Open Trades"] && (
      <th>
        <div>
          <small>Max Open Trades</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxOpenTrades"
                      ? !prev.showSearchMaxOpenTrades
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxOpenTrades && (
          <div className="Filter-popup">
            <form
              id="filter-form-max-open-trades"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxOpenTrades}
                    onChange={handleSelectAllForMaxOpenTrades}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxOpenTrades
                    .filter((name) => name !== undefined)
                    .map((maxOpenTrades, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxOpenTradesSelected.includes(
                            maxOpenTrades.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeMaxOpenTrades(
                              maxOpenTrades.toString(),
                            )
                          }
                        />
                        <label>{maxOpenTrades}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Qty Multiplier": userProfColVis["Qty Multiplier"] && (
      <th>
        <div>
          <small>Qty Multiplier</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchQtyMultiplier"
                      ? !prev.showSearchQtyMultiplier
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchQtyMultiplier && (
          <div className="Filter-popup">
            <form
              id="filter-form-qty-multiplier"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllQtyMultiplier}
                    onChange={handleSelectAllForQtyMultiplier}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataQtyMultiplier
                    .filter((name) => name !== undefined)
                    .map((qtyMultiplier, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={qtyMultiplierSelected.includes(
                            qtyMultiplier.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeQtyMultiplier(
                              qtyMultiplier.toString(),
                            )
                          }
                        />
                        <label>{qtyMultiplier}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    Mobile: userProfColVis["Mobile"] && (
      <th>
        <div>
          <small>Mobile</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // 25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMobile" ? !prev.showSearchMobile : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchMobile && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMobile}
                    onChange={handleSelectAllForMobile}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMobile.map((mobile, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={mobileSelected.includes(mobile)}
                        onChange={() => handleCheckBoxChangeForMobile(mobile)}
                      />
                      <label>{mobile}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    Email: userProfColVis["Email"] && (
      <th>
        {/* <div>
      <small>Email</small>
      <div className="icon-container">
        <CiFilter
          className="filter_icon"
          onClick={() => {
            setShowSearchEmail((prev) => !prev);
          }}
        />
      </div>
    </div> */}
        <div>
          <small>Email</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-30px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchEmail" ? !prev.showSearchEmail : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchEmail && (
          <div className="Filter-popup">
            <form id="filter-form-email" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllEmail}
                    onChange={handleSelectAllForEmail}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataEmail.map((email, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={emailSelected.includes(email.toLowerCase())}
                        onChange={() =>
                          handleCheckboxChangeEmail(email.toLowerCase())
                        }
                      />
                      <label>{email}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    Net: userProfColVis["Net"] && (
      <th>
        <div>
          <small>Net</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchNet" ? !prev.showSearchNet : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchNet && (
          <div className="Filter-popup">
            <form id="filter-form-net" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllNet}
                    onChange={handleSelectAllForNet}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNet
                    .filter((name) => name !== undefined)
                    .map((net, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={netSelected.includes(net)}
                          onChange={() => handleCheckboxChangeNet(net)}
                        />
                        <label>{net}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
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
    "Market Orders": userProfColVis["Market Orders"] && (
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
    "Enable NRML sqoff": userProfColVis["Enable NRML sqoff"] && (
      <th>
        <div>
          <small>Enable NRML sqoff</small>
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
    "Enable CNC sqOff": userProfColVis["Enable CNC sqOff"] && (
      <th>
        <div>
          <small>Enable CNC sqOff</small>
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
    "Exit Order Type": userProfColVis["Exit Order Type"] && (
      <th>
        <div>
          <small>Exit Order Type</small>
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
    Password: userProfColVis["Password"] && (
      <th>
        <div>
          <small>Password</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
          />
        </div>
      </th>
    ),
    "2FA": userProfColVis["2FA"] && (
      <th>
        <div>
          <small>2FA</small>
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
    "Max Loss Wait Sec": userProfColVis["Max Loss Wait Sec"] && (
      <th>
        <div>
          <small>Max Loss Wait Sec</small>
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
    "Trading Authorization Req": userProfColVis[
      "Trading Authorization Req"
    ] && (
        <th>
          <div>
            <small>
              Trading Authorization
              Req
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
    "Commodity Margin": userProfColVis["Commodity Margin"] && (
      <th>
        <div>
          <small>Commodity Margin</small>
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
    "API User Details": userProfColVis["API User Details"] && (
      <th>
        <div>
          <small>API User Details</small>
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
    "Utilized Margin": userProfColVis["Utilized Margin"] && (
      <th>
        <div>
          <small>Utilized Margin</small>
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
    "Utilized Margin %": userProfColVis["Utilized Margin %"] && (
      <th>
        <div>
          <small>Utilized Margin %</small>
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
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  const openModalForExpiry = () => {
    setIsOpenModal(true);
  };

  const closeModalForExpiry = () => {
    setIsOpenModal(false);
  };
  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate("/Subscription");
  }

  const savedExpiry = new Date(cookies.get('expiryDate'));
  const currentDate = new Date();
  const timeDifference = savedExpiry - currentDate;
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Check if the alert has been shown already (using localStorage)
  const alertShown = localStorage.getItem('subscriptionAlertShown');
  const daysRemaining = savedExpiry.toDateString();

  if (dayDifference <= 2 && dayDifference > 0 && !alertShown) {
    openModalForExpiry();
    localStorage.setItem('subscriptionAlertShown', 'true');
  }
  const [brokerName, setBrokerName] = useState([]);

  const HandleBrokers = async () => {
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/api/admin/broker_list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json(); // You need to parse the JSON from the response
        console.log(data.brokers);
        setBrokerName(data.brokers) // Logs the brokers list to the console
      } else {
        console.error("Failed to fetch brokers:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const brokerList = () => {
    HandleBrokers();
  };
  useEffect(() => {
    HandleBrokers();
  }, [])
  const [marketOrdersOpen, setMarketOrdersOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [selectedName, setSelectedName] = useState('');


  const handleOpenMarketOrders = (userId, broker, name) => {
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

  return (
    <div onClick={handleCloseAllSearchBox}>
      <div className="dashboard-header">
        <MarketIndex />
        <RightNav />
      </div>

      <div className="main-section">

        <div className="middle-main-container">

          {/* .......... add button container........... */}
          <div>
            <div className="add_collapse -mt-4">
              <div className="self-stretch my-auto w-[238px] flex items-center gap-1">
                <i className="bi bi-person"></i>

                <span className="text-blue-600 font-bold">User Profile</span>{" "}
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
                  onClick={handleAddRow}
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
          <div className="main-table" ref={tableRef}>
            <table>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                {userProfSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {userProfTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody>
                {filteredRows
                  .filter((row) => {
                    if (colFilter.val === "all") {
                      return row; // Display all rows
                    } else if (colFilter.val === "checked") {
                      return row.enabled;
                    } else if (colFilter.val === "unchecked") {
                      return !row.enabled;
                    }
                    return row; // Default to displaying all rows
                  })
                  .map((rowData, index) => {

                    const userProfTD = {
                      Action: userProfColVis["Action"] && (
                        <td
                          style={{ width: "15%", paddingLeft: "15px", textAlign: "center" }}
                          colSpan="2"
                        ><div className="flex gap-2">
                            <span className="tooltip-container" >
                              {rowData.enabled ? (

                                <i className="bi bi-stop-circle" style={{ color: 'red' }} onClick={() => {
                                  updateRowData(index, {
                                    enabled: !rowData.enabled,
                                  });
                                }}></i>


                              ) : (
                                <i class="bi bi-play" style={{ color: 'green' }} onClick={() => {
                                  updateRowData(index, {
                                    enabled: !rowData.enabled,
                                  });
                                }} ></i>

                              )}
                              <span className="tooltiptexts ">
                                {rowData.enabled ? "Disable" : "Enable"}
                              </span>
                            </span>
                            <span className="tooltip-container">
                              {rowData.inputDisabled ? (
                                <i className="bi bi-download" style={{
                                  transform: 'rotate(90deg)',
                                  display: 'inline-block',
                                  WebkitTransform: 'rotate(90deg)', // Adding vendor prefix
                                  msTransform: 'rotate(90deg)', // Adding vendor prefix
                                  transition: 'transform 0.2s' // Smooth rotation if needed
                                }} onClick={() => {
                                  handleLogout(rowData, index);
                                }}></i>

                              ) : (
                                <i className="bi bi-download" style={{
                                  transform: 'rotate(270deg)',
                                  display: 'inline-block',
                                  WebkitTransform: 'rotate(270deg)', // Adding vendor prefix
                                  msTransform: 'rotate(270deg)', // Adding vendor prefix
                                  transition: 'transform 0.2s' // Smooth rotation if needed
                                }} onClick={() => {
                                  handleLogout(rowData, index);
                                }}></i>
                                // <img
                                //   src={Log}
                                //   alt="icon"
                                //   className="logout_icon"
                                //   style={{
                                //     height: "25px",
                                //     width: "25px",
                                //   }}
                                // />
                              )}
                              <span
                                className={`tooltiptext ${rowData.inputDisabled
                                  ? "login-tooltip"
                                  : "logout-tooltip"
                                  }`}
                              >
                                {rowData.inputDisabled ? "Logout" : "Login"}
                              </span>
                            </span>


                            <span className="tooltip-container">
                              <i className="bi bi-trash3" style={{ color: "red" }} onClick={() => {
                                handleDelete(rowData, index);
                              }}></i>
                              {/* <img
                              src={Delete}
                              alt="icon"
                              className="cross_icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                handleDelete(rowData, index);
                              }}
                            /> */}
                              <span className="tooltiptext delete-tooltip">
                                Delete
                              </span>
                            </span>
                          </div>
                        </td>
                      ),
                      "Client Id": userProfColVis["Client Id"] && (
                        <td>
                          <input
                            type="text"
                            value={rowData.userId || ""}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue !== rowData.userId) {
                                updateRowData(index, { userId: newValue });
                              }
                            }}
                            onBlur={(e) => {
                              const newValue = rowData.userId;

                              const isDuplicate = rows.some(
                                (row, rowIndex) => row.userId === newValue && rowIndex !== index
                              );

                              if (isDuplicate) {
                                updateRowData(index, { userId: "", isDuplicate: true });

                                handleMsg({
                                  msg: "Client Ids are the same. Please enter a different Client Id.",
                                  logType: "WARNING",
                                  timestamp: `${new Date().toLocaleString()}`,
                                  user: newValue,
                                });
                              } else {
                                // Clear duplicate flag if the value is unique
                                updateRowData(index, { isDuplicate: false });
                              }
                            }}
                            readOnly={rowData.inputDisabled}
                            autoComplete="off"
                            style={{
                              color: rowData.inputDisabled ? "darkgray" : "initial",

                            }}
                          />
                        </td>
                      ),


                      "Manual Exit": userProfColVis["Manual Exit"] && (
                        <td style={{ textAlign: "center" }}>
                          <i
                            className="bi bi-download"
                            style={{
                              transform: 'rotate(270deg)',
                              display: 'inline-block',
                              WebkitTransform: 'rotate(270deg)', // Adding vendor prefix
                              msTransform: 'rotate(270deg)', // Adding vendor prefix
                              transition: 'transform 0.2s' // Smooth rotation if needed
                            }}
                            onClick={() => {
                              handleManualSqOff(index);
                            }}
                          ></i>

                          {/* <img
                            src={Log}
                            alt="icon"
                            className="logout_icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={() => {
                              handleManualSqOff(index);
                            }}
                          /> */}
                        </td>
                      ),
                      "Mtm (All)": userProfColVis["Mtm (All)"] && (
                        <td style={{ textAlign: "right" }}>
                          <input
                            type="text"
                            value={
                              !isNaN(Number(rowData.mtmAll)) && Number(rowData.mtmAll) !== 0
                                ? Number(rowData.mtmAll).toFixed(2)
                                : rowData.mtmAll // Fallback to the original value if it's not a number
                            }
                            onChange={(e) =>
                              updateRowData(index, { mtmAll: e.target.value })
                            }
                            style={{
                              textAlign: "center",
                              padding: "8px",
                              color: !isNaN(Number(rowData.mtmAll)) && Number(rowData.mtmAll) < 0 ? "red" : "green",
                            }}
                            readOnly
                          />
                        </td>
                      ),

                      "Available margin": userProfColVis["Available margin"] && (
                        <td>
                          <input
                            type="number"
                            value={Number(rowData.availableMargin).toFixed(2)}
                            onChange={() => { }}
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              color: "darkgray",
                            }}
                            readOnly={true}
                            step="0.01"
                          />
                        </td>
                      ),

                      "Display Name": userProfColVis["Display Name"] && (
                        <td>
                          <input
                            type="text"
                            value={rowData.name}
                            onChange={(e) =>
                              updateRowData(index, { name: e.target.value })
                            }
                            style={{
                              padding: "8px",
                              color: rowData.inputDisabled
                                ? "initial"
                                : "darkgray",
                            }}
                            readOnly={rowData.inputDisabled}
                          />
                        </td>
                      ),
                      Broker: userProfColVis["Broker"] && (
                        <td>
                          <select
                            onChange={(e) =>
                              updateRowData(index, { broker: e.target.value })
                            }
                            onClick={brokerList}
                            value={rowData.broker}
                            disabled={rowData.inputDisabled}
                            style={{
                              padding: "8px",
                              color: rowData.inputDisabled
                                ? "initial"
                                : "darkgray",
                            }}
                          >
                            <option value="">--select</option>
                            {brokerName?.map((broker) => (
                              <option key={broker.id} value={broker.name}>
                                {broker.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      ),
                      "API Key": userProfColVis["API Key"] && (
                        <td>
                          <div style={{ position: "relative" }}>
                            <input
                              type={
                                showPasswordRowsApi[index] ? "text" : "password"
                              }
                              value={rowData.apiKey}
                              onChange={(e) =>
                                updateRowData(index, { apiKey: e.target.value })
                              }
                              readOnly={rowData.inputDisabled}
                              style={{
                                paddingRight: "25px",
                                padding: "8px",
                                color: rowData.inputDisabled
                                  ? "initial"
                                  : "darkgray",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                right: "5px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                togglePasswordVisibilityForRowApi(index)
                              }
                            >
                              {showPasswordRowsApi[index] ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </span>
                          </div>
                        </td>
                      ),
                      "API Secret Key": userProfColVis["API Secret Key"] && (
                        <td>
                          {showSecretKey && (
                            <div style={{ position: "relative" }}>
                              <input
                                type={
                                  showPasswordRowsSecretKey[index]
                                    ? "text"
                                    : "password"
                                }
                                value={rowData.secretKey}
                                readOnly={rowData.inputDisabled}
                                onChange={(e) =>
                                  updateRowData(index, {
                                    secretKey: e.target.value,
                                  })
                                }
                                style={{
                                  paddingRight: "25px",
                                  padding: "8px",
                                  color: rowData.inputDisabled
                                    ? "initial"
                                    : "darkgray",
                                }}
                              />
                              <span
                                style={{
                                  position: "absolute",
                                  right: "5px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  togglePasswordVisibilityForRowSecretKey(index)
                                }
                              >
                                {showPasswordRowsSecretKey[index] ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </span>
                            </div>
                          )}
                        </td>
                      ),
                      "Data API": userProfColVis["Data API"] && (
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={rowData.historicalApi}
                            value={rowData.historicalApi}
                            onChange={() => {
                              updateRowData(index, {
                                historicalApi: !rowData.historicalApi,
                              });
                            }}
                            style={{ padding: "8px" }}
                          />
                        </td>
                      ),
                      "QR code": userProfColVis["QR code"] && (
                        <td>
                          <div style={{ position: "relative" }}>
                            <input
                              type={
                                showPasswordRowsQr[index] ? "text" : "password"
                              }
                              value={rowData.qrCode}
                              onChange={(e) =>
                                updateRowData(index, { qrCode: e.target.value })
                              }
                              readOnly={rowData.inputDisabled}
                              style={{
                                paddingRight: "25px",
                                padding: "8px",
                                color: rowData.inputDisabled
                                  ? "initial"
                                  : "darkgray",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                right: "5px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                togglePasswordVisibilityForRowQr(index)
                              }
                            >
                              {showPasswordRowsQr[index] ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </span>
                          </div>
                        </td>
                      ),
                      "Exit Time": userProfColVis["Exit Time"] && (
                        <td>
                          <TimePicker
                            className="custom-time-picker"
                            value={rowData.sqOffTime}
                            disableClock={true}
                            format="HH:mm:ss"
                            maxDetail={'second'}
                            clearIcon={null}
                            clockIcon={null}
                            onChange={(newTime) => {
                              updateRowData(index, { sqOffTime: newTime });

                            }}
                            onBlur={() =>
                              handleUpdateValues(
                                rowData.maxProfit,
                                rowData.maxLoss,
                                rowData.maxLossPerTrade,
                                rowData.qtyMultiplier,
                                rowData.maxOpenTrades,
                                newTime,
                                index
                              )
                            }

                          />
                        </td>
                      ),
                      "Auto Login": userProfColVis["Auto Login"] && (
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={rowData.autoLogin}
                            value={rowData.autoLogin}
                            onChange={() => {
                              updateRowData(index, {
                                autoLogin: !rowData.autoLogin,
                              });
                            }}
                            style={{ padding: "8px" }}
                          />
                        </td>
                      ),
                      Pin: userProfColVis["Pin"] && (
                        <td>
                          <input
                            type="password"
                            value={rowData.password}
                            onChange={(e) =>
                              updateRowData(index, { password: e.target.value })
                            }
                            readOnly={rowData.inputDisabled}
                            style={{
                              // width: '40%',
                              display: "inline-block",
                              padding: "8px",
                              color: rowData.inputDisabled
                                ? "initial"
                                : "darkgray",
                            }}
                            autoComplete="off"
                          />
                        </td>
                      ),
                      "Max Profit": userProfColVis["Max Profit"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.maxProfit}
                            // readOnly={(() => {
                            //   const hasPositions = position.some(
                            //     (pos) => pos["User ID"] === rowData.userId && pos["Net Qty"] !== 0
                            //   );
                            //   return hasPositions;
                            // })()}
                            onChange={(e) => {
                              const regex = /^\d{1,7}(\.\d{0,2})?$/;
                              if (
                                regex.test(e.target.value) ||
                                e.target.value === ""
                              ) {
                                updateRowData(index, {
                                  maxProfit: e.target.value,
                                });

                              }
                            }}
                            onBlur={(e) =>
                              handleUpdateValues(
                                e.target.value,
                                rowData.maxLoss,
                                rowData.maxLossPerTrade,
                                rowData.qtyMultiplier,
                                rowData.maxOpenTrades,
                                rowData.sqOffTime,
                                index
                              )
                            }
                            style={{
                              textAlign: "center",
                              padding: "8px",
                              color: "green",
                            }}
                          />
                        </td>
                      ),

                      "Max Loss": userProfColVis["Max Loss"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.maxLoss}
                            // readOnly={(() => {
                            //   const hasPositions = position.some(
                            //     (pos) => pos["User ID"] === rowData.userId && pos["Net Qty"] !== 0
                            //   );
                            //   return hasPositions;
                            // })()}
                            onChange={(e) => {
                              const regex = /^\d{1,7}(\.\d{0,2})?$/;
                              if (
                                regex.test(e.target.value) ||
                                e.target.value === ""
                              ) {
                                updateRowData(index, {
                                  maxLoss: e.target.value,
                                });
                              }
                            }}
                            onBlur={(e) =>
                              handleUpdateValues(
                                rowData.maxProfit,
                                e.target.value,
                                rowData.maxLossPerTrade,
                                rowData.qtyMultiplier,
                                rowData.maxOpenTrades,
                                rowData.sqOffTime,
                                index
                              )
                            }
                            style={{
                              textAlign: "center",
                              padding: "8px",
                              color: "red",
                            }}
                          />
                        </td>
                      ),
                      "Profit Locking": userProfColVis["Profit Locking"] && (
                        <td style={{ padding: 0, position: "relative" }}>
                          <input
                            type="text"
                            value={rowData.profitLocking}
                            onChange={(e) =>
                              updateRowData(index, {
                                profitLocking: e.target.value,
                              })
                            }
                            // readOnly={(() => {
                            //   const hasPositions = position.some(
                            //     (pos) => pos["User ID"] === rowData.userId && pos["Net Qty"] !== 0
                            //   );
                            //   return hasPositions;
                            // })()}
                            style={{ padding: "8px", textAlign: "center" }}
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
                            }}
                          />

                        </td>
                      ),
                      "Qty By Exposure": userProfColVis["Qty By Exposure"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.qtyByExposure}
                            onChange={(e) =>
                              updateRowData(index, {
                                qtyByExposure: e.target.value,
                              })
                            }
                            style={{ textAlign: "center", padding: "8px" }}
                          />
                        </td>
                      ),
                      "Qty on Max Loss Per Trade": userProfColVis[
                        "Qty on Max Loss Per Trade"
                      ] && (
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              name="Qty_on_Max_Loss_PerTrade"
                              style={{ padding: "8px" }}
                            />
                          </td>
                        ),
                      "Max Loss Per Trade": userProfColVis["Max Loss Per Trade"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.maxLossPerTrade}
                            onChange={(e) => {
                              updateRowData(index, {
                                maxLossPerTrade: newMaxLossPerTrade,
                              });
                            }}
                            onBlur={(e) => {
                              const regex = /^\d{1,7}(\.\d{0,2})?$/;
                              const newMaxLossPerTrade = e.target.value;

                              if (
                                regex.test(newMaxLossPerTrade) ||
                                newMaxLossPerTrade === ""
                              ) {
                                if (
                                  parseFloat(newMaxLossPerTrade) <= parseFloat(rowData.maxLoss) ||
                                  parseFloat(rowData.maxLoss) === 0
                                ) {

                                  handleUpdateValues(
                                    rowData.maxProfit,
                                    rowData.maxLoss,
                                    newMaxLossPerTrade,
                                    rowData.qtyMultiplier,
                                    rowData.maxOpenTrades,
                                    rowData.sqOffTime,
                                    index
                                  );
                                } else {
                                  handleMsg({
                                    msg: "max_Loss_Per_Trade value must be less than or equal to max_loss",
                                    logType: "MESSAGE",
                                    timestamp: `${new Date().toLocaleString()}`,
                                    user: rowData.userId,
                                  });
                                }
                              }
                            }}

                            style={{ textAlign: "center", padding: "8px", color: "red" }}
                          />
                        </td>
                      ),

                      "Max Open Trades": userProfColVis["Max Open Trades"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.maxOpenTrades}
                            onChange={(e) => {
                              updateRowData(index, {
                                maxOpenTrades: e.target.value,
                              });
                            }}
                            onBlur={(e) => {
                              const regex = /^\d{1,7}(\.\d{0,2})?$/;
                              if (
                                regex.test(e.target.value) ||
                                e.target.value === ""
                              ) {

                                handleUpdateValues(
                                  rowData.maxProfit,
                                  rowData.maxLoss,
                                  rowData.maxLossPerTrade,
                                  rowData.qtyMultiplier,
                                  e.target.value,
                                  rowData.sqOffTime,
                                  index
                                );
                              }
                            }

                            }
                            style={{ textAlign: "center", padding: "8px" }}
                          />
                        </td>
                      ),

                      "Qty Multiplier": userProfColVis["Qty Multiplier"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.qtyMultiplier == null ? "1" : rowData.qtyMultiplier}
                            // readOnly={(() => {
                            //   const hasPositions = position.some(
                            //     (pos) => pos["User ID"] === rowData.userId && pos["Net Qty"] !== 0
                            //   );
                            //   return hasPositions;
                            // })()}
                            onChange={(e) => {
                              updateRowData(index, {
                                qtyMultiplier: e.target.value,
                              });
                            }}
                            onBlur={(e) => {
                              const regex = /^\d{1,7}(\.\d{0,2})?$/;
                              if (
                                regex.test(e.target.value) ||
                                e.target.value === ""
                              ) {

                                handleUpdateValues(
                                  rowData.maxProfit,
                                  rowData.maxLoss,
                                  rowData.maxLossPerTrade,
                                  e.target.value,
                                  rowData.maxOpenTrades,
                                  rowData.sqOffTime,
                                  index
                                );
                              }
                            }
                            }
                            style={{ textAlign: "center", padding: "8px" }}
                          />
                        </td>
                      ),
                      Mobile: userProfColVis["Mobile"] && (
                        <td>
                          <input
                            type="text"
                            value={rowData.mobile}
                            onChange={(e) =>
                              updateRowData(index, { mobile: e.target.value })
                            }
                          />
                        </td>
                      ),
                      Email: userProfColVis["Email"] && (
                        <td>
                          <input
                            type="email"
                            value={rowData.email}
                            onChange={(e) =>
                              updateRowData(index, { email: e.target.value })
                            }
                          />
                        </td>
                      ),
                      Net: userProfColVis["Net"] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.net}
                            onChange={(e) =>
                              updateRowData(index, { net: e.target.value })
                            }
                            style={{ textAlign: "center" }}
                            disabled={rowData.inputDisabled}
                          />
                        </td>
                      ),
                      "Market Orders": userProfColVis["Market Orders"] && (
                        <td onClick={() => handleOpenMarketOrders(rowData.userId, rowData.broker, rowData.name)}>
                          <input type="text" value="" readOnly />
                        </td>
                      ),
                      "Enable NRML sqoff": userProfColVis[
                        "Enable NRML sqoff"
                      ] && (
                          <td style={{ textAlign: "center", }}>

                            <select
                              className="custom-select"
                              style={{
                                width: '180px',
                                padding: "8px",
                                color: rowData.inputDisabled ? "initial" : "darkgray",
                              }}
                            >
                              <option value="none">None</option>
                              <option value="all">All</option>
                              <option value="today">Today</option>

                            </select>
                          </td>
                        ),
                      "Enable CNC sqOff": userProfColVis[
                        "Enable CNC sqOff"
                      ] && (
                          <td style={{ textAlign: "center" }}>
                            <input type="checkbox" />
                          </td>
                        ),
                      "Exit Order Type": userProfColVis["Exit Order Type"] && (
                        <td style={{ textAlign: "center" }}>
                          <input type="text" value="Market" disabled
                            style={{
                              textAlign: 'center',
                              color: "#000"

                            }} />
                        </td>
                      ),
                      // Password: userProfColVis[ "Password" ] && (
                      //   <td>
                      //     <input type="text" />
                      //   </td>
                      // ),
                      "2FA": userProfColVis["2FA"] && (
                        <td>
                          <input type="text" />
                        </td>
                      ),
                      "Max Loss Wait Sec": userProfColVis[
                        "Max Loss Wait Sec"
                      ] && (
                          <td>
                            <input type="text" />
                          </td>
                        ),
                      "Trading Authorization Req": userProfColVis[
                        "Trading Authorization Req"
                      ] && (
                          <td style={{ textAlign: "center" }}>
                            <input type="checkbox" />
                          </td>
                        ),
                      "Commodity Margin": userProfColVis[
                        "Commodity Margin"
                      ] && (
                          <td>
                            <input type="text" />
                          </td>
                        ),
                      "API User Details": userProfColVis[
                        "API User Details"
                      ] && (
                          <td>
                            <input
                              type="text"
                              value={rowData.apiUserDetails}
                              onChange={(e) =>
                                updateRowData(index, { name: e.target.value })
                              }
                              style={{ padding: "8px" }}
                              disabled={rowData.inputDisabled}
                            />
                          </td>
                        ),
                      "Utilized Margin": userProfColVis["Utilized Margin"] && (
                        <td>
                          <input type="number"

                            value={Number(rowData.utilized_Margin).toFixed(2)}
                          ></input>
                        </td>
                      ),
                      "Utilized Margin %": userProfColVis[
                        "Utilized Margin %"
                      ] && (
                          <td>
                            <input type="text" />
                          </td>
                        ),
                    };
                    return (
                      <tr key={index}>
                        {userProfSeq.map((colName, index) => {
                          return (
                            <React.Fragment key={index}>
                              {userProfTD[colName]}
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
                        handleInputChange("profitReaches", e.target.value)
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
                        handleInputChange("lockMinimumProfit", e.target.value)
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
                        handleInputChange("increaseInProfit", e.target.value)
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
                        handleInputChange("trailProfitBy", e.target.value)
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
          <ErrorContainer ref={errorContainerRef} />
        </div>
        {/* <RightNav /> */}
      </div>
      <div>
        {/* <button onClick={openModal}>Open Modal</button> */}
        <Modal
          isOpen={isOpen}
          // onRequestClose={closeModal}
          contentLabel="Example Modal"
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
              padding: "0px 30px 0px 30px",
            },
          }}
        >
          <p
            style={{
              fontSize: "20px",
              marginBottom: "5px",
              padding: 0,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Before logging out all accounts, you need to stop the trading!
          </p>
          <button
            style={{
              backgroundColor: "#FF0000",
              color: "white",
              border: "none",
              cursor: "pointer",
              padding: " 8px 10px",
              borderRadius: "7px",
              width: "40px",
              marginTop: "20px",
              // marginRight: "30px",
            }}
            onClick={closeModal}
          >
            OK
          </button>
        </Modal>
      </div>
      <div>
        {/* <button onClick={openModal}>Open Modal</button> */}
        <Modal
          isOpen={isOpenModal}
          // onRequestClose={closeModal}
          contentLabel="Example Modal"
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
              padding: "0px 30px 0px 30px",
            },
          }}
        >
          <span
            style={{
              fontSize: "20px",
              marginBottom: "5px",
              padding: 0,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Your subscription is ending on <strong>{daysRemaining} </strong>, Please renew soon.
          </span>
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: " 8px 10px",
                borderRadius: "7px",
                width: "70px",
                marginTop: "20px",
                // marginRight: "30px",
              }}
              onClick={HandleRedirect}
            >
              RENEW
            </button>
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: " 8px 10px",
                borderRadius: "7px",
                width: "70px",
                marginTop: "20px",
                marginRight: "-30px",
              }}
              onClick={closeModalForExpiry}
            >
              OK
            </button>
          </div>
        </Modal>

      </div>
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
            width: "50%px",
            maxWidth: "70%",
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
          <div style={{
            width: "50%",
            marginRight: "225px",
            marginTop: "-5px"

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
          </div>
          <div style={{ marginLeft: "15px" }}>
            <h5 style={{ paddingTop: "10px", fontSize: "14px", color: "orange" }}> SET IF "MARKET" ORDERS ARE NOT ALLOWED FOR THE USER</h5>
          </div>
          <div style={{ marginTop: "10px", marginLeft: "15px" }}>
            If this is set then MTI will Internally change all MARKET orders to the LIMIT orders as per the below settings for the Selected User
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
                <p style={{ paddingLeft: "6px" }}>
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
            // maginTop:"-100px",
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

export default UserProfiles;

