// //npx shadcn@latest add button 
// import Chatbot from "./Components/AiChatInterface/Chatbot"
// import AuthPage from "./Components/Auth/AuthForm"
// import KnowledgeBasePage from "./Pages/KnowledgePage"



// function App() {
  

//   return (
//     <>
//      <h1 className="text-red-500">Hello World </h1>
//      <KnowledgeBasePage/>
//      <Chatbot/>
//      <AuthPage/>
//     </>

//   )
// }

// export default App



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

//   const handleVote = async (postId, voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.map(post => post._id === postId ? response.data.post : post));
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
//             <div className="mt-2 flex items-center space-x-4">
//               <button
//                 onClick={() => handleVote(post._id, 'upvote')}
//                 className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//               >
//                 Upvote ({post.upvotes.length})
//               </button>
//               <button
//                 onClick={() => handleVote(post._id, 'downvote')}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Downvote ({post.downvotes.length})
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

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
//         { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
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
//               <textarea
//                 value={rejectionComments[post._id] || ''}
//                 onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                 placeholder="Reason for rejection"
//                 className="w-full p-2 border rounded mt-2"
//               ></textarea>
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
//           <option value="user">Agent</option>
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
//   const [comments, setComments] = useState({});
//   const [newComment, setNewComment] = useState({});

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await axios.get('http://localhost:5000/api/posts/approved');
//       setPosts(response.data);
//       // Fetch comments for each post
//       const commentsData = {};
//       for (const post of response.data) {
//         const commentResponse = await axios.get(`http://localhost:5000/api/posts/${post._id}/comments`);
//         commentsData[post._id] = commentResponse.data;
//       }
//       setComments(commentsData);
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

//   const handleVote = async (postId, voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.map(post => post._id === postId ? response.data.post : post));
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentSubmit = async (postId, e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment[postId] || '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setComments(prev => ({
//         ...prev,
//         [postId]: [response.data.comment, ...(prev[postId] || [])]
//       }));
//       setNewComment(prev => ({ ...prev, [postId]: '' }));
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setNewComment(prev => ({ ...prev, [postId]: value }));
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
//             <div className="mt-2 flex items-center space-x-4">
//               <button
//                 onClick={() => handleVote(post._id, 'upvote')}
//                 className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//               >
//                 Upvote ({post.upvotes.length})
//               </button>
//               <button
//                 onClick={() => handleVote(post._id, 'downvote')}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Downvote ({post.downvotes.length})
//               </button>
//             </div>
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold">Comments</h4>
//               <form onSubmit={(e) => handleCommentSubmit(post._id, e)} className="mt-2">
//                 <textarea
//                   value={newComment[post._id] || ''}
//                   onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                   placeholder="Add a comment"
//                   className="w-full p-2 border rounded"
//                 ></textarea>
//                 <button
//                   type="submit"
//                   className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//                 >
//                   Post Comment
//                 </button>
//               </form>
//               <div className="mt-2 space-y-2">
//                 {(comments[post._id] || []).map((comment) => (
//                   <div key={comment._id} className="p-2 bg-gray-100 rounded">
//                     <p>{comment.content}</p>
//                     <p className="text-sm text-gray-600">
//                       By {comment.userId.username} at {new Date(comment.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

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
//         { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
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
//               <textarea
//                 value={rejectionComments[post._id] || ''}
//                 onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                 placeholder="Reason for rejection"
//                 className="w-full p-2 border rounded mt-2"
//               ></textarea>
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





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
// import Navbar from './Components/Common/Navbar';
// import LandingPage from './Pages/LandingPage';
// import { LanguageProvider } from './Context/LanguageContext';
// import Chatbot from './Components/AiChatInterface/Chatbot';
// import AuthPage from './Components/Auth/AuthForm';

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   return (
//     <Router>
//         <LanguageProvider>
//            {/* <Navbar/>
//            <LandingPage/> */}
           
//       <Routes>
        
//         <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/" element={token ? <Home role={role} /> : <Navigate to="/login" />} />
//         <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" />} />
//         <Route path="/post/:postId" element={token ? <PostDetail /> : <Navigate to="/login" />} />
//         <Route path='/ai-assist' element={<Chatbot/>}/>
//       </Routes>
//       </LanguageProvider>
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
//   const [token] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/posts/approved', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching approved posts:', error);
//         alert('Failed to load approved posts');
//       }
//     };
//     fetchPosts();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
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
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Post</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//         ></textarea>
//         <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
//           Submit Post
//         </button>
//       </form>

//       <h2 className="text-3xl font-bold text-green-600 mb-6">Approved Posts</h2>
//       <div className="grid gap-6">
//         {posts.map((post) => (
//           <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//             <p className="text-gray-600 mb-4">{post.description}</p>
//             <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//             <div className="flex items-center space-x-4 mb-4">
//               <button
//                 onClick={() => handleVote(post._id, 'upvote', token)}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//               >
//                 Upvote ({post.upvotes.length})
//               </button>
//               <button
//                 onClick={() => handleVote(post._id, 'downvote', token)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//               >
//                 Downvote ({post.downvotes.length})
//               </button>
//             </div>
//             <a href={`/post/${post._id}`} className="text-blue-500 hover:underline">View Details</a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [token] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('Failed to load post details');
//       }
//     };
//     fetchPost();
//   }, [postId, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(response.data.post);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   if (!post) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
//       <p className="text-gray-600 mb-4">{post.description}</p>
//       <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//       <div className="flex items-center space-x-4 mb-6">
//         <button
//           onClick={() => handleVote('upvote')}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Upvote ({post.upvotes.length})
//         </button>
//         <button
//           onClick={() => handleVote('downvote')}
//           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//         >
//           Downvote ({post.downvotes.length})
//         </button>
//       </div>
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Comments</h3>
//         <form onSubmit={handleCommentSubmit} className="mb-4">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add a comment"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
//           ></textarea>
//           <button
//             type="submit"
//             className="mt-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
//           >
//             Post Comment
//           </button>
//         </form>
//         <div className="space-y-4">
//           {(post.comments || []).map((comment) => (
//             <div key={comment._id} className="p-4 bg-gray-100 rounded-lg">
//               <p className="text-gray-800">{comment.content}</p>
//               <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

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
//         { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - Post Review</h2>
//       <div className="space-y-6">
//         {posts.map((post) => (
//           <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//             <p className="text-gray-600 mb-4">{post.description}</p>
//             <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//             <p className="text-sm text-gray-500 mb-4">Status: {post.status}</p>
//             <div className="space-x-4 mb-4">
//               <button
//                 onClick={() => handleReview(post._id, 'accepted')}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => handleReview(post._id, 'rejected')}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//               >
//                 Reject
//               </button>
//             </div>
//             <textarea
//               value={rejectionComments[post._id] || ''}
//               onChange={(e) => handleCommentChange(post._id, e.target.value)}
//               placeholder="Reason for rejection"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
//             ></textarea>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [token] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setNotifications(response.data);
//     };
//     fetchNotifications();
//   }, [token]);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Notifications</h2>
//       <div className="space-y-6">
//         {notifications.map((notification, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <p className="text-gray-800 mb-2">{notification.message}</p>
//             {notification.comment && (
//               <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
//             )}
//             <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
//             <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const handleVote = async (postId, voteType, token) => {
//   try {
//     const response = await axios.post(
//       `http://localhost:5000/api/posts/${postId}/vote`,
//       { voteType },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     // Update would require state management at a higher level, handled by PostDetail or Home
//     console.log('Vote updated:', response.data);
//   } catch (error) {
//     alert(error.response.data.message);
//   }
// };

// export default App;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
// import AuthPage from './Components/Auth/AuthForm'

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/auth"
//           element={<AuthPage setToken={setToken} setRole={setRole} />}
//         />
//         <Route
//           path="/"
//           element={token ? <Home role={role} /> : <Navigate to="/auth" />}
//         />
//         <Route
//           path="/admin"
//           element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />}
//         />
//         <Route
//           path="/profile"
//           element={token ? <UserProfile /> : <Navigate to="/auth" />}
//         />
//         <Route
//           path="/post/:postId"
//           element={token ? <PostDetail /> : <Navigate to="/auth" />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// const Home = ({ role }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/posts/approved', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching approved posts:', error);
//         alert('Failed to load approved posts');
//       }
//     };
//     fetchPosts();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Post submitted for review');
//       setTitle('');
//       setDescription('');
//       // Optionally fetch posts again to update the list
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Failed to submit post');
//     }
//   };

//   const handleVote = async (postId, voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Post</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//           required
//         ></textarea>
//         <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
//           Submit Post
//         </button>
//       </form>

//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Approved Posts</h2>
//       <div className="grid gap-6">
//         {posts.map((post) => (
//           <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//             <p className="text-gray-600 mb-4">{post.description}</p>
//             <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//             <div className="flex items-center space-x-4 mb-4">
//               <button
//                 onClick={() => handleVote(post._id, 'upvote')}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//               >
//                 Upvote ({post.upvotes.length})
//               </button>
//               <button
//                 onClick={() => handleVote(post._id, 'downvote')}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//               >
//                 Downvote ({post.downvotes.length})
//               </button>
//             </div>
//             <a href={`/post/${post._id}`} className="text-blue-500 hover:underline">View Details</a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('Failed to load post details');
//       }
//     };
//     fetchPost();
//   }, [postId, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(response.data.post);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   if (!post) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
//       <p className="text-gray-600 mb-4">{post.description}</p>
//       <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//       <div className="flex items-center space-x-4 mb-6">
//         <button
//           onClick={() => handleVote('upvote')}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//         >
//           Upvote ({post.upvotes.length})
//         </button>
//         <button
//           onClick={() => handleVote('downvote')}
//           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//         >
//           Downvote ({post.downvotes.length})
//         </button>
//       </div>
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Comments</h3>
//         <form onSubmit={handleCommentSubmit} className="mb-4">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add a comment"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
//           ></textarea>
//           <button
//             type="submit"
//             className="mt-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
//           >
//             Post Comment
//           </button>
//         </form>
//         <div className="space-y-4">
//           {(post.comments || []).map((comment) => (
//             <div key={comment._id} className="p-4 bg-gray-100 rounded-lg">
//               <p className="text-gray-800">{comment.content}</p>
//               <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

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
//         { status:'rejected', rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - Post Review</h2>
//       <div className="space-y-6">
//         {posts.map((post) => (
//           <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//             <p className="text-gray-600 mb-4">{post.description}</p>
//             <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//             <p className="text-sm text-gray-500 mb-4">Status: {post.status}</p>
//             <div className="space-x-4 mb-4">
//               <button
//                 onClick={() => handleReview(post._id, 'accepted')}
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => handleReview(post._id, 'rejected')}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//               >
//                 Reject
//               </button>
//             </div>
//             <textarea
//               value={rejectionComments[post._id] || ''}
//               onChange={(e) => handleCommentChange(post._id, e.target.value)}
//               placeholder="Reason for rejection"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
//             ></textarea>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setNotifications(response.data);
//     };
//     fetchNotifications();
//   }, [token]);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Notifications</h2>
//       <div className="space-y-6">
//         {notifications.map((notification, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
//             <p className="text-gray-800 mb-2">{notification.message}</p>
//             {notification.comment && (
//               <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
//             )}
//             <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
//             <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
// import AuthPage from './Components/Auth/AuthForm';

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   return (
//     <Router>
//       <Routes>
//         <Route path="/auth" element={<AuthPage setToken={setToken} setRole={setRole} />} />
//         <Route path="/" element={token ? <Home role={role} /> : <Navigate to="/auth" />} />
//         <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />} />
//         <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/auth" />} />
//         <Route path="/post/:postId" element={token ? <PostDetail /> : <Navigate to="/auth" />} />
//       </Routes>
//     </Router>
//   );
// };

// const Home = ({ role }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/posts/approved', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching approved posts:', error);
//         alert('Failed to load approved posts');
//       }
//     };
//     fetchPosts();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Post submitted for review');
//       setTitle('');
//       setDescription('');
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Failed to submit post');
//     }
//   };

//   const handleVote = async (postId, voteType) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] via-[#50C878] to-[#FF6B6B] p-6">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Create Your Post</h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Title"
//             className="w-full p-4 border-2 border-[#4A90E2]/50 rounded-xl focus:outline-none focus:border-[#50C878] transition-all duration-300 text-gray-800 placeholder-gray-500"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter Description"
//             className="w-full p-4 border-2 border-[#4A90E2]/50 rounded-xl focus:outline-none focus:border-[#50C878] transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-white p-4 rounded-xl hover:from-[#4A90E2] hover:to-[#50C878] transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>

//         <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Approved Posts</h2>
//         <div className="grid gap-6">
//           {posts.map((post) => (
//             <div key={post._id} className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#50C878]">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//               <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
//               <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//               <div className="flex items-center space-x-4 mb-4">
//                 <button
//                   onClick={() => handleVote(post._id, 'upvote')}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//                 >
//                   Upvote ({post.upvotes.length})
//                 </button>
//                 <button
//                   onClick={() => handleVote(post._id, 'downvote')}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                   Downvote ({post.downvotes.length})
//                 </button>
//               </div>
//               <Link to={`/post/${post._id}`} className="text-[#4A90E2] hover:underline font-medium">View Details</Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('Failed to load post details');
//       }
//     };
//     fetchPost();
//   }, [postId, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(response.data.post);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to comment');
//     }
//   };

//   if (!post) return <div className="text-center mt-20 text-white text-2xl">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] via-[#50C878] to-[#FF6B6B] p-6">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-gray-800 mb-4 bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-transparent bg-clip-text"> {post.title}</h2>
//           <p className="text-gray-600 mb-4">{post.description}</p>
//           <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//           <div className="flex items-center space-x-4 mb-6">
//             <button
//               onClick={() => handleVote('upvote')}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//             >
//               Upvote ({post.upvotes.length})
//             </button>
//             <button
//               onClick={() => handleVote('downvote')}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//             >
//               Downvote ({post.downvotes.length})
//             </button>
//           </div>
//           <div className="mb-6">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4 bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-transparent bg-clip-text">Comments</h3>
//             <form onSubmit={handleCommentSubmit} className="mb-4">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment"
//                 className="w-full p-4 border-2 border-[#4A90E2]/50 rounded-xl focus:outline-none focus:border-[#50C878] transition-all duration-300 text-gray-800 placeholder-gray-500 h-24"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-white p-3 rounded-xl hover:from-[#4A90E2] hover:to-[#50C878] transition-all duration-300"
//               >
//                 Post Comment
//               </button>
//             </form>
//             <div className="space-y-4">
//               {(post.comments || []).map((comment) => (
//                 <div key={comment._id} className="p-4 bg-gray-100 rounded-xl shadow-md">
//                   <p className="text-gray-800">{comment.content}</p>
//                   <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await axios.get('http://localhost:5000/api/admin/posts', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setPosts(response.data);
//     };
//     fetchPosts();
//   }, [posts]);

//   const handleReview = async (postId, status) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/posts/${postId}`,
//         { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to review post');
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] via-[#50C878] to-[#FF6B6B] p-6">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-transparent bg-clip-text">Admin Dashboard</h2>
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-transparent bg-clip-text">Pending Posts for Review</h3>
//           {posts.map((post) => (
//             <div key={post._id} className="bg-white/95 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FF6B6B]">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//               <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
//               <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//               <p className="text-sm text-gray-500 mb-4">Status: {post.status}</p>
//               <div className="space-x-4 mb-4">
//                 <button
//                   onClick={() => handleReview(post._id, 'accepted')}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleReview(post._id, 'rejected')}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                   Reject
//                 </button>
//               </div>
//               <textarea
//                 value={rejectionComments[post._id] || ''}
//                 onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                 placeholder="Reason for rejection"
//                 className="w-full p-4 border-2 border-[#FF6B6B]/50 rounded-xl focus:outline-none focus:border-[#FF6B6B] transition-all duration-300 text-gray-800 placeholder-gray-500 h-20"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setNotifications(response.data);
//     };
//     fetchNotifications();
//   }, [token]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] via-[#50C878] to-[#FF6B6B] p-6">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg bg-gradient-to-r from-[#50C878] to-[#4A90E2] text-transparent bg-clip-text">Your Notifications</h2>
//         <div className="space-y-6">
//           {notifications.map((notification, index) => (
//             <div key={index} className="bg-white/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#4A90E2]">
//               <p className="text-gray-800 mb-2">{notification.message}</p>
//               {notification.comment && (
//                 <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
//               )}
//               <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
//               <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
// import AuthPage from './Components/Auth/AuthForm';
// import LandingPage from './Pages/LandingPage'
// import { LanguageProvider } from './Context/LanguageContext';
// import Navbar from  './Components/Common/Navbar'
// import Chatbot from './Components/AiChatInterface/Chatbot';
// import PostQuestionPage from './Pages/PostQuestionPage';
// import CommunityPostPage from './Pages/CommunityPostPage';
// import KnowledgeBasePage from './Pages/KnowledgePage';

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [role, setRole] = useState(localStorage.getItem('role'));

//   return (
//     <Router>
     
//       <LanguageProvider>
//       <Navbar/>
//       <KnowledgeBasePage/>
//       <Routes>
        
//         <Route path="/auth" element={<AuthPage setToken={setToken} setRole={setRole} />} />
//         {/* <Route path="/" element={token ? <Home role={role} /> : <Navigate to="/auth" />} /> */}
//         <Route path='/' element={<LandingPage/>}/>
//         <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />} />
//         <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/auth" />} />
//         <Route path="/post/:postId" element={token ? <PostDetail /> : <Navigate to="/auth" />} />
//         <Route path='/ai-assist' element={token ? <Chatbot/> : <Navigate to='/auth'/> } />
//         <Route path='/post-question' element={token ? <PostQuestionPage/>: <Navigate to='/auth'/>}/>
//         <Route path='/all-approved-community-posts' element={<CommunityPostPage/>}/>
//       </Routes>
//       </LanguageProvider>
//     </Router>
//   );
// };

// const Home = ({ role }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/posts/approved', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching approved posts:', error);
//         alert('Failed to load approved posts');
//       }
//     };
//     fetchPosts();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Post submitted for review');
//       setTitle('');
//       setDescription('');
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Failed to submit post');
//     }
//   };

//   const handleVote = async (postId, voteType) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Create Your Post</h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Title"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter Description"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>

//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Approved Posts</h2>
//         <div className="grid gap-6">
//           {posts.map((post) => (
//             <div key={post._id} className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-300">
//               <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//               <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
//               <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//               <div className="flex items-center space-x-4 mb-4">
//                 <button
//                   onClick={() => handleVote(post._id, 'upvote')}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//                 >
//                   Upvote ({post.upvotes.length})
//                 </button>
//                 <button
//                   onClick={() => handleVote(post._id, 'downvote')}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                   Downvote ({post.downvotes.length})
//                 </button>
//               </div>
//               <Link to={`/post/${post._id}`} className="text-orange-600 hover:underline font-medium">View Details</Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('Failed to load post details');
//       }
//     };
//     fetchPost();
//   }, [postId, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(response.data.post);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to comment');
//     }
//   };

//   if (!post) return <div className="text-center mt-20 text-gray-900 text-2xl">Loading...</div>;

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-3xl mx-auto p-6">
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{post.title}</h2>
//           <p className="text-gray-600 mb-4">{post.description}</p>
//           <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//           <div className="flex items-center space-x-4 mb-6">
//             <button
//               onClick={() => handleVote('upvote')}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//             >
//               Upvote ({post.upvotes.length})
//             </button>
//             <button
//               onClick={() => handleVote('downvote')}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//             >
//               Downvote ({post.downvotes.length})
//             </button>
//           </div>
//           <div className="mb-6">
//             <h3 className="text-2xl font-semibold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Comments</h3>
//             <form onSubmit={handleCommentSubmit} className="mb-4">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment"
//                 className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-24"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
//               >
//                 Post Comment
//               </button>
//             </form>
//             <div className="space-y-4">
//               {(post.comments || []).map((comment) => (
//                 <div key={comment._id} className="p-4 bg-gray-100 rounded-xl shadow-md">
//                   <p className="text-gray-800">{comment.content}</p>
//                   <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [rejectionComments, setRejectionComments] = useState({});

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
//         { status, rejectionComment: status === 'rejected' ? rejectionComments[postId] || '' : '' },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setPosts(posts.filter((post) => post._id !== postId));
//       setRejectionComments(prev => {
//         const newComments = { ...prev };
//         delete newComments[postId];
//         return newComments;
//       });
//       alert(`Post ${status} successfully`);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to review post');
//     }
//   };

//   const handleCommentChange = (postId, value) => {
//     setRejectionComments(prev => ({
//       ...prev,
//       [postId]: value
//     }));
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Admin Dashboard</h2>
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 border border-orange-100">
//           <h3 className="text-2xl font-semibold text-gray-900 mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Pending Posts for Review</h3>
//           {posts.map((post) => (
//             <div key={post._id} className="bg-white/95 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-300">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//               <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
//               <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username}</p>
//               <p className="text-sm text-gray-500 mb-4">Status: {post.status}</p>
//               <div className="space-x-4 mb-4">
//                 <button
//                   onClick={() => handleReview(post._id, 'accepted')}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleReview(post._id, 'rejected')}
//                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//                 >
//                   Reject
//                 </button>
//               </div>
//               <textarea
//                 value={rejectionComments[post._id] || ''}
//                 onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                 placeholder="Reason for rejection"
//                 className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-20"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await axios.get('http://localhost:5000/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setNotifications(response.data);
//     };
//     fetchNotifications();
//   }, [token]);

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Your Notifications</h2>
//         <div className="space-y-6">
//           {notifications.map((notification, index) => (
//             <div key={index} className="bg-white/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-300">
//               <p className="text-gray-800 mb-2">{notification.message}</p>
//               {notification.comment && (
//                 <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
//               )}
//               <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
//               <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import LandingPage from './Pages/LandingPage'
import { LanguageProvider } from './Context/LanguageContext';
import Navbar from  './components/Common/Navbar'
import Chatbot from './components/AiChatInterface/Chatbot';
import PostQuestionPage from './Pages/PostQuestionPage';
import CommunityPostPage from './Pages/CommunityPostPage';
import KnowledgeBasePage from './Pages/KnowledgePage';
import PostDetail from './Pages/PostDetailPage';
import AdminDashboard from './AdminDash/AdminDashboard';
import UserProfilePage from './Pages/UserProfilePage';
import Leaderboard from './Sections/LeaderBoard';
import AutoCompleteSearchBar from './components/SearchBar/AutoCompleteSearchBar';
import SearchAgentsPage from './Pages/SearchAgentsPage';
import RewardsRedeemSection from './Sections/RewardRedeemSection';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <Router>
      <LanguageProvider>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthPage setToken={setToken} setRole={setRole} />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />} />
          <Route path="/profile2" element={token ? <UserProfile /> : <Navigate to="/auth" />} />
          <Route path="/post/:postId" element={token ? <PostDetail /> : <Navigate to="/auth" />} />
          <Route path="/ai-assist" element={token ? <Chatbot token={token} /> : <Navigate to="/auth" />} />
          <Route path="/post-question" element={token ? <PostQuestionPage /> : <Navigate to="/auth" />} />
          <Route path="/all-approved-community-posts" element={<CommunityPostPage />} />
          <Route path='/post/:postId' element={<PostDetail/>}/>
          <Route path='/profile' element={token ? <UserProfilePage/> : <Navigate to='/auth'/>}/>
          <Route path='/leaderboard' element={token ? <Leaderboard/> : <Navigate to='/auth'/>}/>
          <Route path='/agents' element={<SearchAgentsPage/>}/>
          <Route path='/redeem-rewards' element={<RewardsRedeemSection/>}/>
        </Routes>
      </LanguageProvider>
    </Router>
  );
};

const Home = ({ role }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/approved', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching approved posts:', error);
        alert('Failed to load approved posts');
      }
    };
    fetchPosts();
  }, [token]);

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
      const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPosts(updatedPosts.data);
    } catch (error) {
      console.error('Error submitting post:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to submit post');
    }
  };

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
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to vote');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Create Your Post</h2>
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Post
          </button>
        </form>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Approved Posts</h2>
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-300">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
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
              <Link to={`/post/${post._id}`} className="text-orange-600 hover:underline font-medium">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPost(response.data);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('Failed to load post details');
//       }
//     };
//     fetchPost();
//   }, [postId, token]);

//   const handleVote = async (voteType) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/vote`,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(response.data.post);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/posts/${postId}/comments`,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to comment');
//     }
//   };

//   if (!post) return <div className="text-center mt-20 text-gray-900 text-2xl">Loading...</div>;

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-3xl mx-auto p-6">
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{post.title}</h2>
//           <p className="text-gray-600 mb-4">{post.description}</p>
//           <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//           <div className="flex items-center space-x-4 mb-6">
//             <button
//               onClick={() => handleVote('upvote')}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
//             >
//               Upvote ({post.upvotes.length})
//             </button>
//             <button
//               onClick={() => handleVote('downvote')}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
//             >
//               Downvote ({post.downvotes.length})
//             </button>
//           </div>
//           <div className="mb-6">
//             <h3 className="text-2xl font-semibold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Comments</h3>
//             <form onSubmit={handleCommentSubmit} className="mb-4">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment"
//                 className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-24"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
//               >
//                 Post Comment
//               </button>
//             </form>
//             <div className="space-y-4">
//               {(post.comments || []).map((comment) => (
//                 <div key={comment._id} className="p-4 bg-gray-100 rounded-xl shadow-md">
//                   <p className="text-gray-800">{comment.content}</p>
//                   <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Your Notifications</h2>
        <div className="space-y-6">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-white/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-300">
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
    </div>
  );
};

export default App;

