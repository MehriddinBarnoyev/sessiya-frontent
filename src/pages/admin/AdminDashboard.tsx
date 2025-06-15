
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VenueSearch from "@/components/venues/VenueSearch";
import { Pagination } from "@/components/ui/pagination";
import { useVenues } from "@/hooks/useVenues";
import { useVenueDelete } from "@/hooks/useVenueDelete";
import { VenueFilter, Venue } from "@/lib/types";
import { getAllVenuesByAdmin } from "@/services/venue-service";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Edit, Trash2 } from "lucide-react";
import { patchData } from "@/services/api-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const {  
    isLoading: hookLoading, 
    error, 
    totalPages, 
    currentPage, 
    setCurrentPage, 
    setFilters 
  } = useVenues();
  
  const { handleDelete } = useVenueDelete();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (searchParams: VenueFilter) => {
    setFilters(searchParams);
    setCurrentPage(1);
  };
  
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const response = await getAllVenuesByAdmin();
        
        // Check if response.venues exists, otherwise use an empty array
        const venuesList = response?.venues || [];
        console.log(venuesList, 'venues var');
        
        setVenues(venuesList);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-venue/${id}`);
  };

  const handleConfirmVenue = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Confirmed" ? "Unconfirmed" : "Confirmed";
      await patchData(`/admin/venues/${id}/confirm`, { status: newStatus });
      toast.success(`Venue ${newStatus}`);
      
      // Update venues in state
      setVenues(venues.map(venue => {
        if (venue.id === id) {
          return { ...venue, status: newStatus };
        }
        return venue;
      }));
    } catch (error) {
      console.error("Failed to update venue status:", error);
      toast.error("Failed to update venue status");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-8 text-center mt-16">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage venues, bookings, and owners
          </p>
        </section>

        {/* <VenueSearch onSearch={handleSearch} includeStatus={true} /> */}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">Venues</h2>
          <Button
            onClick={() => navigate('/admin/add-venue')}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-foreground transition-colors"
          >
            Add Venue
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-muted h-16 rounded-lg border border-border"
              ></div>
            ))}
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No venues found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner name</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price per Seat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>{venue.owner_name}</TableCell>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.district}</TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>${venue.priceperseat}</TableCell>
                    <TableCell>
                      <Badge variant={venue.status === "Confirmed" ? "default" : "outline"}>
                        {venue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(venue.venueid)}
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(venue.venueid)}
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                        <Button 
                          size="sm" 
                          variant={venue.status === "Confirmed" ? "default" : "secondary"}
                          onClick={() => handleConfirmVenue(venue.venueid, venue.status)}
                        >
                          <Check size={16} className="mr-1" /> 
                          {venue.status === "Confirmed" ? "Confirmed" : "Confirm"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
