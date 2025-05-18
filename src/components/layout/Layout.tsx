
import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wedding Venue Booking Platform</p>
        </div>
      </footer>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
