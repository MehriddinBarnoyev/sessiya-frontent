
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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-xl font-medium text-gray-700">Loading venue details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!venue) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold mb-4 text-gray-800">Venue not found</h1>
            <p className="text-gray-600 mb-6">
              The venue you're looking for doesn't exist or has been removed.
            </p>
            <a href="/" className="inline-block bg-gradient-to-r from-rose-500 to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
              Browse other venues
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-emerald-600 py-20">
            <div className="container mx-auto px-6">
              <div className="text-center text-white">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                  {venue.name}
                </h1>
                <div className="flex flex-wrap justify-center gap-6 text-lg">
                  <div className="flex items-center bg-white/20 rounded-2xl px-4 py-2">
                    <MapPin size={20} className="mr-2" />
                    <span>{venue.district}</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-2xl px-4 py-2">
                    <Users size={20} className="mr-2" />
                    <span>Up to {venue.capacity} guests</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-2xl px-4 py-2">
                    <DollarSign size={20} className="mr-2" />
                    <span>${venue.priceperseat || venue.pricePerSeat} per seat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Image Gallery */}
            {venue.photos && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-12">
                <ImageGallery images={venue.photos} alt={venue.name} />
              </div>
            )}

            {/* About Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="w-2 h-12 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-4"></div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">About This Venue</h2>
              </div>
              <p className="whitespace-pre-line text-gray-700 leading-relaxed text-lg mb-8">{venue.description}</p>
              
              <div className="bg-gradient-to-r from-rose-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <MapPin size={24} className="mr-3 text-rose-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Location</h3>
                </div>
                <p className="text-gray-700 text-lg">{venue.address}</p>
              </div>
            </div>

            {/* Calendar and Booking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar Section */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-12 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-serif font-bold text-gray-800">Availability Calendar</h2>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                  <EnhancedCalendar
                    venueId={venue.venueid || id!}
                    bookedDates={bookedDates}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Booked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Past Date</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-rose-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Selected</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
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
      </div>
    </Layout>
  );
};

export default VenueDetail;
