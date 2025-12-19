// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createClient } from '@supabase/supabase-js'; // Standard Supabase
// import { Loader2, Lock, Sparkles, FolderPlus, Upload, ArrowLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import AssetTierTabs from '../components/assets/AssetTierTabs';
// import FolderCard from '../components/assets/FolderCard';
// import FileCard from '../components/assets/FileCard';
// import CreateFolderModal from '../components/assets/CreateFolderModal';
// import UploadFilesModal from '../components/assets/UploadFilesModal';
// import EditFolderModal from '../components/assets/EditFolderModal';
// import EditFileModal from '../components/assets/EditFileModal';

// // Initialize Supabase Client
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

// export default function Assets() {
//   const [user, setUser] = useState(null);
//   const [folders, setFolders] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTier, setActiveTier] = useState('basic');
//   const [currentFolderId, setCurrentFolderId] = useState(null);
//   const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
//   const [isUploadOpen, setIsUploadOpen] = useState(false);
//   const [editingFolder, setEditingFolder] = useState(null);
//   const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
//   const [editingFile, setEditingFile] = useState(null);
//   const [isEditFileOpen, setIsEditFileOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setIsLoading(true);

//       // 1. Get Session
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         navigate('/login');
//         return;
//       }

//       // 2. Get Profile Data (Subscription & Role)
//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', session.user.id)
//         .single();

//       if (profileError) throw profileError;

//       // 3. Expiration Logic (31 Days)
//       const lastPaid = profile.last_payment_date ? new Date(profile.last_payment_date) : null;
//       const now = new Date();
//       let isExpired = true;

//       if (lastPaid) {
//         const diffTime = Math.abs(now - lastPaid);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         isExpired = diffDays > 31;
//       }

//       // Admin bypasses expiration and tier restrictions
//       const isAdmin = profile.role === 'admin';
//       const effectiveTier = (isAdmin || !isExpired) ? (profile.subscription_tier || 'none') : 'none';

//       // Kick user if they have no active subscription
//       if (effectiveTier === 'none' && !isAdmin) {
//         navigate('/purchase');
//         return;
//       }

//       setUser({ ...profile, activeTier: effectiveTier });
//       setActiveTier(effectiveTier !== 'none' ? effectiveTier : 'basic');

//       // 4. Load Assets (Folders and Files)
//       const [foldersRes, filesRes] = await Promise.all([
//         supabase.from('asset_folders').select('*').order('created_at', { ascending: false }),
//         supabase.from('asset_files').select('*').order('created_at', { ascending: false })
//       ]);

//       setFolders(foldersRes.data || []);
//       setFiles(filesRes.data || []);

//     } catch (error) {
//       console.error('Error loading assets:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const canAccessTier = (tier) => {
//     if (user?.role === 'admin') return true;
//     const tierOrder = { none: 0, basic: 1, premium: 2, vip: 3 };
//     const userTierRank = tierOrder[user?.activeTier] || 0;
//     const targetTierRank = tierOrder[tier] || 0;
//     return userTierRank >= targetTierRank;
//   };

//   const handleTierChange = (tier) => {
//     if (canAccessTier(tier)) {
//       setActiveTier(tier);
//       setCurrentFolderId(null);
//     }
//   };

//   // --- CRUD Handlers (Updated to standard Supabase) ---
//   const handleCreateFolder = async (data) => {
//     const { error } = await supabase.from('asset_folders').insert([data]);
//     if (!error) loadData();
//   };

//   const handleUploadFile = async (data) => {
//     const { error } = await supabase.from('asset_files').insert([data]);
//     if (!error) loadData();
//   };

//   const handleDeleteFolder = async (id) => {
//     const { error } = await supabase.from('asset_folders').delete().eq('id', id);
//     if (!error) loadData();
//   };

//   const handleDeleteFile = async (id) => {
//     const { error } = await supabase.from('asset_files').delete().eq('id', id);
//     if (!error) loadData();
//   };

//   // ... (Keeping handleEdit/handleDownload logic similar but pointing to Supabase)

//   const isAdmin = user?.role === 'admin';
//   const tierNames = { basic: 'Basic', premium: 'Premium', vip: 'VIP Access' };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   // Filter Logic
//   const filteredFolders = folders.filter(f => f.tier === activeTier);
//   const filteredFiles = currentFolderId 
//     ? files.filter(f => f.folder_id === currentFolderId)
//     : files.filter(f => f.tier === activeTier && !f.folder_id);

//   return (
//     <div className="min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <AssetTierTabs
//           activeTier={activeTier}
//           setActiveTier={handleTierChange}
//           userTier={user?.activeTier || 'none'}
//           onUpgradeClick={() => navigate('/purchase')}
//         />

//         <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
//           <div>
//             {currentFolderId && (
//               <button onClick={() => setCurrentFolderId(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-2">
//                 <ArrowLeft className="w-4 h-4" /> Back to folders
//               </button>
//             )}
//             <h1 className="coolvetica text-3xl md:text-4xl font-bold">
//               {tierNames[activeTier]} Tier Assets
//             </h1>
//           </div>

//           {isAdmin && (
//             <div className="flex gap-2">
//               <Button onClick={() => setIsCreateFolderOpen(true)} className="bg-pink-500 hover:bg-pink-600">
//                 <FolderPlus className="w-4 h-4 mr-2" /> New Folder
//               </Button>
//               <Button onClick={() => setIsUploadOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-500">
//                 <Upload className="w-4 h-4 mr-2" /> Upload Files
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Folders & Files Rendering (Same as your original UI) */}
//         {/* ... */}
//       </div>
      
//       {/* Modals */}
//       {/* ... */}
//     </div>
//   );
// }