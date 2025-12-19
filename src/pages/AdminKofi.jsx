import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminKofi() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const { data: events, isLoading } = useQuery({
    queryKey: ['kofi-events'],
    queryFn: async () => {
      const allEvents = await base44.entities.KofiEvent.list('-created_date', 100);
      return allEvents;
    },
    enabled: user?.role === 'admin',
    initialData: []
  });

  const toggleExpand = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'unverified':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      case 'unverified':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-slate-800 bg-slate-900 max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">This page is only accessible to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ko-fi Webhook Events</h1>
          <p className="text-slate-400">Debug and verify Ko-fi webhook deliveries</p>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Recent Webhook Events (Last 100)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 bg-slate-800" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No webhook events received yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(event.status)}
                            <span className={`font-semibold ${getStatusColor(event.status)}`}>
                              {event.status || 'unknown'}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-300">{event.event_type}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-slate-500">Email:</span>{' '}
                              <span className="text-slate-200">{event.email || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Transaction:</span>{' '}
                              <span className="text-slate-200 font-mono text-xs">
                                {event.transaction_id || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Tier:</span>{' '}
                              <span className="text-slate-200">{event.tier || 'unknown'}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-500">
                            {new Date(event.created_date).toLocaleString()}
                          </div>
                        </div>

                        <Button
                          onClick={() => toggleExpand(event.id)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white"
                        >
                          {expandedEvents.has(event.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>

                      {expandedEvents.has(event.id) && (
                        <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                          {event.parsed_payload && (
                            <div>
                              <p className="text-xs text-slate-500 mb-2 font-semibold">Parsed Payload:</p>
                              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs max-h-64 overflow-y-auto">
                                {JSON.stringify(JSON.parse(event.parsed_payload), null, 2)}
                              </pre>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-slate-500 mb-2 font-semibold">Raw Payload:</p>
                            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
                              {event.raw_payload || 'No payload stored'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
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