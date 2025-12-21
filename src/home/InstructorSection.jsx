import React from "react";
import { Star, Eye, Users } from "lucide-react";
import { motion } from "framer-motion";
import pfp from "../assets/pfp.jpg";

export default function InstructorSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Avatar */}
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full rounded-full bg-[#0a0e1a] overflow-hidden">
                {/* Removed the text-8xl div and added object-cover */}
                <img
                  src={pfp}
                  alt="Cody Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-sm mb-6"
            >
              <Star className="w-4 h-4" />
              Meet Your Instructor
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="coolvetica text-3xl md:text-4xl font-bold mb-4"
            >
              Learn From The Best
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 mb-4"
            >
              Hi, I'm{" "}
              <span className="text-white font-semibold text-[17px]">Cody</span>{" "}
              - a Professional Gorilla Tag Thumbnail Designer with over 300M+
              views generated from my designs!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-gray-400 mb-8"
            >
              I've spent years perfecting the art of creating click-worthy
              thumbnails that consistently achieve 13-19% CTR improvements. Now,
              I'm sharing all my secrets, techniques, and methods with you in
              this comprehensive course.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <div className="glass-card rounded-xl px-6 py-4 text-center">
                <div className="coolvetica text-2xl font-bold text-cyan-400">
                  300M+
                </div>
                <div className="text-gray-400 text-sm">Total Views</div>
              </div>
              <div className="glass-card rounded-xl px-6 py-4 text-center">
                <div className="coolvetica text-2xl font-bold text-yellow-400">
                  5.0★
                </div>
                <div className="text-gray-400 text-sm">Rating</div>
              </div>
              <div className="glass-card rounded-xl px-6 py-4 text-center">
                <div className="coolvetica text-2xl font-bold text-green-400">
                  100+
                </div>
                <div className="text-gray-400 text-sm">Students</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
