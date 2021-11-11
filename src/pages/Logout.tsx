import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/auth";

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  });

  return <Navigate to="/" />;
};

export default Logout;
