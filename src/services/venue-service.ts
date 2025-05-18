
import {
  Venue,
  VenueFilter,
  VenueFormData,
  VenueListResponse,
  Booking,
  BookingListResponse,
} from '@/lib/types';

import {
  getData,
  deleteData,
  submitFormData,
  updateFormData,
  postData
} from './api-service';

import axios from 'axios';

export const getPublicVenues = async (filter?: VenueFilter): Promise<VenueListResponse> => {
  return getData<VenueListResponse>('/venues', filter);
};

export const getVenueById = async (id: string): Promise<Venue> => {
  return getData<Venue>(`/user/venues/${id}`);
};

export const getVenueBookedDates = async (id: string): Promise<string[]> => {
  return getData<string[]>(`/venues/${id}/booked-dates`);
};

export const getOwnerVenueById = async (id: string): Promise<Venue> => {
  return getData<Venue>(`/owner/venues/${id}`);
};

export const addOwnerVenue = async (venueData: VenueFormData, images: File[]): Promise<Venue> => {
  return submitFormData<Venue>('/owner/create-venue', venueData, images);
};
      
export const updateOwnerVenue = async (
  id: string,
  venueData: Partial<VenueFormData>,
  newImages?: File[],
  removedImages?: string[]
): Promise<Venue> => {
  const formData = new FormData();

  Object.entries(venueData).forEach(([key, val]) => {
    if (val !== undefined) formData.append(key, String(val));
  });

  newImages?.forEach(file => formData.append('images', file));
  if (removedImages?.length) {
    formData.append('removedImages', JSON.stringify(removedImages));
  }

  const res = await axios.patch(`http://localhost:5000/api/owner/venues/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data;
};

// ==== ADMIN VENUE SERVICES ====

export const getAdminVenueById = async (id: string): Promise<Venue> => {
  return getData<Venue>(`/admin/venues/${id}`);
};

export const getAllVenuesByAdmin = async (): Promise<VenueListResponse> => {
  return getData<VenueListResponse>('/admin/venuesAll');
};

export const addAdminVenue = async (
  venueData: VenueFormData,
  images: File[]
): Promise<Venue> => {
  return submitFormData<Venue>('/admin/create-venue', venueData, images);
};

export const updateAdminVenue = async (
  id: string,
  venueData: Partial<VenueFormData>,
  newImages?: File[],
  removedImages?: string[]
): Promise<Venue> => {
  return updateFormData<Venue>(`/admin/venues/${id}`, venueData, newImages || [], removedImages);
};

export const deleteVenue = async (id: string): Promise<void> => {
  return deleteData<void>(`/admin/venues/${id}`);
};

// ==== ADMIN BOOKING SERVICES ====

export const getAdminBookings = async (filter?: any): Promise<BookingListResponse> => {
  return getData<BookingListResponse>('/admin/bookings', filter);
};

export const cancelAdminBooking = async (bookingId: string): Promise<void> => {
  return deleteData<void>(`/admin/bookings/${bookingId}`);
};
