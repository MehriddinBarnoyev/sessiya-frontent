
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import UpdateVenueForm from "@/components/forms/UpdateVenueForm";
import { getOwnerVenueById, updateOwnerVenue, getVenueBookedDates } from "@/services/venue-service";
import { VenueFormData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const EditVenue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [venue, setVenue] = useState<any>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) {
        toast.error("Venue ID is required");
        navigate("/owner/dashboard");
        return;
      }
      
      try {
        setIsLoading(true);
        const venueData = await getOwnerVenueById(id);
        setVenue(venueData.venue);
        
        // Fetch booked dates
        const dates = await getVenueBookedDates(id);
        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching venue data:", error);
        toast.error("Failed to load venue data");
        navigate("/owner/dashboard");
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
      await updateOwnerVenue(id, formData, newImages, removedImages);
      toast.success("Venue updated successfully");
      navigate("/owner/dashboard");
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/owner/dashboard")}
              className="mr-2"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
            <h1 className="text-3xl font-serif font-bold flex items-center mt-16">
              <Edit size={24} className="mr-2" />
              Edit Venues
            </h1>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="large" />
            </div>
          ) : venue ? (
            <div>
              {/* Booked Dates Section */}
              {bookedDates.length > 0 && (
                <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-primary/10">
                  <div className="flex items-center mb-3">
                    <Calendar size={18} className="mr-2 text-foreground" />
                    <h3 className="text-lg font-medium font-serif text-foreground">Booked Dates</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookedDates.map((date, index) => (
                      <Badge key={index}  className="px-3 py-1 text-xs font-medium">
                        {formatDate(date)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
                <UpdateVenueForm
                  venueId={id!}
                  venue={venue}
                  onSubmit={handleSubmit}
                  isAdmin={false}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-primary/10">
              <h2 className="text-xl font-medium font-serif text-primary-foreground mb-4">
                Venue not found or you don't have permission to edit it.
              </h2>
              <Button 
                onClick={() => navigate("/owner/dashboard")} 
                className="bg-primary hover:bg-primary/90"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditVenue;
