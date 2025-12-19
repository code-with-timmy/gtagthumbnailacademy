import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, Trash2, Loader2, CheckCircle2, Lock, Pencil, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    order: 1,
    is_published: true,
    video_url: "",
    required_tier: "basic",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null); // Ensure user is null if there's an error
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => base44.entities.Lesson.list('-order'),
    initialData: [],
    enabled: user?.role === 'admin', // Only fetch lessons if the user is an admin
  });

  const createLessonMutation = useMutation({
    mutationFn: (lessonData) => base44.entities.Lesson.create(lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setFormData({
        title: "",
        description: "",
        duration: "",
        order: 1,
        is_published: true,
        video_url: "",
        required_tier: "basic",
      });
      setSelectedFile(null);
      setEditingLesson(null);
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, lessonData }) => base44.entities.Lesson.update(id, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setFormData({
        title: "",
        description: "",
        duration: "",
        order: 1,
        is_published: true,
        video_url: "",
        required_tier: "basic",
      });
      setSelectedFile(null);
      setEditingLesson(null);
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id) => base44.entities.Lesson.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    console.log("Starting upload for file:", selectedFile.name, "Size:", selectedFile.size);
    setIsUploading(true);

    try {
      console.log("Calling UploadFile integration...");
      const result = await base44.integrations.Core.UploadFile({ file: selectedFile });
      console.log("Upload complete! Result:", result);
      
      if (result && result.file_url) {
        setFormData(prev => ({ ...prev, video_url: result.file_url }));
        console.log("Video URL set:", result.file_url);
      } else {
        throw new Error("No file URL returned from upload");
      }
    } catch (error) {
      console.error("Upload failed with error:", error);
      alert("Upload failed: " + (error.message || "Unknown error. Check console for details."));
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      duration: lesson.duration || "",
      order: lesson.order,
      is_published: lesson.is_published,
      video_url: lesson.video_url,
      required_tier: lesson.required_tier || "basic",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      order: 1,
      is_published: true,
      video_url: "",
      required_tier: "basic",
    });
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.video_url) {
      alert("Please upload a video first");
      return;
    }
    
    if (editingLesson) {
      updateLessonMutation.mutate({ id: editingLesson.id, lessonData: formData });
    } else {
      createLessonMutation.mutate(formData);
    }
  };

  if (isLoadingUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </motion.div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md border-slate-800 bg-slate-900">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">Only administrators can access this page.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Lessons</h1>
          <p className="text-slate-400">Add new video lessons to your thumbnail course</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="border-slate-800 bg-slate-900 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Video className="w-5 h-5 text-sky-500" />
                {editingLesson ? 'Edit Lesson' : 'New Lesson'}
              </CardTitle>
              {editingLesson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Video Upload */}
                <div className="space-y-3">
                  <Label className="text-slate-300">Video Source</Label>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="video-url" className="text-slate-400 text-sm">Paste Video URL</Label>
                    <Input
                      id="video-url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://your-video-hosting.com/video.mp4"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">Paste a direct video link from YouTube, Vimeo, or any video hosting service</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-900 px-2 text-slate-500">Or upload file</span>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-sky-500 transition-colors bg-slate-800/30">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-sm font-medium text-slate-300">
                        {selectedFile ? selectedFile.name : "Click to upload video"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">MP4, MOV, or AVI (Max 200MB)</p>
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-300">File size:</span>
                        <span className="text-white font-medium">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedFile && !formData.video_url && (
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading... Please wait
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  )}

                  {isUploading && (
                    <Alert className="bg-blue-900/30 border-blue-700">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <AlertDescription className="text-blue-300">
                        <div className="space-y-1">
                          <p className="font-semibold">Uploading {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB video file...</p>
                          <p className="text-sm">This may take a few minutes. Please don't close this page.</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {formData.video_url && (
                    <Alert className="bg-green-900/30 border-green-700">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        Video URL set successfully!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Lesson Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Thumbnail Design"
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what students will learn"
                    rows={3}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Duration and Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-slate-300">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 12:34"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-slate-300">Lesson Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="1"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Required Tier */}
                <div className="space-y-2">
                  <Label htmlFor="tier" className="text-slate-300">Required Access Tier</Label>
                  <Select
                    value={formData.required_tier}
                    onValueChange={(value) => setFormData({ ...formData, required_tier: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="basic" className="text-white">Basic ($50/month)</SelectItem>
                      <SelectItem value="premium" className="text-white">Premium ($100/month)</SelectItem>
                      <SelectItem value="lifetime" className="text-white">Lifetime ($300)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Students need this tier or higher to access this lesson</p>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <Label htmlFor="publish" className="text-slate-300">Publish Immediately</Label>
                    <p className="text-xs text-slate-500">Make lesson visible to students</p>
                  </div>
                  <Switch
                    id="publish"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                >
                  {createLessonMutation.isPending || updateLessonMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingLesson ? 'Updating Lesson...' : 'Creating Lesson...'}
                    </>
                  ) : (
                    editingLesson ? 'Update Lesson' : 'Create Lesson'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Lessons */}
          <Card className="border-slate-800 bg-slate-900 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Existing Lessons ({lessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {lessons.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No lessons yet. Create your first one!</p>
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:shadow-md hover:border-sky-500/50 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{lesson.order}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{lesson.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {lesson.duration && <span>⏱️ {lesson.duration}</span>}
                          <span className={lesson.is_published ? "text-green-400" : "text-orange-400"}>
                            {lesson.is_published ? "● Published" : "● Draft"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLesson(lesson)}
                          className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/30"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteLessonMutation.mutate(lesson.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}