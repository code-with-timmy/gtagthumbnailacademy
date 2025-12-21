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
    limit: 5368709120, // 5GB
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setUser(profile);

      // --- EXPIRATION & ACCESS CHECK ---
      const isAdmin =
        profile.role === "admin" || profile.email === "codydankdabs@gmail.com";
      const isExpired = profile.expires_at
        ? new Date() > new Date(profile.expires_at)
        : false;

      if (!isAdmin) {
        // If expired or no tier, kick to purchase
        if (
          isExpired ||
          !profile.subscription_tier ||
          profile.subscription_tier === "none"
        ) {
          navigate("/purchase");
          return;
        }
      }

      // Sync active tab with user tier if not expired
      if (profile.subscription_tier && !isExpired) {
        setActiveTier(
          profile.subscription_tier === "vip"
            ? "vip"
            : profile.subscription_tier
        );
      }

      const [foldersRes, filesRes] = await Promise.all([
        supabase
          .from("asset_folders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("asset_files")
          .select("*")
          .order("created_at", { ascending: false }),
        calculateStorage(),
      ]);

      setFolders(foldersRes.data || []);
      setFiles(filesRes.data || []);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStorage = async () => {
    const { data, error } = await supabase.storage.from("assets").list("", {
      limit: 1000,
    });
    if (!error && data) {
      const totalBytes = data.reduce(
        (acc, file) => acc + (file.metadata?.size || 0),
        0
      );
      setStorageStats((prev) => ({ ...prev, used: totalBytes }));
    }
  };

  const canAccessTier = (tier) => {
    if (user?.role === "admin" || user?.email === "codydankdabs@gmail.com")
      return true;

    // Time-based check
    if (user?.expires_at && new Date() > new Date(user.expires_at))
      return false;

    const tierOrder = { none: 0, basic: 1, premium: 2, vip: 3, lifetime: 3 };
    const userRank = tierOrder[user?.subscription_tier] || 0;
    const targetRank = tierOrder[tier] || 0;
    return userRank >= targetRank;
  };

  const handleTierChange = (tier) => {
    if (canAccessTier(tier)) {
      setActiveTier(tier);
      setCurrentFolderId(null);
    } else {
      navigate("/purchase");
    }
  };

  // --- CRUD Handlers ---
  const handleCreateFolder = async (data) => {
    const { error } = await supabase.from("asset_folders").insert([data]);
    if (!error) loadData();
    setIsCreateFolderOpen(false);
  };

  const handleUploadFile = async (data) => {
    const { error } = await supabase.from("asset_files").insert([data]);
    if (!error) loadData();
    setIsUploadOpen(false);
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
    if (!window.confirm("Delete folder and all files inside?")) return;
    try {
      const filesToDelete = files.filter((f) => f.folder_id === folderId);
      if (filesToDelete.length > 0) {
        const paths = filesToDelete.map((f) => f.file_url.split("/assets/")[1]);
        await supabase.storage.from("assets").remove(paths);
      }
      await supabase.from("asset_folders").delete().eq("id", folderId);
      loadData();
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
      const storagePath = file.file_url.split("/assets/")[1];
      if (storagePath) {
        await supabase.storage.from("assets").remove([storagePath]);
      }
      await supabase.from("asset_files").delete().eq("id", file.id);
      loadData();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name || "download");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(file.file_url, "_blank");
    }
  };

  // --- Filter Logic ---
  const filteredFolders = folders.filter((f) => f.tier === activeTier);
  const filteredFiles = currentFolderId
    ? files.filter((f) => f.folder_id === currentFolderId)
    : files.filter((f) => f.tier === activeTier && !f.folder_id);

  const isAdmin =
    user?.role === "admin" || user?.email === "codydankdabs@gmail.com";
  const tierNames = { basic: "Basic", premium: "Premium", vip: "VIP Access" };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
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

  return (
    <div className="min-h-screen py-8 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {isAdmin && (
          <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Storage Usage
                </p>
                <p className="text-sm font-bold">
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
                <ArrowLeft className="w-4 h-4" /> Back to folders
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-300 text-sm mb-3">
              <Sparkles className="w-4 h-4" /> Exclusive Course Assets
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
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
                  onDelete={() => handleDeleteFile(file)}
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
