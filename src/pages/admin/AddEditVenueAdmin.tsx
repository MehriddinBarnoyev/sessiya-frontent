
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import VenueForm from "@/components/forms/VenueForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getVenueById, addAdminVenue, updateAdminVenue } from "@/services/venue-service";
import { getOwners } from "@/services/owner-service";
import { Owner, VenueFormData, OwnerListResponse } from "@/lib/types";

const AddEditVenueAdmin = () => {
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
    ownerId: ''
  });
  const [venueImages, setVenueImages] = useState<string[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch owners
        const ownersData = await getOwners();       
        if (ownersData && ownersData.owners) {
          setOwners(ownersData.owners);
        }
        
        // Fetch venue data if editing
        if (isEditing && id) {
          const venue = await getVenueById(id);
          setVenueData({
            name: venue.name,
            description: venue.description,
            capacity: venue.capacity,
            pricePerSeat: venue.pricePerSeat,
            district: venue.district,
            address: venue.address,
            phoneNumber: venue.phoneNumber || '',
            ownerId: venue.ownerId || '',
          });
          setVenueImages(venue.photos || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditing]);

  const handleSubmit = async (formData: VenueFormData, images: File[]) => {
    try {
      if (isEditing && id) {
        await updateAdminVenue(id, formData, images);
        toast.success("Venue updated successfully");
      } else {
        await addAdminVenue(formData, images);
        console.log("formData", formData);
        console.log("images", images);
        
        toast.success("Venue added successfully");
      }
      navigate("/admin/dashboard");
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
          <h1 className="text-3xl font-serif font-bold mb-8">
            {isEditing ? "Edit Venue" : "Add New Venue"}
          </h1>

          <VenueForm 
            initialValues={venueData}
            owners={owners}
            venueImages={venueImages}
            onSubmit={handleSubmit}
            isAdmin={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddEditVenueAdmin;
