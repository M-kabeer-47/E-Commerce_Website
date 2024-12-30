import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const ProtectedRoute = ({ children }) => {
  const token  = localStorage.getItem("uid");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (!token && new Date().getTime() > tokenExpiry) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
