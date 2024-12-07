import React, { useState, useEffect, useRef } from "react";
import { json, useParams, useSearchParams } from "react-router-dom";
import Modal from "react-modal";
import "./AddPortfolio.css";
import Timepic from "../../components/Timepic";
import { useNavigate, useLocation } from "react-router-dom";
import Fandorow from "../F&O/FandOrow";
import { setPortfolios } from "../../store/slices/portfolio";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";
import { setConsoleMsgs } from "../../store/slices/consoleMsg";
import { RotatingLines } from "react-loader-spinner";
import MarketIndex from "../../components/MarketIndex";
import RightNav from "../../components/RightNav";
import { AnimatePresence, motion } from "framer-motion";

const cookies = new Cookies();

function AnimatedCheckIcon({ initial = true, isVisible }) {
  return (
    <AnimatePresence initial={initial}>
      {isVisible && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="#4661BD"
          className="CheckIcon"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              type: "tween",
              duration: 1,
              ease: isVisible ? "easeOut" : "easeIn",
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      )}
    </AnimatePresence>
  );
}

function AddPortfolio() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const consoleMsgsState = useSelector((state) => state.consoleMsgsReducer);

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
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [ selectedWeekdays, setSelectedWeekdays ] = useState([]);
  const [ selectAllChecked, setSelectAllChecked ] = useState(false);
  const [ dropdownVisible, setDropdownVisible ] = useState(false);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ dropdownRef ]);
  useEffect(() => {
    // Check if all weekdays are selected
    const allWeekdaysSelected = selectedWeekdays.length === weekdays.length;
    setSelectAllChecked(allWeekdaysSelected);
  }, [ selectedWeekdays, weekdays ]);

  const toggleWeekday = (weekday) => {
    const updatedSelectedWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter((day) => day !== weekday)
      : [ ...selectedWeekdays, weekday ];
    const sortedSelectedWeekdays = updatedSelectedWeekdays.sort((a, b) => {
      return weekdays.indexOf(a) - weekdays.indexOf(b);
    });
    setSelectedWeekdays(sortedSelectedWeekdays);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSelectAll = () => {
    if (!selectAllChecked) {
      setSelectedWeekdays([ ...weekdays ]);
    } else {
      setSelectedWeekdays([]);
    }
    setSelectAllChecked();
  };

  const handleOk = () => {
    // Handle Ok button click here, e.g., save selected weekdays
    setDropdownVisible(false); // Close the dropdown after clicking Ok
    setIsDropdownOpen(false);
  };

  const handleCancel = () => {
    // Handle Cancel button click here, e.g., reset selected weekdays
    setSelectedWeekdays([]); // Reset selected weekdays
    setDropdownVisible(false); // Close the dropdown after clicking Cancel
    setIsDropdownOpen(false);
  };

  const params = useParams();
  const FandRowRef = useRef(null);

  const [ editPortfolio, seteditPortfolio ] = useState(false);

  // useEffect(()=> {
  ////   console.log(" editPortfolio: ", editPortfolio)}, [editPortfolio])

  const [ margin, setmargin ] = useState(() => {
    if (params.portfolio) {
      return JSON.parse(params.portfolio).margin;
    } else {
      return "0"; // Return a default value when params.portfolio is not provided
    }
  });

  const [ portfolio, setPortfolio ] = useState(() => {
    if (params.portfolio) {
      seteditPortfolio(true);

      return JSON.parse(params.portfolio);
    } else {
      seteditPortfolio(false);
      return null; // Return a default value when params.portfolio is not provided
    }
  });

  useEffect(() => {
    if (pathname.includes("Edit-Portfolio")) {
      if (params.portfolio) {
        seteditPortfolio(true);
        // setmargin(JSON.parse(params.portfolio.margin))
        setPortfolio(JSON.parse(params.portfolio));
      } else {
        seteditPortfolio(false);
        setPortfolio(null); // Return a default value when params.portfolio is not provided
      }
    }
  }, [ pathname ]);

  // useEffect(()=> {
  ////   console.log("Params portfolio: ", portfolio)
  //   if(portfolio?.margin){ setmargin(portfolio.margin)}}, [portfolio])

  const [ isPortfolioExecuted, setisPortfolioExecuted ] = useState(false);

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
        //// console.log(ExecutedPortfolios, "ExecutedPortfolios")
        //// console.log(portfolio.portfolio_name, "sdlasl")

        if (
          ExecutedPortfolios.some(
            (execPort) => execPort.portfolio_name === portfolio.portfolio_name,
          )
        ) {
          setisPortfolioExecuted(true);
        }
      } catch (error) {
        console.error("Error fetching executed portfolios:", error.message);
      }
    };
    if (editPortfolio) {
      fetchExecutedPortfolios();
    }
  }, []);

  //// console.log("params============", JSON.parse(portfolio))
  const [ showModal, setShowModal ] = useState(false);

  const handleSymbolChange = (e) => {
    setIsPortfolioEdited(true);
    const symbol = e.target.value;
    setstock_symbol(symbol);
    // setSelectedDate(""); // Reset selected date when stock symbol changes
  };

  const [ isExecutionTabActive, setIsExecutionTabActive ] = useState(true);
  const [ isTargetTabActive, setisTargetTabActive ] = useState(false);
  const [ isStoplossTabActive, setisStoplossTabActive ] = useState(false);
  const [ isExitTabActive, setisExitTabActive ] = useState(false);
  const navigate = useNavigate();

  const handleConfirmSave = async () => {
    handlePageClick();
    navigate("/F&O/Portfolio");

    setShowModal(false);
  };

  const [ timerValue1, setTimerValue1 ] = useState("00:00:00");
  const [ timerValue2, setTimerValue2 ] = useState("00:00:00");
  const [ timerValue3, setTimerValue3 ] = useState("00:00:00");

  const handleTimerChange = (e, setTimerValue) => {
    const inputTime = e.target.value;
    const formattedTime = formatInputTime(inputTime);
    setTimerValue(formattedTime);
  };

  const formatInputTime = (inputTime) => {
    const numericTime = inputTime.replace(/[^0-9]/g, "");
    const paddedTime = numericTime.padStart(6, "0");
    let hours = Math.min(parseInt(paddedTime.slice(0, 2), 10), 23);
    const minutes = parseInt(paddedTime.slice(2, 4), 10);
    const seconds = parseInt(paddedTime.slice(4, 6), 10);

    // Adjust hours to reset after 24 hours
    hours = hours % 24;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  };

  const [ activeTab, setActiveTab ] = useState("execution");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsExecutionTabActive(tab === "execution");
    setisTargetTabActive(tab === "target");
    setisStoplossTabActive(tab === "stoploss");
    setisExitTabActive(tab === "exit");
  };
  const handleToggleClick = (page) => { };
  const [ legsEdited, setlegsEdited ] = useState(false);
  const [ strategyTags, setStrategyTags ] = useState([]);

  const [ exchange, setExchange ] = useState("NFO");
  const [ stock_symbol, setstock_symbol ] = useState("NIFTY");
  const [ selectedDate, setSelectedDate ] = React.useState(null);
  const [ product_type, setProduct ] = useState("");
  const [ selectedStrategy, setSelectedStrategy ] = useState("");
  const [ order_type, setEntryOrder ] = useState("");
  const [ portfolio_name, setPortfolioName ] = useState("");
  const [ limit_price, setPrice ] = useState();

  const [ message, setMessage ] = useState("");
  const mainUser = cookies.get("USERNAME");
  const [ IsPortfolioEdited, setIsPortfolioEdited ] = useState(false);

  // const experies = useSelector(state => state.expiryReducer);

  //// console.log("experies", experies)

  const [ dateOptions, setdateOptions ] = useState([]);
  const expiryState = useSelector((state) => state.expiryReducer);
  //// console.log("NIFTY, BANKNIFTY, FINNIFTY", NIFTY,"=", BANKNIFTY,"=", FINNIFTY)
  useEffect(() => {
    const generateDateOptions = () => {
      if (!Object.values(expiryState).includes([])) {
        const currentLegs = FandRowRef.current.getLegs();
        const hasFutures = currentLegs.some((leg) => leg.option_type === "FUT");

        let Expirylist = [];
        if (stock_symbol === "NIFTY") {
          Expirylist = hasFutures
            ? [ ...new Set([ ...expiryState.NIFTY, ...expiryState.FUTNIFTY ]) ]
            : expiryState.NIFTY;
        } else if (stock_symbol === "BANKNIFTY") {
          Expirylist = hasFutures
            ? [
              ...new Set([
                ...expiryState.BANKNIFTY,
                ...expiryState.FUTBANKNIFTY,
              ]),
            ]
            : expiryState.BANKNIFTY;
        } else if (stock_symbol === "FINNIFTY") {
          Expirylist = hasFutures
            ? [
              ...new Set([
                ...expiryState.FINNIFTY,
                ...expiryState.FUTFINNIFTY,
              ]),
            ]
            : expiryState.FINNIFTY;
        }

        if (!editPortfolio) {
          setSelectedDate(Expirylist[ 0 ]);
        }

        const options = Expirylist.map((expiry) => (
          <option
            selected={
              editPortfolio
                ? portfolio.expiry_date === expiry
                : selectedDate === expiry
                  ? true
                  : false
            }
            key={`${stock_symbol}-${expiry}`}
            value={expiry}
          >
            {expiry}
          </option>
        ));

        setdateOptions(options);
      }
    };

    generateDateOptions();
  }, [ stock_symbol, expiryState ]);

  useEffect(() => {
    //// console.log("IsPortfolioEdited[0]", IsPortfolioEdited)
    //  setSelectedDate(dateOptions[0])
  }, [ IsPortfolioEdited ]);

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
      console.error("Error:", error);
    }
  };

  const handleGoBackClick = () => {
    //// console.log("first")
    if (editPortfolio) {
      let edited = false;
      const valuesMatch =
        exchange === portfolio.exchange &&
        stock_symbol === portfolio.stock_symbol &&
        selectedStrategy === portfolio.strategy &&
        order_type === portfolio.order_type &&
        portfolio.product_type === product_type;
      // portfolio.limit_price === limit_price;
      const currentLegs = FandRowRef.current.getLegs();
      const dbLegs = JSON.parse(params.portfolio).legs;

      if (currentLegs.length !== dbLegs.length) {
        edited = true;
        setIsPortfolioEdited(true);
      }

      // Sort both arrays based on some unique property
      currentLegs.sort((a, b) => a.id - b.id);
      dbLegs.sort((a, b) => a.id - b.id);
      //// console.log("currentLegs.length !== dbLegs.length", currentLegs, "=  ", dbLegs)
      // Compare each object in the arrays
      for (let i = 0; i < currentLegs.length; i++) {
        const obj1 = currentLegs[ i ];
        const obj2 = dbLegs[ i ];

        // Check if all properties are the same
        for (let key in obj2) {
          if (key !== "trail_sl" && key !== "trail_tgt") {
            if (obj1[ key ] !== obj2[ key ]) {
              edited = true;
              setIsPortfolioEdited(true);
            }
          } else {
            //// console.log("bool", (obj1[key].length === obj2[key].length), "&",  (obj1[key].every((value, index) => value === obj2[key][index])))
            if (
              !(
                obj1[ key ].length === obj2[ key ].length &&
                obj1[ key ].every((value, index) => value === obj2[ key ][ index ])
              )
            ) {
              //console.log("here is it.... 2", obj1[ key ], "==", obj2[ key ])
              edited = true;
              setIsPortfolioEdited(true);
            }
          }
        }
      }
      if (!IsPortfolioEdited && valuesMatch) {
        navigate("/F&O/Portfolio");
      } else {
        setShowModal(true);
        setMessage("Please save the changes");
      }
    } else {
      let edited = false;
      const valuesMatch =
        exchange === "NFO" &&
        stock_symbol === "NIFTY" &&
        selectedStrategy === "" &&
        order_type === "" &&
        product_type === "";
      // limit_price === "0";
      //// console.log("above details=", {
      //   exchange,
      //   stock_symbol,
      //   selectedStrategy,
      //   order_type,
      //   product_type,
      // });
      const currentLegs = FandRowRef.current.getLegs();
      if (currentLegs.length !== 1) {
        edited = true;
        setIsPortfolioEdited(true);
      }
      const leg = currentLegs[ 0 ];
      edited =
        leg.transaction_type === "BUY" &&
        leg.option_type === "CE" &&
        leg.lots === 1 &&
        leg.expiry_date === selectedDate &&
        leg.strike === "ATM";

      //// console.log("!edited && valuesMatch", !edited ,  valuesMatch)
      if (!IsPortfolioEdited && valuesMatch) {
        navigate("/F&O/Portfolio");
      } else {
        setShowModal(true);
        setMessage("Please save the changes");
      }
    }
  };

  const [ startTime, setStartTime ] = useState("00:00:00");
  const [ endTime, setEndTime ] = useState("00:00:00");
  const [ sqOffTime, setSqOffTime ] = useState("00:00:00");

  const handleTimeChange = (label, time) => {
    let isTimeChanged = false;

    if (label === "startTime") {
      if (time !== startTime) {
        setStartTime(time);
        isTimeChanged = true;
      }
    } else if (label === "endTime") {
      if (time !== endTime) {
        setEndTime(time);
        isTimeChanged = true;
      }
    } else if (label === "sqOffTime") {
      if (time !== sqOffTime) {
        setSqOffTime(time);
        isTimeChanged = true;
      }
    }

    if (isTimeChanged) {
      setIsPortfolioEdited(true);
    }
  };
  useEffect(() => {
    if (editPortfolio) {
      setExchange(portfolio.exchange);
      setstock_symbol(portfolio.stock_symbol);
      setPortfolioName(portfolio.portfolio_name);
      setProduct(portfolio.product_type);
      setPrice(portfolio.limit_price);
      setEntryOrder(portfolio.order_type);
      setSelectedStrategy(portfolio.strategy);
      setSqOffTime(portfolio.square_off_time);
      setEndTime(portfolio.end_time);
      setStartTime(portfolio.start_time);
      setIsChecked(portfolio.buy_trades_first)
    }
  }, []);

  const [ gotAllLTP, setgotAllLTP ] = useState(false);
  const [ clickedSave, setclickedSave ] = useState(false);

  const { portfolios } = useSelector((state) => state.portfolioReducer);
  //console.log(portfolios, "portfolios");
  const [ savingPortfolio, setsavingPortfolio ] = useState(false);
  const [ isCheckIconVisible, setIsCheckIconVisible ] = useState(false);

  useEffect(() => {
    if (showModal) {
      setsavingPortfolio(false);
    }
  }, [ showModal ]);

  // useEffect(() => {
  //   if (clickedSave && gotAllLTP) {

  //     if(IsPortfolioEdited){
  ////       console.log("saveportoflio call")

  //       handleSavePortfolio();
  //     }
  //   }
  // }, [gotAllLTP, clickedSave]);

  const [ loading, setLoading ] = useState(false);
  const handleRefreshLtp = async () => {
    setLoading(true); // Show loader
    const currentLegs = FandRowRef.current.getLegs();

    await FandRowRef.current.getLegLTP();
    const allLTPs = currentLegs.map((leg) => leg.ltp);
    //console.log(allLTPs, "allLTPs")
    setLoading(false);
  };

  const [ isChecked, setIsChecked ] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };



  const handleSavePortfolio = async () => {
    try {
      const currentLegs = FandRowRef.current.getLegs();
      //console.log("currentLegs", currentLegs);

      if (!editPortfolio) {
        const existingPortfolioNames = portfolios.map((portfolio) =>
          portfolio.portfolio_name.toLowerCase(),
        );

        if (existingPortfolioNames.includes(portfolio_name.toLowerCase())) {
          setShowModal(true);
          setMessage("Please enter a unique name for the Portfolio");
          return;
        }

        if (!portfolio_name) {
          setShowModal(true);
          setMessage("Please enter a name for the Portfolio");
          return;
        }
      }
      if (!exchange) {
        setShowModal(true);
        setMessage("Please select an Exchange");
        return;
      }
      if (!product_type) {
        setShowModal(true);
        setMessage("Please select a Product");
        return;
      }

      if (!selectedStrategy) {
        setShowModal(true);
        setMessage("Please select a Strategy Tag");
        return;
      }
      if (!order_type) {
        setShowModal(true);
        setMessage("Please select an Entry Order Type");
        return;
      }

      const startTimeObj = new Date(`1970-01-01T${startTime}`);
      if (
        startTime !== "00:00:00" &&
        (startTimeObj.getHours() < 9 ||
          (startTimeObj.getHours() === 9 && startTimeObj.getMinutes() < 15) ||
          startTimeObj.getHours() > 15 ||
          (startTimeObj.getHours() === 15 && startTimeObj.getMinutes() > 30))
      ) {
        setShowModal(true);
        setMessage("Start time should be between 9:15 AM and 3:30 PM");
        return;
      }

      const endTimeObj = new Date(`1970-01-01T${endTime}`);
      if (
        endTime !== "00:00:00" &&
        (endTimeObj.getHours() < 9 ||
          (endTimeObj.getHours() === 9 && endTimeObj.getMinutes() < 15) ||
          endTimeObj.getHours() > 15 ||
          (endTimeObj.getHours() === 15 && endTimeObj.getMinutes() > 30))
      ) {
        setShowModal(true);
        setMessage("End time should be between 9:15 AM and 3:30 PM");
        return;
      }

      const sqOffTimeObj = new Date(`1970-01-01T${sqOffTime}`);
      if (
        sqOffTime !== "00:00:00" &&
        (sqOffTimeObj.getHours() < 9 ||
          (sqOffTimeObj.getHours() === 9 && sqOffTimeObj.getMinutes() < 15) ||
          sqOffTimeObj.getHours() > 15 ||
          (sqOffTimeObj.getHours() === 15 && sqOffTimeObj.getMinutes() > 30))
      ) {
        setShowModal(true);
        setMessage("Square-off time should be between 9:15 AM and 3:30 PM");
        return;
      }

      for (let index = 0; index < currentLegs.length; index++) {
        const leg = currentLegs[ index ];
        if (
          leg.expiry_date === "" ||
          leg.expiry_date === undefined ||
          leg.expiry_date === null
        ) {
          setShowModal(true);
          setMessage(`For Leg ${index + 1}, Please select an Expiry Date`);
          return;
        }
      }

      const allStrikes = currentLegs.map((leg) => leg.strike);
      if (
        allStrikes.includes("") ||
        allStrikes.includes(null) ||
        allStrikes.includes(undefined)
      ) {
        setShowModal(true);
        setMessage("Please select a Strike Price");
        return;
      }

      await FandRowRef.current.getLegLTP();

      const tgt_value = currentLegs.map((leg) => leg.tgt_value);
      const sl_value = currentLegs.map((leg) => leg.sl_value);
      const allLTPs = currentLegs.map((leg) => leg.ltp);
      const target = currentLegs.map((leg) => leg.target);
      const stop_loss = currentLegs.map((leg) => leg.stop_loss);
      const limitPrices = currentLegs.map((leg) => parseFloat(leg.limit_price));
      const ltpValues = extractLtpPrices(allLTPs);

      //console.log(allLTPs, "currentLegs", limitPrices, ltpValues);

      // Validate tgt_value and sl_value for each leg
      for (let i = 0; i < currentLegs.length; i++) {
        if (
          target[ i ] === "Absolute Premium" &&
          tgt_value[ i ] < ltpValues[ i ] &&
          ltpValues[ i ] !== "0" &&
          tgt_value[ i ] !== "0"
        ) {
          setShowModal(true);
          setMessage(
            `For Leg ${i + 1}, TGT Value must be greater than LTP Value ${ltpValues[ i ]}`,
          );
          return;
        }
        if (
          stop_loss[ i ] === "Absolute Premium" &&
          sl_value[ i ] > ltpValues[ i ] &&
          ltpValues[ i ] !== "0" &&
          sl_value[ i ] !== "0"
        ) {
          setShowModal(true);
          setMessage(
            `For Leg ${i + 1}, SL Value must be less than LTP Value ${ltpValues[ i ]}`,
          );
          return;
        }

        if (limitPrices[ i ] >= ltpValues[ i ]) {
          setShowModal(true);
          setMessage(
            `For Leg ${i + 1}, Limit Price (${limitPrices[ i ]}) must be less than LTP (${ltpValues[ i ]})`,
          );
          return;
        }
        if (order_type === "LIMIT" && !limitPrices[ i ]) {
          setShowModal(true);
          setMessage(`For Leg ${i + 1}, Please enter the limit price`);
          return;
        }
      }

      const newPortfolioItem = {
        strategy: selectedStrategy,
        exchange,
        stock_symbol,
        portfolio_name,
        product_type,
        order_type,
        limit_price,
        legs: currentLegs,
        start_time: startTime,
        end_time: endTime,
        square_off_time: sqOffTime,
        buy_trades_first: isChecked,
      };

      const api = {
        endpoint: editPortfolio
          ? `${import.meta.env.SERVER_HOST}/edit_portfolio/${mainUser}/${portfolio_name}`
          : `${import.meta.env.SERVER_HOST}/store_portfolio/${mainUser}`,
      };

      try {
        const response = await fetch(api.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPortfolioItem),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            responseData.message || "Something bad happened. Please try again",
          );
        } else {
          setsavingPortfolio(false);
          setIsCheckIconVisible(true);
          setTimeout(() => {
            setIsCheckIconVisible(false);
          }, 3000);
          setIsPortfolioEdited(false);

          handlePageClick();
          handleMsg({
            msg: responseData[ 0 ].message,
            logType: "MESSAGE",
            timestamp: ` ${new Date().toLocaleString()}`,
            portfolio: newPortfolioItem.portfolio_name,
          });
          if (responseData[ 0 ].message === "Portfolio added successfully") {
            const addToEditParams = JSON.stringify({
              ...newPortfolioItem,
              margin,
            });
            navigate(`/Edit-Portfolio/${addToEditParams}`, {
              ...newPortfolioItem,
              margin,
            });
          }
        }
      } catch (error) {
        setShowModal(true);
        if (error.message === "Portfolio with the same data already exists") {
          setMessage("Portfolio with the same data already exists");
        } else {
          setMessage("Please Try Again");
        }
      }
    } catch (error) {
      setShowModal(true);
      setMessage(error.message || "Something bad happened. Please try again");
    }
  };

  // Helper function to extract numerical values from LTP strings
  // function extractLtpPrices(ltps) {
  //   return ltps.map((ltp) => {
  //     const match = ltp.match(/\(([^)]+)\)/);
  //     return match ? parseFloat(match[ 1 ]) : 0;
  //   });
  // }

  const extractLtpPrices = (ltpArray) => {
    return ltpArray.map((ltpString) => {
      const match = ltpString.match(/\(([^)]+)\)/);
      return match ? parseFloat(match[ 1 ]) : null;
    });
  };

  useEffect(() => {
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
        const extractedStrategyTags = responseData.strategies.map(
          (strategy) => strategy.strategy_tag,
        );
        setStrategyTags(extractedStrategyTags);

        //// console.log(responseData, '1234');
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStrategy(cookies.get("USERNAME"));
  }, []);
  const [ selectedSymbol, setSelectedSymbol ] = useState("");
  const [ marketData, setMarketData ] = useState({
    nifty50: {},
    niftybank: {},
    finnifty: {},
  });

  useEffect(() => {
    const fetchMarketIndexDetails = async () => {
      try {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const marketData = JSON.parse(
          localStorage.getItem("marketIndexDetails"),
        );
        //// console.log("0", typeof marketData)
        //// console.log("1")
        setMarketData(marketData);
        //// console.log("2")
      } catch (error) {
        // console.error("Error fetching market index details:", error);
        //// console.log("3")
        const storedData = JSON.parse(
          localStorage.getItem("marketIndexDetails"),
        );
        if (storedData && storedData.nifty50.c !== "") {
          //// console.log("4")
          setMarketData(storedData);
        } else {
          const defaultData = {
            c: "0",
            ch: "0",
            chp: "0",
          };
          setMarketData({
            sensex: defaultData,
            nifty50: defaultData,
            niftybank: defaultData,
            finnifty: defaultData,
          });
        }
      }
    };

    fetchMarketIndexDetails();
    const intervalId = setInterval(fetchMarketIndexDetails, 500);
    return () => clearInterval(intervalId);
  }, []);

  // const [ entryOrder, setentryOrder ] = useState("");

  return (
    <div>
      <div className="dashboard-header">
        <MarketIndex />
        <RightNav />
      </div>
      <div
        className="add-portfolio"
        style={{
          position: "relative",
        }}
      >
        {/* <div className="rectangle-1499"></div>
        <div className="heading">
          <div className="options-portfolio-execution-beta">
            Options Portfolio Execution
          </div>
          <div className="div">
            <div className="div2" onClick={handleGoBackClick}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>
          </div>
        </div> */}
        <div className="frame-13810">
          <div className="group-13281">
            <div className="default-portfolio-settings">
              Default Portfolio Settings
            </div>
            <div className="help">Help</div>
          </div>
          <div className="marginDetails">
            {stock_symbol === "NIFTY" && (
              <>
                <span
                  className="stockSymbol"
                  style={{
                    // color: "blue",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                  }}
                >
                  NIFTY50
                </span>
                <span
                  className="stockLTP"
                  style={
                    marketData?.nifty50?.ch < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {marketData?.nifty50 && marketData?.nifty50?.c}
                </span>
                <span
                  className="lotsizelabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  LOTS
                </span>
                <span className="lotsize">25</span>
                <span
                  className="marginLabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  Margin Required
                </span>
                <span className="margin">{margin}</span>
              </>
            )}
            {stock_symbol === "BANKNIFTY" && (
              <>
                <span
                  className="stockSymbol"
                  style={{
                    // color: "blue",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // width:"250px",
                  }}
                >
                  BANKNIFTY
                </span>
                <span
                  className="stockLTP"
                  style={
                    marketData?.niftybank?.ch < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {marketData?.niftybank && marketData?.niftybank?.c}
                </span>
                <span
                  className="lotsizelabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  LOTS
                </span>
                <span className="lotsize">15</span>
                <span
                  className="marginLabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  Margin Required
                </span>
                <span className="margin">{margin}</span>
              </>
            )}
            {stock_symbol === "FINNIFTY" && (
              <>
                <span
                  className="stockSymbol"
                  style={{
                    // color: "blue",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                  }}
                >
                  FINNIFTY
                </span>
                <span
                  className="stockLTP"
                  style={
                    marketData?.finnifty?.ch < 0
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {marketData?.finnifty && marketData?.finnifty?.c}
                </span>
                <span
                  className="lotsizelabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  LOTS
                </span>
                <span className="lotsize">40</span>
                <span
                  className="marginLabel"
                  style={{
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "650",
                    // color: "blue", // Add color property here
                  }}
                >
                  Margin Required
                </span>
                <span className="margin">{margin}</span>
              </>
            )}
          </div>
        </div>
        <div className="frame99">
     <div className="frame-container">  <div className="frame-13825">
          <div className="frame-13824">
            <div className="exchange">Exchange</div>
            <div className="group-13283">
              <div className="nifty">
                <div className="nifty1" style={{ marginBottom: "9px" }}>
                  Stock Symbol
                </div>
                <select
                  // defaultValue={'NIFTY'}
                  disabled={isPortfolioExecuted}
                  onChange={handleSymbolChange}
                  className="exchange-dropdown1"
                  value={stock_symbol}
                  style={{ cursor: "pointer" }}
                >
                  <option selected disabled>
                    {" "}
                    Select{" "}
                  </option>
                  <option
                    selected={stock_symbol === "NIFTY"}
                    value="NIFTY"
                    color="black"
                  >
                    NIFTY
                  </option>
                  <option
                    selected={stock_symbol === "BANKNIFTY"}
                    value="BANKNIFTY"
                    color="black"
                  >
                    BANKNIFTY
                  </option>
                  <option
                    selected={stock_symbol === "FINNIFTY"}
                    value="FINNIFTY"
                    color="black"
                  >
                    FINNIFTY
                  </option>
                </select>
              </div>
              <div>
                <select
                  disabled={isPortfolioExecuted}
                  className="exchange-dropdown"
                  onChange={(e) => {
                    setExchange(e.target.value);
                    setIsPortfolioEdited(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <option selected disabled>
                    {" "}
                    Select{" "}
                  </option>
                  <option
                    value="BFO"
                    selected={
                      editPortfolio
                        ? portfolio.exchange === "BFO"
                        : exchange === "BFO"
                    }
                  >
                    BFO
                  </option>
                  <option
                    value="NFO"
                    selected={
                      editPortfolio
                        ? portfolio.exchange === "NFO"
                        : exchange === "NFO"
                    }
                  >
                    NFO
                  </option>
                  <option
                    value="MCX"
                    selected={
                      editPortfolio
                        ? portfolio.exchange === "MCX"
                        : exchange === "MCX"
                    }
                  >
                    MCX
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="frame-13823">
            <div className="expiry2">Expiry</div>
            <div>
              <select
                disabled={isPortfolioExecuted}
                onChange={(e) => {
                  setIsPortfolioEdited(true);
                  setSelectedDate(e.target.value);
                  // generateDateOptions(stock_symbol);
                }}
                className="expiry-dropdown"
                value={selectedDate}
                style={{ cursor: "pointer" }}
              >
                {/* {generateDateOptions(stock_symbol)} */}
                <option key="default" value="" selected disabled>
                  Select
                </option>
                {dateOptions}
              </select>
            </div>
          </div>
          <div className="frame-13822">
            <div className="default-lots">
              Default
              <br />
              Lots
            </div>
            <div className="frame-136682">
              <input
                type="number"
                onInput={(e) => {
                  const value = e.target.value;
                  // Remove non-numeric characters
                  const sanitizedValue = value.replace(/[^0-9]/g, "");
                  // Update the input value
                  e.target.value = sanitizedValue;
                }}
                id="lotsInput"
                defaultValue="1"
                style={{
                  zIndex: "99",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  marginBottom: "2px",
                }}
              />
            </div>
          </div>
          <div className="frame-13817">
            <div className="predefined-strategies">
              Predefined
              <br />
              Strategies
            </div>
            <div>
              <select
                className="predefined-strategies-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">Custom</option>
                <option value="option2">Covered Call</option>
                <option value="option3">Bull Call Spread</option>
                <option value="option4">Bear Put Spread</option>
                <option value="option5">Long Straddle</option>
                <option value="option6">Long Strangle</option>
                <option value="option7">Long Call Butterfly</option>
                <option value="option8">Iron Condor</option>
                <option value="option9">Iron Butterfly</option>
              </select>
            </div>
          </div>
          <div className="frame-13818">
            <div className="strike-selection">Strike Selection </div>
            <div>
              <select
                className="strike-selection-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">NORMAL</option>
                <option value="option2">RELATIVE</option>
                <option value="option3">BOTH</option>
              </select>
            </div>
          </div>

          <div className="frame-13819">
            <div className="underlying">Underlying</div>
            <div>
              <select
                className="underlying-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">SPOT</option>
                <option value="option2">FUTURES</option>
              </select>
            </div>
          </div>
          <div className="frame-13820">
            <div className="price-type">Price Type</div>
            <div>
              <select
                className="price-type-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">LTP</option>
                <option value="option2">BID ASK</option>
                <option value="option3">BID ASK AVG</option>
              </select>
            </div>
          </div>
          <div className="frame-13821">
            <div className="strike-step">
              Strike Step
            </div>
            <div className="group-13282">
              <td style={{ border: "transparent" }}>
                <input type="text" defaultValue={100} />
              </td>
            </div>
          </div>
          <div className="frame-13816">
          <div className="frame-13815">
            <div className="frame-137982">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="move-sl-to-cost">Move SL to Cost</div>
          </div>
          <div className="frame-13814">
            <div className="frame-13797">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="positional-portfolio">Positional Portfolio</div>
          </div>
          <div className="frame-13813">
            <div className="frame-13796">
              <input
                type="checkbox"
                id="yourCheckboxId"
                checked={isChecked} // Set checkbox value from state
                onChange={handleCheckboxChange} // Handle state change
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="buy-trades-first">Buy Trades First</div>
          </div>
          <div className="frame-13812">
            <div className="frame-137892">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="tgt-sl-entry-on-per-lot-basis">
              Tgt / SL / Entry on Per Lot Basis
            </div>
          </div>
        </div>
         </div>
         </div>
         </div> 
        {/* <div className="frame-13816">
          <div className="frame-13815">
            <div className="frame-137982">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="move-sl-to-cost">Move SL to Cost</div>
          </div>
          <div className="frame-13814">
            <div className="frame-13797">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="positional-portfolio">Positional Portfolio</div>
          </div>
          <div className="frame-13813">
            <div className="frame-13796">
              <input
                type="checkbox"
                id="yourCheckboxId"
                checked={isChecked} // Set checkbox value from state
                onChange={handleCheckboxChange} // Handle state change
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="buy-trades-first">Buy Trades First</div>
          </div>
          <div className="frame-13812">
            <div className="frame-137892">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="tgt-sl-entry-on-per-lot-basis">
              Tgt / SL / Entry on Per Lot Basis
            </div>
          </div>
        </div> */}
        <div className="ellipse-47"></div>
        <div className="ellipse-48"></div>
        {/* <div className="group-13286"> */}
        {/* <div
          className="rectangle-1557"
          style={{
            cursor:
              savingPortfolio || !IsPortfolioEdited ? "not-allowed" : "pointer",
          }}
        >
          {savingPortfolio ? (
            <div className="saveLoader">
              <RotatingLines
                visible={true}
                height="40"
                width="40"
                // color="blue"
                strokeColor="#4661BD"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <></>
          )}
          {isCheckIconVisible ? (
            <div className="CheckIconContainer">
              <AnimatedCheckIcon isVisible={isCheckIconVisible} />
            </div>
          ) : (
            <></>
          )}
        </div> */}

        {/* {savingPortfolio || isCheckIconVisible ? (
          <></>
        ) : (
          <>
            <div
              className="ellipse-49"
              style={{
                cursor:
                  savingPortfolio || !IsPortfolioEdited
                    ? "not-allowed"
                    : "pointer",
              }}
            ></div>{" "}
            <img
              className="ellipse-50"
              src="/src/assets/Ellipse 50.png"
              style={{
                cursor:
                  savingPortfolio || !IsPortfolioEdited
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </>
        )} */}

        {/* <div
          className="save-portfolio"
          style={{
            cursor:
              savingPortfolio || isCheckIconVisible || !IsPortfolioEdited
                ? "not-allowed"
                : "pointer",
            color:
              savingPortfolio || isCheckIconVisible || !IsPortfolioEdited
                ? "grey"
                : "black",
          }}
          onClick={() => {
            if (!savingPortfolio) {
              setsavingPortfolio(true);
              // FandRowRef.current.getLegLTP()
              setclickedSave(true);
              handleSavePortfolio();
            }
          }}
        >
          Save Portfolio
        </div> */}
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirm Save Modal"
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
            {" "}
            {message}
          </p>
          <div style={{ flex: 1 }}></div>
          <div className="modal-buttons" style={{ marginBottom: "20px" }}>
            {message !== "Please Try Again" &&
              message !== "Portfolio with the same data already exists" && (
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#5cb85c",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      message ===
                      "Duplicate legs detected. Please remove duplicates before saving." ||
                      message === "Please enter a name for the Portfolio" ||
                      message ===
                      "Please enter a unique name for the Portfolio" ||
                      message === "Please select an Exchange" ||
                      message === "Please select a Product" ||
                      message === "Please select a Strategy Tag" ||
                      message === "Please select an Entry Order Type" ||
                      message.includes("Please select an Expiry Date") ||
                      message === "Please select an Strike Price" ||
                      message ===
                      " Square-off time should be between 9:15 AM and 3:30 PM" ||
                      message ===
                      "End time should be between 9:15 AM and 3:30 PM" ||
                      message ===
                      "Start time should be between 9:15 AM and 3:30 PM" ||
                      message.includes(" than LTP Value ") ||
                      message.includes("less than LTP") ||
                      message.includes("Please enter the limit price") ||
                      (!clickedSave && message === "Please save the changes")
                    ) {
                      setShowModal(false);
                    } else {
                      handleConfirmSave();
                    }
                  }}
                >
                  OK
                </button>
              )}
            {message !==
              "Duplicate legs detected. Please remove duplicates before saving." &&
              message !== "Please enter a name for the Portfolio" &&
              message !== "Please enter a unique name for the Portfolio" &&
              message !== "Please select an Exchange" &&
              message !== "Please select a Product" &&
              message !== "Please select a Strategy Tag" &&
              message !== "Please select an Entry Order Type" &&
              message !==
              "Square-off time should be between 9:15 AM and 3:30 PM" &&
              message !== "End time should be between 9:15 AM and 3:30 PM" &&
              message !== "Start time should be between 9:15 AM and 3:30 PM" &&
              !message.includes("Please select an Expiry Date") &&
              message !== "Please select an Strike Price" &&
              !message.includes(" than LTP Value ") && (
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (message === "Please save the changes" && !clickedSave) {
                      navigate("/F&O/Portfolio");
                    }
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              )}
          </div>
        </Modal>
        {/* <div className="group-13285"> */}
        {/* <div className="rectangle-1556" style={{ cursor: "pointer" }}></div>
        <div className="ellipse-502" style={{ cursor: "pointer" }}></div>
        <img
          className="ellipse-51"
          src="/src/assets/Ellipse 51.png"
          style={{ cursor: "pointer" }}
        />
        <div className="reset" style={{ cursor: "pointer" }}>
          Reset
        </div>
        
        <div
          className="rectangle-1555"
          style={{ cursor: "pointer" }}
          onClick={handleRefreshLtp}
        ></div>
        {!loading && (
          <div
            className="ellipse-512"
            style={{ cursor: "pointer" }}
            onClick={handleRefreshLtp}
          ></div>
        )}
        {!loading && (
          <img
            onClick={handleRefreshLtp}
            className="ellipse-52"
            src="/src/assets/Ellipse 52.png"
            style={{ cursor: "pointer" }}
          />
        )}
        {loading && (
          <div
            className="ellips-52"
            style={{
              width: "30px",
              height: "30px",
              position: " absolute",
              left: "1440px",
              top: "84px",
            }}
          >
            <RotatingLines
              visible={true}
              height="30"
              width="30"
              color="blue"
              strokeColor="#4661BD"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )} */}
        {/* <div
          className="refresh"
          style={{ cursor: "pointer" }}
          onClick={handleRefreshLtp}
        >
          Refresh
        </div> */}
        {/* </div> */}
        <Fandorow
          dateOptions={dateOptions}
          ref={FandRowRef}
          setlegsEdited={setlegsEdited}
          editPortfolio={editPortfolio}
          portfolio={portfolio}
          selectedDate={selectedDate}
          stock_symbol={stock_symbol}
          setIsPortfolioEdited={setIsPortfolioEdited}
          isPortfolioExecuted={isPortfolioExecuted}
          setgotAllLTP={setgotAllLTP}
          setmargin={setmargin}
          order_type={order_type}
        />
        <div className="toggle1">
          <div className="toggle-switch-container1">
            <div
              className={`toggle-switch1 ${activeTab === "execution" ? "active" : ""}`}
              onClick={() => handleTabClick("execution")}
            >
              <span>Execution Parameters</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "target" ? "active" : ""}`}
              onClick={() => handleTabClick("target")}
            >
              <span>Target Settings</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "stoploss" ? "active" : ""}`}
              onClick={() => handleTabClick("stoploss")}
            >
              <span>Stoploss Settings</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "exit" ? "active" : ""}`}
              onClick={() => handleTabClick("exit")}
            >
              <span>Exit Settings</span>
            </div>
          </div>
        </div>
        {isExecutionTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <div className="execution-settings">Execution Settings</div>
              <div className="timings">Timings</div> <br />
              <table className="product">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Strategy Tag</th>
                    <th>If One or More Leg Falls</th>
                    <th>Legs Execution</th>
                    <th>Qty By Exposure</th>
                    <th>Max Lots</th>
                    <th>Premium Gap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        disabled={isPortfolioExecuted}
                        className="Product-dropdown Product-dropdown1"
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          setProduct(e.target.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          {" "}
                          Select
                        </option>
                        <option
                          selected={
                            editPortfolio
                              ? portfolio.product_type === "NORMAL"
                              : product_type === "NORMAL"
                          }
                          value="NORMAL"
                        >
                          NRML
                        </option>
                        <option
                          selected={
                            editPortfolio && portfolio.product_type === "MIS"
                          }
                          value="MIS"
                        >
                          MIS
                        </option>
                      </select>
                    </td>
                    <td>
                      <select
                        disabled={isPortfolioExecuted}
                        className="Strategy-dropdown"
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          setSelectedStrategy(e.target.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          {" "}
                          Select
                        </option>
                        {strategyTags.map((tag, index) => (
                          <option
                            selected={
                              editPortfolio && portfolio.strategy === tag
                            }
                            key={index}
                            value={tag}
                          >
                            {tag}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="One-or-More-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Keep PLaced Legs</option>
                        <option value="option2">Keep PLaced Legs2</option>
                        <option value="option3">Keep PLaced Legs3</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="Legs-Execution-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Parallel</option>
                        <option value="option2">Parallel2</option>
                        <option value="option3">Parallel3</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="box"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="Entry-Setting">Entry Setting</div>
              <div className="line1"></div> <br />
              <table className="product1">
                <thead>
                  <tr>
                    <th>Portfolio Execution Mode</th>
                    <th>Entry Order Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Portfolio-Execution-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Manual</option>
                        <option value="option2">Manual2</option>
                        <option value="option3">Manual3</option>
                      </select>
                    </td>
                    <td>
                      <select
                        disabled={isPortfolioExecuted}
                        className="Entry-Order-dropdown"
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          setEntryOrder(e.target.value);
                          //console.log(portfolio, "portfolio.order_type");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          Select
                        </option>
                        <option
                          value="MARKET"
                          selected={
                            editPortfolio && portfolio.order_type === "MARKET"
                          }
                        >
                          MARKET
                        </option>
                        <option
                          value="LIMIT"
                          selected={
                            editPortfolio && portfolio.order_type === "LIMIT"
                          }
                        >
                          LIMIT
                        </option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="product2">
                <thead>
                  <tr>
                    <th>Run On Days</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>SqOff Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <div className="timing-border">
                      <div className="custom-dropdown" ref={dropdownRef}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="text"
                            className="dropdown-toggle"
                            value={
                              selectedWeekdays.length > 0
                                ? selectedWeekdays.join(", ")
                                : "Select weekdays"
                            }
                            onClick={toggleDropdown}
                            readOnly
                            style={{ cursor: "pointer" }}
                          />
                          <button
                            onClick={toggleDropdown}
                            className="dropdown-button"
                            style={{
                              marginLeft: "-20px",
                              border: "none",
                              backgroundColor: "#fff",
                              fontSize: "17px",
                              cursor: "pointer",
                            }}
                          >
                            {isDropdownOpen ? "▲" : "▼"}
                          </button>
                        </div>
                        {dropdownVisible && (
                          <div
                            className="dropdown-content"
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              type="checkbox"
                              id="selectAll"
                              checked={selectAllChecked}
                              onChange={toggleSelectAll}
                              style={{ cursor: "pointer" }}
                            />
                            <label htmlFor="selectAll">
                              {selectAllChecked ? "Deselect All" : "Select All"}
                            </label>
                            {weekdays.map((weekday) => (
                              <div key={weekday}>
                                <input
                                  type="checkbox"
                                  id={weekday}
                                  value={weekday}
                                  checked={selectedWeekdays.includes(weekday)}
                                  onChange={() => toggleWeekday(weekday)}
                                  style={{ cursor: "pointer" }}
                                />
                                <label htmlFor={weekday}>{weekday}</label>
                              </div>
                            ))}
                            <div>
                              <button
                                className="weekdays-button1"
                                onClick={handleOk}
                                style={{ width: "37px", cursor: "pointer" }}
                              >
                                Ok
                              </button>
                              <button
                                className="weekdays-button2"
                                onClick={handleCancel}
                                style={{ width: "60px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <td>
                      <Timepic
                        label="startTime"
                        onTimeChange={handleTimeChange}
                        disabled={isPortfolioExecuted}
                        value={editPortfolio ? portfolio.start_time : null}
                      />
                    </td>
                    <td>
                      <Timepic
                        label="endTime"
                        onTimeChange={handleTimeChange}
                        disabled={isPortfolioExecuted}
                        value={editPortfolio ? portfolio.end_time : null}
                      />
                    </td>
                    <td>
                      <Timepic
                        label="sqOffTime"
                        onTimeChange={handleTimeChange}
                        disabled={isPortfolioExecuted}
                        value={editPortfolio ? portfolio.square_off_time : null}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="product3">
                <thead>
                  <tr>
                    <th>Estimated Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <td>Click to Refresh</td>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isTargetTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <div className="Portfolio-Profit-Protection">
                Portfolio Profit Protection
              </div>
              <table className="TargetSettings">
                <thead>
                  <tr>
                    <th>Target Type</th>
                    <th style={{ paddingRight: "9.6rem" }}>
                      If Profit Reaches
                    </th>
                    <th>Lock Minimum Profit At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">Combined Profit</option>
                        <option value="option2">Combined Profit2</option>
                        <option value="option3">Combined Profit3</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="TargetSettings1">
                <thead>
                  <tr>
                    <th>Combined Profit</th>
                    <th>For Every Icrease In Profit By</th>
                    <th>Trail Profit By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                    <td>
                      <input type="text" value={0} style={{ width: "185px" }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="TargetSettings2">
                <thead>
                  <tr>
                    <th>Combined Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">None</option>
                        <option value="option2">None2</option>
                        <option value="option3">None3</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isStoplossTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802" style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Column 1 */}
              <div style={{ flex: 1, marginRight: "1rem" }}>
                {/* Checkbox 1 */}
                {/* <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <input type="checkbox" style={{ marginRight: "0.5rem" }} />
                  <span style={{ color: "#C71A8A" }}>On SI SqOff only Loss Making Legs</span>
                </div> */}

                {/* Dropdown 1 */}
                <label style={{ color: "blue" }}> StopLossGap Type</label>
                <div style={{ marginBottom: "1rem" }}>
                  <select className="Product-dropdown" style={{ cursor: "pointer", width: "160px" }}>
                    <option value="option1">Combined Premium</option>
                    <option value="option2">Combined Premium2</option>
                    <option value="option3">Combined Premium3</option>
                  </select>
                </div>

                {/* Input Field 1 */}
                <label style={{ color: "blue" }}> Combined Premium</label>
                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "8px",
                    }}
                  // placeholder="Combined Premium"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div style={{ flex: 1, marginLeft: "60px" }}>

                {/* Input Field 2 */}
                <label style={{ color: "blue" }}> SI Wait Seconds</label>
                <div style={{ marginBottom: "1rem" }}>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "8px",
                      // marginLeft:"60px"
                    }}
                  // placeholder="SI Wait Seconds"
                  />
                </div>

                {/* Dropdown 2 */}
                <label style={{ color: "blue" }}> On Stopless</label>
                <div style={{ marginBottom: "1rem", }}>
                  <select className="Product-dropdown" style={{ cursor: "pointer", width: "150px", }}>
                    <option value="option1">None</option>
                    <option value="option2">None2</option>
                    <option value="option3">None3</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", marginLeft: "60px" }}>
                <fieldset style={{
                  width: "470px",
                  padding: "5px",
                  borderRadius: "5px",
                  height: "250px", // Adjust height to fit content
                  boxSizing: "border-box",
                  fontFamily: "Arial, sans-serif"
                }}>
                  <legend >
                    Move SL to Cost Settings
                  </legend>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" />
                    <label style={{ fontWeight: "bold", border: "2px dotted", marginLeft: "4px" }}>
                      Move SL to Cost
                    </label>
                    <label style={{ marginLeft: "10px", color: "#4FBB80" }}> MoveSL safety Seconds </label>
                    <input
                      type="number"
                      style={{
                        width: "80px",
                        marginLeft: "4px",
                        padding: "5px"
                      }}
                    />
                  </div>

                  <div style={{ marginLeft: "30px", marginTop: "10px" }}>
                    <lable style={{ color: "#4FBB80", }} > Move SL Action</lable>
                    <select className="Product-dropdown" style={{ cursor: "pointer", width: "80%", }}>
                      <option value="option1">Move Only for Profitable Legs</option>
                      <option value="option2">Move SL for All Legs Despite Loss/Profit</option>
                      <option value="option3">Move SL to LTP + Buffer for Loss Making Legs</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", }}>
                    <input type="checkbox" />
                    <label> Trail SL only after Move SL to Cost</label>
                  </div>
                  <div style={{ display: "flex", color: "#4FBB80" }}>
                    <input type="checkbox" />
                    <label> No Move SL to Cost for BUY Legs</label>
                  </div>
                  <div style={{ display: "flex", }}>
                    <input type="checkbox" />
                    <label> Perform Move SL Every time whatnever SL hits on a Leg</label>
                  </div>
                  <div style={{ display: "flex", }}>
                    <input type="checkbox" />
                    <label> Perform Move SL Every time whatnever TGT hits on a Leg </label> <label style={{ color: "red", fontWeight: "bold" }}>*</label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        )}
        {isExitTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <table className="ExitSettings">
                <thead>
                  <tr>
                    <h4>Combined Premium</h4>
                  </tr>
                </thead>
              </table>
              <br />
              <table className="ExitSettings1">
                <label>
                  <input type="checkbox" />
                  On Sl SqOff only Profit Making Legs
                </label>
                <label>
                  <input type="checkbox" />
                  Slice Exit Orders as Entry Orders
                </label>
                <label style={{ color: "#9B0101" }}>
                  <input type="checkbox" />
                  Stop Exit Orders If No Positions Exists
                </label>
              </table>
              <label className="h4">
                <h4>On Portfolio Complete</h4>
                <span className="notApplicable">
                  (Not Applicable on Manual)
                </span>
                <select
                  className="Product-dropdown"
                  style={{ marginRight: "11rem", cursor: "pointer" }}
                >
                  <option value="option1">None</option>
                  <option value="option2">None2</option>
                  <option value="option3">None3</option>
                </select>
              </label>
              <label className="OrderRetry">
                <span className="OrderRetry1">Order Retry Settings</span>
                <br />
                <br />
                <span className="Settings">
                  These Settings will be applicable When an Order gets Rejected.
                </span>
                <br />
                <span className="Settings1">
                  First, Stoxxo will apply the Strategy Tag Retry settings as
                  per <br />
                  Entry / Exit Order. This will behave like a Failover Setting{" "}
                  <br />
                  Which will be applied after Strategy tag settings.
                </span>
                <br />
                <h4>Wait Between Each Retry (Sec)</h4>
                <h4>Max Wait Time (Sec)</h4>
              </label>
            </div>
          </div>
        )}

        <div className="gap1">
          <div className="line">
            <table>
              <td className="OPN">
                <th>Option Portfolio Name</th>
                <input
                  defaultValue={editPortfolio ? portfolio.portfolio_name : null}
                  readOnly={editPortfolio}
                  type="text"
                  onChange={(e) => setPortfolioName(e.target.value)}
                />
              </td>
              <td className="Remarks">
                <th></th>
                <input type="text" placeholder="Remarks" />
              </td>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPortfolio;
