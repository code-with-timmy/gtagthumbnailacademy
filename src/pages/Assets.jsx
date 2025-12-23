import React, { useState, useEffect } from "react";
import supabase from "@/supabase";
import {
  Plus,
  Search,
  File,
  Download,
  ExternalLink,
  ImageIcon,
  Loader2,
  Trash2,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Assets() {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [isLink, setIsLink] = useState(true); // Default to Link for GDrive
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetFile, setAssetFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [selectedTier, setSelectedTier] = useState("basic");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setLoading(true);
    const { data, error } = await supabase
      .from("asset_files")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setAssets(data);
    setLoading(false);
  }

  const handleUpload = async () => {
    if (!assetName || (!assetUrl && !assetFile)) {
      alert("Please provide a name and a file/link.");
      return;
    }

    setIsUploading(true);
    try {
      let finalFileUrl = assetUrl;
      let finalThumbUrl = "";

      // 1. Upload Thumbnail to Supabase Storage
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `thumbnails/${Date.now()}.${thumbExt}`;
        const { error: thumbError } = await supabase.storage
          .from("assets")
          .upload(thumbPath, thumbnailFile);

        if (thumbError) throw thumbError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(thumbPath);
        finalThumbUrl = publicUrl;
      }

      // 2. Upload Asset File (if not using GDrive link)
      if (!isLink && assetFile) {
        const fileExt = assetFile.name.split(".").pop();
        const filePath = `files/${Date.now()}.${fileExt}`;
        const { error: fileError } = await supabase.storage
          .from("assets")
          .upload(filePath, assetFile);

        if (fileError) throw fileError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }

      // 3. Insert into Database
      const { error: dbError } = await supabase.from("asset_files").insert([
        {
          name: assetName,
          file_url: finalFileUrl,
          thumbnail_url: finalThumbUrl,
          required_tier: selectedTier,
          type: isLink ? "link" : "file",
        },
      ]);

      if (dbError) throw dbError;

      setIsUploadOpen(false);
      resetForm();
      fetchAssets();
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setAssetName("");
    setAssetUrl("");
    setAssetFile(null);
    setThumbnailFile(null);
    setIsLink(true);
  };

  const deleteAsset = async (id, thumbPath, filePath) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("asset_files").delete().eq("id", id);
    fetchAssets();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Exclusive Assets
            </h1>
            <p className="text-slate-400 mt-2">
              Professional resources and templates for your projects.
            </p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                <Plus className="w-4 h-4 mr-2" /> Add New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Create Asset Entry</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label>Asset Name</Label>
                  <Input
                    placeholder="e.g. 4K Texture Pack"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="bg-slate-800 border-slate-700 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-400" />
                    <Label className="cursor-pointer">
                      External Link (Google Drive)
                    </Label>
                  </div>
                  <Switch checked={isLink} onCheckedChange={setIsLink} />
                </div>

                {isLink ? (
                  <div className="space-y-2">
                    <Label>Google Drive / Dropbox URL</Label>
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={assetUrl}
                      onChange={(e) => setAssetUrl(e.target.value)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Upload File Directly</Label>
                    <Input
                      type="file"
                      onChange={(e) => setAssetFile(e.target.files[0])}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Thumbnail (1920x1080)</Label>
                  <div
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors ${
                      thumbnailFile
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-slate-700 hover:border-blue-500/50 bg-slate-800/30"
                    }`}
                  >
                    {thumbnailFile ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {thumbnailFile.name}
                        </span>
                        <X
                          className="w-4 h-4 cursor-pointer text-slate-400 hover:text-white"
                          onClick={() => setThumbnailFile(null)}
                        />
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center group">
                        <ImageIcon className="w-10 h-10 text-slate-500 mb-2 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs text-slate-400 font-medium">
                          Click to upload preview image
                        </span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-bold shadow-lg shadow-blue-900/20"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {isUploading ? "Processing..." : "Publish Asset"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <p className="text-slate-500 animate-pulse">Loading vault...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                {/* 1920x1080 Thumbnail Section */}
                <div className="aspect-video w-full bg-slate-800 relative overflow-hidden">
                  {asset.thumbnail_url ? (
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-700">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => window.open(asset.file_url, "_blank")}
                      className="bg-white text-black hover:bg-blue-500 hover:text-white font-bold px-8 shadow-xl"
                    >
                      {asset.type === "link" ? (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {asset.type === "link"
                        ? "Open in Drive"
                        : "Download File"}
                    </Button>
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                      {asset.required_tier} Tier
                    </p>
                  </div>
                </div>

                <div className="p-5 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate text-slate-100">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Added {new Date(asset.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Admin Delete Action - Optional */}
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-400">
              No assets found
            </h3>
            <p className="text-slate-600 mt-2">
              Check back later or upload your first asset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
