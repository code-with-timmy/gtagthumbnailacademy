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

    const { data: plans, error: planError } = await supabase
      .from("plans")
      .select("id, price");

    if (planError) throw planError;

    // Convert array to a usable object { basic: 25, premium: 50, vip: 125 }
    const TIER_PRICES = plans.reduce((acc, p) => {
      acc[p.id] = parseFloat(p.price);
      return acc;
    }, {});

    // 4. Determine Tier (Matching your Frontend tiers: basic, premium, vip)
    let tier = "none";
    const numericAmount = parseFloat(amount);

    // Check from highest to lowest
    const sortedTiers = Object.entries(TIER_PRICES).sort((a, b) => b[1] - a[1]);

    for (const [tierName, minPrice] of sortedTiers) {
      if (numericAmount >= minPrice) {
        tier = tierName;
        break;
      }
    }

    // 5. STEP ONE: Log the payment for the "Verify Now" button to find
    const { error: paymentError } = await supabase.from("payments").upsert(
      {
        transaction_id: kofi_transaction_id,
        kofi_email: email,
        amount: numericAmount,
        currency: currency,
        tier: tier,
        payment_type: type,
        raw_payload: payload,
      },
      { onConflict: "transaction_id" }
    );

    if (paymentError) throw paymentError;

    // 6. STEP TWO: Attempt to update the user profile immediately
    const { data, error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: tier, // Matches your frontend 'subscription_tier'
        kofi_email: email, // Matches your frontend 'kofi_email'
        last_payment_date: new Date().toISOString(),
      })
      .eq("email", email)
      .select();

    if (profileError) throw profileError;

    // 7. Response
    if (data.length === 0) {
      console.log(`Payment logged. No profile found for ${email} yet.`);
      return res
        .status(200)
        .json({ message: "Payment logged, user must verify manually." });
    }

    console.log(`✅ Success: Automatically updated ${email} to ${tier}.`);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
