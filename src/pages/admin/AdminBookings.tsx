
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { getAdminBookings, cancelAdminBooking, updateBookingStatus, deleteBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";
import { Calendar, Users, Crown, Filter } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAdminBookings();
        setBookings(data);
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

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status updated to ${status}`);
      
      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      ));
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    
    try {
      await deleteBooking(bookingId);
      toast.success("Booking deleted successfully");
      
      // Remove from local state
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-emerald-600 py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-4">
                <Crown size={32} className="mr-3 text-rose-200" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold">Admin Bookings</h1>
              </div>
              <p className="text-xl font-light">Manage all venue bookings across the platform</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-2 h-12 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-4"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">All Bookings</h2>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{bookings.length} Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{bookings.filter(b => b.status === "Confirmed").length} Confirmed</span>
                </div>
              </div>
            </div>

            <BookingList 
              bookings={bookings} 
              onCancelBooking={handleCancelBooking} 
              isLoading={isLoading}
              emptyMessage="No bookings found in the system"
              showVenueInfo={true}
              isAdmin={true}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminBookings;
