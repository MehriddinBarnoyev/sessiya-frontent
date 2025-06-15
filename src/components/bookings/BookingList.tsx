
import { Booking } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Crown, X, Edit, Trash2 } from "lucide-react";

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showVenueInfo?: boolean;
  disableCancelButtons?: boolean;
  onUpdateStatus?: (bookingId: string, status: string) => void;
  onDeleteBooking?: (bookingId: string) => void;
  showAdminActions?: boolean;
}

const BookingList = ({
  bookings,
  onCancelBooking,
  isLoading,
  emptyMessage = "No bookings found",
  showVenueInfo = false,
  disableCancelButtons = false,
  onUpdateStatus,
  onDeleteBooking,
  showAdminActions = false,
}: BookingListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white/40 h-80 rounded-3xl border border-white/60 animate-pulse"
          >
            <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-rose-50 to-emerald-50 rounded-3xl border border-white/60">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-emerald-100 rounded-full flex items-center justify-center">
          <Calendar size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-gray-700 mb-2">No Bookings</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Pending: "bg-amber-100 text-amber-800 border-amber-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending}`}>
        {status}
      </Badge>
    );
  };

  console.log("Bookings:", bookings);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden group"
        >
          {/* Header with Status */}
          <div className="bg-gradient-to-r from-rose-50 to-emerald-50 p-6 border-b border-rose-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-800">
                    Booking #{booking.id?.slice(0, 8)}
                  </h3>
                  {showAdminActions && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Crown size={14} />
                      <span>Admin Control</span>
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            {/* Venue Info */}
            {showVenueInfo && booking.VenueName && (
              <div className="bg-white/80 rounded-2xl p-4 mb-4">
                <h4 className="font-serif text-xl font-semibold text-gray-800 mb-2">
                  {booking.VenueName}
                </h4>
                {/* <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-2 text-rose-500" />
                  <span>{booking.VenueDistrict}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2 text-emerald-500" />
                    <span className="text-sm">{booking.venueCapacity} guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm">${booking.venuePricePerSeat}/seat</span>
                  </div>
                </div> */}
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Event Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(booking.bookingdate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Guests</p>
                  <p className="font-semibold text-gray-800">{booking.numberofguests}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact</p>
                  <p className="font-semibold text-gray-800">{booking.phonenumber}</p>
                </div>
              </div>

              {booking.UserFullName && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-semibold text-gray-800">{booking.UserFullName}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-rose-100">
              {showAdminActions && onUpdateStatus && onDeleteBooking ? (
                <div className="flex flex-wrap gap-2">
                  {booking.status !== "Confirmed" && (
                    <Button
                      onClick={() => onUpdateStatus(booking.id, "Confirmed")}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl"
                      size="sm"
                    >
                      <Edit size={16} className="mr-1" />
                      Confirm
                    </Button>
                  )}
                  {booking.status !== "Cancelled" && onCancelBooking && (
                    <Button
                      onClick={() => onCancelBooking(booking.id)}
                      disabled={disableCancelButtons}
                      variant="outline"
                      className="flex-1 border-rose-300 text-rose-700 hover:bg-rose-50 rounded-2xl"
                      size="sm"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => onDeleteBooking(booking.id)}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 rounded-2xl"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ) : (
                onCancelBooking &&
                booking.status !== "Cancelled" && (
                  <Button
                    onClick={() => onCancelBooking(booking.id)}
                    disabled={disableCancelButtons}
                    className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-2xl font-semibold"
                  >
                    <X size={18} className="mr-2" />
                    {disableCancelButtons ? "Processing..." : "Cancel Booking"}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
