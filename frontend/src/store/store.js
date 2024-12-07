import { configureStore } from "@reduxjs/toolkit";
import brokerReducer from "./slices/broker.js";
import authReducer from "./slices/auth.js";
import strategyReducer from "./slices/strategy.jsx";
import portfolioReducer from "./slices/portfolio.jsx";
import collapseReducer from "./slices/collapse.js";
import consoleMsgsReducer from "./slices/consoleMsg.js";
import allSeqReducer from "./slices/colSeq.js";
import allVisReducer from "./slices/colVis.js";
import expiryReducer from "./slices/expiries.js";
import placeOrderStartReducer from "./slices/placeOrder.js";
import orderBookReducer from "./slices/orderBook.jsx";
import positionReducer from "./slices/position.jsx";
import holdingReducer from "./slices/holding.js";
import executedPortfolioReducer from "./slices/executedPortfolios.js";
import masterChildAccountsReducer from "./slices/master_child.js";

export default configureStore({
  reducer: {
    collapseReducer,
    authReducer,
    brokerReducer,
    strategyReducer,
    portfolioReducer,
    consoleMsgsReducer,
    allSeqReducer,
    allVisReducer,
    expiryReducer,
    placeOrderStartReducer,
    orderBookReducer,
    positionReducer,
    holdingReducer,
    executedPortfolioReducer,
    masterChildAccountsReducer,
  },
});
