import { getCurrentUser } from "@/api/apiAuth";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    isPending,
    data: user,
    fetchStatus,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // A user is authenticated if the object exists and has an ID
  const isAuthenticated = !!user?.id;

  return {
    isPending: isPending || fetchStatus === "fetching",
    user,
    isAuthenticated,
  };
}
