

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const CommunityPostPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filter, setFilter] = useState('newest');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         let url = 'http://localhost:5000/api/posts/approved';
//         if (filter === 'newest') {
//           url += '?sort=createdAt&order=desc';
//         } else if (filter === 'upvotes') {
//           url += '?sort=upvotes.length&order=desc';
//         } else if (filter === 'unanswered') {
//           url += '?unanswered=true';
//         }
//         const response = await axios.get(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {}
//         });
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching approved posts:', error);
//         alert('Failed to load approved posts');
//       }
//     };
//     fetchPosts();
//   }, [token, filter]);

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

//   const filteredPosts = posts.filter(post =>
//     post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     post.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen relative overflow-hidden p-6">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Crect width=\\'100\\' height=\\'100\\' fill=\\'none\\'/%3E%3Cpath d=\\'M0 0 L50 50 L100 0 Z\\' fill=\\'rgba(251, 146, 60, 0.7)\\'/ %3E%3Cpath d=\\'M0 100 L50 50 L100 100 Z\\' fill=\\'rgba(251, 146, 60, 0.7)\\'/ %3E%3C/svg%3E')] opacity-20" />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">Community Posts and Questions</h2>
//         <div className="mb-6 flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by title or description..."
//             className="w-full md:w-2/3 p-4 border-2 border-blue-200/50 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//           />
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="w-full md:w-1/3 p-4 border-2 border-blue-200/50 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-800"
//           >
//             <option value="newest">Newest</option>
//             <option value="upvotes">Most Upvotes</option>
//             <option value="unanswered">Unanswered</option>
//           </select>
//         </div>
//         <div className="grid gap-6">
//           {filteredPosts.map((post) => (
//             <div key={post._id} className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-300">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">{post.title}</h3>
//                   <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
//                 </div>
//                 <div className="ml-4 text-right">
//                   <p className="text-sm text-gray-500 mb-1">By: {post.userId.username}</p>
//                   <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mt-4">
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={() => handleVote(post._id, 'upvote')}
//                     className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition duration-200 flex items-center"
//                   >
//                     <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                     </svg>
//                     {post.upvotes.length}
//                   </button>
//                   <button
//                     onClick={() => handleVote(post._id, 'downvote')}
//                     className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition duration-200 flex items-center"
//                   >
//                     <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                     {post.downvotes.length}
//                   </button>
//                 </div>
//                 <div className="text-sm text-gray-500">Answers: {post.comments?.length || 0}</div>
//               </div>
//               <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline font-medium mt-2 inline-block">View Details</Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityPostPage;




"use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Input } from "../Components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react"
// import {Link} from 'react-router-dom'

// // Mock data - replace with your actual API calls
// const mockPosts = [
//   {
//     _id: "1",
//     title: "How to implement authentication in React?",
//     description:
//       "I'm struggling with implementing JWT authentication in my React application. Can someone guide me through the best practices?",
//     userId: { username: "john_dev" },
//     upvotes: { length: 15 },
//     downvotes: { length: 2 },
//     comments: [{ length: 8 }],
//     createdAt: "2024-01-15T10:30:00Z",
//     status: "accepted",
//   },
//   {
//     _id: "2",
//     title: "Best practices for database design",
//     description:
//       "What are the key principles I should follow when designing a database schema for a social media application?",
//     userId: { username: "sarah_db" },
//     upvotes: { length: 23 },
//     downvotes: { length: 1 },
//     comments: [{ length: 12 }],
//     createdAt: "2024-01-14T15:45:00Z",
//     status: "accepted",
//   },
//   {
//     _id: "3",
//     title: "React vs Vue.js in 2024",
//     description:
//       "I'm starting a new project and can't decide between React and Vue.js. What are the pros and cons of each?",
//     userId: { username: "alex_frontend" },
//     upvotes: { length: 31 },
//     downvotes: { length: 5 },
//     comments: [{ length: 18 }],
//     createdAt: "2024-01-13T09:20:00Z",
//     status: "accepted",
//   },
// ]

// export default function CommunityPosts() {
//   const [posts, setPosts] = useState(mockPosts)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     // Implement your voting logic here
//     console.log(`Voting ${voteType} on post ${postId}`)
//   }

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto p-6">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
//             Community Hub
//           </h1>
//           <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//             Share knowledge, ask questions, and connect with fellow developers
//           </p>
//         </div>

//         {/* Search and Filter */}
//         <div className="mb-8 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//             <Input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search posts and discussions..."
//               className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//             />
//           </div>
//           <Select value={filter} onValueChange={setFilter}>
//             <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="newest">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Newest First
//                 </div>
//               </SelectItem>
//               <SelectItem value="upvotes">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4" />
//                   Most Upvoted
//                 </div>
//               </SelectItem>
//               <SelectItem value="unanswered">
//                 <div className="flex items-center gap-2">
//                   <MessageCircle className="w-4 h-4" />
//                   Unanswered
//                 </div>
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Posts Grid */}
//         <div className="space-y-6">
//           {filteredPosts.map((post) => (
//             <Card
//               key={post._id}
//               className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//             >
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <Link to={`/post/${post._id}`}>
//                       <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-900 transition-colors cursor-pointer line-clamp-2">
//                         {post.title}
//                       </h3>
//                     </Link>
//                     <p className="text-slate-600 mt-2 line-clamp-3">{post.description}</p>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="pt-0">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 text-sm text-slate-500">
//                     <div className="flex items-center gap-1">
//                       <User className="w-4 h-4" />
//                       <span>{post.userId.username}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       <span>{formatDate(post.createdAt)}</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     {/* Vote Buttons */}
//                     <div className="flex items-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleVote(post._id, "upvote")}
//                         className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                       >
//                         <ArrowUp className="w-4 h-4" />
//                         <span className="ml-1 text-xs font-medium">{post.upvotes.length}</span>
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleVote(post._id, "downvote")}
//                         className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                       >
//                         <ArrowDown className="w-4 h-4" />
//                         <span className="ml-1 text-xs font-medium">{post.downvotes.length}</span>
//                       </Button>
//                     </div>

//                     {/* Comments Badge */}
//                     <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                       <MessageCircle className="w-3 h-3 mr-1" />
//                       {post.comments[0]?.length || 0} replies
//                     </Badge>

//                     {/* View Details Button */}
//                     <Link to={`/post/${post._id}`}>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                       >
//                         View Details
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredPosts.length === 0 && (
//           <div className="text-center py-12">
//             <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//             <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }




// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Input } from "../Components/ui/input"
// import { Textarea } from "../Components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp, Reply, ChevronDown, ChevronRight } from "lucide-react"
// import { Link } from 'react-router-dom'
// import axios from 'axios'

// const API_BASE_URL = 'http://localhost:5000/api' // Adjust based on your backend URL

// // Get token from localStorage
// const getAuthToken = () => localStorage.getItem('token')

// // Axios instance with auth header
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default  function CommunityPosts() {
//   const [posts, setPosts] = useState<Post[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)

//   // Fetch approved posts on component mount and when filter changes
//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true)
//       try {
//         const params: Record<string, any> = {}
//         if (filter === 'newest') {
//           params.sort = 'createdAt'
//           params.order = 'desc'
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length'
//           params.order = 'desc'
//         } else if (filter === 'unanswered') {
//           params.unanswered = true
//         }

//         const response = await api.get('/posts/approved', { params })
//         setPosts(response.data)
//       } catch (error) {
//         console.error('Error fetching posts:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPosts()
//   }, [filter])

//   interface User {
//     username: string
//   }

//   interface Comment {
//     // Define properties as per your backend, using any for now
//     [key: string]: any
//   }

//   interface Post {
//     _id: string
//     title: string
//     description: string
//     userId?: User
//     upvotes?: any[]
//     downvotes?: any[]
//     comments?: Comment[]
//     createdAt: string
//     [key: string]: any
//   }

//   interface VoteResponse {
//     post: Post
//   }

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post<VoteResponse>(`/posts/${postId}/vote`, { voteType })
//       // Update the posts state with the updated post
//       setPosts(posts.map((post: Post) => 
//         post._id === postId ? response.data.post : post
//       ))
//     } catch (error) {
//       console.error(`Error ${voteType} post:`, error)
//     }
//   }

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   interface FormatDate {
//     (dateString: string): string
//   }

//   const formatDate: FormatDate = (dateString) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto p-6">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//             Community Hub
//           </h1>
//           <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//             Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards 
//           </p>
//         </div>
       

//         {/* Search and Filter */}
//         <div className="mb-8 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//             <Input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search posts and discussions..."
//               className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//             />
//           </div>
//           <Select value={filter} onValueChange={setFilter}>
//             <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="newest">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Newest First
//                 </div>
//               </SelectItem>
//               <SelectItem value="upvotes">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4" />
//                   Most Upvoted
//                 </div>
//               </SelectItem>
//               <SelectItem value="unanswered">
//                 <div className="flex items-center gap-2">
//                   <MessageCircle className="w-4 h-4" />
//                   Unanswered
//                 </div>
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Posts Grid */}
//         {loading ? (
//           <div className="text-center py-12">Loading...</div>
//         ) : (
//           <div className="space-y-6">
//             {filteredPosts.map((post) => (
//               <Card
//                 key={post._id}
//                 className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <Link to={`/post/${post._id}`}>
//                         <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                           {post.title}
//                         </h3>
//                       </Link>
//                       <p className="text-slate-600 mt-2 line-clamp-3">{post.description}</p>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 text-sm text-slate-500">
//                       <div className="flex items-center gap-1">
//                         <User className="w-4 h-4" />
//                         <span className="text-blue-400">{post.userId?.username || 'Anonymous'}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-4 h-4" />
//                         <span>{formatDate(post.createdAt)}</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center gap-1">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "upvote")}
//                           className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                         >
//                           <ArrowUp className="w-4 h-4" />
//                           <span className="ml-1 text-xs font-medium">{post.upvotes?.length || 0}</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "downvote")}
//                           className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                         >
//                           <ArrowDown className="w-4 h-4" />
//                           <span className="ml-1 text-xs font-medium">{post.downvotes?.length || 0}</span>
//                         </Button>
//                       </div>

//                       <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                         <MessageCircle className="w-3 h-3 mr-1" />
//                         {post.comments?.length || 0} replies
//                       </Badge>

//                       <Link to={`/post/${post._id}`}>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                         >
//                           View Details
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {filteredPosts.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//             <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Input } from "../Components/ui/input"
// import { Textarea } from "../Components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react"
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import Sidebar2 from "@/Components/Common/Sidebar"

// const API_BASE_URL = 'http://localhost:5000/api' // Adjust based on your backend URL

// // Get token from localStorage
// const getAuthToken = () => localStorage.getItem('token')

// // Axios instance with auth header
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// interface User {
//   username: string
// }

// interface Comment {
//   [key: string]: any
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   userId?: User
//   upvotes?: any[]
//   downvotes?: any[]
//   comments?: Comment[]
//   createdAt: string
//   [key: string]: any
// }

// export default function CommunityPosts() {
//   const [posts, setPosts] = useState<Post[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)

//   // Fetch approved posts on component mount and when filter changes
//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true)
//       try {
//         const params: Record<string, any> = {}
//         if (filter === 'newest') {
//           params.sort = 'createdAt'
//           params.order = 'desc'
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length'
//           params.order = 'desc'
//         } else if (filter === 'unanswered') {
//           params.unanswered = true
//         }

//         const response = await api.get('/posts/approved', { params })
//         setPosts(response.data)
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPosts()
//   }, [filter])

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType })
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ))
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       })
//     } catch (error) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof (error as any).response === "object" &&
//         (error as any).response !== null
//       ) {
//         const response = (error as any).response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//     }
//   }

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <Sidebar2/>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div
//           className="absolute inset-0 opacity-20"
//           style={ {
//             backgroundImage: `
//               linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//           } }
//         />
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto p-6">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//             Community Hub
//           </h1>
//           <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//             Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//           </p>
//         </div>

//         <div className="mb-8 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//             <Input
//               type="text"
//               value={searchQuery}
//               onChange={ (e) => setSearchQuery(e.target.value) }
//               placeholder="Search posts and discussions..."
//               className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//             />
//           </div>
//           <Select value={ filter } onValueChange={ setFilter }>
//             <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="newest">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Newest First
//                 </div>
//               </SelectItem>
//               <SelectItem value="upvotes">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-4 h-4" />
//                   Most Upvoted
//                 </div>
//               </SelectItem>
//               <SelectItem value="unanswered">
//                 <div className="flex items-center gap-2">
//                   <MessageCircle className="w-4 h-4" />
//                   Unanswered
//                 </div>
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         { loading ? (
//           <div className="text-center py-12">Loading...</div>
//         ) : (
//           <div className="space-y-6">
//             { filteredPosts.map((post) => (
//               <Card
//                 key={ post._id }
//                 className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <Link to={ `/post/${post._id}` }>
//                         <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                           { post.title }
//                         </h3>
//                       </Link>
//                       <p className="text-slate-600 mt-2 line-clamp-3">{ post.description }</p>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 text-sm text-slate-500">
//                       <div className="flex items-center gap-1">
//                         <User className="w-4 h-4" />
//                         <span className="text-blue-400">{ post.userId?.username || 'Anonymous' }</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-4 h-4" />
//                         <span>{ formatDate(post.createdAt) }</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="flex items-center gap-1">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={ () => handleVote(post._id, "upvote") }
//                           className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                         >
//                           <ArrowUp className="w-4 h-4" />
//                           <span className="ml-1 text-xs font-medium">{ post.upvotes?.length || 0 }</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={ () => handleVote(post._id, "downvote") }
//                           className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                         >
//                           <ArrowDown className="w-4 h-4" />
//                           <span className="ml-1 text-xs font-medium">{ post.downvotes?.length || 0 }</span>
//                         </Button>
//                       </div>

//                       <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                         <MessageCircle className="w-3 h-3 mr-1" />
//                         { post.comments?.length || 0 } replies
//                       </Badge>

//                       <Link to={ `/post/${post._id}` }>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                         >
//                           View Details
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )) }
//           </div>
//         ) }

//         { filteredPosts.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//             <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//           </div>
//         ) }
//       </div>
//     </div>
//   )
// }




// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader } from "../Components/ui/card"
// import { Button } from "../Components/ui/button"
// import { Input } from "../Components/ui/input"
// import { Textarea } from "../Components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
// import { Badge } from "../Components/ui/badge"
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react"
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import Sidebar2 from "@/Components/Common/Sidebar"

// const API_BASE_URL = 'http://localhost:5000/api'

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

// interface User {
//   username: string
// }

// interface Comment {
//   [key: string]: any
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   schemeName: string
//   userId?: User
//   upvotes?: any[]
//   downvotes?: any[]
//   comments?: Comment[]
//   createdAt: string
//   [key: string]: any
// }

// export default function CommunityPosts() {
//   const [posts, setPosts] = useState<Post[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true)
//       try {
//         const params: Record<string, any> = {}
//         if (filter === 'newest') {
//           params.sort = 'createdAt'
//           params.order = 'desc'
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length'
//           params.order = 'desc'
//         } else if (filter === 'unanswered') {
//           params.unanswered = true
//         }

//         const response = await api.get('/posts/approved', { params })
//         setPosts(response.data)
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPosts()
//   }, [filter])

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType })
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ))
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       })
//     } catch (error) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof (error as any).response === "object" &&
//         (error as any).response !== null
//       ) {
//         const response = (error as any).response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           })
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         })
//       }
//     }
//   }

//   const filteredPosts = posts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               Community Hub
//             </h1>
//             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//               Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//             </p>
//           </div>

//           <div className="mb-8 flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search posts and discussions..."
//                 className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Newest First
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="upvotes">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Most Upvoted
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="unanswered">
//                   <div className="flex items-center gap-2">
//                     <MessageCircle className="w-4 h-4" />
//                     Unanswered
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">Loading...</div>
//           ) : (
//             <div className="space-y-6">
//               {filteredPosts.map((post) => (
//                 <Card
//                   key={post._id}
//                   className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                             {post.title}
//                           </h3>
//                         </Link>
//                         <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
//                           {post.schemeName}
//                         </Badge>
//                         <p className="text-slate-600 mt-2 line-clamp-3">{post.description}</p>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="pt-0">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4 text-sm text-slate-500">
//                         <div className="flex items-center gap-1">
//                           <User className="w-4 h-4" />
//                           <span className="text-blue-400">{post.userId?.username || 'Anonymous'}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4" />
//                           <span>{formatDate(post.createdAt)}</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-1">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "upvote")}
//                             className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                           >
//                             <ArrowUp className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.upvotes?.length || 0}</span>
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "downvote")}
//                             className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                           >
//                             <ArrowDown className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.downvotes?.length || 0}</span>
//                           </Button>
//                         </div>

//                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                           <MessageCircle className="w-3 h-3 mr-1" />
//                           {post.comments?.length || 0} replies
//                         </Badge>

//                         <Link to={`/post/${post._id}`}>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                           >
//                             View Details
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";
// import { Input } from "../Components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
// import { Badge } from "../Components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
// import { Link } from 'react-router-dom';
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

// interface User {
//   username: string;
// }

// interface Comment {
//   [key: string]: any;
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId?: User;
//   upvotes?: any[];
//   downvotes?: any[];
//   comments?: Comment[];
//   createdAt: string;
//   language?: string; // Optional field for source language
//   [key: string]: any;
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
//   | 'auto'
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
//   const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`;
//   const cached = localStorage.getItem(cacheKey);
//   if (cached) return cached;

//   try {
//     const response = await client.text.translate({
//       input: text,
//       source_language_code: sourceLang as any,
//       target_language_code: targetLang as any,
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

// const translatePost = async (post: Post, targetLang: string): Promise<Post> => {
//   const fieldsToTranslate = ['title', 'description', 'schemeName'];
//   const translatedPost = { ...post };
//   const sourceLang = post.language || 'en-IN'; // Default to English if no language specified

//   for (const field of fieldsToTranslate) {
//     const text = post[field];
//     if (typeof text !== 'string' || !text) {
//       translatedPost[field] = ''; // Fallback to empty string
//       continue;
//     }
//     const chunks = chunkText(text);
//     const translatedChunks = await Promise.all(
//       chunks.map(chunk => translateText(chunk, sourceLang as TranslateSourceLanguage, targetLang as TranslateTargetLanguage))
//     );
//     translatedPost[field] = translatedChunks.join('. ');
//   }

//   return translatedPost;
// };

// export default function CommunityPostsWithSarvam() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("newest");
//   const [loading, setLoading] = useState(false);
//   const [language, setLanguage] = useState("en-IN"); // Default: English

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const params: Record<string, any> = {};
//         if (filter === 'newest') {
//           params.sort = 'createdAt';
//           params.order = 'desc';
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length';
//           params.order = 'desc';
//         } else if (filter === 'unanswered') {
//           params.unanswered = true;
//         }

//         const response = await api.get('/posts/approved', { params });
//         const validPosts = response.data.filter(
//           (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
//         );
//         setPosts(validPosts);
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [filter]);

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true);
//       try {
//         const translated = await Promise.all(
//           posts.map(post => translatePost(post, language))
//         );
//         setDisplayPosts(translated);
//       } catch (error) {
//         console.error('Error translating posts:', error);
//         setDisplayPosts(posts); // Fallback to original posts
//         toast.error('Failed to translate posts. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePosts();
//   }, [posts, language]);

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType });
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//     }
//   };

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               Community Hub
//             </h1>
//             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//               Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//             </p>
//           </div>

//           <div className="mb-8 flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search posts and discussions..."
//                 className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Newest First
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="upvotes">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Most Upvoted
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="unanswered">
//                   <div className="flex items-center gap-2">
//                     <MessageCircle className="w-4 h-4" />
//                     Unanswered
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
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

//           {loading ? (
//             <div className="text-center py-12">Loading...</div>
//           ) : (
//             <div className="space-y-6">
//               {filteredPosts.map((post) => (
//                 <Card
//                   key={post._id}
//                   className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                             {post.title || 'Untitled'}
//                           </h3>
//                         </Link>
//                         <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
//                           {post.schemeName || 'No Scheme'}
//                         </Badge>
//                         <p className="text-slate-600 mt-2 line-clamp-3">{post.description || 'No description'}</p>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="pt-0">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4 text-sm text-slate-500">
//                         <div className="flex items-center gap-1">
//                           <User className="w-4 h-4" />
//                           <span className="text-blue-400">{post.userId?.username || 'Anonymous'}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4" />
//                           <span>{formatDate(post.createdAt)}</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-1">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "upvote")}
//                             className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                           >
//                             <ArrowUp className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.upvotes?.length || 0}</span>
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "downvote")}
//                             className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                           >
//                             <ArrowDown className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.downvotes?.length || 0}</span>
//                           </Button>
//                         </div>

//                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                           <MessageCircle className="w-3 h-3 mr-1" />
//                           {post.comments?.length || 0} replies
//                         </Badge>

//                         <Link to={`/post/${post._id}`}>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                           >
//                             View Details
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";
// import { Input } from "../Components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
// import { Badge } from "../Components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
// import { Link } from 'react-router-dom';
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

// interface User {
//   username: string;
// }

// interface Comment {
//   [key: string]: any;
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId?: User;
//   upvotes?: any[];
//   downvotes?: any[];
//   comments?: Comment[];
//   createdAt: string;
//   language?: string; // Optional field for source language
//   [key: string]: any;
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

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
//   if (sourceLang === targetLang) return { ...post }; // Skip translation if source and target languages are the same

//   const fieldsToTranslate = ['title', 'description', 'schemeName'];
//   const translatedPost = { ...post };

//   for (const field of fieldsToTranslate) {
//     const text = post[field];
//     if (typeof text !== 'string' || !text) {
//       translatedPost[field] = '';
//       continue;
//     }
//     const chunks = chunkText(text);
//     const translatedChunks = await Promise.all(
//       chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//     );
//     translatedPost[field] = translatedChunks.join('. ');
//   }

//   return translatedPost;
// };

// export default function CommunityPostsWithSarvam() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("newest");
//   const [loading, setLoading] = useState(false);
//   const [language, setLanguage] = useState<TranslateTargetLanguage>("en-IN"); // Default: English

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const params: Record<string, any> = {};
//         if (filter === 'newest') {
//           params.sort = 'createdAt';
//           params.order = 'desc';
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length';
//           params.order = 'desc';
//         } else if (filter === 'unanswered') {
//           params.unanswered = true;
//         }

//         const response = await api.get('/posts/approved', { params });
//         const validPosts = response.data.filter(
//           (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
//         );
//         setPosts(validPosts);
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [filter]);

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true);
//       try {
//         const translated = await Promise.all(
//           posts.map(post => translatePost(post, language))
//         );
//         setDisplayPosts(translated);
//       } catch (error) {
//         console.error('Error translating posts:', error);
//         setDisplayPosts(posts); // Fallback to original posts
//         toast.error('Failed to translate posts. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePosts();
//   }, [posts, language]);

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType });
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       setDisplayPosts(displayPosts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//     }
//   };

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               Community Hub
//             </h1>
//             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//               Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//             </p>
//           </div>

//           <div className="mb-8 flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search posts and discussions..."
//                 className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Newest First
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="upvotes">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Most Upvoted
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="unanswered">
//                   <div className="flex items-center gap-2">
//                     <MessageCircle className="w-4 h-4" />
//                     Unanswered
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
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

//           {loading ? (
//             <div className="text-center py-12">Loading...</div>
//           ) : (
//             <div className="space-y-6">
//               {filteredPosts.map((post) => (
//                 <Card
//                   key={post._id}
//                   className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                             {post.title || 'Untitled'}
//                           </h3>
//                         </Link>
//                         <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
//                           {post.schemeName || 'No Scheme'}
//                         </Badge>
//                         <p className="text-slate-600 mt-2 line-clamp-3">{post.description || 'No description'}</p>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="pt-0">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4 text-sm text-slate-500">
//                         <div className="flex items-center gap-1">
//                           <User className="w-4 h-4" />
//                           <span className="text-blue-400">{post.userId?.username || 'Anonymous'}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4" />
//                           <span>{formatDate(post.createdAt)}</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-1">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "upvote")}
//                             className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
//                           >
//                             <ArrowUp className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.upvotes?.length || 0}</span>
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleVote(post._id, "downvote")}
//                             className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
//                           >
//                             <ArrowDown className="w-4 h-4" />
//                             <span className="ml-1 text-xs font-medium">{post.downvotes?.length || 0}</span>
//                           </Button>
//                         </div>

//                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
//                           <MessageCircle className="w-3 h-3 mr-1" />
//                           {post.comments?.length || 0} replies
//                         </Badge>

//                         <Link to={`/post/${post._id}`}>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
//                           >
//                             View Details
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "../Components/ui/card";
// import { Button } from "../Components/ui/button";
// import { Input } from "../Components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
// import { Badge } from "../Components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar2 from "@/Components/Common/Sidebar";
// import { SarvamAIClient } from "sarvamai";
// import { useLanguage } from '../Context/LanguageContext';

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

// interface User {
//   username: string;
// }

// interface Comment {
//   [key: string]: any;
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId?: User;
//   upvotes?: any[];
//   downvotes?: any[];
//   comments?: Comment[];
//   createdAt: string;
//   language?: string;
//   [key: string]: any;
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

// // Map LanguageContext codes to Sarvam AI codes
// const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
//   const mapping: { [key: string]: TranslateTargetLanguage } = {
//     'en': 'en-IN',
//     'hi': 'hi-IN',
//     'mr': 'mr-IN',
//     'ta': 'ta-IN',
//   };
//   return mapping[lang] || 'en-IN'; // Default to en-IN if no mapping
// };

// const translateText = async (text: string, sourceLang: TranslateSourceLanguage, targetLang: TranslateTargetLanguage): Promise<string> => {
//   if (!text) return '';
//   if (sourceLang === targetLang) return text;

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
//     return text;
//   }
// };

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
//   if (sourceLang === targetLang) return { ...post };

//   const fieldsToTranslate = ['title', 'description', 'schemeName'];
//   const translatedPost = { ...post };

//   for (const field of fieldsToTranslate) {
//     const text = post[field];
//     if (typeof text !== 'string' || !text) {
//       translatedPost[field] = '';
//       continue;
//     }
//     const chunks = chunkText(text);
//     const translatedChunks = await Promise.all(
//       chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//     );
//     translatedPost[field] = translatedChunks.join('. ');
//   }

//   return translatedPost;
// };

// export default function CommunityPostsWithSarvam() {
//   const { language } = useLanguage();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("newest");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const params: Record<string, any> = {};
//         if (filter === 'newest') {
//           params.sort = 'createdAt';
//           params.order = 'desc';
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length';
//           params.order = 'desc';
//         } else if (filter === 'unanswered') {
//           params.unanswered = true;
//         }

//         const response = await api.get('/posts/approved', { params });
//         const validPosts = response.data.filter(
//           (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
//         );
//         setPosts(validPosts);
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [filter]);

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true);
//       try {
//         const targetLang = mapLanguageToSarvam(language);
//         const translated = await Promise.all(
//           posts.map(post => translatePost(post, targetLang))
//         );
//         setDisplayPosts(translated);
//       } catch (error) {
//         console.error('Error translating posts:', error);
//         setDisplayPosts(posts);
//         toast.error('Failed to translate posts. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePosts();
//   }, [posts, language]);

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType });
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       setDisplayPosts(displayPosts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//     }
//   };

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               Community Hub
//             </h1>
//             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//               Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//             </p>
//           </div>

//           <div className="mb-8 flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search posts and discussions..."
//                 className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Newest First
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="upvotes">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Most Upvoted
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="unanswered">
//                   <div className="flex items-center gap-2">
//                     <MessageCircle className="w-4 h-4" />
//                     Unanswered
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">Loading...</div>
//           ) : (
//             <div className="space-y-6">
//               {filteredPosts.map((post) => (
//                 <Card
//                   key={post._id}
//                   className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                             {post.title || 'Untitled'}
//                           </h3>
//                         </Link>
//                         <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
//                           {post.schemeName || 'General'}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-slate-500">
//                         <User className="w-4 h-4" />
//                         <span>{post.userId?.username || 'Anonymous'}</span>
//                         <span>•</span>
//                         <Calendar className="w-4 h-4" />
//                         <span>{formatDate(post.createdAt)}</span>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-0">
//                     <p className="text-slate-700 text-base leading-relaxed line-clamp-3 mb-4">
//                       {post.description || 'No description available'}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "upvote")}
//                           className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
//                         >
//                           <ArrowUp className="w-4 h-4" />
//                           <span>{post.upvotes?.length || 0}</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "downvote")}
//                           className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
//                         >
//                           <ArrowDown className="w-4 h-4" />
//                           <span>{post.downvotes?.length || 0}</span>
//                         </Button>
//                         <div className="flex items-center gap-2 text-slate-500">
//                           <MessageCircle className="w-4 h-4" />
//                           <span>{post.comments?.length || 0} comments</span>
//                         </div>
//                       </div>
//                       <Link to={`/post/${post._id}`}>
//                         <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
//                           Read More
//                         </Button>
//                       </Link>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Badge } from "../components/ui/badge";
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Sidebar2 from "@/components/Common/Sidebar";
// import { SarvamAIClient } from "sarvamai";
// import { useLanguage } from '../Context/LanguageContext';
// import { useTranslation } from "react-i18next";

// const API_BASE_URL = 'http://localhost:5000/api';
// // const API_BASE_URL = 'https://haqdarshak-stackoverflow-project.onrender.com/api/'

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

// interface User {
//   username: string;
// }

// interface Comment {
//   [key: string]: any;
// }

// interface Post {
//   _id: string;
//   title: string;
//   description: string;
//   schemeName: string;
//   userId?: User;
//   upvotes?: any[];
//   downvotes?: any[];
//   comments?: Comment[];
//   createdAt: string;
//   language?: string;
//   [key: string]: any;
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

// // Map LanguageContext codes to Sarvam AI codes
// const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
//   const mapping: { [key: string]: TranslateTargetLanguage } = {
//     'en': 'en-IN',
//     'hi': 'hi-IN',
//     'mr': 'mr-IN',
//     'ta': 'ta-IN',
//   };
//   return mapping[lang] || 'en-IN'; // Default to en-IN if no mapping
// };

// const translateText = async (text: string, sourceLang: TranslateSourceLanguage, targetLang: TranslateTargetLanguage): Promise<string> => {
//   if (!text) return '';
//   if (sourceLang === targetLang) return text;

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
//     return text;
//   }
// };

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
//   if (sourceLang === targetLang) return { ...post };

//   const fieldsToTranslate = ['title', 'description', 'schemeName'];
//   const translatedPost = { ...post };

//   for (const field of fieldsToTranslate) {
//     const text = post[field];
//     if (typeof text !== 'string' || !text) {
//       translatedPost[field] = '';
//       continue;
//     }
//     const chunks = chunkText(text);
//     const translatedChunks = await Promise.all(
//       chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
//     );
//     translatedPost[field] = translatedChunks.join('. ');
//   }

//   return translatedPost;
// };

// export default function CommunityPostsWithSarvam() {
//   const languageContext = useLanguage() as unknown as { language?: string } | null;
//   const language = languageContext?.language || "en";
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filter, setFilter] = useState("newest");
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 10;

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const params: Record<string, any> = {};
//         if (filter === 'newest') {
//           params.sort = 'createdAt';
//           params.order = 'desc';
//         } else if (filter === 'upvotes') {
//           params.sort = 'upvotes.length';
//           params.order = 'desc';
//         } else if (filter === 'unanswered') {
//           params.unanswered = true;
//         }

//         const response = await api.get('/posts/approved', { params });
//         const validPosts = response.data.filter(
//           (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
//         );
//         setPosts(validPosts);
//       } catch (error) {
//         toast.error('Failed to load posts. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [filter]);

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true);
//       try {
//         const targetLang = mapLanguageToSarvam(language);
//         const translated = await Promise.all(
//           posts.map(post => translatePost(post, targetLang))
//         );
//         setDisplayPosts(translated);
//       } catch (error) {
//         console.error('Error translating posts:', error);
//         setDisplayPosts(posts);
//         toast.error('Failed to translate posts. Showing original content.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     translatePosts();
//   }, [posts, language]);

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType });
//       setPosts(posts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       setDisplayPosts(displayPosts.map(post => 
//         post._id === postId ? response.data.post : post
//       ));
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response;
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes('Already')
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else if (response.status === 401) {
//           toast.error('Please log in to vote.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         } else {
//           toast.error('Failed to record vote. Please try again.', {
//             position: 'top-right',
//             style: { background: '#fee2e2', color: '#dc2626' }
//           });
//         }
//       } else {
//         toast.error('Failed to record vote. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//     }
//   };

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // Reset to first page when search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
//   const startIndex = (currentPage - 1) * postsPerPage;
//   const endIndex = startIndex + postsPerPage;
//   const currentPosts = filteredPosts.slice(startIndex, endIndex);

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               Community Hub
//             </h1>
//             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
//               Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
//             </p>
//           </div>

//           <div className="mb-8 flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search posts and discussions..."
//                 className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Newest First
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="upvotes">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4" />
//                     Most Upvoted
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="unanswered">
//                   <div className="flex items-center gap-2">
//                     <MessageCircle className="w-4 h-4" />
//                     Unanswered
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//                 {loading ? (
//                       <div className="text-center py-16">
//                         <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
//                           <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//                           <span className="text-lg p-4 font-medium text-slate-700">Loading (Translating content) into {language}...</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {currentPosts.map((post) => (
//                           <Card
//                             key={post._id}
//                             className="bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 group"
//                           >
//                             <CardContent className="p-0">
//                               <div className="flex">
//                                 {/* Left sidebar with vote counts */}
//                                 <div className="flex flex-col items-center justify-start p-4 bg-slate-50/50 border-r border-slate-200/50 min-w-[80px]">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => handleVote(post._id, "upvote")}
//                                     className="flex flex-col items-center gap-1 text-slate-600 hover:text-green-600 hover:bg-green-50/50 p-2 rounded-lg transition-all duration-200 mb-1"
//                                   >
//                                     <ArrowUp className="w-5 h-5" />
//                                   </Button>
//                                   <div className="text-xl font-bold text-slate-700 py-1">
//                                     {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
//                                   </div>
//                                   <div className="text-xs text-slate-500 font-medium mb-2">votes</div>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => handleVote(post._id, "downvote")}
//                                     className="flex flex-col items-center gap-1 text-slate-600 hover:text-red-600 hover:bg-red-50/50 p-2 rounded-lg transition-all duration-200 mb-3"
//                                   >
//                                     <ArrowDown className="w-5 h-5" />
//                                   </Button>
//                                   <div className="flex flex-col items-center text-slate-500">
//                                     <div className="text-sm font-semibold">
//                                       {Array.isArray(post.comments) ? post.comments.length : 0}
//                                     </div>
//                                     <div className="text-xs">answers</div>
//                                   </div>
//                                 </div>
          
//                                 {/* Main content area */}
//                                 <div className="flex-1 p-6">
//                                   <div className="flex flex-col gap-4">
//                                     {/* Title and scheme badge */}
//                                     <div className="flex flex-col gap-3">
//                                       <Link to={`/post/${post._id}`}>
//                                         <h3 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer leading-tight">
//                                           {post.title || "Untitled"}
//                                         </h3>
//                                       </Link>
//                                       <Badge
//                                         variant="secondary"
//                                         className="self-start bg-blue-100 text-blue-800 font-medium px-3 py-1 text-sm rounded-md border-0"
//                                       >
//                                         {post.schemeName || "General"}
//                                       </Badge>
//                                     </div>
          
//                                     {/* Description */}
//                                     <p className="text-slate-700 text-base leading-relaxed line-clamp-3">
//                                       {post.description || "No description available"}
//                                     </p>
          
//                                     {/* Bottom section with user info and read more */}
//                                     <div className="flex items-center justify-between pt-2">
//                                       <div className="flex items-center gap-4 text-sm text-slate-600">
//                                         <div className="flex items-center gap-2">
//                                           <User className="w-4 h-4" />
//                                           <span className="font-medium">
//                                             {(post.userId as User)?.username || "Anonymous"}
//                                           </span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                           <Calendar className="w-4 h-4" />
//                                           <span>{formatDate(post.createdAt)}</span>
//                                         </div>
//                                       </div>
//                                       <Link to={`/post/${post._id}`}>
//                                         <Button
//                                           variant="outline"
//                                           className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium px-4 py-2 rounded-md transition-all duration-200 bg-transparent"
//                                         >
//                                           Read More
//                                         </Button>
//                                       </Link>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}

//           {/* {loading ? (
//             <div className="text-center py-12">Loading...</div>
//           ) : (
//             <div className="space-y-6">
//               {currentPosts.map((post) => (
//                 <Card
//                   key={post._id}
//                   className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
//                             {post.title || 'Untitled'}
//                           </h3>
//                         </Link>
//                         <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
//                           {post.schemeName || 'General'}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-slate-500">
//                         <User className="w-4 h-4" />
//                         <span>{post.userId?.username || 'Anonymous'}</span>
//                         <span>•</span>
//                         <Calendar className="w-4 h-4" />
//                         <span>{formatDate(post.createdAt)}</span>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-0">
//                     <p className="text-slate-700 text-base leading-relaxed line-clamp-3 mb-4">
//                       {post.description || 'No description available'}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "upvote")}
//                           className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
//                         >
//                           <ArrowUp className="w-4 h-4" />
//                           <span>{post.upvotes?.length || 0}</span>
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "downvote")}
//                           className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
//                         >
//                           <ArrowDown className="w-4 h-4" />
//                           <span>{post.downvotes?.length || 0}</span>
//                         </Button>
//                         <div className="flex items-center gap-2 text-slate-500">
//                           <MessageCircle className="w-4 h-4" />
//                           <span>{Array.isArray(post.comments) ? post.comments.length : 0} comments</span>
//                         </div>
//                       </div>
//                       <Link to={`/post/${post._id}`}>
//                         <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
//                           Read More
//                         </Button>
//                       </Link>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )} */}

//           {/* Pagination Controls */}
//           {!loading && filteredPosts.length > 0 && (
//             <div className="flex justify-center items-center gap-4 mt-8">
//               <Button
//                 variant="outline"
//                 onClick={goToPreviousPage}
//                 disabled={currentPage === 1}
//                 className="flex items-center gap-2"
//               >
//                 Previous
//               </Button>
              
//               <div className="flex items-center gap-2">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     onClick={() => goToPage(page)}
//                     className={`w-10 h-10 ${
//                       currentPage === page 
//                         ? "bg-blue-600 text-white" 
//                         : "text-blue-600 border-blue-200 hover:bg-blue-50"
//                     }`}
//                   >
//                     {page}
//                   </Button>
//                 ))}
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={goToNextPage}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center gap-2"
//               >
//                 Next
//               </Button>
//             </div>
//           )}

//           {/* Show pagination info */}
//           {!loading && filteredPosts.length > 0 && (
//             <div className="text-center mt-4 text-sm text-slate-600">
//               Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
//               <p className="text-slate-500">Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar2 from "@/components/Common/Sidebar";
import { SarvamAIClient } from "sarvamai";
import { useTranslation } from "react-i18next";

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

interface User {
  username: string;
}

interface Comment {
  [key: string]: any;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  schemeName: string;
  userId?: User;
  upvotes?: any[];
  downvotes?: any[];
  comments?: Comment[];
  createdAt: string;
  language?: string;
  [key: string]: any;
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

const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
  const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...post };

  const fieldsToTranslate = ['title', 'description', 'schemeName'];
  const translatedPost = { ...post };

  for (const field of fieldsToTranslate) {
    const text = post[field];
    if (typeof text !== 'string' || !text) {
      translatedPost[field] = '';
      continue;
    }
    const chunks = chunkText(text);
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
    );
    translatedPost[field] = translatedChunks.join('. ');
  }

  return translatedPost;
};

export default function CommunityPostsWithSarvam() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {};
        if (filter === 'newest') {
          params.sort = 'createdAt';
          params.order = 'desc';
        } else if (filter === 'upvotes') {
          params.sort = 'upvotes.length';
          params.order = 'desc';
        } else if (filter === 'unanswered') {
          params.unanswered = true;
        }

        const response = await api.get('/posts/approved', { params });
        const validPosts = response.data.filter(
          (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
        );
        setPosts(validPosts);
      } catch (error) {
        toast.error(t('community.error.loadPosts'), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter, t]);

  useEffect(() => {
    const translatePosts = async () => {
      setLoading(true);
      try {
        const targetLang = mapLanguageToSarvam(i18n.language);
        const translated = await Promise.all(
          posts.map(post => translatePost(post, targetLang))
        );
        setDisplayPosts(translated);
      } catch (error) {
        console.error('Error translating posts:', error);
        setDisplayPosts(posts);
        toast.error(t('community.error.translatePosts'), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePosts();
  }, [posts, i18n.language]);

  const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      setPosts(posts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      setDisplayPosts(displayPosts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      toast.success(t(`community.success.${voteType}`), {
        position: 'top-right',
        style: { background: '#dcfce7', color: '#15803d' }
      });
    } catch (error: any) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response;
        if (
          response.status === 400 &&
          response.data?.message &&
          typeof response.data.message === "string" &&
          response.data.message.includes('Already')
        ) {
          toast.error(t(`community.error.alreadyVoted`, { voteType }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (response.status === 401) {
          toast.error(t('community.error.loginToVote'), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error(t('community.error.voteFailed'), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else {
        toast.error(t('community.error.voteFailed'), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      }
    }
  };

  const filteredPosts = displayPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return t('community.date.yesterday');
    if (diffDays < 7) return t('community.date.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar2 />
      <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
              {t('community.title')}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {t('community.description')}
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('community.searchPlaceholder')}
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                <SelectValue placeholder={t('community.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('community.filters.newest')}
                  </div>
                </SelectItem>
                <SelectItem value="upvotes">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('community.filters.upvotes')}
                  </div>
                </SelectItem>
                <SelectItem value="unanswered">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t('community.filters.unanswered')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-lg p-4 font-medium text-slate-700">
                  {t('community.loading', { language: t(`languages.${i18n.language}`) })}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex flex-col items-center justify-start p-4 bg-slate-50/50 border-r border-slate-200/50 min-w-[80px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "upvote")}
                          className="flex flex-col items-center gap-1 text-slate-600 hover:text-green-600 hover:bg-green-50/50 p-2 rounded-lg transition-all duration-200 mb-1"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </Button>
                        <div className="text-xl font-bold text-slate-700 py-1">
                          {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mb-2">{t('community.votes')}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "downvote")}
                          className="flex flex-col items-center gap-1 text-slate-600 hover:text-red-600 hover:bg-red-50/50 p-2 rounded-lg transition-all duration-200 mb-3"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </Button>
                        <div className="flex flex-col items-center text-slate-500">
                          <div className="text-sm font-semibold">
                            {Array.isArray(post.comments) ? post.comments.length : 0}
                          </div>
                          <div className="text-xs">{t('community.answers')}</div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3">
                            <Link to={`/post/${post._id}`}>
                              <h3 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer leading-tight">
                                {post.title || t('community.untitled')}
                              </h3>
                            </Link>
                            <Badge
                              variant="secondary"
                              className="self-start bg-blue-100 text-blue-800 font-medium px-3 py-1 text-sm rounded-md border-0"
                            >
                              {post.schemeName || t('community.general')}
                            </Badge>
                          </div>

                          <p className="text-slate-700 text-base leading-relaxed line-clamp-3">
                            {post.description || t('community.noDescription')}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">
                                  {(post.userId as User)?.username || t('community.anonymous')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                            <Link to={`/post/${post._id}`}>
                              <Button
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium px-4 py-2 rounded-md transition-all duration-200 bg-transparent"
                              >
                                {t('community.readMore')}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                {t('community.previous')}
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 ${
                      currentPage === page 
                        ? "bg-blue-600 text-white" 
                        : "text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                {t('community.next')}
              </Button>
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="text-center mt-4 text-sm text-slate-600">
              {t('community.paginationInfo', {
                start: startIndex + 1,
                end: Math.min(endIndex, filteredPosts.length),
                total: filteredPosts.length
              })}
            </div>
          )}

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">{t('community.noPosts')}</h3>
              <p className="text-slate-500">{t('community.noPostsMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
// import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, TrendingUp, Sparkles } from "lucide-react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import Sidebar2 from "@/components/Common/Sidebar"
// import { SarvamAIClient } from "sarvamai"
// import { useLanguage } from "../Context/LanguageContext"

// const API_BASE_URL = "http://localhost:5000/api"
// // const API_BASE_URL = 'https://haqdarshak-stackoverflow-project.onrender.com/api/'

// const SARVAM_API_KEY = "sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP"
// const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY })

// const getAuthToken = () => localStorage.getItem("token")

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// interface Comment {
//   [key: string]: any
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   schemeName: string
//   userId?: any
//   upvotes?: any[]
//   downvotes?: any[]
//   comments?: Comment[]
//   createdAt: string
//   language?: string
//   [key: string]: any
// }

// interface UserProfile {
//   username: string
// }

// const chunkText = (text: any, maxLength = 2000): string[] => {
//   if (typeof text !== "string" || !text) {
//     return [""]
//   }
//   const chunks: string[] = []
//   let currentChunk = ""
//   const sentences = text
//     .split(".")
//     .map((s) => s.trim())
//     .filter((s) => s)

//   for (const sentence of sentences) {
//     if ((currentChunk + sentence).length <= maxLength) {
//       currentChunk += (currentChunk ? ". " : "") + sentence
//     } else {
//       if (currentChunk) chunks.push(currentChunk)
//       currentChunk = sentence
//     }
//   }
//   if (currentChunk) chunks.push(currentChunk)
//   return chunks
// }

// type TranslateSourceLanguage =
//   | "bn-IN"
//   | "en-IN"
//   | "gu-IN"
//   | "hi-IN"
//   | "kn-IN"
//   | "ml-IN"
//   | "mr-IN"
//   | "od-IN"
//   | "pa-IN"
//   | "ta-IN"
//   | "te-IN"

// type TranslateTargetLanguage =
//   | "bn-IN"
//   | "en-IN"
//   | "gu-IN"
//   | "hi-IN"
//   | "kn-IN"
//   | "ml-IN"
//   | "mr-IN"
//   | "od-IN"
//   | "pa-IN"
//   | "ta-IN"
//   | "te-IN"
//   | "as-IN"
//   | "brx-IN"
//   | "doi-IN"
//   | "kok-IN"
//   | "ks-IN"
//   | "mai-IN"
//   | "mni-IN"
//   | "ne-IN"
//   | "sa-IN"
//   | "sat-IN"
//   | "sd-IN"
//   | "ur-IN"

// // Map LanguageContext codes to Sarvam AI codes
// const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
//   const mapping: { [key: string]: TranslateTargetLanguage } = {
//     en: "en-IN",
//     hi: "hi-IN",
//     mr: "mr-IN",
//     ta: "ta-IN",
//   }
//   return mapping[lang] || "en-IN" // Default to en-IN if no mapping
// }

// const translateText = async (
//   text: string,
//   sourceLang: TranslateSourceLanguage,
//   targetLang: TranslateTargetLanguage,
// ): Promise<string> => {
//   if (!text) return ""
//   if (sourceLang === targetLang) return text

//   const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`
//   const cached = localStorage.getItem(cacheKey)
//   if (cached) return cached

//   try {
//     const response = await client.text.translate({
//       input: text,
//       source_language_code: sourceLang,
//       target_language_code: targetLang,
//       model: "sarvam-translate:v1",
//       enable_preprocessing: true,
//       numerals_format: "international",
//     })
//     const translatedText = response.translated_text
//     localStorage.setItem(cacheKey, translatedText)
//     return translatedText
//   } catch (error: any) {
//     console.error("Sarvam AI Translation error:", error)
//     let errorMessage = "Translation failed"
//     if (error.response?.data?.error?.message) {
//       errorMessage = `Translation error: ${error.response.data.error.message}`
//     } else if (error.response?.status === 400) {
//       errorMessage = "Invalid request. Check API key or language codes."
//     } else if (error.response?.status === 401) {
//       errorMessage = "Unauthorized. Invalid API key."
//     }
//     toast.error(errorMessage, {
//       position: "top-right",
//       style: { background: "#fee2e2", color: "#dc2626" },
//     })
//     return text
//   }
// }

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || "en-IN") as TranslateSourceLanguage
//   if (sourceLang === targetLang) return { ...post }

//   const fieldsToTranslate = ["title", "description", "schemeName"]
//   const translatedPost = { ...post }

//   for (const field of fieldsToTranslate) {
//     const text = post[field]
//     if (typeof text !== "string" || !text) {
//       translatedPost[field] = ""
//       continue
//     }
//     const chunks = chunkText(text)
//     const translatedChunks = await Promise.all(chunks.map((chunk) => translateText(chunk, sourceLang, targetLang)))
//     translatedPost[field] = translatedChunks.join(". ")
//   }

//   return translatedPost
// }

// export default function CommunityPostsWithSarvam() {
//   const { language } = useLanguage()
//   const [posts, setPosts] = useState<Post[]>([])
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const postsPerPage = 10

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true)
//       try {
//         const params: Record<string, any> = {}
//         if (filter === "newest") {
//           params.sort = "createdAt"
//           params.order = "desc"
//         } else if (filter === "upvotes") {
//           params.sort = "upvotes.length"
//           params.order = "desc"
//         } else if (filter === "unanswered") {
//           params.unanswered = true
//         }

//         const response = await api.get("/posts/approved", { params })
//         const validPosts = response.data.filter(
//           (post: any) =>
//             post &&
//             typeof post.title === "string" &&
//             typeof post.description === "string" &&
//             typeof post.schemeName === "string",
//         )
//         setPosts(validPosts)
//       } catch (error) {
//         toast.error("Failed to load posts. Please try again.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPosts()
//   }, [filter])

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true)
//       try {
//         const targetLang = mapLanguageToSarvam(language)
//         const translated = await Promise.all(posts.map((post) => translatePost(post, targetLang)))
//         setDisplayPosts(translated)
//       } catch (error) {
//         console.error("Error translating posts:", error)
//         setDisplayPosts(posts)
//         toast.error("Failed to translate posts. Showing original content.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     translatePosts()
//   }, [posts, language])

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType })
//       setPosts(posts.map((post) => (post._id === postId ? response.data.post : post)))
//       setDisplayPosts(displayPosts.map((post) => (post._id === postId ? response.data.post : post)))
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: "top-right",
//         style: { background: "#dcfce7", color: "#15803d" },
//       })
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes("Already")
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         } else if (response.status === 401) {
//           toast.error("Please log in to vote.", {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         } else {
//           toast.error("Failed to record vote. Please try again.", {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         }
//       } else {
//         toast.error("Failed to record vote. Please try again.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       }
//     }
//   }

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   // Reset to first page when search query changes
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchQuery])

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
//   const startIndex = (currentPage - 1) * postsPerPage
//   const endIndex = startIndex + postsPerPage
//   const currentPosts = filteredPosts.slice(startIndex, endIndex)

//   const goToPage = (page: number) => {
//     setCurrentPage(page)
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1)
//     }
//   }

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen flex bg-slate-50">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden">
//         <ToastContainer position="top-right" autoClose={3000} className="mt-16" toastClassName="backdrop-blur-sm" />

//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
//           <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center mb-12 pt-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
//                 <Sparkles className="w-8 h-8 text-white" />
//               </div>
//               <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
//                 Community Hub
//               </h1>
//             </div>
//             <p className="text-slate-600 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
//               Share knowledge, ask questions, and connect with fellow agents.
//               <span className="text-indigo-600 font-semibold"> Contribute to the community and earn rewards!</span>
//             </p>
//           </div>

//           <div className="mb-10">
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search posts, discussions, and schemes..."
//                     className="pl-12 h-14 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl text-lg font-medium placeholder:text-slate-400"
//                   />
//                 </div>
//                 <Select value={filter} onValueChange={setFilter}>
//                   <SelectTrigger className="w-full lg:w-56 h-14 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl text-lg font-medium">
//                     <SelectValue placeholder="Sort by" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200">
//                     <SelectItem value="newest" className="text-lg py-3">
//                       <div className="flex items-center gap-3">
//                         <Calendar className="w-5 h-5 text-indigo-500" />
//                         <span className="font-medium">Newest First</span>
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="upvotes" className="text-lg py-3">
//                       <div className="flex items-center gap-3">
//                         <TrendingUp className="w-5 h-5 text-green-500" />
//                         <span className="font-medium">Most Upvoted</span>
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="unanswered" className="text-lg py-3">
//                       <div className="flex items-center gap-3">
//                         <MessageCircle className="w-5 h-5 text-orange-500" />
//                         <span className="font-medium">Unanswered</span>
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-16">
//               <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
//                 <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//                 <span className="text-lg font-medium text-slate-700">Loading amazing content...</span>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {currentPosts.map((post) => (
//                 <div
//                   key={post._id}
//                   className="bg-[#1c1e21] border-b border-gray-700 hover:bg-[#232629] transition-colors duration-200 py-4 px-4"
//                 >
//                   <div className="flex gap-4">
//                     {/* Left sidebar with Stack Overflow style stats */}
//                     <div className="flex flex-col items-end text-right min-w-[100px] text-sm text-gray-400 space-y-1 pt-1">
//                       <div className="flex flex-col items-center">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "upvote")}
//                           className="text-gray-400 hover:text-orange-400 p-1 h-auto"
//                         >
//                           <ArrowUp className="w-4 h-4" />
//                         </Button>
//                         <span className="font-semibold text-gray-300">
//                           {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
//                         </span>
//                         <span className="text-xs">votes</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleVote(post._id, "downvote")}
//                           className="text-gray-400 hover:text-orange-400 p-1 h-auto"
//                         >
//                           <ArrowDown className="w-4 h-4" />
//                         </Button>
//                       </div>

//                       <div className="mt-2">
//                         <span className="font-semibold text-gray-300">
//                           {Array.isArray(post.comments) ? post.comments.length : 0}
//                         </span>
//                         <span className="text-xs block">answers</span>
//                       </div>

//                       <div className="mt-1">
//                         <span className="font-semibold text-gray-300">218</span>
//                         <span className="text-xs block">views</span>
//                       </div>

//                       {/* Bounty badge like Stack Overflow */}
//                       <div className="mt-2">
//                         <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">+100</span>
//                       </div>
//                     </div>

//                     {/* Main content area */}
//                     <div className="flex-1">
//                       <div className="flex flex-col gap-2">
//                         {/* Title - Stack Overflow blue color */}
//                         <Link to={`/post/${post._id}`}>
//                           <h3 className="text-[#6CB6FF] text-lg font-normal hover:text-[#8CC8FF] transition-colors duration-200 cursor-pointer leading-tight">
//                             {post.title || "Untitled"}
//                           </h3>
//                         </Link>

//                         {/* Description - Stack Overflow gray text */}
//                         <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-2">
//                           {post.description || "No description available"}
//                         </p>

//                         {/* Tags - Stack Overflow style */}
//                         <div className="flex items-center gap-2 mb-3">
//                           <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-medium">
//                             {post.schemeName || "general"}
//                           </span>
//                           <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-medium">
//                             community
//                           </span>
//                         </div>

//                         {/* Bottom section with user info - Stack Overflow style */}
//                         <div className="flex items-center justify-between">
//                           <Link to={`/post/${post._id}`}>
//                             <Button
//                               variant="ghost"
//                               className="text-[#6CB6FF] hover:text-[#8CC8FF] font-normal text-sm p-0 h-auto bg-transparent"
//                             >
//                               Read More
//                             </Button>
//                           </Link>

//                           <div className="flex items-center gap-2 text-xs text-gray-400">
//                             <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
//                             <span className="text-[#6CB6FF] font-medium">
//                               {(post.userId as UserProfile)?.username || "Anonymous"}
//                             </span>
//                             <span className="font-semibold text-gray-300">2,441</span>
//                             <span>asked {formatDate(post.createdAt)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {!loading && filteredPosts.length > 0 && (
//             <div className="mt-12">
//               <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
//                 <div className="flex justify-center items-center gap-3 mb-4">
//                   <Button
//                     variant="outline"
//                     onClick={goToPreviousPage}
//                     disabled={currentPage === 1}
//                     className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 disabled:opacity-50 bg-transparent"
//                   >
//                     Previous
//                   </Button>

//                   <div className="flex items-center gap-2">
//                     {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
//                       let page
//                       if (totalPages <= 7) {
//                         page = i + 1
//                       } else if (currentPage <= 4) {
//                         page = i + 1
//                       } else if (currentPage >= totalPages - 3) {
//                         page = totalPages - 6 + i
//                       } else {
//                         page = currentPage - 3 + i
//                       }

//                       return (
//                         <Button
//                           key={page}
//                           variant={currentPage === page ? "default" : "outline"}
//                           onClick={() => goToPage(page)}
//                           className={`w-12 h-12 rounded-xl font-bold text-lg ${
//                             currentPage === page
//                               ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                               : "text-slate-600 border-slate-200 hover:bg-slate-50"
//                           }`}
//                         >
//                           {page}
//                         </Button>
//                       )
//                     })}
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={goToNextPage}
//                     disabled={currentPage === totalPages}
//                     className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 disabled:opacity-50 bg-transparent"
//                   >
//                     Next
//                   </Button>
//                 </div>

//                 <div className="text-center text-slate-600 font-medium">
//                   Showing <span className="font-bold text-indigo-600">{startIndex + 1}</span> to{" "}
//                   <span className="font-bold text-indigo-600">{Math.min(endIndex, filteredPosts.length)}</span> of{" "}
//                   <span className="font-bold text-indigo-600">{filteredPosts.length}</span> posts
//                 </div>
//               </div>
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-16">
//               <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
//                 <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <MessageCircle className="w-10 h-10 text-slate-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-slate-700 mb-3">No posts found</h3>
//                 <p className="text-slate-500 text-lg leading-relaxed">
//                   Try adjusting your search terms or filter criteria to discover more content
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
// import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import Sidebar2 from "@/components/Common/Sidebar"
// import { SarvamAIClient } from "sarvamai"
// import { useLanguage } from "../Context/LanguageContext"

// const API_BASE_URL = "http://localhost:5000/api"
// // const API_BASE_URL = 'https://haqdarshak-stackoverflow-project.onrender.com/api/'

// const SARVAM_API_KEY = "sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP"
// const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY })

// const getAuthToken = () => localStorage.getItem("token")

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// api.interceptors.request.use((config) => {
//   const token = getAuthToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// interface Comment {
//   [key: string]: any
// }

// interface Post {
//   _id: string
//   title: string
//   description: string
//   schemeName: string
//   userId?: any
//   upvotes?: any[]
//   downvotes?: any[]
//   comments?: Comment[]
//   createdAt: string
//   language?: string
//   [key: string]: any
// }

// interface UserProfile {
//   username: string
// }

// const chunkText = (text: any, maxLength = 2000): string[] => {
//   if (typeof text !== "string" || !text) {
//     return [""]
//   }
//   const chunks: string[] = []
//   let currentChunk = ""
//   const sentences = text
//     .split(".")
//     .map((s) => s.trim())
//     .filter((s) => s)

//   for (const sentence of sentences) {
//     if ((currentChunk + sentence).length <= maxLength) {
//       currentChunk += (currentChunk ? ". " : "") + sentence
//     } else {
//       if (currentChunk) chunks.push(currentChunk)
//       currentChunk = sentence
//     }
//   }
//   if (currentChunk) chunks.push(currentChunk)
//   return chunks
// }

// type TranslateSourceLanguage =
//   | "bn-IN"
//   | "en-IN"
//   | "gu-IN"
//   | "hi-IN"
//   | "kn-IN"
//   | "ml-IN"
//   | "mr-IN"
//   | "od-IN"
//   | "pa-IN"
//   | "ta-IN"
//   | "te-IN"

// type TranslateTargetLanguage =
//   | "bn-IN"
//   | "en-IN"
//   | "gu-IN"
//   | "hi-IN"
//   | "kn-IN"
//   | "ml-IN"
//   | "mr-IN"
//   | "od-IN"
//   | "pa-IN"
//   | "ta-IN"
//   | "te-IN"
//   | "as-IN"
//   | "brx-IN"
//   | "doi-IN"
//   | "kok-IN"
//   | "ks-IN"
//   | "mai-IN"
//   | "mni-IN"
//   | "ne-IN"
//   | "sa-IN"
//   | "sat-IN"
//   | "sd-IN"
//   | "ur-IN"

// // Map LanguageContext codes to Sarvam AI codes
// const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
//   const mapping: { [key: string]: TranslateTargetLanguage } = {
//     en: "en-IN",
//     hi: "hi-IN",
//     mr: "mr-IN",
//     ta: "ta-IN",
//   }
//   return mapping[lang] || "en-IN" // Default to en-IN if no mapping
// }

// const translateText = async (
//   text: string,
//   sourceLang: TranslateSourceLanguage,
//   targetLang: TranslateTargetLanguage,
// ): Promise<string> => {
//   if (!text) return ""
//   if (sourceLang === targetLang) return text

//   const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`
//   const cached = localStorage.getItem(cacheKey)
//   if (cached) return cached

//   try {
//     const response = await client.text.translate({
//       input: text,
//       source_language_code: sourceLang,
//       target_language_code: targetLang,
//       model: "sarvam-translate:v1",
//       enable_preprocessing: true,
//       numerals_format: "international",
//     })
//     const translatedText = response.translated_text
//     localStorage.setItem(cacheKey, translatedText)
//     return translatedText
//   } catch (error: any) {
//     console.error("Sarvam AI Translation error:", error)
//     let errorMessage = "Translation failed"
//     if (error.response?.data?.error?.message) {
//       errorMessage = `Translation error: ${error.response.data.error.message}`
//     } else if (error.response?.status === 400) {
//       errorMessage = "Invalid request. Check API key or language codes."
//     } else if (error.response?.status === 401) {
//       errorMessage = "Unauthorized. Invalid API key."
//     }
//     toast.error(errorMessage, {
//       position: "top-right",
//       style: { background: "#fee2e2", color: "#dc2626" },
//     })
//     return text
//   }
// }

// const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
//   const sourceLang = (post.language || "en-IN") as TranslateSourceLanguage
//   if (sourceLang === targetLang) return { ...post }

//   const fieldsToTranslate = ["title", "description", "schemeName"]
//   const translatedPost = { ...post }

//   for (const field of fieldsToTranslate) {
//     const text = post[field]
//     if (typeof text !== "string" || !text) {
//       translatedPost[field] = ""
//       continue
//     }
//     const chunks = chunkText(text)
//     const translatedChunks = await Promise.all(chunks.map((chunk) => translateText(chunk, sourceLang, targetLang)))
//     translatedPost[field] = translatedChunks.join(". ")
//   }

//   return translatedPost
// }

// export default function CommunityPostsWithSarvam() {
//   const { language } = useLanguage()
//   const [posts, setPosts] = useState<Post[]>([])
//   const [displayPosts, setDisplayPosts] = useState<Post[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filter, setFilter] = useState("newest")
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const postsPerPage = 10

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true)
//       try {
//         const params: Record<string, any> = {}
//         if (filter === "newest") {
//           params.sort = "createdAt"
//           params.order = "desc"
//         } else if (filter === "upvotes") {
//           params.sort = "upvotes.length"
//           params.order = "desc"
//         } else if (filter === "unanswered") {
//           params.unanswered = true
//         }

//         const response = await api.get("/posts/approved", { params })
//         const validPosts = response.data.filter(
//           (post: any) =>
//             post &&
//             typeof post.title === "string" &&
//             typeof post.description === "string" &&
//             typeof post.schemeName === "string",
//         )
//         setPosts(validPosts)
//       } catch (error) {
//         toast.error("Failed to load posts. Please try again.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchPosts()
//   }, [filter])

//   useEffect(() => {
//     const translatePosts = async () => {
//       setLoading(true)
//       try {
//         const targetLang = mapLanguageToSarvam(language)
//         const translated = await Promise.all(posts.map((post) => translatePost(post, targetLang)))
//         setDisplayPosts(translated)
//       } catch (error) {
//         console.error("Error translating posts:", error)
//         setDisplayPosts(posts)
//         toast.error("Failed to translate posts. Showing original content.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     translatePosts()
//   }, [posts, language])

//   const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
//     try {
//       const response = await api.post(`/posts/${postId}/vote`, { voteType })
//       setPosts(posts.map((post) => (post._id === postId ? response.data.post : post)))
//       setDisplayPosts(displayPosts.map((post) => (post._id === postId ? response.data.post : post)))
//       toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
//         position: "top-right",
//         style: { background: "#dcfce7", color: "#15803d" },
//       })
//     } catch (error: any) {
//       if (
//         typeof error === "object" &&
//         error !== null &&
//         "response" in error &&
//         typeof error.response === "object" &&
//         error.response !== null
//       ) {
//         const response = error.response
//         if (
//           response.status === 400 &&
//           response.data?.message &&
//           typeof response.data.message === "string" &&
//           response.data.message.includes("Already")
//         ) {
//           toast.error(`You have already ${voteType}d this post.`, {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         } else if (response.status === 401) {
//           toast.error("Please log in to vote.", {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         } else {
//           toast.error("Failed to record vote. Please try again.", {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//         }
//       } else {
//         toast.error("Failed to record vote. Please try again.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       }
//     }
//   }

//   const filteredPosts = displayPosts.filter(
//     (post) =>
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   // Reset to first page when search query changes
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchQuery])

//   // Pagination logic
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
//   const startIndex = (currentPage - 1) * postsPerPage
//   const endIndex = startIndex + postsPerPage
//   const currentPosts = filteredPosts.slice(startIndex, endIndex)

//   const goToPage = (page: number) => {
//     setCurrentPage(page)
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1)
//     }
//   }

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//     if (diffDays === 1) return "Yesterday"
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className="min-h-screen flex bg-background">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen">
//         <ToastContainer position="top-right" autoClose={3000} className="mt-16" toastClassName="backdrop-blur-sm" />

//         <div className="bg-card border-b border-border">
//           <div className="max-w-6xl mx-auto px-6 py-12">
//             <div className="text-center">
//               <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif">Community Posts</h1>
//               <p className="text-lg text-muted-foreground  mx-auto leading-relaxed">
//                 Contribute by creating Posts, share knowledge, and connect with the community through meaningful discussions.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto px-6 py-8">
//           <div className="bg-card rounded-lg border border-border p-6 mb-8">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search posts..."
//                   className="h-12 bg-input border-border focus:border-primary focus:ring-2 focus:ring-ring rounded-lg text-base"
//                 />
//               </div>
//               <Select value={filter} onValueChange={setFilter}>
//                 <SelectTrigger className="w-full lg:w-48 h-12 bg-input border-border focus:border-primary focus:ring-2 focus:ring-ring rounded-lg">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover border-border">
//                   <SelectItem value="newest">Newest First</SelectItem>
//                   <SelectItem value="upvotes">Most Upvoted</SelectItem>
//                   <SelectItem value="unanswered">Unanswered</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-16">
//               <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-lg border border-border">
//                 <div className="w-5 h-5 border-2 border-muted-foreground border-t-primary rounded-full animate-spin"></div>
//                 <span className="text-base font-medium text-foreground">Loading posts...</span>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {currentPosts.map((post) => (
//                 <div
//                   key={post._id}
//                   className="bg-card rounded-lg border border-border hover:border-primary/50 transition-colors p-6"
//                 >
//                   <div className="flex gap-6">
//                     {/* Voting section */}
//                     <div className="flex flex-col items-center gap-2 min-w-[60px]">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleVote(post._id, "upvote")}
//                         className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 h-auto rounded-md"
//                       >
//                         <ArrowUp className="w-5 h-5" />
//                       </Button>
//                       <span className="text-lg font-bold text-foreground">
//                         {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleVote(post._id, "downvote")}
//                         className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 h-auto rounded-md"
//                       >
//                         <ArrowDown className="w-5 h-5" />
//                       </Button>
//                     </div>

//                     {/* Main content */}
//                     <div className="flex-1">
//                       {/* Title */}
//                       <Link to={`/post/${post._id}`}>
//                         <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors mb-3 leading-tight font-serif">
//                           {post.title || "Untitled"}
//                         </h2>
//                       </Link>

//                       {/* Description */}
//                       <p className="text-card-foreground text-base leading-relaxed mb-4 line-clamp-3">
//                         {post.description || "No description available"}
//                       </p>

//                       {/* Scheme name */}
//                       <div className="mb-4">
//                         <span className="inline-block bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">
//                           {post.schemeName || "General"}
//                         </span>
//                       </div>

//                       {/* Bottom section with user info and actions */}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span className="font-medium">
//                             By {(post.userId as UserProfile)?.username || "Anonymous"}
//                           </span>
//                           <span>{formatDate(post.createdAt)}</span>
//                           <span>{Array.isArray(post.comments) ? post.comments.length : 0} replies</span>
//                         </div>

//                         <Link to={`/post/${post._id}`}>
//                           <Button
//                             variant="outline"
//                             className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
//                           >
//                             Read More
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {!loading && filteredPosts.length > 0 && (
//             <div className="mt-12">
//               <div className="bg-card rounded-lg border border-border p-6">
//                 <div className="flex justify-center items-center gap-2 mb-4">
//                   <Button
//                     variant="outline"
//                     onClick={goToPreviousPage}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border-border hover:bg-muted disabled:opacity-50 bg-transparent"
//                   >
//                     Previous
//                   </Button>

//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
//                       let page
//                       if (totalPages <= 7) {
//                         page = i + 1
//                       } else if (currentPage <= 4) {
//                         page = i + 1
//                       } else if (currentPage >= totalPages - 3) {
//                         page = totalPages - 6 + i
//                       } else {
//                         page = currentPage - 3 + i
//                       }

//                       return (
//                         <Button
//                           key={page}
//                           variant={currentPage === page ? "default" : "outline"}
//                           onClick={() => goToPage(page)}
//                           className={`w-10 h-10 ${
//                             currentPage === page ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"
//                           }`}
//                         >
//                           {page}
//                         </Button>
//                       )
//                     })}
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={goToNextPage}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border-border hover:bg-muted disabled:opacity-50 bg-transparent"
//                   >
//                     Next
//                   </Button>
//                 </div>

//                 <div className="text-center text-muted-foreground text-sm">
//                   Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
//                   <span className="font-medium text-foreground">{Math.min(endIndex, filteredPosts.length)}</span> of{" "}
//                   <span className="font-medium text-foreground">{filteredPosts.length}</span> posts
//                 </div>
//               </div>
//             </div>
//           )}

//           {filteredPosts.length === 0 && !loading && (
//             <div className="text-center py-16">
//               <div className="bg-card rounded-lg border border-border p-12 max-w-md mx-auto">
//                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
//                   <MessageCircle className="w-8 h-8 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-xl font-bold text-foreground mb-3 font-serif">No posts found</h3>
//                 <p className="text-muted-foreground leading-relaxed">
//                   Try adjusting your search terms or filter criteria to discover more content.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
