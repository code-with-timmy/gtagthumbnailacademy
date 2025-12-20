import React from 'react';
import { Zap, Crown, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tiers = [
  { id: 'basic', name: 'Basic Tier', icon: Zap, bg: 'bg-yellow-500/10', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'premium', name: 'Premium Tier', icon: Crown, bg: 'bg-pink-500/10', gradient: 'from-pink-500 to-purple-500' },
  { id: 'vip', name: 'VIP Access', icon: Star, bg: 'bg-orange-500/10', gradient: 'from-orange-500 to-red-500' }
];

export default function TierTabs({ activeTier, setActiveTier, userTier, onUpgradeClick }) {
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
    <div className="flex items-center justify-center gap-6 mb-16">
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
              whileHover={{ scale: hasAccess ? 1.05 : 1 }}
              whileTap={{ scale: hasAccess ? 0.95 : 1 }}
              onClick={() => handleTierClick(tier.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                isActive
                  ? `bg-gradient-to-r ${tier.gradient} text-white shadow-2xl shadow-blue-500/30 scale-105`
                  : hasAccess
                  ? `${tier.bg} text-gray-300 hover:text-white hover:scale-105 backdrop-blur-sm border border-white/10`
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed backdrop-blur-sm border border-gray-700/50 opacity-60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="coolvetica tracking-[0.12em]">{tier.name}</span>
            </motion.button>
            {idx < tiers.length - 1 && (
              <ChevronRight className="w-6 h-6 text-gray-700" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}