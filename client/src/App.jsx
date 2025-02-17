import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard'; // You'll need to create this component
// import AuthCallback from './pages/AuthCallback';
import GoogleAuthButton from './components/GoogleAuthButton';
import LandingPage  from './pages/LandingPage';
import DemoPage from './pages/DemoPage';

// Protected Route component to handle authentication
// const ProtectedRoute = ({ children }) => { 
//   const token = localStorage.getItem('token');
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/auth/callback" element={<AuthCallback />} */}
        <Route path="/auth/callback" element={<GoogleAuthButton />} />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route path="/demo" element={<DemoPage />} />
          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
