import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Gift, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Complete Profile
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Server URL configuration
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      
      // Using the real send-otp API
      const response = await fetch(`${serverUrl}/api/email-otp/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError('Please enter verification code');
      return;
    }

    try {
      setIsLoading(true);
      
      // Using the real verify-otp API
      const response = await fetch(`${serverUrl}/api/email-otp/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      setEmailVerified(true);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      // Using the real signup API
      const response = await fetch(`${serverUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store the token if returned by the API
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="pt-16">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
            <div className="text-center mb-8">
              <Gift className="h-12 w-12 text-indigo-600 mx-auto" />
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
                BirthLoop
              </h1>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleEmailVerification} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-200 pl-10 pr-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Sending Code...' : 'Continue with Email'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <GoogleAuthButton onAuthSuccess={(user) => console.log('Signed up with Google:', user)} />
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOTPVerification} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Verify your email</h2>
                  <p className="text-gray-600 mt-1">We've sent a code to {formData.email}</p>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="block w-full mt-1 rounded-lg border-gray-200 py-3 text-center text-lg tracking-widest focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleEmailVerification}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Resend
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-6">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Email verified successfully</span>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-200 pl-10 pr-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-200 pl-10 pr-12 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-200 pl-10 pr-12 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold shadow-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;