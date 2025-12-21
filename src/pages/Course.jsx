import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase"; // Your supabase client import
import { Loader2, Lock, PlayCircle, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import WatermarkedVideo from "../components/WatermarkedVideo";

// Note: I'm keeping the internal components (TierTabs, VideoPlayer, LessonList)
// logic inside here to ensure it works with your new state structure.

export default function Course() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTier, setActiveTier] = useState("basic");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // 1. Get Session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate("/login");
        return;
      }

      // 2. Fetch Profile (Checks subscription_tier)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setUser(profile);

      // 3. Fetch Lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // 4. Access Redirect Logic
      const isAdmin =
        profile.role === "admin" || profile.email === "codydankdabs@gmail.com";
      const hasPlan =
        profile.subscription_tier && profile.subscription_tier !== "none";

      if (!isAdmin && !hasPlan) {
        navigate("/purchase");
        return;
      }

      // 5. Initial Tab Setup
      // Set the default tab to the user's current tier
      const initialTier = hasPlan ? profile.subscription_tier : "basic";
      setActiveTier(initialTier);

      // 6. Select First Lesson
      const tierLessons = (lessonsData || []).filter(
        (l) => l.required_tier === initialTier
      );
      if (tierLessons.length > 0) {
        setSelectedLesson(tierLessons[0]);
      }
    } catch (error) {
      console.error("Error loading course:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin =
    user?.role === "admin" || user?.email === "codydankdabs@gmail.com";

  const canAccessTier = (tierName) => {
    if (isAdmin) return true;
    const currentTier = user?.subscription_tier;
    const tierOrder = { none: 0, basic: 1, premium: 2, vip: 3 };
    return (tierOrder[currentTier] || 0) >= (tierOrder[tierName] || 0);
  };

  const handleTierChange = (tierName) => {
    setActiveTier(tierName);
    const tierLessons = lessons.filter((l) => l.required_tier === tierName);
    // Only auto-select if user has access, otherwise let the lock screen show
    if (canAccessTier(tierName)) {
      setSelectedLesson(tierLessons.length > 0 ? tierLessons[0] : null);
    } else {
      setSelectedLesson(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 text-white"
    >
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Tier Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["basic", "premium", "vip"].map((t) => (
            <button
              key={t}
              onClick={() => handleTierChange(t)}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTier === t
                  ? "bg-sky-600 shadow-[0_0_20px_rgba(2,132,199,0.3)]"
                  : "bg-slate-900 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {t === "basic" && <Zap className="w-4 h-4" />}
              {t === "premium" && <Crown className="w-4 h-4" />}
              {t === "vip" && <Star className="w-4 h-4" />}
              <span className="capitalize">{t} Tier</span>
              {!canAccessTier(t) && <Lock className="w-3 h-3 opacity-50" />}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {!canAccessTier(activeTier) ? (
              <div className="aspect-video bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 capitalize">
                  {activeTier} Access Required
                </h2>
                <p className="text-slate-400 mb-8 max-w-md">
                  You are currently on the {user?.subscription_tier || "Free"}{" "}
                  plan. Upgrade to watch these exclusive lessons.
                </p>
                <Button
                  onClick={() => navigate("/purchase")}
                  className="bg-sky-600 hover:bg-sky-700 px-8 py-6 text-lg"
                >
                  Upgrade Now
                </Button>
              </div>
            ) : selectedLesson ? (
              <div className="space-y-6">
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                  <WatermarkedVideo
                    videoUrl={selectedLesson.video_url}
                    userEmail={user?.email}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {selectedLesson.title}
                  </h1>
                  <p className="text-slate-400 text-lg">
                    {selectedLesson.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center text-slate-500 italic">
                Select a lesson to begin
              </div>
            )}
          </div>

          {/* Lesson List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-sky-500" />
                  Course Content
                </h3>
              </div>
              <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
                {lessons
                  .filter((l) => l.required_tier === activeTier)
                  .map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${
                        selectedLesson?.id === lesson.id
                          ? "bg-sky-600/10 border border-sky-500/50 text-white"
                          : "hover:bg-slate-800 border border-transparent text-slate-400"
                      }`}
                    >
                      <span className="font-mono text-sm opacity-50 mt-1">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="text-left">
                        <div
                          className={`font-semibold ${
                            selectedLesson?.id === lesson.id
                              ? "text-sky-400"
                              : "text-slate-200"
                          }`}
                        >
                          {lesson.title}
                        </div>
                        <div className="text-xs opacity-60 mt-1">
                          {lesson.duration || "10:00"}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
