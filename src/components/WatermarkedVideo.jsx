import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function WatermarkedVideo({
  videoUrl,
  userEmail = "Protected Content", // Pass the user's email here
  className = "",
  onVideoEnd,
}) {
  const videoRef = useRef(null);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const isIframeVideo = (url) => {
    if (!url) return false;
    return (
      url.includes("iframe.mediadelivery.net") ||
      url.includes("player.vimeo.com") ||
      url.includes("screenpal.com") ||
      url.includes("/embed/")
    );
  };

  const getScreenPalEmbedUrl = (url) => {
    if (!url || !url.includes("screenpal.com")) return url;
    const match = url.match(/watch\/([a-zA-Z0-9]+)/);
    return match
      ? `https://screenpal.com/player/${match[1]}?width=100%&height=100%&ff=1`
      : url;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);
  const isIframe = isIframeVideo(videoUrl);
  const embedUrl = isIframe ? getScreenPalEmbedUrl(videoUrl) : videoUrl;

  // --- Watermark Component ---
  const WatermarkOverlay = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <motion.div
        initial={{ x: "10%", y: "10%" }}
        animate={{
          x: ["10%", "80%", "10%", "70%", "20%"],
          y: ["10%", "80%", "70%", "20%", "50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="text-white/20 text-xs font-mono whitespace-nowrap bg-black/20 px-2 py-1 rounded select-none"
      >
        {userEmail}
      </motion.div>
    </div>
  );

  return (
    <div className={`${className} relative group`}>
      {/* Watermark layer */}
      <WatermarkOverlay />

      {/* Video Content */}
      {youtubeId ? (
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?modestbranding=1&rel=0&controls=1&autoplay=0`}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : isIframe ? (
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl"
          src={embedUrl}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          controls
          controlsList="nodownload"
          autoPlay
          className="w-full h-full rounded-xl bg-black"
          src={videoUrl}
          onEnded={onVideoEnd}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
