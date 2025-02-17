import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle the callback from OAuth
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    // const userStr = searchParams.get('user');

    if (token) {
      try {
        // const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        // localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location, navigate]);

  const handleGoogleSignIn = () => {
    // console.alert("ajdgjghdsjash")
    window.location.href = `${serverUrl}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center bg-white text-gray-700 rounded-lg py-3 font-semibold shadow hover:bg-gray-100 transition border border-gray-300"
    >
      <FcGoogle className="inline-block w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;