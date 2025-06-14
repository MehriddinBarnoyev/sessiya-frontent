
import { useState, useCallback } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import PhoneBookingLookup from "@/components/bookings/PhoneBookingLookup";
import OtpVerificationDialog from "@/components/admin/OtpVerificationDialog";
import {
  getBookingsByPhone,
  sendOtp,
  verifyCancelBookingOtp,
} from "@/services/booking-service";
import { Booking } from "@/lib/types";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handlePhoneLookup = useCallback(async (phone: string) => {
    setIsLoading(true);
    setPhoneNumber(phone);
    try {
      const data = await getBookingsByPhone(phone);
      console.log("Raw bookings data from API:", data);

      // Extract the bookings array from the response
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);
      setHasSearched(true);

      if (bookingsArray.length === 0) {
        toast.info("No bookings found for this phone number");
      } else {
        console.log("Bookings set to state:", bookingsArray);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings. Please try again.");
      setBookings([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancelBooking = useCallback(async (bookingId: string) => {
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    setSelectedBookingId(bookingId);
    setIsSendingOtp(true);

    try {
      const response = await sendOtp(phoneNumber);
      if (response.success) {
        toast.success("Verification code sent to your phone");
        setOtpDialogOpen(true);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  }, [phoneNumber]);

  const handleVerifyOtpAndCancel = useCallback(
    async (otp: string) => {
      if (!selectedBookingId || !phoneNumber) {
        toast.error("Missing booking information");
        return;
      }

      try {
        const response = await verifyCancelBookingOtp(
          selectedBookingId,
          phoneNumber,
          otp
        );
        if (response.success) {
          toast.success(response.message || "Booking cancelled successfully");
          setOtpDialogOpen(false);

          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === selectedBookingId
                ? { ...booking, status: "Cancelled" }
                : booking
            )
          );
        } else {
          toast.error(response.message || "OTP verification failed");
        }
      } catch (error) {
        console.error("OTP verification failed: ", error);
        toast.error("Verification failed. Please try again .");
      }
    },
    [selectedBookingId, phoneNumber]
  );

  console.log("Current bookings state:", bookings);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-600 py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="text-center text-white">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                My Bookings
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
                Enter your phone number to view and manage your venue bookings
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Search Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-12">
              <PhoneBookingLookup onSubmit={handlePhoneLookup} isLoading={isLoading} />
            </div>

            {hasSearched && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-4"></div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800">Your Bookings</h2>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
                    <p className="text-gray-500">No bookings found for this phone number.</p>
                  </div>
                ) : (
                  <BookingList
                    bookings={bookings}
                    onCancelBooking={handleCancelBooking}
                    isLoading={isLoading}
                    showVenueInfo={true}
                    disableCancelButtons={isSendingOtp}
                  />
                )}
              </div>
            )}

            <OtpVerificationDialog
              isOpen={otpDialogOpen}
              onClose={() => setOtpDialogOpen(false)}
              onVerify={handleVerifyOtpAndCancel}
              title="Enter Verification Code"
              description={`Enter the 6-digit code sent to your ${phoneNumber} phone number to confirm booking cancellation.`}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
