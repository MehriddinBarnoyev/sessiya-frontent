
import type { Booking, BookingFormData, BookingListResponse } from "@/lib/types";
import { getData, submitData } from "./api-service";
import { getRole } from "@/lib/auth";

export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  return submitData<Booking>("/bookings", bookingData);
};

export const getUserBookings = async (): Promise<BookingListResponse> => {
  return getData<BookingListResponse>("/user/bookings");
};

export const getOwnerBookings = async (): Promise<BookingListResponse> => {
  return getData<BookingListResponse>("/owner/bookings");
};

export const getBookingsByPhoneNumber = async (phoneNumber: string): Promise<BookingListResponse> => {
  return getData<BookingListResponse>(`/bookings/phone/${phoneNumber}`);
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const role = getRole();
  const endpoint = role === 'admin' ? `/admin/bookings/${bookingId}` : `/bookings/${bookingId}`;
  return submitData<void>(endpoint, {}, 'DELETE');
};
