
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FormDescription } from './form';
import { getImageUrl } from '@/lib/utils';

interface ImageUploaderProps {
  existingImages?: string[];
  onAddImages: (files: File[]) => void;
  onRemoveExistingImage: (index: number) => void;
  onRemoveNewImage: (index: number) => void;
  previewUrls: string[];
  maxImages?: number;
  className?: string;
}

export function ImageUploader({
  existingImages = [],
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  previewUrls,
  maxImages = 10,
  className,
}: ImageUploaderProps) {
  const totalImagesCount = existingImages.length + previewUrls.length;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const totalImageCount = existingImages.length + previewUrls.length + files.length;
    
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
    onAddImages(selectedFiles);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
        {/* Existing Images */}
        {existingImages.map((image, index) => (
          <div 
            key={`existing-${index}`}
            className="relative h-32 border rounded-md overflow-hidden group"
          >
            <img 
              src={getImageUrl(image)} 
              alt={`Venue image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button 
              type="button"
              onClick={() => onRemoveExistingImage(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {/* New Image Previews */}
        {previewUrls.map((url, index) => (
          <div 
            key={`new-${index}`}
            className="relative h-32 border rounded-md overflow-hidden group"
          >
            <img 
              src={url} 
              alt={`New venue image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button 
              type="button"
              onClick={() => onRemoveNewImage(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {/* Upload Button */}
        {totalImagesCount < maxImages && (
          <label 
            htmlFor="image-upload" 
            className="h-32 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload size={24} className="mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Upload Images
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {totalImagesCount} / {maxImages}
            </span>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>
      <FormDescription>
        Upload up to {maxImages} images. JPG, PNG, and WebP formats accepted.
      </FormDescription>
    </div>
  );
}
