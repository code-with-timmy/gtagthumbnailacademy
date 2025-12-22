import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Play, Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";
import { use } from "react";

export default function HeroSection({ handleAccessCourse }) {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 text-base md:text-lg font-bold mb-10"
        >
          <Award className="w-5 h-5 md:w-6 md:h-6" />
          #1 PROFESSIONAL THUMBNAIL DESIGN COURSE
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="coolvetica text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-none"
        >
          Create Thumbnails That
          <br />
          <span className="gradient-text">Get Millions of Clicks</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Learn the exact thumbnail strategies used by the top 1% of Gorilla Tag
          Designers to skyrocket Your CTR%. Results guaranteed.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={handleAccessCourse}
            size="lg"
            className="bg-gradient-to-r  from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-14 py-9 text-2xl md:text-3xl rounded-2xl glow-blue"
          >
            <Play className="w-7 h-7 md:w-9 md:h-9 mr-3 fill-current" />
            Access Course Now
          </Button>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-10 text-gray-400 text-base md:text-lg"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            No other fees
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            Instant access
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            Protected videos
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="coolvetica text-2xl md:text-7xl lg:text-3xl font-bold mb-8 leading-none"
        >
          ALL ASSETS ARE INCLUDED FREE
        </motion.h1>
      </div>
    </section>
  );
}
