import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase"; // Your supabase client
import {
  Loader2,
  Upload as UploadIcon,
  Video,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";
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
import EditLessonModal from "@/upload/EditLessonModal";

export default function UploadPage() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState(1);
  const [tier, setTier] = useState("basic");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // 1. Check Auth
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // 2. Check Admin Role
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/");
        return;
      }
      setUser(profile);

      // 3. Load Lessons from lessons table
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index", { ascending: false });

      setLessons(lessonsData || []);
      setOrder((lessonsData?.length || 0) + 1);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalVideoUrl = videoUrl;

      // 4. Handle Supabase Storage Upload
      if (videoFile) {
        const fileExt = videoFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `lesson-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("videos")
          .upload(filePath, videoFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("videos").getPublicUrl(filePath);

        finalVideoUrl = publicUrl;
      }

      // 5. Create Lesson in Database
      const { error: insertError } = await supabase.from("lessons").insert([
        {
          title,
          description,
          duration,
          video_url: finalVideoUrl,
          required_tier: tier,
          is_published: isPublished,
          order_index: parseInt(order),
        },
      ]);

      if (insertError) throw insertError;

      // Reset form
      setVideoUrl("");
      setVideoFile(null);
      setTitle("");
      setDescription("");
      setDuration("");
      setTier("basic");
      setIsPublished(false);

      loadData();
    } catch (error) {
      alert("Error creating lesson: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleSaveLesson = async (data) => {
    const { error } = await supabase
      .from("lessons")
      .update(data)
      .eq("id", editingLesson.id);

    if (error) alert(error.message);
    setIsEditModalOpen(false);
    setEditingLesson(null);
    loadData();
  };

  const handleDeleteLesson = async (lessonId) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      if (error) alert(error.message);
      loadData();
    }
  };

  const tierColors = {
    basic: "bg-yellow-500",
    premium: "bg-pink-500",
    vip: "bg-orange-500",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#0a0e1a] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="coolvetica text-3xl font-bold mb-2">Upload Lessons</h1>
        <p className="text-gray-400 mb-8">
          Add new video lessons to your course
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Video className="w-5 h-5 text-blue-400" />
              <span className="font-bold">New Lesson</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-400 text-sm">Video URL</Label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://link-to-video.com/file.mp4"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="text-center text-gray-500 text-xs py-2">
                — OR —
              </div>

              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-white/40"
                onClick={() => document.getElementById("video-upload").click()}
              >
                <UploadIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">
                  Click to upload video file
                </p>
                {videoFile && (
                  <p className="text-blue-400 text-sm mt-2">{videoFile.name}</p>
                )}
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <Label>Lesson Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Introduction"
                  className="mt-1 bg-white/5 border-white/10"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (Min)</Label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12:34"
                    className="mt-1 bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label>Order Index</Label>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="mt-1 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div>
                <Label>Required Access Tier</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger className="mt-1 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <Label>Publish Immediately</Label>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !title}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Lesson"
                )}
              </Button>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-6 bg-white/5 border border-white/10">
            <h2 className="font-bold mb-4">
              Existing Lessons ({lessons.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                      tierColors[lesson.required_tier]
                    }`}
                  >
                    {lesson.order_index}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{lesson.title}</p>
                    <p className="text-xs text-gray-500">
                      {lesson.required_tier} •{" "}
                      {lesson.is_published ? "Live" : "Draft"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="p-2 hover:bg-white/10 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 hover:bg-white/10 rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditLessonModal
        lesson={editingLesson}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
