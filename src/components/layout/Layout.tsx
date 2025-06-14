
import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-emerald-50/50">
      <div className="bg-hero-pattern">
        <Header />
        <main className="animate-fade-in">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-rose-50 to-emerald-50 border-t border-white/50 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="font-serif text-2xl font-bold text-gradient mb-4">
                  Wedding Venues
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Discover the perfect venue for your special day. We connect couples with beautiful venues to create unforgettable wedding memories.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <span className="text-white text-sm">f</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-sage rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <span className="text-white text-sm">t</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <span className="text-white text-sm">i</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-600 hover:text-rose-600 transition-colors">Browse Venues</a></li>
                  <li><a href="/my-bookings" className="text-gray-600 hover:text-rose-600 transition-colors">My Bookings</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors">Venue Owners</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-rose-100 mt-8 pt-8 text-center">
              <p className="text-gray-500 font-medium">
                &copy; {new Date().getFullYear()} Wedding Venue Booking Platform. Made with ❤️ for your special day.
              </p>
            </div>
          </div>
        </footer>
      </div>
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
          }
        }}
      />
    </div>
  );
};

export default Layout;
