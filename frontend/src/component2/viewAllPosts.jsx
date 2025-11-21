import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewAllPosts = () => {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/approved', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setPosts(response.data);
      } catch (error) {
        alert('Failed to load approved posts');
      }
    };
    fetchPosts();

    if (postId) {
      const fetchPostDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          setSelectedPost(response.data);
        } catch (error) {
          alert('Failed to load post details');
        }
      };
      fetchPostDetails();
    }
  }, [postId, token]);

  const handleVote = async (postId, voteType) => {
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPosts(updatedPosts.data);
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost({ ...selectedPost, ...updatedPosts.data.find(p => p._id === postId) });
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${selectedPost._id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPost(prev => ({
        ...prev,
        comments: [response.data.comment, ...(prev.comments || [])]
      }));
      setNewComment('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  if (postId && selectedPost) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedPost.title}</h2>
        <p className="text-gray-600 mb-4">{selectedPost.description}</p>
        <p className="text-sm text-gray-500 mb-4">Posted by: {selectedPost.userId.username} on {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => handleVote(selectedPost._id, 'upvote')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Upvote ({selectedPost.upvotes.length})
          </button>
          <button
            onClick={() => handleVote(selectedPost._id, 'downvote')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Downvote ({selectedPost.downvotes.length})
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Post Comment
            </button>
          </form>
          <div className="space-y-4">
            {(selectedPost.comments || []).map((comment) => (
              <div key={comment._id} className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-green-600 mb-6">Approved Posts</h2>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => handleVote(post._id, 'upvote')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Upvote ({post.upvotes.length})
              </button>
              <button
                onClick={() => handleVote(post._id, 'downvote')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Downvote ({post.downvotes.length})
              </button>
            </div>
            <a href={`/post/${post._id}`} className="text-blue-500 hover:underline">View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllPosts;