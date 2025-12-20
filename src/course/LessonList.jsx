import React from 'react';
import { Zap, Crown, Star, Play, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const tierConfig = {
  basic: { icon: Zap, gradient: 'from-yellow-900/40 to-orange-900/40', price: '$25' },
  premium: { icon: Crown, gradient: 'from-pink-900/40 to-purple-900/40', price: '$50' },
  vip: { icon: Star, gradient: 'from-orange-900/40 to-red-900/40', price: '$125' }
};

export default function LessonList({ lessons, activeTier, selectedLesson, onSelectLesson }) {
  const config = tierConfig[activeTier];
  const Icon = config.icon;

  return (
    <div className={`glass-card rounded-3xl p-8 bg-gradient-to-br ${config.gradient} shadow-2xl border border-white/10`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="coolvetica text-2xl font-bold tracking-[0.1em]">LESSONS</h2>
          <p className="text-sm text-gray-300">{lessons.length} lessons • {config.price}/mo</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {lessons.map((lesson, idx) => {
          const isSelected = selectedLesson?.id === lesson.id;

          return (
            <motion.button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-5 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-white/25 border-2 border-white/60 shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  isSelected ? 'bg-white/40 shadow-md' : 'bg-white/10'
                }`}>
                  {lesson.order || idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2 text-base leading-tight">{lesson.title}</h3>
                  {lesson.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Play className="w-6 h-6 text-white flex-shrink-0 fill-current" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}