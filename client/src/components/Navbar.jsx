import { 
  Gift, 
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({ name: '', profileImage: '' });
  

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        setUser({
          name: decodedToken.name || 'User',
          profileImage: decodedToken.avatar || 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid'
        });
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition transform hover:scale-105">
              <Gift className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                BirthLoop
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition transform hover:scale-105"
              >
                <img 
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-600"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition transform hover:scale-105"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              <img 
                src={user.profileImage}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-600"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;