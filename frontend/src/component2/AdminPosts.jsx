import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [rejectionComments, setRejectionComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  const handleReview = async (postId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/posts/${postId}`,
        { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.filter((post) => post._id !== postId));
      setRejectionComments(prev => {
        const newComments = { ...prev };
        delete newComments[postId];
        return newComments;
      });
      alert(`Post ${status} successfully`);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleCommentChange = (postId, value) => {
    setRejectionComments(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - Post Review</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
            <p className="text-sm text-gray-500 mb-4">Status: {post.status}</p>
            <div className="space-x-4 mb-4">
              <button
                onClick={() => handleReview(post._id, 'accepted')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleReview(post._id, 'rejected')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Reject
              </button>
            </div>
            <textarea
              value={rejectionComments[post._id] || ''}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
              placeholder="Reason for rejection"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPosts;