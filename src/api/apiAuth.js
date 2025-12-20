import supabase from "@/supabase";

export async function signup({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

// apiAuth.js
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) return null;

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.user.id)
    .maybeSingle(); // <--- CRITICAL CHANGE

  // If no profile, return user with tier: null (don't crash!)
  if (profileError || !profile) {
    return { ...authUser.user, subscription_tier: null };
  }

  return { ...authUser.user, ...profile };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw error;
}
