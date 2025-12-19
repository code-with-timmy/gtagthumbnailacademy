import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key (to bypass RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. Ko-fi sends data as a stringified JSON in a form field named 'data'
    const payload = JSON.parse(req.body.data);

    // 2. Security Check: Verify the token
    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { email, amount, type, is_subscription_payment } = payload;

    // 3. Determine Tier based on amount or type
    // Match these values to what you set in your Assets page logic
    let tier = "basic";
    const numericAmount = parseFloat(amount);

    if (numericAmount >= 300) {
      tier = "lifetime";
    } else if (numericAmount >= 100) {
      tier = "premium";
    } else if (numericAmount >= 50) {
      tier = "basic";
    }

    // 4. Update the user profile in Supabase
    // We assume your 'profiles' table has an 'email' and 'tier' column
    const { data, error } = await supabase
      .from("profiles")
      .update({
        tier: tier,
        last_payment_date: new Date().toISOString(),
        payment_provider: "kofi",
      })
      .eq("email", email);

    if (error) throw error;

    console.log(`Success: Updated ${email} to ${tier} tier.`);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
