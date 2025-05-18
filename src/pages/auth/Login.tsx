
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<"admin" | "owner">("owner");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to the appropriate dashboard or home
    if (isAuthenticated) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, role]);

  useEffect(() => {
    // Check the URL path to determine the selected role
    if (location.pathname.includes("admin")) {
      setSelectedRole("admin");
    } else if (location.pathname.includes("owner")) {
      setSelectedRole("owner");
    }
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-4">
            {selectedRole === "admin" ? "Admin Login" : "Owner Login"}
          </h1>
          <p className="text-muted-foreground">
            {selectedRole === "admin" 
              ? "Access the admin dashboard to manage venues, bookings, and owners" 
              : "Access your owner dashboard to manage your venues and bookings"
            }
          </p>
        </div>

        <LoginForm role={selectedRole} />
      </div>
    </Layout>
  );
};

export default Login;
