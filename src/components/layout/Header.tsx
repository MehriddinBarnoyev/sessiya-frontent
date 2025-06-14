
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRole, logout } from "@/lib/auth";
import { Menu, X, Heart, Sparkles, Crown } from "lucide-react";

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
      setIsScrolled(window.scrollY > 20);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? "bg-white/90 backdrop-blur-xl shadow-elegant border-b border-white/60 py-4" 
        : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto container-padding">
        <div className="flex justify-between items-center">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-rose rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-rose p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Heart size={24} className="text-white fill-white" />
                <Crown size={12} className="absolute -top-1 -right-1 text-amber-300 animate-pulse-soft" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                Wedding Venues
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">Premium Collection</span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-3 rounded-2xl bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-50 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Guest Navigation */}
            {!role && (
              <>
                <Link to="/" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Home
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/my-bookings" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  My Bookings
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/login">
                  <Button className="btn-primary hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                    <Sparkles size={18} className="mr-2" />
                    Login
                  </Button>
                </Link>
              </>
            )}

            {/* Owner Navigation */}
            {role === "owner" && (
              <>
                <Link to="/owner/dashboard" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/owner/add-venue" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Add Venue
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/owner/bookings" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  My Bookings
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Button className="btn-secondary hover:scale-105 transition-transform duration-300" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin Navigation */}
            {role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/admin/add-venue" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Add Venue
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/admin/bookings" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Bookings
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/admin/owners" className="text-lg font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 hover:scale-105 relative group">
                  Owners
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Button className="btn-secondary hover:scale-105 transition-transform duration-300" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Premium Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-xl shadow-3xl border-l border-white/60 animate-slide-up">
              <div className="p-8">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-rose p-2 rounded-xl">
                      <Heart size={20} className="text-white fill-white" />
                    </div>
                    <span className="font-serif text-xl font-bold text-gradient">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all duration-300 hover:scale-110"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {/* Guest Navigation */}
                  {!role && (
                    <>
                      <Link 
                        to="/" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🏠 Home
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📅 My Bookings
                      </Link>
                      <Link 
                        to="/login" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ✨ Login
                      </Link>
                    </>
                  )}

                  {/* Owner Navigation */}
                  {role === "owner" && (
                    <>
                      <Link 
                        to="/owner/dashboard" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link 
                        to="/owner/add-venue" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ➕ Add Venue
                      </Link>
                      <Link 
                        to="/owner/bookings" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📅 My Bookings
                      </Link>
                      <Button 
                        className="btn-secondary justify-start mt-6 text-lg py-4" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        🚪 Logout
                      </Button>
                    </>
                  )}

                  {/* Admin Navigation */}
                  {role === "admin" && (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        👑 Dashboard
                      </Link>
                      <Link 
                        to="/admin/add-venue" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ➕ Add Venue
                      </Link>
                      <Link 
                        to="/admin/bookings" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📋 Bookings
                      </Link>
                      <Link 
                        to="/admin/owners" 
                        className="py-4 px-6 text-lg font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 hover:scale-105" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        👥 Owners
                      </Link>
                      <Button 
                        className="btn-secondary justify-start mt-6 text-lg py-4" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        🚪 Logout
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
