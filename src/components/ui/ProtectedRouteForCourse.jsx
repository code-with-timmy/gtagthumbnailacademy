import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/pages/Authentication/useUser";
import { Loader2 } from "lucide-react";

function ProtectedRouteForCourse() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // If loading is finished, user is logged in, but has NO tier
    if (!isLoading && !user?.subscription_tier) {
      navigate("/purchase", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-slate-400 font-medium">Checking Subscription...</p>
      </div>
    );
  }

  // If the user has a tier, we render the 'Outlet'
  // which will be Course, Assets, or Upload
  return user?.subscription_tier ? <Outlet /> : null;
}

export default ProtectedRouteForCourse;
