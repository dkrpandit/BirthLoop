import React, { useState, useEffect } from 'react';
import { Filter, UserPlus, Edit2, Trash2, BellOff, Bell, Gift, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    relationship: 'friend',
    notificationPreferences: {
      days: 0,
      time: '09:00',
      enabled: true
    }
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/friend`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleToggleNotification = async (friendId, currentState) => {
    try {
      const response = await fetch(`${serverUrl}/api/friend/${friendId}/toggle-notification`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMembers(members.map(member => {
          if (member._id === friendId) {
            return {
              ...member,
              notificationPreferences: {
                ...member.notificationPreferences,
                enabled: !currentState
              }
            };
          }
          return member;
        }));
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMember 
      ? `${serverUrl}/api/friend/${editingMember._id}`
      : `${serverUrl}/api/friend`;
    
    try {
      const response = await fetch(url, {
        method: editingMember ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMembers();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`${serverUrl}/api/friend/${memberId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setMembers(members.filter(member => member._id !== memberId));
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      birthDate: new Date(member.birthDate).toISOString().split('T')[0],
      relationship: member.relationship,
      notificationPreferences: {
        days: member.notificationPreferences?.days || 0,
        time: member.notificationPreferences?.time || '09:00',
        enabled: member.notificationPreferences?.enabled ?? true
      }
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      birthDate: '',
      relationship: 'friend',
      notificationPreferences: {
        days: 0,
        time: '09:00',
        enabled: true
      }
    });
    setEditingMember(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getNotificationTiming = (member) => {
    if (!member.notificationPreferences?.enabled) {
      return 'Notifications disabled';
    }
    
    const days = member.notificationPreferences?.days || 0;
    const time = member.notificationPreferences?.time || '09:00';
    
    return `${days} day${days > 0 ? 's' : ''} before at ${time}`;
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'family':
        return 'bg-purple-100 text-purple-800';
      case 'friend':
        return 'bg-blue-100 text-blue-800';
      case 'colleague':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = activeFilter === 'all' 
    ? members 
    : members.filter(member => member.relationship === activeFilter);

  // Get unique relationships for filter
  const relationships = ['all', ...new Set(members.map(member => member.relationship))];

  return (
    <>
      <Navbar />      
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium mr-2">Member List</h2>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {relationships.map(relation => (
                      <button
                        key={relation}
                        onClick={() => setActiveFilter(relation)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          activeFilter === relation
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {relation.charAt(0).toUpperCase() + relation.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <UserPlus size={18} />
                <span>Add Member</span>
              </button>
            </div>

            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div key={member._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <div 
                          onClick={() => handleToggleNotification(member._id, member.notificationPreferences?.enabled)}
                          className="cursor-pointer"
                        >
                          {member.notificationPreferences?.enabled ? (
                            <Bell size={18} className="text-green-500" />
                          ) : (
                            <BellOff size={18} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{formatDate(member.birthDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Gift size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{getNotificationTiming(member)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${getRelationshipColor(member.relationship)}`}>
                          {member.relationship}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEdit(member)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                            aria-label="Edit member"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(member._id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                            aria-label="Delete member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                {activeFilter === 'all' 
                  ? "No members found. Add your first member to get started!" 
                  : `No ${activeFilter} members found. Try a different filter or add a new ${activeFilter}.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Relationship</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notification Days Before</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.notificationPreferences.days}
                  onChange={(e) => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      days: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notification Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.notificationPreferences.time}
                  onChange={(e) => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      time: e.target.value
                    }
                  })}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Enable Notifications</label>
                <div
                  onClick={() => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      enabled: !formData.notificationPreferences.enabled
                    }
                  })}
                  className={`w-12 h-6 rounded-full relative ${formData.notificationPreferences.enabled ? 'bg-green-500' : 'bg-gray-300'} transition-colors cursor-pointer`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${formData.notificationPreferences.enabled ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'} shadow-sm`}></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;