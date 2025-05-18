
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import VenueForm from "@/components/forms/VenueForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addOwnerVenue, getVenueById, updateOwnerVenue } from "@/services/venue-service";
import { VenueFormData } from "@/lib/types";
import { PlusCircle, Edit } from "lucide-react";

const AddEditVenue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venueData, setVenueData] = useState<VenueFormData>({
    name: '',
    description: '',
    capacity: 0,
    pricePerSeat: 0,
    district: '',
    address: '',
    phoneNumber: '',
  });
  const [venueImages, setVenueImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!isEditing || !id) return;
      
      setIsLoading(true);
      try {
        const venue = await getVenueById(id);
        setVenueData({
          name: venue.venue.name,
          description: venue.venue.description,
          capacity: venue.venue.capacity,
          pricePerSeat: venue.venue.pricePerSeat,
          district: venue.venue.district,
          address: venue.venue.address,
          phoneNumber: venue.venue.phoneNumber || '',
        });
        setVenueImages(venue.venue.photos || []);
      } catch (error) {
        console.error("Error fetching venue data:", error);
        toast.error("Failed to load venue data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();
  }, [id, isEditing]);

  const handleSubmit = async (formData: VenueFormData, images: File[]) => {
    try {
      if (isEditing && id) {
        await updateOwnerVenue(id, formData, images);
        toast.success("Venue updated successfully");
      } else {
        await addOwnerVenue(formData, images);
        toast.success("Venue added successfully");
      }
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error saving venue:", error);
      toast.error("Failed to save venue");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-primary/10 mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-primary-foreground flex items-center">
              {isEditing ? (
                <>
                  <Edit size={24} className="mr-2" />
                  Edit Venue
                </>
              ) : (
                <>
                  <PlusCircle size={24} className="mr-2" />
                  Add New Venue
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 
                "Update your venue details to keep information current for potential clients" : 
                "List your venue on our platform and start receiving booking requests"
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            <VenueForm 
              initialValues={venueData}
              venueImages={venueImages}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditVenue;
