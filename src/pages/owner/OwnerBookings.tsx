
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Booking } from "@/lib/types";
import { getOwnerBookings } from "@/services/booking-service";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getOwnerBookings();
      const bookingsList = response.bookings || [];
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-primary/10 mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-primary-foreground">Venue Bookings</h1>
            <p className="text-muted-foreground">
              Manage bookings for your venues and track customer activity
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <BookingList bookings={bookings} showVenueInfo={true} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerBookings;
