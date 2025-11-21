import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Post submitted for review');
      setTitle('');
      setDescription('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Post</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          required
        ></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;