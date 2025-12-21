import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase";
import { Card } from "@/components/ui/card";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WatermarkedVideo from "../components/WatermarkedVideo";
import { motion } from "framer-motion";

export default function Course() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("order_index");

      setUser(profile);
      setLessons(lessonsData || []);

      // Normalize incoming tier from DB to our local tab keys
      const userTier = profile?.subscription_tier || "none";
      if (userTier === "vip" || userTier === "lifetime") {
        setActiveTab("lifetime");
      } else if (userTier !== "none") {
        setActiveTab(userTier);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin =
    user?.role === "admin" || user?.email === "codydankdabs@gmail.com";
  const currentTier = user?.subscription_tier || "none";

  const hasAccess = (tabKey) => {
    if (isAdmin) return true;
    const tierOrder = { none: 0, basic: 1, premium: 2, vip: 3, lifetime: 3 };
    const dbTierKey = tabKey === "lifetime" ? "vip" : tabKey;

    const userLevel = tierOrder[currentTier] || 0;
    const requiredLevel = tierOrder[dbTierKey] || 0;
    return userLevel >= requiredLevel;
  };

  const tierConfig = {
    basic: {
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      name: "Basic Tier",
      price: "$50/mo",
    },
    premium: {
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      name: "Premium Tier",
      price: "$100/mo",
    },
    lifetime: {
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      name: "VIP Access Tier",
      price: "$300",
    },
  };

  const renderLessonsList = (tierKey) => {
    const config = tierConfig[tierKey];
    // Map 'lifetime' tab to 'vip' database field
    const dbKey = tierKey === "lifetime" ? "vip" : tierKey;
    const filtered = lessons.filter((l) => l.required_tier === dbKey);

    if (filtered.length === 0)
      return (
        <div className="text-center py-8 text-slate-500">No lessons yet</div>
      );

    return (
      <div className="space-y-2">
        {filtered.map((lesson, index) => {
          const isSelected = selectedLesson?.id === lesson.id;
          const isAccessible = hasAccess(tierKey);

          return (
            <button
              key={lesson.id}
              onClick={() => isAccessible && setSelectedLesson(lesson)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-[1.02]`
                  : isAccessible
                  ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700"
                  : "bg-slate-800/30 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-white/20" : "bg-slate-700"
                  }`}
                >
                  {!isAccessible ? (
                    <Lock className="w-4 h-4" />
                  ) : isSelected ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{lesson.title}</h3>
                  <p className="text-xs opacity-70">
                    {lesson.duration || "10:00"}
                  </p>
                </div>
                <PlayCircle
                  className={`w-5 h-5 ${
                    isSelected ? "fill-white" : "text-slate-500"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Nav Tabs */}
        <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-2">
          {Object.entries(tierConfig).map(([key, cfg], index, array) => (
            <React.Fragment key={key}>
              <button
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
                  activeTab === key
                    ? `bg-gradient-to-r ${cfg.color} shadow-lg text-white`
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <cfg.icon className="w-4 h-4" />
                {key === "lifetime"
                  ? "VIP Access"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
                <span className="text-xs opacity-80">{cfg.price}</span>
              </button>
              {index < array.length - 1 && (
                <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6">
          {/* Main Video Area */}
          <Card className="overflow-hidden border-slate-800 bg-slate-900 shadow-xl p-6 min-h-[600px] flex flex-col">
            {selectedLesson &&
            activeTab ===
              (selectedLesson.required_tier === "vip"
                ? "lifetime"
                : selectedLesson.required_tier) ? (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">
                  {selectedLesson.title}
                </h1>
                <WatermarkedVideo
                  videoUrl={selectedLesson.video_url}
                  userEmail={user?.email}
                  className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
                />
                <div className="bg-sky-900/20 border border-sky-800/50 p-6 rounded-xl flex gap-3">
                  <Lock className="text-sky-400 w-5 h-5 mt-1" />
                  <p className="text-sm text-sky-100/80">
                    Protected Content: This video is watermarked for{" "}
                    <strong>{user?.email}</strong>. Unauthorized sharing or
                    recording is strictly prohibited and results in legal
                    action.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <PlayCircle className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-lg">
                  Select a lesson from the {activeTab} list to begin
                </p>
              </div>
            )}
          </Card>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <Card className="border-slate-800 bg-slate-900 overflow-hidden flex flex-col shadow-xl">
              <div
                className={`p-4 bg-gradient-to-r ${tierConfig[activeTab].color} text-white`}
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {React.createElement(tierConfig[activeTab].icon, {
                    className: "w-5 h-5",
                  })}
                  {tierConfig[activeTab].name}
                </h2>
              </div>
              <div className="p-4 overflow-y-auto max-h-[600px]">
                {hasAccess(activeTab) ? (
                  renderLessonsList(activeTab)
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="font-bold text-white text-lg">
                      Tier Locked
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Upgrade your account to unlock these professional lessons.
                    </p>
                    <Button
                      onClick={() => navigate("/purchase")}
                      className="w-full bg-white text-black hover:bg-slate-200 font-bold"
                    >
                      Upgrade to Unlock
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
