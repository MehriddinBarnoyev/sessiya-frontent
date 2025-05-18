
import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#FDF6F6]">
      <Header />
      <main className="flex-1 animate-fade-in">
        {children}
      </main>
      <footer className="bg-primary/10 py-8 mt-12 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground font-serif mb-2">&copy; {new Date().getFullYear()} Wedding Venue Booking Platform</p>
          <div className="flex justify-center space-x-6 text-sm text-primary-foreground/70 mt-2">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
