
import api from '@/lib/api';
import { VenueFilter, VenueFormData } from '@/lib/types';

export const getData = async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const patchData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await api.patch<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error patching data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async <T>(endpoint: string, p0?: { id: string; }): Promise<T> => {
  try {
    const response = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};

// Helper for form data submissions (used for venue creation/updates with images)
export const submitFormData = async <T>(endpoint: string, formData: VenueFormData, images: File[]): Promise<T> => {
  const data = new FormData();
  
  // Add venue data
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined) {
      data.append(key, String(value));
    }
  });
  
  // Add images if provided
  if (images && images.length > 0) {
    console.log(`Adding ${images.length} images to form data`);
    images.forEach(image => {
      data.append('images', image);
    });
  }
  
  try {
    console.log("Submitting form data:", endpoint, data);
    const response = await api.post<T>(endpoint, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error submitting form data to ${endpoint}:`, error);
    throw error;
  }
};

// Helper for updating form data with images
export const updateFormData = async <T>(
  endpoint: string, 
  formData: Partial<VenueFormData>, 
  images: File[] = [],
  removedImages?: string[]
): Promise<T> => {
  const data = new FormData();
  
  // Add venue data
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined) {
      data.append(key, String(value));
    }
  });
  
  // Add images if provided
  if (images && images.length > 0) {
    console.log(`Adding ${images.length} images to form data for update`);
    images.forEach(image => {
      data.append('images', image);
    });
  }
  
  // Add removed images if provided
  if (removedImages?.length) {
    data.append('removedImages', JSON.stringify(removedImages));
  }
  
  try {
    console.log("Updating form data:", endpoint, data);
    const response = await api.patch<T>(endpoint, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating form data at ${endpoint}:`, error);
    throw error;
  }
};

// Function to convert filters to query params
export const buildFilterParams = (filters: VenueFilter): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.status) params.append('status', filters.status);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minCapacity) params.append('minCapacity', filters.minCapacity.toString());
  if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity.toString());
  if (filters.district) params.append('district', filters.district);
  if (filters.sort) params.append('sort', filters.sort);
  
  return params;
};
