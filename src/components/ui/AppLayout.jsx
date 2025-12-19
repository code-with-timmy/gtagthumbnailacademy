/* eslint-disable no-unused-vars */
import Header from "@/pages/Header";
import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Home,
  PlayCircle,
  Download,
  Upload,
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AppLayout() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading] = useState(true);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const isAuth = await base44.auth.isAuthenticated();
  //       if (isAuth) {
  //         const userData = await base44.auth.me();
  //         setUser(userData);
  //       }
  //     } catch (e) {
  //       console.log('Not authenticated');
  //     }
  //     setIsLoading(false);
  //   };
  //   loadUser();
  // }, []);

  const navItems = [
    { name: "Home", page: "home", icon: Home },
    { name: "Course", page: "course", icon: PlayCircle },
    { name: "Assets", page: "assets", icon: Download },
  ];

  if (user?.role === "admin") {
    navItems.push({ name: "Upload", page: "Upload", icon: Upload });
  }

  const handleLogin = () => {
    // base44.auth.redirectToLogin(window.location.href);
  };

  const handleLogout = () => {
    // base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/coolvetica');
        
        :root {
          --neon-blue: #3b82f6;
          --neon-purple: #a855f7;
          --neon-cyan: #06b6d4;
          --neon-pink: #ec4899;
          --dark-bg: #0a0e1a;
          --card-bg: #111827;
          --card-border: #1f2937;
        }
        
        .coolvetica {
          font-family: 'Coolvetica', sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glow-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        
        .glow-purple {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        
        .glass-card {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-glow:hover {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
      `}</style>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 py-2 px-4 text-center text-sm font-medium">
        <span>Launch Week Special: 50% Off All Plans</span>
        <span className="ml-3 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
          ENDS SOON
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/508a1cf18_9bd366e3c_GORILLATAGACADEMYPFP.png"
                  alt="Gorilla Tag Academy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg">
                  Gorilla Tag Thumbnail Academy
                </div>
                <div className="text-xs text-gray-400">Professional Course</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={item.page}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all nav-glow ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {!isLoading &&
                (user ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="ml-2 text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="ml-2 bg-white/10 hover:bg-white/20 text-white"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0e1a] border-t border-white/10 py-4 px-4">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={item.page}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all nav-glow ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            {!isLoading &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 w-full"
                >
                  <LogIn className="w-5 h-5" />
                  Log In
                </button>
              ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2024 Gorilla Tag Thumbnail Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
