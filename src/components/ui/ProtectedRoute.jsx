/* eslint-disable react/prop-types */
import { useUser } from "@/pages/Authentication/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { isPending, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated, navigate]);

  if (isPending) return <FullPageLoader />; // Loading spinner while session restores

  // Render children only if authenticated
  return isAuthenticated ? children : null;
}
