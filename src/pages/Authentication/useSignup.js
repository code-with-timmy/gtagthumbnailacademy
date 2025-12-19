import { signup as signupApi } from "@/api/apiAuth";
import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success("Account successfully created!");

      navigate("/home", { replace: true });
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("User already exists");
    },
  });

  return { signup, isPending };
}
