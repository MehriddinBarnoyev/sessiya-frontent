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
      const bookingsArray = data && data.bookings && Array.isArray(data.bookings) ? data.bookings : [];
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
        console.error("OTP verification failed:", error);
        toast.error("Verification failed. Please try again.");
      }
    },
    [selectedBookingId, phoneNumber]
  );

  console.log("Current bookings state:", bookings);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              My Bookings
            </h1>
            <p className="text-muted-foreground">
              Enter your phone number to view and manage your venue bookings
            </p>
          </section>

          <PhoneBookingLookup onSubmit={handlePhoneLookup} isLoading={isLoading} />

          {hasSearched && (
            <div className="mt-8">
              <h2 className="text-xl font-medium mb-4">Your Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-muted-foreground">
                  No bookings found for this phone number.
                </p>
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
    </Layout>
  );
};

export default MyBookings;