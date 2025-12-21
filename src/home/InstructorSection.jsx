import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import pfp from "../assets/pfp.jpg";

export default function InstructorSection() {
  return (
    <section className="py-24 relative">
      {/* Increased max-width from 5xl to 6xl */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Avatar - Made bigger (w-64) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full rounded-full bg-[#0a0e1a] overflow-hidden">
                <img
                  src={pfp}
                  alt="Cody Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            {/* Badge - Increased tracking and size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-base font-medium tracking-wider mb-8"
            >
              <Star className="w-5 h-5" />
              Meet Your Instructor
            </motion.div>

            {/* Heading - Increased size and added tracking */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="coolvetica text-4xl md:text-6xl font-bold mb-6 tracking-wide leading-tight"
            >
              Learn From The Best
            </motion.h2>

            {/* Paragraphs - Increased size (text-xl), tracking, and line height */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl mb-6 tracking-wide leading-relaxed"
            >
              Hi, I'm{" "}
              <span className="text-white font-bold border-b-2 border-purple-500/50 pb-0.5">
                Cody
              </span>{" "}
              - a Professional Gorilla Tag Thumbnail Designer with over 300M+
              views generated from my designs!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-gray-400 text-lg md:text-xl mb-10 tracking-wide leading-relaxed"
            >
              I've spent years perfecting the art of creating click-worthy
              thumbnails that consistently achieve 13-19% CTR improvements. Now,
              I'm sharing all my secrets, techniques, and methods with you in
              this comprehensive course.
            </motion.p>

            {/* Stats - Made cards larger and labels more spaced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <div className="glass-card rounded-2xl px-8 py-5 text-center min-w-[140px] border border-white/5 bg-white/5">
                <div className="coolvetica text-3xl font-bold text-cyan-400 tracking-wide">
                  300M+
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-widest uppercase mt-1">
                  Total Views
                </div>
              </div>
              <div className="glass-card rounded-2xl px-8 py-5 text-center min-w-[140px] border border-white/5 bg-white/5">
                <div className="coolvetica text-3xl font-bold text-yellow-400 tracking-wide">
                  5.0★
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-widest uppercase mt-1">
                  Rating
                </div>
              </div>
              <div className="glass-card rounded-2xl px-8 py-5 text-center min-w-[140px] border border-white/5 bg-white/5">
                <div className="coolvetica text-3xl font-bold text-green-400 tracking-wide">
                  100+
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-widest uppercase mt-1">
                  Students
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
