import React from 'react';
import { Download, GripVertical, Check, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function FileCard({ file, isAdmin, isSelected, onSelect, onDownload, onEdit, onDelete }) {
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
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className={`w-6 h-6 rounded border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/40 bg-black/30'} flex items-center justify-center`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </button>
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="p-1.5 rounded bg-black/50 hover:bg-black/70"
          >
            <Pencil className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-1.5 rounded bg-black/50 hover:bg-black/70"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-gray-800 relative">
        {file.thumbnail_url ? (
          <img
            src={file.thumbnail_url}
            alt={file.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Preview
          </div>
        )}
        
        {/* PSD Badge */}
        {file.title?.toLowerCase().includes('psd') && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <span className="text-[10px]">Ps</span>
            PSD
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-medium text-sm truncate mb-2">{file.title}</h4>
        <Button
          onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
          size="sm"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </motion.div>
  );
}