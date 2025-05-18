
import React from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/types";

export interface BookingListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => Promise<void>;
  isLoading: boolean;
  showVenueInfo?: boolean;
  disableCancelButtons?: boolean;
  emptyMessage?: string;
  disableCancelButtons?: boolean;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }
  const bookingList = bookings;
  console.log("Booking List:", bookingList);

  if (!bookingList.length) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium mb-2">{emptyMessage}</p>
        <p className="text-muted-foreground">
          {emptyMessage === "No bookings found" ? "You don't have any bookings yet. Start by booking your favorite venue!" : ""}
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "Date not available";
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
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
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  
  console.log("Booking List Data:", bookingList);
  
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
            className="border rounded-lg overflow-hidden bg-card shadow-sm"
          >
            <div className="p-6">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  {showVenueInfo && venueName && (
                    <h3 className="text-lg font-medium mb-1">{venueName}</h3>
                  )}
                  {showVenueInfo && district && (
                    <p className="text-sm text-muted-foreground mb-2">{district}</p>
                  )}
                  <p className="font-medium">
                    {booking.firstname} {booking.lastname}
                  </p>
                  <p className="text-sm">Phone: {booking.phonenumber}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2">{getStatusBadge(status)}</div>
                  <p className="font-medium">{formatDateTime(bookingDate)}</p>
                  <p className="text-sm">{numberOfGuests} guests</p>
                </div>
              </div>
              
              {onCancelBooking && bookingId && status.toLowerCase() !== "cancelled" && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onCancelBooking(bookingId)}
                    disabled={disableCancelButtons}
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
