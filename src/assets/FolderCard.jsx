import React from 'react';
import { Folder, Pencil, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FolderCard({ folder, isAdmin, isSelected, onSelect, onClick, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-4 cursor-pointer relative group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-3">
          <Folder className="w-6 h-6 text-white" />
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
              className={`w-6 h-6 rounded border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/20'} flex items-center justify-center`}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="p-1.5 rounded hover:bg-white/10"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="p-1.5 rounded hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-white truncate">{folder.name}</h3>
    </motion.div>
  );
}