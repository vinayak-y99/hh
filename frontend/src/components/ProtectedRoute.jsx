import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from "universal-cookie";



const ProtectedRoute = ({ isSubscribed, element }) => {
    const cookies = new Cookies();
    const subscriptionType = cookies.get('subscription_type');


  if (isSubscribed === null) {
    return <div>Loading...</div>;
  }

  return (subscriptionType === "Active" || subscriptionType === "Free_Trial") 
    ? element 
    : <Navigate to="/Subscription" />;
};

export default ProtectedRoute;
