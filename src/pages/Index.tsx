
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

    // Apply sorting
    if (filter.sort && filter.sort !== "default") {
      result.sort((a, b) => {
        const priceA = Number(a.pricePerSeat) || 0;
        const priceB = Number(b.pricePerSeat) || 0;
        const capacityA = Number(a.capacity) || 0;
        const capacityB = Number(b.capacity) || 0;

        switch (filter.sort) {
          case "priceAsc":
            return priceA - priceB;
          case "priceDesc":
            return priceB - priceA;
          case "capacityAsc":
            return capacityA - capacityB;
          case "capacityDesc":
            return capacityB - capacityA;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [venues, filter]);

  const handleFilterChange = (newFilter: VenueFilterType) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter,
      maxPrice: newFilter.maxPrice ?? prev.maxPrice,
      maxCapacity: newFilter.maxCapacity ?? prev.maxCapacity,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ name: filter.name });
  };

  const handleReset = () => {
    const resetFilter: VenueFilterType = {
      name: "",
      minPrice: 0,
      maxPrice,
      minCapacity: 0,
      maxCapacity,
      district: "all",
      sort: "default"
    };
    setFilter(resetFilter);
  };

  return (
    <Layout>
      {/* Premium Hero Section */}
      <section className="hero-section">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white/90 to-emerald-50/80"></div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-32 left-20 animate-float opacity-60">
          <Heart size={40} className="text-rose-300 fill-rose-300" />
        </div>
        <div className="absolute top-48 right-32 animate-float opacity-60" style={{ animationDelay: '2s' }}>
          <Sparkles size={36} className="text-amber-300" />
        </div>
        <div className="absolute bottom-40 left-32 animate-float opacity-60" style={{ animationDelay: '4s' }}>
          <Star size={32} className="text-emerald-300 fill-emerald-300" />
        </div>
        <div className="absolute top-60 left-1/2 animate-float opacity-40" style={{ animationDelay: '1s' }}>
          <Crown size={28} className="text-amber-400" />
        </div>

        <div className="hero-content section-padding">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-12 animate-fade-in-up">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
                <span className="text-gradient">Find Your Perfect</span>
                <br />
                <span className="relative inline-block">
                  Wedding Venue
                  <div className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-full opacity-60"></div>
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
                Discover enchanting venues for your special day and create memories that sparkle forever ✨
              </p>
            </div>
            
            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto mb-20 animate-scale-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search magical venues by name, location, or style..."
                  className="w-full py-8 px-8 pl-20 pr-24 rounded-3xl border-2 border-white/60 shadow-3xl focus:outline-none focus:ring-4 focus:ring-rose-200/50 focus:border-rose-300 text-gray-700 bg-white/95 backdrop-blur-md text-xl placeholder:text-gray-400 transition-all duration-500"
                  value={filter.name}
                  onChange={(e) => setFilter(prev => ({ ...prev, name: e.target.value }))}
                />
                <MapPin className="absolute left-8 top-1/2 transform -translate-y-1/2 text-rose-400" size={28} />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-rose text-white rounded-2xl px-8 py-4 hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 font-semibold text-lg"
                >
                  <Search size={24} />
                  Search
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>

            {/* Premium Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
              <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-500 group">
                <div className="w-20 h-20 bg-gradient-rose rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart size={32} className="text-white" />
                </div>
                <div className="text-4xl font-bold text-gradient mb-4">{venues.length}+</div>
                <div className="text-gray-600 font-semibold text-lg">Beautiful Venues</div>
              </div>
              <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-500 group">
                <div className="w-20 h-20 bg-gradient-sage rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users size={32} className="text-white" />
                </div>
                <div className="text-4xl font-bold text-gradient mb-4">500+</div>
                <div className="text-gray-600 font-semibold text-lg">Happy Couples</div>
              </div>
              <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-500 group">
                <div className="w-20 h-20 bg-gradient-champagne rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={32} className="text-amber-700" />
                </div>
                <div className="text-4xl font-bold text-gradient mb-4">{districts.length}+</div>
                <div className="text-gray-600 font-semibold text-lg">Locations</div>
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
      </section>
      
      <div className="container mx-auto container-padding section-padding">
        {/* Premium Filter Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="section-header">Find Your Dream Venue</h2>
            <p className="section-subheader">
              Use our intelligent filters to discover venues that perfectly match your vision, guest count, and budget for your special day.
            </p>
          </div>
          <div className="glass-card p-10 rounded-3xl">
            <VenueFilter 
              onFilterChange={handleFilterChange} 
              districts={districts}
              maxPrice={maxPrice}
              maxCapacity={maxCapacity}
            />
          </div>
        </section>

        {/* Premium Venues Section */}
        <section>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
                Available Venues
                {filteredVenues.length > 0 && (
                  <span className="text-xl text-gray-500 font-normal ml-4">
                    ({filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'} found)
                  </span>
                )}
              </h2>
              {filter.name || filter.district !== "all" ? (
                <p className="text-gray-600 text-lg">
                  Filtered results
                  {filter.name && ` for "${filter.name}"`}
                  {filter.district !== "all" && ` in ${filter.district}`}
                </p>
              ) : null}
            </div>
            
            {(filter.name || filter.district !== "all" || filter.minCapacity > 0) && (
              <button
                onClick={handleReset}
                className="btn-secondary hover:scale-105 transition-transform duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="glass-card h-96 rounded-3xl loading-shimmer"
                  style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
                >
                  <div className="h-56 bg-gray-200 rounded-t-3xl loading-skeleton"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-8 bg-gray-200 rounded-2xl w-3/4 loading-skeleton"></div>
                    <div className="h-6 bg-gray-200 rounded-2xl w-1/2 loading-skeleton"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-200 rounded-2xl loading-skeleton"></div>
                      <div className="h-16 bg-gray-200 rounded-2xl loading-skeleton"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {filteredVenues.map((venue, index) => (
                <div
                  key={venue.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VenueCard venue={venue} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-card rounded-3xl">
              <div className="max-w-lg mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-800 mb-6">No venues found</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  We couldn't find any venues matching your current search criteria. 
                  Try adjusting your filters or search terms to discover more beautiful venues.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary hover:scale-105 transition-transform duration-200"
                >
                  <Sparkles size={20} className="mr-3" />
                  Reset Filters & Browse All
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Premium Features Section */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="dashboard-card text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <MapPin size={40} className="text-rose-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-gray-800">Premium Locations</h3>
            <p className="text-gray-600 leading-relaxed text-lg">Discover venues in the most sought-after locations, from elegant ballrooms to garden pavilions, perfect for your dream wedding celebration.</p>
          </div>
          
          <div className="dashboard-card text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <Users size={40} className="text-emerald-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-gray-800">All Guest Counts</h3>
            <p className="text-gray-600 leading-relaxed text-lg">From intimate gatherings of 20 to grand celebrations of 500+, we have the perfect venue to accommodate your guest list beautifully.</p>
          </div>
          
          <div className="dashboard-card text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={40} className="text-amber-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-gray-800">Seamless Booking</h3>
            <p className="text-gray-600 leading-relaxed text-lg">Book your perfect venue with our simple, secure platform featuring real-time availability and instant confirmation for peace of mind.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
