import React, { useRef, useEffect } from "react";
import "../views/F&O/AddPortfolio.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Timepic({ label, onTimeChange, disabled, value }) {
  const [Start_hour, setStartHour] = React.useState("00");
  const [Start_min, setStartMin] = React.useState("00");
  const [Start_sec, setStartSec] = React.useState("00");
  const [temp, setTemp] = React.useState(null);

  const newRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [hour, min, sec] = value.split(":");
      setStartHour(hour);
      setStartMin(min);
      setStartSec(sec);
    }
  }, [value]);

  const increment = (data) => {
    if (data === "hour") {
      setStartHour((prevHour) => {
        let newHour = parseInt(prevHour) + 1;
        if (newHour > 23) {
          newHour = 0;
        }
        return ("0" + newHour).slice(-2);
      });
    } else if (data === "min") {
      setStartMin((prevMin) => {
        let newMin = parseInt(prevMin) + 1;
        if (newMin > 59) {
          newMin = 0;
          setStartHour((prevHour) => {
            let newHour = parseInt(prevHour) + 1;
            if (newHour > 23) {
              newHour = 0;
            }
            return ("0" + newHour).slice(-2);
          });
        }
        return ("0" + newMin).slice(-2);
      });
    } else if (data === "sec") {
      setStartSec((prevSec) => {
        let newSec = parseInt(prevSec) + 1;
        if (newSec > 59) {
          newSec = 0;
          setStartMin((prevMin) => {
            let newMin = parseInt(prevMin) + 1;
            if (newMin > 59) {
              newMin = 0;
              setStartHour((prevHour) => {
                let newHour = parseInt(prevHour) + 1;
                if (newHour > 23) {
                  newHour = 0;
                }
                return ("0" + newHour).slice(-2);
              });
            }
            return ("0" + newMin).slice(-2);
          });
        }
        return ("0" + newSec).slice(-2);
      });
    }
  };

  const decrement = (data) => {
    if (data === "hour") {
      setStartHour((prevHour) => {
        let newHour = parseInt(prevHour) - 1;
        if (newHour < 0) {
          newHour = 23;
        }
        return ("0" + newHour).slice(-2);
      });
    } else if (data === "min") {
      setStartMin((prevMin) => {
        let newMin = parseInt(prevMin) - 1;
        if (newMin < 0) {
          newMin = 59;
          decrement("hour");
        }
        return ("0" + newMin).slice(-2);
      });
    } else if (data === "sec") {
      setStartSec((prevSec) => {
        let newSec = parseInt(prevSec) - 1;
        if (newSec < 0) {
          newSec = 59;
          decrement("min");
        }
        return ("0" + newSec).slice(-2);
      });
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (event.key === "ArrowUp") {
        increment(temp || "sec");
      } else if (event.key === "ArrowDown") {
        decrement(temp || "sec");
      }
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "hour") {
      setStartHour(
        ("0" + Math.min(Math.max(parseInt(value, 10), 0), 23)).slice(-2),
      );
    } else if (type === "min") {
      setStartMin(
        ("0" + Math.min(Math.max(parseInt(value, 10), 0), 59)).slice(-2),
      );
    } else if (type === "sec") {
      setStartSec(
        ("0" + Math.min(Math.max(parseInt(value, 10), 0), 59)).slice(-2),
      );
    }
  };

  const repeat = (action, data) => {
    if (action === "increment") {
      increment(data);
    } else if (action === "decrement") {
      decrement(data);
    }
    timeoutRef.current = setTimeout(() => repeat(action, data), 100);
  };

  const handleMouseDown = (action, data) => {
    repeat(action, data);
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(label, `${Start_hour}:${Start_min}:${Start_sec}`);
    }
  }, [Start_hour, Start_min, Start_sec]);

  const handleArrowClick = (direction) => {
    if (!temp) {
      direction === "up" ? increment("sec") : decrement("sec");
    } else {
      direction === "up" ? increment(temp) : decrement(temp);
    }
  };

  return (
    <div>
      <div className="app_box" ref={newRef}>
        <div className="Box-outer">
          <input
            type="number"
            className="clock_field"
            value={Start_hour}
            onChange={(e) => handleInputChange(e, "hour")}
            placeholder="HH"
            onSelect={() => setTemp("hour")}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <span className="colen-center">:</span>
          <input
            type="number"
            className="clock_field"
            value={Start_min}
            onChange={(e) => handleInputChange(e, "min")}
            placeholder="MM"
            onSelect={() => setTemp("min")}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <span className="colen-center">:</span>
          <input
            type="number"
            className="clock_field"
            value={Start_sec}
            onChange={(e) => handleInputChange(e, "sec")}
            placeholder="SS"
            onSelect={() => setTemp("sec")}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>
        <div className="arrow_button">
          <ArrowDropUpIcon
            className="top_arrow"
            onMouseDown={() =>
              !disabled && handleMouseDown("increment", temp || "sec")
            }
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              display: "block",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          />
          <ArrowDropDownIcon
            className="down_arrow"
            onMouseDown={() =>
              !disabled && handleMouseDown("decrement", temp || "sec")
            }
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              display: "block",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Timepic;
