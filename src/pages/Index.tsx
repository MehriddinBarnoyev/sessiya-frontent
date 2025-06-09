import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilter from "@/components/venues/VenueFilter";
import { Venue, VenueFilter as VenueFilterType } from "@/lib/types";
import { getPublicVenues } from "@/services/venue-service";
import { Search, MapPin, Calendar, Users } from "lucide-react";

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

    // Debugging
    console.log("Filter:", filter);
    console.log("Filtered Venues:", result);

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 -z-10"></div>
        <div 
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-30" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground">
              Find Your Perfect <span className="text-accent-foreground">Wedding Venue</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Discover beautiful venues for your special day and create memories that last a lifetime
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for venues by name, district or features..."
                className="w-full py-4 px-5 pl-12 rounded-full border-2 border-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary text-primary-foreground bg-white/90 backdrop-blur-sm"
                value={filter.name}
                onChange={(e) => setFilter(prev => ({ ...prev, name: e.target.value }))}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/90 transition-colors"
              >
                <Search size={20} />
              </button>
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/60" size={20} />
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        {/* Filter Section */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-4 text-primary-foreground">Filter Venues</h2>
          <VenueFilter 
            onFilterChange={handleFilterChange} 
            districts={districts}
            maxPrice={maxPrice}
            maxCapacity={maxCapacity}
          />
        </section>

        <section>
          <h2 className="font-serif text-3xl font-bold mb-6 text-primary-foreground">Wedding Venues</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg border border-dashed border-primary/30">
              <h3 className="text-xl font-medium font-serif mb-2 text-primary-foreground">No venues found</h3>
              <p className="text-muted-foreground">
                No venues match your current filters. Try adjusting the search query, capacity, or district, or reset the filters to see all available venues.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
        
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-primary/10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-primary-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2 text-primary-foreground">Top Locations</h3>
            <p className="text-muted-foreground">Find venues in premium locations perfect for your special day</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-primary/10 text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-secondary-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2 text-primary-foreground">All Capacities</h3>
            <p className="text-muted-foreground">From intimate gatherings to grand celebrations, we have venues for all</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-primary/10 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-accent-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2 text-primary-foreground">Easy Booking</h3>
            <p className="text-muted-foreground">Simple, secure online booking with real-time availability</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;