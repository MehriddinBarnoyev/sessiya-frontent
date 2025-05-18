
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { getAdminBookings, cancelAdminBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAdminBookings();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching admin bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelAdminBooking(bookingId);
      toast.success("Booking cancelled successfully");
      
      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">All Bookings</h1>
        </div>
        
        <BookingList 
          bookings={bookings} 
          onCancelBooking={handleCancelBooking} 
          isLoading={isLoading}
          emptyMessage="No bookings found in the system"
        />
      </div>
    </Layout>
  );
};

export default AdminBookings;
