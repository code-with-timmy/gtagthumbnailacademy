import React, { useState, useEffect } from "react";
import supabase from "@/supabase";
import {
  Plus,
  File,
  Download,
  ExternalLink,
  ImageIcon,
  Loader2,
  Trash2,
  X,
  Link as LinkIcon,
  UploadCloud,
  AlertCircle,
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
  const [isLink, setIsLink] = useState(true);
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetFile, setAssetFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Live preview for thumbnail
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  // Create preview when thumbnail is selected
  useEffect(() => {
    if (!thumbnailFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

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
      alert("Please provide a name and a file or link.");
      return;
    }

    setIsUploading(true);
    try {
      let finalFileUrl = assetUrl;
      let finalThumbUrl = "";

      // 1. Upload Thumbnail
      if (thumbnailFile) {
        const thumbPath = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
        const { error: thumbError } = await supabase.storage
          .from("assets")
          .upload(thumbPath, thumbnailFile);

        if (thumbError) throw thumbError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(thumbPath);
        finalThumbUrl = publicUrl;
      }

      // 2. Upload Asset File (if not a link)
      if (!isLink && assetFile) {
        const filePath = `files/${Date.now()}-${assetFile.name}`;
        const { error: fileError } = await supabase.storage
          .from("assets")
          .upload(filePath, assetFile);

        if (fileError) throw fileError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      }

      // 3. Save to Database
      const { error: dbError } = await supabase.from("asset_files").insert([
        {
          name: assetName,
          file_url: finalFileUrl,
          thumbnail_url: finalThumbUrl,
          type: isLink ? "link" : "file",
        },
      ]);

      if (dbError) throw dbError;

      setIsUploadOpen(false);
      resetForm();
      fetchAssets();
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setAssetName("");
    setAssetUrl("");
    setAssetFile(null);
    setThumbnailFile(null);
    setPreviewUrl(null);
    setIsLink(true);
  };

  const deleteAsset = async (id) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    await supabase.from("asset_files").delete().eq("id", id);
    fetchAssets();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Asset Library
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your thumbnails and download links.
            </p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 px-8 py-6 rounded-xl transition-all hover:scale-105">
                <Plus className="w-5 h-5 mr-2" /> Upload New Asset
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  New Asset Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* 1. NAME */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Asset Title</Label>
                  <Input
                    placeholder="e.g. Masterclass Thumbnail Kit"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="bg-slate-950 border-slate-700 h-12"
                  />
                </div>

                {/* 2. THE ASSET SOURCE (LINK OR FILE) */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-blue-400" /> Asset
                      Source
                    </Label>
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
                      <span
                        className={`text-[10px] font-bold ${
                          isLink ? "text-blue-400" : "text-slate-500"
                        }`}
                      >
                        LINK
                      </span>
                      <Switch checked={isLink} onCheckedChange={setIsLink} />
                    </div>
                  </div>

                  {isLink ? (
                    <Input
                      placeholder="Paste Google Drive Link here..."
                      value={assetUrl}
                      onChange={(e) => setAssetUrl(e.target.value)}
                      className="bg-slate-900 border-slate-700"
                    />
                  ) : (
                    <Input
                      type="file"
                      onChange={(e) => setAssetFile(e.target.files[0])}
                      className="bg-slate-900 border-slate-700"
                    />
                  )}
                </div>

                {/* 3. THUMBNAIL UPLOAD (THE PART YOU WERE MISSING) */}
                <div className="space-y-3">
                  <Label className="text-slate-400 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    Preview Image (1920x1080)
                  </Label>

                  <div
                    className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl overflow-hidden transition-all h-48 ${
                      thumbnailFile
                        ? "border-emerald-500/50 bg-slate-950"
                        : "border-slate-700 hover:border-blue-500/50 bg-slate-950/50"
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          className="w-full h-full object-cover opacity-60"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                          <p className="text-sm font-bold text-white mb-2">
                            {thumbnailFile.name}
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setThumbnailFile(null)}
                            className="h-8"
                          >
                            <X className="w-4 h-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full group">
                        <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                        <span className="text-sm text-slate-400 font-medium">
                          Click to upload thumbnail
                        </span>
                        <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">
                          JPG, PNG, WEBP
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
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Publish Asset"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
            <p className="text-slate-500">Fetching your assets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300"
              >
                {/* 16:9 Thumbnail Container */}
                <div className="aspect-video w-full bg-slate-800 relative">
                  {asset.thumbnail_url ? (
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-700 italic text-sm">
                      No Preview Image
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => window.open(asset.file_url, "_blank")}
                      className="bg-white text-black hover:bg-blue-500 hover:text-white"
                    >
                      {asset.file_url.includes("drive.google.com") ? (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {asset.file_url.includes("drive.google.com")
                        ? "Open Drive Link"
                        : "Download File"}
                    </Button>
                  </div>
                </div>

                <div className="p-5 flex justify-between items-center">
                  <h3 className="font-bold truncate pr-4">{asset.name}</h3>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Your library is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
