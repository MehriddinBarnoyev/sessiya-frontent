
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageGallery from "@/components/venues/ImageGallery";
import BookingForm from "@/components/bookings/BookingForm";
import EnhancedCalendar from "@/components/venues/EnhancedCalendar";
import { getVenueById, getVenueBookedDates } from "@/services/venue-service";
import { Venue } from "@/lib/types";
import { toast } from "sonner";

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const venueData = await getVenueById(id);
        setVenue(venueData.venue);

        // Fetch booked dates
        try {
          const bookedDatesData = await getVenueBookedDates(id);
          setBookedDates(bookedDatesData || []);
        } catch (error) {
          console.error("Error fetching booked dates:", error);
          toast.error("Could not load unavailable dates");
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
        toast.error("Error loading venue details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  const handleBookingSuccess = async () => {
    if (!id) return;

    try {
      // Refresh booked dates after successful booking
      const bookedDatesData = await getVenueBookedDates(id);
      setBookedDates(bookedDatesData || []);
      setSelectedDate("");  // Clear selected date after booking
      toast.success("Booking successful. The date is now marked as booked.");
    } catch (error) {
      console.error("Error refreshing booked dates:", error);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!venue) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-2">Venue not found</h1>
            <p className="text-muted-foreground mb-6">
              The venue you're looking for doesn't exist or has been removed.
            </p>
            <a href="/" className="text-primary-foreground hover:underline">
              Back to venues
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("Venue data:", venue);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              {venue.name}
            </h1>
            <p className="text-muted-foreground">
              {venue.district} • Capacity: {venue.capacity} guests • ${venue.priceperseat || venue.pricePerSeat} per seat
            </p>
          </div>

          {venue.photos && <ImageGallery images={venue.photos} alt={venue.name} />}

          <div className="mt-8">
            <h2 className="text-2xl font-serif font-semibold mb-4">About This Venue</h2>
            <p className="whitespace-pre-line">{venue.description}</p>
          </div>

          <div className="my-8">
            <h2 className="text-2xl font-serif font-semibold mb-4">Location</h2>
            <p className="bg-muted p-4 rounded-lg">{venue.address}</p>
          </div>

          <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-serif font-semibold mb-6">Availability Calendar</h2>
              <EnhancedCalendar
                venueId={venue.venueid || id}
                bookedDates={bookedDates}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>

            <div>
              <BookingForm
                venue={venue}
                bookedDates={bookedDates}
                onSuccess={handleBookingSuccess}
                preselectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VenueDetail;
