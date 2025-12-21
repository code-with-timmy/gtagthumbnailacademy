import React from "react";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  {
    num: "#1",
    name: "Venom Style",
    desc: "Dark & Menacing Design",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/93120d0c9_Codyvenomgori7lla.png",
  },
  {
    num: "#2",
    name: "GhostFace Style",
    desc: "Horror-Themed Layout",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/ef4796c44_GHOSTFACECODY.png",
  },
  {
    num: "#3",
    name: "Winter Theme",
    desc: "Seasonal Design Pack",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/81f73493b_CodywinterGorillatagPSD-Recove5red.png",
  },
];

export default function TemplatesSection() {
  return (
    <section
      className="relative py-32 px-4 overflow-hidden"
      style={{ fontFamily: "'Coolvetica', sans-serif", letterSpacing: "0.1em" }}
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
  );
}
