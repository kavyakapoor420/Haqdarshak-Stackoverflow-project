

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




import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
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
import { useLanguage } from '../Context/LanguageContext';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://haqdarshak-stackoverflow-project.onrender.com/api/'

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

// Map LanguageContext codes to Sarvam AI codes
const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
  const mapping: { [key: string]: TranslateTargetLanguage } = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
  };
  return mapping[lang] || 'en-IN'; // Default to en-IN if no mapping
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
  const { language } = useLanguage();
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
        toast.error('Failed to load posts. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

  useEffect(() => {
    const translatePosts = async () => {
      setLoading(true);
      try {
        const targetLang = mapLanguageToSarvam(language);
        const translated = await Promise.all(
          posts.map(post => translatePost(post, targetLang))
        );
        setDisplayPosts(translated);
      } catch (error) {
        console.error('Error translating posts:', error);
        setDisplayPosts(posts);
        toast.error('Failed to translate posts. Showing original content.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePosts();
  }, [posts, language]);

  const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      setPosts(posts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      setDisplayPosts(displayPosts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
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
          toast.error(`You have already ${voteType}d this post.`, {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (response.status === 401) {
          toast.error('Please log in to vote.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('Failed to record vote. Please try again.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else {
        toast.error('Failed to record vote. Please try again.', {
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

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
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

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
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
              Community Hub
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts and discussions..."
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="upvotes">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Most Upvoted
                  </div>
                </SelectItem>
                <SelectItem value="unanswered">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Unanswered
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/post/${post._id}`}>
                          <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                            {post.title || 'Untitled'}
                          </h3>
                        </Link>
                        <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
                          {post.schemeName || 'General'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        <span>{post.userId?.username || 'Anonymous'}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-slate-700 text-base leading-relaxed line-clamp-3 mb-4">
                      {post.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "upvote")}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                          <span>{post.upvotes?.length || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "downvote")}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                          <span>{post.downvotes?.length || 0}</span>
                        </Button>
                        <div className="flex items-center gap-2 text-slate-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{Array.isArray(post.comments) ? post.comments.length : 0} comments</span>
                        </div>
                      </div>
                      <Link to={`/post/${post._id}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && filteredPosts.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                Previous
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
                Next
              </Button>
            </div>
          )}

          {/* Show pagination info */}
          {!loading && filteredPosts.length > 0 && (
            <div className="text-center mt-4 text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            </div>
          )}

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}