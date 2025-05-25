import type { Venue, VenueFilter, VenueFormData, VenueListResponse, BookingListResponse } from "@/lib/types"

import { getData, deleteData, submitFormData, updateFormData } from "./api-service"

import axios from "axios"

export const getPublicVenues = async (filter?: VenueFilter): Promise<VenueListResponse> => {
  return getData<VenueListResponse>("/venues", filter)
}

export const getVenueById = async (id: string): Promise<Venue> => {
  // This function is used by the edit form, so we need to ensure it gets the right data
  // First try the owner endpoint, and if that fails, try the user endpoint
  try {
    const res = await getData<Venue>(`/owner/venues/${id}`)
    console.log("Fetched venue data from owner endpoint:", res);
    
    return res
  } catch (error) {
    console.log("Falling back to user venue endpoint")
    return getData<Venue>(`/user/venues/${id}`)
  }
}

export const getVenueBookedDates = async (id: string): Promise<string[]> => {
  return getData<string[]>(`/venues/${id}/booked-dates`)
}

export const getOwnerVenueById = async (id: string): Promise<Venue> => {
  return getData<Venue>(`/owner/venues/${id}`)
}

export const addOwnerVenue = async (venueData: VenueFormData, images: File[]): Promise<Venue> => {
  return submitFormData<Venue>("/owner/create-venue", venueData, images)
}

export const updateOwnerVenue = async (
  id: string,
  venueData: Partial<VenueFormData>,
  newImages?: File[],
  removedImages?: string[],
): Promise<Venue> => {
  const formData = new FormData()

  // Log the data being sent for debugging
  console.log("Updating venue with ID:", id)
  console.log("Venue data:", venueData)

  Object.entries(venueData).forEach(([key, val]) => {
    if (val !== undefined) formData.append(key, String(val))
  })

  newImages?.forEach((file) => formData.append("images", file))
  if (removedImages?.length) {
    formData.append("removedImages", JSON.stringify(removedImages))
  }

  try {
    const res = await axios.patch(`http://localhost:5000/api/owner/venues/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    return res.data
  } catch (error) {
    console.error("Error updating venue:", error)
    throw error
  }
}

// ==== ADMIN VENUE SERVICES ====

export const getAdminVenueById = async (id: string): Promise<Venue> => {
  return getData<Venue>(`/admin/venues/${id}`)
}

export const getAllVenuesByAdmin = async (): Promise<VenueListResponse> => {
  return getData<VenueListResponse>("/admin/venuesAll")
}

export const addAdminVenue = async (venueData: VenueFormData, images: File[]): Promise<Venue> => {
  return submitFormData<Venue>("/admin/create-venue", venueData, images)
}

export const updateAdminVenue = async (
  id: string,
  venueData: Partial<VenueFormData>,
  newImages?: File[],
  removedImages?: string[],
): Promise<Venue> => {
  return updateFormData<Venue>(`/admin/venues/${id}`, venueData, newImages || [], removedImages)
}

export const deleteVenue = async (id: string): Promise<void> => {
  return deleteData<void>(`/admin/venues/${id}`)
}

// ==== ADMIN BOOKING SERVICES ====

export const getAdminBookings = async (filter?: any): Promise<BookingListResponse> => {
  return getData<BookingListResponse>("/admin/bookings", filter)
}

export const cancelAdminBooking = async (bookingId: string): Promise<void> => {
  return deleteData<void>(`/admin/bookings/${bookingId}`)
}
