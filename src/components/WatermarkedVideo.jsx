import React, { useRef } from "react";

export default function WatermarkedVideo({
  videoUrl,
  className = "",
  onVideoEnd,
  height = "auto",
}) {
  const videoRef = useRef(null);

  // Check if URL is a YouTube link and extract video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Check if URL is an iframe-based video (Bunny.net, Vimeo, etc.)
  const isIframeVideo = (url) => {
    if (!url) return false;
    return (
      url.includes("iframe.mediadelivery.net") ||
      url.includes("player.vimeo.com") ||
      url.includes("screenpal.com") ||
      url.includes("/embed/")
    );
  };

  // Convert ScreenPal watch URL to embed URL
  const getScreenPalEmbedUrl = (url) => {
    if (!url || !url.includes("screenpal.com")) return url;
    const match = url.match(/watch\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://screenpal.com/player/${match[1]}?width=100%&height=100%&ff=1`;
    }
    return url;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);
  const isIframe = isIframeVideo(videoUrl);
  const embedUrl = isIframe ? getScreenPalEmbedUrl(videoUrl) : videoUrl;

  // If it's an iframe-based video (Bunny.net, YouTube, Vimeo, etc.)
  if (youtubeId) {
    return (
      <div className={className}>
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=1&iv_load_policy=3&autoplay=0`}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: "none" }}
        />
      </div>
    );
  }

  if (isIframe) {
    return (
      <div className={`${className} relative`}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl"
          src={embedUrl}
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: "none" }}
        />
      </div>
    );
  }

  // Otherwise, use regular video player
  return (
    <div className={`${className}`}>
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
    </div>
  );
}
