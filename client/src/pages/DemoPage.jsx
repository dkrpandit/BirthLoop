import { useState } from 'react';
import { Bell, Calendar, Gift, ChevronRight, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showNotification, setShowNotification] = useState(false);

  // Demo data
  const upcomingBirthdays = [
    { id: 1, name: "Sarah Johnson", date: "February 15", age: 28, relationship: "Friend" },
    { id: 2, name: "Mike Smith", date: "February 18", age: 34, relationship: "Coworker" },
    { id: 3, name: "Emma Davis", date: "February 20", age: 25, relationship: "Family" }
  ];

  const triggerDemoNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Demo Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Try BirthLoop Demo
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience how BirthLoop helps you remember and celebrate birthdays. 
              This is a interactive demo with sample data.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'calendar' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'notifications' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
          </div>

          {/* Demo Content */}
          <div className="bg-white rounded-lg">
            {activeTab === 'calendar' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Birthdays
                </h3>
                {upcomingBirthdays.map((birthday) => (
                  <div 
                    key={birthday.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{birthday.name}</h4>
                        <p className="text-sm text-gray-500">
                          {birthday.date} • Turning {birthday.age} • {birthday.relationship}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={triggerDemoNotification}
                      className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                    >
                      Set Reminder
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">When to Notify</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox text-indigo-600" defaultChecked />
                        <span className="ml-2 text-gray-700">1 week before</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox text-indigo-600" defaultChecked />
                        <span className="ml-2 text-gray-700">On the day</span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={triggerDemoNotification}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition"
                  >
                    Test Notification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="mb-6">
            Create your account now and never miss a birthday again
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Create Free Account
            <ChevronRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Demo Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-slide-in">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Birthday Reminder Set!</p>
              <p className="text-sm text-gray-500">You'll be notified when it's time to celebrate</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;