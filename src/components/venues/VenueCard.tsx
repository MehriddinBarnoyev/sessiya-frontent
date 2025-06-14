
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Venue } from "@/lib/types";
import { Users, MapPin, DollarSign, Star, Calendar } from "lucide-react";

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
        <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Floating elements */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-gray-700">4.9</span>
            </div>
          </div>
          
          {showStatus && status && (
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${
                status === "Confirmed" 
                  ? "status-confirmed" 
                  : "status-pending"
              }`}>
                {status}
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <Calendar size={16} className="text-rose-600" />
          </div>
        </div>
      </Link>
      
      <CardContent className="flex-grow p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl font-bold mb-2 text-gray-800 line-clamp-1 group-hover:text-rose-700 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin size={14} className="mr-1 text-rose-400" />
            <span className="text-sm font-medium">{district}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 bg-rose-50 rounded-xl p-3">
            <Users size={16} className="text-rose-600" />
            <div>
              <div className="text-sm font-semibold text-gray-800">{capacity}</div>
              <div className="text-xs text-gray-500">Guests</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
            <DollarSign size={16} className="text-emerald-600" />
            <div>
              <div className="text-sm font-semibold text-gray-800">${priceperseat || pricePerSeat}</div>
              <div className="text-xs text-gray-500">Per seat</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {actions && (
        <CardFooter className="border-t border-rose-100 p-4 bg-gradient-to-r from-rose-50/50 to-emerald-50/50">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
};

export default VenueCard;
