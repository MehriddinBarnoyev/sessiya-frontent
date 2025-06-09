
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import UpdateVenueForm from "@/components/forms/UpdateVenueForm";
import { getAdminVenueById, updateAdminVenue, getVenueBookedDates } from "@/services/venue-service";
import { Owner, VenueFormData } from "@/lib/types";
import { getOwners } from "@/services/owner-service";
import { Badge } from "@/components/ui/badge";

const EditVenue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [venue, setVenue] = useState<any>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  
  console.log(id, "Venue ID from params");
  
  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) {
        toast.error("Venue ID is required");
        navigate("/admin/venues");
        return;
      }
      
      try {
        setIsLoading(true);
        const venueData = await getAdminVenueById(id);
        console.log("Fetched venue data:", venueData);
        
        setVenue(venueData.venue);
        
        // Fetch owners list for the dropdown
        const ownersData = await getOwners();
        setOwners(ownersData.owners || []);
        
        // Fetch booked dates
        const dates = await getVenueBookedDates(id);
        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching venue data:", error);
        toast.error("Failed to load venue data");
        navigate("/admin/venues");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenueData();
  }, [id, navigate]);
  
  const handleSubmit = async (
    formData: VenueFormData, 
    newImages: File[],
    removedImages: string[]
  ) => {
    if (!id) return;
    
    try {
      await updateAdminVenue(id, formData, newImages, removedImages);
      toast.success("Venue updated successfully");
      navigate("/admin/venues");
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("Failed to update venue");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin/venues")}
            className="mr-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-serif font-bold">Edit Venue</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="large" />
          </div>
        ) : venue ? (
          <div className="max-w-4xl mx-auto">
            {/* Booked Dates Section */}
            {bookedDates.length > 0 && (
              <div className="mb-6 bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="mr-2 text-muted-foreground" />
                  <h3 className="font-medium">Booked Dates</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookedDates.map((date, index) => (
                    <Badge key={index} variant="secondary">
                      {formatDate(date)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <UpdateVenueForm
                venueId={id!}
                venue={venue}
                owners={owners}
                onSubmit={handleSubmit}
                isAdmin={true}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-muted-foreground">
              Venue not found or you don't have permission to edit it.
            </h2>
            <Button 
              onClick={() => navigate("/admin/venues")} 
              className="mt-4"
            >
              Back to Venues
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditVenue;
