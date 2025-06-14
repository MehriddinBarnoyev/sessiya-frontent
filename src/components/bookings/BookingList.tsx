
import React from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/types";
import { Calendar, MapPin, User, Phone, Users, Crown, Star } from "lucide-react";

export interface BookingListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => Promise<void>;
  isLoading: boolean;
  showVenueInfo?: boolean;
  disableCancelButtons?: boolean;
  emptyMessage?: string;
}

const BookingList = ({ 
  bookings, 
  onCancelBooking, 
  isLoading, 
  showVenueInfo = false,
  disableCancelButtons = false,
  emptyMessage = "No bookings found"
}: BookingListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your bookings...</p>
        </div>
      </div>
    );
  }
  
  const bookingList = bookings;

  if (!bookingList.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
          <Calendar size={40} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">
          {emptyMessage === "No bookings found" ? "You don't have any bookings yet. Start by booking your favorite venue!" : ""}
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "Date not available";
    try {
      return format(parseISO(dateString), "EEEE, MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "confirmed") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Star size={14} className="mr-1" />
          {status}
        </div>
      );
    } else if (status.toLowerCase() === "cancelled") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
          {status}
        </div>
      );
    } else if (status.toLowerCase() === "pending") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          {status}
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
          {status}
        </div>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      {bookings.map((booking, index) => {
        const bookingId = booking.id || booking.bookingid;
        const venueName = booking.venueName || booking.VenueName;
        const district = booking.district;
        const bookingDate = booking.bookingdate || booking.bookingDate;
        const numberOfGuests = booking.numberofguests;
        const status = booking.status;
        
        return (
          <div 
            key={bookingId} 
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                {showVenueInfo && venueName && (
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Crown size={20} className="text-yellow-500 mr-2" />
                      <h3 className="text-xl font-serif font-semibold text-gray-800">{venueName}</h3>
                    </div>
                    {district && (
                      <p className="text-gray-600 flex items-center mb-3">
                        <MapPin size={16} className="mr-2 text-emerald-600" /> 
                        {district}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="text-right">
                  {getStatusBadge(status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
                  <div className="flex items-center text-emerald-700">
                    <User size={18} className="mr-2" />
                    <div>
                      <p className="font-medium">{booking.userfullname}</p>
                      <p className="text-sm text-emerald-600">Guest Name</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center text-blue-700">
                    <Phone size={18} className="mr-2" />
                    <div>
                      <p className="font-medium">{booking.phonenumber}</p>
                      <p className="text-sm text-blue-600">Contact</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
                  <div className="flex items-center text-yellow-700">
                    <Users size={18} className="mr-2" />
                    <div>
                      <p className="font-medium">{numberOfGuests} guests</p>
                      <p className="text-sm text-yellow-600">Party Size</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3" />
                  <div>
                    <p className="font-medium text-lg">{formatDateTime(bookingDate)}</p>
                    <p className="text-sm text-gray-600">Wedding Date</p>
                  </div>
                </div>
              </div>
              
              {onCancelBooking && bookingId && status.toLowerCase() !== "cancelled" && (
                <div className="flex justify-end">
                  <Button 
                    variant="destructive" 
                    onClick={() => onCancelBooking(bookingId)}
                    disabled={disableCancelButtons}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
