import React from "react";
import { Link } from "react-router-dom";

import { Phone, Users, HelpCircle, Pencil, Star, Check } from "lucide-react";
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
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 text-sm">
            <Phone className="w-4 h-4" />
            EXCLUSIVE VIP BENEFIT
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="coolvetica text-3xl md:text-5xl font-bold text-center mb-2"
        >
          <span className="gradient-text">Personal 1-on-1</span>
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="coolvetica text-3xl md:text-5xl font-bold text-center mb-6"
        >
          Voice Call With Me
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-center mb-12"
        >
          Get <span className="text-cyan-400 font-semibold">direct access</span>{" "}
          to ask me anything about thumbnail design, workflow, or strategies
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div
                className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-8 text-center border border-purple-500/30"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-sm mb-4">
            <Star className="w-4 h-4" />
            INCLUDED WITH VIP ACCESS
          </div>
          <h4 className="coolvetica text-2xl font-bold mb-2">
            Unlock Personal Mentorship
          </h4>
          <p className="text-gray-400 mb-4">
            Schedule your private 1-hour voice call when you upgrade to{" "}
            <span className="text-orange-400 font-semibold">
              VIP Access ($250/month)
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Screen sharing available
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Flexible scheduling
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
