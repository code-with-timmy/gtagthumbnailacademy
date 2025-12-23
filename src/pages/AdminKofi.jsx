import React, { useState } from "react";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  User,
  ShieldCheck,
  Loader2,
  X,
  Calendar as CalendarIcon,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminKofi() {
  const { user: adminUser, isLoading: isLoadingAdmin } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (searchTerm) query = query.ilike("email", `%${searchTerm}%`);
      const { data, error } = await query.limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!adminUser && adminUser.role === "admin",
  });

  if (isLoadingAdmin)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              User Administration
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage permissions and subscription overrides
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-slate-900/50 border-slate-800 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="space-y-3">
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto text-slate-700 mt-20" />
          ) : (
            users?.map((u) => (
              <EditUserModal
                key={u.id}
                user={u}
                refresh={() => queryClient.invalidateQueries(["admin-users"])}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EditUserModal({ user, refresh }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Updated ${user.email}`);
      setOpen(false);
      refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="bg-slate-900/40 border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user.email}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                  {user.subscription_tier || "Free"} • {user.role}
                </p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 w-4 h-4" />
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="bg-white text-slate-900 max-w-md border-none p-8">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-6">
          <DialogTitle className="text-2xl font-semibold">
            Edit User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role */}
          <div className="space-y-1">
            <Label className="font-bold">role</Label>
            <p className="text-xs text-slate-500 mb-2">
              The role of the user in the app
            </p>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded-md p-2 bg-slate-50"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          {/* Tier */}
          <div className="space-y-1">
            <Label className="font-bold">tier</Label>
            <p className="text-xs text-slate-500 mb-2">
              User's subscription tier
            </p>
            <select
              value={formData.subscription_tier}
              onChange={(e) =>
                setFormData({ ...formData, subscription_tier: e.target.value })
              }
              className="w-full border rounded-md p-2 bg-slate-50"
            >
              <option value="free">free</option>
              <option value="basic">basic</option>
              <option value="premium">premium</option>
              <option value="vip">vip</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="course"
                checked={formData.has_course_access}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, has_course_access: !!val })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="course" className="text-sm font-bold">
                  has_course_access
                </label>
                <p className="text-xs text-slate-500">
                  Whether user has course access
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="assets"
                checked={formData.has_assets_access}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, has_assets_access: !!val })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="assets" className="text-sm font-bold">
                  has_assets_access
                </label>
                <p className="text-xs text-slate-500">
                  Whether user has assets access
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label className="font-bold">subscription_status</Label>
            <select
              value={formData.subscription_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subscription_status: e.target.value,
                })
              }
              className="w-full border rounded-md p-2 bg-slate-50"
            >
              <option value="none">none</option>
              <option value="active">active</option>
              <option value="expired">expired</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="font-bold">access_expires_at</Label>
              <Input
                type="date"
                value={formData.access_expires_at?.split("T")[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    access_expires_at: e.target.value,
                  })
                }
                className="bg-slate-50"
              />
            </div>
          </div>

          <Button
            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-lg font-semibold mt-4"
            onClick={() => updateMutation.mutate(formData)}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Saving..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
