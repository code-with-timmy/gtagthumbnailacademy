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

export default function AdminKofi() {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-center p-10">
        403_ACCESS_DENIED: ADMINISTRATOR_ONLY
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
            Select a user to manually modify their database record.
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
            <p className="text-slate-500 text-sm">Fetching record details...</p>
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
              Please select a user to view their data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sub-component for the Edit Form Card
 */
function EditForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({ ...user });

  // Update form state whenever a new user is selected from the parent dropdown
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
      toast.success(`Profile updated for ${user.email}`);
      onSuccess();
    },
    onError: (err) => {
      toast.error(`Error updating profile: ${err.message}`);
    },
  });

  const handleSave = () => {
    // Explicitly define columns to update, ensuring dates are null if empty
    const updates = {
      role: formData.role,
      subscription_tier: formData.subscription_tier,
      has_course_access: formData.has_course_access,
      has_assets_access: formData.has_assets_access,
      last_payment_date: formData.last_payment_date || null,
      expires_at: formData.expires_at || null,
    };

    updateMutation.mutate(updates);
  };

  // Helper function to format ISO strings to YYYY-MM-DD for the HTML date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  return (
    <Card className="bg-white text-slate-900 border-none shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardContent className="p-8 space-y-7">
        <div className="border-b border-slate-100 pb-5 mb-2">
          <h2 className="text-2xl font-bold tracking-tight">Edit User</h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-mono">
            {user.email}
          </p>
        </div>

        {/* Role Select */}
        <div className="space-y-1">
          <Label className="font-bold text-slate-800 text-sm">role</Label>
          <p className="text-[11px] text-slate-400 mb-2">
            Primary user role in the application
          </p>
          <select
            value={formData.role || "user"}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        {/* Tier Select */}
        <div className="space-y-1">
          <Label className="font-bold text-slate-800 text-sm">tier</Label>
          <p className="text-[11px] text-slate-400 mb-2">
            Assigned subscription plan
          </p>
          <select
            value={formData.subscription_tier || "free"}
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

        {/* Checkboxes */}
        <div className="space-y-5 pt-2 border-y border-slate-50 py-5">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="course"
              className="mt-1"
              checked={formData.has_course_access || false}
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
                Enable or disable course content
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Checkbox
              id="assets"
              className="mt-1"
              checked={formData.has_assets_access || false}
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
                Enable or disable digital asset downloads
              </p>
            </div>
          </div>
        </div>

        {/* Date: expires_at */}
        <div className="space-y-2">
          <Label className="font-bold text-slate-800 text-sm">expires_at</Label>
          <p className="text-[11px] text-slate-400 mb-2">
            When user access automatically revokes
          </p>
          <Input
            type="date"
            value={formatDateForInput(formData.expires_at)}
            onChange={(e) =>
              setFormData({ ...formData, expires_at: e.target.value })
            }
            className="bg-slate-50 border-slate-200 h-11 focus:ring-sky-500"
          />
        </div>

        {/* Date: last_payment_date */}
        <div className="space-y-2">
          <Label className="font-bold text-slate-800 text-sm">
            last_payment_date
          </Label>
          <p className="text-[11px] text-slate-400 mb-2">
            Date of most recent successful payment
          </p>
          <Input
            type="date"
            value={formatDateForInput(formData.last_payment_date)}
            onChange={(e) =>
              setFormData({ ...formData, last_payment_date: e.target.value })
            }
            className="bg-slate-50 border-slate-200 h-11 focus:ring-sky-500"
          />
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-slate-900 text-white hover:bg-black h-14 text-lg font-bold mt-8 shadow-lg active:scale-[0.98] transition-all rounded-xl"
          onClick={handleSave}
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" /> Processing...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
