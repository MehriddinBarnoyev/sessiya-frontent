
import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilter from "@/components/venues/VenueFilter";
import { Venue, VenueFilter as VenueFilterType } from "@/lib/types";
import { getPublicVenues } from "@/services/venue-service";
import { Search, MapPin, Calendar, Users, Star } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4">
              Wedding Venue Booking
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Find and book the perfect venue for your special day. Browse our collection of beautiful wedding venues.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border">
                <MapPin size={16} className="text-emerald-600" />
                <span className="font-medium">50+ Venues</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border">
                <Users size={16} className="text-blue-600" />
                <span className="font-medium">1000+ Happy Couples</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border">
                <Star size={16} className="text-gray-600" />
                <span className="font-medium">4.9 Average Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Your Perfect Venue</h2>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="xl:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-4">
                <div className="flex items-center mb-4">
                  <Search size={20} className="mr-2 text-gray-400" />
                  <h3 className="font-medium text-gray-800">Search Filters</h3>
                </div>
                
                <VenueFilter
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
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  <span className="font-medium text-gray-800">
                    {filteredVenues.length} venues found
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-emerald-600" />
                  <span>Available for booking</span>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="bg-white h-80 rounded-lg border shadow-sm animate-pulse"
                    >
                      <div className="h-full bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : filteredVenues.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Venues Found</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    We couldn't find any venues matching your criteria. Try adjusting your filters.
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
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
                  >
                    <Search size={16} />
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => {
                    const venueIdForLink = venue.venueid || venue.id;
                    
                    const actionButtons = (
                      <div className="w-full">
                        <a href={`/venue/${venueIdForLink}`} className="block">
                          <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                            <Calendar size={16} /> 
                            Book Now
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

        {/* Features Section */}
        <div className="py-16 bg-white border-t">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Why Choose Our Platform
              </h2>
              <p className="text-gray-600">
                We make finding and booking your dream wedding venue simple and secure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search size={20} className="text-emerald-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Easy Search</h3>
                <p className="text-gray-600 text-sm">
                  Browse venues with powerful filters to find exactly what you need.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Instant Booking</h3>
                <p className="text-gray-600 text-sm">
                  Check availability and book your venue instantly with our secure system.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star size={20} className="text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Quality Venues</h3>
                <p className="text-gray-600 text-sm">
                  Every venue is vetted to ensure the highest standards for your day.
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
