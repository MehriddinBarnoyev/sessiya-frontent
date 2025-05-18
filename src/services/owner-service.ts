
import { Owner, OwnerListResponse } from '@/lib/types';
import { getData, postData, deleteData } from './api-service';
import api from '@/lib/api';

// Admin owner services
export const getOwners = async (): Promise<OwnerListResponse> => {
  return getData<OwnerListResponse>('/admin/ownersAll');
};

export const getOwnerById = async (id: string): Promise<Owner> => {
  return getData<Owner>(`/admin/owners/${id}`);
};

export const addOwner = async (ownerData: Partial<Owner>): Promise<Owner> => {
  return postData<Owner>('/admin/create-owners', ownerData);
};


export const deleteOwner = async (ownerId: string): Promise<void> => {
  try {
    console.log(`Deleting owner with ID: ${ownerId}`);
    await api.delete("/admin/owners", {
      data: { ownerId }, // DELETE so‘rovi uchun body shu tarzda beriladi
    });
  } catch (error) {
    console.error(`Failed to delete owner with ID: ${ownerId}`, error);
    throw error;
  }
};


// Owner services - using the correct owner APIs
export const getOwnerBookings = async (): Promise<any> => {
  return getData<any>('/owner/bookings');
};

export const getOwnerVenuesByOwner = async (ownerId: string): Promise<any> => {
  // Use the correct owner endpoint without requiring ownerId parameter
  console.log(`Fetching venues for owner with ID: ${ownerId}`);

  const res = await postData<any>('/owner/venues', { ownerId });
  return res;
}

export const getOwnerVenueByAdmin = async (ownerId: string): Promise<any> => {
  const res = await postData<any>('/admin/owners/venues', { ownerId });
  return res;
};