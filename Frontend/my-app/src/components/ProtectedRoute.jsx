import { Navigate } from "react-router-dom";

import { useEffect, useState } from "react";


const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://kratika-deployed-project.onrender.com/user/Home", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

 if (isAuth === null) {
    return <p>Loading...</p>;  
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
