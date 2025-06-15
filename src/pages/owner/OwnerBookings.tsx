
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { Button } from "@/components/ui/button";
import { getOwnerBookings, cancelOwnerBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";
import { PlusCircle, Calendar, Crown } from "lucide-react";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVenues, setHasVenues] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getOwnerBookings();
        setBookings(data.bookings);
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

    console.log("Bookings data for rendering:", bookings);
    
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-600 py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="flex justify-between items-center text-white">
              <div>
                <div className="flex items-center mb-4">
                  <Crown size={32} className="mr-3 text-yellow-300" />
                  <h1 className="text-4xl md:text-5xl font-serif font-bold">My Venue Bookings</h1>
                </div>
                <p className="text-xl font-light">Manage all your venue bookings in one elegant dashboard</p>
              </div>

              {!hasVenues && (
                <Button
                  onClick={() => window.location.href = "/owner/add-venue"}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Add Your First Venue
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <BookingList
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              showVenueInfo={true}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerBookings;
