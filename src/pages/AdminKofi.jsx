import React, { useState, useEffect } from "react";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck, User, Mail, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const { user: adminUser, isLoading: isLoadingAdmin } = useUser();
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch all users for the dropdown list
  const { data: allUsers, isLoading: isLoadingList } = useQuery({
    queryKey: ["admin-user-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .order("email", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!adminUser && adminUser.role === "admin",
  });

  // 2. Fetch specific data for the selected user
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

  if (isLoadingAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
      </div>
    );
  }

  if (adminUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono">
        403_FORBIDDEN: ADMIN_ACCESS_REQUIRED
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-slate-200">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-sky-500 w-8 h-8" />
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Select a user from the database to manually override their access or
            roles.
          </p>
        </header>

        {/* User Selection Dropdown */}
        <div className="space-y-3 mb-12">
          <Label className="text-slate-400 font-medium ml-1">
            Select User Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none z-10" />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full pl-11 pr-10 py-4 bg-slate-900 border border-slate-800 text-white rounded-xl appearance-none focus:ring-2 focus:ring-sky-500 outline-none transition-all cursor-pointer shadow-xl"
            >
              <option value="" disabled>
                Search or select an email...
              </option>
              {allUsers?.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900">
                  {u.email}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Edit Form Section */}
        {isLoadingTarget ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
            <Loader2 className="animate-spin text-sky-500 mb-4" />
            <p className="text-slate-500 text-sm">Loading user profile...</p>
          </div>
        ) : targetUser ? (
          <EditForm
            user={targetUser}
            onSuccess={() => {
              queryClient.invalidateQueries([
                "admin-target-user",
                selectedUserId,
              ]);
            }}
          />
        ) : (
          <div className="border-2 border-dashed border-slate-800/50 rounded-2xl p-20 text-center bg-slate-900/10">
            <User className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-600 font-medium">
              No user selected to edit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sub-component for the Actual Edit Card (Matches your Reference Image)
 */
function EditForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({ ...user });

  // Reset form data when the user changes via the dropdown
  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Successfully updated ${user.email}`);
      onSuccess();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleSave = () => {
    // Basic cleanup: remove system fields that shouldn't be sent back to Supabase
    const { id, created_at, email, ...updates } = formData;
    updateMutation.mutate(updates);
  };

  return (
    <Card className="bg-white text-slate-900 border-none shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardContent className="p-8 space-y-7">
        <div className="border-b border-slate-100 pb-5 mb-2">
          <h2 className="text-2xl font-bold tracking-tight">Edit User</h2>
          <p className="text-sm text-slate-500 mt-1">{user.email}</p>
        </div>

        {/* Role Field */}
        <div className="space-y-1">
          <Label className="font-bold text-slate-800 text-sm">role</Label>
          <p className="text-[11px] text-slate-400 mb-2">
            The role of the user in the app
          </p>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        {/* Tier Field */}
        <div className="space-y-1">
          <Label className="font-bold text-slate-800 text-sm">tier</Label>
          <p className="text-[11px] text-slate-400 mb-2">
            User's subscription tier
          </p>
          <select
            value={formData.subscription_tier}
            onChange={(e) =>
              setFormData({ ...formData, subscription_tier: e.target.value })
            }
            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          >
            <option value="free">free</option>
            <option value="basic">basic</option>
            <option value="premium">premium</option>
            <option value="vip">vip</option>
          </select>
        </div>

        {/* Access Checkboxes */}
        <div className="space-y-5 pt-2">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="course"
              className="mt-1"
              checked={formData.has_course_access}
              onCheckedChange={(val) =>
                setFormData({ ...formData, has_course_access: !!val })
              }
            />
            <div className="grid gap-1 leading-none">
              <label
                htmlFor="course"
                className="text-sm font-bold text-slate-800 cursor-pointer"
              >
                has_course_access
              </label>
              <p className="text-xs text-slate-500">
                Whether user has course access
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Checkbox
              id="assets"
              className="mt-1"
              checked={formData.has_assets_access}
              onCheckedChange={(val) =>
                setFormData({ ...formData, has_assets_access: !!val })
              }
            />
            <div className="grid gap-1 leading-none">
              <label
                htmlFor="assets"
                className="text-sm font-bold text-slate-800 cursor-pointer"
              >
                has_assets_access
              </label>
              <p className="text-xs text-slate-500">
                Whether user has assets access
              </p>
            </div>
          </div>
        </div>

        {/* Status Select */}
        <div className="space-y-1">
          <Label className="font-bold text-slate-800 text-sm">
            subscription_status
          </Label>
          <select
            value={formData.subscription_status}
            onChange={(e) =>
              setFormData({ ...formData, subscription_status: e.target.value })
            }
            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          >
            <option value="none">none</option>
            <option value="active">active</option>
            <option value="expired">expired</option>
          </select>
        </div>

        {/* Expiry Date Picker */}
        <div className="space-y-2">
          <Label className="font-bold text-slate-800 text-sm">
            access_expires_at
          </Label>
          <p className="text-[11px] text-slate-400 mb-2">
            When access expires (leave empty for permanent)
          </p>
          <Input
            type="date"
            value={
              formData.access_expires_at
                ? formData.access_expires_at.split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({ ...formData, access_expires_at: e.target.value })
            }
            className="bg-slate-50 border-slate-200 h-11"
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full bg-slate-900 text-white hover:bg-black h-14 text-lg font-bold mt-8 shadow-lg active:scale-[0.98] transition-all rounded-xl"
          onClick={handleSave}
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" /> Saving Changes...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
