/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { X, Upload, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/supabase"; // Ensure this is your configured supabase client

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

  // ... (handleDrop and handleFileSelect stay the same)

  // ... inside UploadFilesModal ...

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // 1. handleDrop should NOT have [files] in the dependency array

  // Helper to recursively get all files from a directory entry
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
        // Recursively scan subfolders
        const recursiveFiles = await scanEntries(innerEntries);
        allFiles = [...allFiles, ...recursiveFiles];
      }
    }
    return allFiles;
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);

    // webkitGetAsEntry is the key to reading folders
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

  if (!isOpen) return null;
  // 2. handleFileSelect doesn't need useCallback, just a regular function
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
      // Capture the current files into a local variable
      // This prevents the "write after end" if setFiles is called mid-loop
      const filesToUpload = [...files];

      for (const item of filesToUpload) {
        let finalUrl = "";
        let title = "";

        if (item.isLink) {
          finalUrl = item.url;
          title = item.title;
        } else {
          const fileExt = item.name.split(".").pop();
          const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
          const filePath = `${tier}/${fileName}`;

          const { data, error: uploadError } = await supabase.storage
            .from("assets")
            .upload(filePath, item);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(filePath);

          finalUrl = publicUrl;
          title = item.name;
        }

        // Save to Database
        await onSubmit({
          title: title,
          file_url: finalUrl,
          thumbnail_url: finalUrl,
          tier: tier.toLowerCase(), // Force lowercase to match filter
          folder_id: folderId,
        });
      }

      setFiles([]); // Clear files ONLY after loop finishes
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
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
            webkitdirectory="true" // Allows folder selection in Chrome/Safari/Edge
            mozdirectory="true" // Allows folder selection in Firefox
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
