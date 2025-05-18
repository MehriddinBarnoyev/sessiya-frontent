
import axios from 'axios';
import { toast } from 'sonner';
import api from '@/lib/api';

// Send OTP for booking deletion
export const sendDeleteBookingOtp = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/send-otp', { phoneNumber });
    return {
      success: true,
      message: response.data.message || 'OTP code sent successfully'
    };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP code'
    };
  }
};

// Verify OTP and delete booking
export const verifyOtpAndDeleteBooking = async (
  bookingId: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`, {
      data: { code: otp }
    });
    return {
      success: true,
      message: response.data.message || 'Booking deleted successfully'
    };
  } catch (error: any) {
    console.error('Error verifying OTP and deleting booking:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid or expired OTP code'
    };
  }
};

// Admin specific OTP for venue deletion
export const sendDeleteVenueOtp = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/admin/send-otp');
    return {
      success: true,
      message: response.data.message || 'OTP code sent successfully'
    };
  } catch (error: any) {
    console.error('Error sending venue deletion OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP code'
    };
  }
};

// Verify OTP and delete venue
export const verifyOtpAndDeleteVenue = async (
  venueId: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/admin/venues/${venueId}`, {
      data: { code: otp }
    });
    return {
      success: true,
      message: response.data.message || 'Venue deleted successfully'
    };
  } catch (error: any) {
    console.error('Error verifying OTP and deleting venue:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid or expired OTP code'
    };
  }
};
