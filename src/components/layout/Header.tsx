
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRole, logout } from "@/lib/auth";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = getRole();
    setRole(userRole);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-background border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-primary-foreground">
          Wedding Venues
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Guest Navigation */}
          {!role && (
            <>
              <Link to="/" className="font-medium hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <Link to="/my-bookings" className="font-medium hover:text-primary-foreground transition-colors">
                My Bookings
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </>
          )}

          {/* Owner Navigation */}
          {role === "owner" && (
            <>
              <Link to="/owner/dashboard" className="font-medium hover:text-primary-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/owner/add-venue" className="font-medium hover:text-primary-foreground transition-colors">
                Add Venue
              </Link>
              <Link to="/owner/bookings" className="font-medium hover:text-primary-foreground transition-colors">
                My Bookings
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* Admin Navigation */}
          {role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="font-medium hover:text-primary-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/add-venue" className="font-medium hover:text-primary-foreground transition-colors">
                Add Venue
              </Link>
              <Link to="/admin/bookings" className="font-medium hover:text-primary-foreground transition-colors">
                Bookings
              </Link>
              <Link to="/admin/owners" className="font-medium hover:text-primary-foreground transition-colors">
                Owners
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background pt-16">
            <div className="container px-4">
              <nav className="flex flex-col gap-4">
                {/* Guest Navigation */}
                {!role && (
                  <>
                    <Link 
                      to="/" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/login" 
                      className="py-2 text-lg font-medium" 
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
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/owner/add-venue" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Venue
                    </Link>
                    <Link 
                      to="/owner/bookings" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Button 
                      variant="outline" 
                      className="justify-start" 
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
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/add-venue" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Venue
                    </Link>
                    <Link 
                      to="/admin/bookings" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link 
                      to="/admin/owners" 
                      className="py-2 text-lg font-medium" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Owners
                    </Link>
                    <Button 
                      variant="outline" 
                      className="justify-start" 
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
