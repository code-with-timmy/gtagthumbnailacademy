/* eslint-disable no-undef */
import { createClient } from "@supabase/supabase-client";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const rawData = req.body.data;
    const payload = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    if (payload.verification_token !== process.env.KOFI_VERIFICATION_CODE) {
      return res.status(401).json({ message: "Invalid verification token" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const email = payload.email;
    const amount = parseFloat(payload.amount);
    const kofi_transaction_id = payload.kofi_transaction_id;

    let tier = null;
    if (amount >= 125) tier = "vip";
    else if (amount >= 50) tier = "premium";
    else if (amount >= 25) tier = "basic";

    if (tier) {
      // 1. Log payment with the NEW tier column
      await supabase.from("payments").insert([
        {
          transaction_id: kofi_transaction_id,
          kofi_email: email,
          amount: amount,
          tier: tier, // Now works perfectly!
          status: "verified",
        },
      ]);

      // 2. Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ subscription_tier: tier })
        .eq("kofi_email", email);

      if (!profileError) console.log(`Upgraded ${email} to ${tier}`);
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
