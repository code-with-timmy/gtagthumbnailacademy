import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star, Crown, Zap } from "lucide-react";
import supabase from "@/supabase"; // Import your Supabase client

// 1. Hook to check user's access tier from Supabase
export function useAccessTier() {
  const [tier, setTier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setTier(null);
          setIsLoading(false);
          return;
        }

        // Admin Bypass
        if (user.email === "codydankdabs@gmail.com") {
          setTier("lifetime");
          setIsLoading(false);
          return;
        }

        // Fetch tier from your 'profiles' table
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();

        setTier(profile?.subscription_tier || null);
      } catch (error) {
        console.error("Error checking access:", error);
        setTier(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  return { tier, isLoading };
}

// 2. The Logic: Does current tier beat the required tier?
export function hasAccess(userTier, requiredTier) {
  if (!requiredTier || requiredTier === "free") return true;
  if (!userTier) return false;

  const tierHierarchy = { basic: 1, premium: 2, lifetime: 3 };
  return (tierHierarchy[userTier] || 0) >= (tierHierarchy[requiredTier] || 0);
}

// 3. The UI: What users see when they haven't paid
export function AccessDenied({ requiredTier }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [kofiEmail, setKofiEmail] = useState("");

  const tierInfo = {
    basic: {
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      name: "Basic",
      url: "https://ko-fi.com/summary/0cb722ac-48fe-4aeb-98ed-caed13e58e80",
    },
    premium: {
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      name: "Premium",
      url: "https://ko-fi.com/summary/bcc1e1ad-3812-4414-a936-e0d8695fb7e0",
    },
    lifetime: {
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      name: "VIP",
      url: "https://ko-fi.com/summary/d19c5b13-ceeb-47ef-9ef7-e2f67f7421a6",
    },
  };

  const info = tierInfo[requiredTier] || tierInfo.basic;

  const handleVerify = async () => {
    if (!kofiEmail.includes("@")) return alert("Enter a valid email");
    setIsSyncing(true);

    // This calls your Vercel Edge Function or API to link the purchase
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-purchase",
        {
          body: { email: kofiEmail },
        }
      );
      if (error) throw error;
      alert("Success! Access granted.");
      window.location.reload();
    } catch (err) {
      alert("Purchase not found. Please ensure you used this email on Ko-fi.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900 text-center p-8">
      <div
        className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <Lock className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {info.name} Access Required
      </h3>
      <p className="text-slate-400 mb-6 text-sm">
        Unlock this lesson by subscribing or verifying a previous purchase.
      </p>

      <div className="space-y-3">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500"
          onClick={() => window.open(info.url, "_blank")}
        >
          ☕ Get Access on Ko-fi
        </Button>
        <div className="pt-4 border-t border-slate-800">
          <input
            type="email"
            placeholder="Ko-fi Email"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 mb-2 text-sm"
            value={kofiEmail}
            onChange={(e) => setKofiEmail(e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={handleVerify}
            disabled={isSyncing}
          >
            {isSyncing ? "Verifying..." : "Verify Previous Purchase"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
