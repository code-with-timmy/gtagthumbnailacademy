import React, { useRef } from "react";
import { Lock, Play, Maximize } from "lucide-react"; // Added Maximize icon
import { Button } from "@/components/ui/button";

export default function VideoPlayer({ lesson, user }) {
  const containerRef = useRef(null);

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

  // Function to trigger Fullscreen on the CONTAINER, not the video
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const userIdentifier = user?.email || user?.full_name || "Authorized User";

  return (
    <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-6 md:space-y-8 border border-white/10 shadow-2xl">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes watermark-move {
          0% { top: 10%; left: 10%; }
          25% { top: 10%; left: 70%; }
          50% { top: 80%; left: 70%; }
          75% { top: 80%; left: 10%; }
          100% { top: 10%; left: 10%; }
        }
        .animate-watermark {
          position: absolute;
          animation: watermark-move 20s linear infinite;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 50; 
        }
        /* Ensure watermark is visible in native fullscreen */
        :fullscreen .animate-watermark {
          font-size: 20px;
          opacity: 0.4;
        }
      `,
        }}
      />

      <div>
        <h1 className="coolvetica text-2xl md:text-4xl font-bold mb-2 md:mb-3 tracking-[0.08em] leading-tight uppercase">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-3xl">
            {lesson.description}
          </p>
        )}
      </div>

      {/* VIDEO CONTAINER - The Ref is now here */}
      <div
        ref={containerRef}
        className="relative group overflow-hidden rounded-xl md:rounded-2xl ring-1 md:ring-2 ring-white/10 shadow-2xl bg-black"
      >
        {lesson.video_url ? (
          <div className="aspect-video relative">
            {/* Floating Watermark Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <div className="animate-watermark text-white/20 text-[10px] md:text-xs font-mono bg-black/20 px-2 py-1 rounded">
                {userIdentifier} • {new Date().toLocaleDateString()} • IP
                PROTECTED
              </div>
            </div>

            {/* Custom Fullscreen Trigger for Watermark Persistence */}
            <button
              onClick={handleFullscreen}
              className="absolute bottom-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-lg border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Secure Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>

            <video
              key={lesson.video_url}
              controls
              className="w-full h-full object-contain"
              src={lesson.video_url}
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center border border-gray-700">
            <p className="text-gray-500 text-sm md:text-lg font-medium">
              Video not available
            </p>
          </div>
        )}
      </div>

      {/* Protected Notice */}
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
              Licensed to:{" "}
              <span className="text-yellow-400 font-bold">
                {userIdentifier}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
