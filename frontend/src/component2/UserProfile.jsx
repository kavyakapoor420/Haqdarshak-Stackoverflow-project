import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    };
    fetchNotifications();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Notifications</h2>
      <div className="space-y-6">
        {notifications.map((notification, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <p className="text-gray-800 mb-2">{notification.message}</p>
            {notification.comment && (
              <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
            )}
            <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
            <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;