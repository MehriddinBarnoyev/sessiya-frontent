
import { apiClient } from "@/lib/api";
import { Booking, BookingFormData } from "@/lib/types";

// Get bookings by phone number (public endpoint)
export const getBookingsByPhone = async (phoneNumber: string): Promise<Booking[]> => {
  const response = await apiClient.get<{ bookings: Booking[] }>(`/bookings/phone/${phoneNumber}`);
  return response.data.bookings || [];
};

// Create booking (public endpoint)
export const createBooking = async (bookingData: BookingFormData) => {
  const response = await apiClient.post("/bookings", bookingData);
  return response.data;
};

// Send OTP for verification (public endpoint)
export const sendOtp = async (phoneNumber: string) => {
  const response = await apiClient.post("/send-otp", { phoneNumber });
  return response.data;
};

// Verify OTP and cancel booking (public endpoint)
export const verifyCancelBookingOtp = async (
  bookingId: string,
  phoneNumber: string,
  otp: string
) => {
  const response = await apiClient.post("/verify-cancel-booking", {
    bookingId,
    phoneNumber,
    otp,
  });
  return response.data;
};

// Owner-specific booking endpoints
export const getOwnerBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>("/owner/bookings");
  return Array.isArray(response.data) ? response.data : [];
};

// Admin-specific booking endpoints
export const getAdminBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>("/admin/bookings");
  return Array.isArray(response.data) ? response.data : [];
};

// Update booking status (admin only)
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const response = await apiClient.patch(`/admin/bookings/${bookingId}/status`, {
    status,
  });
  return response.data;
};

// Delete booking (admin only)
export const deleteBooking = async (bookingId: string) => {
  const response = await apiClient.delete(`/admin/bookings/${bookingId}`);
  return response.data;
};
