
import { 
  Booking, 
  BookingFormData, 
  BookingListResponse 
} from '@/lib/types';
import { getData, postData, deleteData } from './api-service';
import api from '@/lib/api';

// User booking services
export const getBookingsByPhone = async (phoneNumber: string): Promise<Booking[]> => {
  return getData<Booking[]>(`/user/bookings`, { phoneNumber });
};

export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  // If venueId is missing, log an error and throw an exception
  if (!bookingData.venueId) {
    console.error("Missing venueId in booking data", bookingData);
    throw new Error("Venue ID is required for booking");
  }
  
  console.log("Creating booking with data:", bookingData);
  return postData<Booking>('/user/booking', bookingData);
};

export const cancelBookingByPhone = async (bookingId: string, phoneNumber: string): Promise<void> => {
  return deleteData<void>(`/user/bookings/${bookingId}/${phoneNumber}`);
};

// Booking cancellation with OTP
export const sendCancelBookingOtp = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/bookings/send-code', { phoneNumber });
    return { 
      success: true, 
      message: response.data.message || 'OTP sent successfully' 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to send OTP' 
    };
  }
};

export const verifyCancelBookingOtp = async (
  bookingId: string, 
  phoneNumber: string, 
  code: string
): Promise<{ success: boolean; message: string }> => {
  try {
    await api.delete(`/user/bookings/${bookingId}`, { 
      data: { phoneNumber, code } 
    });
    return { success: true, message: 'Booking cancelled successfully' };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Invalid or expired OTP' 
    };
  }
};

// Owner booking services - use the correct owner API
export const getOwnerBookings = async (): Promise<any> => {
  try {
    // Use the correct owner API endpoint
    const response = await getData<any>('/owner/bookings');
    if ('bookings' in response) {
      return response.bookings;
    }
    return response as unknown as Booking[];
  } catch (error: any) {
    // If the error is specifically about not having venues, return empty array
    if (error.response?.data?.message === "You don't have any venues yet") {
      return [];
    }
    throw error;
  }
};

export const cancelOwnerBooking = async (bookingId: string): Promise<void> => {
  return deleteData<void>(`/owner/bookings/${bookingId}`);
};

// Admin booking services
export const getAdminBookings = async (): Promise<BookingListResponse> => {
  return getData<BookingListResponse>('/admin/bookings');
};

export const cancelAdminBooking = async (bookingId: string): Promise<Booking> => {
  return deleteData<Booking>(`/admin/bookings/${bookingId}`);
};
