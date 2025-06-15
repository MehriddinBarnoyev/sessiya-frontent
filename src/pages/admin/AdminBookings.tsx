
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import { getAdminBookings, cancelAdminBooking, updateBookingStatus, deleteBooking } from "@/services/booking-service";
import { Booking } from "@/lib/types";
import { Calendar, Users, Crown, Filter, TrendingUp, Clock } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-emerald-600 py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-20 left-20 animate-float opacity-30">
            <Crown size={40} className="text-white" />
          </div>
          <div className="absolute bottom-20 right-20 animate-float opacity-30" style={{ animationDelay: '2s' }}>
            <Calendar size={36} className="text-white" />
          </div>
          
          <div className="relative container mx-auto px-6">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-4">
                  <Crown size={32} className="text-rose-200" />
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold">Admin Bookings</h1>
              </div>
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                Manage all venue bookings across the platform with administrative control
              </p>
            </div>
          </div>
          
          {/* Elegant Wave Transition */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          {/* Premium Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="dashboard-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar size={28} className="text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{totalBookings}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Bookings</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="dashboard-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users size={28} className="text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{confirmedBookings}</div>
                  <div className="text-sm text-gray-500 font-medium">Confirmed</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full" style={{ width: totalBookings ? `${(confirmedBookings / totalBookings) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="dashboard-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock size={28} className="text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{pendingBookings}</div>
                  <div className="text-sm text-gray-500 font-medium">Pending</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full" style={{ width: totalBookings ? `${(pendingBookings / totalBookings) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="dashboard-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp size={28} className="text-rose-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Revenue</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-rose-400 to-rose-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Main Bookings Section */}
          <div className="glass-card p-10 rounded-3xl shadow-3xl border border-white/60">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <div className="w-3 h-16 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-6"></div>
                <h2 className="text-4xl font-serif font-bold text-gray-800">All Bookings</h2>
                <Crown size={32} className="ml-4 text-rose-600" />
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 rounded-2xl px-4 py-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="font-semibold">{totalBookings} Total</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-2xl px-4 py-2">
                  <Users size={16} className="text-emerald-600" />
                  <span className="font-semibold">{confirmedBookings} Confirmed</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 rounded-2xl px-4 py-2">
                  <Clock size={16} className="text-amber-600" />
                  <span className="font-semibold">{pendingBookings} Pending</span>
                </div>
              </div>
            </div>

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
    </Layout>
  );
};

export default AdminBookings;
