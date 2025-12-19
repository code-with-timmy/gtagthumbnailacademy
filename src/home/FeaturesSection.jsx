import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Check, Palette, Layers, Sparkles, Brush, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Palette, text: 'Color Theory & Composition' },
  { icon: Layers, text: 'Layer Management' },
  { icon: Sparkles, text: 'Glow & Lighting Effects' },
  { icon: Brush, text: 'Advanced Brushwork' },
  { icon: Zap, text: 'Quick Export Workflow' },
  { icon: Target, text: 'CTR Optimization' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="coolvetica text-3xl md:text-4xl font-bold mb-4"
            >
              Master Every Aspect of
              <br />
              <span className="gradient-text">Gorilla Tag Thumbnail Design</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-8 max-w-lg"
            >
              Our comprehensive curriculum covers everything from basic composition 
              to advanced effects, giving you the complete toolkit to create 
              thumbnails that dominate YouTube search results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to={createPageUrl('Purchase')}>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Features Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="glass-card rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}