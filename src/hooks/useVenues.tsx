
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Venue, VenueFilter, VenueListResponse } from "@/lib/types";
import { getAllVenuesByAdmin, getPublicVenues } from "@/services/venue-service";
import { getRole } from "@/lib/auth";

interface UseVenuesResult {
  venues: Venue[];
  isLoading: boolean;
  error: unknown;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: VenueFilter) => void;
  filters: VenueFilter;
}

export const useVenues = (initialPage = 1, initialFilters = {}): UseVenuesResult => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<VenueFilter>(initialFilters);
  const role = getRole();

  // Use the appropriate API endpoint based on user role
  const { isLoading, error, data } = useQuery({
    queryKey: ["venues", currentPage, filters],
    queryFn: () => {
      // If user is not authenticated or is a regular user, use public venues API
      if (!role) {
        return getPublicVenues(filters);
      }
      // For admin/owner, use the admin venues API
      return getAllVenuesByAdmin();
    }
  });

  useEffect(() => {
    if (data) {
      // Handle both array and object with venues property
      const venueData = Array.isArray(data) ? data : data.venues || [];
      setVenues(venueData);
      
      // Handle totalPages if available
      if (data && typeof data === 'object' && 'totalPages' in data) {
        setTotalPages(data.totalPages || 1);
      }
    }
  }, [data]);
  
  return {
    venues,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    setFilters,
    filters,
  };
};
