
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { getAdminBookings, cancelAdminBooking, updateBookingStatus, deleteBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";

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

  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "Confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;
  const totalRevenue = bookings
    .filter(b => b.status === "Confirmed")
    .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Admin Bookings</h1>
            <p className="text-gray-600">Manage all venue bookings across the platform</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-800">{totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-800">{confirmedBookings}</div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-gray-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-800">{pendingBookings}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-800">${totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Bookings Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">All Bookings</h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-blue-600" />
                    <span>{totalBookings} Total</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-emerald-600" />
                    <span>{confirmedBookings} Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-600" />
                    <span>{pendingBookings} Pending</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <BookingList 
                bookings={bookings} 
                onCancelBooking={handleCancelBooking} 
                isLoading={isLoading}
                emptyMessage="No bookings found in the system"
                showVenueInfo={true}
                showAdminActions={true}
                onUpdateStatus={handleUpdateStatus}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminBookings;
