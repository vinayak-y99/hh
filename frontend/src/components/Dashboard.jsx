import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RightNav from "./RightNav";


import MarketIndex from "./MarketIndex";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChessKnight, faPlay, faChartLine, faChartBar, faFolder,faTasks } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { color } from "framer-motion";

const userData = [
  { name: 'USERNAME1', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b95f22204c95e05ffdbfc464461eafbf352774f98208f0141f87bfbe593e38be?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
  { name: 'USERNAME2', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/551c134176e08fa0725c2525d54b60648dfc54e8ae8d5f7baaa75fb7acd3dc1f?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
  { name: 'USERNAME3', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/45b534be36c626625e18f38f3ac77af4e1a40c50c77487d28491e3cfdbf7ada9?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
  { name: 'USERNAME4', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b95f22204c95e05ffdbfc464461eafbf352774f98208f0141f87bfbe593e38be?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
  { name: 'USERNAME5', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/59c1b8a5847ce398d14aaf68d84fa7a5f86ffb0d97fe8dc2c1f89975a7a06928?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
  { name: 'USERNAME6', avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7c8b76d67dd4374e18e75106327034c816c2cf84cc41d09def2ee1a4ae50d593?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d', btcLoss: 0.091, btcGain: 0.091 },
];
const strategyData = [
  {
    name: 'BANKNIFTY001',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.091,
    btcGain: 0.091,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
  {
    name: 'NIFTY002',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.075,
    btcGain: 0.080,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
  {
    name: 'BANKNIFTY003',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.120,
    btcGain: 0.100,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
  {
    name: 'NIFTY004',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.040,
    btcGain: 0.060,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
  {
    name: 'BANKNIFTY005',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.050,
    btcGain: 0.070,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
  {
    name: 'BANKNIFTY006',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0f30360fd2a92513dc0dffff6bfbe2a17d669243079d1c2d40f1ae09729d6f70?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
    btcLoss: 0.050,
    btcGain: 0.070,
    statusIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/908ce8cb0edb2eaafeb938fb69da54565ae7c2739e28684734b5ece1571ea29e?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d',
  },
 
];

const symbolData = [
  { name: 'BANKNIFTY001' },
  { name: 'NIFTY002' },
  { name: 'FINNIFT0001' },
  { name: 'BANKNIFTY002' },
  { name: 'NIFTY002' },
  { name: 'FINNIFT0002' },
];

const foData = [
  { name: 'BANKNIFTY001' },
  { name: 'NIFTY001' },
  { name: 'BANKNIFTY001' },
  { name: 'FINNIFT0001' },
  { name: 'BANKNIFTY001' },
  { name: 'BANKNIFTY001' },
];

const barData = [
  { height: 70, color: "bg-slate-900" },
  { height: 87, color: "bg-cyan-900" },
  { height: 37, color: "bg-cyan-700" },
  { height: 87, color: "bg-yellow-400" },
  { height: 57, color: "bg-sky-400" },
  { height: 38, color: "bg-blue-400" },
  { height: 87, color: "bg-sky-300" },
  { height: 87, color: "bg-red-500" },
  { height: 87, color: "bg-blue-100" },
  { height: 57, color: "bg-green-600" },
  { height: 45, color: "bg-green-500" },
  { height: 74, color: "bg-green-400" },
  { height: 74, color: "bg-green-300" },
  { height: 45, color: "bg-blue-600" }
];

const holdingsDatasets = [
  { color: "bg-emerald-400", label: "Login" },
  { color: "bg-purple-400", label: "Exchange" },
  { color: "bg-orange-400", label: "Stop" },
  { color: "bg-pink-400", label: "Current Value" },
  { color: "bg-sky-400", label: "Avg Price" },
  { color: "bg-amber-400", label: "Collateral Qty" }
];


function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const UserProfileCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faUser} className="w-6" />
            <div>
              <span className="text-blue-700" style={{color:'blue'}}>User Profile</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/UserProfiles')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>
      <div className="user-list">
        {userData.slice(0, 8).map((user, index) => (
          <div key={index} className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="rounded-full w-8" />
            <span>{user.name}</span>
          </div>
           
    
          <div className="flex gap-4 items-center text-xs font-medium leading-none">
            {/* BTC Loss Section */}
            <div className="flex flex-col items-center text-red-400">
              <span>-{user.btcLoss} BTC</span>
              <div className="w-4 h-[7px] bg-red-400 rounded-sm mt-1"></div>
            </div>
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>
            {/* BTC Gain Section */}
            <div className="flex flex-col items-center text-green-600">
              <span>+{user.btcGain} BTC</span>
              <div className="w-8 h-[7px] bg-green-600 rounded-sm mt-1"></div>
            </div>
            <div className="flex gap-2">
                <i className="bi bi-stop-circle" style={{ color: 'red' }}></i>
                <i className="bi bi-download" style={{ transform: 'rotate(270deg)' }}></i>
                <i className="bi bi-trash3" style={{ color: "red" }}></i>
              </div>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );

  const StrategiesCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faChessKnight} className="w-6" />
            <div>
              <span className="text-blue-700">Strategies</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/Strategies')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>
      <div className="strategy-list overflow-auto max-h-[242px]">
        {strategyData.map((strategy, index) => (
          <div key={index} className="flex justify-between items-center p-2 border-b">
          {/* Strategy Name */}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChessKnight} className="text-black" />
            <span className="text-cyan-700 font-bold">{strategy.name}</span>
          </div>
        
          {/* BTC Loss and Gain Section */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 items-center text-xs font-medium">
              {/* BTC Loss */}
              <div className="flex flex-col items-center text-red-400">
                <span>-{strategy.btcLoss} BTC</span>
                <div className="w-4 h-[7px] bg-red-400 rounded-sm mt-1"></div>
              </div>
              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>
              {/* BTC Gain */}
              <div className="flex flex-col items-center text-green-600">
                <span>+{strategy.btcGain} BTC</span>
                <div className="w-8 h-[7px] bg-green-600 rounded-sm mt-1"></div>
              </div>
            </div>
        
            {/* Action Icons */}
            <div className="flex gap-2">
              <i className="bi bi-stop-circle text-red-500"></i>
              <i className="bi bi-download transform rotate-90"></i>
              <i className="bi bi-trash3 text-red-500"></i>
            </div>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );

  const EquityTradingCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faChartLine} className="w-6" />
            <div className="text-blue-700">Symbol Trading</div>
          </div>
          <button
            onClick={() => navigate('/Equity')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>

      <div className="symbol-list overflow-auto max-h-[242px]">
        {symbolData.map((symbol, index) => (
          <div key={index} className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-gray-600 w-4" />
              <span className="text-sm font-bold text-cyan-700">{symbol.name}</span>
            </div>
            <div className="flex gap-2">
  {/* Red Circle Icon */}
  
  <i 
  className="bi bi-pen cursor-pointer" 
  style={{ fontSize: '18px', color: 'black',marginTop: '7px' }}
></i>
  <i
    className="bi bi-trash3 cursor-pointer"
    style={{ color: "red", fontSize: '20px',marginTop: '6px' }}
  ></i>
</div>
          </div>
        ))}
      </div>
    </div>
  );

  const FNOTradingCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <i className="bi bi-coin text-2xl"></i>
            <div>
              <span className="text-blue-700">F&O Trading</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/F&O/Portfolio')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>

      <div className="fno-list overflow-auto max-h-[242px]">
        {foData.map((item, index) => (
          <div key={index} className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <i className="bi bi-currency-bitcoin text-xl"></i>
              <span className="text-sm font-bold text-cyan-700">{item.name}</span>
            </div>
            <div className="flex gap-3 items-center">
              <i className="bi bi-play cursor-pointer" style={{ fontSize: '24px' }}></i>
              <i className="bi bi-pen cursor-pointer" style={{ fontSize: '16px' }}></i>
              <i className="bi bi-trash3 cursor-pointer" style={{ color: 'red', fontSize: '16px' }}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PositionsCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faChartBar} className="w-6" />
            <div>
              <span className="text-blue-700">Positions</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/Positions')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>
  
      <div className="flex flex-col items-center p-4 h-[300px]">
        <div className="flex gap-5 items-end mt-4 h-[200px]">
          {barData.map((bar, index) => (
            <div
              key={index}
              className={`flex shrink-0 w-1.5 ${bar.color} rounded-sm`}
              style={{ height: `${bar.height *0.7}px` }}
            />
          ))}
        </div>
  
        <div className="border-t border-zinc-400 w-full my-4" />
  
        <div className="flex flex-wrap gap-4 justify-center">
          {holdingsDatasets.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-xs text-neutral-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HoldingsCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faFolder} className="w-6" />
            <div>
              <span className="text-blue-700">Holdings</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/Holdings')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>
  
      <div className="flex p-4">
        <div className="flex flex-col gap-2">
          {holdingsDatasets.map((dataset, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${dataset.color} rounded-full`}></div>
              <span className="text-sm text-zinc-700">{dataset.label}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
        <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/675e76754d902ec4bbe94e2ab894b1d8031fb119ba8a22a9d2c223c4ef7bc21d?placeholderIfAbsent=true&apiKey=c20b4089c62f47e3b73547d56c34685d" 
            alt=""
            className="object-contain  shrink-0 aspect-square basis-0 w-fit" 
          />
        </div>
      </div>
    </div>
  );
  





  const OrderFlowCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faPlay} className="w-6" />
            <div>
              <span className="text-blue-700">Order Flow</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/OrderFlow')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center p-4 h-[304px] justify-between">
      <div className="text-2xl font-bold text-zinc-800 flex-1 flex items-center justify-center">
  <div className="relative flex items-center justify-center w-[200px] h-[200px]">
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="#e5e7eb" 
        strokeWidth="10"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="10"
        strokeDasharray={`${50 * 2.83} ${100 * 2.83}`}
        strokeLinecap="round"
      />
    </svg>
    <span className="absolute text-3xl font-bold">50%</span>
  </div>
</div>

        <div className="flex gap-4 items-center">
          <div className="flex gap-1.5 items-center">
            <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-neutral-500">User ID</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-3.5 h-3.5 bg-green-600 rounded-full"></div>
            <span className="text-xs text-neutral-500">Login</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-3.5 h-3.5 bg-red-300 rounded-full"></div>
            <span className="text-xs text-neutral-500">Stop</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
            <span className="text-xs text-neutral-500">Net Qty</span>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderManagementCard = () => (
    <div className="flex flex-col w-full bg-white border border-gray-200">
      <div className="flex flex-col justify-center py-2.5 w-full">
        <div className="flex gap-10 justify-between items-center w-full px-4">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTasks} className="w-6" />
            <div>
              <span className="text-blue-700">Order Management</span>
              <span className="font-extrabold"> - (</span>
              <span className="font-extrabold text-green-600"> 0 </span>
              <span className="font-extrabold">/</span>
              <span className="font-extrabold text-rose-500"> 1 </span>
              <span className="font-extrabold">)</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/OrderManagement')}
            className="text-xl"
          >
            <i className="bi bi-box-arrow-up-right" style={{ color: '#3d69ea' }}></i>
          </button>
        </div>
      </div>
  
      <div className="flex flex-col items-center p-4 h-[305px]">
        <div className="flex gap-5 items-end h-[200px]">
          {[
            { height: 68, color: "bg-yellow-400" },
            { height: 116, color: "bg-green-600" },
            { height: 41, color: "bg-red-300" },
            { height: 140, color: "bg-blue-600" },
            { height: 101, color: "bg-orange-400" },
            { height: 101, color: "bg-sky-400" },
            { height: 101, color: "bg-emerald-400" },
            { height: 79, color: "bg-purple-500" },
            { height: 101, color: "bg-violet-600" },
            { height: 55, color: "bg-red-500" }
          ].map((bar, index) => (
            <div
              key={index}
              className={`w-4 ${bar.color} rounded-xl`}
              style={{ height: `${bar.height * 0.6}px` }}
            />
          ))}
        </div>
  
        <div className="border-t border-zinc-400 w-full my-4" />
  
        <div className="grid grid-cols-5 gap-3 text-xs text-neutral-500">
          {[
            { color: "bg-yellow-400", label: "User ID" },
            { color: "bg-green-600", label: "Login" },
            { color: "bg-red-500", label: "Stop" },
            { color: "bg-blue-600", label: "User ID" },
            { color: "bg-sky-400", label: "Net Qty" },
            { color: "bg-emerald-400", label: "Request ID" },
            { color: "bg-purple-500", label: "Exchange" },
            { color: "bg-red-300", label: "Source Symbol" },
            { color: "bg-violet-600", label: "LTP" },
            { color: "bg-orange-400", label: "Status" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 ${item.color} rounded-full`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const cards = [
    {title: "User Profiles",path: "/UserProfiles",component: UserProfileCard},
    {title: "Strategies",path: "/Strategies",component: StrategiesCard},
    { title: "Equity Trading", path: "/Equity", component: EquityTradingCard },
    { title: "F&O Trading", path: "/F&O/Portfolio", component: FNOTradingCard },
    // { title: "Master Child", path: "/Master_accounts" },
    { title: "Order Flow", path: "/OrderFlow", component: OrderFlowCard },
    { title: "Positions", path: "/Positions", component: PositionsCard },
    { title: "Holdings", path: "/Holdings",component: HoldingsCard},
    
    { title: "Order Management", path: "/OrderManagement",component: OrderManagementCard   },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <MarketIndex />
        <RightNav/>
      </div>
      <div className="dashboard-grid -mt-9">
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card">
            {card.component ? (
              <card.component />
            ) : (
              <div 
                className="card-content"
                onClick={() => navigate(card.path)}
              >
                <h3 className="card-title">{card.title}</h3>
                <div className="card-arrow">→</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default Dashboard;


