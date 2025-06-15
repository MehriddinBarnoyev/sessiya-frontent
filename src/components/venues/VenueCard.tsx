
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Venue } from "@/lib/types";
import { Users, MapPin, DollarSign, Star } from "lucide-react";

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
    <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col">
      <Link to={`/venue/${venueIdForLink}`} className="block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          
          {/* Status Badge */}
          {showStatus && status && (
            <div className="absolute top-3 right-3">
              <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                status === "Confirmed" 
                  ? "bg-emerald-100 text-emerald-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {status}
              </div>
            </div>
          )}
          
          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white rounded-md px-3 py-1">
            <div className="flex items-center gap-1 text-sm font-medium">
              <DollarSign size={14} />
              <span>{priceperseat || pricePerSeat}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="flex-grow p-4">
        <div className="mb-3">
          <h3 className="font-medium text-lg text-gray-800 mb-1 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{district}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users size={14} className="text-emerald-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{capacity}</div>
                <div className="text-xs text-gray-600">Guests</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Star size={14} className="text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">4.9</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>
          </div>
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
