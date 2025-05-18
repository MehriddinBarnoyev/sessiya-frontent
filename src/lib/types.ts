
import { ReactNode } from "react";

export type VenueStatus = "Confirmed" | "Unconfirmed";

export interface Venue {
  [x: string]: ReactNode;
  venueid: string;
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerSeat: number;
  priceperseat?: number; // support both casing versions
  district: string;
  address: string;
  phoneNumber: string;
  ownerId?: string;
  status: VenueStatus;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  venueName?: string;
  district?: string;
  bookingdate: string | undefined;
  numberofguests: number;
  status: string;
  bookingid?: string;
  VenueName?: string;
  bookingDate?: string;
  [key: string]: string | number | undefined;
}

export interface Owner {
  firstname: string;
  lastname: string; 
  ownerid: string;
  createdat: string;
  id: string;
  username: string;
  name: string;
  email: string;
  phonenumber?: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface BookingFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
  district?: string;
  venueId?: string;
}

export interface VenueFilter {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
  district?: string;
  sort?: string;
  status?: string;
}

export interface UploadImageResponse {
  filename: string;
}

export interface BookingFormData {
  venueId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  numberOfGuests: number;
  bookingDate: string;
}

export interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  pricePerSeat: number;
  district: string;
  address: string;
  phoneNumber: string;
  ownerId?: string;
}

// Add API response interfaces
export interface VenueListResponse {
  venues: Venue[];
  totalPages: number;
  currentPage: number;
  totalVenues: number;
}

export interface VenueDetailsResponse {
  venue: Venue;
}

export interface OwnerListResponse {
  [x: string]: any[];
  owners: Owner[];
  totalPages?: number;
  currentPage?: number;
  totalOwners?: number;
}

export interface BookingListResponse {
  bookings: Booking[];
  totalPages?: number;
  currentPage?: number;
  totalBookings?: number;
}

interface Photo {
  photourl: string;
}
