/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { X, Upload, Link2, Loader2, ImageIcon } from "lucide-react"; // Added ImageIcon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/supabase";

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
  const [thumbnailFile, setThumbnailFile] = useState(null); // State for the cover image
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const scanEntries = async (entries) => {
    let allFiles = [];
    for (const entry of entries) {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        allFiles.push(file);
      } else if (entry.isDirectory) {
        const directoryReader = entry.createReader();
        const innerEntries = await new Promise((resolve) => {
          directoryReader.readEntries(resolve);
        });
        const recursiveFiles = await scanEntries(innerEntries);
        allFiles = [...allFiles, ...recursiveFiles];
      }
    }
    return allFiles;
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const items = Array.from(e.dataTransfer.items);
    if (items && items.length > 0) {
      const entries = items
        .map((item) => item.webkitGetAsEntry())
        .filter(Boolean);
      try {
        const droppedFiles = await scanEntries(entries);
        setFiles((prev) => [...prev, ...droppedFiles]);
      } catch (err) {
        console.error("Folder scan failed:", err);
      }
    }
    e.dataTransfer.clearData();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleAddLink = () => {
    if (linkUrl && linkTitle) {
      setFiles((prev) => [
        ...prev,
        { isLink: true, url: linkUrl, title: linkTitle },
      ]);
      setLinkUrl("");
      setLinkTitle("");
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsLoading(true);

    try {
      const filesToUpload = [...files];

      for (const item of filesToUpload) {
        let finalUrl = "";
        let finalThumbUrl = ""; // This will hold the 1920x1080 image link
        let title = "";

        // 1. UPLOAD THE THUMBNAIL FIRST (if provided)
        if (thumbnailFile) {
          const thumbExt = thumbnailFile.name.split(".").pop();
          const thumbName = `thumbs/${crypto.randomUUID()}-${Date.now()}.${thumbExt}`;

          const { error: thumbError } = await supabase.storage
            .from("assets")
            .upload(thumbName, thumbnailFile);

          if (thumbError) throw thumbError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(thumbName);
          finalThumbUrl = publicUrl;
        }

        // 2. HANDLE THE ASSET (LINK OR FILE)
        if (item.isLink) {
          finalUrl = item.url;
          title = item.title;
        } else {
          const fileExt = item.name.split(".").pop();
          const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
          const filePath = `${tier}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("assets")
            .upload(filePath, item);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(filePath);
          finalUrl = publicUrl;
          title = item.name;
        }

        // 3. SAVE TO DATABASE
        await onSubmit({
          name: title, // Make sure your DB column is 'name' or 'title'
          file_url: finalUrl,
          thumbnail_url: finalThumbUrl || finalUrl, // Fallback to asset URL if no thumb
          tier: tier.toLowerCase(),
          folder_id: folderId,
        });
      }

      setFiles([]);
      setThumbnailFile(null); // Reset thumbnail
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 max-w-lg w-full relative bg-slate-900 border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6">Upload Assets</h3>

        {/* THUMBNAIL SECTION (Step 1) */}
        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <label className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Cover Thumbnail (1920x1080)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {thumbnailFile && (
            <p className="text-[10px] text-emerald-400 mt-1">
              ✓ {thumbnailFile.name} ready
            </p>
          )}
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/20"
          }`}
        >
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-300 text-sm mb-1">Drag files or browse</p>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-xs text-blue-400 hover:text-blue-300"
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
              placeholder="Google Drive Title"
              className="bg-white/5 border-white/10 text-sm"
            />
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste Link URL"
              className="bg-white/5 border-white/10 text-sm"
            />
            <Button
              onClick={handleAddLink}
              variant="outline"
              className="border-white/20"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-500 text-[10px]">
            + Add Google Drive/External Link
          </p>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mb-4 max-h-32 overflow-y-auto bg-black/20 rounded-lg p-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 border-b border-white/5"
              >
                <span className="text-xs truncate text-gray-400">
                  {file.isLink ? file.title : file.name}
                </span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="text-red-400 text-[10px]"
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
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-6"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Publish ${files.length} Assets`
          )}
        </Button>
      </div>
    </div>
  );
}
