
import { useState } from "react";
import { toast } from "sonner";
import { VenueFormData } from "@/lib/types";

interface UseVenueFormProps {
  onSubmit: (formData: VenueFormData, images: File[]) => Promise<void>;
  initialData?: VenueFormData;
  initialImages?: string[];
}

export const useVenueForm = ({ 
  onSubmit, 
  initialData = {
    name: '',
    description: '',
    capacity: 0,
    pricePerSeat: 0,
    district: '',
    address: '',
    phoneNumber: '',
    ownerId: ''
  },
  initialImages = []
}: UseVenueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [venueData, setVenueData] = useState<VenueFormData>(initialData);
  const [venueImages, setVenueImages] = useState<string[]>(initialImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleSubmitForm = async (formData: VenueFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(formData, newImages);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save venue. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, maxImages: number = 10) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const totalImageCount = venueImages.length + newImages.length + files.length;
    
    if (totalImageCount > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    const selectedFiles: File[] = Array.from(files);
    const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    // Check file types
    const invalidFiles = selectedFiles.filter(
      file => !acceptedTypes.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG and WebP formats are accepted.");
      return;
    }
    
    // Add new files
    setNewImages(prev => [...prev, ...selectedFiles]);
    
    // Create preview URLs
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    setVenueImages(prev => prev.filter((_, i) => i !== index));
  };

  return {
    isLoading,
    venueData,
    venueImages,
    newImages,
    previewUrls,
    handleSubmitForm,
    handleImageChange,
    removeNewImage,
    removeExistingImage
  };
};
