
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Venue } from "@/lib/types";

interface VenueCardProps {
  venue: Venue;
  showStatus?: boolean;
  actions?: React.ReactNode;
}

const VenueCard = ({ venue, showStatus = false, actions }: VenueCardProps) => {
  const { venueid, name, capacity, priceperseat, pricePerSeat, district, photourl, photos, status } = venue;
  
  // Handle both photourl and photos array
  let imageUrl = "";
  if (photourl) {
    imageUrl = `http://localhost:5000/uploads/${photourl}`;
  } else if (photos && photos.length > 0) {
    imageUrl = `http://localhost:5000/uploads/${photos[0]}`;
  }

  // Use venueid or id for the link
  const venueIdForLink = venueid || venue.id;

  return (
    <Card className="venue-card h-full flex flex-col">
      <Link to={`/venue/${venueIdForLink}`} className="block overflow-hidden relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        {showStatus && status && (
          <div 
            className={`absolute top-2 right-2 px-3 py-1 rounded text-xs font-medium ${
              status === "Confirmed" 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-amber-200 text-amber-800"
            }`}
          >
            {status}
          </div>
        )}
      </Link>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-1">{name}</h3>
        <div className="space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="text-muted-foreground">District:</span>
            <span className="font-medium">{district}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{capacity} guests</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Price per seat:</span>
            <span className="font-medium">${priceperseat || pricePerSeat}</span>
          </p>
        </div>
      </CardContent>
      
      {actions && (
        <CardFooter className="border-t p-4">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
};

export default VenueCard;
