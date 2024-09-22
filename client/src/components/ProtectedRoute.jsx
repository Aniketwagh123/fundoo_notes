import { Navigate } from "react-router-dom";
import { getAccessToken } from "../services/authServices";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
