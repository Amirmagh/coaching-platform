import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, getAdminRedirectPath } from '../utils/adminPermissions';

/**
 * Route guard that only allows admin/moderator users through. Unauthenticated
 * users go to /login; authenticated non-admins go back to the home page.
 * Wrap any admin page element with this component in App.jsx.
 */
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="animate-spin text-2xl">⊙</span>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return <Navigate to={getAdminRedirectPath(user)} replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
