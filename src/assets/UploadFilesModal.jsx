import React, { useState, useCallback } from "react";
import { X, Upload, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/api/supabaseClient"; // Ensure this is your configured supabase client

export default function UploadFilesModal({
  isOpen,
  onClose,
  onSubmit,
  tier,
  folderId,
}) {
  const [files, setFiles] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  // ... (handleDrop and handleFileSelect stay the same)

  const handleUpload = async () => {
    setIsLoading(true);

    try {
      for (const item of files) {
        let finalUrl = "";
        let title = "";

        if (item.isLink) {
          finalUrl = item.url;
          title = item.title;
        } else {
          // 1. Generate a unique file path
          const fileExt = item.name.split(".").pop();
          const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
          const filePath = `${tier}/${fileName}`; // Organizes storage by tier folders

          // 2. Upload to Supabase Storage
          const { data, error: uploadError } = await supabase.storage
            .from("assets") // Make sure you created a bucket named 'assets'
            .upload(filePath, item);

          if (uploadError) throw uploadError;

          // 3. Get Public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(filePath);

          finalUrl = publicUrl;
          title = item.name;
        }

        // 4. Save to Database via the onSubmit prop (which handles the INSERT)
        await onSubmit({
          title: title,
          file_url: finalUrl,
          thumbnail_url: finalUrl, // You can swap this for a generic icon URL if it's not an image
          tier,
          folder_id: folderId,
        });
      }

      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error.message);
      alert("Error uploading: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (Rest of your JSX remains exactly the same)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6">Upload Assets</h3>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/20"
          }`}
        >
          <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-300 mb-1">Drag & drop files here</p>
          <p className="text-gray-500 text-sm mb-3">
            or click to browse (multiple files supported)
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-400 hover:text-blue-300"
          >
            Browse files
          </label>
        </div>

        {/* Add Link */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Link title"
              className="bg-white/5 border-white/10"
            />
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL"
              className="bg-white/5 border-white/10"
            />
            <Button
              onClick={handleAddLink}
              variant="outline"
              className="border-white/20"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-500 text-xs">+ Add Link (No File)</p>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-white/10"
              >
                <span className="text-sm truncate">
                  {file.isLink ? file.title : file.name}
                </span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={isLoading || files.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Upload ${files.length} Items`
          )}
        </Button>
      </div>
    </div>
  );
}
