import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import GoogleAuthCallback from "./components/GoogleAuthButton";
import LandingPage from "./pages/LandingPage";

// Check if token is valid (not expired)
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Decode JWT token
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token && isTokenValid(token)) {
    return children;
  } else {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }
};

// Redirect if already authenticated
const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token && isTokenValid(token)) {
    return <Navigate to="/dashboard" replace />;
  } else {
    if (token) localStorage.removeItem("token");
    return children;
  }
};

const App = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenValid(token)) {
      localStorage.removeItem("token");
    }
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    {
      path: "/login",
      element: (
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
      ),
    },
    {
      path: "/signup",
      element: (
        <RedirectIfAuthenticated>
          <Signup />
        </RedirectIfAuthenticated>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <RedirectIfAuthenticated>
          <ForgotPassword />
        </RedirectIfAuthenticated>
      ),
    },
    { 
      path: "/auth/callback", 
      element: <GoogleAuthCallback /> 
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;