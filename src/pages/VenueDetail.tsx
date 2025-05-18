
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageGallery from "@/components/venues/ImageGallery";
import BookingForm from "@/components/bookings/BookingForm";
import EnhancedCalendar from "@/components/venues/EnhancedCalendar";
import { getVenueById, getVenueBookedDates } from "@/services/venue-service";
import { Venue } from "@/lib/types";
import { toast } from "sonner";
import { MapPin, Users, DollarSign, Clock, CalendarCheck, Info } from "lucide-react";

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
    console.log("Date selected:", date);
    setSelectedDate(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!venue) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-8 border border-primary/20 shadow-sm">
            <h1 className="text-2xl font-serif font-medium mb-4 text-primary-foreground">Venue not found</h1>
            <p className="text-muted-foreground mb-6">
              The venue you're looking for doesn't exist or has been removed.
            </p>
            <a href="/" className="text-primary-foreground hover:underline font-medium">
              Browse other venues
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center md:text-left bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              {venue.name}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-center md:justify-start text-muted-foreground">
              <div className="flex items-center">
                <MapPin size={18} className="mr-1.5 text-primary-foreground/70" />
                <span>{venue.district}</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center">
                <Users size={18} className="mr-1.5 text-primary-foreground/70" />
                <span>Up to {venue.capacity} guests</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center">
                <DollarSign size={18} className="mr-1.5 text-primary-foreground/70" />
                <span>${venue.priceperseat || venue.pricePerSeat} per seat</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            {venue.photos && <ImageGallery images={venue.photos} alt={venue.name} />}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6 mb-12">
            <div className="flex items-center mb-4">
              <Info size={20} className="mr-2 text-primary-foreground" />
              <h2 className="text-2xl font-serif font-semibold text-primary-foreground">About This Venue</h2>
            </div>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{venue.description}</p>
            
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <MapPin size={20} className="mr-2 text-primary-foreground" />
                <h3 className="text-xl font-serif font-medium text-primary-foreground">Location</h3>
              </div>
              <p className="bg-muted/50 p-4 rounded-lg text-muted-foreground border border-muted">{venue.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary/10">
              <div className="flex items-center mb-6">
                <CalendarCheck size={20} className="mr-2 text-primary-foreground" />
                <h2 className="text-2xl font-serif font-semibold text-primary-foreground">Availability Calendar</h2>
              </div>
              <div className="p-2 bg-muted/30 rounded-lg border border-muted">
                <EnhancedCalendar
                  venueId={venue.venueid || id!}
                  bookedDates={bookedDates}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-secondary rounded-full mr-2"></div>
                  <span className="text-sm text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-destructive rounded-full mr-2"></div>
                  <span className="text-sm text-muted-foreground">Already Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-muted rounded-full mr-2"></div>
                  <span className="text-sm text-muted-foreground">Past Date</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-accent rounded-full mr-2"></div>
                  <span className="text-sm text-muted-foreground">Selected Date</span>
                </div>
              </div>
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
