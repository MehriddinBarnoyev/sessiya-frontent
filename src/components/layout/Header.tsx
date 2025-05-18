
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRole, logout } from "@/lib/auth";
import { Menu, X, Heart } from "lucide-react";

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart size={20} className="text-rose-gold fill-rose-gold" />
          <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary-foreground to-secondary-foreground bg-clip-text text-transparent">
            Wedding Venues
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full bg-primary/10 text-primary-foreground hover:bg-primary/20 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Guest Navigation */}
          {!role && (
            <>
              <Link to="/" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Home
              </Link>
              <Link to="/my-bookings" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                My Bookings
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary/10 hover:border-primary">
                  Login
                </Button>
              </Link>
            </>
          )}

          {/* Owner Navigation */}
          {role === "owner" && (
            <>
              <Link to="/owner/dashboard" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Dashboard
              </Link>
              <Link to="/owner/add-venue" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Add Venue
              </Link>
              <Link to="/owner/bookings" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                My Bookings
              </Link>
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary/10" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* Admin Navigation */}
          {role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/add-venue" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Add Venue
              </Link>
              <Link to="/admin/bookings" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Bookings
              </Link>
              <Link to="/admin/owners" className="font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Owners
              </Link>
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary/10" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md pt-16">
            <div className="container px-4">
              <nav className="flex flex-col gap-4">
                {/* Guest Navigation */}
                {!role && (
                  <>
                    <Link 
                      to="/" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/login" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
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
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/owner/add-venue" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Venue
                    </Link>
                    <Link 
                      to="/owner/bookings" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Button 
                      variant="outline" 
                      className="justify-start border-primary-foreground text-primary-foreground mt-2" 
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
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/add-venue" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Venue
                    </Link>
                    <Link 
                      to="/admin/bookings" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link 
                      to="/admin/owners" 
                      className="py-3 text-lg font-medium text-primary-foreground border-b border-border" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Owners
                    </Link>
                    <Button 
                      variant="outline" 
                      className="justify-start border-primary-foreground text-primary-foreground mt-2" 
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
        )}
      </div>
    </header>
  );
};

export default Header;
