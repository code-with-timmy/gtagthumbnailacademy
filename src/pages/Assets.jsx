// import React, { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Download, FileImage, Sparkles, FolderPlus, Folder, Upload, Pencil, Trash2, Loader2, ArrowLeft, Lock, ChevronRight, Zap, Crown, Star, GripVertical, Archive } from "lucide-react";
// import JSZip from "jszip";
// import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";
// import { useAccessTier, hasAccess, AccessDenied } from "../components/AccessCheck";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// export default function Assets() {
//   const [user, setUser] = useState(null);
//   const [currentFolderId, setCurrentFolderId] = useState(null);
//   const [activeTab, setActiveTab] = useState("basic");
//   const { tier, isLoading: isLoadingTier } = useAccessTier();
//   const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
//   const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
//   const [isRenameOpen, setIsRenameOpen] = useState(false);
//   const [selectedAsset, setSelectedAsset] = useState(null);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [renameName, setRenameName] = useState("");
//   const [editLink, setEditLink] = useState("");
//   const [editFile, setEditFile] = useState(null);
//   const [editThumbnail, setEditThumbnail] = useState(null);
//   const [editTier, setEditTier] = useState("basic");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [bulkFiles, setBulkFiles] = useState([]);
//   const [fileMetadata, setFileMetadata] = useState({});
//   const [linkEntries, setLinkEntries] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [selectedAssets, setSelectedAssets] = useState([]);

//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const currentUser = await base44.auth.me();
//         setUser(currentUser);
//       } catch (error) {
//         console.error("Error loading user:", error);
//       }
//     };
//     loadUser();
//   }, []);

//   const { data: assets = [], isLoading } = useQuery({
//     queryKey: ['assets', currentFolderId],
//     queryFn: () => base44.entities.Asset.filter({
//       parent_id: currentFolderId || null
//     }, 'order'),
//     initialData: []
//   });

//   const { data: currentFolder } = useQuery({
//     queryKey: ['asset', currentFolderId],
//     queryFn: () => currentFolderId ? base44.entities.Asset.filter({ id: currentFolderId })[0] : null,
//     enabled: !!currentFolderId
//   });

//   const createFolderMutation = useMutation({
//     mutationFn: (data) => base44.entities.Asset.create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//       setIsCreateFolderOpen(false);
//       setNewFolderName("");
//     }
//   });

//   const createFileMutation = useMutation({
//     mutationFn: (data) => base44.entities.Asset.create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//       setIsUploadFileOpen(false);
//       setSelectedFile(null);
//     }
//   });

//   const updateAssetMutation = useMutation({
//     mutationFn: ({ id, data }) => base44.entities.Asset.update(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//       setIsRenameOpen(false);
//       setSelectedAsset(null);
//       setRenameName("");
//     }
//   });

//   const deleteAssetMutation = useMutation({
//     mutationFn: (id) => base44.entities.Asset.delete(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//     }
//   });

//   const handleBulkDelete = async () => {
//     if (selectedAssets.length === 0) return;
//     if (!confirm(`Delete ${selectedAssets.length} selected item${selectedAssets.length > 1 ? 's' : ''}?`)) return;

//     for (const id of selectedAssets) {
//       try {
//         await base44.entities.Asset.delete(id);
//       } catch (error) {
//         console.error(`Failed to delete asset ${id}:`, error);
//       }
//     }
//     queryClient.invalidateQueries({ queryKey: ['assets'] });
//     setSelectedAssets([]);
//   };

//   const toggleSelectAsset = (id) => {
//     setSelectedAssets(prev =>
//       prev.includes(id) ? prev.filter(assetId => assetId !== id) : [...prev, id]
//     );
//   };

//   const handleDragEnd = async (result) => {
//     if (!result.destination) return;
//     if (result.source.index === result.destination.index) return;

//     const items = Array.from(currentFiles);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     // Only update the moved item's order
//     const sourceIndex = result.source.index;
//     const destIndex = result.destination.index;

//     try {
//       await base44.entities.Asset.update(items[destIndex].id, { order: destIndex });
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//     } catch (error) {
//       console.error('Failed to reorder:', error);
//     }
//   };

//   const handleCreateFolder = () => {
//     if (!newFolderName.trim()) return;
//     createFolderMutation.mutate({
//       name: newFolderName,
//       type: "folder",
//       parent_id: currentFolderId,
//       required_tier: activeTab,
//       order: assets.length
//     });
//   };

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setBulkFiles(files);
//       const metadata = {};
//       files.forEach((file, index) => {
//         metadata[index] = { link: '', thumbnailFile: null, tier: activeTab };
//       });
//       setFileMetadata(metadata);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       setBulkFiles(files);
//       const metadata = {};
//       files.forEach((file, index) => {
//         metadata[index] = { link: '', thumbnailFile: null, tier: activeTab };
//       });
//       setFileMetadata(metadata);
//       setIsUploadFileOpen(true);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (bulkFiles.length === 0 && linkEntries.length === 0) return;

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       const totalItems = bulkFiles.length + linkEntries.length;
//       let completed = 0;

//       // Upload files with optional links
//       for (let i = 0; i < bulkFiles.length; i++) {
//         const file = bulkFiles[i];
//         setUploadProgress(Math.round((completed / totalItems) * 100));

//         const { file_url } = await base44.integrations.Core.UploadFile({ file });

//         // Upload thumbnail if provided
//         let thumbnailUrl = null;
//         if (fileMetadata[i]?.thumbnailFile) {
//           const { file_url: thumb_url } = await base44.integrations.Core.UploadFile({
//             file: fileMetadata[i].thumbnailFile
//           });
//           thumbnailUrl = thumb_url;
//         } else if (file.type.startsWith('image/')) {
//           thumbnailUrl = file_url;
//         }

//         await base44.entities.Asset.create({
//           name: file.name.replace(/\.[^/.]+$/, ""),
//           type: "file",
//           parent_id: currentFolderId,
//           file_url: file_url,
//           thumbnail_url: thumbnailUrl,
//           link: fileMetadata[i]?.link || null,
//           required_tier: fileMetadata[i]?.tier || activeTab,
//           order: assets.length + completed
//         });
//         completed++;
//       }

//       // Create link-only entries
//       for (let i = 0; i < linkEntries.length; i++) {
//         const entry = linkEntries[i];
//         setUploadProgress(Math.round((completed / totalItems) * 100));

//         // Upload thumbnail if provided
//         let thumbnailUrl = null;
//         if (entry.thumbnailFile) {
//           const { file_url: thumb_url } = await base44.integrations.Core.UploadFile({
//             file: entry.thumbnailFile
//           });
//           thumbnailUrl = thumb_url;
//         }

//         await base44.entities.Asset.create({
//           name: entry.name,
//           type: "file",
//           parent_id: currentFolderId,
//           file_url: entry.link,
//           thumbnail_url: thumbnailUrl,
//           link: entry.link,
//           required_tier: entry.tier,
//           order: assets.length + completed
//         });
//         completed++;
//       }

//       setUploadProgress(100);
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//       setIsUploadFileOpen(false);
//       setBulkFiles([]);
//       setFileMetadata({});
//       setLinkEntries([]);
//     } catch (error) {
//       console.error("Upload failed:", error);
//     }

//     setIsUploading(false);
//   };

//   const handleRename = async () => {
//     if (!renameName.trim() || !selectedAsset) return;

//     setIsUpdating(true);

//     try {
//       let updateData = { name: renameName };

//       // Upload new file if provided
//       if (editFile) {
//         const { file_url } = await base44.integrations.Core.UploadFile({ file: editFile });
//         updateData.file_url = file_url;
//       }

//       // Upload new thumbnail if provided
//       if (editThumbnail) {
//         const { file_url: thumb_url } = await base44.integrations.Core.UploadFile({ file: editThumbnail });
//         updateData.thumbnail_url = thumb_url;
//       }

//       // Update link and tier
//       if (selectedAsset.type === 'file') {
//         updateData.link = editLink || null;
//       }
//       updateData.required_tier = editTier;

//       await base44.entities.Asset.update(selectedAsset.id, updateData);
//       queryClient.invalidateQueries({ queryKey: ['assets'] });
//       setIsRenameOpen(false);
//       setSelectedAsset(null);
//       setRenameName("");
//       setEditLink("");
//       setEditFile(null);
//       setEditThumbnail(null);
//     } catch (error) {
//       console.error("Update failed:", error);
//     }

//     setIsUpdating(false);
//   };

//   const handleOpenRename = (asset) => {
//     setSelectedAsset(asset);
//     setRenameName(asset.name);
//     setEditLink(asset.link || "");
//     setEditTier(asset.required_tier || "basic");
//     setEditFile(null);
//     setEditThumbnail(null);
//     setIsRenameOpen(true);
//   };

//   const folders = assets.filter(a => a.type === 'folder');
//   const files = assets.filter(a => a.type === 'file');

//   // Group by tier
//   const basicFolders = folders.filter(f => f.required_tier === 'basic');
//   const basicFiles = files.filter(f => f.required_tier === 'basic');
//   const premiumFolders = folders.filter(f => f.required_tier === 'premium');
//   const premiumFiles = files.filter(f => f.required_tier === 'premium');
//   const lifetimeFolders = folders.filter(f => f.required_tier === 'lifetime');
//   const lifetimeFiles = files.filter(f => f.required_tier === 'lifetime');

//   // Get current tier assets
//   const getCurrentTierAssets = () => {
//     if (activeTab === 'basic') return { folders: basicFolders, files: basicFiles };
//     if (activeTab === 'premium') return { folders: premiumFolders, files: premiumFiles };
//     if (activeTab === 'lifetime') return { folders: lifetimeFolders, files: lifetimeFiles };
//     return { folders: [], files: [] };
//   };

//   const { folders: currentFolders, files: currentFiles } = getCurrentTierAssets();
//   const hasAccessToCurrentTier = hasAccess(tier, activeTab);

//   const handleDownloadAll = async () => {
//     if (currentFiles.length === 0) return;

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       const zip = new JSZip();
//       const folderName = currentFolder?.name || `${activeTab}_tier_assets`;

//       for (let i = 0; i < currentFiles.length; i++) {
//         const file = currentFiles[i];
//         setUploadProgress(Math.round((i / currentFiles.length) * 100));

//         try {
//           const response = await fetch(file.file_url);
//           const blob = await response.blob();
//           const fileName = file.name.endsWith('.png') ? file.name : `${file.name}.png`;
//           zip.file(fileName, blob);
//         } catch (error) {
//           console.error(`Failed to download ${file.name}:`, error);
//         }
//       }

//       setUploadProgress(100);
//       const zipBlob = await zip.generateAsync({ type: 'blob' });
//       const url = window.URL.createObjectURL(zipBlob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${folderName}.zip`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       a.remove();
//     } catch (error) {
//       console.error('Failed to create zip:', error);
//     }

//     setIsUploading(false);
//     setUploadProgress(0);
//   };

//   if (isLoading || isLoadingTier) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
//       </div>
//     );
//   }

//   // Block access for non-admin/owner users without a tier
//   if (!isLoadingTier && !tier && user?.role !== 'admin' && user?.email !== 'codydankdabs@gmail.com') {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
//         <div className="max-w-2xl w-full text-center">
//           <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
//             <Lock className="w-12 h-12 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-white mb-4">
//             Purchase Required
//           </h1>
//           <p className="text-xl text-slate-400 mb-8">
//             Get access to exclusive professional assets and resources
//           </p>
//           <Link to={createPageUrl("Purchase")}>
//             <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-6 text-lg font-bold">
//               View Plans & Purchase
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Tier Navigation */}
//         {!currentFolderId && (
//           <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2">
//             <button
//               onClick={() => setActiveTab('basic')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
//                 activeTab === 'basic'
//                   ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
//                   : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//               }`}
//             >
//               <Zap className="w-5 h-5" />
//               Basic Tier
//               <span className="text-xs opacity-80">$50/mo</span>
//             </button>
//             <ChevronRight className="w-6 h-6 text-slate-600 flex-shrink-0" />
//             <button
//               onClick={() => setActiveTab('premium')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
//                 activeTab === 'premium'
//                   ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
//                   : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//               }`}
//             >
//               <Crown className="w-5 h-5" />
//               Premium Tier
//               <span className="text-xs opacity-80">$100/mo</span>
//             </button>
//             <ChevronRight className="w-6 h-6 text-slate-600 flex-shrink-0" />
//             <button
//               onClick={() => setActiveTab('lifetime')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
//                 activeTab === 'lifetime'
//                   ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
//                   : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//               }`}
//             >
//               <Star className="w-5 h-5" />
//               VIP Access
//               <span className="text-xs opacity-80">$300</span>
//             </button>
//           </div>
//         )}

//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               {currentFolderId && (
//                 <Button
//                   variant="ghost"
//                   onClick={() => setCurrentFolderId(null)}
//                   className="text-slate-400 hover:text-white mb-4"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to All Assets
//                 </Button>
//               )}
//               <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 rounded-full border border-purple-500/30 text-lg font-medium text-purple-400 mb-4">
//                 <Sparkles className="w-5 h-5" />
//                 {currentFolder ? currentFolder.name : "Exclusive Course Assets"}
//               </div>
//               <h1 className="text-5xl font-bold text-white mb-2">
//                 {currentFolder ? currentFolder.name :
//                   activeTab === 'basic' ? 'Basic Tier Assets' :
//                   activeTab === 'premium' ? 'Premium Tier Assets' :
//                   'VIP Access Tier Assets'
//                 }
//               </h1>
//               <p className="text-xl text-slate-400">
//                 {currentFolder ? "Browse files in this folder" : "Access professional resources for this tier"}
//               </p>
//             </div>

//             {user?.role === 'admin' && (
//               <div className="flex gap-3">
//                 {selectedAssets.length > 0 && (
//                   <Button
//                     onClick={handleBulkDelete}
//                     className="bg-red-600 hover:bg-red-700"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete ({selectedAssets.length})
//                   </Button>
//                 )}
//                 <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
//                       <FolderPlus className="w-4 h-4 mr-2" />
//                       New Folder
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="bg-slate-900 border-slate-800">
//                     <DialogHeader>
//                       <DialogTitle className="text-white">Create New Folder</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4 pt-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="folderName" className="text-slate-300">Folder Name</Label>
//                         <Input
//                           id="folderName"
//                           value={newFolderName}
//                           onChange={(e) => setNewFolderName(e.target.value)}
//                           placeholder="e.g., PSD Templates"
//                           className="bg-slate-800 border-slate-700 text-white"
//                         />
//                       </div>
//                       <Button
//                         onClick={handleCreateFolder}
//                         disabled={createFolderMutation.isPending}
//                         className="w-full bg-gradient-to-r from-sky-500 to-blue-600"
//                       >
//                         {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 <Dialog open={isUploadFileOpen} onOpenChange={(open) => {
//                   setIsUploadFileOpen(open);
//                   if (!open) {
//                     setBulkFiles([]);
//                     setFileMetadata({});
//                     setLinkEntries([]);
//                   }
//                 }}>
//                   <DialogTrigger asChild>
//                     <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
//                       <Upload className="w-4 h-4 mr-2" />
//                       Upload Files
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
//                     <DialogHeader>
//                       <DialogTitle className="text-white">Upload Assets</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4 pt-4">
//                       {/* Drag and Drop Zone */}
//                       <div
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop}
//                         className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
//                           isDragging
//                             ? 'border-sky-500 bg-sky-500/10'
//                             : 'border-slate-700 bg-slate-800/30'
//                         }`}
//                       >
//                         <input
//                           type="file"
//                           multiple
//                           onChange={handleFileSelect}
//                           className="hidden"
//                           id="bulk-upload"
//                         />
//                         <label htmlFor="bulk-upload" className="cursor-pointer block">
//                           <Upload className="w-12 h-12 mx-auto text-slate-600 mb-3 pointer-events-none" />
//                           <p className="text-lg font-medium text-slate-300 mb-1 pointer-events-none">
//                             Drag & drop files here
//                           </p>
//                           <p className="text-sm text-slate-500 pointer-events-none">
//                             or click to browse (multiple files supported)
//                           </p>
//                         </label>
//                       </div>

//                       {/* Add Link Button */}
//                       <div className="text-center">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             setLinkEntries([...linkEntries, {
//                               name: '',
//                               link: '',
//                               tier: activeTab,
//                               thumbnailFile: null
//                             }]);
//                           }}
//                           className="border-slate-700 text-slate-300 hover:bg-slate-800"
//                         >
//                           + Add Link (No File)
//                         </Button>
//                       </div>

//                       {/* Link Entries */}
//                       {linkEntries.length > 0 && (
//                         <div className="space-y-3">
//                           <Label className="text-slate-300">Link Entries ({linkEntries.length})</Label>
//                           <div className="max-h-96 overflow-y-auto space-y-3 bg-slate-800/50 rounded-lg p-3">
//                             {linkEntries.map((entry, index) => (
//                               <div key={`link-${index}`} className="p-3 bg-slate-800 rounded-lg space-y-3 border-2 border-purple-500/30">
//                                 <div className="flex items-center justify-between">
//                                   <span className="text-sm font-medium text-purple-400">Link Entry</span>
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-6 w-6 text-red-400 hover:text-red-300 flex-shrink-0"
//                                     onClick={() => {
//                                       setLinkEntries(linkEntries.filter((_, i) => i !== index));
//                                     }}
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                   </Button>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <div>
//                                     <Label className="text-xs text-slate-400">Name *</Label>
//                                     <Input
//                                       placeholder="Asset name"
//                                       value={entry.name}
//                                       onChange={(e) => {
//                                         const newEntries = [...linkEntries];
//                                         newEntries[index].name = e.target.value;
//                                         setLinkEntries(newEntries);
//                                       }}
//                                       className="bg-slate-900 border-slate-700 text-white text-sm h-8"
//                                     />
//                                   </div>

//                                   <div>
//                                     <Label className="text-xs text-slate-400">Link *</Label>
//                                     <Input
//                                       placeholder="https://example.com/download"
//                                       value={entry.link}
//                                       onChange={(e) => {
//                                         const newEntries = [...linkEntries];
//                                         newEntries[index].link = e.target.value;
//                                         setLinkEntries(newEntries);
//                                       }}
//                                       className="bg-slate-900 border-slate-700 text-white text-sm h-8"
//                                     />
//                                   </div>

//                                   <div>
//                                     <Label className="text-xs text-slate-400">Access Tier</Label>
//                                     <select
//                                       value={entry.tier}
//                                       onChange={(e) => {
//                                         const newEntries = [...linkEntries];
//                                         newEntries[index].tier = e.target.value;
//                                         setLinkEntries(newEntries);
//                                       }}
//                                       className="w-full h-8 px-3 bg-slate-900 border border-slate-700 text-white rounded-md text-sm"
//                                     >
//                                       <option value="basic">Basic ($50/mo)</option>
//                                       <option value="premium">Premium ($100/mo)</option>
//                                       <option value="lifetime">VIP Access ($300)</option>
//                                     </select>
//                                   </div>

//                                   <div>
//                                     <Label className="text-xs text-slate-400">Thumbnail (optional)</Label>
//                                     <Input
//                                       type="file"
//                                       accept="image/*"
//                                       onChange={(e) => {
//                                         const thumbFile = e.target.files?.[0];
//                                         if (thumbFile) {
//                                           const newEntries = [...linkEntries];
//                                           newEntries[index].thumbnailFile = thumbFile;
//                                           setLinkEntries(newEntries);
//                                         }
//                                       }}
//                                       className="bg-slate-900 border-slate-700 text-white text-sm h-8"
//                                     />
//                                     {entry.thumbnailFile && (
//                                       <span className="text-xs text-green-400 flex items-center mt-1">
//                                         ✓ {entry.thumbnailFile.name}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Selected Files List */}
//                       {bulkFiles.length > 0 && (
//                         <div className="space-y-3">
//                           <Label className="text-slate-300">Selected Files ({bulkFiles.length})</Label>
//                           <div className="max-h-96 overflow-y-auto space-y-3 bg-slate-800/50 rounded-lg p-3">
//                             {bulkFiles.map((file, index) => (
//                               <div key={index} className="p-3 bg-slate-800 rounded-lg space-y-3">
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center gap-2 flex-1 min-w-0">
//                                     <FileImage className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                                     <span className="text-sm text-slate-300 truncate font-medium">{file.name}</span>
//                                     <span className="text-xs text-slate-500 flex-shrink-0">
//                                       ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                                     </span>
//                                   </div>
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-6 w-6 text-red-400 hover:text-red-300 flex-shrink-0"
//                                     onClick={() => {
//                                       setBulkFiles(bulkFiles.filter((_, i) => i !== index));
//                                       const newMetadata = {...fileMetadata};
//                                       delete newMetadata[index];
//                                       setFileMetadata(newMetadata);
//                                     }}
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                   </Button>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <div>
//                                     <Label className="text-xs text-slate-400">Access Tier</Label>
//                                     <select
//                                       value={fileMetadata[index]?.tier || activeTab}
//                                       onChange={(e) => {
//                                         setFileMetadata({
//                                           ...fileMetadata,
//                                           [index]: { ...fileMetadata[index], tier: e.target.value }
//                                         });
//                                       }}
//                                       className="w-full h-8 px-3 bg-slate-900 border border-slate-700 text-white rounded-md text-sm"
//                                     >
//                                       <option value="basic">Basic ($50/mo)</option>
//                                       <option value="premium">Premium ($100/mo)</option>
//                                       <option value="lifetime">VIP Access ($300)</option>
//                                     </select>
//                                   </div>

//                                   <div>
//                                     <Label className="text-xs text-slate-400">Link (optional)</Label>
//                                     <Input
//                                       placeholder="https://example.com"
//                                       value={fileMetadata[index]?.link || ''}
//                                       onChange={(e) => {
//                                         setFileMetadata({
//                                           ...fileMetadata,
//                                           [index]: { ...fileMetadata[index], link: e.target.value }
//                                         });
//                                       }}
//                                       className="bg-slate-900 border-slate-700 text-white text-sm h-8"
//                                     />
//                                   </div>

//                                   <div>
//                                     <Label className="text-xs text-slate-400">Thumbnail (optional)</Label>
//                                     <div className="flex gap-2">
//                                       <Input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => {
//                                           const thumbFile = e.target.files?.[0];
//                                           if (thumbFile) {
//                                             setFileMetadata({
//                                               ...fileMetadata,
//                                               [index]: { ...fileMetadata[index], thumbnailFile: thumbFile }
//                                             });
//                                           }
//                                         }}
//                                         className="bg-slate-900 border-slate-700 text-white text-sm h-8"
//                                       />
//                                       {fileMetadata[index]?.thumbnailFile && (
//                                         <span className="text-xs text-green-400 flex items-center">
//                                           ✓ {fileMetadata[index].thumbnailFile.name}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <Button
//                         onClick={handleBulkUpload}
//                         disabled={isUploading || (bulkFiles.length === 0 && linkEntries.length === 0)}
//                         className="w-full bg-gradient-to-r from-sky-500 to-blue-600"
//                       >
//                         {isUploading ? (
//                           <>
//                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                             Uploading {Math.round(uploadProgress)}%
//                           </>
//                         ) : (
//                           `Upload ${bulkFiles.length + linkEntries.length} Item${(bulkFiles.length + linkEntries.length) !== 1 ? 's' : ''}`
//                         )}
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             )}
//           </div>

//           {/* Locked Tier Message */}
//           {!currentFolderId && !hasAccessToCurrentTier && (
//             <div className="mb-8 text-center py-12 px-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
//               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
//                 activeTab === 'basic' ? 'bg-blue-500/20' :
//                 activeTab === 'premium' ? 'bg-purple-500/20' :
//                 'bg-yellow-500/20'
//               }`}>
//                 <Lock className={`w-10 h-10 ${
//                   activeTab === 'basic' ? 'text-blue-400' :
//                   activeTab === 'premium' ? 'text-purple-400' :
//                   'text-yellow-400'
//                 }`} />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-3">
//                 {activeTab === 'basic' ? 'Basic' : activeTab === 'premium' ? 'Premium' : 'VIP Access'} Tier Locked
//               </h3>
//               <p className="text-slate-400 mb-6">
//                 Unlock {currentFolders.length + currentFiles.length} exclusive assets with {activeTab} access
//               </p>
//               <Link to={createPageUrl("Purchase")}>
//                 <Button className={`bg-gradient-to-r ${
//                   activeTab === 'basic' ? 'from-blue-500 to-cyan-500' :
//                   activeTab === 'premium' ? 'from-purple-500 to-pink-500' :
//                   'from-yellow-500 to-orange-500'
//                 } hover:opacity-90 text-lg px-8 py-6`}>
//                   {activeTab === 'basic' ? 'Unlock Basic - $50/month' :
//                    activeTab === 'premium' ? 'Upgrade to Premium - $100/month' :
//                    'Get VIP Access - $300'}
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Folders */}
//         {hasAccessToCurrentTier && currentFolders.length > 0 && (
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-white mb-4">Folders</h2>
//             <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {currentFolders.map((folder) => (
//                 <Card
//                   key={folder.id}
//                   className={`border-slate-800 bg-slate-900 hover:border-purple-500/50 transition-all cursor-pointer group relative ${
//                     selectedAssets.includes(folder.id) ? 'ring-2 ring-purple-500' : ''
//                   }`}
//                   onClick={() => setCurrentFolderId(folder.id)}
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                         <Folder className="w-6 h-6 text-white" />
//                       </div>
//                       {user?.role === 'admin' && (
//                         <div className="flex gap-1">
//                           <input
//                             type="checkbox"
//                             checked={selectedAssets.includes(folder.id)}
//                             onChange={(e) => {
//                               e.stopPropagation();
//                               toggleSelectAsset(folder.id);
//                             }}
//                             onClick={(e) => e.stopPropagation()}
//                             className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
//                           />
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-slate-400 hover:text-white"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleOpenRename(folder);
//                             }}
//                           >
//                             <Pencil className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-red-400 hover:text-red-300"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               if (confirm('Delete this folder?')) {
//                                 deleteAssetMutation.mutate(folder.id);
//                               }
//                             }}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                     <h3 className="text-white font-semibold">{folder.name}</h3>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Locked Folders Preview */}
//         {!hasAccessToCurrentTier && currentFolders.length > 0 && (
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-400 mb-4">Locked Folders ({currentFolders.length})</h2>
//             <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {currentFolders.slice(0, 4).map((folder) => (
//                 <Card
//                   key={folder.id}
//                   className="border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed"
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
//                         <Lock className="w-6 h-6 text-slate-500" />
//                       </div>
//                     </div>
//                     <h3 className="text-slate-400 font-semibold">{folder.name}</h3>
//                     <p className="text-xs text-slate-500 mt-2">
//                       Requires {folder.required_tier} tier
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Files */}
//         {hasAccessToCurrentTier && currentFiles.length > 0 && (
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-bold text-white">Files</h2>
//               <Button
//                 onClick={handleDownloadAll}
//                 disabled={isUploading}
//                 className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     {uploadProgress}%
//                   </>
//                 ) : (
//                   <>
//                     <Archive className="w-4 h-4 mr-2" />
//                     Download All ({currentFiles.length})
//                   </>
//                 )}
//               </Button>
//             </div>
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <Droppable droppableId="files" direction="horizontal">
//                 {(provided) => (
//                   <div
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                     className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
//                   >
//                     {currentFiles.map((file, index) => (
//                       <Draggable
//                         key={file.id}
//                         draggableId={file.id}
//                         index={index}
//                         isDragDisabled={user?.role !== 'admin'}
//                       >
//                         {(provided, snapshot) => (
//                           <Card
//                            ref={provided.innerRef}
//                            {...provided.draggableProps}
//                            className={`border-slate-800 bg-slate-900 hover:border-sky-500/50 transition-all group relative ${
//                              snapshot.isDragging ? 'ring-2 ring-sky-500 shadow-2xl' : ''
//                            } ${
//                              selectedAssets.includes(file.id) ? 'ring-2 ring-sky-500' : ''
//                            }`}
//                           >
//                            {user?.role === 'admin' && (
//                              <>
//                                <div
//                                  {...provided.dragHandleProps}
//                                  className="absolute top-2 left-2 z-50 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg p-2 cursor-grab active:cursor-grabbing shadow-xl hover:from-sky-600 hover:to-blue-700 transition-all"
//                                  title="Drag to reorder"
//                                >
//                                  <GripVertical className="w-5 h-5 text-white" />
//                                </div>
//                                <div className="absolute top-2 right-2 z-50">
//                                  <input
//                                    type="checkbox"
//                                    checked={selectedAssets.includes(file.id)}
//                                    onChange={() => toggleSelectAsset(file.id)}
//                                    className="w-5 h-5 rounded border-slate-600 text-sky-500 focus:ring-sky-500"
//                                  />
//                                </div>
//                              </>
//                            )}
//                            <CardHeader>
//                              <div className="relative overflow-hidden rounded-xl bg-slate-800 aspect-video mb-4">
//                                 {file.thumbnail_url ? (
//                                   <img
//                                     src={file.thumbnail_url}
//                                     alt={file.name}
//                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center">
//                                     <FileImage className="w-16 h-16 text-slate-600" />
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex items-start justify-between">
//                                 <CardTitle className="text-white text-lg">{file.name}</CardTitle>
//                                 {user?.role === 'admin' && (
//                                   <div className="flex gap-1">
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-8 w-8 text-slate-400 hover:text-white"
//                                       onClick={() => handleOpenRename(file)}
//                                     >
//                                       <Pencil className="w-4 h-4" />
//                                     </Button>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-8 w-8 text-red-400 hover:text-red-300"
//                                       onClick={() => {
//                                         if (confirm('Delete this file?')) {
//                                           deleteAssetMutation.mutate(file.id);
//                                         }
//                                       }}
//                                     >
//                                       <Trash2 className="w-4 h-4" />
//                                     </Button>
//                                   </div>
//                                 )}
//                               </div>
//                             </CardHeader>
//                             <CardContent className="space-y-2">
//                               <Button
//                                 className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
//                                 onClick={async () => {
//                                   if (file.link) {
//                                     // For external links, just open in new tab
//                                     window.open(file.link, '_blank');
//                                   } else {
//                                     // For uploaded files, download as PNG
//                                     const response = await fetch(file.file_url);
//                                     const blob = await response.blob();
//                                     const url = window.URL.createObjectURL(blob);
//                                     const a = document.createElement('a');
//                                     a.href = url;
//                                     // Force .png extension
//                                     const fileName = file.name || 'download';
//                                     a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
//                                     document.body.appendChild(a);
//                                     a.click();
//                                     window.URL.revokeObjectURL(url);
//                                     a.remove();
//                                   }
//                                 }}
//                               >
//                                 <Download className="w-4 h-4 mr-2" />
//                                 Download
//                               </Button>
//                             </CardContent>
//                           </Card>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         )}

//         {/* Locked Files Preview */}
//         {!hasAccessToCurrentTier && currentFiles.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold text-slate-400 mb-4">Locked Files ({currentFiles.length})</h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentFiles.slice(0, 6).map((file) => (
//                 <Card key={file.id} className="border-slate-800 bg-slate-900/50 opacity-60">
//                   <CardHeader>
//                     <div className="relative overflow-hidden rounded-xl bg-slate-800 aspect-video mb-4">
//                       {file.thumbnail_url ? (
//                         <div className="relative w-full h-full">
//                           <img
//                             src={file.thumbnail_url}
//                             alt={file.name}
//                             className="w-full h-full object-cover blur-sm"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//                             <Lock className="w-12 h-12 text-slate-400" />
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <Lock className="w-16 h-16 text-slate-600" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-start justify-between">
//                       <CardTitle className="text-slate-400 text-lg">{file.name}</CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-xs text-slate-500 mb-3">
//                       Requires {file.required_tier} tier
//                     </p>
//                     <Button
//                       disabled
//                       className="w-full bg-slate-800 text-slate-500 cursor-not-allowed"
//                     >
//                       <Lock className="w-4 h-4 mr-2" />
//                       Locked
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}

//         {currentFolders.length === 0 && currentFiles.length === 0 && !currentFolderId && (
//           <div className="text-center py-20">
//             <Folder className="w-20 h-20 mx-auto text-slate-700 mb-4" />
//             <h3 className="text-2xl font-semibold text-slate-400 mb-2">No assets yet</h3>
//             <p className="text-slate-500">
//               {user?.role === 'admin' ? "Create a folder or upload files to get started" : "Assets will appear here once added"}
//             </p>
//           </div>
//         )}

//         {/* Edit Dialog */}
//         <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
//           <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-white">Edit {selectedAsset?.type}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
//               <div className="space-y-2">
//                 <Label htmlFor="renameName" className="text-slate-300">Name</Label>
//                 <Input
//                   id="renameName"
//                   value={renameName}
//                   onChange={(e) => setRenameName(e.target.value)}
//                   className="bg-slate-800 border-slate-700 text-white"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="editTier" className="text-slate-300">Access Tier</Label>
//                 <select
//                   id="editTier"
//                   value={editTier}
//                   onChange={(e) => setEditTier(e.target.value)}
//                   className="w-full h-10 px-3 bg-slate-800 border border-slate-700 text-white rounded-md"
//                 >
//                   <option value="basic">Basic ($50/mo)</option>
//                   <option value="premium">Premium ($100/mo)</option>
//                   <option value="lifetime">VIP Access ($300)</option>
//                 </select>
//               </div>

//               {selectedAsset?.type === 'file' && (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="editLink" className="text-slate-300">Link (optional)</Label>
//                     <Input
//                       id="editLink"
//                       value={editLink}
//                       onChange={(e) => setEditLink(e.target.value)}
//                       placeholder="https://example.com"
//                       className="bg-slate-800 border-slate-700 text-white"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="editFile" className="text-slate-300">Replace File (optional)</Label>
//                     <Input
//                       id="editFile"
//                       type="file"
//                       onChange={(e) => setEditFile(e.target.files?.[0] || null)}
//                       className="bg-slate-800 border-slate-700 text-white"
//                     />
//                     {editFile && (
//                       <p className="text-sm text-green-400">✓ New file selected: {editFile.name}</p>
//                     )}
//                     {selectedAsset?.file_url && !editFile && (
//                       <p className="text-sm text-slate-400">Current file: {selectedAsset.file_url.split('/').pop()}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="editThumbnail" className="text-slate-300">Replace Thumbnail (optional)</Label>
//                     <Input
//                       id="editThumbnail"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setEditThumbnail(e.target.files?.[0] || null)}
//                       className="bg-slate-800 border-slate-700 text-white"
//                     />
//                     {editThumbnail && (
//                       <p className="text-sm text-green-400">✓ New thumbnail selected: {editThumbnail.name}</p>
//                     )}
//                     {selectedAsset?.thumbnail_url && !editThumbnail && (
//                       <div className="mt-2">
//                         <p className="text-sm text-slate-400 mb-2">Current thumbnail:</p>
//                         <img
//                           src={selectedAsset.thumbnail_url}
//                           alt="Current thumbnail"
//                           className="w-32 h-32 object-cover rounded-lg border border-slate-700"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               <Button
//                 onClick={handleRename}
//                 disabled={isUpdating}
//                 className="w-full bg-gradient-to-r from-sky-500 to-blue-600"
//               >
//                 {isUpdating ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }
