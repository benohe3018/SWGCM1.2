import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      element={
        user && allowedRoles.includes(user.role) ? (
          <Component />
        ) : (
          <Navigate to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;


