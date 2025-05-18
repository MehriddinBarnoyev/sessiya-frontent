
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { Button } from "@/components/ui/button";
import { getOwnerBookings, cancelOwnerBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";
import { PlusCircle, Calendar } from "lucide-react";

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
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-primary/10 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary-foreground flex items-center">
                <Calendar size={24} className="mr-2" />
                My Venue Bookings
              </h1>
              <p className="text-muted-foreground mt-2">Manage all your venue bookings in one place</p>
            </div>
            
            {!hasVenues && (
              <Button 
                onClick={() => window.location.href = "/owner/add-venue"}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Your First Venue
              </Button>
            )}
          </div>
        </div>
        
        <BookingList 
          bookings={bookings} 
          onCancelBooking={handleCancelBooking} 
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          showVenueInfo={true}
        />
      </div>
    </Layout>
  );
};

export default OwnerBookings;
