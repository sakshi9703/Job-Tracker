import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/verify`,
          {
            withCredentials: true,
          }
        );

        if (isMounted) {
          setIsAuthenticated(data.success);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Authentication is still being checked
  if (isAuthenticated === null) {
    return (
      <div className="auth-check-loading">
        <div className="auth-check-spinner" />
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return children;
}

export default ProtectedRoute;