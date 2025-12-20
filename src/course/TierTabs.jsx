import React from "react";
import { Zap, Crown, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    id: "basic",
    name: "Basic Tier",
    icon: Zap,
    bg: "bg-yellow-500/10",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "premium",
    name: "Premium Tier",
    icon: Crown,
    bg: "bg-pink-500/10",
    gradient: "from-pink-500 to-purple-500",
  },
  {
    id: "vip",
    name: "VIP Access",
    icon: Star,
    bg: "bg-orange-500/10",
    gradient: "from-orange-500 to-red-500",
  },
];

export default function TierTabs({
  activeTier,
  setActiveTier,
  userTier,
  onUpgradeClick,
}) {
  const canAccessTier = (tier) => {
    const tierOrder = { basic: 1, premium: 2, vip: 3 };
    return tierOrder[userTier] >= tierOrder[tier];
  };

  const handleTierClick = (tier) => {
    if (canAccessTier(tier)) {
      setActiveTier(tier);
    } else {
      onUpgradeClick();
    }
  };

  return (
    /* Changed to flex-wrap and reduced gaps for mobile */
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-12 md:mb-16">
      {tiers.map((tier, idx) => {
        const isActive = activeTier === tier.id;
        const hasAccess = canAccessTier(tier.id);
        const Icon = tier.icon;

        return (
          <React.Fragment key={tier.id}>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: hasAccess ? 1.02 : 1 }}
              whileTap={{ scale: hasAccess ? 0.98 : 1 }}
              onClick={() => handleTierClick(tier.id)}
              /* Added w-full md:w-auto for mobile stacking */
              className={`flex items-center justify-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all w-full md:w-auto ${
                isActive
                  ? `bg-gradient-to-r ${tier.gradient} text-white shadow-xl md:shadow-2xl shadow-blue-500/20 md:scale-105`
                  : hasAccess
                  ? `${tier.bg} text-gray-300 hover:text-white backdrop-blur-sm border border-white/10`
                  : "bg-gray-800/50 text-gray-600 cursor-not-allowed backdrop-blur-sm border border-gray-700/50 opacity-60"
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="coolvetica tracking-[0.12em] whitespace-nowrap">
                {tier.name}
              </span>
            </motion.button>

            {/* Hidden chevrons on mobile using hidden md:block */}
            {idx < tiers.length - 1 && (
              <ChevronRight className="hidden md:block w-6 h-6 text-gray-700" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
