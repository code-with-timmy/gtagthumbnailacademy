import React from 'react';
import { Lock, Play } from 'lucide-react';

export default function VideoPlayer({ lesson, user }) {
  if (!lesson) {
    return (
      <div className="glass-card rounded-3xl p-16 text-center border border-white/10 shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Play className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg">Select a lesson to start watching</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 space-y-8 border border-white/10 shadow-2xl">
      {/* Title */}
      <div>
        <h1 className="coolvetica text-3xl md:text-4xl font-bold mb-3 tracking-[0.08em]">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-400 text-lg leading-relaxed">{lesson.description}</p>
        )}
      </div>

      {/* Video */}
      {lesson.video_url ? (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
          <video
            controls
            className="w-full h-full"
            src={lesson.video_url}
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
          <p className="text-gray-500 text-lg">Video not available</p>
        </div>
      )}

      {/* Protected Content Notice */}
      <div className="bg-gradient-to-r from-yellow-900/30 via-yellow-800/30 to-yellow-900/30 border border-yellow-500/40 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="coolvetica text-xl font-bold text-yellow-200 mb-2 tracking-[0.1em]">PROTECTED CONTENT</h3>
            <p className="text-base text-yellow-100/90 leading-relaxed">
              This video is watermarked with your account information and moves dynamically to prevent 
              unauthorized sharing or screen recording. The content is licensed exclusively to you. 
              Please Remember Sending any videos Or Sharing any Information from This course WILL Get 
              you Into a Lawsuit & Be Sued!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}