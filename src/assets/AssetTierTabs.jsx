import React from 'react';
import { Zap, Crown, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tiers = [
  { id: 'basic', name: 'Basic Tier', icon: Zap, color: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'premium', name: 'Premium Tier', icon: Crown, color: 'bg-pink-500', gradient: 'from-pink-500 to-purple-500' },
  { id: 'vip', name: 'VIP Access', icon: Star, color: 'bg-orange-500', gradient: 'from-orange-500 to-red-500' }
];

export default function AssetTierTabs({ activeTier, setActiveTier, userTier, onUpgradeClick }) {
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
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {tiers.map((tier, idx) => {
        const isActive = activeTier === tier.id;
        const hasAccess = canAccessTier(tier.id);
        const Icon = tier.icon;

        return (
          <React.Fragment key={tier.id}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTierClick(tier.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? `bg-gradient-to-r ${tier.gradient} text-white`
                  : hasAccess
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tier.name}</span>
            </motion.button>
            {idx < tiers.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}