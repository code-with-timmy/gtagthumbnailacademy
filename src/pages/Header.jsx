import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Play, Upload, Home, Download, LogOutIcon } from "lucide-react";

import { useLogout } from "./Authentication/useLogout";

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  const { logout, isLoading } = useLogout();

  // React.useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const currentUser = await base44.auth.me();
  //       setUser(currentUser);

  //       // Check if user has active purchase
  //       if (
  //         currentUser.role === "admin" ||
  //         currentUser.email === "codydankdabs@gmail.com"
  //       ) {
  //         setHasAccess(true);
  //       } else {
  //         const purchases = await base44.entities.Purchase.filter(
  //           {
  //             user_email: currentUser.email,
  //             status: "completed",
  //           },
  //           "-created_date"
  //         );

  //         if (purchases && purchases.length > 0) {
  //           const purchase = purchases[0];
  //           // Check if not expired
  //           if (
  //             !purchase.expires_at ||
  //             new Date(purchase.expires_at) > new Date()
  //           ) {
  //             setHasAccess(true);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error loading user:", error);
  //     }
  //   };
  //   loadUser();
  // }, []);

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-3 max-sm:gap-0 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/37663a551_GORILLATAGACADEMYPFP.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent max-sm:text-[12px]">
                Gorilla Tag Thumbnail Academy
              </h1>
              <p className="text-xs text-slate-400">Professional Course</p>
            </div>
          </Link>

          <nav className="flex gap-2">
            <button
              onClick={logout}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 bg-sky-500 text-white hover:bg-slate-800 `}
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
            <Link
              to={createPageUrl("Home")}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hidden ${
                location.pathname === createPageUrl("Home")
                  ? "bg-sky-500 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            {hasAccess && (
              <>
                <Link
                  to={createPageUrl("Course")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    location.pathname === createPageUrl("Course")
                      ? "bg-sky-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Course</span>
                </Link>
                <Link
                  to={createPageUrl("Assets")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    location.pathname === createPageUrl("Assets")
                      ? "bg-sky-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Assets</span>
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link
                  to={createPageUrl("Upload")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    location.pathname === createPageUrl("Upload")
                      ? "bg-sky-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
                <Link
                  to={createPageUrl("AdminKofi")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    location.pathname === createPageUrl("AdminKofi")
                      ? "bg-sky-500 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="hidden sm:inline">Ko-fi</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
