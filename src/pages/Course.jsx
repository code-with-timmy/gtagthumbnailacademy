import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  Zap,
  Crown,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import WatermarkedVideo from "../components/WatermarkedVideo";
import {
  useAccessTier,
  hasAccess,
  AccessDenied,
} from "../components/AccessCheck";
import { motion } from "framer-motion";
import supabase from "@/supabase";

export default function Course() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [user, setUser] = useState(null);
  // const { tier, isLoading: isLoadingTier } = useAccessTier();\

  // Replace the hardcoded variables with this:
  const { data: profile, isLoading: isLoadingTier } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();
      return data;
    },
  });

  const tier = profile?.subscription_tier; // This will now be 'premium' after verification

  // Load user to check if admin
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Auto-set active tab based on user's tier
  React.useEffect(() => {
    if (tier) {
      setActiveTab(tier);
    }
  }, [tier]);

  // const { data: lessons, isLoading } = useQuery({
  //   queryKey: ["lessons"],
  //   queryFn: () =>
  //     base44.entities.Lesson.filter({ is_published: true }, "order"),
  //   initialData: [],
  // });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => [
      {
        id: "dummy-1",
        title: "How to Design High CTR Thumbnails",
        description: "Testing the player with a sample video.",
        video_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        required_tier: "premium", // Matches your verified state
        is_published: true,
        order: 1,
      },
      {
        id: "dummy-2",
        title: "Color Theory for Content Creators",
        description: "Another test video to check sidebar switching.",
        video_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        required_tier: "premium",
        is_published: true,
        order: 2,
      },
    ],
    initialData: [],
  });
  // Group lessons by tier
  const basicLessons = lessons.filter((l) => l.required_tier === "basic");
  const premiumLessons = lessons.filter((l) => l.required_tier === "premium");
  const lifetimeLessons = lessons.filter((l) => l.required_tier === "lifetime");

  // Auto-select first accessible lesson from active tab
  React.useEffect(() => {
    if (lessons.length > 0) {
      const tabLessons = lessons.filter((l) => l.required_tier === activeTab);
      const firstAccessible = tabLessons.find((l) =>
        hasAccess(tier, l.required_tier)
      );
      if (
        firstAccessible &&
        (!selectedLesson || selectedLesson.required_tier !== activeTab)
      ) {
        setSelectedLesson(firstAccessible);
      }
    }
  }, [lessons, tier, activeTab]);

  // Handle video end - play next lesson in same tier
  const handleVideoEnd = () => {
    const tabLessons = lessons.filter(
      (l) => l.required_tier === activeTab && hasAccess(tier, l.required_tier)
    );
    const currentIndex = tabLessons.findIndex(
      (l) => l.id === selectedLesson?.id
    );
    if (currentIndex !== -1 && currentIndex < tabLessons.length - 1) {
      setSelectedLesson(tabLessons[currentIndex + 1]);
    }
  };

  const handleLessonClick = (lesson) => {
    if (
      hasAccess(tier, lesson.required_tier) &&
      lesson.required_tier === activeTab
    ) {
      setSelectedLesson(lesson);
    }
  };

  const tierConfig = {
    basic: {
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      name: "Basic Tier",
      price: "$50/month",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    premium: {
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      name: "Premium Tier",
      price: "$100/month",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
    },
    lifetime: {
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      name: "VIP Access Tier",
      price: "$300 one-time",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
    },
  };

  const renderLessonsList = (lessonsList, tierKey) => {
    const config = tierConfig[tierKey];
    const Icon = config.icon;
    const hasAccess =
      tier &&
      ((tierKey === "basic" &&
        ["basic", "premium", "lifetime"].includes(tier)) ||
        (tierKey === "premium" && ["premium", "lifetime"].includes(tier)) ||
        (tierKey === "lifetime" && tier === "lifetime"));

    return (
      <div className="space-y-2">
        {lessonsList.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <PlayCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No lessons in this tier yet</p>
          </div>
        ) : (
          lessonsList.map((lesson, index) => {
            const isAccessible = hasAccess;
            const isSelected = selectedLesson?.id === lesson.id;

            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                disabled={!isAccessible}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-[1.02]`
                    : isAccessible
                    ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50"
                    : "bg-slate-800/30 border border-slate-700/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-white/20"
                        : isAccessible
                        ? "bg-slate-700"
                        : "bg-slate-800"
                    }`}
                  >
                    {!isAccessible ? (
                      <Lock className="w-4 h-4 text-slate-500" />
                    ) : isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold mb-1 ${
                        isSelected
                          ? "text-white"
                          : isAccessible
                          ? "text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                    {lesson.duration && (
                      <p
                        className={`text-sm ${
                          isSelected ? "text-white/80" : "text-slate-400"
                        }`}
                      >
                        {lesson.duration}
                      </p>
                    )}
                  </div>
                  {isAccessible ? (
                    <PlayCircle
                      className={`w-5 h-5 flex-shrink-0 ${
                        isSelected ? "text-white fill-white" : "text-slate-500"
                      }`}
                    />
                  ) : (
                    <Lock className="w-5 h-5 flex-shrink-0 text-slate-600" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    );
  };

  // Block access for non-admin users without a tier
  if (
    !isLoadingTier &&
    !tier &&
    user?.role !== "admin" &&
    user?.email !== "codydankdabs@gmail.com"
  ) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-slate-950 flex items-center justify-center px-4"
      >
        <div className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Purchase Required
          </h1>
          <p className="text-xl text-slate-400">
            Get access to professional thumbnail design lessons that will
            transform your channel
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tier Navigation */}
        <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === "basic"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            Basic
            <span className="text-xs opacity-80">$50/mo</span>
          </button>
          <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <button
            onClick={() => setActiveTab("premium")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === "premium"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Crown className="w-4 h-4" />
            Premium
            <span className="text-xs opacity-80">$100/mo</span>
          </button>
          <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <button
            onClick={() => setActiveTab("lifetime")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
              activeTab === "lifetime"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Star className="w-4 h-4" />
            VIP Access
            <span className="text-xs opacity-80">$300</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6 h-[calc(100vh-140px)]">
          {/* Video Player Section */}
          <div className="flex flex-col min-h-0">
            <Card className="overflow-hidden border-slate-800 bg-slate-900 shadow-xl flex-1 flex flex-col max-h-full">
              {isLoadingTier ? (
                <div className="aspect-video bg-slate-950 flex items-center justify-center p-8">
                  <div className="text-center text-slate-400">
                    <Skeleton className="w-full h-full bg-slate-800" />
                  </div>
                </div>
              ) : !tier ? (
                <div className="p-6">
                  <AccessDenied requiredTier="basic" />
                </div>
              ) : selectedLesson &&
                selectedLesson.required_tier === activeTab ? (
                hasAccess(tier, selectedLesson.required_tier) ? (
                  <div className="space-y-6 p-6">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {selectedLesson.title}
                      </h1>
                      {selectedLesson.description && (
                        <p className="text-slate-400">
                          {selectedLesson.description}
                        </p>
                      )}
                    </div>

                    <WatermarkedVideo
                      videoUrl={selectedLesson.video_url}
                      className="aspect-video bg-black rounded-xl overflow-hidden"
                      onVideoEnd={handleVideoEnd}
                    />

                    <div className="bg-gradient-to-r from-sky-900/30 to-blue-900/30 border border-sky-800/50 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-white mb-1">
                            Protected Content
                          </h3>
                          <p className="text-[#ffffff] text-sm">
                            This video is watermarked with your account
                            information and moves dynamically to prevent
                            unauthorized sharing or screen recording. The
                            content is licensed exclusively to you. Please
                            Remember Sending any videos Or Sharing any
                            Information from This course WILL Get you Into a
                            Lawsuit & Be Sued!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <AccessDenied requiredTier={selectedLesson.required_tier} />
                  </div>
                )
              ) : (
                <div className="aspect-video bg-slate-950 flex items-center justify-center p-8">
                  <div className="text-center text-slate-400">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a lesson to start learning</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Lessons Sidebar */}
          <div className="flex flex-col min-h-0">
            <Card className="border-slate-800 bg-slate-900 shadow-xl flex-1 flex flex-col overflow-hidden max-h-full">
              {/* Tier Header */}
              {activeTab === "basic" && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-bold text-white">Basic Tier</h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    {basicLessons.length} lessons • $50/month
                  </p>
                </div>
              )}
              {activeTab === "premium" && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-bold text-white">
                      Premium Tier
                    </h2>
                  </div>
                  <p className="text-purple-100 text-sm">
                    {premiumLessons.length} exclusive lessons • $100/month
                  </p>
                </div>
              )}
              {activeTab === "lifetime" && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">
                      VIP Access Tier
                    </h2>
                  </div>
                  <p className="text-yellow-100 text-sm">
                    {lifetimeLessons.length} premium lessons • $300 one-time
                  </p>
                </div>
              )}

              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {isLoading || isLoadingTier ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-4 border border-slate-800 rounded-lg bg-slate-800/50"
                      >
                        <Skeleton className="h-5 w-3/4 mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-1/2 bg-slate-700" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {activeTab === "basic" &&
                      (tier &&
                      ["basic", "premium", "lifetime"].includes(tier) ? (
                        renderLessonsList(basicLessons, "basic")
                      ) : (
                        <div className="text-center py-12 px-4">
                          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">
                            Basic Tier Locked
                          </h3>
                          <p className="text-slate-400">
                            Unlock {basicLessons.length} lessons with Basic
                            access
                          </p>
                        </div>
                      ))}
                    {activeTab === "premium" &&
                      (tier && ["premium", "lifetime"].includes(tier) ? (
                        renderLessonsList(premiumLessons, "premium")
                      ) : (
                        <div className="text-center py-12 px-4">
                          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-purple-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">
                            Premium Tier Locked
                          </h3>
                          <p className="text-slate-400">
                            Unlock {premiumLessons.length} exclusive lessons
                            with Premium access
                          </p>
                        </div>
                      ))}
                    {activeTab === "lifetime" &&
                      (tier === "lifetime" ? (
                        renderLessonsList(lifetimeLessons, "lifetime")
                      ) : (
                        <div className="text-center py-12 px-4">
                          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-yellow-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">
                            VIP Access Tier Locked
                          </h3>
                          <p className="text-slate-400">
                            Unlock {lifetimeLessons.length} premium lessons with
                            VIP access
                          </p>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
