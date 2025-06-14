
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Venue } from "@/lib/types";
import { Users, MapPin, DollarSign, Star, Calendar, Heart, Sparkles } from "lucide-react";

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
    <Card className="venue-card h-full flex flex-col group">
      <Link to={`/venue/${venueIdForLink}`} className="block overflow-hidden relative">
        <div className="aspect-[4/3] overflow-hidden rounded-t-3xl relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          
          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Floating Rating Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-gray-800">4.9</span>
            </div>
          </div>
          
          {/* Favorite Heart */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 cursor-pointer">
            <Heart size={20} className="text-rose-500 hover:fill-rose-500 transition-all duration-300" />
          </div>
          
          {/* Status Badge */}
          {showStatus && status && (
            <div className="absolute top-4 right-20">
              <div className={`px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg backdrop-blur-sm ${
                status === "Confirmed" 
                  ? "bg-emerald-100/90 text-emerald-800 border border-emerald-200" 
                  : "bg-amber-100/90 text-amber-800 border border-amber-200"
              }`}>
                {status}
              </div>
            </div>
          )}
          
          {/* Premium Price Tag */}
          <div className="absolute bottom-4 right-4 bg-gradient-rose text-white rounded-2xl px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span className="font-bold">${priceperseat || pricePerSeat}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="flex-grow p-8 relative z-10">
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-bold mb-3 text-gray-800 line-clamp-1 group-hover:text-rose-700 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin size={16} className="mr-2 text-rose-400" />
            <span className="font-medium">{district}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Users size={18} className="text-rose-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{capacity}</div>
                <div className="text-sm text-gray-500">Guests</div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">${priceperseat || pricePerSeat}</div>
                <div className="text-sm text-gray-500">Per seat</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {actions && (
        <CardFooter className="border-t border-rose-100/50 p-6 bg-gradient-to-r from-rose-25 to-emerald-25">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
};

export default VenueCard;
