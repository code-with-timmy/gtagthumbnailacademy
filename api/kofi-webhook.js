/* eslint-disable no-undef */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. Browser Test Support
  if (req.method === "GET") {
    return res.status(200).json({
      status: "Ready",
      message: "Webhook listening for Ko-fi POST requests.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 2. Parse Payload
    let payload;
    if (typeof req.body.data === "string") {
      payload = JSON.parse(req.body.data);
    } else {
      payload = req.body;
    }

    // 3. Security Check
    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      console.error("Invalid Token");
      return res.status(401).json({ message: "Invalid token" });
    }

    const { email, amount, kofi_transaction_id, currency, type } = payload;

    // 4. Identify if this is a Revocation Event (Immediate Access Loss)
    const isRevokeEvent = [
      "SubscriptionCanceled",
      "Refund",
      "Unsubscription",
    ].includes(type);

    let tier = "none";

    // Only calculate tier if it's NOT a cancellation
    if (!isRevokeEvent) {
      const { data: plans, error: planError } = await supabase
        .from("plans")
        .select("id, price");

      if (planError) throw planError;

      const TIER_PRICES = plans.reduce((acc, p) => {
        acc[p.id] = parseFloat(p.price);
        return acc;
      }, {});

      const numericAmount = parseFloat(amount);
      const sortedTiers = Object.entries(TIER_PRICES).sort(
        (a, b) => b[1] - a[1]
      );

      for (const [tierName, minPrice] of sortedTiers) {
        if (numericAmount >= minPrice) {
          tier = tierName;
          break;
        }
      }
    }

    // 5. STEP ONE: Log the activity in payments table
    // We use upsert so we don't get duplicate errors on retries
    const { error: paymentError } = await supabase.from("payments").upsert(
      {
        transaction_id: kofi_transaction_id,
        kofi_email: email,
        amount: isRevokeEvent ? 0 : parseFloat(amount),
        currency: currency,
        tier: tier,
        payment_type: type,
        raw_payload: payload,
      },
      { onConflict: "transaction_id" }
    );

    if (paymentError) throw paymentError;

    // 6. STEP TWO: Update the user profile
    // If it's a revoke event, tier becomes 'none' and date becomes null
    const { data, error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: tier,
        kofi_email: email,
        last_payment_date: isRevokeEvent ? null : new Date().toISOString(),
      })
      .eq("email", email)
      .select();

    if (profileError) throw profileError;

    // 7. Response
    if (data.length === 0) {
      console.log(
        `⚠️ User record not found for ${email}. Payment logged for manual verification.`
      );
      return res
        .status(200)
        .json({
          message: "Payment logged. No profile found to update automatically.",
        });
    }

    const actionMsg = isRevokeEvent
      ? "REVOKED access for"
      : "UPDATED access to " + tier + " for";
    console.log(`✅ Success: ${actionMsg} ${email}.`);

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
