import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { useNavigate } from "react-router-dom";
import { ErrorContainer } from "../components/ErrorConsole";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import RightNav from "../components/RightNav";

function OrderManagement() {
  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  // error console
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  const navigate = useNavigate();
  // error console
  // order managment table
  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const [orderManagementColVis, setOrderManagementColVis] = useState(
    allVisState.ordermanagementVis,
  );
  const ordermanagmentCols = [
    "Action",
    "User ID",
    "Source Symbol",
    "Request ID",
    "Exchange",
    "Exchange Symbol",
    "LTP",
    "P&L",
    "Product",
    "Entry Order Type",
    "Entry Order ID",
    "Entry Time",
    "Entry Txn",
    "Entry Qty",
    "Entry Filled Qty",
    "Entry Exchange Time",
    "LTP#1",
    "LTP#2",
    "Entry Avg Price",
    "LTP#3",
    "Entry Status",
    "Exit Order ID",
    "Exit Time",
    "Exit Txn",
    "Exit Qty",
    "Exit Filled Qty",
    "LTP#4",
    "Exit Exchange Time",
    "Exit Avg Price",
    "Exit Status",
    "Target",
    "SL",
    "Break Even",
    "Signal Source",
    "Strategy",
    "Signal Status",
    "Order Failed",
    "User Alies",
    "Remarks",
    "Manual Exit",
  ];

  const [ordermanagmentColsSelectedALL, setordermanagmentColsSelectedALL] =
    useState(false);
  const ordermanagmentColSelectALL = () => {
    setordermanagmentColsSelectedALL((prev) => {
      return !prev;
    });
    ordermanagmentCols.map((ordermanagmentCol) => {
      setOrderManagementColVis((prev) => ({
        ...prev,
        [ordermanagmentCol]: ordermanagmentColsSelectedALL,
      }));
    });
  };

  const [ordermanagementSeq, setordermanagementSeq] =
    useState(ordermanagmentCols);

  useEffect(() => {
    setordermanagementSeq(allSeqState.ordermanagementSeq);
    setOrderManagementColVis((prev) => {
      const colVis = {};
      Object.keys(orderManagementColVis).map((col) => {
        if (allSeqState.ordermanagementSeq.includes(col)) {
          colVis[col] = true;
        } else {
          colVis[col] = false;
        }
      });
      // console.log("{...prev, ...colVis}", {...prev, ...colVis})
      return { ...colVis };
    });
  }, []);

  useEffect(() => {
    dispatch(
      setAllVis({
        ...allVisState,
        orderManagementColVis: orderManagementColVis,
      }),
    );
    if (new Set(Object.values(orderManagementColVis)).size === 1) {
      if (Object.values(orderManagementColVis).includes(true)) {
        setordermanagementSeq(ordermanagmentCols);
      } else {
        setordermanagementSeq([]);
      }
    }
  }, [orderManagementColVis]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        ordermanagementSeq: ordermanagementSeq,
      }),
    );
  }, [ordermanagementSeq]);

  const [orderBook, setOrderBook] = useState([
    {
      ch: "",
      chp: "",
      clientId: "",
      description: "",
      discloseQty: "",
      disclosedQty: "",
      dqQtyRem: "",
      ex_sym: "",
      exchOrdId: "",
      exchange: "",
      filledQty: "",
      fyToken: "",
      id: "",
      instrument: "",
      limitPrice: "",
      lp: "",
      message: "",
      offlineOrder: "",
      orderDateTime: "",
      orderNumStatus: "",
      orderValidity: "",
      pan: "",
      productType: "",
      qty: "",
      remainingQuantity: "",
      segment: "",
      side: "",
      slNo: "",
      source: "",
      status: "",
      stopPrice: "",
      symbol: "",
      tradedPrice: "",
      type: "",
    },
  ]);
  useEffect(() => {
    if (orderBook.length === 0) {
      setOrderBook([
        {
          ch: "",
          chp: "",
          clientId: "",
          description: "",
          discloseQty: "",
          disclosedQty: "",
          dqQtyRem: "",
          ex_sym: "",
          exchOrdId: "",
          exchange: "",
          filledQty: "",
          fyToken: "",
          id: "",
          instrument: "",
          limitPrice: "",
          lp: "",
          message: "",
          offlineOrder: "",
          orderDateTime: "",
          orderNumStatus: "",
          orderValidity: "",
          pan: "",
          productType: "",
          qty: "",
          remainingQuantity: "",
          segment: "",
          side: "",
          slNo: "",
          source: "",
          status: "",
          stopPrice: "",
          symbol: "",
          tradedPrice: "",
          type: "",
        },
      ]);
    }
  }, [orderBook]);
  // order managment table
  const orderManagementTH = {
    Action: orderManagementColVis["Action"] && (
      <th key="action">
        <div>
          <small>Action</small>
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
    "User ID": orderManagementColVis["User ID"] && (
      <th key="userId">
        <div>
          <small>User ID</small>
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
    "Source Symbol": orderManagementColVis["Source Symbol"] && (
      <th key="sourceSymbol">
        <div>
          <small>Source Symbol</small>
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
    "Request ID": orderManagementColVis["Request ID"] && (
      <th key="requestId">
        <div>
          <small>Request ID</small>
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
    Exchange: orderManagementColVis["Exchange"] && (
      <th key="exchange">
        <div>
          <small>Exchange</small>
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
    "Exchange Symbol": orderManagementColVis["Exchange Symbol"] && (
      <th key="exchangeSymbol">
        <div>
          <small>Exchange Symbol</small>
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
    LTP: orderManagementColVis["LTP"] && (
      <th key="ltp">
        <div>
          <small>LTP</small>
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
    "P&L": orderManagementColVis["P&L"] && (
      <th key="pnl">
        <div>
          <small>P&L</small>
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
    Product: orderManagementColVis["Product"] && (
      <th key="product">
        <div>
          <small>Product</small>
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
    "Entry Order Type": orderManagementColVis["Entry Order Type"] && (
      <th key="entryOrderType">
        <div>
          <small>Entry Order Type</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              // marginLeft: "-10px",
            }}
          />
        </div>
      </th>
    ),
    "Entry Order ID": orderManagementColVis["Entry Order ID"] && (
      <th key="entryOrderId">
        <div>
          <small>Entry Order ID</small>
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
    "Entry Time": orderManagementColVis["Entry Time"] && (
      <th key="entryTime">
        <div>
          <small>Entry Time</small>
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
    "Entry Txn": orderManagementColVis["Entry Txn"] && (
      <th key="entryTxn">
        <div>
          <small>Entry Txn</small>
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
    "Entry Qty": orderManagementColVis["Entry Qty"] && (
      <th key="entryQty">
        <div>
          <small>Entry Qty</small>
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
    "Entry Filled Qty": orderManagementColVis["Entry Filled Qty"] && (
      <th key="entryFilledQty">
        <div>
          <small>Entry Filled Qty</small>
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
    "Entry Exchange Time": orderManagementColVis["Entry Exchange Time"] && (
      <th key="entryExchangeTime">
        <div>
          <small>Entry Exchange Time</small>
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
    "LTP#1": orderManagementColVis["LTP#1"] && (
      <th key="ltp1">
        <div>
          <small>LTP#1</small>
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
    "LTP#2": orderManagementColVis["LTP#2"] && (
      <th key="ltp2">
        <div>
          <small>LTP#2</small>
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
    "Entry Avg Price": orderManagementColVis["Entry Avg Price"] && (
      <th key="entryAvgPrice">
        <div>
          <small>Entry Avg Price</small>
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
    "LTP#3": orderManagementColVis["LTP#3"] && (
      <th key="ltp3">
        <div>
          <small>LTP#3</small>
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
    "Entry Status": orderManagementColVis["Entry Status"] && (
      <th key="entryStatus">
        <div>
          <small> Entry Status</small>
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
    "Exit Order ID": orderManagementColVis["Exit Order ID"] && (
      <th key="exitOrderID">
        <div>
          <small>Exit Order ID</small>
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
    "Exit Time": orderManagementColVis["Exit Time"] && (
      <th key="exitTime">
        <div>
          <small>Exit Time</small>
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
    "Exit Txn": orderManagementColVis["Exit Txn"] && (
      <th key="exitTxn">
        <div>
          <small>Exit Txn</small>
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
    "Exit Qty": orderManagementColVis["Exit Qty"] && (
      <th key="exitQty">
        <div>
          <small>Exit Qty</small>
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
    "Exit Filled Qty": orderManagementColVis["Exit Filled Qty"] && (
      <th key="exitFilledQty">
        <div>
          <small>Exit Filled Qty</small>
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
    "LTP#4": orderManagementColVis["LTP#4"] && (
      <th key="ltp4">
        <div>
          <small>LTP#4</small>
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
    "Exit Exchange Time": orderManagementColVis["Exit Exchange Time"] && (
      <th key="exitExchangeTime">
        <div>
          <small>Exit Exchange Time</small>
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
    "Exit Avg Price": orderManagementColVis["Exit Avg Price"] && (
      <th key="exitAvgPrice">
        <div>
          <small>Exit Avg Price</small>
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
    "Exit Status": orderManagementColVis["Exit Status"] && (
      <th key="exitStatus">
        <div>
          <small>Exit Status</small>
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
    Target: orderManagementColVis["Target"] && (
      <th key="target">
        <div>
          <small>Target</small>
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
    SL: orderManagementColVis["SL"] && (
      <th key="sl">
        <div>
          <small>SL</small>
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
    "Break Even": orderManagementColVis["Break Even"] && (
      <th key="breakEven">
        <div>
          <small>Break Even</small>
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
    "Signal Source": orderManagementColVis["Signal Source"] && (
      <th key="signalSource">
        <div>
          <small>Signal Source</small>
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
    Strategy: orderManagementColVis["Strategy"] && (
      <th key="strategy">
        <div>
          <small>strategy</small>
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
    "Signal Status": orderManagementColVis["Signal Status"] && (
      <th key="signalStatus">
        <div>
          <small>Signal Status</small>
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
    "Order Failed": orderManagementColVis["Order Failed"] && (
      <th key="orderFailed">
        <div>
          <small>Order Failed</small>
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
    "User Alies": orderManagementColVis["User Alies"] && (
      <th key="userAlies">
        <div>
          <small>User Alies</small>
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
    Remarks: orderManagementColVis["Remarks"] && (
      <th key="remarks">
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
    "Manual Exit": orderManagementColVis["Manual Exit"] && (
      <th key="manualExit">
        <div>
          <small>Manual Exit</small>
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
  return (
    <div>
      <div className="dashboard-header">
        <MarketIndex />
        <RightNav />
      </div>
      <div className="main-section">


        <div className="middle-main-container">
          <div>
            <div className="add_collapse -mt-4">
              <div className="self-stretch my-auto w-[238px] flex items-center gap-1">
              <i class="bi bi-person-gear"></i>
                <span className="text-blue-600 font-bold">Order Management</span>{" "}
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
                  // height: "45px",
                }}
              >
                <tr>
                  {ordermanagementSeq.map((colName, index) => {
                    return (
                      <React.Fragment key={index}>
                        {orderManagementTH[colName]}
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {orderBook.map((order, index) => {
                  const orderManagementTD = {
                    Action: orderManagementColVis["Action"] && (
                      <td key="action">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User ID": orderManagementColVis["User ID"] && (
                      <td key="userID">
                        <input
                          value={order.clientId}
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Source Symbol": orderManagementColVis["Source Symbol"] && (
                      <td key="sourceSymbol">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Request ID": orderManagementColVis["Request ID"] && (
                      <td key="requestID">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: orderManagementColVis["Exchange"] && (
                      <td key="exchange">
                        <input
                          value={
                            order.exchange === 10
                              ? "NSE"
                              : order.exchange === 11
                                ? "MCX"
                                : order.exchange === 12
                                  ? "BSE"
                                  : ""
                          }
                          type="text"
                          style={{
                            pointerEvents: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Exchange Symbol": orderManagementColVis[
                      "Exchange Symbol"
                    ] && (
                        <td key="exchangeSymbol">
                          <input
                            type="text"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    LTP: orderManagementColVis["LTP"] && (
                      <td key="ltp">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "P&L": orderManagementColVis["P&L"] && (
                      <td key="pl">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Product: orderManagementColVis["Product"] && (
                      <td key="product">
                        <input
                          value={order.productType}
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Order Type": orderManagementColVis[
                      "Entry Order Type"
                    ] && (
                        <td key="entryOrderType">
                          <input
                            type="text"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "Entry Order ID": orderManagementColVis[
                      "Entry Order ID"
                    ] && (
                        <td key="entryOrderID">
                          <input
                            type="number"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "Entry Time": orderManagementColVis["Entry Time"] && (
                      <td key="entryTime">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Txn": orderManagementColVis["Entry Txn"] && (
                      <td key="entryTxn">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Qty": orderManagementColVis["Entry Qty"] && (
                      <td key="entryQty">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Filled Qty": orderManagementColVis[
                      "Entry Filled Qty"
                    ] && (
                        <td key="entryFilledQty">
                          <input
                            type="number"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "Entry Exchange Time": orderManagementColVis[
                      "Entry Exchange Time"
                    ] && (
                        <td key="entryExchangeTime">
                          <input
                            type="text"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "LTP#1": orderManagementColVis["LTP#1"] && (
                      <td key="ltp1">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "LTP#2": orderManagementColVis["LTP#2"] && (
                      <td key="ltp2">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Avg Price": orderManagementColVis[
                      "Entry Avg Price"
                    ] && (
                        <td key="entryAvgPrice">
                          <input
                            type="number"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "LTP#3": orderManagementColVis["LTP#3"] && (
                      <td key="ltp3">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Entry Status": orderManagementColVis["Entry Status"] && (
                      <td key="entryStatus">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Order ID": orderManagementColVis["Exit Order ID"] && (
                      <td key="exitOrderID">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Time": orderManagementColVis["Exit Time"] && (
                      <td key="exitTime">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Txn": orderManagementColVis["Exit Txn"] && (
                      <td key="exitTxn">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Qty": orderManagementColVis["Exit Qty"] && (
                      <td key="exitQty">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Filled Qty": orderManagementColVis[
                      "Exit Filled Qty"
                    ] && (
                        <td key="exitFilledQty">
                          <input
                            type="number"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "LTP#4": orderManagementColVis["LTP#4"] && (
                      <td key="ltp4">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exit Exchange Time": orderManagementColVis[
                      "Exit Exchange Time"
                    ] && (
                        <td key="exitExchangeTime">
                          <input
                            type="text"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "Exit Avg Price": orderManagementColVis[
                      "Exit Avg Price"
                    ] && (
                        <td key="exitAvgPrice">
                          <input
                            type="number"
                            style={{ pointerEvents: "none", padding: "6px" }}
                          />
                        </td>
                      ),
                    "Exit Status": orderManagementColVis["Exit Status"] && (
                      <td key="exitStatus">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Target: orderManagementColVis["Target"] && (
                      <td key="target">
                        <input
                          type="number"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    SL: orderManagementColVis["SL"] && (
                      <td key="sl">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Break Even": orderManagementColVis["Break Even"] && (
                      <td key="breakEven">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Signal Source": orderManagementColVis["Signal Source"] && (
                      <td key="signalSource">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Strategy: orderManagementColVis["Strategy"] && (
                      <td key="strategy">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Signal Status": orderManagementColVis["Signal Status"] && (
                      <td key="signalStatus">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Order Failed": orderManagementColVis["Order Failed"] && (
                      <td key="orderFailed">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User Alies": orderManagementColVis["User Alies"] && (
                      <td key="userAlies">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Remarks: orderManagementColVis["Remarks"] && (
                      <td key="remarks">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Manual Exit": orderManagementColVis["Manual Exit"] && (
                      <td key="manualExit">
                        <input
                          type="text"
                          style={{ pointerEvents: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr
                      key={index}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {ordermanagementSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {orderManagementTD[colName]}
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
        {/* <RightNav /> */}
      </div>
    </div>
  );
}

export default OrderManagement;
