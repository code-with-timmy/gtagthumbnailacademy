/* eslint-disable react/prop-types */
import React from "react";
import { Download, GripVertical, Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const getIconForFile = (title) => {
  const ext = title?.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return null; // Use image
  if (ext === "psd") return "Ps";
  if (ext === "zip" || ext === "rar") return "📦";
  if (ext === "mp4" || ext === "mov") return "🎥";
  return "📄";
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
  const fileExt = file.title?.split(".").pop().toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(fileExt);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl overflow-hidden relative group"
    >
      {/* Drag Handle / Select */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
        <div className="w-6 h-6 rounded bg-blue-500/80 flex items-center justify-center">
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
            } flex items-center justify-center`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </button>
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 rounded bg-black/50 hover:bg-black/70"
          >
            <Pencil className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 rounded bg-black/50 hover:bg-black/70"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      <div className="aspect-[4/3] bg-gray-900/50 relative flex items-center justify-center overflow-hidden border-b border-white/5">
        {isImage ? (
          <img
            src={file.file_url} // Use the actual file_url for images
            alt={file.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{getIconForFile(file.title)}</span>
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              {fileExt}
            </span>
          </div>
        )}

        {/* PSD Badge */}
        {fileExt === "psd" && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            PSD
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-black/20">
        <h4
          className="font-medium text-xs truncate mb-2 text-gray-200"
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
          className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10"
        >
          <Download className="w-3 h-3 mr-1" />
          Download
        </Button>
      </div>
    </motion.div>
  );
}
