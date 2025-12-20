import React from "react";
import { Lock, Play } from "lucide-react";

export default function VideoPlayer({ lesson, user }) {
  if (!lesson) {
    return (
      <div className="glass-card rounded-2xl md:rounded-3xl p-8 md:p-16 text-center border border-white/10 shadow-2xl">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Play className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
        </div>
        <p className="text-gray-400 text-base md:text-lg">
          Select a lesson to start watching
        </p>
      </div>
    );
  }

  return (
    /* Reduced padding on mobile (p-4) vs desktop (p-8) */
    <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-6 md:space-y-8 border border-white/10 shadow-2xl">
      {/* Title & Description */}
      <div>
        <h1 className="coolvetica text-2xl md:text-4xl font-bold mb-2 md:mb-3 tracking-[0.08em] leading-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video Container - Aspect Ratio ensures it never breaks layout */}
      <div className="relative group">
        {lesson.video_url ? (
          <div className="aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl ring-1 md:ring-2 ring-white/10">
            <video
              key={lesson.video_url} // Forces re-render when video changes
              controls
              className="w-full h-full"
              src={lesson.video_url}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              playsInline // Important for mobile browsers
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-700">
            <p className="text-gray-500 text-sm md:text-lg font-medium">
              Video not available
            </p>
          </div>
        )}
      </div>

      {/* Protected Content Notice */}
      <div className="bg-gradient-to-r from-yellow-900/40 via-yellow-800/20 to-yellow-900/40 border border-yellow-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="coolvetica text-lg md:text-xl font-bold text-yellow-200 mb-1 md:mb-2 tracking-[0.1em]">
              PROTECTED CONTENT
            </h3>
            <p className="text-xs md:text-sm text-yellow-100/80 leading-relaxed italic">
              Licensed to: {user?.full_name || user?.email || "Authorized User"}
            </p>
            <p className="hidden md:block text-sm text-yellow-100/70 mt-2 leading-relaxed">
              Unauthorized sharing or recording of this dynamic content is
              strictly prohibited and may result in legal action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
