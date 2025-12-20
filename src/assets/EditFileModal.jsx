import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditFileModal({ file, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState(file?.title || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ title });
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f2e] rounded-2xl max-w-md w-full border border-white/10">
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit File</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>File Name</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter file name"
              className="mt-1 bg-white/5 border-white/10"
              required
            />
          </div>
        </div>

        <div className="border-t border-white/10 p-6 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}