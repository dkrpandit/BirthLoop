import { Bell, Gift, Calendar, Users, ChevronRight, Menu, X, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// const serverUrl = import.meta.env.VITE_SERVER_URL;
const LandingPage = () => {
    // console.log(serverUrl)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <nav className="bg-white shadow-md w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center hover:opacity-90 transition">
                                <Gift className="h-8 w-8 text-indigo-600" />
                                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                                    BirthLoop
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* <a
                                href="#features"
                                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition"
                            >
                                <Bell className="w-4 h-4" />
                                Features
                            </a> */}
                            <a
                                href="#how-it-works"
                                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition"
                            >
                                <Users className="w-4 h-4" />
                                How it Works
                            </a>
                            <div className="h-6 w-px bg-gray-200"></div>
                      
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition"
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
                            {/* <a
                                href="#features"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            >
                                <Bell className="w-5 h-5" />
                                Features
                            </a> */}
                            <a
                                href="#how-it-works"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            >
                                <Users className="w-5 h-5" />
                                How it Works
                            </a>
                            <div className="h-px bg-gray-100 my-2"></div>
                            <Link
                                to="/login"
                                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Never Miss a Special Birthday Again
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Get timely reminders for your friends' and family's birthdays.
                            Make every celebration memorable.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/login"
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
                            >
                                Get Started Free
                            </Link>
                           
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id='features'>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Bell className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                            <p className="text-gray-600">
                                Get notifications exactly when you want them - days, weeks, or hours before.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Calendar className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Birthday Calendar</h3>
                            <p className="text-gray-600">
                                View all upcoming birthdays in an intuitive calendar interface.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Users className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Friend Groups</h3>
                            <p className="text-gray-600">
                                Organize friends into groups for better celebration planning.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Gift className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Wish Templates</h3>
                            <p className="text-gray-600">
                                Send personalized birthday wishes with beautiful templates.
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* How It Works Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id='how-it-works'>
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                            <p className="text-gray-600">
                                Create your account and start adding your friends' birthdays
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Set Reminders</h3>
                            <p className="text-gray-600">
                                Choose when and how you want to be notified
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-indigo-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Never Miss a Birthday</h3>
                            <p className="text-gray-600">
                                Get timely reminders and celebrate with your loved ones
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-indigo-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Start Remembering?
                        </h2>
                        <p className="text-xl mb-8">
                            Join thousands of users who never miss a birthday
                        </p>
                        <Link
                            to="/signup"
                            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold inline-flex items-center group"
                        >
                            Create Free Account
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
