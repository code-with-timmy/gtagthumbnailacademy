import React from "react";
import { Link } from "react-router-dom";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  return (
    <section className="py-20 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="coolvetica text-3xl md:text-4xl font-bold mb-8"
        >
          Ready to 10X Your Click-Through Rate?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/purchase">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-6 text-lg rounded-xl glow-blue"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Access Course Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
