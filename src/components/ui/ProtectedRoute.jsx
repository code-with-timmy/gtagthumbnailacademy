import { useUser } from "@/pages/Authentication/useUser";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import FullPageLoader from "./FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { isPending, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      // Pass the current location to the login page state
      navigate("/login", { state: { from: location } });
    }
  }, [isPending, isAuthenticated, navigate, location]);

  if (isPending) return <FullPageLoader />;

  return isAuthenticated ? children : null;
}
