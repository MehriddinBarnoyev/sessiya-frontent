
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Venue } from "@/lib/types";
import { Users, MapPin, DollarSign } from "lucide-react";

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
    <Card className="venue-card h-full flex flex-col group transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/venue/${venueIdForLink}`} className="block overflow-hidden relative rounded-t-lg">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        {showStatus && status && (
          <div 
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
              status === "Confirmed" 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {status}
          </div>
        )}
      </Link>
      
      <CardContent className="flex-grow p-5">
        <h3 className="font-serif text-xl font-semibold mb-3 line-clamp-1 text-primary-foreground">{name}</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center text-muted-foreground">
            <MapPin size={16} className="mr-2 text-primary-foreground/70" />
            <span>{district}</span>
          </p>
          <p className="flex items-center text-muted-foreground">
            <Users size={16} className="mr-2 text-primary-foreground/70" /> 
            <span>Up to {capacity} guests</span>
          </p>
          <p className="flex items-center text-muted-foreground">
            <DollarSign size={16} className="mr-2 text-primary-foreground/70" />
            <span>${priceperseat || pricePerSeat} per seat</span>
          </p>
        </div>
      </CardContent>
      
      {actions && (
        <CardFooter className="border-t p-4 bg-card/50">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
};

export default VenueCard;
