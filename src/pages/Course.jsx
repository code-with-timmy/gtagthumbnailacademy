import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import TierTabs from "@/course/TierTabs";
import VideoPlayer from "@/course/VideoPlayer";
import LessonList from "@/course/LessonList";

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

      // 2. Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setUser(profile);

      // 3. Simple Access Logic
      const isAdmin = profile.role === "admin";
      const hasPlan =
        profile.subscription_tier && profile.subscription_tier !== "none";

      // Redirect if not admin AND has no plan
      if (!isAdmin && !hasPlan) {
        navigate("/purchase");
        return;
      }

      // 4. Set Tier View
      // If user has a plan, show that plan's content. If admin has no plan, default to 'basic'.
      const initialTier = hasPlan ? profile.subscription_tier : "basic";
      setActiveTier(initialTier);

      // 5. Fetch Lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // 6. Select First Lesson for the active tier
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

  const isAdmin = user?.role === "admin";

  const canAccessTier = (tier) => {
    if (isAdmin) return true;
    const currentTier = user?.subscription_tier;
    if (!currentTier || currentTier === "none") return false;

    const tierOrder = { basic: 1, premium: 2, vip: 3 };
    return (tierOrder[currentTier] || 0) >= (tierOrder[tier] || 0);
  };

  const handleTierChange = (tier) => {
    if (canAccessTier(tier)) {
      setActiveTier(tier);
      const tierLessons = lessons.filter((l) => l.required_tier === tier);
      setSelectedLesson(tierLessons.length > 0 ? tierLessons[0] : null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Final Safety Check: If user is not admin and tier is null/none, show Lock
  const hasAccess =
    isAdmin || (user?.subscription_tier && user?.subscription_tier !== "none");

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md bg-white/5 border border-white/10">
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Required</h2>
          <p className="text-gray-400 mb-6">
            You need an active plan to view this course.
          </p>
          <Button
            onClick={() => navigate("/purchase")}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-[#0a0e1a]">
      <div className="max-w-[1800px] mx-auto px-8">
        <div className="mb-16 text-center">
          <h1 className="coolvetica text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-widest">
            COURSE CONTENT
          </h1>
          <p className="text-gray-400 text-xl">
            Select your tier and start learning
          </p>
        </div>

        <TierTabs
          activeTier={activeTier}
          setActiveTier={handleTierChange}
          userTier={isAdmin ? "vip" : user?.subscription_tier || "basic"}
          onUpgradeClick={() => navigate("/purchase")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2">
            <VideoPlayer lesson={selectedLesson} user={user} />
          </div>
          <div className="lg:col-span-1">
            <LessonList
              lessons={lessons.filter((l) => l.required_tier === activeTier)}
              activeTier={activeTier}
              selectedLesson={selectedLesson}
              onSelectLesson={setSelectedLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
