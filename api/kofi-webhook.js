import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key (to bypass RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. Log every hit to help you debug in Vercel

  if (req.method === "GET") {
    return res.status(200).json({
      status: "Ready",
      message: "The webhook is waiting for a POST request from Ko-fi.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("--- Webhook Triggered ---");
  console.log("Method:", req.method);
  console.log("Content-Type:", req.headers["content-type"]);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 2. Parse the body. Ko-fi sends data as a string inside a 'data' field.
    let payload;

    if (typeof req.body.data === "string") {
      // Standard Ko-fi format
      payload = JSON.parse(req.body.data);
    } else if (typeof req.body === "string") {
      // Backup for certain test tools
      const parsedBody = JSON.parse(req.body);
      payload =
        typeof parsedBody.data === "string"
          ? JSON.parse(parsedBody.data)
          : parsedBody;
    } else {
      // If it's already an object
      payload = req.body;
    }

    // 3. Security Check: Verify the Ko-fi Token
    if (payload.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      console.error("Invalid Verification Token received.");
      return res.status(401).json({ message: "Invalid token" });
    }

    const { email, amount, type } = payload;
    console.log(`Processing payment for: ${email} - Amount: ${amount}`);

    // 4. Determine Tier based on amount
    let tier = "basic";
    const numericAmount = parseFloat(amount);

    if (numericAmount >= 300) {
      tier = "lifetime";
    } else if (numericAmount >= 100) {
      tier = "premium";
    } else if (numericAmount >= 50) {
      tier = "basic";
    }

    // 5. UPSERT the user profile
    // This updates the tier if they exist, or creates a new row if they don't.
    // 'email' must be a UNIQUE column in your profiles table for this to work.
    // Change .upsert() to .update()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        tier: tier,
        last_payment_date: new Date().toISOString(),
        payment_provider: "kofi",
      })
      .eq("email", email) // Find the user by email
      .select();

    if (error) throw error;

    // Check if anyone was actually updated
    if (data.length === 0) {
      console.log(`No user found with email ${email}. Tier not updated.`);
      return res
        .status(200)
        .json({ received: true, message: "User not found" });
    }

    console.log(`✅ Success: Updated ${email} to ${tier} tier.`);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
