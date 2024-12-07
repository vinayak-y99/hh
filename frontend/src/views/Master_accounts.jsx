import React, { useState, useRef, useEffect, useCallback } from "react";
import MarketIndex from "../components/MarketIndex";

import RightNav from "../components/RightNav";
import { ErrorContainer } from "../components/ErrorConsole";
import { TopNav } from "../components/TopNav";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import Edit from "../assets/edit.png";
import Log from "../assets/log.png";
import MasterChild from "./Master_child";
import _ from "lodash";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setmasterChildAccounts } from "../store/slices/master_child";

const initialFormData = {
  transactiontype: "BUY",
  producttype: "INTRADAY",
  ordertype: "LIMIT",
  exchange: "NSE",
  symbol: "",
  quantity: "1",
  duration: "DAY",
  price: "0",
};

function MasterAccount() {
  const [ msgs, setMsgs ] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  const dispatch = useDispatch();
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
  const [ selectAll, setSelectAll ] = useState(false);
  const [ mode, setMode ] = useState("create");
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const errorContainerRef = useRef(null);

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ selectedMasterAccount, setSelectedMasterAccount ] = useState(null);
  const [ isTradeModalOpen, setIsTradeModalOpen ] = useState(false);
  const [ selectedExchange, setSelectedExchange ] = useState("NSE");
  const [ selectedAccountId, setSelectedAccountId ] = useState("");
  const [ lotSize, setLotSize ] = useState("1");
  const [ quantityError, setQuantityError ] = useState("");

  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  const cookies = new Cookies();

  const containerStyle = {
    flexDirection: "column",
    alignItems: "center",
    // overflowX: "auto",

    backgroundColor: "#f4f6f8",
  };
  const containerStyleQty = {
    position: "relative",
    display: "inline-block",
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
  const buttonStyleDelete = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    padding: "10px 18px",
  };
  const buttonStyleTrade = {
    ...buttonStyle,
    backgroundColor: "#FF9800",
    marginLeft: "5px",
  };
  const buttonStyleSqOff = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    marginLeft: "5px",
  };
  const buttonsContainerStyle = { display: "flex" };
  const tableStyle = { borderCollapse: "collapse" };
  const thStyle = {
    backgroundColor: "#d8e1ff",
    color: "black",
    padding: "10px",
    textAlign: "center",
    position: "sticky",
    top: "0px",
  };
  const thStyleM = {
    backgroundColor: "#41729f",
    color: "white",
    padding: "7px",
    textAlign: "center",
    position: "sticky",
    top: "0px",
    // width: "70px",
  };

  const tdStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    textAlign: "center",
  };
  const onStyle = { color: "green", fontWeight: "bold" };
  const offStyle = { color: "red", fontWeight: "bold" };

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
    width: "341px",
    textAlign: "center",
  };
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: " 0px 20px 20px ",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    borderRadius: "5px",
    width: "770px",
    textAlign: "center",
  };
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  };
  const closeButtonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };
  const cancelButtonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "40px",
  };
  const DeleteButtonStyle = {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };
  const yesButtonStyle = {
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    backgroundColor: "#4CAF50",
  };
  const noButtonStyle = {
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "40px",
    backgroundColor: "#f44336",
  };

  const handleSelectAll = () => {
    const allChecked = checkboxes.every((checkbox) => checkbox);
    const updatedCheckboxes = rows.map(() => !allChecked);
    setCheckboxes(updatedCheckboxes);
    setSelectAll(!allChecked);
  };
  const [ checkboxes, setCheckboxes ] = useState(rows.map(() => false));

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [ ...checkboxes ];
    updatedCheckboxes[ index ] = !updatedCheckboxes[ index ];
    setCheckboxes(updatedCheckboxes);
    setSelectAll(updatedCheckboxes.every((checkbox) => checkbox));
  };

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ sqOffModal, setSqoffModal ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState("");

  const openModalDelete = () => {
    setDeleteModal(true);
  };
  const closeModalDelete = () => {
    setDeleteModal(false);
    setErrorMessage(false);
  };

  const openModalSqOff = () => {
    setSqoffModal(true);
  };

  const closeModalSqOff = () => {
    setSqoffModal(false);
    setErrorMessage(false);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleDeleteSelected = async () => {
    const selectedItems = data.filter((row, index) => checkboxes[ index ]);
    if (selectedItems.length === 0) {
      setErrorMessage("Please select at least one account to delete.");
      return;
    }
    try {
      const response = await Promise.all(
        selectedItems.map(async (item) => {
          const deleteResponse = await fetch(
            `${import.meta.env.SERVER_HOST}/delete_master_child_accounts/${mainUser}/${item.broker_user_id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          //console.log("deleteResponse", deleteResponse);
          return deleteResponse;
        }),
      );

      const allDeleted = response.every((res) => res.ok);
      if (allDeleted) {
        //console.log("Selected items deleted successfully");
        setDeleteModal(false);

        // Filter out the deleted items from the current state
        const remainingData = data.filter(
          (row) =>
            !selectedItems.some(
              (item) => item.broker_user_id === row.broker_user_id,
            ),
        );
        dispatch(
          setmasterChildAccounts({
            masterChildAccounts: remainingData,
          }),
        );

        // Update the local state
      } else {
        console.error("Some items failed to delete");
      }
    } catch (error) {
      console.error("Error occurred while deleting selected items:", error);
    }
  };

  const [ formData, setFormData ] = useState(initialFormData);

  const resetButton = (event) => {
    event.preventDefault();
    setFormData(initialFormData);
    setSelectedAccountId("");
  };

  const { masterChildAccounts: masterChildAccount } = useSelector(
    (state) => state.masterChildAccountsReducer,
  );
  const [ data, setData ] = useState(masterChildAccount);
  //console.log("data", data);

  useEffect(() => {
    setData(masterChildAccount);
  }, [ masterChildAccount ]);

  useEffect(() => {
    PLforMaster();
  }, [ data ]);
  const openModal = () => {
    setIsModalOpen(true);
    setData(masterChildAccount);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setData(masterChildAccount);
  };
  const [ selectedChildAccount, setSelectedChildAccount ] = useState([]);
  const [ validationError, setValidationError ] = useState(false);

  const handleSelectChildAccounts = () => {
    if (selectedMasterAccount) {
      const remainingAccounts = masterChildAccounts.filter(
        (account) => account.userId !== selectedMasterAccount.userId,
      );
      setSelectedChildAccount(remainingAccounts);
    } else {
      setSelectedChildAccount([]);
    }
    setMode("create");
    setPopupOpen(true);
    setIsModalOpen(false);
  };

  const mainUser = cookies.get("USERNAME");
  const [ masterChildAccounts, setMasterChildAccounts ] = useState([]);
  const [ symbols, setsymbols ] = useState([]);
  const [ pnlData, setPnlData ] = useState([]);

  const { positions: positions } = useSelector(
    (state) => state.positionReducer,
  );

  const { executedPortfolios: executedPortfolio } = useSelector(
    (state) => state.executedPortfolioReducer,
  );

  const PLforMaster = async () => {
    if (!isValidPositions(positions)) {
      //console.log("Positions data is not valid or empty.");
      return;
    }

    //console.log(positions, "positions");
    //console.log(data, "data");

    if (!data) return;
    const dataNew = {
      master_account_id_data: data?.map((account) => {
        const child_broker_user_ids = account.child_accounts.map(
          (item) => item.broker_user_id,
        );
        const child_brokers = account.child_accounts.map((item) => item.broker);
        const all_broker_user_ids = [
          account.broker_user_id,
          ...child_broker_user_ids,
        ];
        const all_brokers = [ account.broker, ...child_brokers ];

        return {
          master_account_id: account.id.toString(),
          broker_names: all_brokers,
          broker_user_ids: all_broker_user_ids,
        };
      }),
    };

    //console.log(dataNew, "maheshs");

    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/fetching_master_child_positions/${mainUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataNew),
        },
      );
      //console.log(response, "response");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      //console.log("mahesh", response);
      const responseData = await response.json();

      const combinedData = combineResponseDataWithPositions(
        responseData,
        positions,
      );

      const { pnlResults } = extractPnL(combinedData);
      //console.log(pnlResults, "pnlResults");
      setPnlData(pnlResults);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const isValidPositions = (positions) => {
    if (!positions || positions.length === 0) return false;

    return positions.some((position) => {
      return Object.values(position).some((value) => value !== "");
    });
  };

  const combineResponseDataWithPositions = (responseData, positions) => {
    const combinedData = {};

    for (const masterId in responseData) {
      if (responseData.hasOwnProperty(masterId)) {
        const accountsArray = responseData[ masterId ];

        combinedData[ masterId ] = accountsArray
          .flatMap((account) => {
            const brokerUserId = Object.keys(account)[ 0 ];
            const accountDataArray = account[ brokerUserId ];
            //console.log(accountDataArray, "accountDataArray");
            const brokerDetails = rows.filter((broker) =>
              brokerUserId.includes(broker.userId),
            );
            const brokerName = brokerDetails.filter(
              (broker) => broker.userId === brokerUserId,
            )[ 0 ][ "broker" ];

            return accountDataArray.map((accountData) => {
              let matchingPosition;
              let posPL = 0;
              //console.log(positions, brokerUserId, accountData);

              if (brokerName === "flattrade") {
                matchingPosition = positions.find(
                  (position) =>
                    position[ "User ID" ] === brokerUserId &&
                    position[ "Symbol" ] === accountData.tsym &&
                    position[ "Buy Qty" ] === accountData.daybuyqty &&
                    position[ "Buy Avg Price" ] === accountData.daybuyavgprc,
                );
              } else if (brokerName === "angelone") {
                matchingPosition = positions.find(
                  (position) =>
                    position[ "User ID" ] === brokerUserId &&
                    position[ "Symbol" ] === accountData.tradingsymbol &&
                    position[ "Buy Qty" ] === accountData.buyqty &&
                    position[ "Buy Avg Price" ] === accountData.buyavgprice,
                );
              } else if (brokerName === "fyers") {
                matchingPosition = positions.find(
                  (position) =>
                    position[ "User ID" ] === brokerUserId &&
                    position[ "Symbol" ] === accountData.symbol &&
                    position[ "Buy Qty" ] === accountData.buyQty &&
                    position[ "Buy Avg Price" ] === accountData.buyAvg,
                );
              }

              //console.log(matchingPosition, "executedPortfolio");

              const ltp = matchingPosition
                ? matchingPosition[ "LTP" ]
                : accountData.lp;
              const execPorts = executedPortfolio.filter((execPort) => {
                if (execPort.master_account_id) {
                  return execPort.trading_symbol === accountData.tsym;
                } else {
                  return;
                }
              });
              //// console.log("execPorts", execPorts);

              execPorts.forEach((execPort) => {
                if (
                  execPort.sell_price !== 0 &&
                  execPort.sell_price !== null &&
                  execPort.sell_price !== undefined
                ) {
                  posPL +=
                    (Number(execPort.sell_price) - Number(execPort.buy_price)) *
                    Number(execPort.netqty);
                } else {
                  posPL +=
                    (Number(ltp) - Number(execPort.buy_price)) *
                    Number(execPort.netqty);
                }
              });

              const formattedPL = posPL
                .toFixed(2)
                .replace(/^0+/g, "")
                .replace(/^$/, "0");
              //// console.log(formattedPL, posPL)
              //console.log(ltp, "ltp");

              return {
                ...accountData,
                ltp: ltp,
                pnl: formattedPL,
              };
            });
          })
          .flat();
      }
    }

    return combinedData;
  };

  const extractPnL = (combinedData) => {
    const pnlResults = [];
    for (const masterId in combinedData) {
      const accounts = combinedData[ masterId ];
      accounts.forEach((account) => {
        pnlResults.push({
          masterId,
          brokerUserId: account.uid,
          pnl: account.pnl,
          exchange: account.exch,
          symbol: account.tsym,
          netQty: account.netqty,
          ltp: account.ltp,
          buyqty: account.daybuyqty,
          buyamount: account.daybuyamt,
          sellqty: account.daysellqty,
          sellamount: account.daysellamt,
          producttype: account.s_prdt_ali,
        });
      });
    }
    //// console.log(pnlResults, "pnlResults")
    return { pnlResults };
  };

  const getPositionsForAccount = (brokerUserId) => {
    return pnlData.filter((position) => position.brokerUserId === brokerUserId);
  };

  const [ popupOpen, setPopupOpen ] = useState(false);
  const [ selectedItems, setSelectedItems ] = useState([]);
  const [ remainingAccounts, setRemainingAccounts ] = useState([]);

  const handleEdit = (selectedRow) => {
    const checkboxes = [];
    const selectedItems = data.filter((row, index) => checkboxes[ index ]);
    const remainingAccounts = masterChildAccounts.filter(
      (account) =>
        account.userId !==
        (selectedRow ? selectedRow.userId : selectedItems[ 0 ].userId),
    );

    setSelectedItems(selectedRow ? [ selectedRow ] : selectedItems);
    setRemainingAccounts(remainingAccounts);
    setPopupOpen(true);
    setMode("edit");
  };

  useEffect(() => {
    const filteredRows = rows
      .filter((row) => row.inputDisabled)
      .filter((row) => {
        return (
          !data?.some((account) =>
            account.child_accounts.some(
              (child) => child.broker_user_id === row.userId,
            ),
          ) && !data?.some((account) => account.broker_user_id === row.userId)
        );
      });
    setMasterChildAccounts(filteredRows);
    //// console.log(filteredRows, "filteredRows");
  }, [ rows, data ]);
  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const openTradeModal = () => {
    if (placeOrderStart) {
      setIsTradeModalOpen(true);
      getSymbols(selectedExchange);
    } else {
      handleMsg({
        msg: "To place an Order, Start the Trading.",
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
      });
    }
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
    setFormData(initialFormData);
    //// console.log(initialFormData, "initialFormData");
  };

  const [ showLotSize, setShowLotSize ] = useState(false);
  const handleExchangeChange = (e) => {
    const exchange = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      exchange: exchange,
      symbol: "",
    }));
    setSelectedExchange(exchange);
    getSymbols(exchange);
  };

  useEffect(() => {
    if (formData.exchange === "NFO" && formData.symbol) {
      updateLotSize(formData.symbol);
    } else {
      setShowLotSize(false);
    }
  }, [ formData.exchange, formData.symbol ]);
  const getSymbols = async (selectedExchange) => {
    const mappedUserIds = rows.filter((row) => row.inputDisabled);
    const angeloneUser = mappedUserIds.find((row) => row.broker === "angelone");
    const clientId = angeloneUser ? angeloneUser.userId : null;

    if (!clientId) {
      console.error("No Angelone broker found in the user data.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/angelone_symbols/${mainUser}/${clientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exchange: selectedExchange,
          }),
        },
      );
      //// console.log(response, "response");

      if (!response.ok) {
        const errorData = await response.json();
        //console.log(errorData, "errorDatas");
      } else {
        const responseData = await response.json();
        //console.log(responseData, "responseData");
        if (
          responseData.angelone_bse_symbols_data !== undefined &&
          Array.isArray(responseData.angelone_bse_symbols_data) &&
          responseData.angelone_bse_symbols_data.length > 0
        ) {
          setsymbols(responseData.angelone_bse_symbols_data);
        } else if (
          responseData.angelone_nse_symbols_data !== undefined &&
          Array.isArray(responseData.angelone_nse_symbols_data) &&
          responseData.angelone_nse_symbols_data.length > 0
        ) {
          setsymbols(responseData.angelone_nse_symbols_data);
        } else if (
          responseData.angelone_nfo_symbols_data !== undefined &&
          Array.isArray(responseData.angelone_nfo_symbols_data) &&
          responseData.angelone_nfo_symbols_data.length > 0
        ) {
          setsymbols(responseData.angelone_nfo_symbols_data);
        } else {
          setsymbols([]);
        }
      }
    } catch (error) {
      console.error(`Error occurred while calling  API:`, error.message);
    }
  };

  let lotSymbol = formData.symbol;
  let exchangeSy = formData.exchange;

  const updateLotSize = () => {
    if (exchangeSy === "NFO") {
      const upperCaseSymbol = lotSymbol.toUpperCase();
      if (upperCaseSymbol.startsWith("NIFTY")) {
        setLotSize(25);
        setShowLotSize(true);
      } else if (upperCaseSymbol.startsWith("BANKNIFTY")) {
        setLotSize(15);
        setShowLotSize(true);
      } else if (upperCaseSymbol.startsWith("FINNIFTY")) {
        setLotSize(40);
        setShowLotSize(true);
      } else {
        setLotSize(1);
        setShowLotSize(false);
      }
    } else {
      setShowLotSize(false);
    }
  };

  const handleAccountChange = (event) => {
    setSelectedAccountId(event.target.value);
    //console.log(event.target.value, "selectedAccountId");
  };
  const handleTradeSubmit = (e) => {
    e.preventDefault();

    const selectedAccount = data?.find(
      (account) => account?.broker_user_id === selectedAccountId,
    );
    //// console.log(data, "data")
    const childAccountselected = data.find((account) =>
      account.child_accounts.map(
        (acc) => acc.broker_user_id === selectedAccountId,
      ),
    );
    //// console.log(childAccountselected, "childAccountselected")
    const currentTime = new Date();
    const currentHour = String(currentTime.getHours()).padStart(2, "0");
    const currentMinute = String(currentTime.getMinutes()).padStart(2, "0");
    const currentSecond = String(currentTime.getSeconds()).padStart(2, "0");

    const currentFormattedTime = `${currentHour}:${currentMinute}:${currentSecond}`;
    const copyStartParts = selectedAccount?.copy_start_time
      ? selectedAccount.copy_start_time
      : childAccountselected.copy_start_time;
    const copyEndParts = selectedAccount?.copy_end_time
      ? selectedAccount.copy_end_time
      : childAccountselected.copy_end_time;

    //console.log(currentFormattedTime, copyStartParts, copyEndParts);

    if (
      (selectedAccount?.copy_placement &&
        currentFormattedTime > copyStartParts &&
        currentFormattedTime < copyEndParts) ||
      (childAccountselected?.copy_placement &&
        currentFormattedTime > copyStartParts &&
        currentFormattedTime < copyEndParts) ||
      (!selectedAccount?.copy_placement &&
        !childAccountselected?.copy_placement)
    ) {
      let masterAccounts = [];
      if (selectedAccount) {
        masterAccounts = [ selectedAccount.broker_user_id ];
      }

      let accounts = [ ...masterAccounts ];

      if (childAccountselected) {
        const childAccounts = childAccountselected.child_accounts.map(
          (account) => account.broker_user_id,
        );
        accounts = [ ...accounts, ...childAccounts ];
      }

      //console.log(accounts, "accounts");

      const loggedinAccounts = rows.filter((row) => row.inputDisabled);
      const userId = loggedinAccounts.map((row) => row.userId);
      //console.log(userId, "userId", loggedinAccounts);

      const missingAccounts = accounts.filter(
        (account) => !userId.includes(account),
      );
      //console.log("missingAccounts", missingAccounts);

      if (missingAccounts.length === 0) {
        if (formData.ordertype === "MARKET") {
          formData.price = "0";
          setFormData(formData);
        }

        const selectedAccountId = selectedAccount?.id
          ? selectedAccount.id
          : childAccountselected.id;
        const endpoint = selectedAccount
          ? `${import.meta.env.SERVER_HOST}/place_master_child_order/${mainUser}/${selectedAccountId}`
          : `${import.meta.env.SERVER_HOST}/place_master_child_order/${mainUser}/${selectedAccountId}?child_broker_user_id=${accounts}`;

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            //console.log("Raw Response:", response);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setFormData(initialFormData);

            const processResponse = (responses) => {
              responses.forEach((response) => {
                let message = "";

                if (!Array.isArray(response)) {
                  return;
                }

                if (Array.isArray(response[ 0 ])) {
                  const orderId = response[ 0 ][ 0 ];
                  const errorMessage = response[ 0 ][ 1 ];
                  message = `${orderId}: ${errorMessage}`;
                } else {
                  const orderId = response[ 0 ];
                  const errorMessage = response[ 1 ];
                  message = `${orderId}: ${errorMessage}`;
                }

                handleMsg({
                  msg: message,
                  logType: "MESSAGE",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: orderId,
                });
              });
            };

            const allResponses = [
              ...(data.master_order_responses || []),
              ...(data.child_order_responses || []),
            ];

            processResponse(allResponses);
          })

          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        const missingAccountsMessage = `Login to ${missingAccounts.join(", ")} to place an order in this account.`;
        handleMsg({
          msg: missingAccountsMessage,
          logType: "WARNING",
          timestamp: `${new Date().toLocaleString()}`,
          // user: mainUser,
        });
        console.error(missingAccountsMessage);
      }
    } else {
      const missingAccountsMessage = `Copy placement is only allowed between ${selectedAccount.copy_start_time} and ${selectedAccount.copy_end_time}.`;
      handleMsg({
        msg: missingAccountsMessage,
        logType: "WARNING",
        timestamp: `${new Date().toLocaleString()}`,
        user: `${selectedAccountId}`,
      });
      console.error(missingAccountsMessage);
      closeTradeModal();
    }
    closeTradeModal();
  };

  const SqOffSelected = async () => {
    const selectedItems = data.filter((row, index) => checkboxes[ index ]);

    if (selectedItems.length === 0) {
      setErrorMessage("Please select at least one account to Sqoff.");
      return;
    }
    try {
      const responses = await Promise.all(
        selectedItems.map(async (item) => {
          const ResponseSqoff = await fetch(
            `${import.meta.env.SERVER_HOST}/square_off_master_child/${mainUser}/${item.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          //console.log(ResponseSqoff, "ResponseSqoff");
          return { response: ResponseSqoff, userId: item.broker_user_id };
        }),
      );

      // Handle each response
      const allSuccessful = responses.every(({ response }) => response.ok);
      //console.log(allSuccessful, "allSuccessful");

      if (allSuccessful) {
        setSqoffModal(false);
        const messages = await Promise.all(
          responses.map(async ({ response, userId }) => {
            const SqoffResponse = await response.json();
            if (Array.isArray(SqoffResponse)) {
              // Handle array of objects
              SqoffResponse.forEach((responseObj) => {
                handleMsg({
                  msg: responseObj.message,
                  logType: "MESSAGE",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: userId,
                });
              });
            } else {
              // Handle single object
              handleMsg({
                msg: SqoffResponse.message,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: userId,
              });
            }

            return SqoffResponse;
          }),
        );
        //console.log(messages, "messages");
      } else {
        console.error("Some requests failed");
        setSqoffModal(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const childSqOffSelected = async () => {
    try {
      const ResponseSqoff = await fetch(
        `${import.meta.env.SERVER_HOST}/square_off_master_child/${mainUser}/${item.id}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      //console.log(ResponseSqoff, "ResponseSqoff");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [ filteredSymbols, setFilteredSymbols ] = useState([]);

  const [ showDropdown, setShowDropdown ] = useState(false);

  const filterSymbols = (input) => {
    if (!input) {
      setFilteredSymbols([]);
      setShowDropdown(false);
      return;
    }
    const lowerCaseInput = input.toLowerCase();
    const startsWithInput = symbols.filter((symbol) =>
      symbol.Symbol.toLowerCase().startsWith(lowerCaseInput),
    );
    const containsInput = symbols.filter(
      (symbol) =>
        symbol.Symbol.toLowerCase().includes(lowerCaseInput) &&
        !symbol.Symbol.toLowerCase().startsWith(lowerCaseInput),
    );

    const filtered = [ ...startsWithInput, ...containsInput ];
    const priorityOrder = [ "nifty", "banknifty", "finnifty" ];
    const customSort = (a, b) => {
      const symbolA = a.Symbol.toLowerCase();
      const symbolB = b.Symbol.toLowerCase();

      const indexA = priorityOrder.findIndex((priority) =>
        symbolA.startsWith(priority),
      );
      const indexB = priorityOrder.findIndex((priority) =>
        symbolB.startsWith(priority),
      );

      if (indexA === -1 && indexB === -1) {
        return 0;
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    };

    // Apply custom sort to the filtered results
    const sortedFiltered = filtered.sort(customSort);

    setFilteredSymbols(sortedFiltered);
    setShowDropdown(true);
  };

  const debounceFilterSymbols = useCallback(
    _.debounce((input) => {
      filterSymbols(input);
    }, 150),
    [ symbols ],
  );

  const validateQuantity = (quantity) => {
    if (quantity % lotSize !== 0) {
      setQuantityError(`Quantity must be a multiple of ${lotSize}`);
    } else {
      setQuantityError("");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [ name ]: value,
    }));
    if (name === "symbol") {
      debounceFilterSymbols(value);
    } else if (name === "quantity") {
      validateQuantity(value);
    }
  };
  const handleSymbolSelect = (symbol) => {
    setFormData((prevState) => ({
      ...prevState,
      symbol: symbol.Symbol,
    }));
    setFilteredSymbols([]);
    setShowDropdown(false);

    if (formData.exchange === "NFO") {
      updateLotSize(symbol.Symbol);
    }
  };
  useEffect(() => {
    if (formData.symbol) {
      updateLotSize(formData.symbol);
    }
  }, [ formData.symbol ]);
  const [ showTooltip, setShowTooltip ] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const styles = {
    tradeForm: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "800px",
      margin: "auto",
      fontFamily: "Arial, sans-serif",
    },
    tradeType: {
      display: "flex",
      marginBottom: "-35px",
    },
    orderType: {
      display: "flex",

      marginBottom: "15px",
    },
    orderType1: {
      display: "flex",
      marginBottom: "15px",
      marginLeft: "500px",
    },

    producTtype: {
      display: "flex",

      marginBottom: "15px",
    },
    priceType: {
      display: "flex",

      marginBottom: "15px",
    },
    symbolContainer: {
      position: "relative",
      marginBottom: "15px",
    },
    symbolInput: {
      width: "300px",
      padding: "5px",
      fontSize: "16px",
      borderRadius: "5px",
      marginLeft: "20px",
    },
    dropdown: {
      border: "1px solid #ccc",
      maxHeight: "150px",
      overflowY: "auto",
      width: "300px",
      textAlign: "left",
      listStyleType: "none",
      padding: 0,
      margin: 0,
      position: "absolute",
      zIndex: 1000,
      backgroundColor: "white",
      marginLeft: "24px",
      marginTop: "-5px",
    },
    dropdownItem: {
      cursor: "pointer",
      padding: "5px",
      textAlign: "left",
      width: "100%",
    },
    dropdownItemHover: {
      backgroundColor: "#f0f0f0",
    },
    orderDetails: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "15px",
    },
    duration: {
      display: "flex",

      marginBottom: "15px",
    },
    accountSelection: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "15px",
    },
    otherOptions: {
      display: "flex",

      marginBottom: "15px",
    },
    formActions: {
      display: "flex",
      justifyContent: "space-between",
    },
    buyBtn: {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    resetBtn: {
      backgroundColor: "#6c757d",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    symbolExchangeContainer: {
      display: "flex",

      marginBottom: "15px",
      marginLeft: "130px",
    },
  };
  const lotSizeStyle = {
    position: "absolute",
    right: "2px",
    color: "blue",
    visibility: showLotSize ? "visible" : "hidden",
  };

  const inputStyle = {
    height: "40px",
    width: "120px",
    borderRadius: "5px",
    fontSize: "18px",
    paddingLeft: "40px",
  };

  const tooltipTextStyle = {
    visibility: showTooltip ? "visible" : "hidden",
    width: "220px",
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px",
    position: "absolute",
    zIndex: 1,
    bottom: "-70%",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: showTooltip ? 1 : 0,
    transition: "opacity 0.3s",
  };
  const arrowStyle = {
    content: '""',
    position: "absolute",
    top: "-21%", // Position arrow at the bottom of the tooltip
    left: "50%",
    marginLeft: "-5px",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: "transparent transparent black transparent",
  };

  const handleOverlayClick = () => {
    closeTradeModal();
  };

  const [ expandedRowIndex, setExpandedRowIndex ] = useState(null);
  const handleExpandRow = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };
  const calculateTotalPnl = (row) => {
    const masterPositions = getPositionsForAccount(row.broker_user_id);
    const masterPnl = masterPositions.reduce(
      (sum, position) => sum + parseFloat(position.pnl || 0),
      0,
    ); // Sum up P&L values
    const totalChildPnl = row.child_accounts.reduce((total, child) => {
      const childPositions = getPositionsForAccount(child.broker_user_id);
      const childPnl = childPositions.reduce(
        (sum, position) => sum + parseFloat(position.pnl || 0),
        0,
      ); // Sum up P&L values
      return total + childPnl;
    }, 0);
    const totalPnl = (masterPnl + totalChildPnl).toFixed(2);

    return {
      totalPnl: totalPnl,
    };
  };

  return (
    <div>
      <MarketIndex />
      <div className="main-section">
       
        <div className="middle-main-container">
          <TopNav />
          <div style={buttonsContainerStyle}>
            <button style={buttonStyle} onClick={openModal}>
              Create
            </button>
            <button style={buttonStyleDelete} onClick={openModalDelete}>
              Delete
            </button>
            <button style={buttonStyleTrade} onClick={openTradeModal}>
              Trade
            </button>
            <button style={buttonStyleSqOff} onClick={openModalSqOff}>
              Sq off
            </button>
          </div>

          <div className="main-table">
            <div style={{ containerStyle }}>
              <table style={tableStyle}>
                <thead
                  style={{ position: "sticky", top: "0px", zIndex: "20px" }}
                >
                  <tr style={{ borderRight: "none" }}>
                    <th style={thStyle}>
                      <input
                        type="checkbox"
                        checked={Object.values(checkboxes).every(Boolean)}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      style={{ thStyle, width: "150px", textAlign: "center" }}
                    >
                      Name
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Login
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Broker
                    </th>
                    <th style={{ thStyle, width: "80px", textAlign: "center" }}>
                      Live
                    </th>
                    <th style={{ thStyle, width: "90px", textAlign: "center" }}>
                      Copy-Place
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Copy-Cancel
                    </th>
                    <th
                      style={{ thStyle, width: "110px", textAlign: "center" }}
                    >
                      Copy-Modify
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Active Children
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Total Children
                    </th>
                    <th
                      style={{ thStyle, width: "100px", textAlign: "center" }}
                    >
                      Total Multiplier
                    </th>
                    <th style={{ thStyle, width: "80px", textAlign: "center" }}>
                      P&L
                    </th>
                    <th style={{ thStyle, width: "80px", textAlign: "center" }}>
                      Sq Off
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row, index) => {
                    const { totalPnl } = calculateTotalPnl(row);
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            style={{
                              ...tdStyle,
                              fontSize: "30px",
                              fontWeight: "bold",
                              // marginRight: "55px",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              onClick={() => handleExpandRow(index)}
                              style={{ marginRight: "40px" }}
                            >
                              {expandedRowIndex === index ? "-" : "+"}{" "}
                            </span>
                            <input
                              type="checkbox"
                              checked={checkboxes[ index ] || false}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              border: "1px solid rgb(221, 221, 221)",
                              padding: "15px",
                            }}
                          >
                            {row.name}
                            <img
                              src={Edit}
                              alt="icon"
                              style={{
                                height: "20px",
                                width: "20px",
                                marginRight: "-10px",
                              }}
                              onClick={() => {
                                handleEdit(row);
                              }}
                            />
                          </td>

                          <td style={tdStyle}>{row.broker_user_id}</td>
                          <td style={tdStyle}>{row.broker}</td>
                          <td style={tdStyle}>
                            {row.child_accounts.some((child) => child.live) ? (
                              <span style={onStyle}>YES</span>
                            ) : (
                              <span style={offStyle}>NO</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            {row.copy_placement ? (
                              <span style={onStyle}>ON</span>
                            ) : (
                              <span style={offStyle}>OFF</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            {row.copy_cancellation ? (
                              <span style={onStyle}>ON</span>
                            ) : (
                              <span style={offStyle}>OFF</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            {row.copy_modification ? (
                              <span style={onStyle}>ON</span>
                            ) : (
                              <span style={offStyle}>OFF</span>
                            )}
                          </td>
                          <td style={tdStyle}>{row.child_accounts.length}</td>
                          <td style={tdStyle}>{row.child_accounts.length}</td>
                          <td style={tdStyle}>
                            {row.child_accounts.reduce(
                              (total, child) => total + child.multiplier,
                              0,
                            )}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              color: totalPnl < 0 ? "red" : "green",
                              textAlign: "center",
                            }}
                          >
                            {totalPnl}
                          </td>
                          <td style={tdStyle}>
                            <img
                              src={Log}
                              alt="icon"
                              className="logout_icon"
                              style={{
                                height: "20px",
                                width: "20px",
                                zIndex: "100",
                              }}
                              onClick={() => {
                                // childSqOffSelected(index);
                              }}
                            />
                          </td>
                        </tr>
                        {expandedRowIndex === index && (
                          <tr style={{ padding: 0 }}>
                            <td
                              colSpan={13}
                              style={{ padding: 0, background: "white" }}
                            >
                              <table
                                style={{
                                  width: "100%",
                                  marginLeft: "58px",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th style={thStyleM}>User ID</th>
                                    <th style={thStyleM}>Broker</th>
                                    <th style={thStyleM}>Multiplier</th>
                                    <th style={thStyleM}>Sq Off</th>
                                    <th style={{ ...thStyleM, width: "50px" }}>
                                      Exchange
                                    </th>
                                    <th style={thStyleM}>Symbol</th>
                                    <th style={thStyleM}>Net Qty</th>
                                    <th style={thStyleM}>LTP</th>
                                    <th style={thStyleM}>P&L</th>
                                    <th style={thStyleM}>Buy Qty</th>
                                    <th style={thStyleM}>Buy Value</th>
                                    <th style={thStyleM}>Sell Qty</th>
                                    <th style={thStyleM}>Sell Value</th>
                                    <th style={thStyleM}>Type</th>
                                    {/* <th style={{ ...thStyleM, width: "10px" }}>
                                      M2M
                                    </th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {[ row, ...row.child_accounts ].map(
                                    (account, idx) => {
                                      const positions = getPositionsForAccount(
                                        account.broker_user_id,
                                      );
                                      return positions.length > 0 ? (
                                        positions.map((position, posIdx) => (
                                          <tr key={`${idx}-${posIdx}`}>
                                            {posIdx === 0 && (
                                              <>
                                                <td style={tdStyle}>
                                                  {account.broker_user_id}{" "}
                                                  {account === row
                                                    ? "(M)"
                                                    : "(C)"}
                                                </td>
                                                <td style={tdStyle}>
                                                  {account.broker}
                                                </td>
                                                <td style={tdStyle}>
                                                  {account.multiplier
                                                    ? account.multiplier
                                                    : "1"}
                                                </td>
                                              </>
                                            )}
                                            <td style={tdStyle}>
                                              <img
                                                src={Log}
                                                alt="icon"
                                                className="logout_icon"
                                                style={{
                                                  height: "20px",
                                                  width: "20px",
                                                  zIndex: "100",
                                                }}
                                                onClick={() => {
                                                  // handleManualSqOff(index);
                                                }}
                                              />
                                            </td>
                                            <td style={tdStyle}>
                                              {position.exchange}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.symbol}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.netQty}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.ltp}
                                            </td>
                                            <td
                                              style={{
                                                ...tdStyle,
                                                color:
                                                  position?.pnl < 0
                                                    ? "red"
                                                    : "green",
                                              }}
                                            >
                                              {position?.pnl}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.buyqty}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.buyamount}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.sellqty}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.sellamount}
                                            </td>
                                            <td style={tdStyle}>
                                              {position.producttype}
                                            </td>
                                            {/* <td style={tdStyle}>{ }</td>s */}
                                          </tr>
                                        ))
                                      ) : (
                                        <tr key={idx}>
                                          <td style={tdStyle}>
                                            {account.broker_user_id}{" "}
                                            {account === row ? "(M)" : "(C)"}
                                          </td>
                                          <td style={tdStyle}>
                                            {account.broker}
                                          </td>
                                          <td style={tdStyle}>
                                            {account.multiplier
                                              ? account.multiplier
                                              : "1"}
                                          </td>
                                          <td style={tdStyle}>
                                            <img
                                              src={Log}
                                              alt="icon"
                                              className="logout_icon"
                                              style={{
                                                height: "20px",
                                                width: "20px",
                                                zIndex: "100",
                                              }}
                                              onClick={() => {
                                                childSqOffSelected(index);
                                              }}
                                            />
                                          </td>
                                          <td
                                            colSpan="12"
                                            style={{
                                              ...tdStyle,
                                              borderRight: "none",
                                            }}
                                          >
                                            No Positions
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <button
            style={{ zIndex: "0", marginLeft: "88%" }}
            onClick={() => {
              errorContainerRef.current.toggleCollapse();
            }}
            className="button"
            id="collapse"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>

          <ErrorContainer
            msgs={msgs}
            ref={errorContainerRef}
            handleClearLogs={handleClearLogs}
          />
        </div>
        <RightNav />
      </div>
      {isModalOpen && (
        <>
          <div style={overlayStyle} onClick={closeModal}></div>
          <div style={modalStyle1}>
            <h2>Select Master Account</h2>
            <p>Master Account</p>
            <select
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              onChange={(e) =>
                setSelectedMasterAccount(
                  masterChildAccounts.find(
                    (row) => row.userId === e.target.value,
                  ),
                )
              }
            >
              <option value="">---Select Master Account---</option>
              //{console.log("masterChildAccounts,", masterChildAccounts)}
              {masterChildAccounts.map((row) => (
                <option key={row.userId} value={row.userId}>
                  {`${row.name}: ${row.userId} - ${row.broker}`}
                </option>
              ))}
            </select>

            {validationError && (
              <p style={{ color: "red" }}>Please select a master account</p>
            )}
            <button
              style={closeButtonStyle}
              onClick={handleSelectChildAccounts}
            >
              Select Child Accounts
            </button>
          </div>
        </>
      )}
      {deleteModal && (
        <>
          <div style={overlayStyle} onClick={closeModalDelete}></div>
          <div style={modalStyle1}>
            {errorMessage ? (
              <div style={{ color: "red" }}>{errorMessage}</div>
            ) : (
              <div> Do you need to delete the master_child accounts</div>
            )}

            <button style={DeleteButtonStyle} onClick={handleDeleteSelected}>
              Delete
            </button>
            <button style={cancelButtonStyle} onClick={closeModalDelete}>
              Cancel
            </button>
          </div>
        </>
      )}
      {sqOffModal && (
        <>
          <div style={overlayStyle} onClick={closeModalSqOff}></div>
          <div style={modalStyle1}>
            {errorMessage ? (
              <div style={{ color: "red", fontSize: "18px" }}>
                {errorMessage}
              </div>
            ) : (
              <div> Do you need to Square off the master_child accounts</div>
            )}

            <button style={yesButtonStyle} onClick={SqOffSelected}>
              YES{" "}
            </button>
            <button style={noButtonStyle} onClick={closeModalSqOff}>
              NO
            </button>
          </div>
        </>
      )}

      {isTradeModalOpen && (
        <>
          <div style={overlayStyle} onClick={handleOverlayClick}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={closeTradeModal}
                  style={{
                    fontSize: "30px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    marginBottom: "-35px",
                  }}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleTradeSubmit} style={styles.tradeForm}>
                <div style={styles.tradeType}>
                  <label>
                    <input
                      type="radio"
                      name="transactiontype"
                      value="BUY"
                      //   defaultChecked
                      checked={formData.transactiontype === "BUY"}
                      onChange={handleInputChange}
                    />{" "}
                    BUY
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="transactiontype"
                      value="SELL"
                      checked={formData.transactiontype === "SELL"}
                      onChange={handleInputChange}
                    />{" "}
                    SELL
                  </label>
                  <div style={styles.symbolExchangeContainer}>
                    <div style={styles.exchangeContainer}>
                      <label>
                        {/* Exchange: */}
                        <select
                          name="exchange"
                          value={formData.exchange}
                          onChange={handleExchangeChange}
                          style={{
                            height: "30px",
                            borderRadius: "5px",
                            width: "70px",
                          }}
                        >
                          <option value="NSE">NSE</option>
                          <option value="BSE">BSE</option>
                          <option value="NFO">NFO</option>
                        </select>
                      </label>
                    </div>

                    <div style={styles.symbolContainer}>
                      <label>
                        <input
                          type="text"
                          name="symbol"
                          value={formData.symbol}
                          onChange={handleInputChange}
                          style={styles.symbolInput}
                          autoComplete="off"
                          placeholder="Symbol"
                          required
                        />
                      </label>
                      {showDropdown && filteredSymbols.length > 0 && (
                        <ul style={styles.dropdown}>
                          {filteredSymbols.map((symbol, index) => (
                            <li
                              key={index}
                              onClick={() => handleSymbolSelect(symbol)}
                              style={styles.dropdownItem}
                            >
                              {symbol.Symbol}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.orderType}>
                  <label>
                    <input
                      type="radio"
                      name="orderType"
                      value="REGULAR"
                      defaultChecked
                    />{" "}
                    REGULAR
                  </label>
                  <label>
                    <input type="radio" name="orderType" value="BO" /> BO
                  </label>
                  <label>
                    <input type="radio" name="orderType" value="CO" /> CO
                  </label>
                </div>

                <div style={styles.producTtype}>
                  <label>
                    <input
                      type="radio"
                      name="producttype"
                      value="INTRADAY"
                      //   defaultChecked
                      checked={formData.producttype === "INTRADAY"}
                      onChange={handleInputChange}
                    />{" "}
                    INTRADAY
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="producttype"
                      value="DELIVERY"
                      checked={formData.producttype === "DELIVERY"}
                      onChange={handleInputChange}
                    />{" "}
                    DELIVERY
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="producttype"
                      value="NORMAL"
                      checked={formData.producttype === "NORMAL"}
                      onChange={handleInputChange}
                    />{" "}
                    NORMAL
                  </label>
                </div>

                <div style={styles.priceType}>
                  <label>
                    <input
                      type="radio"
                      name="ordertype"
                      value="LIMIT"
                      //   defaultChecked
                      onChange={handleInputChange}
                      checked={formData.ordertype === "LIMIT"}
                    />{" "}
                    LIMIT
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ordertype"
                      value="MARKET"
                      onChange={handleInputChange}
                      checked={formData.ordertype === "MARKET"}
                    />{" "}
                    MARKET
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ordertype"
                      value="STOP_LOSS"
                      onChange={handleInputChange}
                      checked={formData.ordertype === "STOP_LOSS"}
                    />{" "}
                    STOP_LOSS
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ordertype"
                      value="SL_MARKET"
                      onChange={handleInputChange}
                      checked={formData.ordertype === "SL_MARKET"}
                    />{" "}
                    SL_MARKET
                  </label>
                </div>

                <div style={styles.orderDetails}>
                  <label style={containerStyleQty}>
                    Qty{" "}
                    {showLotSize && (
                      <span style={lotSizeStyle}>
                        {showLotSize && `[Lot: ${lotSize}]`}
                      </span>
                    )}{" "}
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={inputStyle}
                    />
                    <span style={tooltipTextStyle}>
                      <div style={arrowStyle}></div>
                      Quantity should be multiple of lot size for derivatives
                    </span>
                  </label>

                  <label>
                    Price{" "}
                    <input
                      type="number"
                      defaultValue={1}
                      name="price"
                      autoComplete="off"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={
                        formData.ordertype === "MARKET" ||
                        formData.ordertype === "SL_MARKET"
                      }
                      style={{
                        height: "40px",
                        width: "110px",
                        borderRadius: "5px",
                        fontSize: "18px",
                        paddingLeft: "20px",
                      }}
                    />
                  </label>
                  <label>
                    Trig.Price{" "}
                    <input
                      type="number"
                      defaultValue={0}
                      name="triggerPrice"
                      autoComplete="off"
                      value={formData.triggerPrice}
                      onChange={handleInputChange}
                      disabled={
                        formData.ordertype === "LIMIT" ||
                        formData.ordertype === "MARKET"
                      }
                      style={{
                        height: "40px",
                        width: "110px",
                        borderRadius: "5px",
                        fontSize: "18px",
                        paddingLeft: "20px",
                      }}
                    />
                  </label>
                  <label>
                    Disclosed Qty{" "}
                    <input
                      type="number"
                      defaultValue={0}
                      name="disclosedQty"
                      autoComplete="off"
                      value={formData.disclosedQty}
                      onChange={handleInputChange}
                      disabled={formData.ordertype === "SL_MARKET"}
                      style={{
                        height: "40px",
                        width: "110px",
                        borderRadius: "5px",
                        fontSize: "18px",
                        paddingLeft: "20px",
                      }}
                    />
                  </label>
                </div>

                <div style={styles.duration}>
                  <label>
                    <input
                      type="radio"
                      name="duration"
                      value="DAY"
                      //   defaultChecked
                      onChange={handleInputChange}
                      checked={formData.duration === "DAY"}
                    />{" "}
                    DAY
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="duration"
                      value="IOC"
                      onChange={handleInputChange}
                      checked={formData.duration === "IOC"}
                    />{" "}
                    IOC
                  </label>
                </div>
                {quantityError && (
                  <div
                    style={{
                      color: "red",
                      height: "0px",
                    }}
                  >
                    {quantityError}
                  </div>
                )}
                <div
                  style={{
                    marginLeft: "-623px",
                  }}
                >
                  <label>
                    <input type="checkbox" name="amo" /> AMO
                  </label>
                </div>
                <div
                  style={{
                    marginTop: "-70px",
                    marginLeft: "500px",
                  }}
                >
                  <label> Split Order</label>
                </div>

                <div style={styles.orderType1}>
                  <label>
                    <input
                      type="radio"
                      name="orderType1"
                      value="REGULAR"
                      defaultChecked
                    />{" "}
                    NO
                  </label>
                  <label>
                    <input type="radio" name="orderType1" value="BO" /> AUTO
                  </label>
                  <label>
                    <input type="radio" name="orderType1" value="CO" /> QTY
                  </label>
                </div>

                <div style={styles.accountSelection}>
                  <label>
                    Accounts:
                    <select
                      onChange={handleAccountChange}
                      value={selectedAccountId}
                      style={{
                        height: "25px",
                        borderRadius: "5px",
                        width: "170px",
                      }}
                      required
                    >
                      <option value="" disabled>
                        -Select Master Account-
                      </option>
                      {data &&
                        data.map((account, index) => (
                          <React.Fragment key={index}>
                            <option value={`${account.broker_user_id}`}>
                              {account.name}: {account.broker_user_id} {"(M)"}
                            </option>
                            {account.child_accounts.map((child, childIndex) => (
                              <option
                                key={`${index}-${childIndex}`}
                                value={`${child.broker_user_id},${child.name}`}
                              >
                                {child.name}: {child.broker_user_id} {"(C)"}
                              </option>
                            ))}
                          </React.Fragment>
                        ))}
                    </select>
                  </label>
                </div>

                <div style={styles.formActions}>
                  <button
                    onClick={resetButton}
                    style={styles.resetBtn}
                    type="button"
                  >
                    Reset
                  </button>

                  <button type="submit" style={styles.buyBtn}>
                    BUY
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {popupOpen && (
        <MasterChild
          open={popupOpen}
          onClose={handleClosePopup}
          selectedItems={mode === "edit" ? selectedItems : []}
          selectedChildAccount={mode === "edit" ? remainingAccounts : []}
          selectedMasterAccount={mode === "edit" ? "" : selectedMasterAccount}
          mode={mode}
          data={data}
        />
      )}
    </div>
  );
}

export default MasterAccount;
