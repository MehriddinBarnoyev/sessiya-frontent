
import React from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/types";
import { Calendar, MapPin, User, Phone, Users } from "lucide-react";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const bookingList = bookings;

  if (!bookingList.length) {
    return (
      <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg border border-dashed border-primary/30">
        <p className="text-lg font-medium font-serif text-primary-foreground mb-2">{emptyMessage}</p>
        <p className="text-muted-foreground">
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
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    if (status.toLowerCase() === "confirmed") {
      variant = "default";
    } else if (status.toLowerCase() === "cancelled") {
      variant = "destructive";
    } else if (status.toLowerCase() === "pending") {
      variant = "secondary";
    } else {
      variant = "outline";
    }
    
    return <Badge variant={variant} className="text-sm font-medium px-3 py-1">{status}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const bookingId = booking.id || booking.bookingid;
        const venueName = booking.venueName || booking.VenueName;
        const district = booking.district;
        const bookingDate = booking.bookingdate || booking.bookingDate;
        const numberOfGuests = booking.numberofguests;
        const status = booking.status;
        
        return (
          <div 
            key={bookingId} 
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  {showVenueInfo && venueName && (
                    <h3 className="text-xl font-serif font-medium mb-1 text-primary-foreground">{venueName}</h3>
                  )}
                  {showVenueInfo && district && (
                    <p className="text-sm text-muted-foreground mb-3 flex items-center">
                      <MapPin size={16} className="mr-1.5" /> {district}
                    </p>
                  )}
                  <div className="space-y-1">
                    <p className="font-medium text-primary-foreground/90 flex items-center">
                      <User size={16} className="mr-1.5" />
                      {booking.userfullname}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone size={16} className="mr-1.5" />
                      {booking.phonenumber}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Users size={16} className="mr-1.5" />
                      {numberOfGuests} guests
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="mb-3">{getStatusBadge(status)}</div>
                  <p className="font-medium text-primary-foreground flex items-center justify-end">
                    <Calendar size={16} className="mr-1.5" />
                    {formatDateTime(bookingDate)}
                  </p>
                </div>
              </div>
              
              {onCancelBooking && bookingId && status.toLowerCase() !== "cancelled" && (
                <div className="mt-5 flex justify-end">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onCancelBooking(bookingId)}
                    disabled={disableCancelButtons}
                    className="bg-destructive/90 hover:bg-destructive"
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
