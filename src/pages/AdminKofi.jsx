import React, { useState, useEffect } from "react";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ShieldCheck,
  User,
  Mail,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminKofi() {
  const { user: adminUser, isLoading: isLoadingAdmin } = useUser();
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();

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
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-sky-500" /> User Management
          </h1>
        </header>

        <div className="space-y-3 mb-10">
          <Label className="text-slate-400">Select User Email</Label>
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full pl-4 pr-10 py-4 bg-slate-900 border border-slate-800 text-white rounded-xl appearance-none outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="" disabled>
                Search or select an email...
              </option>
              {allUsers?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {isLoadingTarget ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-sky-500" />
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
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-20 text-center text-slate-600">
            Choose a user above to begin editing
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
    setIsSuccess(false); // Reset success state when switching users
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Update failed. Check RLS permissions.");
      return data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Changes saved successfully!");
      onSuccess();
      // Hide success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
      alert("Error: " + err.message); // Fallback alert
    },
  });

  const handleSave = () => {
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

  const formatDate = (d) => (d ? d.split("T")[0] : "");

  return (
    <Card className="bg-white text-slate-900 shadow-2xl rounded-2xl border-none">
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-600 animate-bounce">
              <CheckCircle2 size={20} />
              <span className="text-sm font-bold">Saved!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">
              Role
            </Label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border p-3 rounded-lg bg-slate-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">
              Tier
            </Label>
            <select
              value={formData.subscription_tier}
              onChange={(e) =>
                setFormData({ ...formData, subscription_tier: e.target.value })
              }
              className="w-full border p-3 rounded-lg bg-slate-50"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8 py-2 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <Checkbox
              id="course"
              checked={formData.has_course_access}
              onCheckedChange={(v) =>
                setFormData({ ...formData, has_course_access: !!v })
              }
            />
            <Label
              htmlFor="course"
              className="text-sm font-semibold cursor-pointer"
            >
              Course Access
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="assets"
              checked={formData.has_assets_access}
              onCheckedChange={(v) =>
                setFormData({ ...formData, has_assets_access: !!v })
              }
            />
            <Label
              htmlFor="assets"
              className="text-sm font-semibold cursor-pointer"
            >
              Assets Access
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">
              Expires At
            </Label>
            <Input
              type="date"
              value={formatDate(formData.expires_at)}
              onChange={(e) =>
                setFormData({ ...formData, expires_at: e.target.value })
              }
              className="bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">
              Last Payment Date
            </Label>
            <Input
              type="date"
              value={formatDate(formData.last_payment_date)}
              onChange={(e) =>
                setFormData({ ...formData, last_payment_date: e.target.value })
              }
              className="bg-slate-50"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateMutation.isLoading}
          className={`w-full h-14 font-bold rounded-xl transition-all duration-300 ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-slate-900 hover:bg-black"
          } text-white`}
        >
          {updateMutation.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Updating...
            </div>
          ) : isSuccess ? (
            "Successfully Updated!"
          ) : (
            "Submit Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
