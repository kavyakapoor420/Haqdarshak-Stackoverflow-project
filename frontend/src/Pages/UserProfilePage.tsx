// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { Button } from "../components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { Bell, CheckCircle, XCircle, Clock, Calendar, FileText, TrendingUp } from "lucide-react"
// import axios from "axios"
// import Sidebar2 from "@/components/Common/Sidebar"

// const API_BASE_URL = "http://localhost:5000/api"
// // const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api/'

// interface Notification {
//   _id: string
//   message: string
//   status: "accepted" | "rejected" | "pending" | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
// }

// export default function UserProfilePage() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//   })
//   const [filter, setFilter] = useState<"all" | "accepted" | "rejected" | "pending">("all")
//   const [loading, setLoading] = useState(false)
//   const [username, setUsername] = useState<string>("")

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           toast.error("Please log in to view your profile.", {
//             position: "top-right",
//             style: { background: "#fee2e2", color: "#dc2626" },
//           })
//           setLoading(false)
//           return
//         }

//         const [notificationsResponse, statsResponse, profileResponse] = await Promise.all([
//           axios.get(`${API_BASE_URL}/notifications`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_BASE_URL}/user/stats`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${API_BASE_URL}/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ])
//         setNotifications(notificationsResponse.data)
//         setUserStats(statsResponse.data)
//         setUsername(profileResponse.data.username)
//       } catch (error: any) {
//         toast.error(error?.response?.data?.message || "Failed to load profile data. Please try again.", {
//           position: "top-right",
//           style: { background: "#fee2e2", color: "#dc2626" },
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   const filteredNotifications = notifications.filter((notification) => {
//     if (filter === "all") return true
//     return notification.status === filter
//   })

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

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "accepted":
//         return <CheckCircle className="w-5 h-5 text-emerald-600" />
//       case "rejected":
//         return <XCircle className="w-5 h-5 text-red-500" />
//       case "pending":
//         return <Clock className="w-5 h-5 text-yellow-600" />
//       default:
//         return <Bell className="w-5 h-5 text-slate-500" />
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "accepted":
//         return (
//           <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
//             <CheckCircle className="w-3 h-3 mr-1" />
//             Accepted
//           </Badge>
//         )
//       case "rejected":
//         return (
//           <Badge className="bg-red-100 text-red-800 border-red-200">
//             <XCircle className="w-3 h-3 mr-1" />
//             Rejected
//           </Badge>
//         )
//       case "pending":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
//             <Clock className="w-3 h-3 mr-1" />
//             Pending
//           </Badge>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       <Sidebar2 />
//       <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-32">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)
//               `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
//               {username || "Your Profile"}
//             </h1>
//             <p className="text-slate-600 text-lg">Track your posts and notifications</p>
//           </div>

//           <Tabs defaultValue="notifications" className="space-y-6">
//             <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
//               <TabsTrigger value="notifications" className="flex items-center gap-2">
//                 <Bell className="w-4 h-4" />
//                 Notifications
//               </TabsTrigger>
//               <TabsTrigger value="stats" className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 Statistics
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="notifications" className="space-y-6">
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardContent className="p-4">
//                   <div className="flex flex-wrap gap-2">
//                     <Button
//                       variant={filter === "all" ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setFilter("all")}
//                       className={filter === "all" ? "bg-slate-800 hover:bg-slate-900" : ""}
//                     >
//                       All ({notifications.length})
//                     </Button>
//                     <Button
//                       variant={filter === "accepted" ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setFilter("accepted")}
//                       className={filter === "accepted" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
//                     >
//                       <CheckCircle className="w-3 h-3 mr-1" />
//                       Accepted ({notifications.filter((n) => n.status === "accepted").length})
//                     </Button>
//                     <Button
//                       variant={filter === "rejected" ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setFilter("rejected")}
//                       className={filter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
//                     >
//                       <XCircle className="w-3 h-3 mr-1" />
//                       Rejected ({notifications.filter((n) => n.status === "rejected").length})
//                     </Button>
//                     <Button
//                       variant={filter === "pending" ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setFilter("pending")}
//                       className={filter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
//                     >
//                       <Clock className="w-3 h-3 mr-1" />
//                       Pending ({notifications.filter((n) => n.status === "pending").length})
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-4">
//                 {loading ? (
//                   <div className="text-center py-12 text-slate-600">Loading...</div>
//                 ) : filteredNotifications.length > 0 ? (
//                   filteredNotifications.map((notification) => (
//                     <Card
//                       key={notification._id}
//                       className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300"
//                     >
//                       <CardContent className="p-6">
//                         <div className="flex items-start gap-4">
//                           <div className="flex-shrink-0 mt-1">{getStatusIcon(notification.status)}</div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-start justify-between mb-2">
//                               <p className="text-slate-800 font-medium">{notification.message}</p>
//                               {getStatusBadge(notification.status)}
//                             </div>
//                             {notification.comment && (
//                               <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
//                                 <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
//                                 <p className="text-red-700 text-sm">{notification.comment}</p>
//                               </div>
//                             )}
//                             <div className="flex items-center gap-4 text-sm text-slate-500">
//                               <div className="flex items-center gap-1">
//                                 <FileText className="w-3 h-3" />
//                                 <span className="truncate">{notification.postId?.title || "Post deleted"}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="w-3 h-3" />
//                                 <span>{formatDate(notification.createdAt)}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <div className="text-center py-12">
//                     <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-slate-600 mb-2">No notifications found</h3>
//                     <p className="text-slate-500">
//                       {filter !== "all" ? `No ${filter} notifications` : "You're all caught up!"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </TabsContent>

//             <TabsContent value="stats" className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
//                         <FileText className="w-5 h-5 text-slate-600" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-slate-800">{userStats.totalPosts}</p>
//                         <p className="text-sm text-slate-600">Total Posts</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
//                         <CheckCircle className="w-5 h-5 text-emerald-600" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-slate-800">{userStats.acceptedPosts}</p>
//                         <p className="text-sm text-slate-600">Accepted</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                         <XCircle className="w-5 h-5 text-red-500" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-slate-800">{userStats.rejectedPosts}</p>
//                         <p className="text-sm text-slate-600">Rejected</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-yellow-600" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-slate-800">{userStats.pendingPosts}</p>
//                         <p className="text-sm text-slate-600">Pending</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <TrendingUp className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-slate-800">{userStats.points}</p>
//                         <p className="text-sm text-slate-600">Points</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardHeader>
//                     <CardTitle className="text-lg text-slate-800">Engagement</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-slate-600">Total Upvotes</span>
//                         <span className="font-semibold text-slate-800">{userStats.totalUpvotes}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-slate-600">Total Comments</span>
//                         <span className="font-semibold text-slate-800">{userStats.totalComments}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                   <CardHeader>
//                     <CardTitle className="text-lg text-slate-800">Success Rate</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-slate-600">Acceptance Rate</span>
//                         <span className="font-semibold text-emerald-600">
//                           {userStats.totalPosts > 0
//                             ? Math.round((userStats.acceptedPosts / userStats.totalPosts) * 100)
//                             : 0}
//                           %
//                         </span>
//                       </div>
//                       <div className="w-full bg-slate-200 rounded-full h-2">
//                         <div
//                           className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
//                           style={{
//                             width: `${
//                               userStats.totalPosts > 0
//                                 ? (userStats.acceptedPosts / userStats.totalPosts) * 100
//                                 : 0
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { 
//   User, 
//   Edit3, 
//   FileText, 
//   MessageCircle, 
//   Star, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   Calendar,
//   TrendingUp,
//   Award
// } from "lucide-react"
// // import Sidebar2 from "@/components/Common/Sidebar"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"

// const API_BASE_URL = "http://localhost:5000/api"

// interface Notification {
//   _id: string
//   message: string
//   status: "accepted" | "rejected" | "pending" | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
// }

// interface Post {
//   _id: string
//   title: string
//   status: "accepted" | "rejected" | "pending"
//   createdAt: string
// }

// export default function UserProfilePage() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [posts, setPosts] = useState<Post[]>([])
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//   })
//   const [loading, setLoading] = useState(false)
//   const [username, setUsername] = useState<string>("")
//   const [selectedYear, setSelectedYear] = useState("2025")
//   const [activeTab, setActiveTab] = useState("recent")

//   // Generate calendar data for the past year
//   const generateCalendarData = () => {
//     const data = []
//     const today = new Date()
//     const startDate = new Date(today.getFullYear(), 0, 1) // Start of current year
    
//     for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
//       const dateStr = d.toISOString().split('T')[0]
//       const postsOnDate = posts.filter(post => 
//         post.createdAt.split('T')[0] === dateStr
//       ).length
      
//       data.push({
//         date: new Date(d),
//         posts: postsOnDate,
//         level: postsOnDate === 0 ? 0 : postsOnDate <= 2 ? 1 : postsOnDate <= 4 ? 2 : 3
//       })
//     }
//     return data
//   }

//   const calendarData = generateCalendarData()
//   const activeDays = calendarData.filter(day => day.posts > 0).length
//   const currentStreak = calculateStreak()

//   function calculateStreak() {
//     const sortedData = calendarData.sort((a, b) => b.date.getTime() - a.date.getTime())
//     let streak = 0
//     for (let day of sortedData) {
//       if (day.posts > 0) streak++
//       else break
//     }
//     return streak
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           console.error("Please log in to view your profile.")
//           setLoading(false)
//           return
//         }

//         const [notificationsResponse, statsResponse, profileResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/notifications`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_BASE_URL}/user/stats`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_BASE_URL}/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ])

//         const [notificationsData, statsData, profileData] = await Promise.all([
//           notificationsResponse.json(),
//           statsResponse.json(),
//           profileResponse.json(),
//         ])
        
        
//         setNotifications(notificationsData)
//         setUserStats(statsData)
//         setUsername(profileData.username)
        
//         // Convert notifications to posts format
//         const postsData = notificationsData.map((notif: Notification) => ({
//           _id: notif._id,
//           title: notif.postId?.title || "Untitled Post",
//           status: notif.status,
//           createdAt: notif.createdAt
//         }))
//         setPosts(postsData)
        
//       } catch (error: any) {
//         console.error('Error fetching data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffHours / 24)
//     if (diffHours < 1) return "a few seconds ago"
//     if (diffHours < 24) return `${diffHours} minutes ago`
//     if (diffDays < 7) return `${diffDays} days ago`
//     if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`
//     return `a month ago`
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "accepted": return "text-green-500"
//       case "rejected": return "text-red-500"
//       case "pending": return "text-yellow-500"
//       default: return "text-gray-500"
//     }
//   }

//   const renderCalendar = () => {
//     const weeks = []
//     let currentWeek: { date: Date; posts: number; level: number }[] = []
    
//     calendarData.forEach((day, index) => {
//       currentWeek.push(day)
//       if ((index + 1) % 7 === 0) {
//         weeks.push([...currentWeek])
//         currentWeek = []
//       }
//     })
//     if (currentWeek.length > 0) {
//       weeks.push(currentWeek)
//     }

//     return (
//       <div className="space-y-1">
//         <div className="grid grid-cols-7 gap-1">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="text-xs text-gray-400 text-center w-3">{day.charAt(0)}</div>
//           ))}
//         </div>
//         {weeks.map((week, weekIndex) => (
//           <div key={weekIndex} className="grid grid-cols-7 gap-1">
//             {week.map((day, dayIndex) => (
//               <div
//                 key={`${weekIndex}-${dayIndex}`}
//                 className={`w-3 h-3 rounded-sm ${
//                   day.level === 0 ? 'bg-gray-800' :
//                   day.level === 1 ? 'bg-green-900' :
//                   day.level === 2 ? 'bg-green-700' :
//                   'bg-green-500'
//                 }`}
//                 title={`${day.posts} submissions on ${day.date.toDateString()}`}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white">Loading...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-900">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       {/* Left Sidebar - User Profile */}
//       <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
//         {/* Profile Section */}
//         <div className="mb-8">
//           <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
//             <User className="w-12 h-12 text-gray-400" />
//           </div>
//           <div className="mb-4">
//             <h2 className="text-white text-xl font-semibold">{username}</h2>
//             <p className="text-gray-400 text-sm">{username}</p>
//             <p className="text-gray-400 text-sm mt-2">Rank 643,442</p>
//           </div>
//           <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
//             <Edit3 className="w-4 h-4 mr-2" />
//             Edit Profile
//           </Button>
//         </div>

//         {/* Community Stats */}
//         <div className="mb-8">
//           <h3 className="text-white font-semibold mb-4">Community Stats</h3>
//           <div className="space-y-4">
//             <div className="flex items-center text-blue-400">
//               <FileText className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Total Posts</span>
//                   <span className="font-semibold">{userStats.totalPosts}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalPosts}</div>
//               </div>
//             </div>
            
//             <div className="flex items-center text-blue-400">
//               <TrendingUp className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Points</span>
//                   <span className="font-semibold">{userStats.points}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.points}</div>
//               </div>
//             </div>

//             <div className="flex items-center text-blue-400">
//               <MessageCircle className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Discuss</span>
//                   <span className="font-semibold">{userStats.totalComments}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalComments}</div>
//               </div>
//             </div>

//             <div className="flex items-center text-yellow-400">
//               <Star className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Reputation</span>
//                   <span className="font-semibold">{userStats.totalUpvotes}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalUpvotes}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-900 text-white overflow-y-auto">
//         <div className="p-8">
//           {/* Top Stats Cards */}
//           <div className="grid grid-cols-4 gap-6 mb-8">
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">1,494</div>
//                   <div className="text-gray-400 text-sm">Contest Rating</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">341,382</div>
//                   <div className="text-gray-400 text-sm">Global Ranking</div>
//                   <div className="text-gray-500 text-xs">/746,163</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">8</div>
//                   <div className="text-gray-400 text-sm">Attended</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">46.27%</div>
//                   <div className="text-gray-400 text-sm">Top</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts and Stats Row */}
//           <div className="grid grid-cols-3 gap-6 mb-8">
//             {/* Solved Problems Circle Chart */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-center">
//                   <div className="relative">
//                     <svg width="120" height="120" className="transform -rotate-90">
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         className="text-gray-700"
//                       />
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         strokeDasharray={`${(userStats.acceptedPosts / userStats.totalPosts) * 314} 314`}
//                         className="text-green-500"
//                       />
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         strokeDasharray={`${(userStats.rejectedPosts / userStats.totalPosts) * 314} 314`}
//                         strokeDashoffset={`-${(userStats.acceptedPosts / userStats.totalPosts) * 314}`}
//                         className="text-red-500"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-white">{userStats.acceptedPosts}</div>
//                         <div className="text-xs text-gray-400">/{userStats.totalPosts}</div>
//                         <div className="text-xs text-green-400">Solved</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-green-400 text-sm">Accepted</span>
//                     <span className="text-white">{userStats.acceptedPosts}/{userStats.totalPosts}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-red-400 text-sm">Rejected</span>
//                     <span className="text-white">{userStats.rejectedPosts}/{userStats.totalPosts}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-yellow-400 text-sm">Pending</span>
//                     <span className="text-white">{userStats.pendingPosts}/{userStats.totalPosts}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Badges */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-white font-semibold">Badges</h3>
//                   <span className="text-2xl font-bold text-white">1</span>
//                 </div>
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
//                     <Award className="w-8 h-8 text-green-400" />
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-gray-400 text-sm">Most Recent Badge</div>
//                   <div className="text-white font-semibold">50 Days Badge 2024</div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Activity Calendar */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <span className="text-white font-semibold">{userStats.totalPosts}</span>
//                     <span className="text-gray-400 text-sm ml-2">submissions in the past one year</span>
//                   </div>
//                 </div>
//                 {renderCalendar()}
//                 <div className="flex justify-between items-center mt-4 text-sm">
//                   <span className="text-gray-400">Total active days: {activeDays}</span>
//                   <span className="text-gray-400">Max streak: {currentStreak}</span>
//                   <Select value={selectedYear} onValueChange={setSelectedYear}>
//                     <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-700 border-gray-600">
//                       <SelectItem value="2025" className="text-white">2025</SelectItem>
//                       <SelectItem value="2024" className="text-white">2024</SelectItem>
//                       <SelectItem value="2023" className="text-white">2023</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

          // {/* Posts List */}
          // <Card className="bg-gray-800 border-gray-700">
          //   <CardHeader>
          //     <div className="flex space-x-4">
          //       <Button
          //         variant={activeTab === "recent" ? "default" : "ghost"}
          //         onClick={() => setActiveTab("recent")}
          //         className="text-white"
          //       >
          //         Recent AC
          //       </Button>
          //       <Button
          //         variant={activeTab === "list" ? "default" : "ghost"}
          //         onClick={() => setActiveTab("list")}
          //         className="text-white"
          //       >
          //         List
          //       </Button>
          //       <Button
          //         variant={activeTab === "solutions" ? "default" : "ghost"}
          //         onClick={() => setActiveTab("solutions")}
          //         className="text-white"
          //       >
          //         Solutions
          //       </Button>
          //       <Button
          //         variant={activeTab === "discuss" ? "default" : "ghost"}
          //         onClick={() => setActiveTab("discuss")}
          //         className="text-white"
          //       >
          //         Discuss
          //       </Button>
          //     </div>
          //   </CardHeader>
          //   <CardContent>
          //     <div className="space-y-3">
          //       {posts.map((post) => (
          //         <div key={post._id} className="flex items-center justify-between py-3 border-b border-gray-700">
          //           <div className="flex items-center space-x-3">
          //             {post.status === "accepted" && <CheckCircle className="w-5 h-5 text-green-500" />}
          //             {post.status === "rejected" && <XCircle className="w-5 h-5 text-red-500" />}
          //             {post.status === "pending" && <Clock className="w-5 h-5 text-yellow-500" />}
          //             <span className="text-white">{post.title}</span>
          //           </div>
          //           <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
          //         </div>
          //       ))}
          //     </div>
          //   </CardContent>
          // </Card>
//         </div>
//       </div>
//     </div>
//   )
// }




// "use client"

// import type React from "react"

// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// // Neutrals: #0f0f0f (bg), #1f1f1f (card), #2a2a2a (row/border), #e5e7eb (text)
// // Accents: #22c55e (green), #f59e0b (amber)
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL ="http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   const now = new Date()
//   const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
//   if (diff < 60) return "a few seconds ago"
//   if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
//   if (diff < 30 * 86400) return `${Math.floor(diff / 86400)} days ago`
//   return date.toLocaleDateString()
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [handle, setHandle] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications (kept for parity with old)
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"recent" | "list" | "solutions" | "discuss">("recent")

//   useEffect(() => {
//     if (!token) return
//     let cancelled = false
//     ;(async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // parallel core requests (existing endpoints)
//         const [profileRes, statsRes, notifRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch((e) => e),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch((e) => e),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch((e) => e),
//         ])

//         if (!cancelled && profileRes && "data" in profileRes) {
//           const p = (profileRes as any).data || {}
//           setUsername(p.username || p.name || "")
//           setHandle(p.handle || p.username || "")
//           setAvatarUrl(p.avatarUrl)
//           setRank(p.rank)
//         }

//         if (!cancelled && statsRes && "data" in statsRes) {
//           const s = (statsRes as any).data || {}
//           setStats((prev) => ({
//             ...prev,
//             totalPosts: s.totalPosts ?? prev.totalPosts,
//             acceptedPosts: s.acceptedPosts ?? prev.acceptedPosts,
//             rejectedPosts: s.rejectedPosts ?? prev.rejectedPosts,
//             pendingPosts: s.pendingPosts ?? prev.pendingPosts,
//             totalUpvotes: s.totalUpvotes ?? prev.totalUpvotes,
//             totalComments: s.totalComments ?? prev.totalComments,
//             points: s.points ?? prev.points,
//             discussions: s.discussions,
//             reputation: s.reputation,
//           }))
//         }

//         if (!cancelled && notifRes && "data" in notifRes) {
//           setNotifications((notifRes as any).data || [])
//         }

//         // additional data: badges, activity, posts
//         // Badges
//         try {
//           const r = await axios.get(`${API_BASE_URL}/user/badges`, { headers })
//           if (!cancelled) setBadges(r.data || [])
//         } catch (err) {
//           // no-op: keep empty
//         }

//         // Activity heatmap
//         await loadActivity(year, headers, cancelled)

//         // Posts by year (try a few common routes; no dummy data)
//         await loadPosts(year, headers, cancelled)
//       } catch (err) {
//         // swallow; UI will show empty states; no dummy data
//         // console.error(err)
//       } finally {
//         !cancelled && setLoading(false)
//       }
//     })()
//     return () => {
//       cancelled = true
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token])

//   async function loadActivity(y: number, headers: Record<string, string>, cancelled = false) {
//     try {
//       const r = await axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year: y } })
//       if (!cancelled) setActivity(r.data || [])
//     } catch (e) {
//       try {
//         const r = await axios.get(`${API_BASE_URL}/activity`, { headers, params: { year: y } })
//         if (!cancelled) setActivity(r.data || [])
//       } catch {
//         if (!cancelled) setActivity([])
//       }
//     }
//   }

//   async function loadPosts(y: number, headers: Record<string, string>, cancelled = false) {
//     const tryRoutes = [`${API_BASE_URL}/user/posts`, `${API_BASE_URL}/posts`, `${API_BASE_URL}/submissions`]
//     for (const base of tryRoutes) {
//       try {
//         const r = await axios.get(base, { headers, params: { year: y } })
//         if (!cancelled) {
//           const items: PostItem[] = (r.data || []).map((it: any) => ({
//             id: it.id || it._id,
//             title: it.title,
//             status: (it.status || it.result || "pending").toLowerCase(),
//             createdAt: it.createdAt || it.date,
//           }))
//           setPosts(items)
//         }
//         return
//       } catch {
//         // try next
//       }
//     }
//     if (!cancelled) setPosts([])
//   }

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     if (!token) return
//     setYear(next)
//     const headers = { Authorization: `Bearer ${token}` }
//     void loadActivity(next, headers)
//     void loadPosts(next, headers)
//   }

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6">
//         {/* Left Sidebar */}
//         <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//           <div className="p-5">
//             <div className="flex items-center gap-3">
//               <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                 <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                 <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                   <User2 className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-[17px]">{username || "—"}</div>
//                 <div className="text-sm" style={{ color: C.muted }}>
//                   {handle ? handle : ""}
//                 </div>
//                 {typeof rank === "number" && (
//                   <div className="text-xs mt-1" style={{ color: C.muted }}>
//                     Rank {rank.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Button
//               className="mt-4 w-full font-medium"
//               style={{ backgroundColor: C.green, color: "#0b2b16" }}
//               onClick={() => (window.location.href = "/settings/profile")}
//             >
//               Edit Profile
//             </Button>

//             <Separator className="my-4" style={{ backgroundColor: "#303030" }} />

//             <h3 className="text-sm font-semibold mb-3">Community Stats</h3>
//             <div className="space-y-3">
//               <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//               <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//               <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//               <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//             </div>
//           </div>
//         </aside>

//         {/* Right Content */}
//         <section className="space-y-6">
//           {/* Top row: semicircle + badges */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Total Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-6">
//                   <div className="w-[260px] h-[150px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <RechartsTooltip
//                           contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                           labelStyle={{ color: "#ddd" }}
//                           itemStyle={{ color: "#ddd" }}
//                         />
//                         <Pie
//                           data={semiData}
//                           dataKey="value"
//                           startAngle={180}
//                           endAngle={0}
//                           innerRadius={60}
//                           outerRadius={75}
//                           cx="50%"
//                           cy="100%"
//                           stroke="none"
//                         >
//                           {semiData.map((entry, idx) => (
//                             <Cell key={`cell-${idx}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl font-bold">{totalPosts}</div>
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Posts created by agent
//                     </div>

//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                       <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                       <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Badges</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 {loading ? (
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Loading…
//                   </div>
//                 ) : badges.length === 0 ? (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                     <Medal className="h-4 w-4" /> No badges yet
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-3">
//                     {badges.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex items-center gap-2 rounded-lg px-3 py-2"
//                         style={{ backgroundColor: C.surface }}
//                         title={b.name}
//                       >
//                         {b.imageUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                         ) : (
//                           <Medal className="h-6 w-6 text-amber-400" />
//                         )}
//                         <span className="text-sm">{b.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity heatmap */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base font-semibold">
//                   {totalInYear(activity)} submissions in the past one year
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                   </div>
//                   <YearDropdown year={year} onChange={onChangeYear} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <CalendarHeatmap activity={activity} />
//             </CardContent>
//           </Card>

//           {/* Posts list like screenshot */}
//            <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardContent className="pt-4">
//               <div className="flex items-center justify-between">
//                 <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                   <TabsList className="bg-transparent p-0 gap-2">
//                     <TabChip value="recent" icon={CheckCircle} active={activeTab === "recent"}>
//                       Recent AC
//                     </TabChip>
//                     <TabChip value="list" icon={FileText} active={activeTab === "list"}>
//                       List
//                     </TabChip>
//                     <TabChip value="solutions" icon={CheckCircle} active={activeTab === "solutions"}>
//                       Solutions
//                     </TabChip>
//                     <TabChip value="discuss" icon={MessageSquare} active={activeTab === "discuss"}>
//                       Discuss
//                     </TabChip>
//                   </TabsList>
//                 </Tabs>
//                 <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                   View all submissions
//                 </Button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {loading ? (
//                   <RowShell>Loading…</RowShell>
//                 ) : posts.length === 0 ? (
//                   <RowShell>
//                     <Bell className="h-4 w-4 text-[#888]" />
//                     <span className="text-sm" style={{ color: C.muted }}>
//                       No posts for {year}.
//                     </span>
//                   </RowShell>
//                 ) : (
//                   posts.map((p) => (
//                     <RowShell key={p.id}>
//                       <div className="flex-1 truncate">{p.title}</div>
//                       <div className="flex items-center gap-3">
//                         <StatusPill status={p.status} />
//                         <div className="text-xs" style={{ color: C.muted }}>
//                           {timeAgo(p.createdAt)}
//                         </div>
//                       </div>
//                     </RowShell>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card> 

        
//         </section>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       {/* Simple menu using native select for accessibility */}
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   // Build a map and a 53x7 grid ending today
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 2) return "#134e2f"
//     if (c < 4) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }
// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }
// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }




// import { useState, useEffect } from "react"
// import {ToastContainer} from 'react-toastify'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { 
//   User, 
//   Edit3, 
//   FileText, 
//   MessageCircle, 
//   Star, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   Calendar,
//   TrendingUp,
//   Award
// } from "lucide-react"
// // import Sidebar2 from "@/components/Common/Sidebar"

// const API_BASE_URL = "http://localhost:5000/api"

// interface Notification {
//   _id: string
//   message: string
//   status: "accepted" | "rejected" | "pending" | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
// }

// interface Post {
//   _id: string
//   title: string
//   status: "accepted" | "rejected" | "pending"
//   createdAt: string
// }

// export default function UserProfilePage() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [posts, setPosts] = useState<Post[]>([])
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//   })
//   const [loading, setLoading] = useState(false)
//   const [username, setUsername] = useState<string>("")
//   const [selectedYear, setSelectedYear] = useState("2025")
//   const [activeTab, setActiveTab] = useState("recent")

//   // Generate calendar data for the past year
//   const generateCalendarData = () => {
//     const data = []
//     const today = new Date()
//     const startDate = new Date(today.getFullYear(), 0, 1) // Start of current year
    
//     for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
//       const dateStr = d.toISOString().split('T')[0]
//       const postsOnDate = posts.filter(post => 
//         post.createdAt.split('T')[0] === dateStr
//       ).length
      
//       data.push({
//         date: new Date(d),
//         posts: postsOnDate,
//         level: postsOnDate === 0 ? 0 : postsOnDate <= 2 ? 1 : postsOnDate <= 4 ? 2 : 3
//       })
//     }
//     return data
//   }

//   const calendarData = generateCalendarData()
//   const activeDays = calendarData.filter(day => day.posts > 0).length
//   const currentStreak = calculateStreak()

//   function calculateStreak() {
//     const sortedData = calendarData.sort((a, b) => b.date.getTime() - a.date.getTime())
//     let streak = 0
//     for (let day of sortedData) {
//       if (day.posts > 0) streak++
//       else break
//     }
//     return streak
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           console.error("Please log in to view your profile.")
//           setLoading(false)
//           return
//         }

//         const [notificationsResponse, statsResponse, profileResponse] = await Promise.all([
//           fetch(`${API_BASE_URL}/notifications`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_BASE_URL}/user/stats`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${API_BASE_URL}/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ])

//         const [notificationsData, statsData, profileData] = await Promise.all([
//           notificationsResponse.json(),
//           statsResponse.json(),
//           profileResponse.json(),
//         ])
        
        
//         setNotifications(notificationsData)
//         setUserStats(statsData)
//         setUsername(profileData.username)
        
//         // Convert notifications to posts format
//         const postsData = notificationsData.map((notif: Notification) => ({
//           _id: notif._id,
//           title: notif.postId?.title || "Untitled Post",
//           status: notif.status,
//           createdAt: notif.createdAt
//         }))
//         setPosts(postsData)
        
//       } catch (error: any) {
//         console.error('Error fetching data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - date.getTime())
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
//     const diffDays = Math.floor(diffHours / 24)
//     if (diffHours < 1) return "a few seconds ago"
//     if (diffHours < 24) return `${diffHours} minutes ago`
//     if (diffDays < 7) return `${diffDays} days ago`
//     if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`
//     return `a month ago`
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "accepted": return "text-green-500"
//       case "rejected": return "text-red-500"
//       case "pending": return "text-yellow-500"
//       default: return "text-gray-500"
//     }
//   }

//   const renderCalendar = () => {
//     const weeks = []
//     let currentWeek = []
    
//     calendarData.forEach((day, index) => {
//       currentWeek.push(day)
//       if ((index + 1) % 7 === 0) {
//         weeks.push([...currentWeek])
//         currentWeek = []
//       }
//     })
//     if (currentWeek.length > 0) {
//       weeks.push(currentWeek)
//     }

//     return (
//       <div className="space-y-1">
//         <div className="grid grid-cols-7 gap-1">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="text-xs text-gray-400 text-center w-3">{day.charAt(0)}</div>
//           ))}
//         </div>
//         {weeks.map((week, weekIndex) => (
//           <div key={weekIndex} className="grid grid-cols-7 gap-1">
//             {week.map((day, dayIndex) => (
//               <div
//                 key={`${weekIndex}-${dayIndex}`}
//                 className={`w-3 h-3 rounded-sm ${
//                   day.level === 0 ? 'bg-gray-800' :
//                   day.level === 1 ? 'bg-green-900' :
//                   day.level === 2 ? 'bg-green-700' :
//                   'bg-green-500'
//                 }`}
//                 title={`${day.posts} submissions on ${day.date.toDateString()}`}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-white">Loading...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-900">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       {/* Left Sidebar - User Profile */}
//       <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
//         {/* Profile Section */}
//         <div className="mb-8">
//           <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
//             <User className="w-12 h-12 text-gray-400" />
//           </div>
//           <div className="mb-4">
//             <h2 className="text-white text-xl font-semibold">{username}</h2>
//             <p className="text-gray-400 text-sm">{username}</p>
//             <p className="text-gray-400 text-sm mt-2">Rank 643,442</p>
//           </div>
//           <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
//             <Edit3 className="w-4 h-4 mr-2" />
//             Edit Profile
//           </Button>
//         </div>

//         {/* Community Stats */}
//         <div className="mb-8">
//           <h3 className="text-white font-semibold mb-4">Community Stats</h3>
//           <div className="space-y-4">
//             <div className="flex items-center text-blue-400">
//               <FileText className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Total Posts</span>
//                   <span className="font-semibold">{userStats.totalPosts}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalPosts}</div>
//               </div>
//             </div>
            
//             <div className="flex items-center text-blue-400">
//               <TrendingUp className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Points</span>
//                   <span className="font-semibold">{userStats.points}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.points}</div>
//               </div>
//             </div>

//             <div className="flex items-center text-blue-400">
//               <MessageCircle className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Discuss</span>
//                   <span className="font-semibold">{userStats.totalComments}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalComments}</div>
//               </div>
//             </div>

//             <div className="flex items-center text-yellow-400">
//               <Star className="w-5 h-5 mr-3" />
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <span>Reputation</span>
//                   <span className="font-semibold">{userStats.totalUpvotes}</span>
//                 </div>
//                 <div className="text-gray-500 text-sm">Last week {userStats.totalUpvotes}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-900 text-white overflow-y-auto">
//         <div className="p-8">
//           {/* Top Stats Cards */}
//           <div className="grid grid-cols-4 gap-6 mb-8">
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">1,494</div>
//                   <div className="text-gray-400 text-sm">Contest Rating</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">341,382</div>
//                   <div className="text-gray-400 text-sm">Global Ranking</div>
//                   <div className="text-gray-500 text-xs">/746,163</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">8</div>
//                   <div className="text-gray-400 text-sm">Attended</div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white mb-1">46.27%</div>
//                   <div className="text-gray-400 text-sm">Top</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Charts and Stats Row */}
//           <div className="grid grid-cols-3 gap-6 mb-8">
//             {/* Solved Problems Circle Chart */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-center">
//                   <div className="relative">
//                     <svg width="120" height="120" className="transform -rotate-90">
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         className="text-gray-700"
//                       />
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         strokeDasharray={`${(userStats.acceptedPosts / userStats.totalPosts) * 314} 314`}
//                         className="text-green-500"
//                       />
//                       <circle
//                         cx="60"
//                         cy="60"
//                         r="50"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="none"
//                         strokeDasharray={`${(userStats.rejectedPosts / userStats.totalPosts) * 314} 314`}
//                         strokeDashoffset={`-${(userStats.acceptedPosts / userStats.totalPosts) * 314}`}
//                         className="text-red-500"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-white">{userStats.acceptedPosts}</div>
//                         <div className="text-xs text-gray-400">/{userStats.totalPosts}</div>
//                         <div className="text-xs text-green-400">Solved</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-green-400 text-sm">Accepted</span>
//                     <span className="text-white">{userStats.acceptedPosts}/{userStats.totalPosts}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-red-400 text-sm">Rejected</span>
//                     <span className="text-white">{userStats.rejectedPosts}/{userStats.totalPosts}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-yellow-400 text-sm">Pending</span>
//                     <span className="text-white">{userStats.pendingPosts}/{userStats.totalPosts}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Badges */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-white font-semibold">Badges</h3>
//                   <span className="text-2xl font-bold text-white">1</span>
//                 </div>
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
//                     <Award className="w-8 h-8 text-green-400" />
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-gray-400 text-sm">Most Recent Badge</div>
//                   <div className="text-white font-semibold">50 Days Badge 2024</div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Activity Calendar */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <span className="text-white font-semibold">{userStats.totalPosts}</span>
//                     <span className="text-gray-400 text-sm ml-2">submissions in the past one year</span>
//                   </div>
//                 </div>
//                 {renderCalendar()}
//                 <div className="flex justify-between items-center mt-4 text-sm">
//                   <span className="text-gray-400">Total active days: {activeDays}</span>
//                   <span className="text-gray-400">Max streak: {currentStreak}</span>
//                   <Select value={selectedYear} onValueChange={setSelectedYear}>
//                     <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-700 border-gray-600">
//                       <SelectItem value="2025" className="text-white">2025</SelectItem>
//                       <SelectItem value="2024" className="text-white">2024</SelectItem>
//                       <SelectItem value="2023" className="text-white">2023</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Posts List */}
//           <Card className="bg-gray-800 border-gray-700">
//             <CardHeader>
//               <div className="flex space-x-4">
//                 <Button
//                   variant={activeTab === "recent" ? "default" : "ghost"}
//                   onClick={() => setActiveTab("recent")}
//                   className="text-white"
//                 >
//                   Recent AC
//                 </Button>
//                 <Button
//                   variant={activeTab === "list" ? "default" : "ghost"}
//                   onClick={() => setActiveTab("list")}
//                   className="text-white"
//                 >
//                   List
//                 </Button>
//                 <Button
//                   variant={activeTab === "solutions" ? "default" : "ghost"}
//                   onClick={() => setActiveTab("solutions")}
//                   className="text-white"
//                 >
//                   Solutions
//                 </Button>
//                 <Button
//                   variant={activeTab === "discuss" ? "default" : "ghost"}
//                   onClick={() => setActiveTab("discuss")}
//                   className="text-white"
//                 >
//                   Discuss
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {posts.map((post) => (
//                   <div key={post._id} className="flex items-center justify-between py-3 border-b border-gray-700">
//                     <div className="flex items-center space-x-3">
//                       {post.status === "accepted" && <CheckCircle className="w-5 h-5 text-green-500" />}
//                       {post.status === "rejected" && <XCircle className="w-5 h-5 text-red-500" />}
//                       {post.status === "pending" && <Clock className="w-5 h-5 text-yellow-500" />}
//                       <span className="text-white">{post.title}</span>
//                     </div>
//                     <span className="text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL =  "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   const now = new Date()
//   const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
//   if (diff < 60) return "a few seconds ago"
//   if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
//   if (diff < 30 * 86400) return `${Math.floor(diff / 86400)} days ago`
//   return date.toLocaleDateString()
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [handle, setHandle] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"recent" | "list" | "solutions" | "discuss">("recent")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setHandle(p.handle || p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6">
//         {/* Left Sidebar */}
//         <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//           <div className="p-5">
//             <div className="flex items-center gap-3">
//               <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                 <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                 <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                   <User2 className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-[17px]">{username || "—"}</div>
//                 <div className="text-sm" style={{ color: C.muted }}>
//                   {handle ? handle : ""}
//                 </div>
//                 {typeof rank === "number" && (
//                   <div className="text-xs mt-1" style={{ color: C.muted }}>
//                     Rank {rank.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Button
//               className="mt-4 w-full font-medium"
//               style={{ backgroundColor: C.green, color: "#0b2b16" }}
//               onClick={() => (window.location.href = "/settings/profile")}
//             >
//               Edit Profile
//             </Button>

//             <Separator className="my-4" style={{ backgroundColor: "#303030" }} />

//             <h3 className="text-sm font-semibold mb-3">Community Stats</h3>
//             <div className="space-y-3">
//               <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//               <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//               <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//               <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//             </div>
//           </div>
//         </aside>

//         {/* Right Content */}
//         <section className="space-y-6">
//           {/* Top row: semicircle + badges */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Total Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-6">
//                   <div className="w-[260px] h-[150px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <RechartsTooltip
//                           contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                           labelStyle={{ color: "#ddd" }}
//                           itemStyle={{ color: "#ddd" }}
//                         />
//                         <Pie
//                           data={semiData}
//                           dataKey="value"
//                           startAngle={180}
//                           endAngle={0}
//                           innerRadius={60}
//                           outerRadius={75}
//                           cx="50%"
//                           cy="100%"
//                           stroke="none"
//                         >
//                           {semiData.map((entry, idx) => (
//                             <Cell key={`cell-${idx}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl font-bold">{totalPosts}</div>
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Posts created by agent
//                     </div>

//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                       <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                       <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Badges</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 {loading ? (
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Loading…
//                   </div>
//                 ) : badges.length === 0 ? (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                     <Medal className="h-4 w-4" /> No badges yet
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-3">
//                     {badges.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex items-center gap-2 rounded-lg px-3 py-2"
//                         style={{ backgroundColor: C.surface }}
//                         title={b.name}
//                       >
//                         {b.imageUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                         ) : (
//                           <Medal className="h-6 w-6 text-amber-400" />
//                         )}
//                         <span className="text-sm">{b.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity heatmap */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base font-semibold">
//                   {totalInYear(activity)} submissions in the past one year
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                   </div>
//                   <YearDropdown year={year} onChange={onChangeYear} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <CalendarHeatmap activity={activity} />
//             </CardContent>
//           </Card>

//           {/* Posts list */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardContent className="pt-4">
//               <div className="flex items-center justify-between">
//                 <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                   <TabsList className="bg-transparent p-0 gap-2">
//                     <TabChip value="recent" icon={CheckCircle} active={activeTab === "recent"}>
//                       Recent AC
//                     </TabChip>
//                     <TabChip value="list" icon={FileText} active={activeTab === "list"}>
//                       List
//                     </TabChip>
//                     <TabChip value="solutions" icon={CheckCircle} active={activeTab === "solutions"}>
//                       Solutions
//                     </TabChip>
//                     <TabChip value="discuss" icon={MessageSquare} active={activeTab === "discuss"}>
//                       Discuss
//                     </TabChip>
//                   </TabsList>
//                 </Tabs>
//                 <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                   View all submissions
//                 </Button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {loading ? (
//                   <RowShell>Loading…</RowShell>
//                 ) : posts.length === 0 ? (
//                   <RowShell>
//                     <Bell className="h-4 w-4 text-[#888]" />
//                     <span className="text-sm" style={{ color: C.muted }}>
//                       No posts for {year}.
//                     </span>
//                   </RowShell>
//                 ) : (
//                   posts.map((p) => (
//                     <RowShell key={p.id}>
//                       <div className="flex-1 truncate">{p.title}</div>
//                       <div className="flex items-center gap-3">
//                         <StatusPill status={p.status} />
//                         <div className="text-xs" style={{ color: C.muted }}>
//                           {timeAgo(p.createdAt)}
//                         </div>
//                       </div>
//                     </RowShell>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 2) return "#134e2f"
//     if (c < 4) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }

// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }

// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }

// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   const now = new Date()
//   const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
//   if (diff < 60) return "a few seconds ago"
//   if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
//   if (diff < 30 * 86400) return `${Math.floor(diff / 86400)} days ago`
//   return date.toLocaleDateString()
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [handle, setHandle] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"recent" | "list" | "solutions" | "discuss">("recent")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setHandle(p.handle || p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6">
//         {/* Left Sidebar */}
//         <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//           <div className="p-5">
//             {/* Profile Section */}
//             <div className="flex items-center gap-3 mb-6">
//               <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                 <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                 <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                   <User2 className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-[17px]">{username || "—"}</div>
//                 {typeof rank === "number" && (
//                   <div className="text-xs mt-1" style={{ color: C.muted }}>
//                     Rank {rank.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Community Posts Section */}
//             <div className="mb-6">
//               <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
//               <div className="space-y-3">
//                 <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//                 <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//                 <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//                 <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//               </div>
//             </div>

//             <Button
//               className="w-full font-medium"
//               style={{ backgroundColor: C.green, color: "#0b2b16" }}
//               onClick={() => (window.location.href = "/settings/profile")}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         </aside>

//         {/* Right Content */}
//         <section className="space-y-6">
//           {/* Top row: Total Posts + Badges */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Total Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-6">
//                   <div className="w-[260px] h-[150px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <RechartsTooltip
//                           contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                           labelStyle={{ color: "#ddd" }}
//                           itemStyle={{ color: "#ddd" }}
//                         />
//                         <Pie
//                           data={semiData}
//                           dataKey="value"
//                           startAngle={180}
//                           endAngle={0}
//                           innerRadius={60}
//                           outerRadius={75}
//                           cx="50%"
//                           cy="100%"
//                           stroke="none"
//                         >
//                           {semiData.map((entry, idx) => (
//                             <Cell key={`cell-${idx}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl font-bold">{totalPosts}</div>
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Posts created by agent
//                     </div>
//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                       <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                       <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Badges</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 {loading ? (
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Loading…
//                   </div>
//                 ) : badges.length === 0 ? (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                     <Medal className="h-4 w-4" /> No badges yet
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-3">
//                     {badges.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex items-center gap-2 rounded-lg px-3 py-2"
//                         style={{ backgroundColor: C.surface }}
//                         title={b.name}
//                       >
//                         {b.imageUrl ? (
//                           // eslint-disable-next-line @next/next/no-img-element
//                           <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                         ) : (
//                           <Medal className="h-6 w-6 text-amber-400" />
//                         )}
//                         <span className="text-sm">{b.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity heatmap */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base font-semibold">
//                   {totalInYear(activity)} submissions in the past one year
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                   </div>
//                   <YearDropdown year={year} onChange={onChangeYear} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <CalendarHeatmap activity={activity} />
//             </CardContent>
//           </Card>

//           {/* Posts list */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardContent className="pt-4">
//               <div className="flex items-center justify-between">
//                 <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                   <TabsList className="bg-transparent p-0 gap-2">
//                     <TabChip value="recent" icon={CheckCircle} active={activeTab === "recent"}>
//                       Recent AC
//                     </TabChip>
//                     <TabChip value="list" icon={FileText} active={activeTab === "list"}>
//                       List
//                     </TabChip>
//                     <TabChip value="solutions" icon={CheckCircle} active={activeTab === "solutions"}>
//                       Solutions
//                     </TabChip>
//                     <TabChip value="discuss" icon={MessageSquare} active={activeTab === "discuss"}>
//                       Discuss
//                     </TabChip>
//                   </TabsList>
//                 </Tabs>
//                 <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                   View all submissions
//                 </Button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {loading ? (
//                   <RowShell>Loading…</RowShell>
//                 ) : posts.length === 0 ? (
//                   <RowShell>
//                     <Bell className="h-4 w-4 text-[#888]" />
//                     <span className="text-sm" style={{ color: C.muted }}>
//                       No posts for {year}.
//                     </span>
//                   </RowShell>
//                 ) : (
//                   posts.map((p) => (
//                     <RowShell key={p.id}>
//                       <div className="flex-1 truncate">{p.title}</div>
//                       <div className="flex items-center gap-3">
//                         <StatusPill status={p.status} />
//                         <div className="text-xs" style={{ color: C.muted }}>
//                           {timeAgo(p.createdAt)}
//                         </div>
//                       </div>
//                     </RowShell>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }

// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }

// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }


// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-GB')
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   const filteredPosts = useMemo(() => {
//     switch (activeTab) {
//       case "all":
//         return posts
//       case "accepted":
//         return posts.filter((p) => p.status === "accepted")
//       case "rejected":
//         return posts.filter((p) => p.status === "rejected")
//       case "discussion":
//         return posts // Assuming show all for discussion as no comment data available
//       default:
//         return posts
//     }
//   }, [activeTab, posts])

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8  sm:px-6 lg:px-8 ">
//           <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">


         
//         {/* Left Sidebar */}
//         <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//           <div className="p-5">
//             {/* Profile Section */}
//             <div className="flex items-center gap-3 mb-6">
//               <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                 <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                 <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                   <User2 className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-[17px]">{username || "—"}</div>
//                 {typeof rank === "number" && (
//                   <div className="text-xs mt-1" style={{ color: C.muted }}>
//                     Rank {rank.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Community Posts Section */}
//             <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
//             <div className="space-y-3 mb-6">
//               <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//               <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//               <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//               <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//             </div>

//             <Button
//               className="w-full font-medium"
//               style={{ backgroundColor: C.green, color: "#0b2b16" }}
//               onClick={() => (window.location.href = "/settings/profile")}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         </aside>

//         {/* Right Content */}
//         <section className="space-y-6">
//           {/* Top row: semicircle + badges */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2  gap-6">
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-white font-semibold">Total Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-6">
//                   <div className="w-[260px] h-[150px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <RechartsTooltip
//                           contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                           labelStyle={{ color: "#ddd" }}
//                           itemStyle={{ color: "#ddd" }}
//                         />
//                         <Pie
//                           data={semiData}
//                           dataKey="value"
//                           startAngle={180}
//                           endAngle={0}
//                           innerRadius={60}
//                           outerRadius={75}
//                           cx="50%"
//                           cy="100%"
//                           stroke="none"
//                         >
//                           {semiData.map((entry, idx) => (
//                             <Cell key={`cell-${idx}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl text-white font-bold">{totalPosts}</div>
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Posts created by agent
//                     </div>

//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                       <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                       <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-white font-semibold">Badges</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 {loading ? (
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Loading…
//                   </div>
//                 ) : badges.length === 0 ? (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                     <Medal className="h-4 w-4" /> No badges yet
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-3">
//                     {badges.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex items-center gap-2 rounded-lg px-3 py-2"
//                         style={{ backgroundColor: C.surface }}
//                         title={b.name}
//                       >
//                         {b.imageUrl ? (
//                           <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                         ) : (
//                           <Medal className="h-6 w-6 text-amber-400" />
//                         )}
//                         <span className="text-sm">{b.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity heatmap */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base font-semibold">
//                   {totalInYear(activity)} submissions in the past one year
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                   </div>
//                   <YearDropdown year={year} onChange={onChangeYear} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <CalendarHeatmap activity={activity} />
//             </CardContent>
//           </Card>

//           {/* Posts list like screenshot */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardContent className="pt-4">
//               <div className="flex items-center justify-between">
//                 <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                   <TabsList className="bg-transparent p-0 gap-2">
//                     <TabChip value="all" icon={FileText} active={activeTab === "all"}>
//                       All posts
//                     </TabChip>
//                     <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
//                       Accepted
//                     </TabChip>
//                     <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
//                       Rejected
//                     </TabChip>
//                     <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
//                       Discussion
//                     </TabChip>
//                   </TabsList>
//                 </Tabs>
//                 <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                   View all submissions
//                 </Button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {loading ? (
//                   <RowShell>Loading…</RowShell>
//                 ) : filteredPosts.length === 0 ? (
//                   <RowShell>
//                     <Bell className="h-4 w-4 text-[#888]" />
//                     <span className="text-sm" style={{ color: C.muted }}>
//                       No posts for {year}.
//                     </span>
//                   </RowShell>
//                 ) : (
//                   filteredPosts.map((p) => (
//                     <RowShell key={p.id}>
//                       <div className="flex-1 truncate">{p.title}</div>
//                       <div className="flex items-center gap-3">
//                         <StatusPill status={p.status} />
//                         <div className="text-xs" style={{ color: C.muted }}>
//                           {timeAgo(p.createdAt)}
//                         </div>
//                       </div>
//                     </RowShell>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//        </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   let prevMonth = -1
//   const monthPositions: string[] = new Array(53).fill('')
//   for (let w = 0; w < 53; w++) {
//     const month = weeks[w][0].date.getMonth()
//     if (month !== prevMonth) {
//       monthPositions[w] = monthNames[month]
//       prevMonth = month
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {monthPositions.map((label, i) => (
//           <div key={i} className="text-xs" style={{ color: '#9ca3af', textAlign: 'left' }}>
//             {label}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }
// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }
// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }





// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-GB')
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   const filteredPosts = useMemo(() => {
//     switch (activeTab) {
//       case "all":
//         return posts
//       case "accepted":
//         return posts.filter((p) => p.status === "accepted")
//       case "rejected":
//         return posts.filter((p) => p.status === "rejected")
//       case "discussion":
//         return posts // Assuming show all for discussion as no comment data available
//       default:
//         return posts
//     }
//   }, [activeTab, posts])

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
//           {/* Left Sidebar */}
//           <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//             <div className="p-4 sm:p-6">
//               {/* Profile Section */}
//               <div className="flex items-center gap-4 mb-6">
//                 <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-1 ring-[#333]">
//                   <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                   <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                     <User2 className="h-8 w-8 sm:h-10 sm:w-10" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-semibold text-lg sm:text-xl">{username || "—"}</div>
//                   {typeof rank === "number" && (
//                     <div className="text-xs sm:text-sm mt-1" style={{ color: C.muted }}>
//                       Rank {rank.toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Community Posts Section */}
//               <h3 className="text-sm sm:text-base font-semibold mb-4">Community Posts</h3>
//               <div className="space-y-3 mb-6">
//                 <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//                 <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//                 <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//                 <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//               </div>

//               <Button
//                 className="w-full font-medium text-sm sm:text-base"
//                 style={{ backgroundColor: C.green, color: "#0b2b16" }}
//                 onClick={() => (window.location.href = "/settings/profile")}
//               >
//                 Edit Profile
//               </Button>
//             </div>
//           </aside>

//           {/* Right Content */}
//           <section className="space-y-6">
//             {/* Top row: semicircle + badges */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-base sm:text-lg font-semibold">Total Posts</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <div className="flex flex-col sm:flex-row items-center gap-6">
//                     <div className="w-full sm:w-[260px] h-[150px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <RechartsTooltip
//                             contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                             labelStyle={{ color: "#ddd" }}
//                             itemStyle={{ color: "#ddd" }}
//                           />
//                           <Pie
//                             data={semiData}
//                             dataKey="value"
//                             startAngle={180}
//                             endAngle={0}
//                             innerRadius={60}
//                             outerRadius={75}
//                             cx="50%"
//                             cy="100%"
//                             stroke="none"
//                           >
//                             {semiData.map((entry, idx) => (
//                               <Cell key={`cell-${idx}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="flex-1">
//                       <div className="text-2xl sm:text-3xl font-bold">{totalPosts}</div>
//                       <div className="text-sm sm:text-base" style={{ color: C.muted }}>
//                         Posts created by agent
//                       </div>
//                       <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
//                         <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                         <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                         <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-base sm:text-lg font-semibold">Badges</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   {loading ? (
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Loading…
//                     </div>
//                   ) : badges.length === 0 ? (
//                     <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                       <Medal className="h-4 w-4" /> No badges yet
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-3">
//                       {badges.map((b) => (
//                         <div
//                           key={b.id}
//                           className="flex items-center gap-2 rounded-lg px-3 py-2"
//                           style={{ backgroundColor: C.surface }}
//                           title={b.name}
//                         >
//                           {b.imageUrl ? (
//                             <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                           ) : (
//                             <Medal className="h-6 w-6 text-amber-400" />
//                           )}
//                           <span className="text-sm">{b.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Activity heatmap */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//                   <CardTitle className="text-base sm:text-lg font-semibold">
//                     {totalInYear(activity)} submissions in the past one year
//                   </CardTitle>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 sm:mt-0">
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                     </div>
//                     <YearDropdown year={year} onChange={onChangeYear} />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-2">
//                 <CalendarHeatmap activity={activity} />
//               </CardContent>
//             </Card>

//             {/* Posts list */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardContent className="pt-4">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//                   <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
//                     <TabsList className="bg-transparent p-0 gap-2 flex flex-wrap">
//                       <TabChip value="all" icon={FileText} active={activeTab === "all"}>
//                         All posts
//                       </TabChip>
//                       <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
//                         Accepted
//                       </TabChip>
//                       <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
//                         Rejected
//                       </TabChip>
//                       <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
//                         Discussion
//                       </TabChip>
//                     </TabsList>
//                   </Tabs>
//                   <Button variant="ghost" className="text-xs sm:text-sm hover:bg-transparent px-0 mt-2 sm:mt-0" style={{ color: C.muted }}>
//                     View all submissions
//                   </Button>
//                 </div>

//                 <div className="mt-4 space-y-3">
//                   {loading ? (
//                     <RowShell>Loading…</RowShell>
//                   ) : filteredPosts.length === 0 ? (
//                     <RowShell>
//                       <Bell className="h-4 w-4 text-[#888]" />
//                       <span className="text-sm" style={{ color: C.muted }}>
//                         No posts for {year}.
//                       </span>
//                     </RowShell>
//                   ) : (
//                     filteredPosts.map((p) => (
//                       <RowShell key={p.id}>
//                         <div className="flex-1 truncate text-sm sm:text-base">{p.title}</div>
//                         <div className="flex items-center gap-3">
//                           <StatusPill status={p.status} />
//                           <div className="text-xs sm:text-sm" style={{ color: C.muted }}>
//                             {timeAgo(p.createdAt)}
//                           </div>
//                         </div>
//                       </RowShell>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </section>
//         </div>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs sm:text-sm" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424] text-sm">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   let prevMonth = -1
//   const monthPositions: string[] = new Array(53).fill('')
//   for (let w = 0; w < 53; w++) {
//     const month = weeks[w][0].date.getMonth()
//     if (month !== prevMonth) {
//       monthPositions[w] = monthNames[month]
//       prevMonth = month
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {monthPositions.map((label, i) => (
//           <div key={i} className="text-xs" style={{ color: '#9ca3af', textAlign: 'left' }}>
//             {label}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }

// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }

// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }





// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-GB')
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

  

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

// //  const semiData = [
// //     { name: "Easy", value: 99, color: "#00C49F" },
// //     { name: "Medium", value: 95, color: "#FFBB28" },
// //     { name: "Hard", value: 10, color: "#FF4444" },
// //   ];

//   const totalSolved = 204;
//   const totalProblems = 3671;


//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   const filteredPosts = useMemo(() => {
//     switch (activeTab) {
//       case "all":
//         return posts
//       case "accepted":
//         return posts.filter((p) => p.status === "accepted")
//       case "rejected":
//         return posts.filter((p) => p.status === "rejected")
//       case "discussion":
//         return posts // Assuming show all for discussion as no comment data available
//       default:
//         return posts
//     }
//   }, [activeTab, posts])

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       {/* Updated grid layout */}
//       <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Sidebar */}
//         <aside className="rounded-xl lg:col-span-1" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//           <div className="p-5">
//             {/* Profile Section */}
//             <div className="flex items-center gap-3 mb-6">
//               <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                 <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                 <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                   <User2 className="h-6 w-6" />
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-[17px]">{username || "—"}</div>
//                 {typeof rank === "number" && (
//                   <div className="text-xs mt-1" style={{ color: C.muted }}>
//                     Rank {rank.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Community Posts Section */}
//             <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
//             <div className="space-y-3 mb-6">
//               <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//               <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//               <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//               <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//             </div>

//             <Button
//               className="w-full font-medium"
//               style={{ backgroundColor: C.green, color: "#0b2b16" }}
//               onClick={() => (window.location.href = "/settings/profile")}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         </aside>

//         {/* Right Content */}
//         <section className="space-y-6 lg:col-span-2">
//           {/* Top row: semicircle + badges */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Total Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-6">
//                   <div className="w-[260px] h-[150px]">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <RechartsTooltip
//                           contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                           labelStyle={{ color: "#ddd" }}
//                           itemStyle={{ color: "#ddd" }}
//                         />
//                         <Pie
//                           data={semiData}
//                           dataKey="value"
//                           startAngle={180}
//                           endAngle={0}
//                           innerRadius={60}
//                           outerRadius={75}
//                           cx="50%"
//                           cy="100%"
//                           stroke="none"
//                         >
//                           {semiData.map((entry, idx) => (
//                             <Cell key={`cell-${idx}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl font-bold">{totalPosts}</div>
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Posts created by agent
//                     </div>

//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                       <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                       <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>


      

//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-semibold">Badges</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 {loading ? (
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Loading…
//                   </div>
//                 ) : badges.length === 0 ? (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                     <Medal className="h-4 w-4" /> No badges yet
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-3">
//                     {badges.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex items-center gap-2 rounded-lg px-3 py-2"
//                         style={{ backgroundColor: C.surface }}
//                         title={b.name}
//                       >
//                         {b.imageUrl ? (
//                           <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                         ) : (
//                           <Medal className="h-6 w-6 text-amber-400" />
//                         )}
//                         <span className="text-sm">{b.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity heatmap */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base font-semibold">
//                   {totalInYear(activity)} submissions in the past one year
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm" style={{ color: C.muted }}>
//                     Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                   </div>
//                   <YearDropdown year={year} onChange={onChangeYear} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-2">
//               <CalendarHeatmap activity={activity} />
//             </CardContent>
//           </Card>

//           {/* Posts list like screenshot */}
//           <Card className="border-0" style={{ backgroundColor: C.card }}>
//             <CardContent className="pt-4">
//               <div className="flex items-center justify-between">
//                 <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                   <TabsList className="bg-transparent p-0 gap-2">
//                     <TabChip value="all" icon={FileText} active={activeTab === "all"}>
//                       All posts
//                     </TabChip>
//                     <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
//                       Accepted
//                     </TabChip>
//                     <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
//                       Rejected
//                     </TabChip>
//                     <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
//                       Discussion
//                     </TabChip>
//                   </TabsList>
//                 </Tabs>
//                 <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                   View all submissions
//                 </Button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 {loading ? (
//                   <RowShell>Loading…</RowShell>
//                 ) : filteredPosts.length === 0 ? (
//                   <RowShell>
//                     <Bell className="h-4 w-4 text-[#888]" />
//                     <span className="text-sm" style={{ color: C.muted }}>
//                       No posts for {year}.
//                     </span>
//                   </RowShell>
//                 ) : (
//                   filteredPosts.map((p) => (
//                     <RowShell key={p.id}>
//                       <div className="flex-1 truncate">{p.title}</div>
//                       <div className="flex items-center gap-3">
//                         <StatusPill status={p.status} />
//                         <div className="text-xs" style={{ color: C.muted }}>
//                           {timeAgo(p.createdAt)}
//                         </div>
//                       </div>
//                     </RowShell>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   let prevMonth = -1
//   const monthPositions: string[] = new Array(53).fill('')
//   for (let w = 0; w < 53; w++) {
//     const month = weeks[w][0].date.getMonth()
//     if (month !== prevMonth) {
//       monthPositions[w] = monthNames[month]
//       prevMonth = month
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {monthPositions.map((label, i) => (
//           <div key={i} className="text-xs" style={{ color: '#9ca3af', textAlign: 'left' }}>
//             {label}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }
// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }
// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }



// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-GB')
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   const filteredPosts = useMemo(() => {
//     switch (activeTab) {
//       case "all":
//         return posts
//       case "accepted":
//         return posts.filter((p) => p.status === "accepted")
//       case "rejected":
//         return posts.filter((p) => p.status === "rejected")
//       case "discussion":
//         return posts // Assuming show all for discussion as no comment data available
//       default:
//         return posts
//     }
//   }, [activeTab, posts])

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
//           {/* Left Sidebar */}
//           <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//             <div className="p-5">
//               {/* Profile Section */}
//               <div className="flex items-center gap-3 mb-6">
//                 <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                   <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                   <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                     <User2 className="h-6 w-6" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-semibold text-[17px]">{username || "—"}</div>
//                   {typeof rank === "number" && (
//                     <div className="text-xs mt-1" style={{ color: C.muted }}>
//                       Rank {rank.toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Community Posts Section */}
//               <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
//               <div className="space-y-3 mb-6">
//                 <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//                 <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//                 <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//                 <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//               </div>

//               <Button
//                 className="w-full font-medium"
//                 style={{ backgroundColor: C.green, color: "#0b2b16" }}
//                 onClick={() => (window.location.href = "/settings/profile")}
//               >
//                 Edit Profile
//               </Button>
//             </div>
//           </aside>

//           {/* Right Content */}
//           <section className="space-y-6">
//             {/* Top row: semicircle + badges */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6">
//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-white font-semibold">Total Posts</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <div className="flex items-center gap-6">
//                     <div className="w-[260px] h-[150px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <RechartsTooltip
//                             contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                             labelStyle={{ color: "#ddd" }}
//                             itemStyle={{ color: "#ddd" }}
//                           />
//                           <Pie
//                             data={semiData}
//                             dataKey="value"
//                             startAngle={180}
//                             endAngle={0}
//                             innerRadius={60}
//                             outerRadius={75}
//                             cx="50%"
//                             cy="100%"
//                             stroke="none"
//                           >
//                             {semiData.map((entry, idx) => (
//                               <Cell key={`cell-${idx}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="flex-1">
//                       <div className="text-3xl text-white font-bold">{totalPosts}</div>
//                       <div className="text-sm" style={{ color: C.muted }}>
//                         Posts created by agent
//                       </div>

//                       <div className="mt-4 grid grid-cols-3 gap-2">
//                         <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                         <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                         <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-white font-semibold">Badges</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   {loading ? (
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Loading…
//                     </div>
//                   ) : badges.length === 0 ? (
//                     <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                       <Medal className="h-4 w-4" /> No badges yet
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-3">
//                       {badges.map((b) => (
//                         <div
//                           key={b.id}
//                           className="flex items-center gap-2 rounded-lg px-3 py-2"
//                           style={{ backgroundColor: C.surface }}
//                           title={b.name}
//                         >
//                           {b.imageUrl ? (
//                             <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                           ) : (
//                             <Medal className="h-6 w-6 text-amber-400" />
//                           )}
//                           <span className="text-sm">{b.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Activity heatmap */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-white font-semibold">
//                     {totalInYear(activity)} submissions in the past one year
//                   </CardTitle>
//                   <div className="flex items-center gap-4">
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                     </div>
//                     <YearDropdown year={year} onChange={onChangeYear} />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-2">
//                 <CalendarHeatmap activity={activity} />
//               </CardContent>
//             </Card>

//             {/* Posts list like screenshot */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardContent className="pt-4">
//                 <div className="flex items-center justify-between">
//                   <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                     <TabsList className="bg-transparent p-0 gap-2">
//                       <TabChip value="all" icon={FileText} active={activeTab === "all"}>
//                         All posts
//                       </TabChip>
//                       <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
//                         Accepted
//                       </TabChip>
//                       <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
//                         Rejected
//                       </TabChip>
//                       <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
//                         Discussion
//                       </TabChip>
//                     </TabsList>
//                   </Tabs>
//                   <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                     View all submissions
//                   </Button>
//                 </div>

//                 <div className="mt-4 space-y-3">
//                   {loading ? (
//                     <RowShell>Loading…</RowShell>
//                   ) : filteredPosts.length === 0 ? (
//                     <RowShell>
//                       <Bell className="h-4 w-4 text-[#888]" />
//                       <span className="text-sm" style={{ color: C.muted }}>
//                         No posts for {year}.
//                       </span>
//                     </RowShell>
//                   ) : (
//                     filteredPosts.map((p) => (
//                       <RowShell key={p.id}>
//                         <div className="flex-1 truncate">{p.title}</div>
//                         <div className="flex items-center gap-3">
//                           <StatusPill status={p.status} />
//                           <div className="text-xs" style={{ color: C.muted }}>
//                             {timeAgo(p.createdAt)}
//                           </div>
//                         </div>
//                       </RowShell>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </section>
//         </div>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   let prevMonth = -1
//   const monthPositions: string[] = new Array(53).fill('')
//   for (let w = 0; w < 53; w++) {
//     const month = weeks[w][0].date.getMonth()
//     if (month !== prevMonth) {
//       monthPositions[w] = monthNames[month]
//       prevMonth = month
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {weeks.map((col, i) => (
//           <div key={i} className="grid" style={{ gridTemplateRows: "repeat(7, 12px)", gap: 3 }}>
//             {col.map((cell, j) => (
//               <div
//                 key={`${i}-${j}`}
//                 className="rounded-[3px]"
//                 title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//                 style={{ backgroundColor: scale(cell.count) }}
//               />
//             ))}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: 3 }}>
//         {monthPositions.map((label, i) => (
//           <div key={i} className="text-xs" style={{ color: '#9ca3af', textAlign: 'left' }}>
//             {label}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-[#9ca3af]">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }
// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }
// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }



// "use client"

// import type React from "react"
// import { useEffect, useMemo, useState } from "react"
// import axios from "axios"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   CalendarDays,
//   Medal,
//   ChevronDown,
//   FileText,
//   Bell,
//   Shield,
//   MessageSquare,
//   TrendingUp,
//   User2,
// } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
// import { cn } from "@/lib/utils"

// // Colors: 5 total to match screenshot
// const C = {
//   bg: "#0f0f0f",
//   card: "#1f1f1f",
//   surface: "#2a2a2a",
//   text: "#e5e7eb",
//   green: "#22c55e",
//   amber: "#f59e0b",
//   red: "#ef4444",
//   muted: "#9ca3af",
// }

// // Prefer env override
// const API_BASE_URL = "http://localhost:5000/api"

// type Status = "accepted" | "rejected" | "pending"

// interface Notification {
//   _id: string
//   message: string
//   status: Status | string
//   comment?: string
//   postId?: { title?: string }
//   createdAt: string
// }

// interface UserStats {
//   totalPosts: number
//   acceptedPosts: number
//   rejectedPosts: number
//   pendingPosts: number
//   totalUpvotes: number
//   totalComments: number
//   points: number
//   discussions?: number
//   reputation?: number
//   avatarUrl?: string
//   username?: string
//   handle?: string
//   rank?: number
// }

// interface BadgeItem {
//   id: string
//   name: string
//   imageUrl?: string
//   earnedAt?: string
// }

// interface ActivityDay {
//   date: string // YYYY-MM-DD
//   count: number
// }

// interface PostItem {
//   id: string
//   title: string
//   status: Status
//   createdAt: string
// }

// function useAuthToken() {
//   const [token, setToken] = useState<string | null>(null)
//   useEffect(() => {
//     const t = localStorage.getItem("token")
//     setToken(t)
//   }, [])
//   return token
// }

// function timeAgo(dateString: string) {
//   const date = new Date(dateString)
//   return date.toLocaleDateString('en-GB')
// }

// function StatusPill({ status }: { status: Status }) {
//   const map = {
//     accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
//     rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
//     pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
//   } as const
//   const Icon = map[status].icon
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
//         map[status].bg,
//         map[status].text,
//       )}
//     >
//       <Icon className="h-3 w-3" />
//       {status[0].toUpperCase() + status.slice(1)}
//     </span>
//   )
// }

// export default function UserProfilePage() {
//   const token = useAuthToken()
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState("")
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
//   const [rank, setRank] = useState<number | undefined>(undefined)

//   // stats
//   const [stats, setStats] = useState<UserStats>({
//     totalPosts: 0,
//     acceptedPosts: 0,
//     rejectedPosts: 0,
//     pendingPosts: 0,
//     totalUpvotes: 0,
//     totalComments: 0,
//     points: 0,
//     discussions: 0,
//     reputation: 0,
//   })

//   // right side
//   const [badges, setBadges] = useState<BadgeItem[]>([])
//   const [activity, setActivity] = useState<ActivityDay[]>([])
//   const [year, setYear] = useState<number>(new Date().getFullYear())
//   const [posts, setPosts] = useState<PostItem[]>([])

//   // notifications
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }
//     let cancelled = false

//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const headers = { Authorization: `Bearer ${token}` }

//         // Parallel core requests
//         const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
//           axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
//         ])

//         if (!cancelled) {
//           if (profileRes?.data) {
//             const p = profileRes.data
//             setUsername(p.username || "")
//             setAvatarUrl(p.avatarUrl)
//             setRank(p.rank)
//           }

//           if (statsRes?.data) {
//             const s = statsRes.data
//             setStats({
//               totalPosts: s.totalPosts ?? 0,
//               acceptedPosts: s.acceptedPosts ?? 0,
//               rejectedPosts: s.rejectedPosts ?? 0,
//               pendingPosts: s.pendingPosts ?? 0,
//               totalUpvotes: s.totalUpvotes ?? 0,
//               totalComments: s.totalComments ?? 0,
//               points: s.points ?? 0,
//               discussions: s.discussions ?? 0,
//               reputation: s.reputation ?? 0,
//             })
//           }

//           if (notifRes?.data) {
//             setNotifications(notifRes.data || [])
//           }

//           if (badgesRes?.data) {
//             setBadges(badgesRes.data || [])
//           }

//           if (activityRes?.data) {
//             setActivity(activityRes.data || [])
//           }

//           if (postsRes?.data) {
//             setPosts(postsRes.data || [])
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     fetchData()
//     return () => {
//       cancelled = true
//     }
//   }, [token, year])

//   const semiData = useMemo(
//     () => [
//       { name: "Accepted", value: stats.acceptedPosts, color: C.green },
//       { name: "Rejected", value: stats.rejectedPosts, color: C.red },
//       { name: "Pending", value: stats.pendingPosts, color: C.amber },
//     ],
//     [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
//   )
//   const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

//   function onChangeYear(next: number) {
//     setYear(next)
//   }

//   const filteredPosts = useMemo(() => {
//     switch (activeTab) {
//       case "all":
//         return posts
//       case "accepted":
//         return posts.filter((p) => p.status === "accepted")
//       case "rejected":
//         return posts.filter((p) => p.status === "rejected")
//       case "discussion":
//         return posts // Assuming show all for discussion as no comment data available
//       default:
//         return posts
//     }
//   }, [activeTab, posts])

//   return (
//     <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
//           {/* Left Sidebar */}
//           <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
//             <div className="p-5">
//               {/* Profile Section */}
//               <div className="flex items-center gap-3 mb-6">
//                 <Avatar className="h-14 w-14 ring-1 ring-[#333]">
//                   <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
//                   <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
//                     <User2 className="h-6 w-6" />
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-semibold text-[17px]">{username || "—"}</div>
//                   {typeof rank === "number" && (
//                     <div className="text-xs mt-1" style={{ color: C.muted }}>
//                       Rank {rank.toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Community Posts Section */}
//               <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
//               <div className="space-y-3 mb-6">
//                 <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
//                 <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
//                 <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
//                 <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
//               </div>

//               <Button
//                 className="w-full font-medium"
//                 style={{ backgroundColor: C.green, color: "#0b2b16" }}
//                 onClick={() => (window.location.href = "/settings/profile")}
//               >
//                 Edit Profile
//               </Button>
//             </div>
//           </aside>

//           {/* Right Content */}
//           <section className="space-y-6">
//             {/* Top row: semicircle + badges */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6">
//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-white font-semibold">Total Posts</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <div className="flex items-center gap-6">
//                     <div className="w-[260px] h-[150px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <RechartsTooltip
//                             contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
//                             labelStyle={{ color: "#ddd" }}
//                             itemStyle={{ color: "#ddd" }}
//                           />
//                           <Pie
//                             data={semiData}
//                             dataKey="value"
//                             startAngle={180}
//                             endAngle={0}
//                             innerRadius={60}
//                             outerRadius={75}
//                             cx="50%"
//                             cy="100%"
//                             stroke="none"
//                           >
//                             {semiData.map((entry, idx) => (
//                               <Cell key={`cell-${idx}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="flex-1">
//                       <div className="text-3xl text-white font-bold">{totalPosts}</div>
//                       <div className="text-sm" style={{ color: C.muted }}>
//                         Posts created by agent
//                       </div>

//                       <div className="mt-4 grid grid-cols-3 gap-2">
//                         <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
//                         <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
//                         <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0" style={{ backgroundColor: C.card }}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-white font-semibold">Badges</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   {loading ? (
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Loading…
//                     </div>
//                   ) : badges.length === 0 ? (
//                     <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
//                       <Medal className="h-4 w-4" /> No badges yet
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-3">
//                       {badges.map((b) => (
//                         <div
//                           key={b.id}
//                           className="flex items-center gap-2 rounded-lg px-3 py-2"
//                           style={{ backgroundColor: C.surface }}
//                           title={b.name}
//                         >
//                           {b.imageUrl ? (
//                             <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
//                           ) : (
//                             <Medal className="h-6 w-6 text-amber-400" />
//                           )}
//                           <span className="text-sm">{b.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Activity heatmap */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardHeader className="pb-2">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-white font-semibold">
//                     {totalInYear(activity)} submissions in the past one year
//                   </CardTitle>
//                   <div className="flex items-center gap-4">
//                     <div className="text-sm" style={{ color: C.muted }}>
//                       Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
//                     </div>
//                     <YearDropdown year={year} onChange={onChangeYear} />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-2">
//                 <CalendarHeatmap activity={activity} />
//               </CardContent>
//             </Card>

//             {/* Posts list like screenshot */}
//             <Card className="border-0" style={{ backgroundColor: C.card }}>
//               <CardContent className="pt-4">
//                 <div className="flex items-center justify-between">
//                   <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
//                     <TabsList className="bg-transparent p-0 gap-2" >
//                       <TabChip value="all"  icon={FileText} active={activeTab === "all"}>
//                         All posts
//                       </TabChip>
//                       <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
//                         Accepted
//                       </TabChip>
//                       <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
//                         Rejected
//                       </TabChip>
//                       <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
//                         Discussion
//                       </TabChip>
//                     </TabsList>
//                   </Tabs>
//                   <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
//                     View all submissions
//                   </Button>
//                 </div>

//                 <div className="mt-4 space-y-3">
//                   {loading ? (
//                     <RowShell>Loading…</RowShell>
//                   ) : filteredPosts.length === 0 ? (
//                     <RowShell>
//                       <Bell className="h-4 w-4 text-[#888]" />
//                       <span className="text-sm" style={{ color: C.muted }}>
//                         No posts for {year}.
//                       </span>
//                     </RowShell>
//                   ) : (
//                     filteredPosts.map((p) => (
//                       <RowShell key={p.id}>
//                         <div className="flex-1 truncate" style={{ color: "#d1d5db" }}>{p.title}</div>
//                         <div className="flex items-center gap-3">
//                           <StatusPill status={p.status} />
//                           <div className="text-xs" style={{ color: "#d1d5db" }}>
//                             {timeAgo(p.createdAt)}
//                           </div>
//                         </div>
//                       </RowShell>
//                     ))
//                   )}
//                 </div>


                
//               </CardContent>
//             </Card>
//           </section>
//         </div>
//       </div>
//     </main>
//   )
// }

// function StatRow({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   label: string
//   value: number | string
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
//       <div className="flex items-center gap-2">
//         <Icon className="h-4 w-4 text-[#9ca3af]" />
//         <div className="text-sm">{label}</div>
//       </div>
//       <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
//     </div>
//   )
// }

// function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
//   return (
//     <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
//       <span className="text-xs" style={{ color: "#c7c7c7" }}>
//         {label}
//       </span>
//       <span className="text-sm font-semibold" style={{ color }}>
//         {value ?? 0}
//       </span>
//     </div>
//   )
// }

// function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
//   const years = [2025, 2024, 2023]
//   return (
//     <div className="relative">
//       <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
//         {year} <ChevronDown className="h-4 w-4" />
//       </Button>
//       <div className="sr-only">Select Year</div>
//       <div className="hidden" />
//       <select
//         aria-label="Select Year"
//         className="absolute inset-0 opacity-0 cursor-pointer"
//         value={year}
//         onChange={(e) => onChange(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>
//             {y}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
//   const end = new Date()
//   const start = new Date(end)
//   start.setDate(end.getDate() - 7 * 53 + 1)

//   const map = new Map<string, number>()
//   for (const d of activity || []) {
//     map.set(d.date, Number(d.count || 0))
//   }

//   const weeks: { date: Date; count: number }[][] = []
//   const cursor = new Date(start)
//   for (let w = 0; w < 53; w++) {
//     const col: { date: Date; count: number }[] = []
//     for (let i = 0; i < 7; i++) {
//       const iso = cursor.toISOString().slice(0, 10)
//       col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
//       cursor.setDate(cursor.getDate() + 1)
//     }
//     weeks.push(col)
//   }

//   const scale = (c: number) => {
//     if (c === 0) return "#2a2a2a"
//     if (c < 3) return "#134e2f"
//     if (c < 5) return "#166534"
//     if (c < 8) return "#16a34a"
//     return "#22c55e"
//   }

//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//   let prevMonth = -1
//   const monthPositions: string[] = new Array(53).fill('')
//   for (let w = 0; w < 53; w++) {
//     const month = weeks[w][0].date.getMonth()
//     if (month !== prevMonth) {
//       monthPositions[w] = monthNames[month]
//       prevMonth = month
//     }
//   }

//   return (
//     <div className="overflow-x-auto">
//       <div className="grid grid-cols-53 gap-1" style={{ gridTemplateRows: "repeat(7, 12px)" }}>
//         {weeks.map((col, i) => (
//           col.map((cell, j) => (
//             <div
//               key={`${i}-${j}`}
//               className="rounded-[3px] border border-gray-700 hover:border-gray-500"
//               title={`${cell.date.toDateString()}: ${cell.count} submissions`}
//               style={{ backgroundColor: scale(cell.count), width: "12px", height: "12px" }}
//             />
//           ))
//         ))}
//       </div>
//       <div className="mt-2 grid grid-cols-53 gap-1" style={{ gridTemplateRows: "12px" }}>
//         {monthPositions.map((label, i) => (
//           <div key={i} className="text-xs text-gray-400 text-left">
//             {label}
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
//         <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
//       </div>
//     </div>
//   )
// }

// function totalInYear(activity: ActivityDay[]) {
//   return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
// }

// function activeDays(activity: ActivityDay[]) {
//   return (activity || []).filter((d) => (d.count || 0) > 0).length
// }

// function maxStreak(activity: ActivityDay[]) {
//   let best = 0
//   let cur = 0
//   for (const d of activity || []) {
//     if ((d.count || 0) > 0) {
//       cur++
//       best = Math.max(best, cur)
//     } else {
//       cur = 0
//     }
//   }
//   return best
// }

// function RowShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
//       {children}
//     </div>
//   )
// }

// function TabChip({
//   value,
//   icon: Icon,
//   active,
//   children,
// }: {
//   value: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   active: boolean
//   children: React.ReactNode
// }) {
//   return (
//     <TabsTrigger
//       value={value}
//       className={cn(
//         "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
//         active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
//       )}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {children}
//     </TabsTrigger>
//   )
// }


"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  Medal,
  ChevronDown,
  FileText,
  Bell,
  Shield,
  MessageSquare,
  TrendingUp,
  User2,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { cn } from "@/lib/utils"

// Colors: 5 total to match screenshot
const C = {
  bg: "#0f0f0f",
  card: "#1f1f1f",
  surface: "#2a2a2a",
  text: "#e5e7eb",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  muted: "#9ca3af",
}

// Prefer env override
const API_BASE_URL = "http://localhost:5000/api"

type Status = "accepted" | "rejected" | "pending"

interface Notification {
  _id: string
  message: string
  status: Status | string
  comment?: string
  postId?: { title?: string }
  createdAt: string
}

interface UserStats {
  totalPosts: number
  acceptedPosts: number
  rejectedPosts: number
  pendingPosts: number
  totalUpvotes: number
  totalComments: number
  points: number
  discussions?: number
  reputation?: number
  avatarUrl?: string
  username?: string
  handle?: string
  rank?: number
}

interface BadgeItem {
  id: string
  name: string
  imageUrl?: string
  earnedAt?: string
}

interface ActivityDay {
  date: string // YYYY-MM-DD
  count: number
}

interface PostItem {
  id: string
  title: string
  status: Status
  createdAt: string
  rejectionComment?: string
}

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const t = localStorage.getItem("token")
    setToken(t)
  }, [])
  return token
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB')
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    accepted: { icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-400" },
    rejected: { icon: XCircle, bg: "bg-red-500/15", text: "text-red-400" },
    pending: { icon: Clock, bg: "bg-amber-500/15", text: "text-amber-400" },
  } as const
  const Icon = map[status].icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        map[status].bg,
        map[status].text,
      )}
    >
      <Icon className="h-3 w-3" />
      {status[0].toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function UserProfilePage() {
  const token = useAuthToken()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [rank, setRank] = useState<number | undefined>(undefined)

  // stats
  const [stats, setStats] = useState<UserStats>({
    totalPosts: 0,
    acceptedPosts: 0,
    rejectedPosts: 0,
    pendingPosts: 0,
    totalUpvotes: 0,
    totalComments: 0,
    points: 0,
    discussions: 0,
    reputation: 0,
  })

  // right side
  const [badges, setBadges] = useState<BadgeItem[]>([])
  const [activity, setActivity] = useState<ActivityDay[]>([])
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [posts, setPosts] = useState<PostItem[]>([])

  // notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "accepted" | "rejected" | "discussion">("all")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        const headers = { Authorization: `Bearer ${token}` }

        // Parallel core requests
        const [profileRes, statsRes, notifRes, badgesRes, activityRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/profile`, { headers }).catch(() => null),
          axios.get(`${API_BASE_URL}/user/stats`, { headers }).catch(() => null),
          axios.get(`${API_BASE_URL}/notifications`, { headers }).catch(() => null),
          axios.get(`${API_BASE_URL}/user/badges`, { headers }).catch(() => null),
          axios.get(`${API_BASE_URL}/user/activity`, { headers, params: { year } }).catch(() => null),
          axios.get(`${API_BASE_URL}/user/posts`, { headers, params: { year } }).catch(() => null),
        ])

        if (!cancelled) {
          if (profileRes?.data) {
            const p = profileRes.data
            setUsername(p.username || "")
            setAvatarUrl(p.avatarUrl)
            setRank(p.rank)
          }

          if (statsRes?.data) {
            const s = statsRes.data
            setStats({
              totalPosts: s.totalPosts ?? 0,
              acceptedPosts: s.acceptedPosts ?? 0,
              rejectedPosts: s.rejectedPosts ?? 0,
              pendingPosts: s.pendingPosts ?? 0,
              totalUpvotes: s.totalUpvotes ?? 0,
              totalComments: s.totalComments ?? 0,
              points: s.points ?? 0,
              discussions: s.discussions ?? 0,
              reputation: s.reputation ?? 0,
            })
          }

          if (notifRes?.data) {
            setNotifications(notifRes.data || [])
          }

          if (badgesRes?.data) {
            setBadges(badgesRes.data || [])
          }

          if (activityRes?.data) {
            setActivity(activityRes.data || [])
          }

          if (postsRes?.data) {
            setPosts(postsRes.data.map((p: any) => ({
              id: p.id,
              title: p.title,
              status: p.status,
              createdAt: p.createdAt,
              rejectionComment: p.rejectionComment // Include rejection comment from backend
            })) || [])
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [token, year])

  const semiData = useMemo(
    () => [
      { name: "Accepted", value: stats.acceptedPosts, color: C.green },
      { name: "Rejected", value: stats.rejectedPosts, color: C.red },
      { name: "Pending", value: stats.pendingPosts, color: C.amber },
    ],
    [stats.acceptedPosts, stats.rejectedPosts, stats.pendingPosts],
  )
  const totalPosts = stats.totalPosts || semiData.reduce((a, b) => a + (b.value || 0), 0)

  function onChangeYear(next: number) {
    setYear(next)
  }

  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case "all":
        return posts
      case "accepted":
        return posts.filter((p) => p.status === "accepted")
      case "rejected":
        return posts.filter((p) => p.status === "rejected")
      case "discussion":
        return posts // Assuming show all for discussion as no comment data available
      default:
        return posts
    }
  }, [activeTab, posts])

  return (
    <main className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="rounded-xl" style={{ backgroundColor: C.card, borderColor: C.surface, borderWidth: 1 }}>
            <div className="p-5">
              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-14 w-14 ring-1 ring-[#333]">
                  <AvatarImage src={avatarUrl || ""} alt={`${username}'s avatar`} />
                  <AvatarFallback className="bg-[#2a2a2a] text-[#a3a3a3]">
                    <User2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-[17px]">{username || "—"}</div>
                  {typeof rank === "number" && (
                    <div className="text-xs mt-1" style={{ color: C.muted }}>
                      Rank {rank.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Community Posts Section */}
              <h3 className="text-sm font-semibold mb-3">Community Posts</h3>
              <div className="space-y-3 mb-6">
                <StatRow icon={FileText} label="Total Posts Submitted" value={totalPosts} />
                <StatRow icon={TrendingUp} label="Points" value={stats.points ?? 0} />
                <StatRow icon={MessageSquare} label="Discussions" value={stats.discussions ?? 0} />
                <StatRow icon={Shield} label="Reputation" value={stats.reputation ?? 0} />
              </div>

              <Button
                className="w-full font-medium"
                style={{ backgroundColor: C.green, color: "#0b2b16" }}
                onClick={() => (window.location.href = "/settings/profile")}
              >
                Edit Profile
              </Button>
            </div>
          </aside>

          {/* Right Content */}
          <section className="space-y-6">
            {/* Top row: semicircle + badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6">
              <Card className="border-0" style={{ backgroundColor: C.card }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-semibold">Total Posts</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-6">
                    <div className="w-[260px] h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8 }}
                            labelStyle={{ color: "#ddd" }}
                            itemStyle={{ color: "#ddd" }}
                          />
                          <Pie
                            data={semiData}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={75}
                            cx="50%"
                            cy="100%"
                            stroke="none"
                          >
                            {semiData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl text-white font-bold">{totalPosts}</div>
                      <div className="text-sm" style={{ color: C.muted }}>
                        Posts created by agent
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <TagStat color={C.green} label="Accepted" value={stats.acceptedPosts} />
                        <TagStat color={C.red} label="Rejected" value={stats.rejectedPosts} />
                        <TagStat color={C.amber} label="Pending" value={stats.pendingPosts} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0" style={{ backgroundColor: C.card }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-semibold">Badges</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {loading ? (
                    <div className="text-sm" style={{ color: C.muted }}>
                      Loading…
                    </div>
                  ) : badges.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                      <Medal className="h-4 w-4" /> No badges yet
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {badges.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center gap-2 rounded-lg px-3 py-2"
                          style={{ backgroundColor: C.surface }}
                          title={b.name}
                        >
                          {b.imageUrl ? (
                            <img src={b.imageUrl || "/placeholder.svg"} alt={b.name} className="h-6 w-6 rounded" />
                          ) : (
                            <Medal className="h-6 w-6 text-amber-400" />
                          )}
                          <span className="text-sm">{b.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity heatmap */}
            <Card className="border-0" style={{ backgroundColor: C.card }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold">
                    {totalInYear(activity)} submissions in the past one year
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-sm" style={{ color: C.muted }}>
                      Total active days: {activeDays(activity)} • Max streak: {maxStreak(activity)}
                    </div>
                    <YearDropdown year={year} onChange={onChangeYear} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <CalendarHeatmap activity={activity} />
              </CardContent>
            </Card>

            {/* Posts list like screenshot */}
            <Card className="border-0" style={{ backgroundColor: C.card }}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
                    <TabsList className="bg-transparent p-0 gap-2">
                      <TabChip value="all" icon={FileText} active={activeTab === "all"}>
                        All posts
                      </TabChip>
                      <TabChip value="accepted" icon={CheckCircle} active={activeTab === "accepted"}>
                        Accepted
                      </TabChip>
                      <TabChip value="rejected" icon={XCircle} active={activeTab === "rejected"}>
                        Rejected
                      </TabChip>
                      <TabChip value="discussion" icon={MessageSquare} active={activeTab === "discussion"}>
                        Discussion
                      </TabChip>
                    </TabsList>
                  </Tabs>
                  <Button variant="ghost" className="text-xs hover:bg-transparent px-0" style={{ color: C.muted }}>
                    View all submissions
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {loading ? (
                    <RowShell>Loading…</RowShell>
                  ) : filteredPosts.length === 0 ? (
                    <RowShell>
                      <Bell className="h-4 w-4 text-[#888]" />
                      <span className="text-sm" style={{ color: C.muted }}>
                        No posts for {year}.
                      </span>
                    </RowShell>
                  ) : (
                    filteredPosts.map((p) => (
                      <RowShell key={p.id}>
                        <div className="flex-1 truncate" style={{ color: "#d1d5db" }}>
                          {p.title}
                          {p.status === "rejected" && p.rejectionComment && (
                            <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                              Reason: {p.rejectionComment}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusPill status={p.status} />
                          <div className="text-xs" style={{ color: "#d1d5db" }}>
                            {timeAgo(p.createdAt)}
                          </div>
                        </div>
                      </RowShell>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#222" }}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#9ca3af]" />
        <div className="text-sm">{label}</div>
      </div>
      <div className="text-sm font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
    </div>
  )
}

function TagStat({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
      <span className="text-xs" style={{ color: "#c7c7c7" }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color }}>
        {value ?? 0}
      </span>
    </div>
  )
}

function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
  const years = [2025, 2024, 2023]
  return (
    <div className="relative">
      <Button variant="outline" className="h-8 gap-2 border-[#333] bg-[#1f1f1f] text-[#e5e7eb] hover:bg-[#242424]">
        {year} <ChevronDown className="h-4 w-4" />
      </Button>
      <div className="sr-only">Select Year</div>
      <div className="hidden" />
      <select
        aria-label="Select Year"
        className="absolute inset-0 opacity-0 cursor-pointer"
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

function CalendarHeatmap({ activity }: { activity: ActivityDay[] }) {
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - 7 * 53 + 1)

  const map = new Map<string, number>()
  for (const d of activity || []) {
    map.set(d.date, Number(d.count || 0))
  }

  const weeks: { date: Date; count: number }[][] = []
  const cursor = new Date(start)
  for (let w = 0; w < 53; w++) {
    const col: { date: Date; count: number }[] = []
    for (let i = 0; i < 7; i++) {
      const iso = cursor.toISOString().slice(0, 10)
      col.push({ date: new Date(cursor), count: map.get(iso) || 0 })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(col)
  }

  const scale = (c: number) => {
    if (c === 0) return "#2a2a2a"
    if (c < 3) return "#134e2f"
    if (c < 5) return "#166534"
    if (c < 8) return "#16a34a"
    return "#22c55e"
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let prevMonth = -1
  const monthPositions: string[] = new Array(53).fill('')
  for (let w = 0; w < 53; w++) {
    const month = weeks[w][0].date.getMonth()
    if (month !== prevMonth) {
      monthPositions[w] = monthNames[month]
      prevMonth = month
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-53 gap-1" style={{ gridTemplateRows: "repeat(7, 12px)" }}>
        {weeks.map((col, i) => (
          col.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="rounded-[3px] border border-gray-700 hover:border-gray-500"
              title={`${cell.date.toDateString()}: ${cell.count} submissions`}
              style={{ backgroundColor: scale(cell.count), width: "12px", height: "12px" }}
            />
          ))
        ))}
      </div>
      <div className="mt-2 grid grid-cols-53 gap-1" style={{ gridTemplateRows: "12px" }}>
        {monthPositions.map((label, i) => (
          <div key={i} className="text-xs text-gray-400 text-left">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <CalendarDays className="h-3 w-3" /> Green indicates days with submissions
      </div>
    </div>
  )
}

function totalInYear(activity: ActivityDay[]) {
  return (activity || []).reduce((a, b) => a + (b.count || 0), 0)
}

function activeDays(activity: ActivityDay[]) {
  return (activity || []).filter((d) => (d.count || 0) > 0).length
}

function maxStreak(activity: ActivityDay[]) {
  let best = 0
  let cur = 0
  for (const d of activity || []) {
    if ((d.count || 0) > 0) {
      cur++
      best = Math.max(best, cur)
    } else {
      cur = 0
    }
  }
  return best
}

function RowShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: C.surface }}>
      {children}
    </div>
  )
}

function TabChip({
  value,
  icon: Icon,
  active,
  children,
}: {
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  active: boolean
  children: React.ReactNode
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "h-9 rounded-lg px-3 text-sm data-[state=active]:shadow-none",
        active ? "bg-[#2a2a2a] text-[#e5e7eb]" : "bg-transparent text-[#c7c7c7]",
      )}
    >
      <Icon className="h-4 w-4 mr-2" />
      {children}
    </TabsTrigger>
  )
}