
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Owner, VenueFormData } from "@/lib/types";
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
});

export type VenueFormProps = {
  initialValues?: VenueFormData;
  owners?: Owner[];
  venueImages?: string[];
  onSubmit: (formData: VenueFormData, images: File[]) => Promise<void>;
  isAdmin?: boolean;
};

const VenueForm = ({ 
  initialValues, 
  owners = [], 
  venueImages = [], 
  onSubmit, 
  isAdmin = false 
}: VenueFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(venueImages);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      capacity: 0,
      pricePerSeat: 0,
      district: "",
      address: "",
      phoneNumber: "",
      ownerId: "",
    },
  });

  const handleSubmit = async (data: VenueFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data, newImages);
    } catch (error) {
      console.error("Error saving venue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (files: File[]) => {
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
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district here" />
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

        {isAdmin && owners.length > 0 && (
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

        <div>
          <h3 className="text-lg font-medium mb-2">Venue Images</h3>
          <ImageUploader
            existingImages={existingImages}
            onAddImages={handleImageChange}
            onRemoveExistingImage={removeExistingImage}
            onRemoveNewImage={removeNewImage}
            previewUrls={previewUrls}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Saving..." : initialValues ? "Update Venue" : "Add Venue"}
        </Button>
      </form>
    </Form>
  );
};

export default VenueForm;
