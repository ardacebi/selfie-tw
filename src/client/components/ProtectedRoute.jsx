import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

/**
 * A route wrapper component that redirects unauthenticated users to the home page.
 * Only authenticated users can access routes wrapped with this component.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useContext(CurrentUserContext);
  const location = useLocation();

  // If we're still loading the authentication state, don't redirect yet
  if (isLoading) {
    //? spinner?
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // User is authenticated - render the children components
  return children;
};

export default ProtectedRoute;
