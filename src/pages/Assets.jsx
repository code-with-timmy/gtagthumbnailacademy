import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // Adjust based on your setup
import {
  Plus,
  Search,
  Folder,
  File,
  Download,
  ExternalLink,
  MoreVertical,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  Loader2,
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
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [isLink, setIsLink] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState(""); // For GDrive Link
  const [assetFile, setAssetFile] = useState(null); // For direct file upload
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [selectedTier, setSelectedTier] = useState("basic");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [currentFolder]);

  async function fetchAssets() {
    setLoading(true);
    const { data, error } = await supabase
      .from("asset_files")
      .select("*")
      .eq("parent_id", currentFolder?.id || null)
      .order("created_at", { ascending: false });

    if (!error) setAssets(data);
    setLoading(false);
  }

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      let finalFileUrl = assetUrl;
      let finalThumbUrl = "";

      // 1. Handle Thumbnail Upload (Required for your 1920x1080 preview)
      if (thumbnailFile) {
        const thumbName = `thumbs/${Date.now()}-${thumbnailFile.name}`;
        const { data: thumbData } = await supabase.storage
          .from("assets")
          .upload(thumbName, thumbnailFile);

        if (thumbData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(thumbName);
          finalThumbUrl = publicUrl;
        }
      }

      // 2. Handle Asset File (if not a link)
      if (!isLink && assetFile) {
        const fileName = `files/${Date.now()}-${assetFile.name}`;
        const { data: fileData } = await supabase.storage
          .from("assets")
          .upload(fileName, assetFile);

        if (fileData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("assets").getPublicUrl(fileName);
          finalFileUrl = publicUrl;
        }
      }

      // 3. Save to Database
      const { error } = await supabase.from("asset_files").insert([
        {
          name: assetName,
          file_url: finalFileUrl,
          thumbnail_url: finalThumbUrl,
          type: isLink ? "link" : "file",
          required_tier: selectedTier,
          parent_id: currentFolder?.id || null,
        },
      ]);

      if (error) throw error;

      setIsUploadOpen(false);
      resetForm();
      fetchAssets();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setAssetName("");
    setAssetUrl("");
    setAssetFile(null);
    setThumbnailFile(null);
    setIsLink(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Course Assets</h1>
            <p className="text-slate-400">
              Manage your thumbnails and download links
            </p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>Upload New Asset</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Asset Name</Label>
                  <Input
                    placeholder="e.g. Photoshop Overlay Pack"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <Switch checked={isLink} onCheckedChange={setIsLink} />
                  <Label>Use External Link (Google Drive/Dropbox)</Label>
                </div>

                {isLink ? (
                  <div className="space-y-2">
                    <Label>Google Drive URL</Label>
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={assetUrl}
                      onChange={(e) => setAssetUrl(e.target.value)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <Input
                      type="file"
                      onChange={(e) => setAssetFile(e.target.files[0])}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Thumbnail (1920x1080 Recommended)</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg p-4 bg-slate-800/50">
                    {thumbnailFile ? (
                      <p className="text-sm text-blue-400">
                        {thumbnailFile.name}
                      </p>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-400">
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Asset"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                {/* Thumbnail Container: 16:9 Aspect Ratio */}
                <div className="aspect-video w-full bg-slate-800 relative overflow-hidden">
                  {asset.thumbnail_url ? (
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-600">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black"
                      onClick={() => window.open(asset.file_url, "_blank")}
                    >
                      {asset.type === "link" ? (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {asset.type === "link" ? "Open Link" : "Download"}
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold truncate max-w-[200px]">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      {asset.required_tier} Tier
                    </p>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg">
                    {asset.type === "link" ? (
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Download className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
