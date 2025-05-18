
import React from "react";
import { Link } from "react-router-dom";
import { Venue } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";

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
            className="bg-muted h-64 rounded-lg border border-border"
          ></div>
        ))}
      </div>
    );
  }

  if (!venues.length) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No venues found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => {
        // Use venueid or id for the link
        const venueIdForLink = venue.venueid || venue.id;
        
        // Handle both photourl and photos array for image display
        let imageUrl = "/placeholder.svg";
        if (venue.photos && venue.photos.length > 0) {
          imageUrl = `http://localhost:5000/uploads/${venue.photos[0]}`;
        } else if (venue.photourl) {
          imageUrl = `http://localhost:5000/uploads/${venue.photourl}`;
        }
        
        return (
          <div
            key={venue.id || venue.venueid}
            className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-muted relative">
              <Link to={`/venue/${venueIdForLink}`}>
                <img
                  src={imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </Link>
              {isAdmin && venue.status && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={venue.status === "Confirmed" ? "default" : "outline"}
                  >
                    {venue.status}
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-medium mb-1">{venue.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {venue.district} • Capacity: {venue.capacity} • ${venue.priceperseat || venue.pricePerSeat}/seat
              </p>

              <div className="flex gap-2 mt-4">
                {/* Book Now button for users - ensure this appears for all venues */}
                {!isAdmin && (
                  <Link to={`/venue/${venueIdForLink}`} className="flex-1">
                    <Button variant="default" className="w-full flex items-center gap-1">
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
                      <Button variant="outline" className="w-full flex items-center gap-1">
                        <Edit size={16} /> Edit
                      </Button>
                    </Link>
                    {onDelete && (
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(venue.id || venue.venueid)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VenueList;
