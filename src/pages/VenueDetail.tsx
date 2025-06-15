
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageGallery from "@/components/venues/ImageGallery";
import BookingForm from "@/components/bookings/BookingForm";
import EnhancedCalendar from "@/components/venues/EnhancedCalendar";
import { getVenueById, getVenueBookedDates } from "@/services/venue-service";
import { Venue } from "@/lib/types";
import { toast } from "sonner";
import { MapPin, Users, DollarSign, Clock, CalendarCheck, Info, Star, Heart, Sparkles } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
          {/* Hero Skeleton */}
          <div className="bg-gradient-to-r from-rose-500 to-emerald-600 py-20">
            <div className="container mx-auto px-6">
              <div className="text-center text-white animate-pulse">
                <div className="h-12 bg-white/20 rounded-3xl mx-auto mb-6 max-w-lg"></div>
                <div className="flex justify-center gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-12 w-32 bg-white/20 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-rose-500 border-t-transparent mx-auto mb-8"></div>
              <div className="glass-card p-12 rounded-3xl max-w-md mx-auto">
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Loading venue details...</h2>
                <p className="text-gray-600">Please wait while we prepare your venue information</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!venue) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 flex items-center justify-center">
          <div className="text-center glass-card rounded-3xl p-16 shadow-3xl border border-white/50 max-w-2xl mx-6">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-6 text-gray-800">Venue Not Found</h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              The venue you're looking for doesn't exist or has been removed from our collection.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-emerald-500 text-white px-10 py-4 rounded-3xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Heart size={20} />
              Discover Other Venues
              <Sparkles size={20} />
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        {/* Elegant Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-emerald-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-20 left-20 animate-float opacity-30">
            <Heart size={40} className="text-white fill-white" />
          </div>
          <div className="absolute bottom-20 right-20 animate-float opacity-30" style={{ animationDelay: '2s' }}>
            <Sparkles size={36} className="text-white" />
          </div>
          
          <div className="relative py-32">
            <div className="container mx-auto px-6">
              <div className="text-center text-white max-w-5xl mx-auto">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  {venue.name}
                </h1>
                <p className="text-xl md:text-2xl font-light mb-12 opacity-90">
                  Where dreams become magical memories
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 text-lg">
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <MapPin size={24} className="text-rose-200" />
                      <span className="font-semibold">{venue.district}</span>
                    </div>
                  </div>
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <Users size={24} className="text-emerald-200" />
                      <span className="font-semibold">Up to {venue.capacity} guests</span>
                    </div>
                  </div>
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-4 border border-white/30">
                    <div className="flex items-center gap-3">
                      <DollarSign size={24} className="text-blue-200" />
                      <span className="font-semibold">${venue.priceperseat || venue.pricePerSeat} per seat</span>
                    </div>
                  </div>
                </div>
                
                {/* Rating Display */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={24} className="text-amber-300 fill-amber-300" />
                  ))}
                  <span className="ml-3 text-xl font-semibold">4.9 out of 5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Elegant Wave Transition */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1200 120" className="w-full h-20 fill-white">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Premium Image Gallery */}
            {venue.photos && (
              <div className="glass-card p-10 mb-16 rounded-3xl shadow-3xl border border-white/60">
                <div className="flex items-center mb-8">
                  <div className="w-3 h-16 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-6"></div>
                  <h2 className="text-4xl font-serif font-bold text-gray-800">Venue Gallery</h2>
                  <Sparkles size={32} className="ml-4 text-rose-500" />
                </div>
                <ImageGallery images={venue.photos} alt={venue.name} />
              </div>
            )}

            {/* Elegant About Section */}
            <div className="glass-card p-10 mb-16 rounded-3xl shadow-3xl border border-white/60">
              <div className="flex items-center mb-8">
                <div className="w-3 h-16 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-6"></div>
                <h2 className="text-4xl font-serif font-bold text-gray-800">About This Venue</h2>
                <Info size={32} className="ml-4 text-emerald-500" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed text-lg mb-8 font-light">
                    {venue.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-emerald-50 rounded-3xl p-8 border border-rose-100">
                    <div className="flex items-center mb-6">
                      <MapPin size={28} className="mr-4 text-rose-600" />
                      <h3 className="text-2xl font-serif font-semibold text-gray-800">Location Details</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{venue.address}</p>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-rose-100 text-center">
                    <div className="w-16 h-16 bg-gradient-rose rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users size={28} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{venue.capacity}</div>
                    <div className="text-gray-600 font-medium">Maximum Guests</div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-3xl border border-emerald-100 text-center">
                    <div className="w-16 h-16 bg-gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <DollarSign size={28} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">${venue.priceperseat || venue.pricePerSeat}</div>
                    <div className="text-gray-600 font-medium">Per Seat</div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-3xl border border-blue-100 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Star size={28} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">4.9</div>
                    <div className="text-gray-600 font-medium">Guest Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar and Booking Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Elegant Calendar Section */}
              <div className="glass-card p-10 rounded-3xl shadow-3xl border border-white/60">
                <div className="flex items-center mb-8">
                  <div className="w-3 h-16 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-6"></div>
                  <h2 className="text-3xl font-serif font-bold text-gray-800">Availability Calendar</h2>
                  <CalendarCheck size={28} className="ml-4 text-emerald-500" />
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-8 border border-gray-200">
                  <EnhancedCalendar
                    venueId={venue.venueid || id!}
                    bookedDates={bookedDates}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                </div>
                
                {/* Premium Legend */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center bg-white/80 rounded-2xl p-4 border border-emerald-100">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full mr-3 shadow-lg"></div>
                    <span className="font-semibold text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center bg-white/80 rounded-2xl p-4 border border-red-100">
                    <div className="w-6 h-6 bg-red-500 rounded-full mr-3 shadow-lg"></div>
                    <span className="font-semibold text-gray-700">Booked</span>
                  </div>
                  <div className="flex items-center bg-white/80 rounded-2xl p-4 border border-gray-200">
                    <div className="w-6 h-6 bg-gray-400 rounded-full mr-3 shadow-lg"></div>
                    <span className="font-semibold text-gray-700">Past Date</span>
                  </div>
                  <div className="flex items-center bg-white/80 rounded-2xl p-4 border border-rose-200">
                    <div className="w-6 h-6 border-4 border-rose-500 rounded-full mr-3"></div>
                    <span className="font-semibold text-gray-700">Selected</span>
                  </div>
                </div>
              </div>

              {/* Premium Booking Form */}
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
