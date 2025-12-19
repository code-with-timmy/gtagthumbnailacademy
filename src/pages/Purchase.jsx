import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Zap,
  Crown,
  Star,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPlans } from "@/api/apiAuth";

const ICON_MAP = {
  Zap: Zap,
  Crown: Crown,
  Star: Star,
};

export default function Purchase() {
  const { user, isLoading: isLoadingUser } = useUser();
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [kofiEmail, setKofiEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if they have an actual paid tier
    const paidTiers = ["basic", "premium", "vip"];
    if (!isLoadingUser && paidTiers.includes(user?.subscription_tier)) {
      navigate("/course");
    }
  }, [user, isLoadingUser, navigate]);

  useEffect(() => {
    if (user?.email) {
      setKofiEmail(user.email);
    }
  }, [user]);

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });
  // const plans = [
  //   {
  //     id: "basic",
  //     name: "Basic Access",
  //     price: 25,
  //     description: "Best value for Beginners",
  //     features: [
  //       "Minimum Course access",
  //       "3 video lessons /monthly",
  //       "7 video lessons & 150+ Assets",
  //       "Tools & Software Training",
  //       "Monthly updates",
  //     ],
  //     icon: Zap,
  //     color: "from-blue-500 to-cyan-500",
  //     kofiUrl: "https://ko-fi.com/summary/e566a237-f241-4bf8-9205-3ca12a48c753",
  //   },
  //   {
  //     id: "premium",
  //     name: "Premium Access",
  //     price: 50,
  //     description: "Best Value for practice & Serious learning",
  //     features: [
  //       "Everything in Basic",
  //       "5 video lessons /monthly",
  //       "Priority support",
  //       "Exclusive resources",
  //       "Access to 350+ Assets",
  //       "Access to Half course Lessons",
  //     ],
  //     icon: Crown,
  //     color: "from-purple-500 to-pink-500",
  //     popular: true,
  //     kofiUrl: "https://ko-fi.com/summary/fd636fa0-90d4-4279-98a4-da5403f9287b",
  //   },
  //   {
  //     id: "vip",
  //     name: "VIP Access",
  //     price: 125,
  //     description: "Best investment to save money and learn true skill",
  //     features: [
  //       "Everything in Premium",
  //       "Access to the Entire Course",
  //       "Exclusive thumbnail assets",
  //       "1 on 1 Live Voice Calling (1 Hour)",
  //       "Private Discord access",
  //       "Free Monthly Updates",
  //     ],
  //     icon: Star,
  //     color: "from-yellow-500 to-orange-500",
  //     kofiUrl: "https://ko-fi.com/summary/63c6e1b7-faee-4ca9-a419-5bdaa081700b",
  //   },
  // ];

  const handlePlanSelect = async (plan) => {
    // const isAuth = await base44.auth.isAuthenticated();
    // if (!isAuth) {
    //   base44.auth.redirectToLogin(window.location.pathname);
    //   return;
    // }
    console.log(plan);
    console.log(plan.kofiUrl);
    window.open(plan.kofiUrl, "_blank");
  };

  // TEMPORARY LOCAL MOCK
  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // 1. Find the payment the webhook created
      const { data: payment, error: payError } = await supabase
        .from("payments")
        .select("tier, kofi_email") // These must match the SQL names above
        .eq("transaction_id", transactionId.trim())
        .eq("kofi_email", kofiEmail.trim()) // Adding email check for extra security
        .single();

      if (!payment) {
        throw new Error(
          "Payment not found. Please ensure the Email and Transaction ID match your Ko-fi receipt."
        );
      }

      // 2. Update the profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_tier: payment.tier, // Matches your user object structure
          kofi_email: payment.kofi_email,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setVerifyMessage({
        type: "success",
        text: "Access granted! Enjoy the course.",
      });
      setTimeout(() => navigate("/course"), 2000);
    } catch (err) {
      setVerifyMessage({ type: "error", text: err.message });
    } finally {
      setIsVerifying(false);
    }
  };
  // const handleVerify = async () => {
  //   if (!kofiEmail.trim() || !transactionId.trim()) {
  //     setVerifyMessage({ type: "error", text: "Please fill in both fields" });
  //     return;
  //   }

  //   setIsVerifying(true);
  //   setVerifyMessage(null);

  //   try {
  //     const response = await base44.functions.invoke("verifyKofiManual", {
  //       kofi_email: kofiEmail.trim(),
  //       transaction_id: transactionId.trim(),
  //     });

  //     if (response.data.success) {
  //       setVerifyMessage({ type: "success", text: response.data.message });
  //       setTimeout(() => {
  //         window.location.href = createPageUrl("Course");
  //       }, 1500);
  //     } else {
  //       setVerifyMessage({ type: "error", text: response.data.message });
  //       setIsVerifying(false);
  //     }
  //   } catch (error) {
  //     setVerifyMessage({
  //       type: "error",
  //       text:
  //         error.response?.data?.message ||
  //         "Verification failed. Please try again.",
  //     });
  //     setIsVerifying(false);
  //   }
  // };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  // If no user is found at all, redirect to login instead of showing a blank page
  if (!user) {
    navigate("/login");
    return null;
  }
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start creating thumbnails that get millions of clicks. All plans
            include full course access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans?.map((plan) => {
            // 1. Convert the string from DB to a Component
            const IconComponent = ICON_MAP[plan.icon_name] || Zap;

            return (
              <Card
                key={plan.id}
                className={`relative border-slate-800 bg-slate-900 hover:border-sky-500/50 transition-all ${
                  plan.is_popular ? "ring-2 ring-sky-500 scale-105" : ""
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color_classes} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full bg-gradient-to-r ${plan.color_classes} hover:opacity-90 text-white font-bold py-6`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Verification Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-center text-white text-2xl">
                Already Purchased?
              </CardTitle>
              <p className="text-center text-slate-400 mt-2">
                Verify your Ko-fi purchase to unlock your access
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showVerifyForm ? (
                <Button
                  onClick={() => setShowVerifyForm(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-lg"
                >
                  I've Completed My Purchase — Verify Now
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-300">
                      ⏱️ <strong>Just paid?</strong> Ko-fi can take up to 2
                      minutes to sync. If verification fails, try again shortly.
                    </p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      ℹ️ <strong>Use the same email you used on Ko-fi.</strong>{" "}
                      Find your transaction ID in your Ko-fi confirmation email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kofiEmail" className="text-slate-300">
                      Ko-fi Purchase Email
                    </Label>
                    <Input
                      id="kofiEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={kofiEmail}
                      onChange={(e) => setKofiEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                      disabled={isVerifying}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="text-slate-300">
                      Transaction ID / Ref Code
                    </Label>
                    <Input
                      id="transactionId"
                      placeholder="e.g., Y8vo32345abc"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                      disabled={isVerifying}
                    />
                    <p className="text-xs text-slate-500">
                      Found in your Ko-fi confirmation email (may start with
                      "Ref:")
                    </p>
                  </div>

                  {verifyMessage && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-lg ${
                        verifyMessage.type === "success"
                          ? "bg-green-500/10 border border-green-500/30"
                          : "bg-red-500/10 border border-red-500/30"
                      }`}
                    >
                      {verifyMessage.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p
                        className={`text-sm ${
                          verifyMessage.type === "success"
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {verifyMessage.text}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Now"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowVerifyForm(false);
                        setVerifyMessage(null);
                        setTransactionId("");
                      }}
                      variant="outline"
                      className="border-slate-700 text-slate-300"
                      disabled={isVerifying}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
