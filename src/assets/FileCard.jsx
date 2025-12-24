/* eslint-disable react/prop-types */
import React, { useState } from "react"; // Added useState
import {
  Download,
  GripVertical,
  Check,
  Pencil,
  Trash2,
  ExternalLink,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const getIconForFile = (title) => {
  const ext = title?.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return null;
  if (ext === "psd") return "Ps";
  if (ext === "zip" || ext === "rar") return "📦";
  if (ext === "mp4" || ext === "mov") return "🎥";
  return "🔗";
};

export default function FileCard({
  file,
  isAdmin,
  isSelected,
  onSelect,
  onDownload,
  onEdit,
  onDelete,
}) {
  const [imgError, setImgError] = useState(false); // Track if Supabase blocks the image
  const fileExt = file.title?.split(".").pop().toLowerCase();

  const hasThumbnail =
    file.thumbnail_url && file.thumbnail_url !== file.file_url;
  const isDirectImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(fileExt);
  const isGoogleDrive = file.file_url?.includes("drive.google.com");

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl overflow-hidden relative group border border-white/5 bg-slate-900/40"
    >
      {/* Selection & Admin UI */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
        <div className="w-6 h-6 rounded bg-blue-500/80 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-white" />
        </div>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className={`w-6 h-6 rounded border ${
              isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-white/40 bg-black/30"
            } flex items-center justify-center transition-colors`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 rounded bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 rounded bg-black/50 hover:bg-red-500/50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-white" />
          </button>
        </div>
      )}

      {/* PREVIEW AREA */}
      <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden border-b border-white/5">
        {(hasThumbnail || isDirectImage) && !imgError ? (
          <img
            src={hasThumbnail ? file.thumbnail_url : file.file_url}
            alt={file.title}
            onError={() => setImgError(true)} // If Supabase blocks egress, show the icon instead
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" // Critical for reducing Egress on initial load
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {imgError ? (
              <ImageOff className="w-8 h-8 text-gray-600 mb-1" />
            ) : (
              <span className="text-4xl filter drop-shadow-md">
                {getIconForFile(file.title)}
              </span>
            )}
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              {fileExt || "Link"}
            </span>
          </div>
        )}

        {/* PSD Badge */}
        {fileExt === "psd" && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg z-10">
            PSD
          </div>
        )}

        {isGoogleDrive && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-md border border-white/10">
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-black/20 backdrop-blur-md">
        <h4
          className="font-medium text-[11px] truncate mb-2 text-gray-200"
          title={file.title}
        >
          {file.title}
        </h4>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          size="sm"
          className="w-full h-8 text-[11px] bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all font-bold uppercase tracking-tight"
        >
          <Download className="w-3 h-3 mr-1.5" />
          {isGoogleDrive ? "Get Access" : "Download"}
        </Button>
      </div>
    </motion.div>
  );
}
