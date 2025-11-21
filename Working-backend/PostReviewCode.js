//this code is working correctly for that post admin apporval feature
// correct frontend and baceldn jsut adding that functionality
//if apoorved post so other user can se post upvoet downvite it and can comment on it


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/postReviewSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  notifications: [{
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    comment: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    createdAt: { type: Date, default: Date.now }
  }]
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  rejectionComment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// APIs
// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create Post
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = new Post({
      title,
      description,
      userId: req.user._id,
      status: 'pending'
    });
    await post.save();
    
    // Notify admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      admin.notifications.push({
        postId: post._id,
        message: `New post "${title}" submitted for review`,
        status: 'pending'
      });
      await admin.save();
    }
    
    res.status(201).json({ message: 'Post submitted for review', post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts for admin review
app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Review post (accept/reject)
app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, rejectionComment } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.status = status;
    if (status === 'rejected') {
      post.rejectionComment = rejectionComment;
    }
    await post.save();
    
    // Notify user
    const user = await User.findById(post.userId);
    user.notifications.push({
      postId: post._id,
      message: `Your post "${post.title}" has been ${status}`,
      comment: status === 'rejected' ? rejectionComment : '',
      status
    });
    await user.save();
    
    res.json({ message: `Post ${status} successfully`, post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get approved posts for frontend display
app.get('/api/posts/approved', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'accepted' }).populate('userId', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('notifications.postId');
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/" element={token ? <Home role={role} /> : <Navigate to="/login" />} />
//         <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// const Login = ({ setToken, setRole }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', { username, password });
//       setToken(response.data.token);
//       setRole(response.data.role);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('role', response.data.role);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 border rounded"
//         />
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/register', { username, password, role });
//       alert('Registration successful');
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="w-full p-2 border rounded"
//         />
//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// const Home = ({ role }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await axios.get('http://localhost:5000/api/posts/approved');
//       setPosts(response.data);
//     };
//     fetchPosts();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       alert('Post submitted for review');
//       setTitle('');
//       setDescription('');
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-2xl font-bold mb-4">Create Post</h2>
//       <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           className="w-full p-2 border rounded"
//         />
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           className="w-full p-2 border rounded h-32"
//         ></textarea>
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//           Submit Post
//         </button>
//       </form>

//       <h2 className="text-2xl font-bold mb-4">Approved Posts</h2>
//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div key={post._id} className="p-4 bg-white rounded-lg shadow">
//             <h3 className="text-xl font-semibold">{post.title}</h3>
//             <p>{post.description}</p>
//             <p className="text-sm text-gray-600">Posted by: {post.userId.username}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComment, setRejectionComment] = useState('');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await axios.get('http://localhost:5000/api/admin/posts', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setPosts(response.data);
//     };
//     fetchPosts();
//   }, []);

//   const handleReview = async (postId, status) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/posts/${postId}`,
//         { status, rejectionComment: status === 'rejected' ? rejectionComment : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComment('');
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Post Review</h2>
//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div key={post._id} className="p-4 bg-white rounded-lg shadow">
//             <h3 className="text-xl font-semibold">{post.title}</h3>
//             <p>{post.description}</p>
//             <p className="text-sm text-gray-600">Posted by: {post.userId.username}</p>
//             <p className="text-sm text-gray-600">Status: {post.status}</p>
//             <div className="mt-4 space-x-2">
//               <button
//                 onClick={() => handleReview(post._id, 'accepted')}
//                 className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => handleReview(post._id, 'rejected')}
//                 className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
//               >
//                 Reject
//               </button>
//               {post.status === 'pending' && (
//                 <textarea
//                   value={rejectionComment}
//                   onChange={(e) => setRejectionComment(e.target.value)}
//                   placeholder="Reason for rejection"
//                   className="w-full p-2 border rounded mt-2"
//                 ></textarea>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setNotifications(response.data);
//     };
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-2xl font-bold mb-4">Your Notifications</h2>
//       <div className="space-y-4">
//         {notifications.map((notification, index) => (
//           <div key={index} className="p-4 bg-white rounded-lg shadow">
//             <p>{notification.message}</p>
//             {notification.comment && (
//               <p className="text-red-600">Rejection Reason: {notification.comment}</p>
//             )}
//             <p className="text-sm text-gray-600">
//               Post: {notification.postId?.title || 'Post deleted'}
//             </p>
//             <p className="text-sm text-gray-600">
//               {new Date(notification.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;





