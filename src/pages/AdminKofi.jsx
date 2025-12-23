import React, { useState } from "react";
import supabase from "@/supabase";
import { useUser } from "./Authentication/useUser";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Database,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminKofi() {
  const { user, isLoading: isLoadingUser } = useUser();
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments") // Using your existing payments table
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!user && user.role === "admin",
    initialData: [],
  });

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEvents(newExpanded);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-slate-800 bg-slate-900 max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-slate-400">Admin credentials required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Logs</h1>
            <p className="text-slate-400">
              Monitor transactions from your <code>payments</code> table
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Database: Supabase
            </span>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {" "}
            {/* Removed padding for a cleaner list look */}
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 bg-slate-800" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500">
                  No records found in the payments table.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {payments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-white font-medium">
                            {pay.kofi_email || "No Email"}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 uppercase">
                            {pay.tier}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>
                            ID:{" "}
                            <span className="text-slate-300 font-mono">
                              {pay.transaction_id}
                            </span>
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(pay.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(pay.id)}
                        className="text-slate-500 hover:text-white"
                      >
                        {expandedEvents.has(pay.id) ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </Button>
                    </div>

                    {expandedEvents.has(pay.id) && (
                      <div className="mt-4 p-4 bg-black/40 rounded-lg border border-slate-700">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                          Raw Row Data
                        </p>
                        <pre className="text-xs text-sky-300 overflow-x-auto">
                          {JSON.stringify(pay, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
