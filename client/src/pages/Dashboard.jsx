import React, { useState } from "react";

const Dashboard = () => {
  // State for managing friends list
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState({ name: "", birthdate: "" });

  // State for managing notifications
  const [notifications, setNotifications] = useState([]);

  // Add a new friend
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (newFriend.name && newFriend.birthdate) {
      setFriends([...friends, newFriend]);
      setNewFriend({ name: "", birthdate: "" }); // Reset form
      setNotifications([...notifications, `Added ${newFriend.name}`]);
    }
  };

  // Delete a friend
  const handleDeleteFriend = (index) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
    setNotifications([...notifications, `Deleted ${friends[index].name}`]);
  };

  // Get upcoming birthdays (within the next 7 days)
  const getUpcomingBirthdays = () => {
    const today = new Date();
    return friends.filter((friend) => {
      const birthdate = new Date(friend.birthdate);
      const daysRemaining = Math.floor((birthdate - today) / (1000 * 60 * 60 * 24));
      return daysRemaining >= 0 && daysRemaining <= 7;
    });
  };

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Add Friend Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
        <form onSubmit={handleAddFriend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newFriend.name}
              onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter friend's name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input
              type="date"
              value={newFriend.birthdate}
              onChange={(e) => setNewFriend({ ...newFriend, birthdate: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Friend
          </button>
        </form>
      </div>

      {/* Upcoming Birthdays Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Birthdays</h2>
        {getUpcomingBirthdays().length > 0 ? (
          getUpcomingBirthdays().map((friend, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500">{friend.birthdate}</p>
              </div>
              <button
                onClick={() => handleDeleteFriend(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming birthdays.</p>
        )}
      </div>

      {/* All Friends Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Friends</h2>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500">{friend.birthdate}</p>
              </div>
              <button
                onClick={() => handleDeleteFriend(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No friends added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;