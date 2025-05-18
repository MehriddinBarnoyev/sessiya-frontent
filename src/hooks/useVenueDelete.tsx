
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteVenue } from "@/services/venue-service";

export const useVenueDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      toast.success("Venue deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete venue: ${error.message || "Unknown error"}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      mutation.mutate(id);
    }
  };

  return { 
    handleDelete,
    isDeleting: mutation.isPending 
  };
};
