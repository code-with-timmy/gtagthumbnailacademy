import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Lock } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function AccessGate({ children, requiredAccess = "course" }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await base44.functions.invoke('checkAccess');
        const { hasAccess: access, hasCourseAccess, hasAssetsAccess } = response.data;

        if (requiredAccess === "course") {
          setHasAccess(hasCourseAccess);
        } else if (requiredAccess === "assets") {
          setHasAccess(hasAssetsAccess);
        } else {
          setHasAccess(access);
        }

        // Redirect if no access
        if (!access) {
          setTimeout(() => {
            window.location.href = createPageUrl("Purchase");
          }, 100);
        }
      } catch (error) {
        console.error("Access check error:", error);
        setHasAccess(false);
        setTimeout(() => {
          window.location.href = createPageUrl("Purchase");
        }, 100);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [requiredAccess]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Required</h2>
          <p className="text-slate-400">Redirecting to purchase page...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}