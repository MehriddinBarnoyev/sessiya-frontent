
import React from "react";
import { Link } from "react-router-dom";
import { Venue } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import VenueCard from "./VenueCard";

interface VenueListProps {
  venues: Venue[];
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const VenueList = ({ venues, onDelete, isLoading, isAdmin = false }: VenueListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white/40 h-80 rounded-lg border border-border shadow-sm"
          >
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded-md w-3/4"></div>
              <div className="h-4 bg-muted rounded-md w-1/2"></div>
              <div className="h-4 bg-muted rounded-md w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!venues.length) {
    return (
      <div className="text-center p-12 border border-dashed border-primary/20 rounded-lg bg-white/50 backdrop-blur-sm">
        <p className="text-primary-foreground text-lg font-serif mb-2">No venues found.</p>
        <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => {
        // Use venueid or id for the link
        const venueIdForLink = venue.venueid || venue.id;
        
        const actionButtons = (
          <div className="flex gap-2 w-full">
            {/* Book Now button for users - ensure this appears for all venues */}
            {!isAdmin && (
              <Link to={`/venue/${venueIdForLink}`} className="flex-1">
                <Button variant="default" className="w-full flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                  <Calendar size={16} /> Book Now
                </Button>
              </Link>
            )}
            
            {/* Admin/Owner actions */}
            {isAdmin && (
              <>
                <Link
                  to={isAdmin ? `/admin/edit-venue/${venueIdForLink}` : `/owner/edit-venue/${venue.id || venue.venueid}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full flex items-center gap-1 border-primary-foreground/20 hover:bg-primary/5">
                    <Edit size={16} /> Edit
                  </Button>
                </Link>
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(venue.id || venue.venueid)}
                    className="flex items-center gap-1 bg-destructive/90 hover:bg-destructive"
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                )}
              </>
            )}
          </div>
        );
        
        return (
          <VenueCard 
            key={venue.id || venue.venueid} 
            venue={venue} 
            showStatus={isAdmin}
            actions={actionButtons}
          />
        );
      })}
    </div>
  );
};

export default VenueList;
