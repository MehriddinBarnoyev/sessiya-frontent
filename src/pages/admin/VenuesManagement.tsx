
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, X, Edit, Trash2, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import VenueSearch from "@/components/venues/VenueSearch";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllVenuesByAdmin, deleteVenue } from "@/services/venue-service";
import { Venue, VenueFilter } from "@/lib/types";
import { patchData } from "@/services/api-service";

const VenuesManagement = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<VenueFilter>({});

  const fetchVenues = async () => {
    setIsLoading(true);
    try {
      const response = await getAllVenuesByAdmin();
      setVenues(response.venues || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      toast.error("Failed to load venues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [currentPage, filters]);

  const handleSearch = (searchParams: VenueFilter) => {
    setFilters(searchParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-venue/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    
    try {
      await deleteVenue(id);
      toast.success("Venue deleted successfully");
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("Failed to delete venue");
    }
  };

  const toggleVenueStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Confirmed" ? "Unconfirmed" : "Confirmed";
    try {
      await patchData(`/admin/venues/${id}/confirm`, { status: newStatus });
      toast.success(`Venue status updated to ${newStatus}`);
      
      // Update local state
      setVenues(venues.map(venue => 
        venue.id === id ? { ...venue, status: newStatus as any } : venue
      ));
    } catch (error) {
      console.error("Error updating venue status:", error);
      toast.error("Failed to update venue status");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Venues Management</h1>
          <Button onClick={() => navigate('/admin/add-venue')} className="flex items-center gap-2">
            <Plus size={16} /> Add New Venue
          </Button>
        </div>

        <VenueSearch 
          onSearch={handleSearch} 
          includeStatus={true}
          className="mb-6"
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No venues found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price per seat</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.district}</TableCell>
                    <TableCell>{venue.capacity}</TableCell>
                    <TableCell>${venue.pricePerSeat}</TableCell>
                    <TableCell>{venue.phoneNumber}</TableCell>
                    <TableCell>{venue.ownerId || "No owner"}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={venue.status === "Confirmed" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleVenueStatus(venue.id, venue.status)}
                      >
                        {venue.status === "Confirmed" ? (
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <X className="h-3 w-3" /> Unconfirmed
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(venue.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(venue.id)}
                        >
                          <Trash2 size={16} />
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
          <div className="mt-6 flex justify-center">
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

export default VenuesManagement;
