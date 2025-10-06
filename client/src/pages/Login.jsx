import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Gift } from 'lucide-react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
      // Store the token if returned by the API
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <Gift className="h-12 w-12 text-indigo-600 mx-auto" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">BirthLoop</h1>
            <p className="text-gray-600">Celebrate life's special moments</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Sign in'}
            </button>

            <GoogleAuthButton onAuthSuccess={(user) => console.log('Logged in with Google:', user)} />

            <div className="text-center text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
