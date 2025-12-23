/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { X, Upload, Link2, Loader2, ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/supabase";

// Fixed Label import - removed the one from 'recharts'
const Label = ({ children, className }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
);

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
  const [thumbnailFile, setThumbnailFile] = useState(null);
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
    // AUTO-ADD LOGIC: Gather files + current link input if not empty
    let itemsToProcess = [...files];
    if (linkUrl.trim() && linkTitle.trim()) {
      itemsToProcess.push({ isLink: true, url: linkUrl, title: linkTitle });
    }

    if (itemsToProcess.length === 0) {
      alert("Please add a file or a link first!");
      return;
    }

    setIsLoading(true);

    try {
      for (const item of itemsToProcess) {
        let finalUrl = "";
        let finalThumbUrl = "";
        let itemTitle = "";

        // 1. UPLOAD THE THUMBNAIL FIRST
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
          itemTitle = item.title;
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
          itemTitle = item.name;
        }

        // 3. SAVE TO DATABASE (Using 'title' as requested)
        await onSubmit({
          title: itemTitle,
          file_url: finalUrl,
          thumbnail_url: finalThumbUrl || finalUrl,
          tier: tier.toLowerCase(),
          folder_id: folderId,
        });
      }

      // Reset state
      setFiles([]);
      setThumbnailFile(null);
      setLinkUrl("");
      setLinkTitle("");
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate total items for the button label
  const totalItemsCount = files.length + (linkUrl && linkTitle ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 max-w-lg w-full relative bg-slate-900 border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6 text-white">Upload Assets</h3>

        {/* THUMBNAIL SECTION */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <label className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" /> Cover Thumbnail (1920x1080)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer w-full"
          />
          {thumbnailFile && (
            <p className="text-[10px] text-emerald-400 mt-2 font-medium">
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
          className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[0.98]"
              : "border-white/10 bg-black/20"
          }`}
        >
          <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm mb-1">Drag files here</p>
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
            className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            or browse local files
          </label>
        </div>

        {/* Link Section */}
        <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
          <Label className="text-[10px] uppercase text-gray-500 mb-2 font-bold tracking-widest">
            Link Assets (Google Drive, Mega, etc)
          </Label>
          <div className="flex flex-col gap-2">
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Asset Title (e.g. Logo Pack)"
              className="bg-black/40 border-white/5 text-sm h-9"
            />
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="bg-black/40 border-white/5 text-sm h-9"
              />
              <Button
                onClick={handleAddLink}
                type="button"
                size="sm"
                className="bg-white/10 hover:bg-white/20 px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Queue List */}
        {files.length > 0 && (
          <div className="mb-4 max-h-24 overflow-y-auto bg-black/40 rounded-lg p-2 border border-white/5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-1 border-b border-white/5 last:border-0"
              >
                <span className="text-[10px] truncate text-gray-400 max-w-[200px]">
                  {file.isLink ? `🔗 ${file.title}` : `📁 ${file.name}`}
                </span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="text-red-500 hover:text-red-400 text-[10px] font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={isLoading || totalItemsCount === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-6 text-sm font-bold shadow-lg shadow-blue-900/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Publish ${totalItemsCount} Asset${
              totalItemsCount !== 1 ? "s" : ""
            }`
          )}
        </Button>
      </div>
    </div>
  );
}
