
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DISTRICTS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
  pricePerSeat: z.coerce.number().min(0, "Price per seat must be at least 0"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  ownerId: z.string().optional(),
});

export type VenueUploadFormProps = {
  isAdmin?: boolean;
  ownerId?: string;
  onSuccess?: () => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGES = 10;

const VenueUploadForm = ({ isAdmin = false, ownerId, onSuccess }: VenueUploadFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 0,
      pricePerSeat: 0,
      district: "",
      address: "",
      phoneNumber: "",
      ownerId: ownerId || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newErrors: string[] = [];
    const selectedFiles: File[] = Array.from(files);
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    
    // Check if adding these files would exceed limit
    if (images.length + selectedFiles.length > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images`);
      return;
    }
    
    // Validate each file
    selectedFiles.forEach((file, index) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        newErrors.push(`File ${file.name} is not a supported image format`);
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`File ${file.name} is too large (max 5MB)`);
        return;
      }
      
      newImages.push(file);
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
    });
    
    if (newErrors.length > 0) {
      setImageErrors(newErrors);
      return;
    }
    
    setImages([...images, ...newImages]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImageErrors([]);
  };
  
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: z.infer<typeof venueSchema>) => {
    // Basic validation
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setIsLoading(true);
    
    const multipartData = new FormData();
    
    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        multipartData.append(key, String(value));
      }
    });
    
    // Append images
    images.forEach((image) => {
      multipartData.append("images", image);
    });
    
    try {
      const endpoint = isAdmin ? "/admin/create-venue" : "/owner/venues";
      const token = localStorage.getItem("token");
      
      await axios.post(`http://localhost:5000/api${endpoint}`, multipartData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success(`Venue ${formData.name} created successfully`);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate based on role
      navigate(isAdmin ? "/admin/dashboard" : "/owner/dashboard");
    } catch (error) {
      console.error("Error creating venue:", error);
      toast.error("Failed to create venue. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISTRICTS.map((district) => (
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

        {isAdmin && (
          <FormField
            control={form.control}
            name="ownerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter owner ID" 
                    {...field} 
                    value={ownerId || field.value}
                    readOnly={!!ownerId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <FormLabel htmlFor="images">Upload Images</FormLabel>
            <div className="border border-dashed border-gray-300 rounded-md p-6 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors">
              <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Drop files here or click to upload</span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP up to 5MB (max {MAX_IMAGES} images)
                </span>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {imageErrors.length > 0 && (
              <ul className="text-red-500 text-sm mt-2">
                {imageErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Image Previews ({imagePreviews.length}/{MAX_IMAGES})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating Venue..." : "Create Venue"}
        </Button>
      </form>
    </Form>
  );
};

export default VenueUploadForm;
