import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = document.cookie.includes("accessToken=");

  // If no token → redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
