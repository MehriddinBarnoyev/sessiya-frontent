
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import VenueCard from "@/components/venues/VenueCard";
import VenueFilter from "@/components/venues/VenueFilter";
import { Venue, VenueFilter as VenueFilterType } from "@/lib/types";
import { getPublicVenues } from "@/services/venue-service";

const Index = () => {  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getPublicVenues();
        const venuesList = data.venues || [];
        setVenues(venuesList);
        setFilteredVenues(venuesList);
        
        // Find max price and capacity
        const venueMaxPrice = Math.max(...venuesList.map(venue => venue.pricePerSeat), 0);
        const venueMaxCapacity = Math.max(...venuesList.map(venue => venue.capacity), 0);
        
        // Extract unique districts
        const uniqueDistricts = Array.from(new Set(venuesList.map(venue => venue.district)));
        setDistricts(uniqueDistricts);
        
        setMaxPrice(Math.ceil(venueMaxPrice / 100) * 100); 
        setMaxCapacity(Math.ceil(venueMaxCapacity / 100) * 100); 
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleFilterChange = async (filter: VenueFilterType) => {
    setIsLoading(true);
    try {
      const filteredData = await getPublicVenues(filter);
      setFilteredVenues(filteredData.venues || []);
    } catch (error) {
      console.error("Error filtering venues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Wedding Venue
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of beautiful wedding venues for your special day
          </p>
        </section>

        <section className="mb-10">
          <VenueFilter 
            onFilterChange={handleFilterChange} 
            districts={districts}
            maxPrice={maxPrice}
            maxCapacity={maxCapacity}
          />
        </section>

        <section>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.venueid || venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No venues found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find more options
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
