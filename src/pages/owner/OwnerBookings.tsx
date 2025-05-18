
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { Button } from "@/components/ui/button";
import { getOwnerBookings, cancelOwnerBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVenues, setHasVenues] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getOwnerBookings();
        
        if (data.length === 0) {
          // Check if the owner has no venues
          const urlSearchParams = new URLSearchParams(window.location.search);
          const noVenues = urlSearchParams.get('noVenues') === 'true';
          setHasVenues(!noVenues);
        }
        
        setBookings(data);
      } catch (error) {
        console.error("Error fetching owner bookings:", error);
        toast.error("Failed to load bookings");
        setHasVenues(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelOwnerBooking(bookingId);
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

  const emptyMessage = hasVenues 
    ? "No bookings found for your venues" 
    : "You don't have any venues yet. Please add a venue first.";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">My Venue Bookings</h1>
          
          {!hasVenues && (
            <Button 
              onClick={() => window.location.href = "/owner/add-venue"}
            >
              Add Venue
            </Button>
          )}
        </div>
        
        <BookingList 
          bookings={bookings} 
          onCancelBooking={handleCancelBooking} 
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      </div>
    </Layout>
  );
};

export default OwnerBookings;
