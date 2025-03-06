import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GoogleAuthButton from './components/GoogleAuthButton';
import LandingPage from './pages/LandingPage';

// Protected Route for authenticated users
const ProtectedRoute = ({ children }) => { 
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

// Redirect users to dashboard if already logged in
const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            } 
          />
          <Route path="/auth/callback" element={<GoogleAuthButton />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
