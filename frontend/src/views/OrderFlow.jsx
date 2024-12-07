import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { FaPlus } from "react-icons/fa";
import { ErrorContainer } from "../components/ErrorConsole";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cancel from "../assets/undo.png";
import { setBrokers } from "../store/slices/broker";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setOrders } from "../store/slices/orderBook";
import Cookies from "universal-cookie";
import Edit from "../assets/edit.png";
import RightNav from "../components/RightNav";

function OrderFlow() {
  const errorContainerRef = useRef(null);
  // error console
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // error console
  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);
  const navigate = useNavigate();

  const [orderFlowColVis, setorderFlowColVis] = useState(
    allVisState.orderFlowVis,
  );
  const orderFlowCols = [
    "Action",
    "Client ID",
    "Stock Symbol",
    "Exchange",
    "Edit",
    "Order Time",
    "Trade ID",
    "Transaction",
    "Avg Execution Price",
    "Order Size",
    "Execution Quantity",
    "Trade Type",
    "Price",
    "Trigger Price",
    "Trigger Time",
    "Exchange Trade ID",
    "Instrument",
    "Trade Duration",
    "Trade Status",
    "Display Name",
    "Status Message",
    "Label",
  ];

  const [orderFlowColsSelectedALL, setorderFlowColsSelectedALL] =
    useState(false);

  const orderFlowColSelectALL = () => {
    setorderFlowColsSelectedALL((prev) => !prev);
    orderFlowCols.map((orderFlowCol) => {
      setorderFlowColVis((prev) => ({
        ...prev,
        [orderFlowCol]: orderFlowColsSelectedALL,
      }));
    });
  };

  const [orderFlowSeq, setorderFlowSeq] = useState(allSeqState.orderFlowSeq);

  useEffect(() => {
    setorderFlowSeq(allSeqState.orderFlowSeq);
    setorderFlowColVis((prev) => {
      const colVis = {};
      Object.keys(orderFlowColVis).map((col) => {
        if (allSeqState.orderFlowSeq.includes(col)) {
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
        orderFlowVis: orderFlowColVis,
      }),
    );
    if (new Set(Object.values(orderFlowColVis)).size === 1) {
      if (Object.values(orderFlowColVis).includes(true)) {
        setorderFlowSeq(orderFlowCols);
      } else {
        setorderFlowSeq([]);
      }
    }
  }, [orderFlowColVis]);

  useEffect(() => {
    //// console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        orderFlowSeq: orderFlowSeq,
      }),
    );
  }, [orderFlowSeq]);

  const { orders: orderBook } = useSelector((state) => state.orderBookReducer);

  const [filteredOrders, setfilteredOrders] = useState(orderBook);

  useEffect(() => {
    updateFilteredRows({
      clientIdSelected,
      StockSymbolSelected,
      ExchangeSelected,
      ExecutionQuantitySelected,
      InstrumentSelected,
      TradeStatusSelected,

      setuniqueclientId,
      setuniqueStockSymbol,
      setuniqueExchange,
      setuniqueExecutionQuantity,
      setuniqueInstrument,
      setuniqueTradeStatus,
    });
  }, [orderBook]);
  //// console.log(orderBook, "orderBook");

  const [showSearchorderFlow, setshowSearchorderFlow] = useState({
    showSearchclientId: false,
    showSearchStockSymbol: false,
    showSearchExchange: false,
    showSearchExecutionQuantity: false,
    showSearchInstrument: false,
    showSearchTradeStatus: false,
  });
  const handleCloseAllSearchBox = (e) => {
    const allowedElements = ["th img", ".Filter-popup"];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchorderFlow((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, false]),
        ),
      );
    }
  };

  const [selectAllclientId, setSelectAllclientId] = useState(false);
  const [uniqueclientId, setuniqueclientId] = useState([]);
  const [clientIdSelected, setclientIdSelected] = useState([]);

  const [selectAllStockSymbol, setSelectAllStockSymbol] = useState(false);
  const [uniqueStockSymbol, setuniqueStockSymbol] = useState([]);
  const [StockSymbolSelected, setStockSymbolSelected] = useState([]);

  const [selectAllExchange, setSelectAllExchange] = useState(false);
  const [uniqueExchange, setuniqueExchange] = useState([]);
  const [ExchangeSelected, setExchangeSelected] = useState([]);

  const [selectAllExecutionQuantity, setSelectAllExecutionQuantity] =
    useState(false);
  const [uniqueExecutionQuantity, setuniqueExecutionQuantity] = useState([]);
  const [ExecutionQuantitySelected, setExecutionQuantitySelected] = useState(
    [],
  );

  const [selectAllInstrument, setSelectAllInstrument] = useState(false);
  const [uniqueInstrument, setuniqueInstrument] = useState([]);
  const [InstrumentSelected, setInstrumentSelected] = useState([]);

  const [selectAllTradeStatus, setSelectAllTradeStatus] = useState(false);
  const [uniqueTradeStatus, setuniqueTradeStatus] = useState([]);
  const [TradeStatusSelected, setTradeStatusSelected] = useState([]);

  useEffect(() => {
    const data = orderBook;
    //// console.log("orderbook useeefff");
    setuniqueclientId(
      data ? [...new Set(data.map((d) => d["Client ID"]))] : [],
    );
    setuniqueStockSymbol(
      data ? [...new Set(data.map((d) => d["Stock Symbol"]))] : [],
    );
    setuniqueExchange(data ? [...new Set(data.map((d) => d.Exchange))] : []);
    setuniqueExecutionQuantity(
      data ? [...new Set(data.map((d) => d["Execution Quantity"]))] : [],
    );
    setuniqueInstrument(
      data ? [...new Set(data.map((d) => d.Instrument))] : [],
    );
    setuniqueTradeStatus(
      data ? [...new Set(data.map((d) => d["Trade Status"]))] : [],
    );
  }, []);

  const handleCheckboxChangeclientId = (clientId) => {
    const isSelected = clientIdSelected.includes(clientId);
    if (isSelected) {
      setclientIdSelected(clientIdSelected.filter((item) => item !== clientId));
      setSelectAllclientId(false);
    } else {
      setclientIdSelected((prevSelected) => [...prevSelected, clientId]);
      setSelectAllclientId(
        clientIdSelected.length === uniqueclientId.length - 1,
      );
    }
  };
  const handleSelectAllForclientId = () => {
    const allChecked = !selectAllclientId;
    setSelectAllclientId(allChecked);
    if (allChecked) {
      setclientIdSelected(uniqueclientId.map((d) => d.toLowerCase()));
    } else {
      setclientIdSelected([]);
    }
  };
  const handleCheckboxChangeStockSymbol = (StockSymbol) => {
    const isSelected = StockSymbolSelected.includes(StockSymbol);
    if (isSelected) {
      setStockSymbolSelected(
        StockSymbolSelected.filter((item) => item !== StockSymbol),
      );
      setSelectAllStockSymbol(false);
    } else {
      setStockSymbolSelected((prevSelected) => [...prevSelected, StockSymbol]);
      setSelectAllStockSymbol(
        StockSymbolSelected.length === uniqueStockSymbol.length - 1,
      );
    }
  };
  const handleSelectAllForStockSymbol = () => {
    const allChecked = !selectAllStockSymbol;
    setSelectAllStockSymbol(allChecked);
    if (allChecked) {
      setStockSymbolSelected(uniqueStockSymbol.map((d) => d.toLowerCase()));
    } else {
      setStockSymbolSelected([]);
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
  const handleCheckboxChangeExecutionQuantity = (ExecutionQuantity) => {
    const isSelected = ExecutionQuantitySelected.includes(ExecutionQuantity);
    if (isSelected) {
      setExecutionQuantitySelected(
        ExecutionQuantitySelected.filter((item) => item !== ExecutionQuantity),
      );
      setSelectAllExecutionQuantity(false);
    } else {
      setExecutionQuantitySelected((prevSelected) => [
        ...prevSelected,
        ExecutionQuantity,
      ]);
      setSelectAllExecutionQuantity(
        ExecutionQuantitySelected.length === uniqueExecutionQuantity.length - 1,
      );
    }
  };
  const handleSelectAllForExecutionQuantity = () => {
    const allChecked = !selectAllExecutionQuantity;
    setSelectAllExecutionQuantity(allChecked);
    if (allChecked) {
      setExecutionQuantitySelected(
        uniqueExecutionQuantity.map((d) => d.toLowerCase()),
      );
    } else {
      setExecutionQuantitySelected([]);
    }
  };
  const handleCheckboxChangeInstrument = (Instrument) => {
    const isSelected = InstrumentSelected.includes(Instrument);
    if (isSelected) {
      setInstrumentSelected(
        InstrumentSelected.filter((item) => item !== Instrument),
      );
      setSelectAllInstrument(false);
    } else {
      setInstrumentSelected((prevSelected) => [...prevSelected, Instrument]);
      setSelectAllInstrument(
        InstrumentSelected.length === uniqueInstrument.length - 1,
      );
    }
  };
  const handleSelectAllForInstrument = () => {
    const allChecked = !selectAllInstrument;
    setSelectAllInstrument(allChecked);
    if (allChecked) {
      setInstrumentSelected(uniqueInstrument.map((d) => d.toLowerCase()));
    } else {
      setInstrumentSelected([]);
    }
  };
  const handleCheckboxChangeTradeStatus = (TradeStatus) => {
    const isSelected = TradeStatusSelected.includes(TradeStatus);
    if (isSelected) {
      setTradeStatusSelected(
        TradeStatusSelected.filter((item) => item !== TradeStatus),
      );
      setSelectAllTradeStatus(false);
    } else {
      setTradeStatusSelected((prevSelected) => [...prevSelected, TradeStatus]);
      setSelectAllTradeStatus(
        TradeStatusSelected.length === uniqueTradeStatus.length - 1,
      );
    }
  };
  const handleSelectAllForTradeStatus = () => {
    const allChecked = !selectAllTradeStatus;
    setSelectAllTradeStatus(allChecked);
    if (allChecked) {
      setTradeStatusSelected(uniqueTradeStatus.map((d) => d.toLowerCase()));
    } else {
      setTradeStatusSelected([]);
    }
  };

  const handleOkClick = () => {
    updateFilteredRows({
      clientIdSelected,
      StockSymbolSelected,
      ExchangeSelected,
      ExecutionQuantitySelected,
      InstrumentSelected,
      TradeStatusSelected,

      setuniqueclientId,
      setuniqueStockSymbol,
      setuniqueExchange,
      setuniqueExecutionQuantity,
      setuniqueInstrument,
      setuniqueTradeStatus,
    });

    setshowSearchorderFlow((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, false]),
      ),
    );
  };

  const [nameOfNonEmptyArray, setnameOfNonEmptyArray] = useState(null);

  const updateFilteredRows = ({
    clientIdSelected,
    StockSymbolSelected,
    ExchangeSelected,
    ExecutionQuantitySelected,
    InstrumentSelected,
    TradeStatusSelected,

    setuniqueclientId,
    setuniqueStockSymbol,
    setuniqueExchange,
    setuniqueExecutionQuantity,
    setuniqueInstrument,
    setuniqueTradeStatus,
  }) => {
    const rows = orderBook;
    let prevfilteredRows;
    if (clientIdSelected.length !== 0) {
      prevfilteredRows = rows.filter((row) =>
        clientIdSelected.includes(row["Client ID"].toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    if (StockSymbolSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        StockSymbolSelected.includes(row["Stock Symbol"].toLowerCase()),
      );
    }
    if (ExchangeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ExchangeSelected.includes(row.Exchange.toLowerCase()),
      );
    }
    if (ExecutionQuantitySelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ExecutionQuantitySelected.includes(
          row["Execution Quantity"].toLowerCase(),
        ),
      );
    }
    if (InstrumentSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        InstrumentSelected.includes(row.Instrument.toLowerCase()),
      );
    }
    if (TradeStatusSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        TradeStatusSelected.includes(row["Trade Status"].toLowerCase()),
      );
    }

    const arrayNames = [
      "clientIdSelected",
      "StockSymbolSelected",
      "ExchangeSelected",
      "ExecutionQuantitySelected",
      "InstrumentSelected",
      "TradeStatusSelected",
    ];

    const arrays = [
      clientIdSelected,
      StockSymbolSelected,
      ExchangeSelected,
      ExecutionQuantitySelected,
      InstrumentSelected,
      TradeStatusSelected,
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

    if (NameOfNonEmptyArray !== "clientIdSelected") {
      setuniqueclientId(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow["Client ID"];
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "StockSymbolSelected") {
      setuniqueStockSymbol(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow["Stock Symbol"];
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
    if (NameOfNonEmptyArray !== "ExecutionQuantitySelected") {
      setuniqueExecutionQuantity(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow["Execution Quantity"];
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "InstrumentSelected") {
      setuniqueInstrument(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow.Instrument;
            }),
          ),
        );
      });
    }
    if (NameOfNonEmptyArray !== "TradeStatusSelected") {
      setuniqueTradeStatus(() => {
        return Array.from(
          new Set(
            prevfilteredRows.map((filteredRow) => {
              return filteredRow["Trade Status"];
            }),
          ),
        );
      });
    }
    setfilteredOrders(prevfilteredRows);
  };
  const [tooltipStates, setTooltipStates] = useState({});

  const handleMouseEnter = (index) => {
    setTooltipStates({ ...tooltipStates, [index]: true });
  };

  const handleMouseLeave = (index) => {
    setTooltipStates({ ...tooltipStates, [index]: false });
  };
  //console.log(orderBook, "orderBook");

  const cookies = new Cookies();
  const mainUser = cookies.get("USERNAME");
  const { brokers: rows } = useSelector((state) => state.brokerReducer);
  //console.log(rows, "rows");

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  };
  const modalStyle1 = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    borderRadius: "5px",
    width: "50%",
    maxHeight: "100%",
    textAlign: "center",
  };
  const buttonStyle = {
    backgroundColor: "#4661bd",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "0px",
    marginRight: "10px",
  };

  const { masterChildAccounts } = useSelector(
    (state) => state.masterChildAccountsReducer,
  );
  const [childOrders, setChildOrders] = useState([]);
  //// console.log(OrderDetails, "OrderDetails")
  const cancelOrders = async () => {
    //console.log("mc users", masterChildAccounts, OrderDetails)
    const userid = OrderDetails["Client ID"];
    const orderid = OrderDetails["Trade ID"];
    const isMasterChild = /^\d+$/.test(OrderDetails["Label"]);
    if (isMasterChild) {
      //console.log("is MasterChild", isMasterChild)

      // open orders that came from MC
      const masterId = OrderDetails["Label"].slice(6);
      const masterChildDetails = masterChildAccounts.filter(
        (mc) => mc.id == masterId,
      )[0];
      const allChildOrderIDs = [orderid];
      if (userid === masterChildDetails["broker_user_id"]) {
        // call master order cancel endpoint
        // allChildOrderIDs.push(order["Trade ID"])
        const childUserIds = masterChildDetails.child_accounts.map(
          (childAcc) => childAcc.broker_user_id,
        );
        childUserIds.map((childUserid) => {
          orderBook.map((order) => {
            if (
              order["Client ID"] === childUserid &&
              order["Label"] === OrderDetails["Label"]
            ) {
              allChildOrderIDs.push(order["Trade ID"]);
            }
          });
        });
      }
      //console.log("calling cancel order", allChildOrderIDs, masterId)
      try {
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/cancel_mc_orders/${mainUser}/${OrderDetails["Label"].slice(6)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_ids: allChildOrderIDs }),
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
        } else {
          const responseData = await response.json();
          //console.log(responseData, "data succes master order cancel");
        }
      } catch (error) {
        console.error(`Error occurred while calling  API:`, error.message);
      }
    } else {
      // open orders that came from portfolios
      //console.log("Call an endpoint to cancel portoflio level open orders")
      try {
        const response = await fetch(
          `${import.meta.env.SERVER_HOST}/cancel_portfolio_orders/${mainUser}/${orderid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
        } else {
          const responseData = await response.json();
          //console.log(responseData, "data succes portfolio order cancel");
        }
      } catch (error) {
        console.error(`Error occurred while calling  API:`, error.message);
      }
    }
  };

  const orderFlowTH = {
    Action: orderFlowColVis["Action"] && (
      <th>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSelectBox((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),

    "Client ID": orderFlowColVis["Client ID"] && (
      <th>
        <div>
          <small>Client ID</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchclientId"
                      ? !prev.showSearchclientId
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchorderFlow.showSearchclientId && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllclientId}
                    onChange={handleSelectAllForclientId}
                  />
                  Select all
                </li>
                <li>
                  {uniqueclientId
                    .filter((name) => name !== undefined && name !== "")
                    .map((clientId, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={clientIdSelected.includes(
                              clientId.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeclientId(
                                clientId.toLowerCase(),
                              )
                            }
                          />
                          <label>{clientId}</label>
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
                  setshowSearchorderFlow((prev) =>
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
    "Stock Symbol": orderFlowColVis["Stock Symbol"] && (
      <th>
        <div>
          <small>Stock Symbol</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchStockSymbol"
                      ? !prev.showSearchStockSymbol
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
        {showSearchorderFlow.showSearchStockSymbol && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllStockSymbol}
                    onChange={handleSelectAllForStockSymbol}
                  />
                  Select all
                </li>
                <li>
                  {uniqueStockSymbol
                    .filter((name) => name !== undefined && name !== "")
                    .map((StockSymbol, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={StockSymbolSelected.includes(
                              StockSymbol.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeStockSymbol(
                                StockSymbol.toLowerCase(),
                              )
                            }
                          />
                          <label>{StockSymbol}</label>
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
                  setshowSearchorderFlow((prev) =>
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
    Exchange: orderFlowColVis["Exchange"] && (
      <th>
        <div>
          <small>Exchange</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
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
        {showSearchorderFlow.showSearchExchange && (
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
                  setshowSearchorderFlow((prev) =>
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
    Edit: orderFlowColVis["Edit"] && (
      <th>
        <div>
          <small>Edit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "5px",
            }}
            onClick={() => {
              // setShowSearchMTM((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Order Time": orderFlowColVis["Order Time"] && (
      <th>
        <div>
          <small>Order Time</small>
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
    "Trade ID": orderFlowColVis["Trade ID"] && (
      <th>
        <div>
          <small>Trade ID</small>
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
    Transaction: orderFlowColVis["Transaction"] && (
      <th>
        <div>
          <small>Transaction</small>
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
    "Avg Execution Price": orderFlowColVis["Avg Execution Price"] && (
      <th>
        <div>
          <small>Avg Execution Price</small>
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
    "Order Size": orderFlowColVis["Order Size"] && (
      <th>
        <div>
          <small>Order Size</small>
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
    "Execution Quantity": orderFlowColVis["Execution Quantity"] && (
      <th>
        <div>
          <small>Execution Quantity</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchExecutionQuantity"
                      ? !prev.showSearchExecutionQuantity
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchorderFlow.showSearchExecutionQuantity && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllExecutionQuantity}
                    onChange={handleSelectAllForExecutionQuantity}
                  />
                  Select all
                </li>
                <li>
                  {uniqueExecutionQuantity
                    .filter((name) => name !== undefined && name !== "")
                    .map((ExecutionQuantity, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={ExecutionQuantitySelected.includes(
                              ExecutionQuantity.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeExecutionQuantity(
                                ExecutionQuantity.toLowerCase(),
                              )
                            }
                          />
                          <label>{ExecutionQuantity}</label>
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
                  setshowSearchorderFlow((prev) =>
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
    "Trade Type": orderFlowColVis["Trade Type"] && (
      <th>
        <div>
          <small>Trade Type</small>
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
    Price: orderFlowColVis["Price"] && (
      <th>
        <div>
          <small>Price</small>
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
    "Trigger Price": orderFlowColVis["Trigger Price"] && (
      <th>
        <div>
          <small>Trigger Price</small>
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
                <button onClick={() => setShowSearchSqOffTime((prev) => !prev)}>
                  Cancel
                </button>
              </div>
            </div>
          )} */}
        </div>
      </th>
    ),
    "Trigger Time": orderFlowColVis["Trigger Time"] && (
      <th>
        <div>
          <small>Trigger Time</small>
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
    "Exchange Trade ID": orderFlowColVis["Exchange Trade ID"] && (
      <th>
        <div>
          <small>Exchange Trade ID</small>
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
    Instrument: orderFlowColVis["Instrument"] && (
      <th>
        <div>
          <small>Instrument</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchInstrument"
                      ? !prev.showSearchInstrument
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchorderFlow.showSearchInstrument && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllInstrument}
                    onChange={handleSelectAllForInstrument}
                  />
                  Select all
                </li>
                <li>
                  {uniqueInstrument
                    .filter((name) => name !== undefined && name !== "")
                    .map((Instrument, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={InstrumentSelected.includes(
                              Instrument.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeInstrument(
                                Instrument.toLowerCase(),
                              )
                            }
                          />
                          <label>{Instrument}</label>
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
                  setshowSearchorderFlow((prev) =>
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
    "Trade Duration": orderFlowColVis["Trade Duration"] && (
      <th>
        <div>
          <small>Trade Duration</small>
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
        </div>
      </th>
    ),
    "Trade Status": orderFlowColVis["Trade Status"] && (
      <th>
        <div>
          <small>Trade Status</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchorderFlow((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchTradeStatus"
                      ? !prev.showSearchTradeStatus
                      : false,
                  ]),
                ),
              }));
            }}
          />
          {/* {showSearchMaxLoss && (
            <div className="Filter-popup">
              <form id="filter-form" className="Filter-inputs-container">
                <ul>
                  <li>
                    <input
                      type="checkbox"
                      style={{ width: "12px" }}
                      checked={selectAllMaxLoss}
                      onChange={handleSelectAllForMaxLoss}
                    />
                    Select all
                  </li>
                  <li>
                    {uniqueDataMaxLoss.map((maxLoss, index) => (
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
                <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                  Cancel
                </button>
              </div>
            </div>
          )} */}
        </div>
        {showSearchorderFlow.showSearchTradeStatus && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllTradeStatus}
                    onChange={handleSelectAllForTradeStatus}
                  />
                  Select all
                </li>
                <li>
                  {uniqueTradeStatus
                    .filter((name) => name !== undefined && name !== "")
                    .map((TradeStatus, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={TradeStatusSelected.includes(
                              TradeStatus.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeTradeStatus(
                                TradeStatus.toLowerCase(),
                              )
                            }
                          />
                          <label>{TradeStatus}</label>
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
                  setshowSearchorderFlow((prev) =>
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
    "Display Name": orderFlowColVis["Display Name"] && (
      <th>
        <div>
          <small>Display Name</small>
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
    "Status Message": orderFlowColVis["Status Message"] && (
      <th>
        <div>
          <small>Status Message</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSearchQtyByExposure((prev) => !prev);
            }}
          />
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
                <button onClick={handleOkClick}>OK</button>
                <button
                  onClick={() => setShowSearchQtyByExposure((prev) => !prev)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )} */}
        </div>
      </th>
    ),
    Label: orderFlowColVis["Label"] && (
      <th>
        <div>
          <small>Label</small>
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
  const [OrderDetails, setOrderDetails] = useState("");
  const [editModal, seteditModal] = useState(false);
  //console.log(OrderDetails, "OrderDetails")

  const openEditModal = (order) => {
    setOrderDetails(order);
    seteditModal(true);

    const userid = order["Client ID"];
    const isMasterChild = /^\d+$/.test(order["Label"]);

    if (isMasterChild) {
      //console.log(isMasterChild, "childOrders1")
      const masterId = order["Label"];
      const masterChildDetails = masterChildAccounts.find(
        (mc) => mc.id == masterId.slice(6),
      );
      //console.log(masterChildDetails, masterChildAccounts, masterId, "childOrders")

      if (
        masterChildDetails &&
        userid === masterChildDetails["broker_user_id"]
      ) {
        const childUserIds = masterChildDetails.child_accounts.map(
          (childAcc) => childAcc.broker_user_id,
        );

        const fetchedChildOrders = orderBook.filter(
          (order) =>
            childUserIds.includes(order["Client ID"]) &&
            order["Label"] === masterId,
        );
        //console.log(childUserIds, fetchedChildOrders, "childOrders12")

        setChildOrders(fetchedChildOrders);
      }
    } else {
      setChildOrders([]);
    }
  };
  const closeModalDelete = () => {
    seteditModal(false);
  };
  const [price, setPrice] = useState(OrderDetails["Price"]);
  const [quantity, setQuantity] = useState(OrderDetails["Execution Quantity"]);
  const [error, setError] = useState("");

  useEffect(() => {
    setPrice(OrderDetails["Price"] || 0);
    setQuantity(OrderDetails["Execution Quantity"] || 0);
  }, [OrderDetails]);

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleQtyChange = (event) => {
    setQuantity(event.target.value);
    validateQuantity(event.target.value);
  };

  const validateQuantity = (qty) => {
    const symbol = OrderDetails["Stock Symbol"];
    //console.log(symbol, "Stock Symbol1")
    let errorMessage = "";

    if (symbol.includes("NIFTY") && qty % 25 !== 0) {
      errorMessage = "Quantity should be a multiple of 25 for NIFTY";
    } else if (symbol.includes("BANKNIFTY") && qty % 15 !== 0) {
      errorMessage = "Quantity should be a multiple of 15 for BANKNIFTY";
    } else if (symbol.includes("FINNIFTY") && qty % 40 !== 0) {
      errorMessage = "Quantity should be a multiple of 40 for FINNIFTY";
    }

    setError(errorMessage);
    return errorMessage === "";
  };

  const handleModifySelected = () => {
    if (!validateQuantity(quantity)) {
      alert("Please enter a valid quantity.");
      return;
    }

    const userid = OrderDetails["Client ID"];
    const orderid = OrderDetails["Trade ID"];
    const isMasterChild = /^\d+$/.test(OrderDetails["Label"]);
    let allChildOrderIDs = [orderid];

    if (isMasterChild) {
      const masterId = OrderDetails["Label"].slice(6);
      const masterChildDetails = masterChildAccounts.find(
        (mc) => mc.id == masterId,
      );

      if (userid === masterChildDetails["broker_user_id"]) {
        const childUserIds = masterChildDetails.child_accounts.map(
          (childAcc) => childAcc.broker_user_id,
        );
        childUserIds.forEach((childUserid) => {
          orderBook.forEach((order) => {
            if (
              order["Client ID"] === childUserid &&
              order["Label"] === OrderDetails["Label"]
            ) {
              allChildOrderIDs.push(order["Trade ID"]);
            }
          });
        });
      }
    }

    const dataToUpdate = {
      order_ids: allChildOrderIDs,
      new_price: parseFloat(price),
      new_quantity: parseInt(quantity, 10),
    };

    fetch(`/modify_mc_orders/${mainUser}/${OrderDetails["Label"].slice(6)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        alert("Orders modified successfully!");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("Failed to modify orders. Please try again later.");
      });
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
              <i class="bi bi-diagram-2"></i>
                <span className="text-blue-600 font-bold">Order Flow</span>{" "}
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
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                {orderFlowSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {orderFlowTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody >
                {filteredOrders.map((order, index) => {
                  const orderFlowTD = {
                    Action: orderFlowColVis["Action"] && (
                      <td
                        style={{
                          textAlign: "center",
                          cursor:
                            order["Trade Status"] !== "OPEN"
                              ? "not-allowed"
                              : "pointer",
                          opacity: order["Trade Status"] !== "OPEN" ? 0.5 : 1,
                          // backgroundColor: order[ "Trade Status" ] === "OPEN" ? "green" : "red",
                          position: "relative",
                        }}
                        aria-disabled={order["Trade Status"] !== "OPEN"}
                      >
                        {/* {
                         order[ "Trade Status" ] === "OPEN" && (
                          <>
                          <img
                          src={Cancel}
                          alt="icon"
                          className="logout_icon"
                          style={{
                            height: "25px",
                            width: "25px",
                            pointerEvents: order[ "Trade Status" ] !== "OPEN" ? "none" : "auto",
                          }}
                          onMouseEnter={() => order[ "Trade Status" ] === "OPEN" && handleMouseEnter(index)}
                          onMouseLeave={() => order[ "Trade Status" ] === "OPEN" && handleMouseLeave(index)}
                          onClick={() => order[ "Trade Status" ] === "OPEN" && handleCancelOrder(index, order)}
                        />
                        <span
                          style={{
                            visibility: tooltipStates[ index ] ? "visible" : "hidden",
                            margin: "-18px",
                            marginLeft: "9px",
                            textAlign: "center",
                            position: "absolute",
                            zIndex: 1000,
                            backgroundColor: "#4661bd",
                            color: "white",
                            transform: "translateX(-50%)",
                            opacity: tooltipStates[ index ] ? 1 : 0,
                            transition: "opacity 0.3s",
                          }}
                        >
                          Cancel
                        </span>
                          </>
                         )
                      } */}
                      </td>
                    ),

                    "Client ID": orderFlowColVis["Client ID"] && (
                      <td>
                        <input
                          value={order["Client ID"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Stock Symbol": orderFlowColVis["Stock Symbol"] && (
                      <td>
                        <input
                          value={order["Stock Symbol"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    ),
                    Exchange: orderFlowColVis["Exchange"] && (
                      <td>
                        <input
                          value={order["Exchange"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    Edit: orderFlowColVis["Edit"] && (
                      <td style={{ textAlign: "center" }}>
                        {order["Trade Status"]?.toLowerCase() ===
                          "open" && (
                            <span className="tooltip-container">
                              <img
                                src={Edit}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  openEditModal(order);
                                }}
                              />
                              <span className="tooltiptext delete-tooltip">
                                Edit
                              </span>
                            </span>
                          )}
                      </td>
                    ),

                    "Order Time": orderFlowColVis["Order Time"] && (
                      <td>
                        <input
                          value={order["Order Time"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade ID": orderFlowColVis["Trade ID"] && (
                      <td>
                        <input
                          value={order["Trade ID"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Transaction: orderFlowColVis["Transaction"] && (
                      <td>
                        <input
                          value={order.Transaction}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Avg Execution Price": orderFlowColVis[
                      "Avg Execution Price"
                    ] && (
                        <td>
                          <input
                            type="text"
                            style={{ disable: "none", padding: "6px 15px" }}
                          />
                        </td>
                      ),
                    "Order Size": orderFlowColVis["Order Size"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Execution Quantity": orderFlowColVis[
                      "Execution Quantity"
                    ] && (
                        <td>
                          <input
                            value={order["Execution Quantity"]}
                            type="number"
                            style={{ disable: "none", padding: "6px 15px" }}
                          />
                        </td>
                      ),

                    "Trade Type": orderFlowColVis["Trade Type"] && (
                      <td>
                        <input
                          value={order["Trade Type"]}
                          type="text"
                          style={{ padding: "6px" }}
                        />
                      </td>
                    ),

                    Price: orderFlowColVis["Price"] && (
                      <td>
                        <input
                          value={order["Price"] ? order["Price"] : 0}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trigger Price": orderFlowColVis["Trigger Price"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trigger Time": orderFlowColVis["Trigger Time"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exchange Trade ID": orderFlowColVis[
                      "Exchange Trade ID"
                    ] && (
                        <td>
                          <input
                            value={order["Exchange Trade ID"]}
                            type="number"
                            style={{ disable: "none", padding: "6px 15px" }}
                          />
                        </td>
                      ),
                    Instrument: orderFlowColVis["Instrument"] && (
                      <td>
                        <input
                          value={order["Instrument"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade Duration": orderFlowColVis["Trade Duration"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade Status": orderFlowColVis["Trade Status"] && (
                      <td>
                        <input
                          value={order["Trade Status"]?.toUpperCase()}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Display Name": orderFlowColVis["Display Name"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Status Message": orderFlowColVis["Status Message"] && (
                      <td>
                        <input
                          value={order.message}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Label: orderFlowColVis["Label"] && (
                      <td>
                        <input
                          value={order.Label}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {orderFlowSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {orderFlowTD[colName]}
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
            msgs={msgs}
            handleClearLogs={handleClearLogs}
          />
        </div>

      
      {editModal && (
        <>
          <div style={overlayStyle} onClick={closeModalDelete}></div>
          <div style={modalStyle1}>
            <h2>Modify Order(s)</h2>
            <table
              style={{ width: "100%", marginBottom: "20px", overflowY: "auto" }}
            >
              <thead style={{ backgroundColor: "rgb(216, 225, 255)" }}>
                <tr>
                  <th>Symbol</th>
                  <th>Order Type</th>
                  <th>UserID</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Order ID</th>
                  <th>Limit Price</th>
                </tr>
              </thead>
              <tbody>
                {/* Master Order Row */}
                <tr>
                  <td>{OrderDetails["Stock Symbol"]}</td>
                  <td>{OrderDetails["Trade Type"]}</td>
                  <td>{OrderDetails["Client ID"]}</td>
                  <td>{OrderDetails["Execution Quantity"]}</td>
                  <td>{OrderDetails["Trade Status"]}</td>
                  <td>{OrderDetails["Trade ID"]}</td>
                  <td>{OrderDetails["Price"]}</td>
                </tr>

                {childOrders && childOrders.length > 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Child Orders
                    </td>
                  </tr>
                )}

                {/* Child Orders Rows */}
                {childOrders?.map((childOrder, index) => (
                  <tr key={index}>
                    <td>{childOrder["Stock Symbol"]}</td>
                    <td>{childOrder["Trade Type"]}</td>
                    <td>{childOrder["Client ID"]}</td>
                    <td>{childOrder["Execution Quantity"]}</td>
                    <td>{childOrder["Trade Status"]}</td>
                    <td>{childOrder["Trade ID"]}</td>
                    <td>{childOrder["Price"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label>
                Modify Price:
                <input
                  type="number"
                  value={price}
                  style={{ width: "70px" }}
                  onChange={handlePriceChange}
                />
              </label>
              <label>
                Modify Quantity:
                <input
                  type="number"
                  value={quantity}
                  style={{ width: "70px" }}
                  onChange={handleQtyChange}
                />
              </label>
              {error && <span style={{ color: "red" }}>{error}</span>}
            </div>
            <div>
              <button style={buttonStyle} onClick={handleModifySelected}>
                Modify Selected
              </button>
              <button
                style={buttonStyle}
                onClick={() => alert("Execute at Market")}
              >
                Execute at Market
              </button>
              <button style={buttonStyle} onClick={cancelOrders}>
                Cancel Selected
              </button>
              <button style={buttonStyle} onClick={closeModalDelete}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default OrderFlow;
