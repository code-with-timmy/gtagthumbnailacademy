// src/auth/useGoogleLogin.js
import { signInWithGoogle } from "@/api/apiAuth";
import { useMutation } from "@tanstack/react-query";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: signInWithGoogle,
  });
}
