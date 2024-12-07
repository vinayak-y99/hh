
import React, { useState, useRef, memo, useEffect } from "react";
import MarketIndex from "../components/MarketIndex";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSelector } from "react-redux";
import { ErrorContainer } from "../components/ErrorConsole";
import { FaPlus } from "react-icons/fa";
import RightNav from "../components/RightNav";

function Equity() {
  const [msgs, setMsgs] = useState([]);
  const errorContainerRef = useRef(null);
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [columnHideDropDown, setcolumnHideDropDown] = useState(false);

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
                <i className="bi bi-chess"></i>

                <span className="text-blue-600 font-bold">Symbol Trading</span>{" "}
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
                  // onClick={addNewRow}
                  className="flex overflow-hidden gap-2 justify-center items-center px-3 py-2.5 text-sm font-semibold leading-none text-white whitespace-nowrap bg-blue-700 rounded-md mr-2"
                  style={{ zIndex: "0" }}
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


          <ErrorContainer ref={errorContainerRef} />
        </div>

      </div>
    </div>
  );
}

export default Equity;
