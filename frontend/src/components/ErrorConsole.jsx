/* eslint-disable react/display-name */
import React, {
  useState,
  useRef,
  memo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
// Error Container
// import "./ErrorConsole.css";
import "../styles.css";
import allLogs from "../assets/ErrorContainer/allLogs.png";
import attention from "../assets/ErrorContainer/attention.png";
import clearLogs from "../assets/ErrorContainer/clearLogs.png";
import copyAll from "../assets/ErrorContainer/copyAll.png";
import error from "../assets/ErrorContainer/error.png";
import exportErrorImg from "../assets/ErrorContainer/export.png";
import message from "../assets/ErrorContainer/message.png";
import trading from "../assets/ErrorContainer/trading.png";
import warning from "../assets/ErrorContainer/warning.png";
import { useDispatch, useSelector } from "react-redux";
import { setCollapse } from "../store/slices/collapse.js";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close'; // Make sure to import the CloseIcon
// ---
import filterIcon from "../assets/newFilter.png";
import filterUp from "../assets/newFilter2.png";
import { IoIosPeople } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

import Modal from "react-modal";

export const ErrorContainer = forwardRef(({ msgs }, ref) => {
  const dispatch = useDispatch();
  const { collapsed, height } = useSelector((state) => state.collapseReducer);
  const containerRef = useRef(null);
  // const [tabHeight, setTabHeight] = useState("70vh");
  // const tableRef = useRef()

  const [resizing, setResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const messages = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);

  const [count, setcount] = useState({
    attentions: 0,
    errors: 0,
    warnings: 0,
    messages: 0,
    tradings: 0,
  });

  // useEffect(() => {
  //   console.log("count", count)
  // }, [count])

  useEffect(() => {
    setcount({
      attentions: messages.filter((msg) => msg.logType === "ATTENTION").length,
      errors: messages.filter((msg) => msg.logType === "ERROR").length,
      warnings: messages.filter((msg) => msg.logType === "WARNING").length,
      messages: messages.filter((msg) => msg.logType === "MESSAGE").length,
      tradings: messages.filter((msg) => msg.logType === "TRADING").length,
    });

    if (containerRef.current.style.overflow !== "hidden") {
      const scrollTimeout = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages]);

  const [displayType, setdisplayType] = useState("logs");

  const { height: errorContainerHeight } = useSelector(
    (state) => state.collapseReducer,
  );

  useEffect(() => {
    containerRef.current.style.height = collapsed ? "75px" : `${height}px`;
    containerRef.current.style.overflow =
      messages.length > Math.floor((errorContainerHeight - 40 - 35) / 25) - 1
        ? "auto"
        : "hidden";
  }, []);

  useImperativeHandle(ref, () => ({
    getCollapsed() {
      return collapsed;
    },
    toggleCollapse() {
      const errorContainerHeight = collapsed ? "310px" : "75px";
      const errorContainerOverflow = collapsed ? "hidden" : "hidden";
      // setTabHeight(tabHeight);
      document.querySelector(".error-container").style.height =
        errorContainerHeight;
      document.querySelector(".error-container").style.overflow =
        errorContainerOverflow;
      dispatch(
        setCollapse({
          height: collapsed ? 310 : 75,
          collapsed: !collapsed,
        }),
      );
      // return !collapsed
    },
  }));

  const handleMouseDown = (e) => {
    setResizing(true);
    setStartY(e.clientY);
    setStartHeight(containerRef.current.offsetHeight);
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const newHeight = startHeight - (e.clientY - startY);
      if (newHeight < 80) {
        dispatch(
          setCollapse({
            height: newHeight < 75 ? 75 : newHeight,
            collapsed: true,
          }),
        );
        // containerRef.current.style.overflow = 'hidden'
      }
      if (newHeight > 80) {
        dispatch(
          setCollapse({
            height: newHeight,
            collapsed: false,
          }),
        );
      }
      if (newHeight > 73 && newHeight < 350) {
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, resizing]);

  function copyTableToClipboard() {
    const table = messages;

    let tabularData =
      "Timestamp \t Logtype \t User \t Strategy \t Portfolio \t Message \t \n";
    let excelData =
      "Timestamp, Logtype, User, Strategy, Portfolio, Message, \n";

    table.forEach((row) => {
      const rowData = [];
      rowData.push(row["timestamp"] ? row["timestamp"] : "");
      rowData.push(row["logType"] ? row["logType"] : "");
      rowData.push(row["user"] ? row["user"] : "");
      rowData.push(row["strategy"] ? row["strategy"] : "");
      rowData.push(row["portfolio"] ? row["portfolio"] : "");
      rowData.push(row["msg"] ? row["msg"] : "");

      tabularData += rowData.join("\t") + "\n";
      excelData += rowData.join(", ") + "\n";
    });

    try {
      const textarea = document.createElement("textarea");
      textarea.value = tabularData;
      document.body.appendChild(textarea);

      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      // console.log('Table data copied to clipboard successfully');
    } catch (error) {
      console.error("Failed to copy table data to clipboard:", error);
    }
  }

  return (
    <div className="error-container" id="error-container" ref={containerRef}>
      <div style={{ position: "sticky", top: "0px", zIndex: "5" }}>
        <div
          id="draggable"
          style={{
            cursor: "row-resize",
            background: "#d8e1ff",
            width: "100%",
            height: "8px",
            borderRadius: "10px",
            position: "absolute",
            top: "-5px",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        ></div>
        <div className="buttons-container" style={{ paddingRight: "0" }}>
          <div style={{ paddingLeft: "15px" }} onClick={() => setdisplayType("logs")}>
            <NotificationsNoneIcon style={{ color: "#8ff5ab" }} />
            <span>All Logs</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "20px" }} onClick={() => setdisplayType("attentions")}>
            <WarningAmberIcon style={{ color: "#fc844b" }} />
            <span>{count.attentions} Attention</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "20px" }} onClick={() => setdisplayType("attentions")}>
            <WarningAmberIcon style={{ color: "#fe0000" }} />
            <span>{count.attentions} Attention</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "20px" }} onClick={() => setdisplayType("warnings")}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "20px", // Circle diameter
                height: "20px", // Circle diameter
                borderRadius: "50%", // Makes the div a circle
                backgroundColor: "#fc844b", // Circle color
                color: "#fff", // Icon color (white)
              }}
            >
              <CloseIcon style={{ color: "#fff" }} />
            </div>
            <span>{count.warnings} Warnings</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "20px" }} onClick={() => setdisplayType("messages")}>
            <NotificationsNoneIcon style={{ color: "#140466" }} />
            <span>{count.messages} Messages</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "30px" }} onClick={() => setdisplayType("tradings")}>
            <TrendingUpIcon style={{ color: "#5f5f61" }} />
            <span>{count.tradings} Trading</span>
          </div>

          <div
            onClick={() => {
              dispatch(
                setConsoleMsgs({
                  consoleMsgs: [],
                }),
              );
            }}
            style={{ marginLeft: "-15%", paddingRight: "20px" }}
          >
            <DeleteIcon style={{ color: "#8ff5ab" }} />
            <span>Clear Logs</span>
          </div>

          <div style={{ marginLeft: "-15%", paddingRight: "20px" }} onClick={copyTableToClipboard}>
            <ContentCopyIcon style={{ color: "#6a6ade" }} />
            <span>Copy All</span>
          </div>

          <div style={{ borderRight: "none", marginLeft: "-15%", paddingRight: "23px" }}>
            <FileDownloadIcon style={{ color: "#4747e7" }} />
            <span>Export</span>
          </div>

        </div>
      </div>
      <Console messages={msgs} displayType={displayType} />
    </div>
  );
});

const TableRowTr = memo(({ message }) => {
  return (
    <tr>
      <td>{message.timestamp}</td>
      <td>{message.logType}</td>
      <td>{message.user}</td>
      <td>{message.strategy}</td>
      <td>{message.portfolio}</td>
      <td style={{ borderRight: "none" }}>{message.msg}</td>
    </tr>
  );
});

const TableHead = memo(() => {
  return (
    <thead
      style={{
        position: "sticky",
        top: "40px",
      }}
    >
      <tr>
        <th style={{ width: "170px" }}>
          <div className="error-table-th">
            <small>Time stamp</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "1vw" }}>
            <small>Log Type</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>User</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>Strategy</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "3vw" }}>
            <small>Portfolio</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
        <th style={{ width: "40%", borderRight: "none" }}>
          <div className="error-table-th" style={{ paddingLeft: "6vw" }}>
            <small>Message</small>
            <i className="bi bi-caret-down-fill" style={{ fontSize: '10px' }}></i>

          </div>
        </th>
      </tr>
    </thead>
  );
});

const Console = memo(({ displayType }) => {
  const [msgList, setmsgList] = useState([]);

  const msgs = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);

  const [messages, setmessages] = useState(msgs);

  useEffect(() => {
    setmessages(msgs);
  }, [msgs]);

  useEffect(() => {
    if (displayType === "logs") {
      setmessages(msgs);
    } else if (displayType === "attentions") {
      let filteredMsgs = msgs.filter((msg) => msg.logType === "ATTENTION");
      setmessages(filteredMsgs);
    } else if (displayType === "warnings") {
      let filteredMsgs = msgs.filter((msg) => msg.logType === "WARNING");
      setmessages(filteredMsgs);
    } else if (displayType === "messages") {
      let filteredMsgs = msgs.filter((msg) => msg.logType === "MESSAGE");
      setmessages(filteredMsgs);
    } else if (displayType === "errors") {
      let filteredMsgs = msgs.filter((msg) => msg.logType === "ERROR");
      setmessages(filteredMsgs);
    } else if (displayType === "tradings") {
      let filteredMsgs = msgs.filter((msg) => msg.logType === "TRADING");
      setmessages(filteredMsgs);
    }
  }, [displayType]);

  let reversedMessages = [...messages].reverse();
  // const [reversedMessages, setreversedMessages] = useState( [...messages].reverse())

  const { height: errorContainerHeight } = useSelector(
    (state) => state.collapseReducer,
  );

  // useEffect(()=> {

  // }, [displayType])

  useEffect(() => {
    const parentElement = document.getElementById("error-container");
    if (parentElement) {
      const count = Math.floor((errorContainerHeight - 40 - 35) / 25);

      if (reversedMessages.length === 0) {
        parentElement.style.overflow = "hidden";
      }
      if (reversedMessages.length <= count) {
        const emptyRows = new Array(count - reversedMessages.length).fill({});
        if (emptyRows.length > 0) {
          parentElement.style.overflow = "hidden";
        }
        if (Math.floor(reversedMessages.length / 2) > emptyRows.length) {
          parentElement.style.overflow = "scroll";
        }
        reversedMessages = [...reversedMessages, ...emptyRows];
        setmsgList(reversedMessages);
      } else {
        parentElement.style.overflow = "auto";
        setmsgList(reversedMessages);
      }
    }
  }, [errorContainerHeight, messages]);
  // console.log(reversedMessages);

  return (
    // <div className="logs-console">
    <table className="error-table">
      <TableHead />
      <tbody>
        {msgList.map((message, index) => (
          <TableRowTr key={index} message={message} />
        ))}
      </tbody>
    </table>
    // </div>
  );
});
