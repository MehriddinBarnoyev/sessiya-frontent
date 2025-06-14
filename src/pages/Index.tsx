import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilter from "@/components/venues/VenueFilter";
import { Venue, VenueFilter as VenueFilterType } from "@/lib/types";
import { getPublicVenues } from "@/services/venue-service";
import { Search, MapPin, Calendar, Users, Sparkles, Heart, Star } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with elegant patterns */}
        <div className="absolute inset-0 hero-gradient"></div>
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <Heart size={32} className="text-rose-300 fill-rose-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles size={28} className="text-amber-300 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <Star size={24} className="text-emerald-300 fill-emerald-300 opacity-60" />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient leading-tight">
                Find Your Perfect <br />
                <span className="relative">
                  Wedding Venue
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full"></div>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover enchanting venues for your special day and create memories that sparkle forever ✨
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16 animate-slide-up">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search magical venues by name, location, or style..."
                  className="w-full py-6 px-6 pl-16 pr-20 rounded-2xl border-2 border-white/50 shadow-elegant focus:outline-none focus:ring-4 focus:ring-rose-200/50 focus:border-rose-300 text-gray-700 bg-white/90 backdrop-blur-md text-lg placeholder:text-gray-400"
                  value={filter.name}
                  onChange={(e) => setFilter(prev => ({ ...prev, name: e.target.value }))}
                />
                <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-rose-400" size={24} />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-rose text-white rounded-xl px-6 py-3 hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </form>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in">
              <div className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">{venues.length}+</div>
                <div className="text-gray-600 font-medium">Beautiful Venues</div>
              </div>
              <div className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">500+</div>
                <div className="text-gray-600 font-medium">Happy Couples</div>
              </div>
              <div className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-gradient mb-2">{districts.length}+</div>
                <div className="text-gray-600 font-medium">Locations</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elegant wave transition */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="w-full h-12 fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        {/* Filter Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="section-header">Find Your Dream Venue</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Use our smart filters to discover venues that match your vision, guest count, and budget perfectly.
            </p>
          </div>
          <div className="glass-card p-8 rounded-2xl">
            <VenueFilter 
              onFilterChange={handleFilterChange} 
              districts={districts}
              maxPrice={maxPrice}
              maxCapacity={maxCapacity}
            />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                Available Venues
                {filteredVenues.length > 0 && (
                  <span className="text-lg text-gray-500 font-normal ml-3">
                    ({filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'} found)
                  </span>
                )}
              </h2>
              {filter.name || filter.district !== "all" ? (
                <p className="text-gray-600">
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
                  className="glass-card h-80 rounded-2xl animate-shimmer"
                  style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                >
                  <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
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
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VenueCard venue={venue} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">No venues found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We couldn't find any venues matching your current search criteria. 
                  Try adjusting your filters or search terms to discover more beautiful venues.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary hover:scale-105 transition-transform duration-200"
                >
                  <Sparkles size={16} className="mr-2" />
                  Reset Filters & Browse All
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Features Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="dashboard-card text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin size={32} className="text-rose-600" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-4 text-gray-800">Premium Locations</h3>
            <p className="text-gray-600 leading-relaxed">Discover venues in the most sought-after locations, from elegant ballrooms to garden pavilions, perfect for your dream wedding.</p>
          </div>
          
          <div className="dashboard-card text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} className="text-emerald-600" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-4 text-gray-800">All Guest Counts</h3>
            <p className="text-gray-600 leading-relaxed">From intimate gatherings of 20 to grand celebrations of 500+, we have the perfect venue to accommodate your guest list.</p>
          </div>
          
          <div className="dashboard-card text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={32} className="text-amber-600" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-4 text-gray-800">Seamless Booking</h3>
            <p className="text-gray-600 leading-relaxed">Book your perfect venue with our simple, secure platform featuring real-time availability and instant confirmation.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
