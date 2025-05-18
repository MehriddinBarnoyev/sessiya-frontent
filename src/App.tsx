
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Public Pages
import Index from "./pages/Index";
import VenueDetail from "./pages/VenueDetail";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddEditVenue from "./pages/owner/AddEditVenue";
import OwnerEditVenue from "./pages/owner/EditVenue";
import OwnerBookings from "./pages/owner/OwnerBookings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import VenuesManagement from "./pages/admin/VenuesManagement";
import AddEditVenueAdmin from "./pages/admin/AddEditVenueAdmin";
import AdminEditVenue from "./pages/admin/EditVenue";
import AdminBookings from "./pages/admin/AdminBookings";
import OwnersList from "./pages/admin/OwnersList";

// Components
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { role } = useAuth();
  
  // Determine redirect based on user role
  const renderRedirect = () => {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/venue/:id" element={<VenueDetail />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/owner/login" element={<Login />} />
      <Route path="/login/success" element={renderRedirect()} />
      
      {/* Owner Protected Routes */}
      <Route path="/owner/dashboard" element={
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/owner/add-venue" element={
        <ProtectedRoute allowedRoles={["owner"]}>
          <AddEditVenue />
        </ProtectedRoute>
      } />
      <Route path="/owner/edit-venue/:id" element={
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerEditVenue />
        </ProtectedRoute>
      } />
      <Route path="/owner/bookings" element={
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerBookings />
        </ProtectedRoute>
      } />
      
      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/venues" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <VenuesManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/add-venue" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AddEditVenueAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/edit-venue/:id" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminEditVenue />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminBookings />
        </ProtectedRoute>
      } />
      <Route path="/admin/owners" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <OwnersList />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
