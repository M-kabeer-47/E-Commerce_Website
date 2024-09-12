import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const ProtectedRoute = ({ children }) => {
  const token  = Cookies.get("uid");


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
