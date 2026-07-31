import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardSkeleton from "../components/DashboardSkeleton.jsx";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/verify`,
          {
            withCredentials: true,
          }
        );

        setIsAuthenticated(data.success);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return <DashboardSkeleton />;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}

export default ProtectedRoute;