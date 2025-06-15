
import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilter from "@/components/venues/VenueFilter";
import { Venue, VenueFilter as VenueFilterType } from "@/lib/types";
import { getPublicVenues } from "@/services/venue-service";
import { Search, MapPin, Calendar, Users, Sparkles, Heart, Star, Crown, ArrowRight } from "lucide-react";

const Index = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<VenueFilterType>({
    name: "",
    minPrice: 0,
    maxPrice: 1000,
    minCapacity: 0,
    maxCapacity: 1000,
    district: "all",
    sort: "default",
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getPublicVenues();
        const venuesList = data.venues || [];
        setVenues(venuesList);
        
        // Find max price and capacity
        const venueMaxPrice = Math.max(...venuesList.map(venue => Number(venue.pricePerSeat) || 0), 0);
        const venueMaxCapacity = Math.max(...venuesList.map(venue => Number(venue.capacity) || 0), 0);
        
        // Extract unique districts
        const uniqueDistricts = Array.from(new Set(venuesList.map(venue => venue.district || ""))).filter(Boolean);
        setDistricts(uniqueDistricts);
        
        setMaxPrice(Math.ceil(venueMaxPrice / 100) * 100);
        setMaxCapacity(Math.ceil(venueMaxCapacity / 100) * 100);
        
        // Update filter with max values
        setFilter(prev => ({
          ...prev,
          maxPrice: Math.ceil(venueMaxPrice / 100) * 100,
          maxCapacity: Math.ceil(venueMaxCapacity / 100) * 100,
        }));
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = useMemo(() => {
    let result = [...venues];

    // Apply name filter (case-insensitive)
    if (filter.name) {
      const query = filter.name.toLowerCase().trim();
      result = result.filter(venue =>
        (venue.name || "").toLowerCase().includes(query) ||
        (venue.district || "").toLowerCase().includes(query)
      );
    }

    // Apply district filter
    if (filter.district && filter.district !== "all") {
      result = result.filter(venue =>
        (venue.district || "").toLowerCase() === filter.district.toLowerCase()
      );
    }

    // Apply capacity filter
    if (filter.minCapacity || filter.maxCapacity) {
      result = result.filter(venue => {
        const capacity = Number(venue.capacity) || 0;
        return capacity >= (filter.minCapacity || 0) &&
               capacity <= (filter.maxCapacity || Infinity);
      });
    }

    // Apply price filter
    if (filter.minPrice || filter.maxPrice) {
      result = result.filter(venue => {
        const price = Number(venue.pricePerSeat) || 0;
        return price >= (filter.minPrice || 0) &&
               price <= (filter.maxPrice || Infinity);
      });
    }

    // Apply sorting
    if (filter.sort === "price-low") {
      result = result.sort((a, b) => (Number(a.pricePerSeat) || 0) - (Number(b.pricePerSeat) || 0));
    } else if (filter.sort === "price-high") {
      result = result.sort((a, b) => (Number(b.pricePerSeat) || 0) - (Number(a.pricePerSeat) || 0));
    } else if (filter.sort === "capacity-low") {
      result = result.sort((a, b) => (Number(a.capacity) || 0) - (Number(b.capacity) || 0));
    } else if (filter.sort === "capacity-high") {
      result = result.sort((a, b) => (Number(b.capacity) || 0) - (Number(a.capacity) || 0));
    }

    return result;
  }, [venues, filter]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50">
        {/* Stunning Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-emerald-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-32 left-20 animate-float opacity-30">
            <Heart size={60} className="text-white fill-white" />
          </div>
          <div className="absolute top-20 right-32 animate-float opacity-20" style={{ animationDelay: '1s' }}>
            <Crown size={48} className="text-rose-200" />
          </div>
          <div className="absolute bottom-32 right-20 animate-float opacity-30" style={{ animationDelay: '2s' }}>
            <Sparkles size={52} className="text-white" />
          </div>
          <div className="absolute bottom-20 left-32 animate-float opacity-25" style={{ animationDelay: '3s' }}>
            <Star size={44} className="text-emerald-200 fill-emerald-200" />
          </div>
          
          <div className="relative py-40">
            <div className="container mx-auto px-6">
              <div className="text-center text-white max-w-6xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
                    <Heart size={40} className="text-rose-200 fill-rose-200" />
                  </div>
                  <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                    Dream Wedding Venues
                  </h1>
                </div>
                
                <p className="text-2xl md:text-3xl font-light mb-16 opacity-90 leading-relaxed max-w-4xl mx-auto">
                  Discover the perfect venue where your love story becomes a magical celebration
                </p>
                
                {/* Hero Stats */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/30 shadow-xl">
                    <div className="flex items-center gap-4">
                      <MapPin size={32} className="text-emerald-200" />
                      <div className="text-left">
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-lg opacity-90">Premium Venues</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/30 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Users size={32} className="text-rose-200" />
                      <div className="text-left">
                        <div className="text-3xl font-bold">1000+</div>
                        <div className="text-lg opacity-90">Happy Couples</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-panel bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/30 shadow-xl">
                    <div className="flex items-center gap-4">
                      <Star size={32} className="text-amber-200 fill-amber-200" />
                      <div className="text-left">
                        <div className="text-3xl font-bold">4.9</div>
                        <div className="text-lg opacity-90">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href="#venues" 
                  className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-12 py-6 rounded-3xl font-semibold text-xl border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group"
                >
                  <Search size={28} />
                  Explore Dream Venues
                  <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Elegant Wave Transition */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1200 120" className="w-full h-24 fill-white">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div id="venues" className="container mx-auto px-6 py-32">
          <div className="max-w-8xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="flex items-center justify-center mb-8">
                <div className="w-3 h-20 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-6"></div>
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-800">
                  Discover Perfect Venues
                </h2>
                <Sparkles size={40} className="ml-6 text-rose-500" />
              </div>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Browse our curated collection of premium wedding venues, each offering unique charm and elegance for your special day
              </p>
            </div>

            <div className="flex flex-col xl:flex-row gap-12">
              {/* Enhanced Filter Sidebar */}
              <div className="xl:w-80 flex-shrink-0">
                <div className="glass-card p-8 rounded-3xl shadow-3xl border border-white/60 sticky top-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-rose rounded-2xl flex items-center justify-center mr-4">
                      <Search size={24} className="text-white" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800">Find Your Venue</h3>
                  </div>
                  
                  <VenueFilter
                    filter={filter}
                    onFilterChange={setFilter}
                    districts={districts}
                    maxPrice={maxPrice}
                    maxCapacity={maxCapacity}
                  />
                </div>
              </div>

              {/* Venue Grid */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-10 glass-panel p-6 rounded-3xl border border-white/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-emerald rounded-2xl flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {filteredVenues.length} venues found
                      </h3>
                      <p className="text-gray-600">Perfect matches for your dream wedding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-emerald-600" />
                    <span>Available for booking</span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="glass-card h-96 rounded-3xl border border-white/60 animate-pulse"
                      >
                        <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredVenues.length === 0 ? (
                  <div className="text-center py-24 glass-card rounded-3xl border border-white/60">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-rose-100 to-emerald-100 rounded-full flex items-center justify-center">
                      <Search size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-gray-700 mb-4">No Venues Found</h3>
                    <p className="text-xl text-gray-500 mb-8 max-w-lg mx-auto">
                      We couldn't find any venues matching your criteria. Try adjusting your filters to discover more options.
                    </p>
                    <button
                      onClick={() => setFilter({
                        name: "",
                        minPrice: 0,
                        maxPrice: maxPrice,
                        minCapacity: 0,
                        maxCapacity: maxCapacity,
                        district: "all",
                        sort: "default",
                      })}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-emerald-500 text-white px-8 py-4 rounded-3xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <Search size={20} />
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredVenues.map((venue) => {
                      const venueIdForLink = venue.venueid || venue.id;
                      
                      const actionButtons = (
                        <div className="flex gap-2 w-full">
                          <a href={`/venue/${venueIdForLink}`} className="flex-1">
                            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-emerald-500 hover:from-rose-600 hover:to-emerald-600 text-white px-6 py-4 rounded-3xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                              <Calendar size={18} /> 
                              Book Now
                              <ArrowRight size={18} />
                            </button>
                          </a>
                        </div>
                      );
                      
                      return (
                        <VenueCard 
                          key={venue.id || venue.venueid} 
                          venue={venue} 
                          actions={actionButtons}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="py-32 bg-gradient-to-r from-rose-50 to-emerald-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="font-serif text-5xl font-bold text-gray-800 mb-6">
                Why Choose Our Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We make finding and booking your dream wedding venue simple, secure, and stress-free
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <div className="text-center glass-panel p-10 rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-rose rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Search size={32} className="text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">Easy Discovery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse our curated collection with powerful filters to find venues that match your vision and budget perfectly.
                </p>
              </div>
              
              <div className="text-center glass-panel p-10 rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-emerald rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Calendar size={32} className="text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">Instant Booking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Check real-time availability and book your dream venue instantly with our secure booking system.
                </p>
              </div>
              
              <div className="text-center glass-panel p-10 rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Star size={32} className="text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every venue is personally vetted to ensure the highest standards for your once-in-a-lifetime celebration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
