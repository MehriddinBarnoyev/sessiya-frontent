
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRole, logout } from "@/lib/auth";
import { Menu, X, Heart, Sparkles } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = getRole();
    setRole(userRole);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-white/90 backdrop-blur-md shadow-elegant border-b border-white/50" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Heart size={24} className="text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-400 animate-pulse-soft" />
            </div>
            <span className="text-2xl font-serif font-bold text-gradient hover:scale-105 transition-transform duration-300">
              Wedding Venues
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm text-rose-600 hover:bg-rose-50 border border-white/50 shadow-md transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Guest Navigation */}
            {!role && (
              <>
                <Link to="/" className="nav-link hover:scale-105 transition-transform duration-200">
                  Home
                </Link>
                <Link to="/my-bookings" className="nav-link hover:scale-105 transition-transform duration-200">
                  My Bookings
                </Link>
                <Link to="/login">
                  <Button className="btn-primary hover:scale-105 transition-transform duration-200">
                    <Sparkles size={16} className="mr-2" />
                    Login
                  </Button>
                </Link>
              </>
            )}

            {/* Owner Navigation */}
            {role === "owner" && (
              <>
                <Link to="/owner/dashboard" className="nav-link hover:scale-105 transition-transform duration-200">
                  Dashboard
                </Link>
                <Link to="/owner/add-venue" className="nav-link hover:scale-105 transition-transform duration-200">
                  Add Venue
                </Link>
                <Link to="/owner/bookings" className="nav-link hover:scale-105 transition-transform duration-200">
                  My Bookings
                </Link>
                <Button className="btn-secondary hover:scale-105 transition-transform duration-200" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin Navigation */}
            {role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="nav-link hover:scale-105 transition-transform duration-200">
                  Dashboard
                </Link>
                <Link to="/admin/add-venue" className="nav-link hover:scale-105 transition-transform duration-200">
                  Add Venue
                </Link>
                <Link to="/admin/bookings" className="nav-link hover:scale-105 transition-transform duration-200">
                  Bookings
                </Link>
                <Link to="/admin/owners" className="nav-link hover:scale-105 transition-transform duration-200">
                  Owners
                </Link>
                <Button className="btn-secondary hover:scale-105 transition-transform duration-200" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden">
            <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-md shadow-elegant border-l border-white/50">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-serif text-xl font-bold text-gradient">Menu</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {/* Guest Navigation */}
                  {!role && (
                    <>
                      <Link 
                        to="/" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link 
                        to="/login" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </>
                  )}

                  {/* Owner Navigation */}
                  {role === "owner" && (
                    <>
                      <Link 
                        to="/owner/dashboard" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/owner/add-venue" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add Venue
                      </Link>
                      <Link 
                        to="/owner/bookings" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Button 
                        className="btn-secondary justify-start mt-4" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}

                  {/* Admin Navigation */}
                  {role === "admin" && (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/add-venue" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add Venue
                      </Link>
                      <Link 
                        to="/admin/bookings" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Bookings
                      </Link>
                      <Link 
                        to="/admin/owners" 
                        className="py-3 px-4 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Owners
                      </Link>
                      <Button 
                        className="btn-secondary justify-start mt-4" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
