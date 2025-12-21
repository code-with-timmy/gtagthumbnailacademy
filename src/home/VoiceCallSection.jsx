import React from "react";
import { Link } from "react-router-dom";

import {
  Phone,
  Users,
  HelpCircle,
  Pencil,
  Star,
  Check,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Private Session",
    desc: "One full hour dedicated to you",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: HelpCircle,
    title: "Ask Anything",
    desc: "No question is off-limits",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Pencil,
    title: "Portfolio Review",
    desc: "Get feedback on your work",
    color: "from-red-500 to-orange-500",
  },
];

export default function VoiceCallSection() {
  return (
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
            Get <span className="text-indigo-400 font-bold">direct access</span>{" "}
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
  );
}
