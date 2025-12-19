import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Play,
  Shield,
  Star,
  TrendingUp,
  Sparkles,
  Check,
  Users,
  Award,
  Zap,
  Eye,
  CheckCircle2,
} from "lucide-react";
import TermsOfServiceModal from "../components/TermsOfServiceModal";
import { useAccessTier } from "../components/AccessCheck";
import { motion } from "framer-motion";
import PromoWeekBanner from "../components/PromoWeekBanner";
import { base44 } from "@/api/base44Client";

export default function Home() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  // const { tier } = useAccessTier();

  // useEffect(() => {
  //   const syncAccess = async () => {
  //     try {
  //       const isAuth = await base44.auth.isAuthenticated();
  //       if (isAuth) {
  //         await base44.functions.invoke('syncUserAccess');
  //       }
  //     } catch (error) {
  //       console.error('Sync error:', error);
  //     }
  //   };
  //   syncAccess();
  // }, []);
  const [creators, setCreators] = useState([
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/037593266_channels4_profile22.jpg",
      name: "VMT",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/755dfe1ca_channels4_profile23.jpg",
      name: "Jmancurly",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/38ac0d8f7_channels4_profile24.jpg",
      name: "Be Prepared",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/00d8aa66b_channels4_profile25.jpg",
      name: "Erik1515",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/c847fc0c1_channels4_profile26.jpg",
      name: "H4kpy",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/b045e681b_channels4_profile27.jpg",
      name: "FizzFizz",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/92fface43_channels4_profile28.jpg",
      name: "CJVR",
    },
    {
      img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/8adcd0be0_channels4_profile29.jpg",
      name: "CubCub11",
    },
  ]);

  const handleNameChange = (index, newName) => {
    const updatedCreators = [...creators];
    updatedCreators[index].name = newName;
    setCreators(updatedCreators);
  };

  const handleAccessCourse = () => {
    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    navigate(createPageUrl("Purchase"));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-slate-950"
    >
      {/* 50% OFF PROMO BANNER */}
      <PromoWeekBanner />

      {/* Floating Discord Button */}
      <a
        href="https://discord.gg/HQeRgqQh7R"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 top-24 z-50 flex flex-col items-center gap-2 px-4 py-4 bg-[#5865F2] hover:bg-[#4752C4] rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105 group"
      >
        <svg
          className="w-8 h-8 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        <span className="text-white font-bold text-sm whitespace-nowrap">
          Join Discord?
        </span>
      </a>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient blobs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500/20 rounded-full mix-blend-lighten filter blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-lighten filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-lighten filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Warped Showcase Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/b9d062948_CODYTHUMBNAILART.png"
              alt="Thumbnail Showcase"
              className="w-full max-w-[120rem] h-auto object-contain opacity-[0.05] mix-blend-lighten"
              style={{
                transform:
                  "perspective(1200px) rotateX(12deg) rotateY(-8deg) skewX(-4deg) scale(1.5)",
                filter: "contrast(1.2) brightness(1.15)",
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/80 backdrop-blur-sm rounded-full border border-sky-500/30 text-sm font-medium text-sky-400">
              <Sparkles className="w-4 h-4" />
              #1 Professional Thumbnail Design Course
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent block">
                  Create Thumbnails That
                </span>
                <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent block mt-2">
                  Get Millions of Clicks
                </span>
              </h1>

              <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Learn the exact thumbnail strategies used by top 1% of Gorilla
                Tag Designers to skyrocket Your CTR% You gain Monthly & Yearly
                access. Results guaranteed.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 pt-6">
              <Button
                size="lg"
                onClick={handleAccessCourse}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-16 py-10 text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-sky-500/50 transition-all transform hover:scale-105"
              >
                <Play className="w-8 h-8 mr-3 fill-white" />
                Access Course Now
              </Button>

              {/* {tier && (
                <Button
                  size="lg"
                  onClick={() => navigate(createPageUrl("Course"))}
                  className="bg-slate-800 text-white hover:bg-slate-700 px-12 py-8 text-xl font-bold rounded-2xl"
                >
                  Go To Course
                </Button>
              )} */}

              <div className="flex items-center gap-8 text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="">No Other fees required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Protected videos</span>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex items-center justify-center gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">100+</div>
                <div className="text-sm text-slate-400">Happy Students</div>
              </div>
              <div className="h-12 w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-[#fff305] mb-1 text-4xl font-bold">
                  5.0★
                </div>
                <div className="text-sm text-slate-400">Average Rating</div>
              </div>
              <div className="h-12 w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">300M+</div>
                <div className="text-sm text-slate-400">Views Generated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Creators Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30 text-sm font-medium text-purple-400 mb-4">
              <Users className="w-4 h-4" />
              Trusted Collaborations
            </div>
            <h2 className="text-[#ffffff] mb-3 text-3xl font-bold">
              Who I've Worked With
            </h2>
            <p className="text-slate-50 text-base max-w-3xl mx-auto">
              I've created Hundreds of thumbnails for hundreds of creators,
              across dozens of niches on YouTube. Through that experience, I've
              learned the formula behind generating millions of views.
            </p>
          </div>

          {/* Contained Box with Scrolling */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 overflow-hidden space-y-6">
            <style>{`
              @keyframes scroll-left {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              @keyframes scroll-right {
                0% {
                  transform: translateX(-50%);
                }
                100% {
                  transform: translateX(0);
                }
              }
              .animate-scroll-left {
                animation: scroll-left 25s linear infinite;
              }
              .animate-scroll-right {
                animation: scroll-right 25s linear infinite;
              }
            `}</style>

            {/* Row 1 - Scrolling Left */}
            <div className="relative">
              <div className="flex gap-6 animate-scroll-left">
                {[...creators, ...creators].map((creator, index) => (
                  <div
                    key={`row1-${index}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-sky-500 transition-all transform group-hover:scale-110 bg-slate-800 shadow-xl">
                      <img
                        src={creator.img}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-base px-2 py-1">
                        {creator.name}
                      </p>
                      <p className="text-slate-500 text-xs">Creator</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - Scrolling Right */}
            <div className="relative">
              <div className="flex gap-6 animate-scroll-right">
                {[
                  ...creators.slice().reverse(),
                  ...creators.slice().reverse(),
                ].map((creator, index) => (
                  <div
                    key={`row2-${index}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-purple-500 transition-all transform group-hover:scale-110 bg-slate-800 shadow-xl">
                      <img
                        src={creator.img}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-base px-2 py-1">
                        {creator.name}
                      </p>
                      <p className="text-slate-500 text-xs">Creator</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guaranteed PSDs Section - Premium Edition */}
      <section
        className="relative py-32 px-4 overflow-hidden"
        style={{
          fontFamily: "'Coolvetica', sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        <style>{`
          @import url('https://fonts.cdnfonts.com/css/coolvetica');
        `}</style>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/15 to-slate-950">
          <div className="absolute top-12 left-[15%] w-[420px] h-[580px] bg-purple-500/8 rounded-full blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-16 right-[22%] w-[560px] h-[460px] bg-blue-500/12 rounded-full blur-[140px] animate-pulse"
            style={{ animationDelay: "1.4s" }}
          ></div>
          <div
            className="absolute top-[45%] left-[8%] w-[380px] h-[520px] bg-pink-500/6 rounded-full blur-[110px] animate-pulse"
            style={{ animationDelay: "2.7s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-full border-2 border-purple-400/50 text-lg font-bold text-purple-300 mb-10 shadow-lg shadow-purple-500/20 backdrop-blur-sm">
              <svg
                className="w-8 h-8 animate-bounce"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                EXCLUSIVE BONUS TEMPLATES
              </span>
            </div>

            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Premium PSD Templates
              </span>
              <span className="block text-white mt-2">Included Free!</span>
            </h2>

            <p className="text-2xl sm:text-3xl text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
              Get instant access to{" "}
              <span className="text-purple-400 font-bold">
                3 professional-grade
              </span>{" "}
              thumbnail templates
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Venom PSD */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="relative">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/1274cc701_PSDPNG.png"
                  alt="PSD Badge"
                  className="absolute -top-12 -right-12 w-32 h-36 z-20 drop-shadow-2xl object-contain group-hover:scale-110 transition-transform duration-300"
                />

                <div className="relative overflow-hidden rounded-[2rem] border-4 border-slate-800 group-hover:border-sky-400 transition-all duration-500 bg-gradient-to-br from-slate-900 to-slate-800 p-3 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/e60dca31d_Codyvenomgori7lla.png"
                      alt="Venom Gorilla PSD"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                  <div className="inline-block px-4 py-1 bg-sky-500/20 border border-sky-400/50 rounded-full text-sm font-bold text-sky-400 mb-2">
                    TEMPLATE #1
                  </div>
                  <h3 className="text-4xl font-black text-white group-hover:text-sky-400 transition-colors">
                    Venom Style
                  </h3>
                  <p className="text-slate-400 text-lg font-medium">
                    Dark & Menacing Design
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Fully Editable Layers
                  </div>
                </div>
              </div>
            </div>

            {/* GhostFace PSD */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="relative">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/1274cc701_PSDPNG.png"
                  alt="PSD Badge"
                  className="absolute -top-12 -right-12 w-32 h-36 z-20 drop-shadow-2xl object-contain group-hover:scale-110 transition-transform duration-300"
                />

                <div className="relative overflow-hidden rounded-[2rem] border-4 border-slate-800 group-hover:border-purple-400 transition-all duration-500 bg-gradient-to-br from-slate-900 to-slate-800 p-3 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/d092a1556_GHOSTFACECODY.png"
                      alt="Ghostface Gorilla PSD"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                  <div className="inline-block px-4 py-1 bg-purple-500/20 border border-purple-400/50 rounded-full text-sm font-bold text-purple-400 mb-2">
                    TEMPLATE #2
                  </div>
                  <h3 className="text-4xl font-black text-white group-hover:text-purple-400 transition-colors">
                    GhostFace Style
                  </h3>
                  <p className="text-slate-400 text-lg font-medium">
                    Horror-Themed Layout
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Fully Editable Layers
                  </div>
                </div>
              </div>
            </div>

            {/* Winter PSD */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="relative">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/1274cc701_PSDPNG.png"
                  alt="PSD Badge"
                  className="absolute -top-12 -right-12 w-32 h-36 z-20 drop-shadow-2xl object-contain group-hover:scale-110 transition-transform duration-300"
                />

                <div className="relative overflow-hidden rounded-[2rem] border-4 border-slate-800 group-hover:border-cyan-400 transition-all duration-500 bg-gradient-to-br from-slate-900 to-slate-800 p-3 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/639aec726_CodywinterGorillatagPSD-Recove5red.png"
                      alt="Winter Gorilla PSD"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                  <div className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-sm font-bold text-cyan-400 mb-2">
                    TEMPLATE #3
                  </div>
                  <h3 className="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors">
                    Winter Theme
                  </h3>
                  <p className="text-slate-400 text-lg font-medium">
                    Seasonal Design Pack
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Fully Editable Layers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-on-1 Call Section */}
      <section
        className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950"
        style={{
          fontFamily: "'Coolvetica', sans-serif",
          letterSpacing: "0.15em",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full border-2 border-indigo-400/50 text-lg font-bold text-indigo-300 mb-8 shadow-lg shadow-indigo-500/20 backdrop-blur-sm animate-pulse">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" />
                <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.19-1.193-1.55-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.086-1.391l-4.064-3.696z" />
              </svg>
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                EXCLUSIVE VIP BENEFIT
              </span>
            </div>

            <h2 className="text-6xl sm:text-7xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Personal 1-on-1
              </span>
              <span className="block text-white mt-2">Voice Call With Me</span>
            </h2>

            <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Get{" "}
              <span className="text-indigo-400 font-bold">direct access</span>{" "}
              to ask me anything about thumbnail design, workflow, or strategies
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Private Session
                </h3>
                <p className="text-slate-400">One full hour dedicated to you</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ask Anything
                </h3>
                <p className="text-slate-400">No question is off-limits</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Portfolio Review
                </h3>
                <p className="text-slate-400">Get feedback on your work</p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-indigo-500/50 rounded-3xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/50 text-sm font-bold text-yellow-400 mb-4">
                <Star className="w-4 h-4" />
                INCLUDED WITH VIP ACCESS
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                Unlock Personal Mentorship
              </h3>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
                Schedule your private 1-hour voice call when you upgrade to{" "}
                <span className="text-yellow-400 font-bold">
                  VIP Access ($250/month)
                </span>
              </p>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Screen sharing available</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Flexible scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/82b5cea95_7459f86f9_CODY2.png"
                  alt="Cody - Your Instructor"
                  className="relative w-80 h-80 object-contain drop-shadow-2xl animate-pulse"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/30 text-sm font-medium text-sky-400">
                <Star className="w-4 h-4" />
                Meet Your Instructor
              </div>

              <h2 className="text-5xl font-bold text-white">
                Learn From The Best
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Hi, I'm Cody - a Professional Gorilla Tag Thumbnail Designer
                with over 300M+ views generated from my designs!
              </p>

              <p className="text-lg text-slate-400 leading-relaxed">
                I've spent years perfecting the art of creating click-worthy
                thumbnails that consistently achieve 13-19% CTR improvements.
                Now, I'm sharing all my secrets, techniques, and methods with
                you in this comprehensive course.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <div className="text-2xl font-bold text-white">300M+</div>
                  <div className="text-sm text-slate-400">Total Views</div>
                </div>
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <div className="text-2xl font-bold text-[#fff305]">5.0★</div>
                  <div className="text-sm text-slate-400">Rating</div>
                </div>
                <div className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-slate-400">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-24 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/30 text-sm font-medium text-sky-400 mb-6">
                <Award className="w-4 h-4" />
                Course Curriculum
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Master Every Aspect of Gorilla Tag Thumbnail Design!
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                From basic principles to advanced Photoshop techniques used by
                top Thumbnail Designers
              </p>
              <Button
                size="lg"
                onClick={handleAccessCourse}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-12 py-7 text-xl font-bold rounded-xl"
              >
                View Pricing
              </Button>
            </div>

            <div className="space-y-4">
              {[
                "Professional Teaching and Click Worthy Thumbnails",
                "Color Theory and Visual Effects",
                "Text Placement & Arrow Placement",
                "Advanced Photoshop Techniques",
                "CTR boost of 12-19%",
                "Private Assets & More",
                "Photo Manipulation",
                "Exclusive PSD's & Renders",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-sky-500/50 transition-all"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg text-slate-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discord Community Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/10 rounded-full border border-indigo-500/30 text-lg font-medium text-indigo-400 mb-8">
            <Users className="w-5 h-5" />
            Join Our Community
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">
            Connect With Fellow Creators
          </h2>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join our exclusive Discord community to network with other thumbnail
            designers, share your work, get feedback, and stay updated on course
            content.
          </p>

          <a
            href="https://discord.gg/QhDzx758N4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-6 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join Discord Server
          </a>

          <div className="mt-8 flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Active community</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Get support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-sky-900/20 via-slate-900 to-purple-900/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            Ready to 10X Your Click-Through Rate?
          </h2>
          <p className="text-[#ffffff] mb-12 mx-auto text-2xl max-w-3xl">
            Join the ranks of successful creators who transformed their channels
            with Professional Thumbnails!
          </p>

          <Button
            size="lg"
            onClick={handleAccessCourse}
            className="bg-white text-black px-20 py-12 text-3xl font-bold rounded-2xl inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 hover:bg-slate-100 shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105"
          >
            <Play className="w-10 h-10 mr-4" />
            Access Course Now
          </Button>

          <div className="mt-12 flex items-center justify-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span className="">100+ enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Protected content</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-400" />
              <span className="text-[#ffd500]">Monthly to Yearly access</span>
            </div>
          </div>
        </div>
      </section>

      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />
    </motion.div>
  );
}
