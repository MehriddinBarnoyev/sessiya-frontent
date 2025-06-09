
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Owner, Venue, VenueFormData } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Tashkent districts
const toshkentDistricts = [
  "Olmaliq", "Bekobod", "Chirchiq", "Yangiyo'l", "Bo'ka", "Zangiota",
  "Parkent", "Ohangaron", "Qibray", "Quyichirchiq", "Yuqorichirchiq", "Piskent", "Bo'stonliq"
];

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
  pricePerSeat: z.coerce.number().min(0, "Price per seat must be at least 0"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  ownerId: z.string().optional(),
  status: z.string().optional(),
});

export type UpdateVenueFormProps = {
  venueId: string;
  venue?: Venue;
  owners?: Owner[];
  onSubmit: (formData: VenueFormData, newImages: File[], removedImages: string[]) => Promise<void>;
  isAdmin?: boolean;
  isLoading?: boolean;
};

const UpdateVenueForm = ({ 
  venueId,
  venue,
  owners = [], 
  onSubmit, 
  isAdmin = false,
  isLoading = false
}: UpdateVenueFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const form = useForm<VenueFormData & { status?: string }>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 0,
      pricePerSeat: 0,
      district: "",
      address: "",
      phoneNumber: "",
      ownerId: "",
      status: "",
    },
  });

  // Populate form when venue data is available
  useEffect(() => {
    if (venue) {
      const venueObj = venue as any;
      form.reset({
        name: venueObj.name || "",
        description: venueObj.description || "",
        capacity: Number(venueObj.capacity) || 0,
        pricePerSeat: Number(venueObj.priceperseat) || 0,
        district: venueObj.district || "",
        address: venueObj.address || "",
        phoneNumber: venueObj.phonenumber || "",
        ownerId: venueObj.ownerId || "",
        status: venueObj.status || "Unconfirmed"
      });
      
      // Set existing images
      if (venueObj.photos && Array.isArray(venueObj.photos)) {
        setExistingImages(venueObj.photos);
      }
    }
  }, [venue, form]);

  const handleSubmit = async (data: VenueFormData & { status?: string }) => {
    setIsSaving(true);
    try {
      // Remove status from data if it's not needed for the API
      const { status, ...venueFormData } = data;
      
      await onSubmit(venueFormData, newImages, removedImages);
      toast.success("Venue updated successfully");
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("Failed to update venue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (files: File[]) => {
    const totalImagesAfterAdd = existingImages.length - removedImages.length + newImages.length + files.length;
    
    if (totalImagesAfterAdd > 10) {
      toast.error("You can only upload a maximum of 10 images total");
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setRemovedImages(prev => [...prev, imageToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter venue description" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter capacity" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerSeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Seat</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter price per seat" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {toshkentDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter complete address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin && (
          <>
            {owners && owners.length > 0 && (
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Owner</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.ownerid} value={owner.ownerid}>
                            {owner.firstname} {owner.lastname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isAdmin}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Unconfirmed">Unconfirmed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2">Venue Images</h3>
          <div className="text-sm text-muted-foreground mb-4">
            {removedImages.length > 0 ? (
              <p>
                {removedImages.length} image(s) will be removed upon saving.
              </p>
            ) : (
              <p>Remove or add images as needed. You can have a maximum of 10 images.</p>
            )}
          </div>
          <ImageUploader
            existingImages={existingImages.filter(img => !removedImages.includes(img))}
            onAddImages={handleImageChange}
            onRemoveExistingImage={removeExistingImage}
            onRemoveNewImage={removeNewImage}
            previewUrls={previewUrls}
            maxImages={10}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? (
              <>
                <LoadingSpinner size="small" className="mr-2" /> Saving...
              </>
            ) : (
              "Update Venue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateVenueForm;
