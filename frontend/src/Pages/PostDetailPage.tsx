
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
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

//   const handleVote = async (voteType, commentId = null) => {
//     try {
//       const url = commentId
//         ? `http://localhost:5000/api/comments/${commentId}/vote`
//         : `http://localhost:5000/api/posts/${postId}/vote`;
//       const response = await axios.post(
//         url,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         ...(commentId ? {} : { upvotes: response.data.post.upvotes, downvotes: response.data.post.downvotes }),
//         comments: prev.comments.map(comment =>
//           comment._id === commentId ? { ...comment, upvotes: response.data.comment.upvotes, downvotes: response.data.comment.downvotes } : comment
//         )
//       }));
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleCommentSubmit = async (e, parentId = null) => {
//     e.preventDefault();
//     try {
//       const url = parentId
//         ? `http://localhost:5000/api/comments/${parentId}/replies`
//         : `http://localhost:5000/api/posts/${postId}/comments`;
//       const response = await axios.post(
//         url,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => ({
//         ...prev,
//         comments: parentId
//           ? prev.comments.map(comment =>
//               comment._id === parentId
//                 ? { ...comment, replies: [...(comment.replies || []), response.data.comment] }
//                 : comment
//             )
//           : [response.data.comment, ...(prev.comments || [])]
//       }));
//       setNewComment('');
//       setReplyTo(null);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to comment');
//     }
//   };

//   if (!post) return <div className="text-center mt-20 text-gray-900 text-2xl">Loading...</div>;

//   const renderCommentThread = (comments, depth = 0) => {
//     return comments.map(comment => (
//       <div key={comment._id} className="p-4 bg-gray-100 rounded-xl shadow-md ml-4" style={{ marginLeft: `${depth * 20}px` }}>
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <p className="text-gray-800">{comment.content}</p>
//             <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//           </div>
//           <div className="ml-4 text-right">
//             <button
//               onClick={() => handleVote('upvote', comment._id)}
//               className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600 transition duration-200 flex items-center mr-2"
//             >
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//               </svg>
//               {comment.upvotes.length}
//             </button>
//             <button
//               onClick={() => handleVote('downvote', comment._id)}
//               className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition duration-200 flex items-center"
//             >
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//               {comment.downvotes.length}
//             </button>
//           </div>
//         </div>
//         <button
//           onClick={() => setReplyTo(comment._id)}
//           className="text-blue-600 hover:underline text-sm mt-2"
//         >
//           Reply
//         </button>
//         {replyTo === comment._id && (
//           <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-2">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a reply..."
//               className="w-full p-2 border-2 border-blue-200/50 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-16"
//             />
//             <button
//               type="submit"
//               className="mt-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white p-2 rounded-xl hover:from-blue-600 hover:to-blue-400 transition-all duration-300"
//             >
//               Post Reply
//             </button>
//             <button
//               type="button"
//               onClick={() => setReplyTo(null)}
//               className="ml-2 text-gray-500 hover:text-gray-700"
//             >
//               Cancel
//             </button>
//           </form>
//         )}
//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-2">
//             <button
//               onClick={() => setPost(prev => ({
//                 ...prev,
//                 comments: prev.comments.map(c => c._id === comment._id ? { ...c, collapsed: !c.collapsed } : c)
//               }))}
//               className="text-blue-600 hover:underline text-sm"
//             >
//               {comment.collapsed ? 'Show Replies' : 'Hide Replies'} ({comment.replies.length})
//             </button>
//             {!comment.collapsed && renderCommentThread(comment.replies, depth + 1)}
//           </div>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden p-6">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Crect width=\\'100\\' height=\\'100\\' fill=\\'none\\'/%3E%3Cpath d=\\'M0 0 L50 50 L100 0 Z\\' fill=\\'rgba(251, 146, 60, 0.7)\\'/ %3E%3Cpath d=\\'M0 100 L50 50 L100 100 Z\\' fill=\\'rgba(251, 146, 60, 0.7)\\'/ %3E%3C/svg%3E')] opacity-20" />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-3xl mx-auto">
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
//           <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">{post.title}</h2>
//           <p className="text-gray-600 mb-4">{post.description}</p>
//           <p className="text-sm text-gray-500 mb-4">Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => handleVote('upvote')}
//                 className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition duration-200 flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                 </svg>
//                 {post.upvotes.length}
//               </button>
//               <button
//                 onClick={() => handleVote('downvote')}
//                 className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition duration-200 flex items-center"
//               >
//                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//                 {post.downvotes.length}
//               </button>
//             </div>
//             <div className="text-sm text-gray-500">Answers: {post.comments?.length || 0}</div>
//           </div>
//           <div className="mb-6">
//             <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">Comments</h3>
//             <form onSubmit={handleCommentSubmit} className="mb-4">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment..."
//                 className="w-full p-4 border-2 border-blue-200/50 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-24"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 bg-gradient-to-r from-blue-500 to-blue-300 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-400 transition-all duration-300"
//               >
//                 Post Comment
//               </button>
//             </form>
//             <div className="space-y-4">
//               {renderCommentThread(post.comments || [])}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;




// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const PostDetail = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
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

//   const handleVote = async (voteType, commentId = null, replyId = null) => {
//     try {
//       let url, dataKey;
//       if (replyId) {
//         url = `http://localhost:5000/api/comments/${replyId}/vote`;
//         dataKey = 'reply';
//       } else if (commentId) {
//         url = `http://localhost:5000/api/comments/${commentId}/vote`;
//         dataKey = 'comment';
//       } else {
//         url = `http://localhost:5000/api/posts/${postId}/vote`;
//         dataKey = 'post';
//       }
//       const response = await axios.post(
//         url,
//         { voteType },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => {
//         if (dataKey === 'post') {
//           return { ...prev, ...response.data.post };
//         } else {
//           return {
//             ...prev,
//             comments: prev.comments.map(comment =>
//               comment._id === commentId
//                 ? replyId
//                   ? {
//                       ...comment,
//                       replies: comment.replies.map(r => r._id === replyId ? { ...r, ...response.data.reply } : r)
//                     }
//                   : { ...comment, ...response.data.comment }
//                 : comment
//             )
//           };
//         }
//       });
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to vote');
//     }
//   };

//   const handleCommentSubmit = async (e, parentId = null, replyToId = null) => {
//     e.preventDefault();
//     try {
//       const url = replyToId
//         ? `http://localhost:5000/api/comments/${replyToId}/replies`
//         : parentId
//         ? `http://localhost:5000/api/comments/${parentId}/replies`
//         : `http://localhost:5000/api/posts/${postId}/comments`;
//       const response = await axios.post(
//         url,
//         { content: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPost(prev => {
//         if (replyToId) {
//           return {
//             ...prev,
//             comments: prev.comments.map(comment =>
//               comment._id === parentId
//                 ? {
//                     ...comment,
//                     replies: comment.replies.map(r =>
//                       r._id === replyToId ? { ...r, replies: [...(r.replies || []), response.data.comment] } : r
//                     )
//                   }
//                 : comment
//             )
//           };
//         } else if (parentId) {
//           return {
//             ...prev,
//             comments: prev.comments.map(comment =>
//               comment._id === parentId
//                 ? { ...comment, replies: [...(comment.replies || []), response.data.comment] }
//                 : comment
//             )
//           };
//         } else {
//           return { ...prev, comments: [response.data.comment, ...(prev.comments || [])] };
//         }
//       });
//       setNewComment('');
//       setReplyTo(null);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to comment');
//     }
//   };

//   if (!post) return <div className="text-center mt-20 text-gray-900 text-2xl">Loading...</div>;

//   const renderCommentThread = (comments, depth = 0) => {
//     return comments.map(comment => (
//       <div
//         key={comment._id}
//         className={`p-4 bg-white/90 rounded-xl shadow-md transition-all duration-300 ease-in-out ${
//           depth > 0 ? 'ml-8 border-l-2 border-blue-200' : ''
//         }`}
//         style={{ marginLeft: `${depth * 20}px` }}
//       >
//         <div className="flex items-start justify-between">
//           <div className="flex-1 space-y-2">
//             <p className="text-gray-800 text-lg">{comment.content}</p>
//             <p className="text-sm text-gray-500">By {comment.userId.username} on {new Date(comment.createdAt).toLocaleString()}</p>
//           </div>
//           <div className="ml-4 flex flex-col items-end space-y-2">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handleVote('upvote', comment.parentId || post._id, comment._id)}
//                 className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-105 flex items-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                 </svg>
//                 <span className="ml-1">{comment.upvotes.length}</span>
//               </button>
//               <button
//                 onClick={() => handleVote('downvote', comment.parentId || post._id, comment._id)}
//                 className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//                 <span className="ml-1">{comment.downvotes.length}</span>
//               </button>
//             </div>
//             <button
//               onClick={() => setReplyTo({ parentId: comment.parentId || post._id, commentId: comment._id })}
//               className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
//             >
//               Reply
//             </button>
//           </div>
//         </div>
//         {replyTo && replyTo.commentId === comment._id && (
//           <form onSubmit={(e) => handleCommentSubmit(e, comment.parentId || post._id, comment._id)} className="mt-4">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a reply..."
//               className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//             />
//             <div className="mt-2 flex space-x-2">
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
//               >
//                 Post Reply
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setReplyTo(null)}
//                 className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-4">
//             <button
//               onClick={() => setPost(prev => ({
//                 ...prev,
//                 comments: prev.comments.map(c =>
//                   c._id === comment._id ? { ...c, collapsed: !c.collapsed } : c
//                 )
//               }))}
//               className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center"
//             >
//               {comment.collapsed ? 'Show Replies' : 'Hide Replies'} ({comment.replies.length})
//               <svg className={`w-4 h-4 ml-1 transition-transform ${comment.collapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {!comment.collapsed && renderCommentThread(comment.replies, depth + 1)}
//           </div>
//         )}
//       </div>
//     ));
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
//       <div className="relative z-10 max-w-4xl mx-auto p-6 lg:p-10">
//         <div className="bg-white/95 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-lg transition-all duration-300">
//           <h2 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">{post.title}</h2>
//           <p className="text-gray-600 text-base lg:text-lg mb-4">{post.description}</p>
//           <div className="flex items-center justify-between mb-6">
//             <div className="text-sm text-gray-500">
//               Posted by: {post.userId.username} on {new Date(post.createdAt).toLocaleString()}
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => handleVote('upvote')}
//                 className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-105 flex items-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                 </svg>
//                 <span className="ml-1">{post.upvotes.length}</span>
//               </button>
//               <button
//                 onClick={() => handleVote('downvote')}
//                 className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                 </svg>
//                 <span className="ml-1">{post.downvotes.length}</span>
//               </button>
//             </div>
//           </div>
//           <div className="mb-6">
//             <h3 className="text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">Comments</h3>
//             <form onSubmit={handleCommentSubmit} className="mb-6">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment..."
//                 className="w-full p-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-24 resize-none"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
//               >
//                 Post Comment
//               </button>
//             </form>
//             <div className="space-y-6">
//               {renderCommentThread(post.comments || [])}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostDetail;



"use client"


// import { useState } from "react"
// import { Card, CardContent, CardHeader } from  '../Components/ui/card'
// import { Button } from  '../Components/ui/button'
// import { Textarea } from '../Components/ui/textarea'
// import { Badge } from  '../Components/ui/badge'
// import { ArrowUp, ArrowDown, MessageCircle, Reply, ChevronDown, ChevronRight, User, Calendar } from "lucide-react"



//  Mock data - replace with your actual API calls
// const mockPost = {
//   _id: "1",
//   title: "How to implement authentication in React?",
//   description:
//     "I'm struggling with implementing JWT authentication in my React application. Can someone guide me through the best practices? I've tried several approaches but I'm not sure which one is the most secure and efficient.",
//   userId: { username: "john_dev" },
//   upvotes: { length: 15 },
//   downvotes: { length: 2 },
//   createdAt: "2024-01-15T10:30:00Z",
//   comments: [
//     {
//       _id: "c1",
//       content:
//         "You should definitely use JWT tokens with httpOnly cookies for better security. Here's what I recommend...",
//       userId: { username: "sarah_security" },
//       upvotes: { length: 8 },
//       downvotes: { length: 0 },
//       createdAt: "2024-01-15T11:15:00Z",
//       replies: [
//         {
//           _id: "r1",
//           content: "Great advice! I would also add that you should implement refresh token rotation.",
//           userId: { username: "mike_auth" },
//           upvotes: { length: 3 },
//           downvotes: { length: 0 },
//           createdAt: "2024-01-15T12:00:00Z",
//           replies: [
//             {
//               _id: "r2",
//               content: "And don't forget to validate tokens on every request.",
//               userId: { username: "alex_dev" },
//               upvotes: { length: 2 },
//               downvotes: { length: 0 },
//               createdAt: "2024-01-15T12:30:00Z",
//               replies: [],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       _id: "c2",
//       content: "I prefer using NextAuth.js for React applications. It handles most of the complexity for you.",
//       userId: { username: "emma_react" },
//       upvotes: { length: 5 },
//       downvotes: { length: 1 },
//       createdAt: "2024-01-15T13:45:00Z",
//       replies: [],
//     },
//   ],
// }

// interface Comment {
//   _id: string
//   content: string
//   userId: { username: string }
//   upvotes: { length: number }
//   downvotes: { length: number }
//   createdAt: string
//   replies: Comment[]
// }

// interface ReplyState {
//   commentId: string
//   isOpen: boolean
// }

// export default function PostDetail() {
//   const [post, setPost] = useState(mockPost)
//   const [newComment, setNewComment] = useState("")
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([])
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())
//   const [loading, setLoading] = useState(false)

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId?: string,
//     targetType: "post" | "comment" = "post",
//   ) => {
//     console.log(`Voting ${type} on ${targetType} ${targetId || post._id}`)
//     // Implement your voting logic here
//   }

//   const handleCommentSubmit = async (e: React.FormEvent, parentId?: string) => {
//     e.preventDefault()
//     if (!newComment.trim()) return

//     console.log("Submitting comment:", newComment, "Parent:", parentId)
//     // Implement your comment submission logic here

//     setNewComment("")
//     setReplyStates((prev) => prev.filter((r) => r.commentId !== parentId))
//   }

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId)
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId)
//       } else {
//         return [...prev, { commentId, isOpen: true }]
//       }
//     })
//   }

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId)
//       } else {
//         newSet.add(commentId)
//       }
//       return newSet
//     })
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffHours / 24)

//     if (diffHours < 1) return "Just now"
//     if (diffHours < 24) return `${diffHours}h ago`
//     if (diffDays < 7) return `${diffDays}d ago`
//     return date.toLocaleDateString()
//   }

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id)
//     const replyState = replyStates.find((r) => r.commentId === comment._id)
//     const hasReplies = comment.replies && comment.replies.length > 0
//     const maxDepth = 6

//     return (
//       <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               {/* Avatar placeholder */}
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 {/* Comment Header */}
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId.username}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>

//                 {/* Comment Content */}
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>

//                 {/* Comment Actions */}
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes.length}</span>
//                   </Button>

//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes.length}</span>
//                   </Button>

//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>

//                 {/* Reply Form */}
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Nested Replies */}
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         {/* Post Card */}
//         <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//           <CardHeader className="pb-4">
//             <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">{post.title}</h1>
//             <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//               <div className="flex items-center gap-1">
//                 <User className="w-4 h-4" />
//                 <span>{post.userId.username}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formatDate(post.createdAt)}</span>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <p className="text-slate-700 leading-relaxed mb-6">{post.description}</p>

//             <div className="flex items-center gap-3">
//               <Button
//                 variant="ghost"
//                 onClick={() => handleVote("upvote")}
//                 className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//               >
//                 <ArrowUp className="w-4 h-4 mr-1" />
//                 {post.upvotes.length}
//               </Button>

//               <Button
//                 variant="ghost"
//                 onClick={() => handleVote("downvote")}
//                 className="text-red-500 hover:text-red-600 hover:bg-red-50"
//               >
//                 <ArrowDown className="w-4 h-4 mr-1" />
//                 {post.downvotes.length}
//               </Button>

//               <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                 <MessageCircle className="w-3 h-3 mr-1" />
//                 {post.comments.length} comments
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Add Comment Form */}
//         <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//           <CardHeader>
//             <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleCommentSubmit}>
//               <Textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Share your thoughts or ask a question..."
//                 className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//               />
//               <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                 Post Comment
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Comments Section */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-2">
//             <h2 className="text-xl font-semibold text-slate-800">Comments ({post.comments.length})</h2>
//           </div>

//           {post.comments.length > 0 ? (
//             <div className="space-y-4">
//               {post.comments.map((comment) => (
//                 <CommentComponent key={comment._id} comment={comment} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//               <p className="text-slate-500">Be the first to share your thoughts!</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Textarea } from "../Components/ui/textarea"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight, Sidebar } from "lucide-react"
// import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import Sidebar2 from "@/Components/Common/Sidebar"


// const API_BASE_URL = 'http://localhost:5000/api'

// interface UserObj {
//   username: string
// }

// interface Comment {
//   _id: string
//   content: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   replies: Comment[]
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   comments: Comment[]
// }

// interface ReplyState {
//   commentId: string
//   isOpen: boolean
// }

// const getAuthToken = () => localStorage.getItem('token')

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default function PostDetail() {
//   const { postId } = useParams<{ postId: string }>()
//   const [post, setPost] = useState<Post | null>(null)
//   const [newComment, setNewComment] = useState<string>("")
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([])
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())
//   const [loading, setLoading] = useState<boolean>(false)

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true)
//       try {
//         const response = await api.get(`/posts/${postId}`)
//         setPost(response.data)
//       } catch (error) {
//         toast.error('Failed to load post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (postId) fetchPost()
//   }, [postId])

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId: string = postId || "",
//     targetType: "post" | "comment" = "post",
//   ) => {
//     try {
//       let response: 
//         | { data: { post: Post } }
//         | { data: { comment: Comment } }
//         | undefined;
//       if (targetType === 'post') {
//         response = await api.post(`/posts/${targetId}/vote`, { voteType: type })
//         if (response?.data && 'post' in response.data) {
//           setPost(response.data.post)
//           toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//             position: 'top-right',
//             style: { background: '#dcfce7', color: '#15803d' }
//           })
//         }
//       } else {
//         response = await api.post(`/comments/${targetId}/vote`, { voteType: type })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost)
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         const message = error.response.data.message || 'Invalid vote action.';
//         if (message.includes('Already')) {
//           toast.error(`You have already ${type}d this ${targetType}.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('This post or comment is not available for voting.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//       } else if (error.response?.status === 401) {
//         toast.error('Please log in to vote.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } else {
//         toast.error(`Failed to record ${type}. Please try again.`, {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//       console.error(`Error ${type} ${targetType}:`, error)
//     }
//   }

//   const handleCommentSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     parentId?: string
//   ) => {
//     e.preventDefault()
//     if (!newComment.trim() || !postId) {
//       toast.error('Please enter a comment.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       })
//       return
//     }

//     try {
//       let response: { data: { reply: Comment } } | { data: { comment: Comment } };
//       if (parentId) {
//         response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: newComment })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), (response as { data: { reply: Comment } }).data.reply] }
//               : comment
//           )
//         }) : prevPost)
//         toast.success('Reply posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       } else {
//         response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment })
//         setPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), (response as { data: { comment: Comment } }).data.comment],
//               } as Post)
//             : prevPost
//         )
//         toast.success('Comment posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       }
//       setNewComment("")
//       setReplyStates(prev => prev.filter(r => r.commentId !== parentId))
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         toast.error('Please log in to comment.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid comment or post not available.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } else {
//         toast.error('Failed to post comment. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//       console.error('Error submitting comment:', error)
//     }
//   }

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId)
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId)
//       } else {
//         return [...prev, { commentId, isOpen: true }]
//       }
//     })
//   }

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId)
//       } else {
//         newSet.add(commentId)
//       }
//       return newSet
//     })
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffHours / 24)

//     if (diffHours < 1) return "Just now"
//     if (diffHours < 24) return `${diffHours}h ago`
//     if (diffDays < 7) return `${diffDays}d ago`
//     return date.toLocaleDateString()
//   }

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id)
//     const replyState = replyStates.find((r) => r.commentId === comment._id)
//     const hasReplies = comment.replies && comment.replies.length > 0
//     const maxDepth = 6

//     return (
//       <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
//                   </Button>
//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (loading) return <div className="text-center py-12">Loading...</div>
//   if (!post) return <div className="text-center py-12">Post not found</div>

//   return (
//     <div>
//       <Sidebar2/>

// <div className="min-h-screen relative overflow-hidden">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//           <CardHeader className="pb-4">
//             <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{post.title}</h1>
//             <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//               <div className="flex items-center gap-1">
//                 <User className="w-4 h-4" />
//                 <span>{post.userId?.username || 'Anonymous'}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formatDate(post.createdAt)}</span>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-700 leading-relaxed mb-6">{post.description}</p>
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="ghost"
//                 onClick={() => handleVote("upvote")}
//                 className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//               >
//                 <ArrowUp className="w-4 h-4 mr-1" />
//                 {post.upvotes?.length || 0}
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={() => handleVote("downvote")}
//                 className="text-red-500 hover:text-red-600 hover:bg-red-50"
//               >
//                 <ArrowDown className="w-4 h-4 mr-1" />
//                 {post.downvotes?.length || 0}
//               </Button>
//               <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                 <MessageCircle className="w-3 h-3 mr-1" />
//                 {post.comments?.length || 0} comments
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//           <CardHeader>
//             <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleCommentSubmit}>
//               <Textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Share your thoughts or ask a question..."
//                 className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//               />
//               <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                 Post Comment
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//         <div className="space-y-6">
//           <div className="flex items-center gap-2">
//             <h2 className="text-xl font-semibold text-slate-800">Comments ({post.comments?.length || 0})</h2>
//           </div>
//           {post.comments && post.comments.length > 0 ? (
//             <div className="space-y-4">
//               {post.comments.map((comment) => (
//                 <CommentComponent key={comment._id} comment={comment} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//               <p className="text-slate-500">Be the first to share your thoughts!</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     </div>
    
//   )
// }





// import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Textarea } from "../Components/ui/textarea"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight, Sidebar } from "lucide-react"
// import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import Sidebar2 from "@/Components/Common/Sidebar"

// const API_BASE_URL = 'http://localhost:5000/api'

// interface UserObj {
//   username: string
// }

// interface Comment {
//   _id: string
//   content: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   replies: Comment[]
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   comments: Comment[]
// }

// interface ReplyState {
//   commentId: string
//   isOpen: boolean
// }

// const getAuthToken = () => localStorage.getItem('token')

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default function PostDetail() {
//   const { postId } = useParams<{ postId: string }>()
//   const [post, setPost] = useState<Post | null>(null)
//   const [newComment, setNewComment] = useState<string>("")
//   const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({})
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([])
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())
//   const [loading, setLoading] = useState<boolean>(false)

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true)
//       try {
//         const response = await api.get(`/posts/${postId}`)
//         setPost(response.data)
//       } catch (error) {
//         toast.error('Failed to load post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (postId) fetchPost()
//   }, [postId])

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId: string = postId || "",
//     targetType: "post" | "comment" = "post",
//   ) => {
//     try {
//       let response: 
//         | { data: { post: Post } }
//         | { data: { comment: Comment } }
//         | undefined;
//       if (targetType === 'post') {
//         response = await api.post(`/posts/${targetId}/vote`, { voteType: type })
//         if (response?.data && 'post' in response.data) {
//           setPost(response.data.post)
//           toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//             position: 'top-right',
//             style: { background: '#dcfce7', color: '#15803d' }
//           })
//         }
//       } else {
//         response = await api.post(`/comments/${targetId}/vote`, { voteType: type })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost)
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         const message = error.response.data.message || 'Invalid vote action.';
//         if (message.includes('Already')) {
//           toast.error(`You have already ${type}d this ${targetType}.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('This post or comment is not available for voting.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//       } else if (error.response?.status === 401) {
//         toast.error('Please log in to vote.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } else {
//         toast.error(`Failed to record ${type}. Please try again.`, {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//       console.error(`Error ${type} ${targetType}:`, error)
//     }
//   }

//   const handleCommentSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     parentId?: string
//   ) => {
//     e.preventDefault()
//     if (parentId) {
//       const replyContent = replyContents[parentId]?.trim()
//       if (!replyContent) {
//         toast.error('Please enter a reply.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//         return
//       }
//       try {
//         const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost)
//         setReplyContents(prev => ({ ...prev, [parentId]: "" }))
//         setReplyStates(prev => prev.filter(r => r.commentId !== parentId))
//         toast.success('Reply posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to reply.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid reply or comment not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to post reply. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//         console.error('Error submitting reply:', error)
//       }
//     } else {
//       if (!newComment.trim() || !postId) {
//         toast.error('Please enter a comment.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//         return
//       }
//       try {
//         const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment })
//         setPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         )
//         setNewComment("")
//         toast.success('Comment posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to comment.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid comment or post not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to post comment. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//         console.error('Error submitting comment:', error)
//       }
//     }
//   }

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId)
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId)
//       } else {
//         return [...prev, { commentId, isOpen: true }]
//       }
//     })
//   }

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId)
//       } else {
//         newSet.add(commentId)
//       }
//       return newSet
//     })
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffHours / 24)

//     if (diffHours < 1) return "Just now"
//     if (diffHours < 24) return `${diffHours}h ago`
//     if (diffDays < 7) return `${diffDays}d ago`
//     return date.toLocaleDateString()
//   }

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id)
//     const replyState = replyStates.find((r) => r.commentId === comment._id)
//     const hasReplies = comment.replies && comment.replies.length > 0
//     const maxDepth = 6

//     return (
//       <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
//                   </Button>
//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={replyContents[comment._id] || ""}
//                       onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (loading) return <div className="text-center py-12">Loading...</div>
//   if (!post) return <div className="text-center py-12">Post not found</div>

//   return (
//     <div>
//       <Sidebar2/>
//       <div className="min-h-screen relative overflow-hidden">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto p-6">
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//             <CardHeader className="pb-4">
//               <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{post.title}</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//                 <div className="flex items-center gap-1">
//                   <User className="w-4 h-4" />
//                   <span>{post.userId?.username || 'Anonymous'}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>{formatDate(post.createdAt)}</span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-700 leading-relaxed mb-6">{post.description}</p>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("upvote")}
//                   className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                 >
//                   <ArrowUp className="w-4 h-4 mr-1" />
//                   {post.upvotes?.length || 0}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("downvote")}
//                   className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                 >
//                   <ArrowDown className="w-4 h-4 mr-1" />
//                   {post.downvotes?.length || 0}
//                 </Button>
//                 <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                   <MessageCircle className="w-3 h-3 mr-1" />
//                   {post.comments?.length || 0} comments
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8">
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCommentSubmit}>
//                 <Textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Share your thoughts or ask a question..."
//                   className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//                 />
//                 <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                   Post Comment
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-semibold text-slate-800">Comments ({post.comments?.length || 0})</h2>
//             </div>
//             {post.comments && post.comments.length > 0 ? (
//               <div className="space-y-4">
//                 {post.comments.map((comment) => (
//                   <CommentComponent key={comment._id} comment={comment} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//                 <p className="text-slate-500">Be the first to share your thoughts!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Textarea } from "../Components/ui/textarea"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight } from "lucide-react"
// import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import Sidebar2 from "@/Components/Common/Sidebar"

// const API_BASE_URL = 'http://localhost:5000/api'

// interface UserObj {
//   username: string
// }

// interface Comment {
//   _id: string
//   content: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   replies: Comment[]
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   schemeName: string
//   userId: UserObj
//   upvotes: any[]
//   downvotes: any[]
//   createdAt: string
//   comments: Comment[]
// }

// interface ReplyState {
//   commentId: string
//   isOpen: boolean
// }

// const getAuthToken = () => localStorage.getItem('token')

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default function PostDetail() {
//   const { postId } = useParams<{ postId: string }>()
//   const [post, setPost] = useState<Post | null>(null)
//   const [newComment, setNewComment] = useState<string>("")
//   const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({})
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([])
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set())
//   const [loading, setLoading] = useState<boolean>(false)

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true)
//       try {
//         const response = await api.get(`/posts/${postId}`)
//         setPost(response.data)
//       } catch (error) {
//         toast.error('Failed to load post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (postId) fetchPost()
//   }, [postId])

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId: string = postId || "",
//     targetType: "post" | "comment" = "post",
//   ) => {
//     try {
//       let response: 
//         | { data: { post: Post } }
//         | { data: { comment: Comment } }
//         | undefined;
//       if (targetType === 'post') {
//         response = await api.post(`/posts/${targetId}/vote`, { voteType: type })
//         if (response?.data && 'post' in response.data) {
//           setPost(response.data.post)
//           toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//             position: 'top-right',
//             style: { background: '#dcfce7', color: '#15803d' }
//           })
//         }
//       } else {
//         response = await api.post(`/comments/${targetId}/vote`, { voteType: type })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost)
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         const message = error.response.data.message || 'Invalid vote action.';
//         if (message.includes('Already')) {
//           toast.error(`You have already ${type}d this ${targetType}.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('This post or comment is not available for voting.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//       } else if (error.response?.status === 401) {
//         toast.error('Please log in to vote.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } else {
//         toast.error(`Failed to record ${type}. Please try again.`, {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//       console.error(`Error ${type} ${targetType}:`, error)
//     }
//   }

//   const handleCommentSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     parentId?: string
//   ) => {
//     e.preventDefault()
//     if (parentId) {
//       const replyContent = replyContents[parentId]?.trim()
//       if (!replyContent) {
//         toast.error('Please enter a reply.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//         return
//       }
//       try {
//         const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent })
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost)
//         setReplyContents(prev => ({ ...prev, [parentId]: "" }))
//         setReplyStates(prev => prev.filter(r => r.commentId !== parentId))
//         toast.success('Reply posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to reply.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid reply or comment not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to post reply. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//         console.error('Error submitting reply:', error)
//       }
//     } else {
//       if (!newComment.trim() || !postId) {
//         toast.error('Please enter a comment.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//         return
//       }
//       try {
//         const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment })
//         setPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         )
//         setNewComment("")
//         toast.success('Comment posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         })
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to comment.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid comment or post not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to post comment. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//         console.error('Error submitting comment:', error)
//       }
//     }
//   }

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId)
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId)
//       } else {
//         return [...prev, { commentId, isOpen: true }]
//       }
//     })
//   }

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId)
//       } else {
//         newSet.add(commentId)
//       }
//       return newSet
//     })
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

//     if (diffHours < 1) return "Just now"
//     if (diffHours < 24) return `${diffHours}h ago`
//     if (diffDays < 7) return `${diffDays}d ago`
//     return date.toLocaleDateString()
//   }

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id)
//     const replyState = replyStates.find((r) => r.commentId === comment._id)
//     const hasReplies = comment.replies && comment.replies.length > 0
//     const maxDepth = 6

//     return (
//       <div className={`${depth > 0 ? "ml S-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
//                   </Button>
//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={replyContents[comment._id] || ""}
//                       onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (loading) return <div className="text-center py-12">Loading...</div>
//   if (!post) return <div className="text-center py-12">Post not found</div>

//   return (
//     <div>
//       <Sidebar2 />
//       <div className="min-h-screen relative overflow-hidden">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto p-6">
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader className="pb-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
//                   {post.schemeName}
//                 </Badge>
//               </div>
//               <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{post.title}</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//                 <div className="flex items-center gap-1">
//                   <User className="w-4 h-4" />
//                   <span>{post.userId?.username || 'Anonymous'}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>{formatDate(post.createdAt)}</span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{post.description}</p>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("upvote")}
//                   className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                 >
//                   <ArrowUp className="w-4 h-4 mr-1" />
//                   {post.upvotes?.length || 0}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("downvote")}
//                   className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                 >
//                   <ArrowDown className="w-4 h-4 mr-1" />
//                   {post.downvotes?.length || 0}
//                 </Button>
//                 <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                   <MessageCircle className="w-3 h-3 mr-1" />
//                   {post.comments?.length || 0} comments
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCommentSubmit}>
//                 <Textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Share your thoughts or ask a question..."
//                   className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//                 />
//                 <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                   Post Comment
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-semibold text-slate-800">Comments ({post.comments?.length || 0})</h2>
//             </div>
//             {post.comments && post.comments.length > 0 ? (
//               <div className="space-y-4">
//                 {post.comments.map((comment) => (
//                   <CommentComponent key={comment._id} comment={comment} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//                 <p className="text-slate-500">Be the first to share your thoughts!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Card, CardContent, CardHeader } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";
// import { Textarea } from "../Components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
// import { Badge } from "../Components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight } from "lucide-react";
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar2 from "@/Components/Common/Sidebar";
// import { SarvamAIClient } from "sarvamai";

// const API_BASE_URL = 'http://localhost:5000/api';
// const SARVAM_API_KEY = 'sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP';
// const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

// const getAuthToken = () => localStorage.getItem('token');

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// interface UserObj {
//   username: string;
// }

// interface Comment {
//   _id: string;
//   content: string;
//   userId: UserObj;
//   upvotes: any[];
//   downvotes: any[];
//   createdAt: string;
//   replies: Comment[];
//   language?: string; // Optional source language
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId: UserObj;
//   upvotes: any[];
//   downvotes: any[];
//   createdAt: string;
//   comments: Comment[];
//   language?: string; // Optional source language
// }

// interface ReplyState {
//   commentId: string;
//   isOpen: boolean;
// }

// const chunkText = (text: any, maxLength: number = 2000): string[] => {
//   if (typeof text !== 'string' || !text) {
//     return [''];
//   }
//   const chunks: string[] = [];
//   let currentChunk = '';
//   const sentences = text.split('.').map(s => s.trim()).filter(s => s);

//   for (const sentence of sentences) {
//     if ((currentChunk + sentence).length <= maxLength) {
//       currentChunk += (currentChunk ? '. ' : '') + sentence;
//     } else {
//       if (currentChunk) chunks.push(currentChunk);
//       currentChunk = sentence;
//     }
//   }
//   if (currentChunk) chunks.push(currentChunk);
//   return chunks;
// };

// const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
//   if (!text) return '';
//   const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`;
//   const cached = localStorage.getItem(cacheKey);
//   if (cached) return cached;

//   try {
//     const response = await client.text.translate({
//       input: text,
//       source_language_code: sourceLang as any ,
//       target_language_code: targetLang as any ,
//       model: 'sarvam-translate:v1',
//       enable_preprocessing: true,
//       numerals_format: 'international',
//     });
//     const translatedText = response.translated_text;
//     localStorage.setItem(cacheKey, translatedText);
//     return translatedText;
//   } catch (error: any) {
//     console.error('Sarvam AI Translation error:', error);
//     let errorMessage = 'Translation failed';
//     if (error.response?.data?.error?.message) {
//       errorMessage = `Translation error: ${error.response.data.error.message}`;
//     }
//     toast.error(errorMessage, {
//       position: 'top-right',
//       style: { background: '#fee2e2', color: '#dc2626' },
//     });
//     return text; // Fallback to original text
//   }
// };

// const translateComment = async (comment: Comment, targetLang: string): Promise<Comment> => {
//   const sourceLang = comment.language || 'en-IN';
//   const translatedComment = { ...comment };

//   // Translate content
//   const contentChunks = chunkText(comment.content);
//   const translatedContentChunks = await Promise.all(
//     contentChunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//   );
//   translatedComment.content = translatedContentChunks.join('. ');

//   // Translate replies recursively
//   if (comment.replies && comment.replies.length > 0) {
//     translatedComment.replies = await Promise.all(
//       comment.replies.map(reply => translateComment(reply, targetLang))
//     );
//   }

//   return translatedComment;
// };

// const translatePost = async (post: Post, targetLang: string): Promise<Post> => {
//   const sourceLang = post.language || 'en-IN';
//   // const fieldsToTranslate = ['title', 'description', 'schemeName'];
//   const translatedPost = { ...post };

//   // for (const field of fieldsToTranslate) {
//   //   const text = post[field];
//   //   if (typeof text !== 'string' || !text) {
//   //     translatedPost[field] = '';
//   //     continue;
//   //   }
//   //   const chunks = chunkText(text);
//   //   const translatedChunks = await Promise.all(
//   //     chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//   //   );
//   //   translatedPost[field] = translatedChunks.join('. ');
    



//   // }

//   type TranslatableField = keyof Pick<Post, 'title' | 'description' | 'schemeName'>;
// const fieldsToTranslate: TranslatableField[] = ['title', 'description', 'schemeName'];

// for (const field of fieldsToTranslate) {
//   const text = post[field] as string | undefined;

//   if (!text) {
//     translatedPost[field] = '';
//     continue;
//   }

//   const chunks = chunkText(text);
//   const translatedChunks = await Promise.all(
//     chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//   );

//   translatedPost[field] = translatedChunks.join('. ');
// }


//   // Translate comments
//   if (post.comments && post.comments.length > 0) {
//     translatedPost.comments = await Promise.all(
//       post.comments.map(comment => translateComment(comment, targetLang))
//     );
//   }

//   return translatedPost;
// };

// export default function PostDetail() {
//   const { postId } = useParams<{ postId: string }>();
//   const [post, setPost] = useState<Post | null>(null);
//   const [displayPost, setDisplayPost] = useState<Post | null>(null);
//   const [newComment, setNewComment] = useState<string>("");
//   const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({});
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([]);
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
//   const [loading, setLoading] = useState<boolean>(false);
//   const [language, setLanguage] = useState("en-IN"); // Default: English

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get(`/posts/${postId}`);
//         setPost(response.data);
//       } catch (error) {
//         toast.error('Failed to load post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (postId) fetchPost();
//   }, [postId]);

//   useEffect(() => {
//     const translatePostData = async () => {
//       if (!post) return;
//       setLoading(true);
//       try {
//         const translated = await translatePost(post, language);
//         setDisplayPost(translated);
//       } catch (error) {
//         console.error('Error translating post:', error);
//         setDisplayPost(post); // Fallback to original post
//         toast.error('Failed to translate post. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePostData();
//   }, [post, language]);

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId: string = postId || "",
//     targetType: "post" | "comment" = "post",
//   ) => {
//     try {
//       let response: 
//         | { data: { post: Post } }
//         | { data: { comment: Comment } }
//         | undefined;
//       if (targetType === 'post') {
//         response = await api.post(`/posts/${targetId}/vote`, { voteType: type });
//         if (response?.data && 'post' in response.data) {
//           setPost(response.data.post);
//           setDisplayPost(response.data.post); // Update display post
//           toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//             position: 'top-right',
//             style: { background: '#dcfce7', color: '#15803d' }
//           });
//         }
//       } else {
//         response = await api.post(`/comments/${targetId}/vote`, { voteType: type });
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost);
//         setDisplayPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost);
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         const message = error.response.data.message || 'Invalid vote action.';
//         if (message.includes('Already')) {
//           toast.error(`You have already ${type}d this ${targetType}.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('This post or comment is not available for voting.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else if (error.response?.status === 401) {
//         toast.error('Please log in to vote.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else {
//         toast.error(`Failed to record ${type}. Please try again.`, {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//       console.error(`Error ${type} ${targetType}:`, error);
//     }
//   };

//   const handleCommentSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     parentId?: string
//   ) => {
//     e.preventDefault();
//     if (parentId) {
//       const replyContent = replyContents[parentId]?.trim();
//       if (!replyContent) {
//         toast.error('Please enter a reply.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//         return;
//       }
//       try {
//         const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent });
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost);
//         setDisplayPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost);
//         setReplyContents(prev => ({ ...prev, [parentId]: "" }));
//         setReplyStates(prev => prev.filter(r => r.commentId !== parentId));
//         toast.success('Reply posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to reply.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid reply or comment not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to post reply. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//         console.error('Error submitting reply:', error);
//       }
//     } else {
//       if (!newComment.trim() || !postId) {
//         toast.error('Please enter a comment.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//         return;
//       }
//       try {
//         const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment });
//         setPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         );
//         setDisplayPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         );
//         setNewComment("");
//         toast.success('Comment posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to comment.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid comment or post not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to post comment. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//         console.error('Error submitting comment:', error);
//       }
//     }
//   };

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId);
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId);
//       } else {
//         return [...prev, { commentId, isOpen: true }];
//       }
//     });
//   };

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffHours < 1) return "Just now";
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id);
//     const replyState = replyStates.find((r) => r.commentId === comment._id);
//     const hasReplies = comment.replies && comment.replies.length > 0;
//     const maxDepth = 6;

//     return (
//       <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
//                   </Button>
//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={replyContents[comment._id] || ""}
//                       onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (!displayPost) return <div className="text-center py-12">Post not found</div>;

//   return (
//     <div>
//       <Sidebar2 />
//       <div className="min-h-screen relative overflow-hidden">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto p-6">
//           <div className="mb-6">
//             <Select value={language} onValueChange={setLanguage}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Select Language" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="en-IN">English</SelectItem>
//                 <SelectItem value="hi-IN">Hindi</SelectItem>
//                 <SelectItem value="ta-IN">Tamil</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader className="pb-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
//                   {displayPost.schemeName}
//                 </Badge>
//               </div>
//               <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{displayPost.title}</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//                 <div className="flex items-center gap-1">
//                   <User className="w-4 h-4" />
//                   <span>{displayPost.userId?.username || 'Anonymous'}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>{formatDate(displayPost.createdAt)}</span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{displayPost.description}</p>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("upvote")}
//                   className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                 >
//                   <ArrowUp className="w-4 h-4 mr-1" />
//                   {displayPost.upvotes?.length || 0}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("downvote")}
//                   className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                 >
//                   <ArrowDown className="w-4 h-4 mr-1" />
//                   {displayPost.downvotes?.length || 0}
//                 </Button>
//                 <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                   <MessageCircle className="w-3 h-3 mr-1" />
//                   {displayPost.comments?.length || 0} comments
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCommentSubmit}>
//                 <Textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Share your thoughts or ask a question..."
//                   className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//                 />
//                 <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                   Post Comment
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-semibold text-slate-800">Comments ({displayPost.comments?.length || 0})</h2>
//             </div>
//             {displayPost.comments && displayPost.comments.length > 0 ? (
//               <div className="space-y-4">
//                 {displayPost.comments.map((comment) => (
//                   <CommentComponent key={comment._id} comment={comment} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//                 <p className="text-slate-500">Be the first to share your thoughts!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Card, CardContent, CardHeader } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";
// import { Textarea } from "../Components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
// import { Badge } from "../Components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight } from "lucide-react";
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar2 from "@/Components/Common/Sidebar";
// import { SarvamAIClient } from "sarvamai";

// const API_BASE_URL = 'http://localhost:5000/api';
// const SARVAM_API_KEY = 'sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP';
// const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

// const getAuthToken = () => localStorage.getItem('token');

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// interface UserObj {
//   username: string;
// }

// interface Comment {
//   _id: string;
//   content: string;
//   userId: UserObj;
//   upvotes: any[];
//   downvotes: any[];
//   createdAt: string;
//   replies: Comment[];
//   language?: string; // Optional source language
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId: UserObj;
//   upvotes: any[];
//   downvotes: any[];
//   createdAt: string;
//   comments: Comment[];
//   language?: string; // Optional source language
// }

// interface ReplyState {
//   commentId: string;
//   isOpen: boolean;
// }

// const chunkText = (text: any, maxLength: number = 2000): string[] => {
//   if (typeof text !== 'string' || !text) {
//     return [''];
//   }
//   const chunks: string[] = [];
//   let currentChunk = '';
//   const sentences = text.split('.').map(s => s.trim()).filter(s => s);

//   for (const sentence of sentences) {
//     if ((currentChunk + sentence).length <= maxLength) {
//       currentChunk += (currentChunk ? '. ' : '') + sentence;
//     } else {
//       if (currentChunk) chunks.push(currentChunk);
//       currentChunk = sentence;
//     }
//   }
//   if (currentChunk) chunks.push(currentChunk);
//   return chunks;
// };

// type TranslateSourceLanguage =
//   | 'bn-IN'
//   | 'en-IN'
//   | 'gu-IN'
//   | 'hi-IN'
//   | 'kn-IN'
//   | 'ml-IN'
//   | 'mr-IN'
//   | 'od-IN'
//   | 'pa-IN'
//   | 'ta-IN'
//   | 'te-IN';

// type TranslateTargetLanguage =
//   | 'bn-IN'
//   | 'en-IN'
//   | 'gu-IN'
//   | 'hi-IN'
//   | 'kn-IN'
//   | 'ml-IN'
//   | 'mr-IN'
//   | 'od-IN'
//   | 'pa-IN'
//   | 'ta-IN'
//   | 'te-IN'
//   | 'as-IN'
//   | 'brx-IN'
//   | 'doi-IN'
//   | 'kok-IN'
//   | 'ks-IN'
//   | 'mai-IN'
//   | 'mni-IN'
//   | 'ne-IN'
//   | 'sa-IN'
//   | 'sat-IN'
//   | 'sd-IN'
//   | 'ur-IN';

// const translateText = async (text: string, sourceLang: TranslateSourceLanguage, targetLang: TranslateTargetLanguage): Promise<string> => {
//   if (!text) return '';
//   if (sourceLang === targetLang) return text; // Skip translation if source and target languages are the same

//   const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`;
//   const cached = localStorage.getItem(cacheKey);
//   if (cached) return cached;

//   try {
//     const response = await client.text.translate({
//       input: text,
//       source_language_code: sourceLang,
//       target_language_code: targetLang,
//       model: 'sarvam-translate:v1',
//       enable_preprocessing: true,
//       numerals_format: 'international',
//     });
//     const translatedText = response.translated_text;
//     localStorage.setItem(cacheKey, translatedText);
//     return translatedText;
//   } catch (error: any) {
//     console.error('Sarvam AI Translation error:', error);
//     let errorMessage = 'Translation failed';
//     if (error.response?.data?.error?.message) {
//       errorMessage = `Translation error: ${error.response.data.error.message}`;
//     } else if (error.response?.status === 400) {
//       errorMessage = 'Invalid request. Check API key or language codes.';
//     } else if (error.response?.status === 401) {
//       errorMessage = 'Unauthorized. Invalid API key.';
//     }
//     toast.error(errorMessage, {
//       position: 'top-right',
//       style: { background: '#fee2e2', color: '#dc2626' },
//     });
//     return text; // Fallback to original text
//   }
// };

// const translateComment = async (comment: Comment, targetLang: TranslateTargetLanguage): Promise<Comment> => {
//   const sourceLang = (comment.language || 'en-IN') as TranslateSourceLanguage;
//   if (sourceLang === targetLang) return { ...comment }; // Skip translation if source and target languages are the same

//   const translatedComment = { ...comment };

//   // Translate content
//   const contentChunks = chunkText(comment.content);
//   const translatedContentChunks = await Promise.all(
//     contentChunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//   );
//   translatedComment.content = translatedContentChunks.join('. ');

//   // Translate replies recursively
//   if (comment.replies && comment.replies.length > 0) {
//     translatedComment.replies = await Promise.all(
//       comment.replies.map(reply => translateComment(reply, targetLang))
//     );
//   }

//   return translatedComment;
// };

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
//   if (sourceLang === targetLang) return { ...post }; // Skip translation if source and target languages are the same

//   const translatedPost = { ...post };
//   type TranslatableField = keyof Pick<Post, 'title' | 'description' | 'schemeName'>;
//   const fieldsToTranslate: TranslatableField[] = ['title', 'description', 'schemeName'];

//   for (const field of fieldsToTranslate) {
//     const text = post[field] as string | undefined;
//     if (!text) {
//       translatedPost[field] = '';
//       continue;
//     }
//     const chunks = chunkText(text);
//     const translatedChunks = await Promise.all(
//       chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//     );
//     translatedPost[field] = translatedChunks.join('. ');
//   }

//   // Translate comments
//   if (post.comments && post.comments.length > 0) {
//     translatedPost.comments = await Promise.all(
//       post.comments.map(comment => translateComment(comment, targetLang))
//     );
//   }

//   return translatedPost;
// };

// export default function PostDetail() {
//   const { postId } = useParams<{ postId: string }>();
//   const [post, setPost] = useState<Post | null>(null);
//   const [displayPost, setDisplayPost] = useState<Post | null>(null);
//   const [newComment, setNewComment] = useState<string>("");
//   const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({});
//   const [replyStates, setReplyStates] = useState<ReplyState[]>([]);
//   const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
//   const [loading, setLoading] = useState<boolean>(false);
//   const [language, setLanguage] = useState<TranslateTargetLanguage>("en-IN"); // Default: English

//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get(`/posts/${postId}`);
//         setPost(response.data);
//       } catch (error) {
//         toast.error('Failed to load post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (postId) fetchPost();
//   }, [postId]);

//   useEffect(() => {
//     const translatePostData = async () => {
//       if (!post) return;
//       setLoading(true);
//       try {
//         const translated = await translatePost(post, language);
//         setDisplayPost(translated);
//       } catch (error) {
//         console.error('Error translating post:', error);
//         setDisplayPost(post); // Fallback to original post
//         toast.error('Failed to translate post. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePostData();
//   }, [post, language]);

//   const handleVote = async (
//     type: "upvote" | "downvote",
//     targetId: string = postId || "",
//     targetType: "post" | "comment" = "post",
//   ) => {
//     try {
//       let response: 
//         | { data: { post: Post } }
//         | { data: { comment: Comment } }
//         | undefined;
//       if (targetType === 'post') {
//         response = await api.post(`/posts/${targetId}/vote`, { voteType: type });
//         if (response?.data && 'post' in response.data) {
//           setPost(response.data.post);
//           setDisplayPost(response.data.post); // Update display post
//           toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//             position: 'top-right',
//             style: { background: '#dcfce7', color: '#15803d' }
//           });
//         }
//       } else {
//         response = await api.post(`/comments/${targetId}/vote`, { voteType: type });
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost);
//         setDisplayPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === targetId && response?.data && 'comment' in response.data
//               ? response.data.comment
//               : comment
//           )
//         }) : prevPost);
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         const message = error.response.data.message || 'Invalid vote action.';
//         if (message.includes('Already')) {
//           toast.error(`You have already ${type}d this ${targetType}.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('This post or comment is not available for voting.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else if (error.response?.status === 401) {
//         toast.error('Please log in to vote.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else {
//         toast.error(`Failed to record ${type}. Please try again.`, {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//       console.error(`Error ${type} ${targetType}:`, error);
//     }
//   };

//   const handleCommentSubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     parentId?: string
//   ) => {
//     e.preventDefault();
//     if (parentId) {
//       const replyContent = replyContents[parentId]?.trim();
//       if (!replyContent) {
//         toast.error('Please enter a reply.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//         return;
//       }
//       try {
//         const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent });
//         setPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost);
//         setDisplayPost(prevPost => prevPost ? ({
//           ...prevPost,
//           comments: prevPost.comments.map(comment =>
//             comment._id === parentId
//               ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
//               : comment
//           )
//         }) : prevPost);
//         setReplyContents(prev => ({ ...prev, [parentId]: "" }));
//         setReplyStates(prev => prev.filter(r => r.commentId !== parentId));
//         toast.success('Reply posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to reply.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid reply or comment not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to post reply. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//         console.error('Error submitting reply:', error);
//       }
//     } else {
//       if (!newComment.trim() || !postId) {
//         toast.error('Please enter a comment.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//         return;
//       }
//       try {
//         const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment });
//         setPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         );
//         setDisplayPost((prevPost: Post | null) =>
//           prevPost
//             ? ({
//                 ...prevPost,
//                 comments: [...(prevPost.comments || []), response.data.comment],
//               } as Post)
//             : prevPost
//         );
//         setNewComment("");
//         toast.success('Comment posted successfully!', {
//           position: 'top-right',
//           style: { background: '#dcfce7', color: '#15803d' }
//         });
//       } catch (error: any) {
//         if (error.response?.status === 401) {
//           toast.error('Please log in to comment.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (error.response?.status === 400) {
//           toast.error(error.response.data.message || 'Invalid comment or post not available.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to post comment. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//         console.error('Error submitting comment:', error);
//       }
//     }
//   };

//   const toggleReply = (commentId: string) => {
//     setReplyStates((prev) => {
//       const existing = prev.find((r) => r.commentId === commentId);
//       if (existing) {
//         return prev.filter((r) => r.commentId !== commentId);
//       } else {
//         return [...prev, { commentId, isOpen: true }];
//       }
//     });
//   };

//   const toggleCollapse = (commentId: string) => {
//     setCollapsedComments((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffHours < 1) return "Just now";
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
//     const isCollapsed = collapsedComments.has(comment._id);
//     const replyState = replyStates.find((r) => r.commentId === comment._id);
//     const hasReplies = comment.replies && comment.replies.length > 0;
//     const maxDepth = 6;

//     return (
//       <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
//         <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
//           <CardContent className="p-4">
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
//                   <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
//                   {hasReplies && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleCollapse(comment._id)}
//                       className="h-6 px-1 text-slate-500 hover:text-slate-700"
//                     >
//                       {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//                       <span className="ml-1 text-xs">{comment.replies.length}</span>
//                     </Button>
//                   )}
//                 </div>
//                 <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("upvote", comment._id, "comment")}
//                     className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                   >
//                     <ArrowUp className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleVote("downvote", comment._id, "comment")}
//                     className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <ArrowDown className="w-3 h-3" />
//                     <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
//                   </Button>
//                   {depth < maxDepth && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleReply(comment._id)}
//                       className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
//                     >
//                       <Reply className="w-3 h-3" />
//                       <span className="ml-1 text-xs">Reply</span>
//                     </Button>
//                   )}
//                 </div>
//                 {replyState?.isOpen && (
//                   <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
//                     <Textarea
//                       value={replyContents[comment._id] || ""}
//                       onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
//                       placeholder="Write a reply..."
//                       className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
//                         Post Reply
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleReply(comment._id)}
//                         className="text-slate-600 hover:text-slate-700"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         {hasReplies && !isCollapsed && (
//           <div className="space-y-3">
//             {comment.replies.map((reply) => (
//               <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (!displayPost) return <div className="text-center py-12">Post not found</div>;

//   return (
//     <div>
//       <Sidebar2 />
//       <div className="min-h-screen relative overflow-hidden">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto p-6">
//           <div className="mb-6">
//             <Select value={language} onValueChange={(value: string) => setLanguage(value as TranslateTargetLanguage)}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Select Language" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="en-IN">English</SelectItem>
//                 <SelectItem value="hi-IN">Hindi</SelectItem>
//                 <SelectItem value="ta-IN">Tamil</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader className="pb-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
//                   {displayPost.schemeName}
//                 </Badge>
//               </div>
//               <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{displayPost.title}</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
//                 <div className="flex items-center gap-1">
//                   <User className="w-4 h-4" />
//                   <span>{displayPost.userId?.username || 'Anonymous'}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>{formatDate(displayPost.createdAt)}</span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{displayPost.description}</p>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("upvote")}
//                   className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                 >
//                   <ArrowUp className="w-4 h-4 mr-1" />
//                   {displayPost.upvotes?.length || 0}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => handleVote("downvote")}
//                   className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                 >
//                   <ArrowDown className="w-4 h-4 mr-1" />
//                   {displayPost.downvotes?.length || 0}
//                 </Button>
//                 <Badge variant="secondary" className="bg-slate-100 text-slate-700">
//                   <MessageCircle className="w-3 h-3 mr-1" />
//                   {displayPost.comments?.length || 0} comments
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
//             <CardHeader>
//               <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleCommentSubmit}>
//                 <Textarea
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   placeholder="Share your thoughts or ask a question..."
//                   className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
//                 />
//                 <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
//                   Post Comment
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-semibold text-slate-800">Comments ({displayPost.comments?.length || 0})</h2>
//             </div>
//             {displayPost.comments && displayPost.comments.length > 0 ? (
//               <div className="space-y-4">
//                 {displayPost.comments.map((comment) => (
//                   <CommentComponent key={comment._id} comment={comment} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
//                 <p className="text-slate-500">Be the first to share your thoughts!</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight } from "lucide-react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar2 from "@/components/Common/Sidebar";
import { SarvamAIClient } from "sarvamai";
import { useLanguage } from '../Context/LanguageContext';

const API_BASE_URL = 'http://localhost:5000/api';
const SARVAM_API_KEY = 'sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP';
const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

const getAuthToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface UserObj {
  username: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: UserObj;
  upvotes: any[];
  downvotes: any[];
  createdAt: string;
  replies: Comment[];
  language?: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  schemeName: string;
  userId: UserObj;
  upvotes: any[];
  downvotes: any[];
  createdAt: string;
  comments: Comment[];
  language?: string;
}

interface ReplyState {
  commentId: string;
  isOpen: boolean;
}

const chunkText = (text: any, maxLength: number = 2000): string[] => {
  if (typeof text !== 'string' || !text) {
    return [''];
  }
  const chunks: string[] = [];
  let currentChunk = '';
  const sentences = text.split('.').map(s => s.trim()).filter(s => s);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

type TranslateSourceLanguage =
  | 'bn-IN'
  | 'en-IN'
  | 'gu-IN'
  | 'hi-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'mr-IN'
  | 'od-IN'
  | 'pa-IN'
  | 'ta-IN'
  | 'te-IN';

type TranslateTargetLanguage =
  | 'bn-IN'
  | 'en-IN'
  | 'gu-IN'
  | 'hi-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'mr-IN'
  | 'od-IN'
  | 'pa-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'as-IN'
  | 'brx-IN'
  | 'doi-IN'
  | 'kok-IN'
  | 'ks-IN'
  | 'mai-IN'
  | 'mni-IN'
  | 'ne-IN'
  | 'sa-IN'
  | 'sat-IN'
  | 'sd-IN'
  | 'ur-IN';

// Map LanguageContext codes to Sarvam AI codes
const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
  const mapping: { [key: string]: TranslateTargetLanguage } = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
  };
  return mapping[lang] || 'en-IN';
};

const translateText = async (text: string, sourceLang: TranslateSourceLanguage, targetLang: TranslateTargetLanguage): Promise<string> => {
  if (!text) return '';
  if (sourceLang === targetLang) return text;

  const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const response = await client.text.translate({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      model: 'sarvam-translate:v1',
      enable_preprocessing: true,
      numerals_format: 'international',
    });
    const translatedText = response.translated_text;
    localStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error: any) {
    console.error('Sarvam AI Translation error:', error);
    let errorMessage = 'Translation failed';
    if (error.response?.data?.error?.message) {
      errorMessage = `Translation error: ${error.response.data.error.message}`;
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request. Check API key or language codes.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Invalid API key.';
    }
    toast.error(errorMessage, {
      position: 'top-right',
      style: { background: '#fee2e2', color: '#dc2626' },
    });
    return text;
  }
};

const translateComment = async (comment: Comment, targetLang: TranslateTargetLanguage): Promise<Comment> => {
  const sourceLang = (comment.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...comment };

  const translatedComment = { ...comment };
  const contentChunks = chunkText(comment.content);
  const translatedContentChunks = await Promise.all(
    contentChunks.map(chunk => translateText(chunk, sourceLang, targetLang))
  );
  translatedComment.content = translatedContentChunks.join('. ');

  if (comment.replies && comment.replies.length > 0) {
    translatedComment.replies = await Promise.all(
      comment.replies.map(reply => translateComment(reply, targetLang))
    );
  }

  return translatedComment;
};

const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
  const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...post };

  const translatedPost = { ...post };
  type TranslatableField = keyof Pick<Post, 'title' | 'description' | 'schemeName'>;
  const fieldsToTranslate: TranslatableField[] = ['title', 'description', 'schemeName'];

  for (const field of fieldsToTranslate) {
    const text = post[field] as string | undefined;
    if (!text) {
      translatedPost[field] = '';
      continue;
    }
    const chunks = chunkText(text);
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
    );
    translatedPost[field] = translatedChunks.join('. ');
  }

  if (post.comments && post.comments.length > 0) {
    translatedPost.comments = await Promise.all(
      post.comments.map(comment => translateComment(comment, targetLang))
    );
  }

  return translatedPost;
};

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { language } = useLanguage();
  const [post, setPost] = useState<Post | null>(null);
  const [displayPost, setDisplayPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({});
  const [replyStates, setReplyStates] = useState<ReplyState[]>([]);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        toast.error('Failed to load post. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  useEffect(() => {
    const translatePostData = async () => {
      if (!post) return;
      setLoading(true);
      try {
        const targetLang = mapLanguageToSarvam(language);
        const translated = await translatePost(post, targetLang);
        setDisplayPost(translated);
      } catch (error) {
        console.error('Error translating post:', error);
        setDisplayPost(post);
        toast.error('Failed to translate post. Showing original content.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePostData();
  }, [post, language]);

  const handleVote = async (
    type: "upvote" | "downvote",
    targetId: string = postId || "",
    targetType: "post" | "comment" = "post",
  ) => {
    try {
      let response: 
        | { data: { post: Post } }
        | { data: { comment: Comment } }
        | undefined;
      if (targetType === 'post') {
        response = await api.post(`/posts/${targetId}/vote`, { voteType: type });
        if (response?.data && 'post' in response.data) {
          setPost(response.data.post);
          setDisplayPost(response.data.post);
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
            position: 'top-right',
            style: { background: '#dcfce7', color: '#15803d' }
          });
        }
      } else {
        response = await api.post(`/comments/${targetId}/vote`, { voteType: type });
        setPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === targetId && response?.data && 'comment' in response.data
              ? response.data.comment
              : comment
          )
        }) : prevPost);
        setDisplayPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === targetId && response?.data && 'comment' in response.data
              ? response.data.comment
              : comment
          )
        }) : prevPost);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded!`, {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid vote action.';
        if (message.includes('Already')) {
          toast.error(`You have already ${type}d this ${targetType}.`, {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('This post or comment is not available for voting.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else if (error.response?.status === 401) {
        toast.error('Please log in to vote.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } else {
        toast.error(`Failed to record ${type}. Please try again.`, {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      }
      console.error(`Error ${type} ${targetType}:`, error);
    }
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) => {
    e.preventDefault();
    if (parentId) {
      const replyContent = replyContents[parentId]?.trim();
      if (!replyContent) {
        toast.error('Please enter a reply.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
        return;
      }
      try {
        const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent });
        setPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === parentId
              ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
              : comment
          )
        }) : prevPost);
        setDisplayPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === parentId
              ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
              : comment
          )
        }) : prevPost);
        setReplyContents(prev => ({ ...prev, [parentId]: "" }));
        setReplyStates(prev => prev.filter(r => r.commentId !== parentId));
        toast.success('Reply posted successfully!', {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error('Please log in to reply.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (error.response?.status === 400) {
          toast.error(error.response.data.message || 'Invalid reply or comment not available.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('Failed to post reply. Please try again.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
        console.error('Error submitting reply:', error);
      }
    } else {
      if (!newComment.trim() || !postId) {
        toast.error('Please enter a comment.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
        return;
      }
      try {
        const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment });
        setPost((prevPost: Post | null) =>
          prevPost
            ? ({
                ...prevPost,
                comments: [...(prevPost.comments || []), response.data.comment],
              } as Post)
            : prevPost
        );
        setDisplayPost((prevPost: Post | null) =>
          prevPost
            ? ({
                ...prevPost,
                comments: [...(prevPost.comments || []), response.data.comment],
              } as Post)
            : prevPost
        );
        setNewComment("");
        toast.success('Comment posted successfully!', {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error('Please log in to comment.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (error.response?.status === 400) {
          toast.error(error.response.data.message || 'Invalid comment or post not available.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('Failed to post comment. Please try again.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
        console.error('Error submitting comment:', error);
      }
    }
  };

  const toggleReply = (commentId: string) => {
    setReplyStates((prev) => {
      const existing = prev.find((r) => r.commentId === commentId);
      if (existing) {
        return prev.filter((r) => r.commentId !== commentId);
      } else {
        return [...prev, { commentId, isOpen: true }];
      }
    });
  };

  const toggleCollapse = (commentId: string) => {
    setCollapsedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isCollapsed = collapsedComments.has(comment._id);
    const replyState = replyStates.find((r) => r.commentId === comment._id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const maxDepth = 6;

    return (
      <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
        <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-slate-800">{comment.userId?.username || 'Anonymous'}</span>
                  <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCollapse(comment._id)}
                      className="h-6 px-1 text-slate-500 hover:text-slate-700"
                    >
                      {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      <span className="ml-1 text-xs">{comment.replies.length}</span>
                    </Button>
                  )}
                </div>
                <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("upvote", comment._id, "comment")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("downvote", comment._id, "comment")}
                    className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
                  </Button>
                  {depth < maxDepth && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReply(comment._id)}
                      className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                    >
                      <Reply className="w-3 h-3" />
                      <span className="ml-1 text-xs">Reply</span>
                    </Button>
                  )}
                </div>
                {replyState?.isOpen && (
                  <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
                    <Textarea
                      value={replyContents[comment._id] || ""}
                      onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
                      placeholder="Write a reply..."
                      className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
                        Post Reply
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReply(comment._id)}
                        className="text-slate-600 hover:text-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {hasReplies && !isCollapsed && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!displayPost) return <div className="text-center py-12">Post not found</div>;

  return (
    <div>
      <Sidebar2 />
      <div className="min-h-screen relative overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                  {displayPost.schemeName}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{displayPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{displayPost.userId?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(displayPost.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{displayPost.description}</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleVote("upvote")}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {displayPost.upvotes?.length || 0}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleVote("downvote")}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  {displayPost.downvotes?.length || 0}
                </Button>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {displayPost.comments?.length || 0} comments
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-800">Add a Comment</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit}>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
                />
                <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
                  Post Comment
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-800">Comments ({displayPost.comments?.length || 0})</h2>
            </div>
            {displayPost.comments && displayPost.comments.length > 0 ? (
              <div className="space-y-4">
                {displayPost.comments.map((comment) => (
                  <CommentComponent key={comment._id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No comments yet</h3>
                <p className="text-slate-500">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}