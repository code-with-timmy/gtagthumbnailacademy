import { useUser } from "@/pages/Authentication/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <FullPageLoader />; // Your spinner

  return isAuthenticated ? children : null;
}
