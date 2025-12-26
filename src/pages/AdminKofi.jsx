import React, { useState, useEffect, useRef } from "react";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ShieldCheck,
  User,
  Mail,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminKofi() {
  const { user: adminUser, isLoading: isLoadingAdmin } = useUser();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all users for the search list
  const { data: allUsers } = useQuery({
    queryKey: ["admin-user-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .order("email");
      if (error) throw error;
      return data;
    },
    enabled: !!adminUser && adminUser.role === "admin",
  });

  // Filter users based on input
  const filteredUsers = allUsers?.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch the specific details of the selected user
  const { data: targetUser, isLoading: isLoadingTarget } = useQuery({
    queryKey: ["admin-target-user", selectedUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", selectedUserId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedUserId,
  });

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    setSearchTerm(user.email);
    setIsDropdownOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedUserId("");
    setIsDropdownOpen(false);
  };

  if (isLoadingAdmin)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-slate-200">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
            <ShieldCheck className="text-sky-500" size={32} /> User Management
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-mono">
            Control access and subscription tiers
          </p>
        </header>

        {/* SEARCHABLE SEARCH BOX */}
        <div className="space-y-3 mb-10 relative" ref={dropdownRef}>
          <Label className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Search User Database
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
              <Search size={18} />
            </div>
            <Input
              type="text"
              placeholder="Search by email address..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-12 pr-12 py-7 bg-slate-900 border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-sky-500 border-2 transition-all"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {isDropdownOpen && searchTerm && (
            <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto backdrop-blur-xl bg-opacity-95">
              {filteredUsers?.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="w-full text-left px-5 py-4 hover:bg-sky-600/10 transition-colors border-b border-slate-800/50 last:border-none flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail
                        size={16}
                        className="text-slate-500 group-hover:text-sky-400"
                      />
                      <span className="text-sm font-medium">{u.email}</span>
                    </div>
                    <User
                      size={14}
                      className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-slate-500 text-sm italic">
                    No records found for "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LOADING & FORM SECTION */}
        {isLoadingTarget ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-sky-500" size={40} />
            <p className="text-slate-500 animate-pulse font-mono text-xs">
              Fetching Profile...
            </p>
          </div>
        ) : targetUser ? (
          <EditForm
            user={targetUser}
            onSuccess={() =>
              queryClient.invalidateQueries([
                "admin-target-user",
                selectedUserId,
              ])
            }
          />
        ) : (
          <div className="border-2 border-dashed border-slate-800 rounded-3xl p-24 text-center">
            <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <User className="text-slate-700" size={32} />
            </div>
            <p className="text-slate-500 font-medium">
              Select a user account to modify permissions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EditForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({ ...user });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...user });
    setIsSuccess(false);
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Profile updated successfully");
      onSuccess();
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      role: formData.role,
      subscription_tier: formData.subscription_tier,
      last_payment_date: formData.last_payment_date || null,
      expires_at: formData.expires_at || null,
    });
  };

  const formatDate = (d) => (d ? d.split("T")[0] : "");

  return (
    <Card className="bg-white text-slate-950 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl border-none overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Account Parameters
            </h2>
            <code className="text-[10px] text-sky-600 font-bold">
              {user.id}
            </code>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user.email}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Authorized Target
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Access Role
              </Label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border-2 border-slate-100 p-4 rounded-xl bg-slate-50 font-bold focus:border-sky-500 outline-none transition-all"
              >
                <option value="user">USER</option>
                <option value="admin">ADMINISTRATOR</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Subscription Tier
              </Label>
              <select
                value={formData.subscription_tier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription_tier: e.target.value,
                  })
                }
                className="w-full border-2 border-slate-100 p-4 rounded-xl bg-slate-50 font-bold focus:border-sky-500 outline-none transition-all"
              >
                <option value="free">FREE</option>
                <option value="basic">BASIC</option>
                <option value="premium">PREMIUM</option>
                <option value="vip">VIP ACCESS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Membership Expiry
              </Label>
              <Input
                type="date"
                value={formatDate(formData.expires_at)}
                onChange={(e) =>
                  setFormData({ ...formData, expires_at: e.target.value })
                }
                className="bg-slate-50 border-2 border-slate-100 p-6 rounded-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase text-slate-400 tracking-widest">
                Last Transaction
              </Label>
              <Input
                type="date"
                value={formatDate(formData.last_payment_date)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_payment_date: e.target.value,
                  })
                }
                className="bg-slate-50 border-2 border-slate-100 p-6 rounded-xl font-bold"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateMutation.isLoading}
            className={`w-full py-8 text-lg font-black rounded-2xl transition-all duration-500 uppercase tracking-widest ${
              isSuccess
                ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200"
                : "bg-slate-950 hover:bg-black shadow-lg shadow-slate-200"
            } text-white`}
          >
            {updateMutation.isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : isSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={24} /> Sync Complete
              </div>
            ) : (
              "Update System Profile"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
