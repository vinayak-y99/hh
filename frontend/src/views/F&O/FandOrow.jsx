import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import { useSelector } from "react-redux";
import "./FandOrow.css";
// import Delete from '../F&O/image/delete.png';
import Buy from "../../assets/buy.png";
import Sell from "../../assets/SELL.png";
import CE from "../../assets/CE.png";
import PE from "../../assets/PE.png";
import Close from "../../assets/close1.png";
import FUT from "../../assets/FUT.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Fandorow = forwardRef(
  (
    {
      setlegsEdited,
      editPortfolio,
      portfolio,
      selectedDate,
      stock_symbol,
      setIsPortfolioEdited,
      setgotAllLTP,
      setmargin,
      isPortfolioExecuted,
      order_type,
    },
    ref,
  ) => {
    const tableRef = useRef();
    const expiryState = useSelector((state) => state.expiryReducer);
    //// console.log("NIFTY, BANKNIFTY, FINNIFTY", NIFTY,"=", BANKNIFTY,"=", FINNIFTY)
    const generateDateOptions = (index = 0) => {
      //// console.log("experies 123", experies)

      if (!Object.values(expiryState).includes([])) {
        const GetExpirylist = () => {
          if (stock_symbol === "NIFTY") {
            if (legs[ index ].option_type === "FUT") {
              return expiryState.FUTNIFTY;
            }
            return expiryState.NIFTY;
          } else if (stock_symbol === "BANKNIFTY") {
            if (legs[ index ].option_type === "FUT") {
              return expiryState.FUTBANKNIFTY;
            }
            return expiryState.BANKNIFTY;
          } else if (stock_symbol === "FINNIFTY") {
            if (legs[ index ].option_type === "FUT") {
              return expiryState.FUTFINNIFTY;
            }
            return expiryState.FINNIFTY;
          }
        };

        const Expirylist = GetExpirylist();
        //// console.log("selected expiry ", Expirylist)

        const options = Expirylist?.map((expiry) => (
          <option
            selected={
              editPortfolio
                ? legs[ index ][ "expiry_date" ] === expiry
                  ? true
                  : false
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
        //// console.log("options   ", options)
        // setdateOptions(options);
        return options;
      }
    };

    const [ timerValue, setTimerValue ] = useState("");
    const [ currentNumber, setCurrentNumber ] = useState(1);

    const rowStyle = (index) => ({
      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#e6e6e6",
    });

    const handleTimerChange = (e) => {
      const inputTime = e.target.value;
      const formattedTime = formatInputTime(inputTime);
      setTimerValue(formattedTime);
    };

    const formatInputTime = (inputTime) => {
      const numericTime = inputTime.replace(/[^0-9]/g, "");
      const paddedTime = numericTime.padStart(6, "0");
      const hours = Math.min(parseInt(paddedTime.slice(0, 2), 10), 23);
      const formattedTime = `${String(hours).padStart(2, "0")}:${paddedTime.slice(2, 4)}:${paddedTime.slice(4, 6)}`;
      return formattedTime;
    };

    const [ legs, setlegs ] = useState([
      {
        transaction_type: "BUY",
        option_type: "CE",
        ltp: "0",
        lots: 1,
        expiry_date: "",
        strike: "ATM",
        target: "None",
        limit_price: "",
        tgt_value: 0,
        trail_tgt: [ "", "", "", "" ],
        stop_loss: "None",
        sl_value: 0,
        trail_sl: [ "", "" ],
        showPopupSL1: false,
        showPopupSL: false,
        delta: "",
        theta: "",
        vega: "",
      },
    ]);
    //console.log(legs, "legs")

    useEffect(() => {
      //// console.log("legs===", legs);
    }, [ legs ]);

    const handleDropdownChange = (index, value) => {
      const updatedLegs = [ ...legs ]; // Create a copy of the current legs array
      updatedLegs[ index ].target = value; // Set the dropdown value for the specified leg
      setlegs(updatedLegs);
    };
    const handleInputChange = (index, value) => {
      const updatedLegs = [ ...legs ];
      updatedLegs[ index ].stop_loss = value;
      setlegs(updatedLegs);
    };

    function isDateInPast(dateString) {
      function parseDate(dateString) {
        const day = parseInt(dateString.slice(0, 2), 10);
        const monthAbbr = dateString.slice(2, 5);
        const year = parseInt(dateString.slice(5), 10);

        const monthNames = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];
        const month = monthNames.indexOf(monthAbbr);

        if (month === -1) {
          throw new Error("Invalid month abbreviation");
        }
        return new Date(year, month, day);
      }
      const givenDate = parseDate(dateString);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return givenDate < today;
    }

    useEffect(() => {
      if (editPortfolio && portfolio && portfolio.legs) {
        // const updatedLegs = portfolio.legs;
        const updatedLegs = portfolio.legs.map((leg) => {
          if (isDateInPast(leg[ "expiry_date" ])) {
            return {
              ...leg,
              expiry_date: "",
            };
          } else {
            return {
              ...leg,
            };
          }
        });
        setlegs(updatedLegs);
      }
    }, [ portfolio ]);

    const handleAddRow = () => {
      setIsPortfolioEdited(true);
      setlegs((prevLegs) => [
        ...prevLegs,
        {
          transaction_type: "BUY",
          option_type: "CE",
          ltp: "0",
          lots: "1",
          limit_price: "",
          expiry_date: selectedDate,
          strike: "ATM",
          target: "None",
          tgt_value: 0,
          trail_tgt: [ "", "", "", "" ],
          stop_loss: "None",
          sl_value: 0,
          trail_sl: [ "", "" ],
          showPopupSL: false,
          showPopupSL1: false,
          showPopupTarget: false,
          delta: "",
          theta: "",
          vega: "",
        },
      ]);

      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollLeft = 0; /* Set to a larger value */
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
      }, 100);
    };

    const handleDelete = (indexToDelete) => {
      setlegs((prevLegs) => {
        //// console.log("first");
        if (prevLegs.length === 1) {
          return prevLegs;
        }
        const updatedLegs = prevLegs.filter(
          (_, index) => index !== indexToDelete,
        );
        //// console.log("updatedLegs1", updatedLegs);
        return updatedLegs;
      });
    };

    useEffect(() => {
      if (selectedDate !== null) {
        //// console.log("second")
        const updatedLegs = [ ...legs ];
        legs.map((leg) => {
          leg[ "expiry_date" ] = selectedDate;
        });
        setlegs(updatedLegs);
      }
    }, [ selectedDate ]);

    useEffect(() => {
      setlegs((prevLegs) => {
        const updatedLegs = prevLegs.map((leg) => {
          return {
            ...leg,
            ltp: "0",
          };
        });
        //// console.log("updatedLegs1", updatedLegs);
        return updatedLegs;
      });
    }, [ stock_symbol ]);

    const [ allStrikeValues, setAllStrikeValues ] = useState([]);
    const [ allOptionTypes, setAllOptionTypes ] = useState([]);
    const [ allExpiryDates, setAllExpiryDates ] = useState([]);

    useEffect(() => {
      if (
        legs.map((leg) => leg.strike).join(",") !== allStrikeValues.join(",") ||
        legs.map((leg) => leg[ "option_type" ]).join(",") !==
        allOptionTypes.join(",") ||
        legs.map((leg) => leg.expiry_date).join(",") !==
        allExpiryDates.join(",")
      ) {
        const allStrikes = legs.map((leg) => leg.strike);
        const allExpiries = legs.map((leg) => leg.expiry_date);
        const allOptions = legs.map((leg) => leg.option_type);
        //// console.log("aall allStrikes", allStrikes)
        //// console.log("aall ecpirires", allExpiries)
        //// console.log("aall allOptions", allOptions)
        if (allExpiries[ 0 ] !== undefined) {
          //// console.log("c")
          setgotAllLTP(false);
          setAllStrikeValues(allStrikes);
          setAllOptionTypes(allOptions);
          setAllExpiryDates(allExpiries);
        }
      }
    }, [ legs ]);

    useImperativeHandle(ref, () => ({
      getLegs() {
        return legs;
      },
      async getLegLTP() {
        await get_leg_ltp();
      },
      getMargin() {
        return margin;
      },
    }));

    const get_leg_ltp = async () => {
      //console.log("getLegLTP after clicked save", allStrikeValues);
      for (let index = 0; index < allStrikeValues.length; index++) {
        if (index === 0) {
          setgotAllLTP(false);
          setmargin("0");
          //// console.log("false")
        }
        const atmData = {
          symbol: stock_symbol,
          strike: allStrikeValues[ index ],
          option_type: allOptionTypes[ index ],
          expiry: legs[ index ].expiry_date,
        };
        //console.log("ATM Data:", index, " ", atmData);

        if (
          atmData.symbol !== "" &&
          atmData.strike !== "" &&
          atmData.option_type !== "" &&
          atmData.expiry !== ""
        ) {
          try {
            const response = await fetch(`${import.meta.env.SERVER_HOST}/get_price_details/${mainUser}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(atmData),
            });
            const responseData = await response.json();
            if (!response.ok) {
              throw new Error(
                responseData.message ||
                "Something bad happened. Please try again",
              );
            }

            //console.log("ltp res", index, " ", responseData);
            setlegs((prevLegs) => {
              const updatedLegs = [ ...prevLegs ];
              if (updatedLegs[ index ]) {
                if (responseData[ "Strike Price" ] !== undefined) {
                  updatedLegs[ index ][ "ltp" ] =
                    `${responseData[ "Strike Price" ]} (${responseData[ "Price" ].toFixed(2)})`;
                } else {
                  updatedLegs[ index ][ "ltp" ] =
                    `${responseData[ "Price" ].toFixed(2)}`;
                }
              }
              return updatedLegs;
            });
            if (!response.ok) {
              throw new Error(
                responseData.message ||
                "Something bad happened. Please try again",
              );
            }
          } catch (error) {
            //console.log(error.message);
          }
        }
        if (index === allStrikeValues.length - 1) {
          //// console.log("true")
          setgotAllLTP(true);
          let lotsize =
            stock_symbol === "NIFTY"
              ? 25
              : stock_symbol === "BANKNIFTY"
                ? 15
                : stock_symbol === "FINNIFTY"
                  ? 40
                  : 0;
          let margin = 0;
          legs.map((leg) => {
            let ltp;
            // console.log("leg====", leg)
            if (leg[ "option_type" ] === "CE" || leg[ "option_type" ] === "PE") {
              const match = leg.ltp.match(/\(([^)]+)\)/);
              ltp = match ? match[ 1 ] : null;
            } else {
              ltp = leg.ltp;
            }
            margin =
              margin +
              lotsize.toFixed(2) *
              Number(leg[ "lots" ]).toFixed(2) *
              Number(ltp).toFixed(2);
          });
          //console.log("margin rwuired", margin.toFixed(2));
          setmargin(margin.toFixed(2));
        }
      }
    };

    // useEffect(() => {
    //   // allStrikeValues.map(async (strike, index) =>
    ////   // console.log("true")
    //   get_leg_ltp();
    // }, [stock_symbol, allStrikeValues, allOptionTypes, allExpiryDates]);

    const togglePopup = (index, leg) => {
      if (leg && leg.target !== "None") {
        setlegs((prevLegs) => {
          const updatedLegs = prevLegs.map((item, i) => {
            if (i === index) {
              return {
                ...item,
                showPopupSL1: !item.showPopupSL1,
                showPopupSL: false,
              };
            } else {
              return { ...item, showPopupSL1: false, showPopupSL: false };
            }
          });
          return updatedLegs;
        });
      } else {
        setlegs((prevLegs) => {
          const updatedLegs = prevLegs.map((item) => {
            return { ...item, showPopupSL1: false, showPopupSL: false };
          });
          return updatedLegs;
        });
      }
    };

    const togglePopupSL = (index, leg) => {
      if (leg && leg.stop_loss !== "None") {
        setlegs((prevLegs) => {
          const updatedLegs = prevLegs.map((item, i) => {
            if (i === index) {
              return {
                ...item,
                showPopupSL: !item.showPopupSL,
                showPopupSL1: false,
              };
            } else {
              return { ...item, showPopupSL: false, showPopupSL1: false };
            }
          });
          return updatedLegs;
        });
      } else {
        setlegs((prevLegs) => {
          const updatedLegs = prevLegs.map((item) => {
            return { ...item, showPopupSL: false, showPopupSL1: false };
          });
          return updatedLegs;
        });
      }
    };

    const popupRef = useRef(null);

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setlegs((prevLegs) =>
          prevLegs.map((item) => ({
            ...item,
            showPopupSL: false,
            showPopupSL1: false,
          })),
        );
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

    // const handleSetTrailTGT = (index) => {
    //   setlegs((prev) => {
    //     const updatedLegs = [...prev];

    //    let trail_tgt = [
    //     document.getElementById("trail_tgt_0").value,
    //     document.getElementById("trail_tgt_1").value,
    //     document.getElementById("trail_tgt_2").value,
    //     document.getElementById("trail_tgt_3").value
    //    ]
    //    updatedLegs[ index ][ "trail_tgt" ] = trail_tgt
    //    updatedLegs[ index ]["showPopupSL1"] = false
    ////     console.log("updatedLegs", updatedLegs)

    //    return updatedLegs
    //   });
    // }

    // const handleSetTrailSL = (index) => {
    //   setlegs((prev) => {
    //     const updatedLegs = [...prev];

    //    let trail_sl = [
    //     document.getElementById("trail_sl_0").value,
    //     document.getElementById("trail_sl_1").value,
    //    ]
    //    updatedLegs[ index ][ "trail_sl" ] = trail_sl
    //    updatedLegs[ index ]["showPopupSL"] = false
    ////     console.log("updatedLegs", updatedLegs)

    //    return updatedLegs
    //   });
    // }

    const [ popupValues, setPopupValues ] = useState({
      profitReaches: "",
      lockMinimumProfit: "",
      increaseInProfit: "",
      trailProfitBy: "",
    });
    //// console.log(legs, "letsgoo")

    const setPopupValuesForIndex = (index) => {
      if (legs && legs.length > index) {
        const { trail_tgt } = legs[ index ];
        if (trail_tgt && trail_tgt.length > 0) {
          const [
            profitReaches,
            lockMinimumProfit,
            increaseInProfit,
            trailProfitBy,
          ] = trail_tgt;
          setPopupValues({
            profitReaches,
            lockMinimumProfit,
            increaseInProfit,
            trailProfitBy,
          });
        }
      }
    };
    useEffect(() => {
      setPopupValuesForIndex();
    }, [ legs ]);

    const handleLegInputChange = (field, value) => {
      setPopupValues((prevValues) => ({
        ...prevValues,
        [ field ]: value,
      }));
    };

    const handleInputDelete = (index) => {
      setPopupValues({
        profitReaches: "",
        lockMinimumProfit: "",
        increaseInProfit: "",
        trailProfitBy: "",
      });

      setlegs((prev) => {
        const updatedLegs = [ ...prev ];
        updatedLegs[ index ][ "trail_tgt" ] = [ "", "", "", "" ];
        //// console.log("updated ====", updatedLegs)
        return updatedLegs;
      });
    };

    const setPopupValuesForIndexSl = (index) => {
      if (legs && legs.length > index) {
        const { trail_sl } = legs[ index ];
        if (trail_sl && trail_sl.length > 0) {
          //// console.log("index", index, "==", trail_sl)
          const [ increaseInProfit, trailProfit ] = trail_sl;
          setpopupSLValues({
            increaseInProfit,
            trailProfit,
          });
        }
      }
    };

    // useEffect(() => {
    //   setPopupValuesForIndexSl();
    // }, [ legs ]);

    const [ popupSLValues, setpopupSLValues ] = useState({
      increaseInProfit: "",
      trailProfit: "",
    });

    //// console.log(popupSLValues, "popupSLValues")
    const handleSLInputChange = (key, value) => {
      setpopupSLValues((prevState) => ({
        ...prevState,
        [ key ]: value,
      }));
    };

    const handleSetTrailTGT = (index) => {
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

      const updatedLegs = [ ...legs ];
      const trail_tgt = [
        profitReachesValue,
        lockProfitValue,
        increaseInProfitValue,
        trailProfitByValue,
      ];
      updatedLegs[ index ][ "trail_tgt" ] = trail_tgt;
      updatedLegs[ index ][ "showPopupSL1" ] = false;
      setlegs(updatedLegs);
    };

    const everyProfitincreaseRef = useRef(null);
    const trailslRef = useRef(null);

    const handleSetTrailSL = (index) => {
      // Get values of input fields
      let everyincreaseInProfitValue =
        document.getElementById("trail_sl_0").value;
      let trailProfitByValue = document.getElementById("trail_sl_1").value;

      // Check if all input boxes are empty
      // if (!everyincreaseInProfitValue && !trailProfitByValue) {
      //   // Set default values if all input boxes are empty
      //   everyincreaseInProfitValue = trailProfitByValue = "0";
      // }

      if (everyincreaseInProfitValue !== "" && trailProfitByValue === "") {
        document.getElementById("SLincreaseInProfitError").innerText = "";
        document.getElementById("trailSLByError").innerText =
          "Value is required.";
        return;
      }
      if (trailProfitByValue !== "" && everyincreaseInProfitValue === "") {
        document.getElementById("trailSLByError").innerText = "";
        document.getElementById("SLincreaseInProfitError").innerText =
          "Value is required.";
        return;
      }

      // Validate and update the state based on the input values
      // if (everyincreaseInProfitValue !=="" && trailProfitByValue !== "") {
      // Update state if both input fields have valid values
      setlegs((prev) => {
        const updatedLegs = [ ...prev ];
        let trail_sl = [ everyincreaseInProfitValue, trailProfitByValue ];
        updatedLegs[ index ][ "trail_sl" ] = trail_sl;
        updatedLegs[ index ][ "showPopupSL" ] = false;
        //// console.log("updatedLegs", updatedLegs);
        return updatedLegs;
      });
      // } else {
      // Show error message for any empty input box

      // }
    };

    useEffect(() => {
      const fetchForDelta = async () => {
        try {
          const dataObjects = legs
            .map((leg) => {
              const ltpValue = leg.ltp.split(" ")[ 0 ];
              if (
                leg.expiry_date &&
                leg.strike &&
                ltpValue > 0 &&
                stock_symbol
              ) {
                return {
                  index_symbol: stock_symbol,
                  expiry_date: leg.expiry_date,
                  strike: leg.strike,
                  ltp: ltpValue,
                };
              } else {
                return null;
              }
            })
            .filter(Boolean);

          //console.log(dataObjects, "dataObjects");

          // if (dataObjects.length > 0) {
          //   const response = await fetch(
          //     `${import.meta.env.SERVER_HOST}/get_theta_gamma_vega_values/${mainUser}`,
          //     {
          //       method: "POST",
          //       headers: {
          //         "Content-Type": "application/json",
          //       },
          //       body: JSON.stringify(dataObjects),
          //     },
          //   );

          //   const responseData = await response.json();
          //   //console.log(responseData, "responseData");

          //   if (!response.ok) {
          //     throw new Error(
          //       responseData.message ||
          //         "Something bad happened. Please try again",
          //     );
          //   }
          //   const updatedLegs = legs.map((leg, index) => ({
          //     ...leg,
          //     delta: responseData.Data[index].Delta,
          //     theta: responseData.Data[index].Theta,
          //     vega: responseData.Data[index].Vega,
          //   }));

          //   setlegs(updatedLegs);
          // } else {
          //   //console.log("Skipping API call: Missing required fields");
          // }
        } catch (error) {
          //console.log(error.message);
        }
      };

      fetchForDelta();
    }, [ legs, stock_symbol ]);
    //console.log(stock_symbol, "stock_symbol");
    const [ price, setPrice ] = useState(0);

    const handlePriceChange = (index, newPrice) => {
      setIsPortfolioEdited(true);
      setPrice(newPrice);
      setlegs((prev) => {
        const updatedLegs = [ ...prev ];
        updatedLegs[ index ].limit_price = newPrice;
        return updatedLegs;
      });
    };
    const generateRows = () => {
      return legs.map((leg, index) => (
        <tr key={leg.id} style={rowStyle(index)} className="input">
          <td>{currentNumber + index}</td>
          <td>
            {legs[ index ][ "transaction_type" ] === "BUY" && (
              <img
                src={Buy}
                id="BUY"
                alt="icon"
                className="cross_icon buy_sell"
                style={{
                  height: "35px",
                  width: "35px",
                  cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                }}
                onClick={
                  !isPortfolioExecuted
                    ? () => {
                      setIsPortfolioEdited(true);
                      setlegs((prev) => {
                        const updatedLegs = [ ...prev ];
                        updatedLegs[ index ][ "transaction_type" ] = "SELL";
                        return updatedLegs;
                      });
                    }
                    : undefined
                }
              />
            )}
            {legs[ index ][ "transaction_type" ] === "SELL" && (
              <img
                src={Sell}
                id="SELL"
                alt="icon"
                className="cross_icon sell_buy"
                style={{
                  height: "35px",
                  width: "35px",
                  cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                }}
                onClick={
                  !isPortfolioExecuted
                    ? () => {
                      setIsPortfolioEdited(true);
                      setlegs((prev) => {
                        const updatedLegs = [ ...prev ];
                        updatedLegs[ index ][ "transaction_type" ] = "BUY";
                        return updatedLegs;
                      });
                    }
                    : null
                }
              />
            )}
            {legs[ index ][ "option_type" ] === "CE" && (
              <img
                src={CE}
                alt="icon"
                id="CE"
                className="cross_icon ce_pe"
                style={{
                  height: "35px",
                  width: "35px",
                  cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                }}
                onClick={
                  !isPortfolioExecuted
                    ? () => {
                      setIsPortfolioEdited(true);
                      setlegs((prev) => {
                        const updatedLegs = [ ...prev ];
                        updatedLegs[ index ][ "option_type" ] = "PE";
                        updatedLegs[ index ][ "ltp" ] = "0";
                        return updatedLegs;
                      });
                    }
                    : null
                }
              />
            )}
            {legs[ index ][ "option_type" ] === "PE" && (
              <img
                src={PE}
                alt="icon"
                id="PE"
                className="cross_icon pe_ce"
                style={{
                  height: "35px",
                  width: "35px",
                  cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                }}
                onClick={
                  !isPortfolioExecuted
                    ? () => {
                      setIsPortfolioEdited(true);
                      setlegs((prev) => {
                        const legs = [ ...prev ];
                        legs[ index ][ "option_type" ] = "FUT";
                        legs[ index ][ "ltp" ] = "0";
                        // legs[index]["expiry_date"] = null;
                        return legs;
                      });
                    }
                    : null
                }
              />
            )}
            {legs[ index ][ "option_type" ] === "FUT" && (
              <img
                src={FUT}
                alt="icon"
                id="PE"
                className="cross_icon pe_ce"
                style={{
                  height: "35px",
                  width: "35px",
                  cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                }}
                onClick={
                  !isPortfolioExecuted
                    ? () => {
                      setIsPortfolioEdited(true);
                      setlegs((prev) => {
                        const legs = [ ...prev ];
                        legs[ index ][ "option_type" ] = "CE";
                        legs[ index ][ "ltp" ] = "0";
                        return legs;
                      });
                    }
                    : null
                }
              />
            )}
            <img
              src={Close}
              alt="icon"
              className="cross_icon"
              style={{
                height: "35px",
                width: "35px",
                cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
              }}
              onClick={
                !isPortfolioExecuted
                  ? () => {
                    setIsPortfolioEdited(true);
                    handleDelete(index);
                  }
                  : null
              }
            />
          </td>
          <td style={{ padding: 0, cursor: "pointer" }}>
            <input
              disabled={isPortfolioExecuted}
              type="text"
              className="number1"
              value={legs[ index ][ "ltp" ]}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>

          <td>
            <input type="checkbox" style={{ cursor: "pointer" }} />
          </td>
          <td style={{ padding: 0, cursor: "pointer" }}>
            <input
              type="number"
              max="100"
              disabled={isPortfolioExecuted}
              value={leg.lots}
              onInput={(e) => {
                const value = parseInt(e.target.value);
                if (value <= 0) {
                  e.target.value = 1; // Clear the input value
                }
                if (value > 100) {
                  e.target.value = 100; // Clear the input value
                }
              }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "lots" ] = !(e.target.value > 0)
                    ? 1
                    : e.target.value > 100
                      ? 100
                      : e.target.value;
                  return updatedLegs;
                });
              }}
              className="portfolioLots"
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          {order_type === "LIMIT" && (
            <td>
              <input
                type="number"
                value={leg.limit_price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                disabled={isPortfolioExecuted}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "8px",
                  width: "70px",
                  height: "38px",
                  marginBottom: "0px",
                  // cursor: order_type === "LIMIT" ? "pointer" : "not-allowed"
                }}
              />
            </td>
          )}
          <td>
            <select
              disabled={isPortfolioExecuted}
              className="expiry-dropdown"
              style={{ width: "95px" }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "expiry_date" ] = e.target.value;
                  updatedLegs[ index ][ "ltp" ] = "0";
                  return updatedLegs;
                });
              }}
            >
              <option
                selected={
                  leg[ "expiry_date" ] ? leg[ "expiry_date" ]?.length < 9 : true
                }
              >
                Select
              </option>
              {generateDateOptions(index)}
            </select>
          </td>
          <td>
            <select
              disabled={
                isPortfolioExecuted || legs[ index ][ "option_type" ] === "FUT"
              }
              className="custom-dropdown"
              style={{ cursor: "pointer" }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "strike" ] = e.target.value;
                  updatedLegs[ index ][ "ltp" ] = "0";
                  return updatedLegs;
                });
              }}
            >
              <option disabled selected>
                Select
              </option>
              {Array.from({ length: 11 }, (_, i) => (i - 5) * 100).map(
                (value) => (
                  <option
                    key={value}
                    selected={
                      editPortfolio
                        ? leg[ "strike" ] ===
                        (value === 0
                          ? "ATM"
                          : value > 0
                            ? `ATM+${value}`
                            : `ATM${value}`)
                        : leg[ "strike" ] ===
                        (value === 0
                          ? "ATM"
                          : value > 0
                            ? `ATM+${value}`
                            : `ATM${value}`)
                    }
                    value={
                      value === 0
                        ? "ATM"
                        : value > 0
                          ? `ATM+${value}`
                          : `ATM${value}`
                    }
                  >
                    {value === 0
                      ? "ATM"
                      : value > 0
                        ? `ATM+${value}`
                        : `ATM${value}`}
                  </option>
                ),
              )}
            </select>
          </td>

          <td>
            <select
              className="custom-dropdown"
              style={{ cursor: "pointer" }}
              disabled={isPortfolioExecuted}
              value={leg.target || ""}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                handleDropdownChange(index, e.target.value);
              }}
            >
              <option value="None">None</option>
              <option value="Premium">Premium</option>
              <option value="Underlying">Underlying</option>
              <option value="Strike">Strike</option>
              <option value="Absolute Premium">Absolute Premium</option>
              <option value="Delta">Delta</option>
              <option value="Theta">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              className="number1"
              value={leg.tgt_value}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "tgt_value" ] = e.target.value;
                  return updatedLegs;
                });
              }}
              disabled={
                !leg.target || leg.target === "None" || isPortfolioExecuted
              }
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              className="number1"
              readOnly
              disabled={isPortfolioExecuted}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
              value={
                leg[ "trail_tgt" ].every((value) => value === "")
                  ? ""
                  : leg.trail_tgt.join("~")
              }
            />
            <span
              className="arrow down"
              onClick={(e) => {
                e.stopPropagation();
                togglePopup(index, legs);
                setPopupValuesForIndex(index);
              }}
              style={{
                cursor: leg.target !== "None" ? "pointer" : "not-allowed",
              }}
            ></span>
            {leg.showPopupSL1 && leg.target !== "None" && (
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
                  // height: "450px",
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
                      marginLeft: "-245px",
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
                        class="SLT"
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
                        disabled={isPortfolioExecuted}
                        value={popupValues.profitReaches}
                        id="trail_tgt_0"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "160px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleLegInputChange("profitReaches", e.target.value);
                        }}
                      />
                      <p
                        id="profitReachesError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginTop: "4px",
                          marginLeft: "-45px",
                        }}
                      ></p>
                    </div>
                    <div
                      className="input-box"
                      style={{
                        width: "30px",
                        height: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <span
                        className="SLT"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#4661bd",
                          fontFamily: "roboto",
                          fontSize: "14",
                        }}
                      >
                        Lock Minimum Profit At
                      </span>
                      <input
                        className="number1"
                        type="number"
                        disabled={isPortfolioExecuted}
                        value={popupValues.lockMinimumProfit}
                        id="trail_tgt_1"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "160px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleLegInputChange(
                            "lockMinimumProfit",
                            e.target.value,
                          );
                        }}
                      />
                      <p
                        id="lockProfitError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginTop: "4px",
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
                      marginLeft: "-245px",
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
                        class="SLT"
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
                        disabled={isPortfolioExecuted}
                        value={popupValues.increaseInProfit}
                        id="trail_tgt_2"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "160px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleLegInputChange(
                            "increaseInProfit",
                            e.target.value,
                          );
                        }}
                      />
                      <p
                        id="increaseInProfitError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginLeft: "-45px",
                          marginTop: "4px",
                        }}
                      ></p>
                    </div>
                    <div
                      className="input-box"
                      style={{
                        width: "30px",
                        height: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <span
                        className="SLT"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#4661bd",
                          fontFamily: "roboto",
                          fontSize: "14",
                          marginTop: "19px",
                        }}
                      >
                        Trail Profit By
                      </span>
                      <input
                        className="number1"
                        type="number"
                        disabled={isPortfolioExecuted}
                        value={popupValues.trailProfitBy}
                        id="trail_tgt_3"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "160px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleLegInputChange("trailProfitBy", e.target.value);
                        }}
                      />
                      <p
                        id="trailProfitByError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginTop: "4px",
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      fontFamily: "roboto",
                      fontSize: "12px",
                      marginTop: "30px",
                      color: "orange",
                    }}
                  >
                    VALUES SHOULD BE IN RUPEES ONLY
                  </div>
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
                    onClick={(e) => {
                      // setIsPortfolioEdited(true);
                      handleSetTrailTGT(index);
                    }}
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
                    onClick={() => handleInputDelete(index)}
                  >
                    DELETE
                  </button>

                  <button
                    onClick={togglePopup}
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
                <div
                  style={{
                    fontFamily: "roboto",
                    fontSize: "12px",
                    marginTop: "5px",
                    color: "#4661bd",
                    marginLeft: "-55px",
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
                    marginLeft: "-10px",
                  }}
                >
                  TGT/ SL ON PER LOT BASIS IF TICKED WILL BE APPLICABLE HERE
                </div>
              </div>
            )}
          </td>
          <td>
            <select
              className="custom-dropdown"
              style={{ cursor: "pointer" }}
              disabled={isPortfolioExecuted}
              value={leg.stop_loss || ""}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                handleInputChange(index, e.target.value);
              }}
            >
              <option value="None">None</option>
              <option value="Premium">Premium</option>
              <option value="Underlying">Underlying</option>
              <option value="Strike">Strike</option>
              <option value="Absolute Premium">Absolute Premium</option>
              <option value="Delta">Delta</option>
              <option value="Theta">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              className="number1"
              value={leg.sl_value}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "sl_value" ] = e.target.value;
                  return updatedLegs;
                });
              }}
              disabled={
                !leg.stop_loss ||
                leg.stop_loss === "None" ||
                isPortfolioExecuted
              }
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              className="number1"
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
              value={
                leg.trail_sl.every((value) => value === "")
                  ? ""
                  : leg.trail_sl.join("~")
              }
              disabled={
                !leg.stop_loss ||
                leg.stop_loss === "None" ||
                isPortfolioExecuted
              }
            />
            <span
              className="arrow down"
              onClick={(e) => {
                e.stopPropagation();
                togglePopupSL(index, legs);
                setPopupValuesForIndexSl(index);
              }}
              style={{
                cursor: leg.stop_loss !== "None" ? "pointer" : "not-allowed",
              }}
            ></span>

            {leg.showPopupSL && leg.stop_loss !== "None" && (
              <div
                ref={popupRef}
                className="popupContainer"
                style={{
                  position: "fixed",
                  bottom: "6%",
                  right: "5%",
                  zIndex: 1000,
                  transform: "translate(-20%, 10%)",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  padding: "20px",
                  width: "400px",
                  // height: "210px",
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
                      marginLeft: "-265px",
                      fontFamily: "roboto",
                      fontSize: "14",
                    }}
                  >
                    SL Trailing
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
                        class="SLT"
                        style={{
                          display: "flex",
                          textAlign: "start",
                          color: "#4661bd",
                          fontFamily: "roboto",
                          fontSize: "14",
                        }}
                      >
                        {" "}
                        For Every Increase <br />
                        In Profit By
                      </span>
                      <input
                        className="number1"
                        type="number"
                        disabled={isPortfolioExecuted}
                        value={popupSLValues.increaseInProfit}
                        id="trail_sl_0"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "160px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleSLInputChange(
                            "increaseInProfit",
                            e.target.value,
                          );
                        }}
                      />
                      <p
                        id="SLincreaseInProfitError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginLeft: "-45px",
                          marginTop: "4px",
                        }}
                      ></p>
                    </div>
                    <div
                      className="input-box"
                      style={{
                        marginTop: "18px",
                        width: "30px",
                        height: "5px",
                        marginLeft: "35px",
                      }}
                    >
                      <span
                        className="SLT"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#4661bd",
                          fontFamily: "roboto",
                          fontSize: "14",
                        }}
                      >
                        Trail SL By
                      </span>
                      <input
                        className="number1"
                        type="number"
                        disabled={isPortfolioExecuted}
                        value={popupSLValues.trailProfit}
                        id="trail_sl_1"
                        style={{
                          display: "flex",
                          border: "none",
                          width: "150px",
                          borderBottom: "1px solid #000",
                          outline: "none",
                          boxSizing: "border-box",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          handleSLInputChange("trailProfit", e.target.value);
                        }}
                      />
                      <p
                        id="trailSLByError"
                        style={{
                          color: "red",
                          height: "18px",
                          marginTop: "4px",
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      fontFamily: "roboto",
                      fontSize: "12px",
                      marginTop: "30px",
                      color: "orange",
                    }}
                  >
                    VALUES CAN BE IN POINTS OR IN PERCENTAGE
                  </div>
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
                    onClick={() => {
                      // setIsPortfolioEdited(true);
                      handleSetTrailSL(index);
                    }}
                  >
                    OK
                  </button>
                  <button
                    onClick={togglePopupSL}
                    style={{
                      marginTop: "20px",
                      padding: "4px 8px",
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
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
              disabled={!leg.stop_loss || leg.stop_loss === "None"}
            />
          </td>
          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Underlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Ads Olute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              pattern="[A-Za-z]+"
              title="Only letters are allowed"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-letter characters
                const sanitizedValue = value.replace(/[^A-Za-z]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
            />
          </td>

          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Underlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Ads Olute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              pattern="[A-Za-z]+"
              title="Only letters are allowed"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-letter characters
                const sanitizedValue = value.replace(/[^A-Za-z]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              // value={timerValue}
              onChange={handleTimerChange}
              placeholder="00:00:00"
              style={{ textAlign: "center" }}
              onInput={(e) => {
                const value = e.target.value;
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              value={legs[ index ][ "delta" ]}
              style={{ textAlign: "center" }}
              disabled
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              disabled
              value={legs[ index ][ "theta" ]}
              style={{ textAlign: "center" }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              disabled
              value={legs[ index ][ "vega" ]}
              style={{ textAlign: "center" }}
            />
          </td>
        </tr>
      ));
    };
    const mainUser = cookies.get("USERNAME");

    return (
      <div>
        <div className="tablecontainer" ref={tableRef}>
          <table className="table">
            <thead
              className="thead"
              style={{ position: "sticky", top: "0", zIndex: "20" }}
            >
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>LTP</th>
                <th>Idle</th>
                <th>Lots</th>
                {order_type === "LIMIT" && <th>Price</th>}
                <th>Expiry</th>
                <th>Strike</th>
                <th>Target</th>
                <th>TGT Value</th>
                <th>Trail TGT</th>
                <th>Stoploss</th>
                <th>SL Value</th>
                <th>Trail SL</th>
                <th>SL Wait</th>
                <th>On Target</th>
                <th>
                  TGT portfolio <br />
                  Name/Count
                </th>
                <th>On Stoploss</th>
                <th>
                  Sl portfolio <br />
                  Name/Count
                </th>
                <th>Start Time</th>
                <th>Delta</th>
                <th>Theta</th>
                <th>Vega</th>
              </tr>
            </thead>
            <tbody className="tabletbody1">{generateRows()}</tbody>
          </table>
        </div>
        <div className="frame-13773">
          {/* onClick={addNewRow} */}
          <div className="ce-pe">
            <button
              disabled={isPortfolioExecuted}
              className="ce-pe-span2"
              onClick={handleAddRow}
              style={{
                cursor: isPortfolioExecuted ? "not-allowed" : "poniter",
                backgroundColor: isPortfolioExecuted ? "grey" : "",
                color: isPortfolioExecuted ? "black" : "",
              }}
            >
              + CE/PE
            </button>
          </div>
        </div>
      </div>
    );
  },
);
Fandorow.displayName = "Fandorow";

export default Fandorow;
