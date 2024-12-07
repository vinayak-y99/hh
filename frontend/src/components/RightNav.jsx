import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
// import { fetchOrderData } from "../App.jsx"
import { IoIosPeople } from "react-icons/io";
import 'bootstrap-icons/font/bootstrap-icons.css';
import start from "../assets/start.png";
import stop from "../assets/stop.png";
import { BsFillCaretLeftFill } from "react-icons/bs";
import rightBarTrade from "../assets/rightBarTrade.png";
import OptionChain from "../assets/Options trading/option chain .png";
import OptionPortfolioExecution from "../assets/Options trading/option portfolio execution.png";
import OptionStrategies from "../assets/Options trading/Option Strategies .png";
import OptionTrading from "../assets/Options trading/Option trading .png";
import rightBarTools from "../assets/rightBarTools.png";
import QuickTradePanels from "../assets/Trading tools/Quick trade panel .png";
import ShowQuickPositionsWindow from "../assets/Trading tools/Show quick Positions Window.png";
import SquareOffAllLoggedInUsers from "../assets/Trading tools/square off all logged in users.png";
import ManualRefresh from "../assets/Trading tools/Manual refresh .png";
import ChartinkSetting from "../assets/Trading tools/chartink setting .png";
import MTMAnalyser from "../assets/Trading tools/MTM analyser.png";
import Schedule from "../assets/Trading tools/schedule.png";
import rightBarSettings from "../assets/rightBarSettings.png";
import SettingsInstallation from "../assets/settings icons/Settings and installation .png";
import FeatureRequest from "../assets/settings icons/Feature request.png";
import SaveFilledData from "../assets/settings icons/Save fillled data .png";
import TOTPManager from "../assets/settings icons/TOTP manager.png";
import ChangePassword from "../assets/settings icons/change password.png";
import ResetAppConfigurations from "../assets/settings icons/reset app configurations .png";
import RestoreBackups from "../assets/settings icons/Restore backups .png";
import ShowHiddenColumns from "../assets/settings icons/SHow hidden columns .png";
import OpenLogFolder from "../assets/settings icons/Open log folder.png";
import LastUpdate from "../assets/settings icons/Last update .png";
import AddProfile from "../assets/Add Profile.png";
import AddPortfolio from "../assets/Trading tools/Add Portfolio.png";
import Options from "../assets/Options.png";
import EnableAllPortfolio from "../assets/Trading tools/Enable All Portfolio(s).png";
import DeleteAllPortfolio from "../assets/Trading tools/Delete All Portfolio(s).png";
import DeleteEnabledPortfolio from "../assets/Trading tools/Delete Enabled Portfolio(s).png";
import DeleteMultipleUsingCondition from "../assets/Trading tools/Delete Multiple Using Condition.png";
import SqOffAllPortfolio from "../assets/Trading tools/SqOff All Portfolio(s).png";
import ExportGrid from "../assets/Trading tools/Export Grid.png";
import ResetPortiolioForm from "../assets/Trading tools/Reset Portiolio Form.png";
import PortfolioColumnSettings from "../assets/Trading tools/Portfolio Column Settings.png";
import PortfolioLegColSettings from "../assets/Trading tools/Portfolio Leg Col Settings.png";
import UserPortfolioColSettings from "../assets/Trading tools/User Portfolio Col Settings.png";
import UserLegColumnSettings from "../assets/Trading tools/User Leg Column Settings.png";
import ClearMTMAnalyserData from "../assets/Trading tools/Clear MTM Analyser Data.png";
import refreshImg from "../assets/refresh.png";
import importIMg from "../assets/import.png";
import exportIMg from "../assets/export.png";
import { OptionQuickTradePanel } from "./OptionQuickTradePanel";
import { QuickTradePanel } from "./QuickTradePanel";
import { useSelector, useDispatch } from "react-redux";
import { setPlaceOrderStart } from "../store/slices/placeOrder";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setBrokers } from "../store/slices/broker";
import { setPortfolios } from "../store/slices/portfolio";
import { setStrategies } from "../store/slices/strategy";

import Papa from "papaparse";
import Cookies from "universal-cookie";
import { red } from "@mui/material/colors";
const cookies = new Cookies();

const RightCustomizeTwo = ({ rows, handleMsg }) => {
  const dispatch = useDispatch();
  const { placeOrderStart } = useSelector((state) => state.placeOrderStartReducer);

  useEffect(() => {
  }, [placeOrderStart]);

  const handlePlaceOrderStart = (e) => {
    const btn = e.target.closest('.start, .stop').className;
    if (btn.includes("start")) {
      if (placeOrderStart) {
        handleMsg({
          msg: "Trading is already started.",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        return;
      }

      if (rows.some((row) => row.inputDisabled)) {
        dispatch(setPlaceOrderStart({ placeOrderStart: true }));
        handleMsg({
          msg: "Trading is started.",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
      } else {
        handleMsg({
          msg: "To Start Trading, At least one broker account should be Logged In",
          logType: "WARNING",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
      }
    } else if (btn.includes("stop")) {
      if (!placeOrderStart) {
        handleMsg({
          msg: "Trading is already stopped.",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        return;
      }

      dispatch(setPlaceOrderStart({ placeOrderStart: false }));
      handleMsg({
        msg: "Trading is stopped.",
        logType: "MESSAGE",
        timestamp: ` ${new Date().toLocaleString()}`,
      });
    }
  };

  return (
    <div className="right-customize-two">
      <div
        className="start my-[10px]"
        style={{ backgroundColor: '#5cb85c', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}
        onClick={handlePlaceOrderStart}
      >
        <span className="self-stretch">START</span>

        <i class="bi bi-pause-fill" style={{ fontSize: '20px' }} ></i>
      </div>

      <div
        className="stop my-[10px]"
        style={{ backgroundColor: '#d9534f', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}
        onClick={handlePlaceOrderStart}
      >
        <span className="self-stretch ">STOP</span>

        <i class="bi bi-stop-circle" style={{ fontSize: '20px' }}></i>
      </div>
    </div>
  );
};

function RightNav() {
  // qtp popup\
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedRows([...portfolioDetails]); // Select all rows
    } else {
      setSelectedRows([]); // Deselect all rows
    }
  };

  // setSelectAll([]);
  const [ExportModal, setExportModal] = useState(false);
  const [ExportModal1, setExportModal1] = useState(false);
  const openModal = () => {
    if (pathname.includes("Portfolio")) {
      setExportModal1(true);
      setSelectAll(false);
    }
  };
  const closeModal = () => {
    setExportModal(false);
    setExportModal1(false);
    setSelectedRows([]);
  };
  const handleCancelClick = () => {
    closeModal();
  };
  // const [ selectedRows, setSelectedRows ] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [portfolios, setPortfolio] = useState([]);
  const [Strategiesi, setStrategiesi] = useState([]);
  // const [combinedPortfolio, setCombinedPortfolio] = useState([]);
  //// console.log("selectedRows", selectedRows)
  const [selectallExport, setSelectAllExport] = useState(false);
  const handleCheckboxChange = (portfolio, isChecked) => {
    if (isChecked) {
      const combinedPortfolioItem = portfolios.find(
        (item) => item.portfolio_id === portfolio.portfolio_id,
      );
      setSelectedRows((prev) => [...prev, combinedPortfolioItem]);
    } else {
      setSelectedRows((prev) =>
        prev.filter((item) => item.portfolio_id !== portfolio.portfolio_id),
      );
    }
  };

  const handleselectallExport = (e) => {
    const isChecked = e.target.checked;
    setSelectAllExport(isChecked);

    if (isChecked) {
      // Add all portfolios to selected rows
      const allSelectedRows = portfolios.map((portfolio) =>
        portfolios.find((item) => item.portfolio_id === portfolio.portfolio_id),
      );
      setSelectedRows(allSelectedRows);
    } else {
      // Remove all portfolios from selected rows
      setSelectedRows([]);
    }
  };
  useEffect(() => {
    const allSelected = portfolios.every((portfolio) =>
      selectedRows.some((row) => row.portfolio_id === portfolio.portfolio_id),
    );
    setSelectAllExport(allSelected);
  }, [selectedRows, portfolios]);

  const handleOkClick = () => {
    portfolioData(selectedRows);
    //console.log(selectedRows, "selectedRows",)

    dispatch(async (dispatch, getState) => {
      const executedPortfolios =
        getState().executedPortfolioReducer.executedPortfolios;
      let portfolios = [];

      const execPortNames = executedPortfolios.map(
        (port) => port.portfolio_name,
      );

      for (let i = 0; i < selectedRows.length; i++) {
        const port = selectedRows[i];
        if (execPortNames.includes(port.portfolio_name)) {
          let clickedPortBrokerDetails = portfolio_timings[port.portfolio_name];
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

      //console.log(portfolios, "portfolios");

      dispatch(
        setPortfolios({
          portfolios: portfolios,
        }),
      );
      //console.log(portfolios, "portfolios import");
    });

    setExportModal(false);
  };

  const handleCheckboxChange1 = (item, isChecked) => {
    setSelectedRows((prevSelected) => {
      if (isChecked) {
        // Add the selected item to the list
        return [...prevSelected, item];
      } else {
        // Remove the deselected item from the list
        return prevSelected.filter((selected) => selected !== item);
      }
    });
  };

  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();

  const { brokers: rows } = useSelector((state) => state.brokerReducer);
  const { strategies } = useSelector((state) => state.strategyReducer);
  const { orders } = useSelector((state) => state.orderBookReducer);
  const { positions } = useSelector((state) => state.positionReducer);
  const { holdings } = useSelector((state) => state.holdingReducer);

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
  const [isOpen1, setIsOpen1] = useState(false);
  const [colopen1, setColopen1] = useState(false);
  const [positionOq, setPositionOq] = useState({ x: 0, y: 0 });

  const handleDragoq = (e, ui) => {
    const { x, y } = ui;
    setPositionOq({ x, y });
  };

  const resetPositionoq = () => {
    handleDragoq(null, { x: 0, y: 0 });
  };
  const toggleOpen1 = () => {
    setColopen1(!colopen1);

    const genderDetails = document.querySelector(".OP-details");
    const udbtton = document.querySelector(".UD-button");
    const sl = document.querySelector(".SL1");

    if (colopen1) {
      genderDetails.style.display = "none";
      sl.style.display = "none";
      udbtton.style.marginTop = "15px";
    } else {
      genderDetails.style.display = "block";
      sl.style.display = "block";
      udbtton.style.marginTop = "0";
    }
  };

  const handleOpenqtp = () => {
    setIsOpen1(true);
    setColopen1(false);
    // fetchExecutedPortfolios();
  };

  const handleClose1 = () => {
    setIsOpen1(false);
  };

  // mulitpopuppage
  const [isOpen, setIsOpen] = useState(false);

  const [colopen, setColopen] = useState(true);

  const toggleOpen = () => {
    setColopen(!colopen);

    const genderDetails = document.querySelector(".gender-details");
    const userButtons = document.querySelector(".user-details-button");
    const selectImage = document.querySelector(".select-image");
    const selectImages = document.querySelector(".select-images");
    const Check = document.querySelector(".check");
    const Sl = document.querySelector(".sl");

    if (colopen) {
      Check.style.display = "block";
      Sl.style.display = "block";
      genderDetails.style.display = "block";
      userButtons.style.marginTop = "0";
      selectImage.style.top = "8%";
      selectImages.style.top = "26.7%";
    } else {
      Check.style.display = "none";
      Sl.style.display = "none";
      genderDetails.style.display = "none";
      userButtons.style.marginTop = "15px";
      selectImage.style.top = "18.8%";
      selectImages.style.top = "58.8%";
    }
  };
  const handleOpen = () => {
    setColopen(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setPosition({ x, y });
  };

  const resetPosition = () => {
    handleDrag(null, { x: 0, y: 0 });
  };


  const RefreshButton = () => {
    // fetchExecutedPortfolios();
    //console.log("mahesh",)
    handlePageClick();
    // fetchOrderData();
  };

  const { executedPortfolios } = useSelector((state) => state.executedPortfolioReducer);

  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );


  const fetchExecutedPortfolios = async () => {
    try {

      if (executedPortfolios.length === 0) {
        handleMsg({
          msg: "No executed portfolios found to square off.",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
      } else {
        const executedPortfolioNames = executedPortfolios.map(
          (execPort) => execPort.portfolio_name,
        );

        portfolioDetails.forEach((portfolio) => {
          if (executedPortfolioNames.includes(portfolio.portfolio_name)) {
            const linkedStrategy = strategies.filter(
              (strategy) => strategy.StrategyLabel === portfolio.strategy,
            )[0];
            handleManualSquareOff(
              portfolio.portfolio_name,
              linkedStrategy.StrategyLabel,
              linkedStrategy.TradingAccount,
            );
          }
        });
      }

    } catch (error) {
      console.error("Error processing executed portfolios:", error.message);
    }
  };
  const handleOpenqtp1 = () => {
    setShowModal(true);
    setMessage("Do you really want to Square Off all the Portfolio's?");
  };

  const { brokers } = useSelector((state) => state.brokerReducer);

  const handleManualSquareOff = async (
    portfolio,
    strategyLabel,
    TradingAccount,
  ) => {
    try {
      const mappedUserIds = TradingAccount.split(", ");

      for (let index = 0; index < mappedUserIds.length; index++) {
        console.log(brokers, "brokers")
        const rowData = brokers.filter(
          (row) => row.userId === mappedUserIds[index],
        )[0];
        // console.log()
        if (rowData.inputDisabled) {
          const response = await fetch(
            `${import.meta.env.SERVER_HOST}/square_off_portfolio_level/${mainUser}/${portfolio}/${rowData.broker}/${rowData.userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          if (!response.ok) {
            const errorData = await response.json();
            //// console.log(errorData, "errorData");

            handleMsg({
              msg: errorData.message,
              logType: "ERROR",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId,
              strategy: strategyLabel,
              portfolio: portfolio,
            });
          } else {
            const responseData = await response.json();
            //// console.log(responseData, "fyers");
            handleMsg({
              msg: responseData.message,
              logType: "TRADING",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId,
              strategy: strategyLabel,
              portfolio: portfolio,
            });
          }
        } else {
          handleMsg({
            msg: `Please login ${rowData.userId}, to perform square off.`,
            logType: "WARNING",
            timestamp: `${new Date().toLocaleString()}`,
            user: rowData.userId,
            strategy: strategyLabel,
            portfolio: portfolio,
          });
        }
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  // qtp popup
  const [currentDateTime, setCurrentDateTime] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        hour12: false,
      };
      const formattedDateTime = now.toLocaleString("en-IN", options);
      const [weekday, day, month, year] = formattedDateTime.split(", ");
      const rearrangedDateTime = (
        <>
          <span style={{ fontSize: "12px", fontFamily: 'sans-serif', fontWeight: '500px', color: 'grey' }}>
            {day}, {month} ({weekday}) <span className="time" style={{ fontWeight: 'bold' }}>{year}</span>
          </span>
        </>
      );
      setCurrentDateTime(rearrangedDateTime);
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const updateBroker = (index, updates) => {
    dispatch((dispatch, getState) => {
      let previousBrokers = [...getState().brokerReducer.brokers];
      previousBrokers[index] = {
        ...previousBrokers[index],
        ...updates,
      };
      dispatch(
        setBrokers({
          brokers: previousBrokers,
        }),
      );
    });
  };

  const handleBrokerLogin = async () => {
    const mandatoryFields = ["userId", "name", "broker", "qrCode", "password"];
    let allDisabled = true;
    let pseudoEnabled = false;

    // Check if at least one non-pseudo broker is enabled
    rows.forEach((data) => {
      if (data.enabled && data.broker !== "pseudo_account") {
        allDisabled = false;
      }
      if (data.enabled && data.broker === "pseudo_account") {
        pseudoEnabled = true;
      }
    });

    if (allDisabled) {
      const errorMsg =
        "Please enable at least one broker (excluding pseudo accounts)";
      handleMsg({
        msg: errorMsg,
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
        user: "USER",
      });
      return;
    }

    // Check if pseudo account is enabled but no other brokers are enabled
    if (pseudoEnabled && allDisabled) {
      const errorMsg =
        "Please enable at least one non-pseudo broker along with the pseudo account";
      handleMsg({
        msg: errorMsg,
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
        user: "USER",
      });
      return;
    }

    for (let index = 0; index < rows.length; index++) {
      const rowData = rows[index];
      if (!rowData.inputDisabled && rowData.enabled) {
        if (rowData.broker !== "pseudo_account") {
          const unfilledFields = mandatoryFields.filter(
            (field) => !rowData[field],
          );

          if (unfilledFields.length > 0) {
            const errorMsg = `Please enter ${unfilledFields.join(", ")} to confirm broker login `;
            handleMsg({
              msg: errorMsg,
              logType: "WARNING",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId !== "" ? rowData.userId : "USER",
            });
            continue;
          }
        }

        const data = {
          userId: rowData.userId,
          apiKey: rowData.apiKey,
          qrCode: rowData.qrCode,
          password: rowData.password,
          broker: rowData.broker,
          imei: rowData.imei,
          display_name: rowData.name,
          max_loss: rowData.maxLoss,
          max_profit: rowData.maxProfit,
          mainUser,
        };

        if (rowData.broker === "fyers") {
          data.secretKey = rowData.secretKey;
          data.client_id = rowData.fyersclientId;
          data.apiKey = null;
        }

        if (rowData.broker === "flattrade") {
          data.secretKey = rowData.secretKey;
          data.imei = null;
          data.fyersclientId = null;
        }

        if (rowData.broker === "pseudo_account") {
          data.apiKey = null;
          data.pin = null;
          data.qrCode = null;
        }

        const response = await fetch(`${import.meta.env.SERVER_HOST}/datavalidation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          handleMsg({
            msg: errorData.message || "An error occurred",
            logType: "ERROR",
            timestamp: `${new Date().toLocaleString()}`,
            user: rowData.userId,
          });
          continue;
        }

        const responseData = await response.json();
        //console.log(responseData, "responseData");

        if (responseData.data) {
          if (rowData.broker === "pseudo_account") {
            updateBroker(index, {
              apiUserDetails: responseData.data.data.name,
              availableMargin: responseData.data.data.availableMargin,
              net: responseData.data.data.Net ? +responseData.data.data.Net : 0,
              inputDisabled: true,
            });
          } else {
            if (rowData.broker === "flattrade") {
              updateBroker(index, {
                apiUserDetails: responseData.data.prfname,
                availableMargin: +responseData.data.cash,
                net: responseData.data.Net ? +responseData.data.Net : 0,
                inputDisabled: true,
              });
            } else {
              updateBroker(index, {
                apiUserDetails: responseData.data.data.name,
                availableMargin: +responseData.data.data.availablecash,
                net: responseData.data.data.Net ? +responseData.data.Net : 0,
                inputDisabled: true,
              });
            }
          }
        }

        const storedData = JSON.parse(localStorage.getItem("storage"));
        if (!responseData.error) {
          const dataChunk = {
            id: rowData.userId,
            margin: +responseData.data?.data?.availablecash,
          };
          if (storedData) {
            localStorage.setItem(
              "storage",
              JSON.stringify([...storedData, dataChunk]),
            );
          } else {
            localStorage.setItem("storage", JSON.stringify([dataChunk]));
          }
        }

        handleMsg({
          msg: `Logged In successfully. - ${rowData.userId}`,
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
          user: rowData.userId !== "" ? rowData.userId : "USER",
        });
      }
    }
  };

  const downloadTableData = () => {
    let tableData = [];
    let fileName = "";

    // if (selectedRows.length === 0) {
    //   handleMsg({
    //     msg: "No rows selected for export.",
    //     logType: "MESSAGE",
    //     timestamp: new Date().toLocaleString(),
    //   });
    //   return;
    // }

    if (pathname.includes("Positions")) {
      if (
        positions[0]["Symbol"] !== "" &&
        positions[0]["Symbol"] !== undefined
      ) {
        tableData = Positions;
        fileName = "positions";
      } else {
        handleMsg({
          msg: "No Data Found in Positions to export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }
    } else if (pathname.includes("Holdings")) {
      if (holdings[0]["Symbol"] !== "" && holdings[0]["Symbol"] !== undefined) {
        tableData = holdings;
        fileName = "holdings";
      } else {
        handleMsg({
          msg: "No Data Found in Holdings to export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }
    } else if (pathname.includes("OrderFlow")) {
      if (
        orders[0]["Stock Symbol"] !== "" &&
        orders[0]["Stock Symbol"] !== undefined
      ) {
        tableData = orderBook;
        fileName = "orderBook";
      } else {
        handleMsg({
          msg: "No Data Found in Order Flow to export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }
    } else if (pathname.includes("UserProfiles")) {
      if (rows.length === 1 && rows[0]["broker"] === "pseudo_account") {
        handleMsg({
          msg: "No Data Found in User Profiles to export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      } else {
        //console.log(rows, "userProfiles")
        tableData = rows; // Only selected rows
        fileName = "userProfiles";
      }
    } else if (pathname.includes("Strategies")) {
      if (strategies.length === 0 || (strategies[0]["StrategyLabel"] === "" || strategies[0]["StrategyLabel"] === undefined)) {
        handleMsg({
          msg: "No Data Found in Strategies to export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        })
        return; // Prevent further execution, stopping the export process
      } else {
        //console.log(strategies, "allstratiges")
        tableData = strategies.map((obj) => {
          return {
            ...obj,
            TradingAccount: (obj.TradingAccount || "")
              .toString()
              .replace(/,/g, ";"),
            Multiplier: (obj.Multiplier || "").toString().replace(/,/g, ";"),
          };
        });
        fileName = "strategies";
      }
    } else if (pathname.includes("Portfolio")) {

      if (selectedRows.length === 0) {
        handleMsg({
          msg: "No rows selected for Portfolio export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }

      // Check if the portfolio data in selectedRows has valid entries
      const hasValidPortfolio = selectedRows.some((obj) => obj.portfolio_id && obj.portfolio_name);
      if (!hasValidPortfolio) {
        handleMsg({
          msg: "No valid Portfolio data found for export",
          logType: "MESSAGE",
          timestamp: `${new Date().toLocaleString()}`,
        });
        return;
      }

      //console.log(selectedRows, "selectedRows")
      tableData = selectedRows.map((obj) => ({
        portfolio_id: obj.portfolio_id,
        portfolio_name: obj.portfolio_name,
        exchange: obj.exchange,
        stock_symbol: obj.stock_symbol,
        order_type: obj.order_type,
        variety: obj.variety,
        strategy: obj.strategy,
        Strategy_accounts_id: (obj.Strategy_accounts_id || "")
          .toString()
          .replace(/,/g, ";"),
        strategy_accounts: (obj.strategy_accounts || "")
          .toString()
          .replace(/,/g, ";"),
        product_type: obj.product_type,
        square_off_time: obj.square_off_time,
        start_time: obj.start_time,
        end_time: obj.end_time,
        enabled: obj.enabled,
        remarks: obj.remarks,
      })); // Only selected rows
      fileName = `${mainUser}_portfolios`;
    } else {
      handleMsg({
        msg: "Invalid pathname for export",
        logType: "MESSAGE",
        timestamp: `${new Date().toLocaleString()}`,
      });
      return;
    }

    const exportToExcel = () => {
      const csvData = convertTableToCSV(tableData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const convertTableToCSV = (data) => {
      let csv = "";
      let legs = "";

      if (data.length > 0) {
        csv += Object.keys(data[0]).join(",") + "\n";
        data.forEach((row) => {
          csv +=
            Object.values(row)
              .map((value) => `"${value}"`)
              .join(",") + "\n";
        });
      } else {
        csv = "No data available\n";
      }

      if (pathname.includes("Portfolio")) {
        // const selectedPortfolioIds = new Set(data.map(row => row.portfolio_id));
        //console.log(selectedRows, "selectedRows")
        legs = selectedRows.flatMap((portfolio) => {
          return portfolio.legs.map((leg) => ({
            id: leg.id,
            portfolio_name: portfolio.portfolio_name,
            transaction_type: leg.transaction_type,
            option_type: leg.option_type,
            lots: leg.lots,
            quantity: leg.quantity,
            expiry_date: leg.expiry_date,
            strike: leg.strike,
            limit_price: leg.limit_price || null,
            sl_value: leg.sl_value || "0",
            stop_loss: leg.stop_loss || "None",
            target: leg.target || "None",
            tgt_value: leg.tgt_value || "0",
            trail_sl: leg.trail_sl || ["", ""],
            trail_tgt: leg.trail_tgt || ["", "", "", ""],
            showPopupSL1: leg.showPopupSL1 || false,
            showPopupSL: leg.showPopupSL || false,
          }));
        });

        if (legs.length > 0) {
          let legcsv = "";
          legcsv += Object.keys(legs[0]).join(",") + "\n";
          let prevPortfolioName = legs[0]["portfolio_name"];
          legs.forEach((row) => {
            if (prevPortfolioName !== row.portfolio_name) {
              legcsv += "\n";
              prevPortfolioName = row.portfolio_name;
            }
            legcsv +=
              Object.values(row)
                .map((value) => `"${value}"`)
                .join(",") + "\n";
          });

          csv += " \n LEGS \n" + legcsv;
        }
      }

      return csv;
    };
    closeModal();

    exportToExcel();
  };
  const fileInputRef = useRef(null);
  const fileInputStrategiesRef = useRef(null);

  const [legsCount, setLegsCount] = useState({});
  const [totalLegsCount, setTotalLegsCount] = useState(0);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;

          // Define the mapping of portfolio keys to legs keys
          const keyMapping = {
            portfolio_id: "id",
            portfolio_name: "portfolio_name",
            exchange: "transaction_type",
            stock_symbol: "option_type",
            order_type: "lots",
            variety: "quantity",
            strategy: "expiry_date",
            Strategy_accounts_id: "strike",
            strategy_accounts: "limit_price",
            product_type: "sl_value",
            square_off_time: "stop_loss",
            start_time: "target",
            end_time: "tgt_value",
            enabled: "trail_sl",
            remarks: "trail_tgt",
            showPopupSL1: "showPopupSL1",
            showPopupSL: "showPopupSL",
            ltp: "ltp",
          };

          // Separate portfolios and legs
          let portfoliosArray = [];
          let isLegsSection = false;

          data.forEach((entry) => {
            if (entry.portfolio_id.trim() === "LEGS") {
              isLegsSection = true;
              return;
            }

            if (!isLegsSection) {
              // Process portfolio entries
              if (
                entry.portfolio_id.trim() !== "" &&
                entry.portfolio_id.trim() !== "id"
              ) {
                portfoliosArray.push({
                  portfolio_id: entry.portfolio_id,
                  portfolio_name: entry.portfolio_name,
                  exchange: entry.exchange,
                  stock_symbol: entry.stock_symbol,
                  order_type: entry.order_type,
                  variety: entry.variety,
                  strategy: entry.strategy,
                  Strategy_accounts_id: entry.Strategy_accounts_id,
                  strategy_accounts: entry.strategy_accounts,
                  product_type: entry.product_type,
                  square_off_time: entry.square_off_time,
                  start_time: entry.start_time,
                  end_time: entry.end_time,
                  enabled: entry.enabled,
                  remarks: entry.remarks,
                  legs: [], // Initialize legs array
                });
              }
            } else {
              // Process legs entries
              if (
                entry.portfolio_id.trim() !== "" &&
                entry.portfolio_id.trim() !== "id"
              ) {
                let leg = {};
                for (let key in keyMapping) {
                  if (entry[key] !== undefined) {
                    leg[keyMapping[key]] = entry[key];
                  }
                }

                // Find the portfolio to which this leg belongs and add the leg to it
                let portfolio = portfoliosArray.find(
                  (p) => p.portfolio_name === entry.portfolio_name,
                );
                if (portfolio) {
                  portfolio.legs.push(leg);
                }
              }
            }
          });
          const legsCount = {};
          portfoliosArray.forEach((portfolio) => {
            legsCount[portfolio.portfolio_id] = portfolio.legs.length;
          });
          setLegsCount(legsCount);
          // Set the state variables
          setExportModal(true);
          setPortfolio(portfoliosArray); // Portfolios with legs included

          //console.log(portfoliosArray, "portfoliosArray");
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };
  const strategyData = async (Strategiesi) => {
    try {
      if (!Strategiesi || Strategiesi.length === 0) {
        throw new Error("Strategies data is missing or empty");
      }

      //console.log(Strategiesi, "strategies");

      for (let i = 0; i < Strategiesi.length; i++) {
        const strategy = Strategiesi[i];
        //console.log(strategy, "stratigesfor loop")
        // Map strategy to required format
        const postData = {
          strategy_tag: strategy.strategy_label,
          broker_user_id: strategy.trading_account,
          max_profit: strategy.max_profit,
          max_loss: strategy.max_loss,
          alias: strategy.alias,
          multiplier: strategy.multiplier,
          broker: strategy.broker,
        };

        //console.log(postData, "strategy postData");
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/store_broker_and_strategy_info/${mainUser}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          },
        );

        const responseData = await response.json();
        await handleStrategiesClick();
        //console.log(responseData)

        if (!response.ok) {
          throw new Error(
            responseData.message || "Something bad happened. Please try again",
          );
        }

        //console.log(`Strategy ${i + 1} data sent successfully:`, responseData);
      }
      fetchStrategy();
    } catch (error) {
      console.error(
        "Error sending strategy data:",
        error.message || "Something bad happened. Please try again",
      );
    }
  };
  const handleFileUploadStrategies = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;

          // Define the mapping of strategy keys
          const keyMapping = {
            StrategyLabel: "strategy_label",
            TradingAccount: "trading_account",
            MaxProfit: "max_profit",
            MaxLoss: "max_loss",
            Alias: "alias",
            Multiplier: "multiplier",
            Broker: "broker",
          };

          // Process strategies entries
          let strategiesArray = data.map((entry) => {
            let strategy = {};
            for (let key in keyMapping) {
              if (entry[key] !== undefined) {
                // Split entries for fields that should be arrays
                if (["TradingAccount", "Multiplier", "Broker"].includes(key)) {
                  strategy[keyMapping[key]] = entry[key]
                    .split(";")
                    .map((item) => item.trim());
                } else {
                  strategy[keyMapping[key]] = entry[key];
                }
              }
            }
            return strategy;
          });

          // Set the state variables for strategies
          setStrategiesi(strategiesArray); // Strategies without legs

          //// console.log(strategiesArray, "strategiesArray");
          handleMsg({
            msg: "Strategies imported successfully",
            logType: "MESSAGE",
            timestamp: `${new Date().toLocaleString()}`,
            strategy: "succesfully",
          });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };
  //// console.log(Strategiesi, "strategiesArray");

  const handleStrategiesClick = async () => {
    try {
      const responseStrategyData = await fetch(
        `${import.meta.env.SERVER_HOST}/get_portfolio/${mainUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!responseStrategyData.ok) {
        const errorData = await responseStrategyData.json();
        throw {
          message:
            errorData.message || "Something bad happened. Please try again",
        };
      }

      const strategies = await responseStrategyData.json();

      dispatch(async (dispatch, getState) => {
        const currentStrategies = getState().strategyReducer.strategies;
        let updatedStrategies = [...currentStrategies, ...strategies];

        dispatch(setStrategies({ strategies: updatedStrategies })); // Refresh or re-fetch strategy data if needed
      });
    } catch (error) {
      console.error(
        "Error fetching strategies:",
        error.message || "Something bad happened. Please try again",
      );
    }
  };
  useEffect(() => {
    if (Strategiesi.length > 0) {
      strategyData(Strategiesi);
    }
  }, [Strategiesi]);

  const fetchStrategy = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/retrieve_strategy_info/${mainUser}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      //console.log(responseData, "responseData");

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
          OpenTime: "00:00:00",
          CloseTime: "00:00:00",
          SqOffTime: "00:00:00",
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
          Alias: item.alias,
          Broker: item.broker,
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
      //console.log(resetRowsData, "resetRowsData")

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

  const handleButtonClick = () => {
    if (pathname.includes("Portfolio")) {
      // Trigger the click event for the Portfolio file input
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else if (pathname.includes("Strategies")) {
      // Trigger the click event for the Strategies file input

      if (fileInputStrategiesRef.current) {
        fileInputStrategiesRef.current.click();
      }
    } else {
      handleMsg({
        msg: "File import is allowed only for Portfolio",
        logType: "MESSAGE",
        timestamp: `${new Date().toLocaleString()}`,
      });
    }
  };

  const portfolioData = async (selectedRows) => {
    try {
      if (!selectedRows || selectedRows.length === 0) {
        throw new Error("Selected portfolios data is missing or empty");
      }
      //console.log(selectedRows, "selectedRows")

      for (let i = 0; i < selectedRows.length; i++) {
        const portfolio = selectedRows[i];

        // Map portfolio to required format
        const postData = {
          strategy: portfolio.strategy,
          exchange: portfolio.exchange,
          stock_symbol: portfolio.stock_symbol,
          portfolio_name: portfolio.portfolio_name,
          product_type: portfolio.product_type,
          order_type: portfolio.order_type,
          legs: portfolio.legs.map((leg) => ({
            id: leg.id,
            expiry_date: leg.expiry_date,
            limit_price: leg.limit_price || "",
            lots: leg.lots,
            option_type: leg.option_type,
            quantity: leg.quantity,
            sl_value: leg.sl_value || "",
            stop_loss: leg.stop_loss || "",
            strike: leg.strike,
            target: leg.target || "", // Make sure 'target' is included
            tgt_value: leg.tgt_value || "",
            trail_sl: leg.trail_sl || "",
            trail_tgt: leg.trail_tgt || "",
            transaction_type: leg.transaction_type,
            showPopupSL1: leg.showPopupSL1 || false,
            showPopupSL: leg.showPopupSL || false,
            ltp: leg.ltp || "",
          })),
          start_time: portfolio.start_time || "00:00:00",
          end_time: portfolio.end_time || "00:00:00",
          square_off_time: portfolio.square_off_time || "00:00:00",
        };
        //console.log(postData, "postData");

        const response = await fetch(`${import.meta.env.SERVER_HOST}/store_portfolio/${mainUser}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        const responseData = await response.json();
        handlePageClick();
        if (!response.ok) {
          throw new Error(
            responseData.message || "Something bad happened. Please try again",
          );
        }

        //console.log(`Portfolio ${i + 1} data sent successfully:`, responseData);
      }
    } catch (error) {
      console.error(
        "Error sending data:",
        error.message || "Something bad happened. Please try again",
      );
    }
  };
  //// console.log(Strategiesi,"1308 getting csv data")

  const handleManualSquareOffForAllRows = async () => {
    try {
      const mappedUserIds = rows.filter((row) => row.inputDisabled);
      if (mappedUserIds.length === 0) {
        handleMsg({
          msg: "Please log in at least one broker account",
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
        });
      }

      for (let index = 0; index < mappedUserIds.length; index++) {
        const rowData = mappedUserIds[index];
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
      }
      setShowModal(false);
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
        //console.log("portfolios refresh", portfolios)
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const enableAllPortfolioClick = async () => {
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/enable_all_portfolios/${mainUser}`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
      });
      //// console.log(response, "response");
      if (response.ok) {
        const msg = await response.json();
        handleMsg({
          msg: msg["message"],
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        handlePageClick();
      }
    } catch (err) {
      //// console.log("error");
      //console.log(err);
    }
  };
  const deleteAllPortfolioClick = async () => {
    console.log("delete_all_portfolios")
    try {
      const response = await fetch(`${import.meta.env.SERVER_HOST}/delete_all_portfolios/${mainUser}`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
      });
      console.log(response, "response");
      if (response.ok) {
        const msg = await response.json();
        handleMsg({
          msg: msg["message"],
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        handlePageClick();
      }
    } catch (err) {
      console.log("error");
      //console.log(err);
    }
  };
  const deleteEnabledPortfolioClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/delete_all_enabled_portfolios/${mainUser}`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
        },
      );
      //// console.log(response, "response");
      if (response.ok) {
        const msg = await response.json();
        handleMsg({
          msg: msg["message"],
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        handlePageClick();
      }
    } catch (err) {
      //// console.log("error");
      //console.log(err);
    }
  };
  React.useEffect(() => {
    if (portfolioDetails.length === selectedRows.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, portfolioDetails]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="right-sidebar">
      <div className="top-main">
        <div className="top1 -mt-3">
          <div className="dashboard99">Dashboard</div>
          <div className="date-container">
            <span >{currentDateTime}</span>
          </div>

          <div
            className="right-customize-one"
            onClick={async () => {
              handleBrokerLogin();
            }}
            style={{ cursor: 'pointer' }}
          >
            <span>Confirm Broker Login</span>
            {/* <i className="bi bi-people object-contain shrink-0 self-stretch my-auto w-10 aspect-square text-lg people"></i> */}
            <i
              className="bi bi-people object-contain shrink-0 self-stretch my-auto w-6 aspect-square text-lg"
              aria-hidden="true"
              title="Broker Login Icon"
            />
          </div>
        </div>
        <div className="top2">
          <div className="right-customize-three">

            <ul>
              <li>

                <div className="flex gap-2 items-center self-stretch my-auto">
                  <i
                    className="bi bi-search object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '24px', color: 'inherit' }}
                    aria-label="Search Icon">
                  </i>

                  <div className="self-stretch my-auto w-[119px]">Search</div>
                </div>
              </li>
              <li>
                <div className="flex gap-2 items-center self-stretch my-auto w-[110px]">
                  <i
                    className="bi bi-plus object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '24px', color: '#3d69ea' }}
                    aria-label="Widgets Icon">
                  </i>


                  <div className="self-stretch my-auto w-[119px]">Widgets</div>
                </div>

              </li>
              <li>
                <div className="flex gap-2 items-center self-stretch my-auto">
                  <i
                    className="bi bi-clock-history object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '24px', color: '#3d69ea' }}
                    aria-label="Option Trading Icon">
                  </i>

                  <div className="self-stretch my-auto w-[119px]">Option Trading</div>
                </div>
                <i class="bi bi-chevron-compact-down"></i>

                {/* *************** */}
                <div className="three-options">
                  <div onClick={handleOpenqtp}>
                    <i className="bi bi-lightning" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    <span>Options Quick Trade Panel</span>
                  </div>
                  <div>
                    <i className="bi bi-graph-up-arrow" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    <span>Options Strategies payoff</span>
                  </div>
                  <div>
                    <i className="bi bi-briefcase" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    <span>Options Portfolio Execution</span>
                  </div>
                  <div onClick={() => { navigate("/Option_Chain"); }}>
                    <i className="bi bi-link-45deg" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    <span>Options Chain</span>
                  </div>
                </div>

              </li>
              <li>

                <div className="flex gap-2 items-center self-stretch my-auto">
                  <i
                    className="bi bi-bar-chart-line-fill object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '24px', color: '#3d69ea' }}
                    aria-label="Trading Tools Icon">
                  </i>

                  <h2 className="self-stretch my-auto w-[119px]">Trading Tools</h2>
                </div>
                <i class="bi bi-chevron-compact-down"></i>


                {/* *************** */}
                <div className="three-options">
                  <div>
                    <div onClick={handleOpen}>
                      <span>Quick Trade Panel</span>
                      <i className="bi bi-graph-up" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                  </div>
                  <div>
                    <span>Show Quick Positions Window</span>
                    <i className="bi bi-window" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div onClick={handleManualSquareOffForAllRows}>
                    <span>Square Off All Logged-in Users</span>
                    <i className="bi bi-x-square" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Manual Refresh Script Masters</span>
                    <i className="bi bi-arrow-clockwise" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Chartink Screener Settings</span>
                    <i className="bi bi-sliders" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>MTM Analyser</span>
                    <i className="bi bi-bar-chart-line" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Schedule Start</span>
                    <i className="bi bi-calendar-check" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                </div>

              </li>
              <li>

                <div className="flex gap-2 items-center self-stretch my-auto">
                  <i
                    className="bi bi-gear-fill object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '24x', color: '#3d69ea' }}
                    aria-label="Settings Icon">
                  </i>

                  <h2 className="self-stretch my-auto w-[119px]">Settings</h2>
                </div>
                <i class="bi bi-chevron-compact-down"></i>


                {/* *************** */}
                <div className="three-options">
                 
                  <div className="three-options">
                    <div>
                      <span>Settings and Plugins Installation</span>
                      <i className="bi bi-gear-fill" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Submit issue / Feature request</span>
                      <i className="bi bi-exclamation-circle" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Save Filled Data in Grids</span>
                      <i className="bi bi-save" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>TOTP Manager</span>
                      <i className="bi bi-shield-lock" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Change Password</span>
                      <i className="bi bi-key" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Reset App Configurations</span>
                      <i className="bi bi-arrow-counterclockwise" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Restore Auto Backups</span>
                      <i className="bi bi-cloud-arrow-down" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Show Hidden Columns in Grids</span>
                      <i className="bi bi-table" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Open Logs Folder</span>
                      <i className="bi bi-folder2-open" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                    <div>
                      <span>Last Update Change info</span>
                      <i className="bi bi-info-circle" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                    </div>
                  </div>

                  <div>
                    <span>Submit issue / Feature request</span>
                    <i className="bi bi-bug" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Save Filled Data in Grids</span>
                    <i className="bi bi-save" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>TOTP Manager</span>
                    <i className="bi bi-key" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Change Password</span>
                    <i className="bi bi-lock" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Reset App Configurations</span>
                    <i className="bi bi-arrow-clockwise" style={{ fontSize: '24px', color: '#3d69ea' }}></i>
                  </div>
                  <div>
                    <span>Restore Auto Backups</span>
                    <img src={RestoreBackups} alt="icon" />
                  </div>
                  <div>
                    <span>Show Hidden Columns in Grids</span>
                    <img src={ShowHiddenColumns} alt="icon" />
                  </div>
                  <div>
                    <span>Open Logs Folder</span>
                    <img src={OpenLogFolder} alt="icon" />
                  </div>
                  <div>
                    <span>Last Update Change info</span>
                    <img src={LastUpdate} alt="icon" />
                  </div>
                </div>
              </li>
             
            </ul>
          </div>

          <div className="right-customize-four flex justify-end items-center -space-x-2 -mr-12 ml-60">
            <div onClick={RefreshButton}>
              <section className="flex overflow-hidden gap-0 justify-center items-center self-stretch px-2 my-auto w-10 h-10 bg-blue-100 rounded-md border border-sky-300 border-solid min-h-[40px]">
                <i
                  className="bi bi-arrow-clockwise object-contain self-stretch my-auto w-6 aspect-square"
                  style={{ fontSize: '30px', color: '#3d69ea' }}
                  aria-label="Arrow Clockwise Icon">
                </i>

              </section>

            </div>
            <div>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                x
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <input
                type="file"
                accept=".csv"
                ref={fileInputStrategiesRef}
                x
                style={{ display: "none" }}
                onChange={handleFileUploadStrategies}
              />
              <div onClick={handleButtonClick} style={{ cursor: "pointer" }}>
                <section className="flex overflow-hidden gap-0 justify-center items-center self-stretch px-2 my-auto w-10 h-10 bg-blue-100 rounded-md border border-sky-300 border-solid min-h-[40px] ">
                  <i
                    className="bi bi-box-arrow-in-down-left object-contain self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '30px', color: '#3d69ea' }}
                    aria-label="Box Arrow In Down Left Icon">
                  </i>

                </section>
                {/* <img src={importIMg} alt="Import" />
                <span>Import</span> */}
              </div>
            </div>
            {/* <div onClick={downloadTableData}>
          <img src={exportIMg} alt="img" />
          <span>Export</span>
        </div> */}
            {pathname.includes("Portfolio") ? (
              <div onClick={openModal}>
                <section className="flex overflow-hidden gap-0 justify-center items-center self-stretch px-2 my-auto w-10 h-10 bg-blue-100 rounded-md border border-sky-300 border-solid min-h-[40px] ">
                  <i
                    className="bi bi-box-arrow-up-right object-contain self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '30px', color: '#3d69ea' }}
                    aria-label="Box Arrow Up Right Icon">
                  </i>

                </section>
               
              </div>
            ) : (
              <div onClick={downloadTableData}>
                <section className="flex overflow-hidden gap-0 justify-center items-center self-stretch px-2 my-auto w-10 h-10 bg-blue-100 rounded-md border border-sky-300 border-solid min-h-[40px] ">
                  <i
                    className="bi bi-box-arrow-up-right object-contain self-stretch my-auto w-6 aspect-square"
                    style={{ fontSize: '30px', color: '#3d69ea' }}
                    aria-label="Box Arrow Up Right Icon">
                  </i>

                </section>
                {/* <img src={exportIMg} alt="img" />
                <span>Export</span> */}
              </div>
            )}
          </div>
          <RightCustomizeTwo handleMsg={handleMsg} rows={rows} />
        </div>
      </div>
      <OptionQuickTradePanel
        colopen1={colopen1}
        toggleOpen1={toggleOpen1}
        handleClose1={handleClose1}
        positionOq={positionOq}
        isOpen1={isOpen1}
        setIsOpen1={setIsOpen1}
        resetPositionoq={resetPositionoq}
        handleDragoq={handleDragoq}
        executedPortfolios={executedPortfolios}
      />
      <QuickTradePanel
        handleClose={handleClose}
        toggleOpen={toggleOpen}
        colopen={colopen}
        position={position}
        isOpen={isOpen}
        resetPosition={resetPosition}
        handleDrag={handleDrag}
      />

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
            padding: "20px 20px 10px",
          },
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginBottom: "-30px",
          }}
        >
          {message}
        </p>
        <div style={{ flex: 1 }}></div>
        <div
          className="modal-buttons"
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {message !== "Trading should be stopped to Delete All Portfolio's?" &&
            message !==
            "Trading should be stopped to Delete All Enabled Portfolio's?" && (
              <button
                style={{
                  backgroundColor: "#5cb85c",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: " 8px 10px",
                  borderRadius: "7px",
                  width: "75px",
                  marginRight: "30px",
                }}
                onClick={() => {
                  if (
                    message ===
                    "Do you really want to Perform SquareOff for All Logged-In Users?"
                  ) {
                    handleManualSquareOffForAllRows();
                  } else if (
                    message === "Do you really want to enable All Portfolio's?"
                  ) {
                    enableAllPortfolioClick();
                  } else if (
                    message === "Do you really want to Delete All Portfolio's?"
                  ) {
                    deleteAllPortfolioClick();
                  } else if (
                    message ===
                    "Do you really want to Delete Enabled Portfolio's?"
                  ) {
                    deleteEnabledPortfolioClick();
                  } else if (
                    message ===
                    "Do you really want to Square Off all the Portfolio's?"
                  ) {
                    fetchExecutedPortfolios();
                  }
                  setShowModal(false);
                }}
              >
                YES
              </button>
            )}
          {message !== "Trading should be stopped to Delete All Portfolio's?" &&
            message !==
            "Trading should be stopped to Delete All Enabled Portfolio's?" && (
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "7px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  width: "75px",
                  marginRight: "-10px",
                }}
                onClick={() => setShowModal(false)}
              >
                NO
              </button>
            )}

          {(message ===
            "Trading should be stopped to Delete All Portfolio's?" ||
            message ===
            "Trading should be stopped to Delete All Enabled Portfolio's?") && (
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "7px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  width: "75px",
                  marginRight: "-10px",
                }}
                onClick={() => setShowModal(false)}
              >
                Ok
              </button>
            )}
        </div>
      </Modal>
      <Modal
        isOpen={ExportModal}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            width: "70%",
            height: "fit-content",
            maxHeight: "400px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            overflow: "auto",
          },
        }}
      >
        <div className="middle-main-container" style={{ width: "100%" }}>
          <div
            className="table-header"
            style={{
              padding: "5px",
              backgroundColor: "#4661bd",
              color: "white",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            <h2 style={{ margin: 0, textAlign: "center" }}>
              Manage Portfolio(s)
            </h2>
          </div>
          <div
            className="main-table"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #b3b0b0",
              borderBottom: "1px solid #b3b0b0",
              borderCollapse: "collapse",
              borderRadius: "5px",
            }}
          >
            <table className="table" style={{ width: "100%" }}>
              <thead style={{ position: "sticky", top: "0px", zIndex: 10 }}>
                <tr style={{ height: "35px" }}>
                  <th style={{ textAlign: "center", width: "70px" }}>
                    <span>Select All</span>
                    <input
                      type="checkbox"
                      checked={selectallExport}
                      onChange={handleselectallExport}
                      style={{ marginLeft: "15px" }}
                    />
                  </th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "center" }}>Portfolio Name</th>
                  <th style={{ textAlign: "center" }}>legscount</th>
                  <th style={{ textAlign: "center" }}>Stock_symbol</th>
                  <th style={{ textAlign: "center" }}>Strategy</th>
                  <th style={{ textAlign: "center" }}>Starttime</th>
                  <th style={{ textAlign: "center" }}>Endtime</th>
                  <th style={{ textAlign: "center" }}>Sqoftime</th>
                </tr>
              </thead>
              <tbody
                className="tabletbody"
                style={{ backgroundColor: "#e8e6e6" }}
              >
                {portfolios?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.some(
                          (row) => row.portfolio_id === item.portfolio_id,
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(item, e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        style={{ padding: "6px" }}
                        disabled
                        value={
                          executedPortfolios.includes(item.portfolio_name)
                            ? "Completed"
                            : ""
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.portfolio_name}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={legsCount[item.portfolio_id] || 0}
                        onInput={(e) => {
                          const value = e.target.value;
                          const sanitizedValue = value.replace(/[^0-9]/g, "");
                          e.target.value = sanitizedValue;
                        }}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.stock_symbol}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.strategy}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",

                          textAlign: "center",
                        }}
                        value={item.start_time}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",

                          textAlign: "center",
                        }}
                        value={item.end_time}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",
                          textAlign: "center",
                        }}
                        value={item.square_off_time}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-around",
              zIndex: 1,
            }}
          >
            <button
              onClick={handleOkClick}
              style={{
                marginTop: "20px",
                width: "100px",
                color: "white",
                backgroundColor: "green",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Import
            </button>
            <button
              onClick={handleCancelClick}
              style={{
                marginTop: "20px",
                width: "100px",
                color: "white",
                backgroundColor: "#d9534f",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={ExportModal1}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            width: "70%",
            height: "fit-content",
            maxHeight: "400px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            overflow: "auto",
          },
        }}
      >
        <div className="middle-main-container" style={{ width: "100%" }}>
          <div
            className="table-header"
            style={{
              padding: "5px",
              backgroundColor: "#4661bd",
              color: "white",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            <h2 style={{ margin: 0, textAlign: "center" }}>
              Manage Portfolio(s)
            </h2>
          </div>
          <div
            className="main-table"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #b3b0b0",
              borderBottom: "1px solid #b3b0b0",
              borderCollapse: "collapse",
              borderRadius: "5px",
            }}
          >
            <table className="table" style={{ width: "100%" }}>
              <thead style={{ position: "sticky", top: "0px", zIndex: 10 }}>
                <tr style={{ height: "35px" }}>
                  <th style={{ textAlign: "center", width: "100px" }}>
                    <span> Select</span>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      style={{ marginLeft: "15px" }}
                    />
                  </th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  <th style={{ textAlign: "center" }}>Portfolio Name</th>
                  <th style={{ textAlign: "center" }}>legscount</th>
                  <th style={{ textAlign: "center" }}>Stock_symbol</th>
                  <th style={{ textAlign: "center" }}>Strategy</th>
                  <th style={{ textAlign: "center" }}>Starttime</th>
                  <th style={{ textAlign: "center" }}>Endtime</th>
                  <th style={{ textAlign: "center" }}>Sqoftime</th>
                </tr>
              </thead>
              <tbody
                className="tabletbody"
                style={{ backgroundColor: "#e8e6e6" }}
              >
                {portfolioDetails?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item)}
                        onChange={(e) =>
                          handleCheckboxChange1(item, e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        style={{ padding: "6px" }}
                        disabled
                        value={
                          executedPortfolios.includes(item.portfolio_name)
                            ? "Completed"
                            : ""
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.portfolio_name}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.legs?.length || 0}
                        onInput={(e) => {
                          const value = e.target.value;
                          const sanitizedValue = value.replace(/[^0-9]/g, "");
                          e.target.value = sanitizedValue;
                        }}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.stock_symbol}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.strategy}
                        style={{ padding: "6px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",

                          textAlign: "center",
                        }}
                        value={item.start_time}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",

                          textAlign: "center",
                        }}
                        value={item.end_time}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue="00:00:00"
                        style={{
                          disable: "none",
                          padding: "6px",
                          textAlign: "center",
                        }}
                        value={item.square_off_time}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
              zIndex: 1,
              alignItems: "flex-end",
            }}
          >
            {pathname.includes("Portfolio") ? (
              <button
                onClick={downloadTableData}
                style={{
                  marginTop: "20px",
                  width: "150px",
                  color: "white",
                  backgroundColor: "green",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  height: "30px",
                  marginRight: "30px",
                }}
              >
                Export
              </button>
            ) : null}
            <button
              onClick={handleCancelClick}
              style={{
                marginTop: "20px",
                width: "100px",
                color: "white",
                backgroundColor: "#d9534f",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RightNav;
