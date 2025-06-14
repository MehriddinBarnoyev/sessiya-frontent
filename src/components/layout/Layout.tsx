
import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-25 via-white to-emerald-25 relative overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 bg-wedding-pattern opacity-30 pointer-events-none"></div>
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl animate-float"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      <div className="fixed top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-amber-200/15 to-yellow-200/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
        <Header />
        <main className="animate-fade-in">
          {children}
        </main>
        
        {/* Premium Footer */}
        <footer className="bg-gradient-to-br from-rose-50/80 via-white/90 to-emerald-50/80 backdrop-blur-sm border-t border-white/50 mt-32">
          <div className="container mx-auto container-padding py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <h3 className="font-serif text-3xl font-bold text-gradient mb-6">
                  Wedding Venues
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  Creating magical moments for your special day. We connect couples with the most beautiful venues to make your wedding dreams come true.
                </p>
                <div className="flex space-x-6">
                  <div className="w-14 h-14 bg-gradient-rose rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group">
                    <span className="text-white text-xl font-semibold group-hover:scale-110 transition-transform">f</span>
                  </div>
                  <div className="w-14 h-14 bg-gradient-sage rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group">
                    <span className="text-white text-xl font-semibold group-hover:scale-110 transition-transform">t</span>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer group">
                    <span className="text-white text-xl font-semibold group-hover:scale-110 transition-transform">i</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-serif text-xl font-semibold text-gray-800 mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li><a href="/" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Browse Venues</a></li>
                  <li><a href="/my-bookings" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">My Bookings</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">About Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-xl font-semibold text-gray-800 mb-6">Support</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-rose-600 transition-colors text-lg hover:translate-x-2 inline-block transition-transform duration-200">Venue Owners</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-rose-100 mt-16 pt-12 text-center">
              <p className="text-gray-500 font-medium text-lg">
                &copy; {new Date().getFullYear()} Wedding Venue Booking Platform. Made with ❤️ for your special day.
              </p>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Premium Toast Styling */}
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '24px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          }
        }}
      />
    </div>
  );
};

export default Layout;
