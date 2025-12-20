import { getCurrentUser } from "@/api/apiAuth";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    data: user,
    status,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // A user is authenticated if the object exists and has an ID
  const isAuthenticated = !!user?.id;

  return {
    isPending: status === "loading" || isFetching,
    user,
    isAuthenticated,
  };
}
