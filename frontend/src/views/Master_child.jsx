import React, { useState, useEffect } from "react";
import { setmasterChildAccounts } from "../store/slices/master_child";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Checkbox,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import Cookies from "universal-cookie";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/system";

const cookies = new Cookies();

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "1200px",
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.5),
  backgroundColor: "#DBDDDF",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(0),
  paddingLeft: "5px",

  marginLeft: "5px",
  "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
    font: "inherit",
    letterSpacing: "inherit",
    color: "currentColor",
    padding: "4px 0 5px",
    border: 0,
    boxSizing: "content-box",
    background: "none",
    height: "1.4375em",
    margin: 0,
    textAlign: "center",
    WebkitTapHighlightColor: "transparent",
    display: "block",
    minWidth: 0,
    width: "100%",
    WebkitAnimationName: "mui-auto-fill-cancel",
    animationName: "mui-auto-fill-cancel",
    WebkitAnimationDuration: "10ms",
    animationDuration: "10ms",
  },
  "& .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root ": {
    width: "80%",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#a5baff",
  borderColor: "#01a9ac",
  color: "black",
  cursor: "pointer",
  transition: "all ease-in 0.3s",
  "&:hover": {
    backgroundColor: "#007777",
    borderColor: "#007777",
  },
}));
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiFormControl-root": {
    marginBottom: theme.spacing(1),
  },
  "& .MuiInputBase-root": {
    height: "35px",
    fontSize: "14px",
  },
  "& .MuiAutocomplete-inputRoot": {
    width: "140px",
  },
}));
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5),
  fontSize: "14px",
  textAlign: "center",
}));
const MultiplierTextField = styled(TextField)(({ }) => ({
  width: "80px",
  "& .MuiInputBase-root": {
    height: "35px",
    fontSize: "14px",
  },
}));

function MasterChild({
  open,
  onClose,
  selectedItems,
  selectedChildAccount,
  selectedMasterAccount,
  mode,
  data,
}) {
  useEffect(() => {
    //console.log(mode)
  }, [ mode ]);
  //console.log(data, "data")
  //// console.log(selectedItems, "selectedItemsss")

  const { brokers: rows } = useSelector((state) => state.brokerReducer);
  const dispatch = useDispatch();

  const getUnselectedRows = () => {
    if (!data) {
      console.error("Data is undefined");
      return [];
    }

    let excludedUserIds = [ "1234567" ];
    //console.log(data)
    data?.forEach((account) => {
      if (account.broker_user_id) {
        excludedUserIds.push(account.broker_user_id);
      }

      if (account.child_accounts && account.child_accounts.length > 0) {
        account.child_accounts.forEach((child) => {
          if (child.broker_user_id) {
            excludedUserIds.push(child.broker_user_id);
          }
        });
      }
    });
    if (selectedMasterAccount && selectedMasterAccount.userId) {
      excludedUserIds.push(selectedMasterAccount.userId);
    }
    if (
      selectedItems &&
      selectedItems?.length > 0 &&
      selectedItems[ 0 ].child_accounts &&
      selectedItems[ 0 ].child_accounts.length > 0
    ) {
      selectedItems[ 0 ].child_accounts.forEach((child) => {
        if (child.broker_user_id) {
          excludedUserIds.push(child.broker_user_id);
        }
      });
    }

    //// console.log(excludedUserIds, "excludedUserIds");

    return rows.filter(
      (row) =>
        !excludedUserIds.includes(row.userId) && row.inputDisabled === true,
    );
  };
  const [ unselectedRows, setUnselectedRows ] = useState(getUnselectedRows());

  useEffect(() => {
    //console.log("unselected rows are set to initial state")
    setUnselectedRows(getUnselectedRows());
  }, [ selectedMasterAccount, rows ]);
  useEffect(() => {
    //console.log(rows)
  }, [ rows ]);
  //  [selectedMasterAccount, selectedItems, rows, selectedChildAccount]

  const [ multipliers, setMultipliers ] = useState({});
  const [ copyPlacement, setCopyPlacement ] = useState(true);
  const [ copyCancellation, setCopyCancellation ] = useState(true);
  const [ copyModification, setCopyModification ] = useState(true);
  const [ parallelOrderExecution, setParallelOrderExecution ] = useState(true);
  const [ autoSplitFrozenQty, setAutoSplitFrozenQty ] = useState(true);
  const initialCopyStartTime = selectedItems?.copy_start_time || "08:00";
  const initialCopyEndTime = selectedItems?.copy_end_time || "22:00";
  const [ isSaving, setIsSaving ] = useState(false);

  const [ copyStartTime, setCopyStartTime ] = useState(initialCopyStartTime);
  const [ copyEndTime, setCopyEndTime ] = useState(initialCopyEndTime);

  const handleMultiplierChange = (userId, value) => {
    //console.log(value, "valve");
    if (value >= 1) {
      setMultipliers((prevState) => ({
        ...prevState,
        [ userId ]: value,
      }));
    }
  };

  useEffect(() => {
    //console.log(multipliers)
  }, [ multipliers ]);
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const hourString = hour < 10 ? `0${hour}` : `${hour}`;
        const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
        times.push(`${hourString}:${minuteString}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const [ selectedChildAccounts, setSelectedChildAccounts ] = useState([]);
  useEffect(() => {
    //// console.log(selectedItems,
    //   "selectedItemsss11"
    // )
    //console.log(selectedItems)
    //console.log("selected rows are set to initial state")
    if (selectedItems && selectedItems.length > 0) {
      //// console.log(selectedItems, "selectedItemsss111")
      const childAccounts = selectedItems.flatMap(
        (item) => item.child_accounts || [],
      );
      //// console.log(childAccounts, "selectedItemsss1111")
      setSelectedChildAccounts(childAccounts);
      //console.log(childAccounts)
    }

    //// console.log(selectedChildAccounts, "selectedItemsss1")
  }, [ selectedItems, selectedChildAccount ]);

  useEffect(() => {
    const childAccounts = selectedItems.flatMap(
      (item) => item.child_accounts || [],
    );
    //console.log(childAccounts)
  }, [ selectedItems ]);
  //selectedChildAccount

  const [ childAddedCount, setChildAddedCount ] = useState(0);
  const [ childDeletedCount, setChildDeletedCount ] = useState(0);
  const [ manageId, setManageId ] = useState("userId");
  useEffect(() => {
    if (
      selectedChildAccounts.length !== 0 ||
      (unselectedRows && unselectedRows.length !== 0)
    ) {
      if (selectedChildAccounts.length !== 0) {
        if (
          selectedChildAccounts &&
          Object.keys(selectedChildAccounts[ 0 ])?.includes("userId")
        ) {
          setManageId("userId");
        } else {
          setManageId("broker_user_id");
        }
      } else {
        if (
          unselectedRows &&
          Object.keys(unselectedRows[ 0 ])?.includes("userId")
        ) {
          setManageId("userId");
        } else {
          setManageId("broker_user_id");
        }
      }
    }
    //console.log(selectedChildAccounts);
    //console.log(unselectedRows);
  }, [ selectedChildAccounts, unselectedRows ]);

  useEffect(() => {
    //console.log(manageId)
  }, [ manageId ]);
  const handleAddToChildAccounts = (row) => {
    //console.log(selectedChildAccounts)
    if (
      !selectedChildAccounts.find(
        (account) => account[ manageId ] === row[ manageId ],
      )
    ) {
      //console.log("if case")
      const multiplier = multipliers[ row[ manageId ] ] || 1;
      setSelectedChildAccounts((prevState) => [
        ...prevState,
        { ...row, multiplier },
      ]);
      //console.log([ { ...row, multiplier } ])
      //console.log(unselectedRows)
      //console.log(row)
      //// console.log(unselectedRows.filter((item)=>item.userId!==row.userId))
      //console.log(unselectedRows.filter((account) => account[ manageId ] !== row[ manageId ]))
      setUnselectedRows((prevState) => {
        //console.log(prevState)
        //console.log(row)
        //console.log(prevState.filter((account) => account[ manageId ] !== row[ manageId ]))
        return prevState.filter(
          (account) => account[ manageId ] !== row[ manageId ],
        );
      });
      setChildAddedCount((prevCount) => prevCount + 1);
      setChildDeletedCount((prevCount) => prevCount - 1);
      // if(childDeletedCount > 0)
      //   setChildDeletedCount(count=>count-1);
    } else {
      //console.log("else case")
    }
  };

  const handleRemoveFromChildAccounts = (row) => {
    //console.log("row", row)
    setSelectedChildAccounts((prevState) => {
      //console.log(prevState)
      //console.log(prevState.filter((account) => account[ manageId ] !== row[ manageId ]))
      return prevState.filter((account) => account[ manageId ] !== row[ manageId ]);
    });
    setUnselectedRows((prevState) => [ ...prevState, row ]);
    // if(childAddedCount > 0){
    //   setChildAddedCount(count=>count-1);
    // }
    setChildDeletedCount((prevCount) => prevCount + 1);
    setChildAddedCount((prevCount) => prevCount - 1);
    if (selectedItems && selectedItems.length > 0) {
      fetch(`${import.meta.env.SERVER_HOST}/delete_child_account/${mainUser}/${row[ manageId ]}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            //console.log(
            //   `Row with userId ${row[ manageId ]} deleted successfully.`,
            // );
          } else {
            console.error(`Failed to delete row with userId ${row[ manageId ]}.`);
          }
        })
        .catch((error) => {
          console.error("Error occurred while deleting row:", error);
        });
    }
  };

  const [ popupOpen, setPopupOpen ] = useState(false);
  const [ popupData, setPopupData ] = useState(null);

  const handleClosePopup = () => {
    onClose();
    setPopupOpen(false);
  };

  let selectedItemName, selectedItemBrokerUserId, selectedItemBroker;
  if (selectedItems && selectedItems.length > 0) {
    selectedItemName = selectedItems[ 0 ]?.name;
    selectedItemBrokerUserId = selectedItems[ 0 ]?.broker_user_id;
    selectedItemBroker = selectedItems[ 0 ]?.broker;
  }

  useEffect(() => {
    //console.log("selectedItems12", selectedItems);
    if (selectedItems && selectedItems.length > 0 && mode === "edit") {
      //console.log(selectedItems, "selectedItems", mode);
      const selectedItem = selectedItems[ 0 ];
      setCopyEndTime(selectedItem?.copy_end_time || "22:00");
      setCopyStartTime(selectedItem?.copy_start_time || "08:00");
      setCopyPlacement(selectedItem?.copy_placement);
      setCopyCancellation(selectedItem?.copy_cancellation);
      setCopyModification(selectedItem?.copy_modification);
      setParallelOrderExecution(selectedItem?.parallel_order_execution);
      setAutoSplitFrozenQty(selectedItem?.auto_split_frozen_qty);
    }
  }, [ selectedItems ]);

  const countUpdatedChildAccounts = () => {
    // let updatedCount = 0;
    //// console.log(selectedChildAccount)
    //// console.log(selectedChildAccounts)
    // if (selectedChildAccount.length !== selectedChildAccounts.length) {
    //   return updatedCount;
    // }

    // for (let i = 0; i < selectedChildAccount.length; i++) {
    //   const initialChild = selectedChildAccount[i];
    //   const currentChild = selectedChildAccounts[i];

    //   if (JSON.stringify(initialChild) !== JSON.stringify(currentChild)) {
    //     updatedCount++;
    //   }
    // }

    // return updatedCount;
    return childAddedCount + childDeletedCount;
  };

  const mainUser = cookies.get("USERNAME");

  const fetchMasterAccounts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/fetch_master_child_accounts/${mainUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      //console.log(response, "response");

      if (!response.ok) {
        throw new Error("Failed to fetch executed portfolios");
      } else {
        const MasterChildAccounts = await response.json();
        //console.log("mahesh ", MasterChildAccounts, response);
        dispatch(
          setmasterChildAccounts({
            masterChildAccounts: MasterChildAccounts,
          }),
        );
      }
    } catch (error) {
      console.error(`Error occurred while calling  API:`, error.message);
    }
  };

  const handleSave = async () => {
    //console.log("save option triggered");
    if (mode === "create" && selectedChildAccounts.length === 0) {
      alert("no child account selected");
      return;
    }
    if (mode === "edit" && selectedChildAccounts.length === 0) {
      alert("child count should be atleast 1");
      return;
    }
    setIsSaving(true);
    const data = {
      masterAccount: {
        name: selectedMasterAccount
          ? selectedMasterAccount.name
          : selectedItemName,
        broker_user_id: selectedMasterAccount
          ? selectedMasterAccount.userId
          : selectedItemBrokerUserId,
        broker: selectedMasterAccount
          ? selectedMasterAccount.broker
          : selectedItemBroker,
        copyPlacement,
        copyCancellation,
        copyModification,
        parallelOrderExecution,
        autoSplitFrozenQty,
        copyStartTime,
        copyEndTime,
      },
      childAccounts: selectedChildAccounts.map((account) => ({
        name: account.name,
        multiplier: multipliers[ account[ manageId ] ]
          ? multipliers[ account[ manageId ] ]
          : account.multiplier,
        broker_user_id: account.userId
          ? account.userId
          : account.broker_user_id,
        broker: account.broker,
        live: account.inputDisabled ? account.inputDisabled : account.live,
      })),
    };
    //console.log("saving", data);

    try {
      const response = await fetch(
        `${import.meta.env.SERVER_HOST}/create_master_child_accounts/${mainUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (response.ok) {
        const result = await response.json();
        fetchMasterAccounts();
        //console.log(result, "result");
        const updatedCount = countUpdatedChildAccounts();
        setPopupData({
          masterName: selectedMasterAccount
            ? selectedMasterAccount?.name
            : selectedItemName,
          masterLoginId: selectedMasterAccount
            ? selectedMasterAccount?.userId
            : selectedItemBrokerUserId,
          childAdded: childAddedCount < 0 ? 0 : childAddedCount,
          childUpdated: updatedCount,
          childDeleted: childDeletedCount < 0 ? 0 : childDeletedCount,
        });
        setPopupOpen(true);
      } else {
        throw new Error("Network response was not ok");
      }

      // setSelectedChildAccounts([])
      // setUnselectedRows([])
    } catch (error) {
      console.error("Error:", error);
      alert("error occured");
      //console.log("error");
    } finally {
      setIsSaving(false);
    }
  };

  const CancelButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#f44336", // Red color
    color: "#fff", // White text color
    "&:hover": {
      backgroundColor: "#d32f2f", // Darker shade on hover
    },
  }));

  // StyledButton for Save with green background
  const SaveButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#4caf50", // Green color
    color: "#fff", // White text color
    "&:hover": {
      backgroundColor: "#388e3c", // Darker shade on hover
    },
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box p={3} style={{ overflowY: "hidden" }}>
        <StyledCard style={{ background: "none" }}>
          <CardContent
            style={{ paddingBottom: "0px", padding: "2px", paddingTop: "12px" }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#4661bd", marginTop: "-20px" }}
            >
              Master Account
            </Typography>
            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={10} md={2}>
                  <CustomTextField
                    label="Name"
                    fullWidth
                    value={selectedMasterAccount?.name || selectedItemName}
                    InputProps={{ readOnly: true }}
                    style={{ textAlign: "center" }}
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ marginLeft: "-35px" }}>
                  <CustomTextField
                    label="Login ID"
                    fullWidth
                    value={
                      selectedMasterAccount?.userId || selectedItemBrokerUserId
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ marginLeft: "-35px" }}>
                  <CustomTextField
                    label="Broker"
                    fullWidth
                    value={selectedMasterAccount?.broker || selectedItemBroker}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ marginTop: "-15px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={copyPlacement}
                        onChange={(e) => setCopyPlacement(e.target.checked)}
                      />
                    }
                    label="Copy Placement"
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ marginTop: "-15px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={copyCancellation}
                        onChange={(e) => setCopyCancellation(e.target.checked)}
                      />
                    }
                    label="Copy Cancellation"
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ marginTop: "-15px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={copyModification}
                        onChange={(e) => setCopyModification(e.target.checked)}
                      />
                    }
                    label="Copy Modification"
                  />
                </Grid>
                <Grid item xs={12} md={3} style={{ marginTop: "-15px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={parallelOrderExecution}
                        onChange={(e) =>
                          setParallelOrderExecution(e.target.checked)
                        }
                      />
                    }
                    label="Parallel Order Execution"
                  />
                </Grid>
                <Grid item xs={12} md={3} style={{ marginTop: "-15px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={autoSplitFrozenQty}
                        onChange={(e) =>
                          setAutoSplitFrozenQty(e.target.checked)
                        }
                      />
                    }
                    label="Auto Split Frozen Qty"
                  />
                </Grid>
                <Grid item xs={6} md={3} style={{ marginTop: "-15px" }}>
                  <Typography>Copy Start Time</Typography>
                  <CustomAutocomplete
                    value={copyStartTime}
                    onChange={(event, newValue) => {
                      setCopyStartTime(newValue);
                    }}
                    options={timeOptions}
                    renderInput={(params) => <CustomTextField {...params} />}
                  />
                </Grid>
                <Grid item xs={6} md={3} style={{ marginTop: "-15px" }}>
                  <Typography>Copy End Time</Typography>
                  <CustomAutocomplete
                    value={copyEndTime}
                    onChange={(event, newValue) => {
                      setCopyEndTime(newValue);
                    }}
                    options={timeOptions}
                    renderInput={(params) => <CustomTextField {...params} />}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#4661bd", paddingTop: "0px", marginBottom: "0px" }}
        >
          Child Accounts
        </Typography>

        <StyledCard
          style={{ height: "150px", overflowY: "auto", background: "none" }}
        >
          <CardContent
            style={{
              paddingBottom: "0px",
              padding: "2px",
              paddingTop: "12px",
              marginTop: "-17px",
            }}
          >
            <Table>
              <TableHead
                style={{
                  top: "-5px",
                  position: "sticky",
                  zIndex: "100",
                  marginTop: "-10px",
                }}
              >
                <TableRow style={{ background: "rgb(216, 225, 255)" }}>
                  <CustomTableCell>Remove</CustomTableCell>
                  <CustomTableCell>Name</CustomTableCell>
                  <CustomTableCell>Multiplier</CustomTableCell>
                  <CustomTableCell>Login</CustomTableCell>
                  <CustomTableCell>Broker</CustomTableCell>
                  <CustomTableCell>Live</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflowY: "auto" }}>
                {selectedChildAccounts.length > 0 ? (
                  selectedChildAccounts.map((row) => (
                    <TableRow key={row[ manageId ]}>
                      <CustomTableCell style={{ width: "80px" }}>
                        <IconButton
                          onClick={() => handleRemoveFromChildAccounts(row)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </CustomTableCell>
                      <CustomTableCell style={{ width: "250px" }}>
                        {row.name}
                      </CustomTableCell>
                      <CustomTableCell>
                        <MultiplierTextField
                          type="number"
                          value={
                            multipliers[ row[ manageId ] ] || row.multiplier || 1
                          }
                          onChange={(e) =>
                            handleMultiplierChange(
                              row[ manageId ],
                              e.target.value,
                            )
                          }
                          inputProps={{ min: 1 }}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        {row.userId ? row.userId : row.broker_user_id}
                      </CustomTableCell>
                      <CustomTableCell>{row.broker}</CustomTableCell>
                      <CustomTableCell>
                        {row.inputDisabled ? "Yes" : "No"}
                      </CustomTableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <CustomTableCell
                      colSpan={6}
                      style={{ textAlign: "center", color: "red" }}
                    >
                      No Accounts Available
                    </CustomTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </StyledCard>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#4661bd", paddingTop: "0px", marginBottom: "0px" }}
        >
          Available Accounts
        </Typography>
        <StyledCard
          style={{
            height: "175px",
            overflowY: "auto",
            background: "none",
            marginBottom: "0px",
          }}
        >
          <CardContent
            style={{
              paddingBottom: "0px",
              padding: "2px",
              paddingTop: "12px",
              marginTop: "-30px",
            }}
          >
            <Table style={{ marginTop: "10px" }}>
              <TableHead
                style={{
                  top: "-5px",
                  position: "sticky",
                  zIndex: "100",
                  marginTop: "-10px",
                }}
              >
                <TableRow style={{ background: "rgb(216, 225, 255)" }}>
                  <CustomTableCell>Remove</CustomTableCell>
                  <CustomTableCell>Name</CustomTableCell>
                  <CustomTableCell>Multiplier</CustomTableCell>
                  <CustomTableCell>Login</CustomTableCell>
                  <CustomTableCell>Broker</CustomTableCell>
                  <CustomTableCell>Live</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflowY: "auto" }}>
                {unselectedRows?.length > 0 ? (
                  unselectedRows.map((row) => (
                    <TableRow key={row[ manageId ]}>
                      <CustomTableCell style={{ width: "80px" }}>
                        <StyledButton
                          onClick={() => handleAddToChildAccounts(row)}
                        >
                          <AddIcon />
                        </StyledButton>
                      </CustomTableCell>
                      <CustomTableCell style={{ width: "250px" }}>
                        {row.name}
                      </CustomTableCell>
                      <CustomTableCell
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {1}
                      </CustomTableCell>
                      <CustomTableCell>
                        {row.userId ? row.userId : row.broker_user_id}
                      </CustomTableCell>
                      <CustomTableCell>{row.broker}</CustomTableCell>
                      <CustomTableCell>
                        {row.inputDisabled ? "Yes" : "No"}
                      </CustomTableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <CustomTableCell
                      colSpan={6}
                      style={{ textAlign: "center", color: "red" }}
                    >
                      No Accounts Available
                    </CustomTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </StyledCard>
        <CancelButton
          variant="contained"
          onClick={handleClosePopup}
          style={{ marginLeft: "600px", marginTop: "8px" }}
        >
          Cancel
        </CancelButton>
        <SaveButton
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          style={{ marginLeft: "55px", marginTop: "8px" }}
        >
          {isSaving ? <CircularProgress size={24} /> : "Save"}
          {/* Save */}
        </SaveButton>
        <Dialog open={popupOpen} onClose={handleClosePopup}>
          <DialogTitle style={{ textAlign: "center", fontSize: "40px" }}>
            Success
          </DialogTitle>
          <DialogContent>
            {popupData && (
              <>
                <Typography>
                  Master [{popupData.masterName} : {popupData.masterLoginId}] is
                  Saved.
                </Typography>

                <Typography style={{ textAlign: "center" }}>
                  {popupData.childAdded} Children added
                </Typography>
                <Typography style={{ textAlign: "center" }}>
                  {popupData.childUpdated} Children updated
                </Typography>
                <Typography style={{ textAlign: "center" }}>
                  {popupData.childDeleted} Children deleted
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={handleClosePopup}
              color="primary"
              style={{ marginRight: "110px" }}
            >
              OK
            </StyledButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Dialog>
  );
}

export default MasterChild;
