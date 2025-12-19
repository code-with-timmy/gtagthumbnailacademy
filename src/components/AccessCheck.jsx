import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Hook to check user's access tier
export function useAccessTier() {
  const [tier, setTier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await base44.auth.me();
        console.log('🔍 User:', user.email);
        
        // Admin gets full access
        if (user.role === 'admin' || user.email === 'codydankdabs@gmail.com') {
          console.log('✅ Admin access granted');
          setTier('lifetime');
          setIsLoading(false);
          return;
        }

        // Check for active purchase records
        const purchases = await base44.entities.Purchase.filter({
          user_email: user.email,
          status: 'completed'
        }, '-created_date');

        console.log('📦 Purchases found:', purchases);

        if (purchases && purchases.length > 0) {
          const activePurchase = purchases[0];
          console.log('🎫 Active purchase:', activePurchase);
          
          // Check if purchase has expired (for monthly/yearly plans)
          if (activePurchase.expires_at) {
            const expiryDate = new Date(activePurchase.expires_at);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expiryDate.setHours(0, 0, 0, 0);
            console.log('📅 Expiry:', expiryDate, 'Today:', today);
            if (expiryDate < today) {
              console.log('❌ Purchase expired');
              setTier(null);
              setIsLoading(false);
              return;
            }
          }
          
          // Set tier based on purchase
          console.log('✅ Setting tier to:', activePurchase.tier);
          setTier(activePurchase.tier);
        } else {
          console.log('❌ No purchases found');
          setTier(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error checking access:', error);
        setTier(null);
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  return { tier, isLoading };
}

// Check if user has access to content
export function hasAccess(userTier, requiredTier) {
  if (!requiredTier) return true;
  if (!userTier) return false;
  
  const tierHierarchy = { basic: 1, premium: 2, lifetime: 3 };
  return (tierHierarchy[userTier] || 0) >= (tierHierarchy[requiredTier] || 0);
}

// Component to show when access is denied
export function AccessDenied({ requiredTier }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [kofiEmail, setKofiEmail] = useState('');
  
  const tierInfo = {
    basic: { icon: Zap, color: "from-blue-500 to-cyan-500", name: "Basic ($25/month)" },
    premium: { icon: Crown, color: "from-purple-500 to-pink-500", name: "Premium ($50/month)" },
    lifetime: { icon: Star, color: "from-yellow-500 to-orange-500", name: "VIP Access ($125)" }
  };

  const info = tierInfo[requiredTier] || tierInfo.premium;
  const Icon = info.icon;

  const handleKofiRedirect = () => {
    if (requiredTier === 'basic') {
      window.open('https://ko-fi.com/summary/0cb722ac-48fe-4aeb-98ed-caed13e58e80', '_blank');
    } else if (requiredTier === 'premium') {
      window.open('https://ko-fi.com/summary/bcc1e1ad-3812-4414-a936-e0d8695fb7e0', '_blank');
    } else if (requiredTier === 'lifetime') {
      window.open('https://ko-fi.com/summary/d19c5b13-ceeb-47ef-9ef7-e2f67f7421a6', '_blank');
    } else {
      window.open('https://ko-fi.com/gorillatagthumbnailacademy', '_blank');
    }
  };

  const handleVerifyPurchase = async () => {
    if (!kofiEmail.trim()) {
      alert('Please enter your Ko-fi purchase email');
      return;
    }
    
    setIsSyncing(true);
    try {
      const response = await base44.functions.invoke('verifyKofiPurchase', { kofiEmail: kofiEmail.trim() });
      if (response.data.success) {
        alert(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert(response.data.message || 'Verification failed');
        setIsSyncing(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Verification failed. Please try again.');
      setIsSyncing(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-12 text-center">
        <div className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {requiredTier === 'lifetime' ? 'VIP Access' : requiredTier === 'premium' ? 'Premium' : 'Basic'} Access Required
        </h3>
        <p className="text-slate-400 mb-6">
          This content requires {info.name} tier or higher
        </p>
        
        <div className="flex flex-col gap-3 items-center">
          <Button 
            onClick={handleKofiRedirect}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full max-w-md text-lg py-6"
          >
            ☕ Purchase on Ko-fi
          </Button>
          <Button 
            onClick={() => setShowVerifyInput(true)}
            variant="outline"
            className="border-slate-700 text-slate-300 w-full max-w-md"
          >
            Already purchased? Verify Purchase
          </Button>
        </div>

        {showVerifyInput && (
          <div className="max-w-md mx-auto space-y-4 mt-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left">
              <p className="text-sm text-slate-300 mb-2">Verify your Ko-fi purchase:</p>
              <p className="text-xs text-slate-400">Enter the email you used for your Ko-fi purchase</p>
            </div>
            <input
              type="email"
              placeholder="Enter your Ko-fi purchase email"
              value={kofiEmail}
              onChange={(e) => setKofiEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleVerifyPurchase}
                disabled={isSyncing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isSyncing ? 'Verifying...' : 'Verify Purchase'}
              </Button>
              <Button 
                onClick={() => setShowVerifyInput(false)}
                variant="outline"
                className="border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}