import React from 'react';
import { useLocation, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const PrivateRoute = ({ children }: any) => {

  const dispatch = useAppDispatch();

  const { username } = useAppSelector(state => state.userReducer.user)

  return username ? children : <Navigate to="/explore" />;
};

export default PrivateRoute;