import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function EditLessonModal({ lesson, isOpen, onClose, onSave }) {
  // We use local state for the form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState(1);
  const [tier, setTier] = useState("basic");
  const [isPublished, setIsPublished] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // CRITICAL: Sync local state when the 'lesson' prop changes or modal opens
  useEffect(() => {
    if (lesson && isOpen) {
      setTitle(lesson.title || "");
      setDescription(lesson.description || "");
      setDuration(lesson.duration || "");
      setOrder(lesson.order_index || 1); // Noted: Using order_index to match Supabase schema
      setTier(lesson.required_tier || "basic");
      setIsPublished(lesson.is_published || false);
      setVideoUrl(lesson.video_url || "");
    }
  }, [lesson, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        description,
        duration,
        order_index: parseInt(order), // Explicitly using order_index for Supabase
        required_tier: tier,
        is_published: isPublished,
        video_url: videoUrl,
      });
    } catch (error) {
      console.error("Failed to save lesson:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0f1219] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1219]/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold coolvetica tracking-wider">
            EDIT LESSON
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-400">Video URL</Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white/5 border-white/10 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Lesson Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Duration</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="00:00"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Order Index</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="bg-white/5 border-white/10"
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Access Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f2e] border-white/10 text-white">
                <SelectItem value="basic">Basic Tier</SelectItem>
                <SelectItem value="premium">Premium Tier</SelectItem>
                <SelectItem value="vip">VIP Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="space-y-0.5">
              <Label className="font-medium">Published Status</Label>
              <p className="text-xs text-gray-500">
                Make this video visible in the course
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0f1219]/95 backdrop-blur-sm border-t border-white/10 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 hover:bg-white/5 text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
