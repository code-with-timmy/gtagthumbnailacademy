/* eslint-disable no-undef */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "Ready" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let payload;
    if (typeof req.body.data === "string") {
      payload = JSON.parse(req.body.data);
    } else {
      payload = req.body;
    }

    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { email, amount, kofi_transaction_id, currency, type } = payload;

    // Refund or Manual Unsubscription
    const isRevokeEvent = ["Refund", "Unsubscription"].includes(type);

    let tier = "none";
    let expiryDate = null;

    if (!isRevokeEvent) {
      // 1. Get Plan Prices
      const { data: plans } = await supabase.from("plans").select("id, price");
      const numericAmount = parseFloat(amount);
      const sortedTiers = plans.sort((a, b) => b.price - a.price);

      for (const p of sortedTiers) {
        if (numericAmount >= p.price) {
          tier = p.id;
          break;
        }
      }

      // 2. Calculate Expiration (Today + 32 Days)
      const date = new Date();
      date.setDate(date.getDate() + 32);
      expiryDate = date.toISOString();
    }

    // 3. Log Payment
    await supabase.from("payments").upsert(
      {
        transaction_id: kofi_transaction_id,
        kofi_email: email,
        amount: isRevokeEvent ? 0 : parseFloat(amount),
        currency,
        tier,
        payment_type: type,
        raw_payload: payload,
      },
      { onConflict: "transaction_id" }
    );

    // 4. Update Profile with Expiry Date
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: tier,
        kofi_email: email,
        last_payment_date: isRevokeEvent ? null : new Date().toISOString(),
        expires_at: expiryDate, // Make sure this column exists in your DB!
      })
      .eq("email", email)
      .select();

    if (profileError) throw profileError;

    return res
      .status(200)
      .json({ received: true, updated: profile?.length > 0 });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
