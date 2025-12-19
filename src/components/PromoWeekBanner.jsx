import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function PromoWeekBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/coolvetica');
      `}</style>
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          {/* Badge Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-1">
            <div
              className="text-4xl md:text-5xl font-bold text-white"
              style={{
                fontFamily: "'Coolvetica', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Launch Week Special: 50% Off All Plans
            </div>
            
            <p className="text-base md:text-lg text-white/90">
              Limited time offer — Save 50% on your subscription during our first week
            </p>
          </div>

          {/* CTA Badge */}
          <div className="flex-shrink-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-sm">
            ENDS SOON
          </div>
        </div>
      </div>
    </motion.div>
  );
}