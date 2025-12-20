import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase";
import {
  Loader2,
  Lock,
  Sparkles,
  FolderPlus,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FolderCard from "@/assets/FolderCard";
import AssetTierTabs from "@/assets/AssetTierTabs";
import FileCard from "@/assets/FileCard";
import CreateFolderModal from "@/assets/CreateFolderModal";
import UploadFilesModal from "@/assets/UploadFilesModal";
import EditFolderModal from "@/assets/EditFolderModal";
import EditFileModal from "@/assets/EditFileModal";

export default function Assets() {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTier, setActiveTier] = useState("basic");
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [isEditFileOpen, setIsEditFileOpen] = useState(false);
  const [storageStats, setStorageStats] = useState({
    used: 0,
    limit: 5368709120,
  }); // 5GB in bytes
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // ... (Your existing session and profile code)

      // 4. Fetch Folders, Files, and Storage Stats simultaneously
      const [foldersRes, filesRes] = await Promise.all([
        supabase
          .from("asset_folders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("asset_files")
          .select("*")
          .order("created_at", { ascending: false }),
        calculateStorage(), // Add this here!
      ]);

      if (foldersRes.error) throw foldersRes.error;
      if (filesRes.error) throw filesRes.error;

      setFolders(foldersRes.data || []);
      setFiles(filesRes.data || []);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canAccessTier = (tier) => {
    if (user?.role === "admin") return true;
    const tierOrder = { none: 0, basic: 1, premium: 2, vip: 3 };
    const userRank = tierOrder[user?.subscription_tier] || 0;
    const targetRank = tierOrder[tier] || 0;
    return userRank >= targetRank;
  };

  const calculateStorage = async () => {
    // This fetches metadata for all objects in the 'assets' bucket
    const { data, error } = await supabase.storage.from("assets").list("", {
      limit: 1000,
      offset: 0,
    });

    if (!error && data) {
      const totalBytes = data.reduce(
        (acc, file) => acc + (file.metadata?.size || 0),
        0
      );
      setStorageStats((prev) => ({ ...prev, used: totalBytes }));
    }
  };
  const handleTierChange = (tier) => {
    if (canAccessTier(tier)) {
      setActiveTier(tier);
      setCurrentFolderId(null);
    }
  };

  // --- CRUD Handlers (Supabase Implementation) ---
  const handleCreateFolder = async (data) => {
    const { error } = await supabase.from("asset_folders").insert([data]);
    if (!error) loadData();
  };

  const handleUploadFile = async (data) => {
    const { error } = await supabase.from("asset_files").insert([data]);
    if (!error) loadData();
  };

  const handleSaveFolder = async (data) => {
    const { error } = await supabase
      .from("asset_folders")
      .update(data)
      .eq("id", editingFolder.id);
    if (!error) {
      setIsEditFolderOpen(false);
      setEditingFolder(null);
      loadData();
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const confirmDelete = window.confirm("Delete folder and all files inside?");
    if (!confirmDelete) return;

    try {
      // 1. Find all files in this folder to clean up storage
      const filesToDelete = files.filter((f) => f.folder_id === folderId);

      if (filesToDelete.length > 0) {
        const paths = filesToDelete.map((f) => f.file_url.split("/assets/")[1]);
        await supabase.storage.from("assets").remove(paths);
      }

      // 2. Delete the folder (Database RLS/Foreign Keys handle the file row deletion)
      const { error } = await supabase
        .from("asset_folders")
        .delete()
        .eq("id", folderId);

      if (!error) loadData();
    } catch (error) {
      console.error("Folder deletion failed:", error);
    }
  };
  const handleSaveFile = async (data) => {
    const { error } = await supabase
      .from("asset_files")
      .update(data)
      .eq("id", editingFile.id);
    if (!error) {
      setIsEditFileOpen(false);
      setEditingFile(null);
      loadData();
    }
  };

  const handleDeleteFile = async (file) => {
    try {
      // 1. Extract the storage path from the URL
      // This assumes your URL looks like: .../storage/v1/object/public/assets/tier/filename.ext
      const urlParts = file.file_url.split("/assets/");
      const storagePath = urlParts[1];

      if (storagePath) {
        // 2. Delete from Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("assets")
          .remove([storagePath]);

        if (storageError)
          console.error("Storage cleanup failed:", storageError);
      }

      // 3. Delete from Database
      const { error: dbError } = await supabase
        .from("asset_files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;

      loadData();
    } catch (error) {
      console.error("Error deleting asset:", error.message);
      alert("Failed to delete asset fully.");
    }
  };

  const handleDownload = (file) => {
    window.open(file.file_url, "_blank");
  };

  // --- Filter Logic ---
  const filteredFolders = folders.filter((f) => f.tier === activeTier);
  const filteredFiles = currentFolderId
    ? files.filter((f) => f.folder_id === currentFolderId)
    : files.filter((f) => f.tier === activeTier && !f.folder_id);

  const isAdmin = user?.role === "admin";
  const tierNames = { basic: "Basic", premium: "Premium", vip: "VIP Access" };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const usedMB = (storageStats.used / 1024 / 1024).toFixed(1);
  const limitMB = (storageStats.limit / 1024 / 1024).toFixed(0);
  const percentage = Math.min(
    (storageStats.used / storageStats.limit) * 100,
    100
  );

  // JSX to place at the top of your page

  // Same JSX structure as your original code
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {isAdmin && (
          <div className="mb-6 p-4 glass-card rounded-xl border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Storage Usage
                </p>
                <p className="text-sm font-bold text-white">
                  {usedMB} MB / {limitMB} MB
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentage > 80 ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        <AssetTierTabs
          activeTier={activeTier}
          setActiveTier={handleTierChange}
          userTier={user?.subscription_tier || "none"}
          onUpgradeClick={() => navigate("/purchase")}
        />

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            {currentFolderId && (
              <button
                onClick={() => setCurrentFolderId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to folders
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-300 text-sm mb-3">
              <Sparkles className="w-4 h-4" />
              Exclusive Course Assets
            </div>
            <h1 className="coolvetica text-3xl md:text-4xl font-bold">
              {tierNames[activeTier]} Tier Assets
            </h1>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCreateFolderOpen(true)}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <FolderPlus className="w-4 h-4 mr-2" /> New Folder
              </Button>
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500"
              >
                <Upload className="w-4 h-4 mr-2" /> Upload Files
              </Button>
            </div>
          )}
        </div>

        {/* Folders Section */}
        {!currentFolderId && filteredFolders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Folders</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  isAdmin={isAdmin}
                  onClick={() => setCurrentFolderId(folder.id)}
                  onEdit={() => {
                    setEditingFolder(folder);
                    setIsEditFolderOpen(true);
                  }}
                  onDelete={() => handleDeleteFolder(folder.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Files</h2>
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  isAdmin={isAdmin}
                  onDownload={() => handleDownload(file)}
                  onEdit={() => {
                    setEditingFile(file);
                    setIsEditFileOpen(true);
                  }}
                  onDelete={() => handleDeleteFile(file)} // Pass the whole file object here
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No files in this {currentFolderId ? "folder" : "tier"} yet
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same, just ensured onSubmit points to new handlers */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
        tier={activeTier}
      />
      <UploadFilesModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUploadFile}
        tier={activeTier}
        folderId={currentFolderId}
      />
      <EditFolderModal
        folder={editingFolder}
        isOpen={isEditFolderOpen}
        onClose={() => setIsEditFolderOpen(false)}
        onSave={handleSaveFolder}
      />
      <EditFileModal
        file={editingFile}
        isOpen={isEditFileOpen}
        onClose={() => setIsEditFileOpen(false)}
        onSave={handleSaveFile}
      />
    </div>
  );
}
