
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageGallery from "@/components/venues/ImageGallery";
import BookingForm from "@/components/bookings/BookingForm";
import EnhancedCalendar from "@/components/venues/EnhancedCalendar";
import { getVenueById, getVenueBookedDates } from "@/services/venue-service";
import { Venue } from "@/lib/types";
import { toast } from "sonner";
import { MapPin, Users, DollarSign, Star } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading venue details...</h2>
              <p className="text-gray-600">Please wait while we prepare your venue information</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!venue) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg p-8 shadow-sm border max-w-md mx-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-3 text-gray-800">Venue Not Found</h1>
            <p className="text-gray-600 mb-6">
              The venue you're looking for doesn't exist or has been removed.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Browse Other Venues
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{venue.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} className="text-gray-400" />
                <span>{venue.district}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} className="text-gray-400" />
                <span>Up to {venue.capacity} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-gray-400" />
                <span>${venue.priceperseat || venue.pricePerSeat} per seat</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-gray-400" />
                <span>4.9 rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Image Gallery */}
          {venue.photos && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Venue Gallery</h2>
              <ImageGallery images={venue.photos} alt={venue.name} />
            </div>
          )}

          {/* About Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Venue</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
                  {venue.description}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="mr-2 text-gray-400" />
                    <h3 className="font-medium text-gray-800">Location</h3>
                  </div>
                  <p className="text-gray-700">{venue.address}</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">{venue.capacity}</div>
                  <div className="text-sm text-gray-600">Maximum Guests</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">${venue.priceperseat || venue.pricePerSeat}</div>
                  <div className="text-sm text-gray-600">Per Seat</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star size={20} className="text-gray-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">4.9</div>
                  <div className="text-sm text-gray-600">Guest Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and Booking */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Availability Calendar</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                <EnhancedCalendar
                  venueId={venue.venueid || id!}
                  bookedDates={bookedDates}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
                  <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-gray-700">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  <span className="text-gray-700">Past Date</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-emerald-500 rounded mr-2"></div>
                  <span className="text-gray-700">Selected</span>
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
    </Layout>
  );
};

export default VenueDetail;
