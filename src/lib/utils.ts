import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a properly formatted image URL for venue photos
 * @param photoPath The photo path or filename
 * @returns Fully qualified URL to the image
 */
export function getImageUrl(photoPath: string | undefined): string {
  if (!photoPath) return "/placeholder.svg";
  
  // Handle arrays (legacy support)
  if (Array.isArray(photoPath)) {
    photoPath = photoPath[0];
  }
  
  // If it's already a full URL, return it
  if (photoPath.startsWith('http')) return photoPath;
  
  // Otherwise, construct the URL
  return `http://localhost:5000/uploads/${encodeURIComponent(photoPath)}`;
}

/**
 * Gets the first valid image URL from an array of photo paths
 * @param photos Array of photo paths or filenames
 * @returns URL to the first image or placeholder
 */
export function getFirstImageUrl(photos: string[] | undefined): string {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return "/placeholder.svg";
  }
  
  return getImageUrl(photos[0]);
}
