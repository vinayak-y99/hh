import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

import image from '../assets/Media.jpeg';
import Cookies from "universal-cookie";
const cookies = new Cookies();
function Subscription() {
    const mainUser = cookies.get("USERNAME");

    const [ numberOfUsers, setNumberOfUsers ] = useState(1);
    const [ renew, setRenew ] = useState("renew");
    const [ totalAmount, setTotalAmount ] = useState(750);
    const [ gstAmount, setGstAmount ] = useState(0);
    const [ amountWithGst, setAmountWithGst ] = useState(750);
    const [ paymentMode, setPaymentMode ] = useState('google pay');
    const [ renewPeriod, setRenewPeriod ] = useState("1 month");
    const [ payment, setPayment ] = useState("");
    const [ orderId, setOrderId ] = useState('');
    const navigate = useNavigate();



    const handleRenewPeriodChange = (e) => {

        setRenewPeriod(e.target.value);
    };
    const handleRenew = (e) => {
        const selectedValue = e.target.value;
        setRenew(selectedValue);
        console.log(selectedValue, "value");
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,12}$/.test(value)) {
            setOrderId(value);
        }
    };
    const [ paymentStatus, setPaymentStatus ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d?$/.test(value)) {
            setPayment(value);
        }
    };

    const handlePaymentModeChange = (e) => {
        setPaymentMode(e.target.value);
        console.log(e, renewPeriod, "paymentMode")
    };
    const calculateTotalAmount = (numUsers) => {
        if (renew === "renew") {
            if (numUsers <= 1) {
                return 750;
            } else {
                const baseAmount = 750;
                const amount = baseAmount + (baseAmount / 2) * (numUsers - 1);
                return amount;
            }
        }
        else {
            let amount = 375;
            return amount * (numUsers);
        }

    };
    useEffect(() => {
        const amountBeforeGST = calculateTotalAmount(numberOfUsers);
        const gst = 0.18;
        const gstValue = amountBeforeGST * gst;
        const totalAmountWithGST = amountBeforeGST + gstValue;

        setTotalAmount(amountBeforeGST.toFixed(2));
        setGstAmount(gstValue.toFixed(2));
        setAmountWithGst(totalAmountWithGST.toFixed(2));
    }, [ numberOfUsers, renew ]);



    const [ expiry, setExpiry ] = useState(null);
    const [ subscriptionType, setSubscriptionType ] = useState(null);
    const [ users, setusers ] = useState(null);
    console.log(expiry, users, 'users', subscriptionType)



    const payments = async () => {
        const requestBody = {
            username: mainUser,
            num_of_users: String(numberOfUsers),
            payment_order_id: orderId,
            payment_amount: payment,
            payment_mode: paymentMode,
            renewal_period: renewPeriod,
            payment_type: renew === "renew" ? "RENEW" : "ADD USER",
        };
        try {
            const response = await fetch(`${import.meta.env.SERVER_HOST}/make_payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const responseData = await response.json();

                const subscriptionType = responseData?.subscription_type || "";
                cookies.set('subscription_type', subscriptionType,);
                const number_user = responseData?.num_of_users || "";
                cookies.set('number_users', number_user,);


                const subscriptionEndDate = new Date(responseData?.subscription_end_date);
                const formattedExpiryDate = subscriptionEndDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                cookies.set('expiry', formattedExpiryDate,);


                setExpiry(formattedExpiryDate);
                setSubscriptionType(subscriptionType);
                setusers(number_user);


                if (subscriptionType === "Active" || subscriptionType === "Free Trial") {
                    navigate("/UserProfiles");
                } else {
                    navigate("/");
                }

                // console.log(subscriptionType, formattedExpiryDate, "Subscription and Expiry Details");
            } else {
                console.log(`Payment failed with status: ${response.status}`, "response");
            }
        } catch (err) {
            console.error(err, "Error during payment");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const savedExpiry = new Date(cookies.get('expiryDate'));
        const formattedExpiryDate = savedExpiry?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const savedSubscriptionType = cookies.get('subscription_type');
        const no_users = cookies.get("number_users");
        setExpiry(formattedExpiryDate);
        setSubscriptionType(savedSubscriptionType);
        setusers(no_users);
    }, []);




    if (loading) return <div>Loading...</div>;

    const getButtonContent = () => {
        if (loading) {
            return <RotatingLines width="24" strokeColor="white" />;
        }
        switch (paymentStatus) {
            case 'success':
                return <span>&#10004; Payment Successful</span>;
            case 'error':
                return <span>&#10008; Payment Failed</span>;
            default:
                return 'Confirm Payment';
        }
    }
    const handleGoBackClick = () => {
        if (subscriptionType === "Active" || subscriptionType === "Free Trial") {
            navigate("/UserProfiles");
        } else {
            navigate("/");
        }

    }

    return (
        <div>
            <div style={{ backgroundColor: "#32406D", height: "30px", textAlign: "center", color: "white", paddingTop: "8px" }}>
                Renew Subscription
                <button
                    style={{
                        position: "absolute",
                        right: "15px",
                        top: "5px",
                        width: "23px",
                        height: "23px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "50%",
                        color: "#2E3A5B",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        lineHeight: "30px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}

                    onClick={handleGoBackClick}

                    aria-label="Close"
                >
                    &times;
                </button>

            </div>
            <div >
                <div style={{ paddingLeft: "30px", padding: "7px" }}>
                    <h3 style={{
                        color: subscriptionType === 'Active' ? 'green' :
                            subscriptionType === 'Expired' ? 'red' :
                                subscriptionType === 'Free_Trial' ? 'orange' : 'brown', fontWeight: "600", fontSize: "20px", display: "inline-block", paddingLeft: "30px"
                    }}>
                        {subscriptionType === 'Active' && `Your subscription is Active, max allowed Demat accounts  ${users}`}
                        {subscriptionType === 'Free_Trial' && `You are on a Free Trial, Please upgrade, max allowed Demat accounts 1`}
                        {subscriptionType === 'Expired' && `MTI Bridge Expired, Please Renew`}
                    </h3>
                    {/* <div style={{ borderTop: "1px solid gray", width: "300px", marginLeft: "25px" }}></div> */}
                </div>

                <div style={{ paddingLeft: "30px" }}>
                    <div style={{ fontWeight: ".5", fontSize: "14px" }}>
                        If Renewing in Advance Do not Worry, Your Subscription will be extended after the Current Expiry Period.
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", marginTop: "3px" }}>
                    <div style={{ flex: "2", paddingLeft: "30px" }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                            <label htmlFor="registerUserId" style={{ fontWeight: "500", fontSize: "16px", marginRight: "10px", width: "200px", paddingLeft: "35px" }}>Register User Id:</label>
                            <input
                                type="text"
                                id="registerUserId"
                                style={{ width: "150px", height: "20px", borderRadius: "5px", border: "1px solid #ccc", marginLeft: "-60px", padding: "10px" }}
                                value={mainUser}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                            <label htmlFor="subscriptionValidity" style={{ fontWeight: "500", fontSize: "16px", width: "200px" }}>Subscription Validity:</label>
                            <span id="subscriptionValidity" style={{ fontWeight: "bold", fontSize: "14px", marginLeft: "-40px" }}>{expiry}</span>
                        </div>

                    </div>
                    <div style={{ flex: "1", marginRight: "20px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px", paddingLeft: "180px" }}>QR CODE</div>

                    </div>
                </div>

                <div>
                    <h4 style={{ color: "blue", paddingLeft: "160px" }}>WE OFFER 7 DAYS FULL FUNCTIONAL TRIAL,NO REFUND REQUEST WILL BE ENTERTAINED ONCE PAID</h4>
                    <h4 style={{ paddingLeft: "30px", color: "green", maxWidth: "1000px", wordWrap: "break-word", overflowWrap: "break-word" }}> FOR INSTATNT AND AUTOMATIC RENEWAL,PAY USING UPI,GPAY,PHONEPE WITH QR CODE DISPLAYED AND FILL THE 12 DIGIT UPI / UTR NUMBER</h4>
                    <div style={{ paddingLeft: "30px" }}>
                        <div style={{ display: "flex", alignItems: "center", marginTop: "-90px" }}>

                            <div style={{ paddingLeft: "130px", display: "flex", alignItems: "center", flex: "1" }}>
                                <input
                                    type="radio"
                                    onChange={handleRenew}
                                    id="renew"
                                    checked={renew === "renew"}
                                    name="subscription"
                                    value="renew"
                                    style={{ marginRight: "10px", transform: "scale(1.5)" }}
                                />
                                <label
                                    htmlFor="renew"
                                    style={{ paddingTop: "9px", marginRight: "30px" }}
                                >
                                    RENEW
                                </label>

                                <input
                                    type="radio"
                                    id="Add user"
                                    onChange={handleRenew}
                                    checked={renew === "Add user"}
                                    name="subscription"
                                    value="Add user"
                                    disabled={subscriptionType === 'Expired' || subscriptionType === 'Free_Trial'}
                                    style={{ marginRight: "10px", transform: "scale(1.5)" }}
                                />
                                <label
                                    htmlFor="cancel"
                                    style={{
                                        paddingTop: "9px",
                                        color: subscriptionType === 'Expired' || subscriptionType === 'Free Trial' ? 'grey' : 'black',
                                        cursor: subscriptionType === 'Expired' || subscriptionType === 'Free Trial' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    ADD USER
                                </label>

                                <label htmlFor="" style={{ paddingTop: "9px", paddingLeft: "30px" }}>Number of User Req :</label>
                                <input
                                    type="number"
                                    id="user-count"
                                    name="user-count"
                                    min="1"
                                    max="100"
                                    value={numberOfUsers}
                                    onChange={(e) => setNumberOfUsers(parseInt(e.target.value))}
                                    style={{ width: "100px", height: "30px", borderRadius: "5px", marginLeft: "10px", paddingLeft: "10px", border: "1px solid #ccc" }}
                                />
                            </div>


                            <div style={{
                                marginLeft: "20px",
                                width: "40%",
                                padding: "10px",
                                borderRadius: "5px",
                                boxSizing: "border-box",
                                paddingTop: "0px"

                            }}>
                                <img src={image} alt="VPS Image" style={{ width: "200px", height: "200px", borderRadius: "5px", marginLeft: "200px", border: "5px solid #ccc", padding: "10px" }} />
                            </div>
                        </div>

                        <div style={{ paddingLeft: '0px', display: 'flex', alignItems: 'center', marginTop: '-80px' }}>
                            <label htmlFor="renewalPeriod" style={{ paddingTop: '9px', marginRight: '20px' }}>Renewal Period:</label>
                            <select
                                id="renewalPeriod"
                                onChange={handleRenewPeriodChange}
                                name="renewalPeriod"
                                style={{
                                    transform: 'scale(1.1)',
                                    height: '30px',
                                    borderRadius: '5px',
                                    marginRight: '15px',
                                    width: '300px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <option value="1 Month">1 Month @ 750/-</option>
                                <option value="6 Month">6 Month @ 3500/-</option>
                                {/* Add more options as needed */}
                            </select>

                            <label htmlFor="paymentMode" style={{ paddingTop: '9px', marginRight: '20px', marginLeft: '40px' }}>Payment Mode:</label>
                            <select
                                id="paymentMode"
                                onChange={handlePaymentModeChange}
                                name="paymentMode"
                                style={{
                                    transform: 'scale(1.1)',
                                    height: '30px',
                                    borderRadius: '5px',
                                    marginRight: '10px',
                                    width: '325px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <option value="UPI">UPI</option>
                                <option value="GPAY">GPay</option>
                                <option value="PhonePe">PhonePe</option>
                                {/* Add more payment options if needed */}
                            </select>
                        </div>



                        <div style={{ display: "flex", alignItems: "center", marginTop: "7px" }}>
                            <label htmlFor="renew" style={{ paddingTop: "9px", marginRight: "10px", marginLeft: "10px" }}>Total Amount:</label>
                            <input type="text" value={totalAmount} readOnly style={{ width: "200px", height: "30px", borderRadius: "5px", border: "1px solid #ccc", fontWeight: "bold", padding: "10px" }} />
                            <label htmlFor="cancel" style={{ paddingTop: "9px", marginLeft: "15px" }}>GST(18%):</label>
                            <input type="text" value={gstAmount} readOnly style={{ width: "200px", height: "30px", borderRadius: "5px", border: "1px solid #ccc", fontWeight: "bold", padding: "10px" }} />
                            <label htmlFor="" style={{ paddingTop: "9px", paddingLeft: "25px" }}>Amount Payable:</label>
                            <input type="text" value={amountWithGst} style={{ width: "200px", height: "30px", borderRadius: "5px", border: "1px solid #ccc", fontWeight: "bold", padding: "10px" }} />
                        </div>

                        <div style={{ display: "flex", marginTop: "5px" }}>
                            <fieldset style={{
                                width: "64%",
                                padding: "5px",
                                borderRadius: "5px",
                                height: "200px", // Adjust height to fit content
                                boxSizing: "border-box",
                                fontFamily: "Arial, sans-serif"
                            }}>
                                <legend style={{ fontWeight: "bold", fontSize: "16px", color: "#32406D", marginBottom: "8px" }}>
                                    Billing Address
                                </legend>

                                {/* Row 1 */}
                                <div style={{ display: "flex", marginBottom: "8px" }}>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center", marginRight: "10px" }}>
                                        <label htmlFor="name" style={{ marginLeft: "15px" }}>Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "30px",
                                                borderRadius: "5px",
                                                marginLeft: "15px"
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center", marginLeft: "10px" }}>
                                        <label htmlFor="gst" style={{ marginRight: "10px", width: "200px" }}>GST (Optional):</label>
                                        <input
                                            type="text"
                                            id="gst"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "30px",
                                                borderRadius: "5px",
                                                marginLeft: "-18px"
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center", marginRight: "10px" }}>
                                        <label htmlFor="address" style={{ marginRight: "10px", width: "80px" }}>Address:</label>
                                        <textarea
                                            id="address"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "60px",
                                                borderRadius: "5px",
                                                resize: "none"
                                            }}
                                        ></textarea>
                                    </div>
                                    <div style={{ flex: "1", display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                            <label htmlFor="email" style={{ marginRight: "10px", width: "55px", marginLeft: "65px" }}>Email:</label>
                                            <input
                                                type="email"
                                                id="email"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "5px",
                                                    width: "100%",
                                                    marginLeft: "5px",
                                                    height: "30px",
                                                    borderRadius: "5px"
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <label htmlFor="phone" style={{ marginRight: "10px", width: "85px", marginLeft: "58px" }}>Mobile:</label>
                                            <input
                                                type="text"
                                                id="phone"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "5px",
                                                    width: "100%",
                                                    height: "30px",
                                                    marginLeft: "5px",
                                                    borderRadius: "5px"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div style={{ display: "flex", marginBottom: "10px" }}>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center", marginRight: "10px" }}>
                                        <label htmlFor="pincode" style={{ marginRight: "10px", width: "70px" }}>Pincode:</label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "30px",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center", marginRight: "10px" }}>
                                        <label htmlFor="city" style={{ marginRight: "10px", width: "70px" }}>City:</label>
                                        <input
                                            type="text"
                                            id="city"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "30px",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
                                        <label htmlFor="state" style={{ marginRight: "10px", width: "70px" }}>State:</label>
                                        <input
                                            type="text"
                                            id="state"
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                width: "100%",
                                                height: "30px",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <div style={{
                                width: "34%",
                                paddingLeft: "20px",
                                borderRadius: "5px",
                                marginRight: "10px",
                                boxSizing: "border-box",
                                fontFamily: "Arial, sans-serif"
                            }}>
                                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "15px", color: "#32406D" }}>
                                    Payment Instructions
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>UPI ID (Only If above QR Code fails):</div>
                                    <div style={{ fontSize: "14px", color: "#333" }}>9820986313@hdfcbank</div>
                                </div>

                                <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                                    <div style={{ fontWeight: "bold", marginRight: "5px" }}>Mobile:</div>
                                    <div style={{ fontSize: "14px", color: "#333" }}>9121861979</div>
                                </div>

                                <div style={{ marginBottom: "15px", lineHeight: "1.6" }}>
                                    <div style={{ fontWeight: "bold", }}>Instructions:</div>
                                    <div>
                                        <p style={{ color: "green", fontWeight: "bold" }}>PAY USING QR & FILL ACCURATE DETAILS FOR AN INSTANT/FAST RENEWAL</p>
                                        <p>Now you can pay the above-mentioned amount using any UPI-supported app (e.g., PayTM, PhonePe, Google Pay) or directly from your bank app. Just scan the QR code and pay.</p>
                                        <p>After successful payment, please fill in the Transaction ID below and submit for renewal. Renewal will be processed only for successful transactions, and it may take a few minutes to reflect the renewal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <fieldset style={{ width: "64%", padding: "5px", borderRadius: "2px", marginTop: "-160px" }}>
                            <legend style={{ fontSize: "16px", marginBottom: "10px", color: "#32406D", fontWeight: "bold" }}>
                                Payment Details
                            </legend>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <label htmlFor="name" style={{ marginRight: "30px", width: "210px" }}>Payment Txn No/Order Id:</label>
                                <input
                                    type="number"
                                    value={orderId}
                                    onChange={handleInputChange}
                                    // id="name"
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "5px",
                                        width: "250px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        marginRight: "20px",
                                        marginLeft: "-45px"
                                    }}
                                />
                                <button onClick={payments}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: paymentStatus === 'success' ? 'green' :
                                            paymentStatus === 'error' ? 'red' :
                                                '#32406D',
                                        color: "white", height: "35px", border: "none", width: "180px", marginLeft: "10px", borderRadius: "5px"
                                    }}>
                                    {getButtonContent()}
                                </button>
                            </div>
                            <div>
                                <h5 style={{ color: "red", marginLeft: "200px", marginTop: "-10px" }}>Enter 12 Digit UPI/UTR Transaction ID</h5>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "110px" }}>
                                <label htmlFor="pincode" style={{ marginRight: "10px", width: "120px", marginTop: "10px", marginLeft: "-25px" }}>Amount Paid:</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    value={(payment)}
                                    onChange={handleAmountChange}
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "5px",
                                        width: "250px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        marginRight: "20px",
                                        marginLeft: "-20px"
                                    }}
                                />
                            </div>
                            <div>
                                <h5 style={{ color: "red", marginLeft: "200px", marginTop: "-5px" }}>Submitting Invalid/Fraud Transaction can Disable the User ID permanently</h5>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Subscription;