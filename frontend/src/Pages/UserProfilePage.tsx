


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Bell, CheckCircle, XCircle } from 'lucide-react';

// const UserProfile = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!token) {
//         toast.error('Please log in to view notifications.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' },
//         });
//         return;
//       }
//       setLoading(true);
//       try {
//         const response = await axios.get('http://localhost:5000/api/notifications', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotifications(response.data);
//       } catch (error) {
//         const err = error as any;
//         toast.error(err.response?.data?.message || 'Failed to load notifications. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' },
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotifications();
//   }, [token]);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     if (diffHours < 1) return 'Just now';
//     if (diffHours < 24) return `${diffHours} hours ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
//           Your Notifications
//         </h2>
//         <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-orange-100">
//           {loading ? (
//             <div className="text-center py-12 text-gray-600">Loading...</div>
//           ) : notifications.length === 0 ? (
//             <div className="text-center py-12">
//               <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
//               <p className="text-gray-500">You have no new notifications.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {notifications.map((notification: any, index: number) => (
//                 <div
//                   key={index}
//                   className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
//                     notification.status === 'accepted' ? 'border-green-500' : 'border-red-500'
//                   } bg-white/95`}
//                 >
//                   <div className="flex items-start gap-3">
//                     {notification.status === 'accepted' ? (
//                       <CheckCircle className="w-6 h-6 text-green-500" />
//                     ) : (
//                       <XCircle className="w-6 h-6 text-red-500" />
//                     )}
//                     <div className="flex-1">
//                       <p className="text-gray-800 font-medium">{notification.message}</p>
//                       {notification.comment && (
//                         <p className="text-red-600 mt-1">Rejection Reason: {notification.comment}</p>
//                       )}
//                       <p className="text-sm text-gray-500 mt-1">
//                         Post: {notification.postId?.title || 'Post deleted'}
//                       </p>
//                       <p className="text-sm text-gray-500">Date: {formatDate(notification.createdAt)}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;



// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card"
// import { Badge } from "../Components/ui/badge"
// import { Button } from "../Components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { Bell, CheckCircle, XCircle, Clock, Calendar, FileText, TrendingUp } from "lucide-react"
// import axios from "axios"
// import Sidebar2 from "@/Components/Common/Sidebar"

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
//   })
//   const [filter, setFilter] = useState<"all" | "accepted" | "rejected" | "pending">("all")
//   const [loading, setLoading] = useState(false)
//   const [username,setUsername]=useState<String>("")

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

//         const [notificationsResponse, statsResponse,profileResponse] = await Promise.all([
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
//     <div className="min-h-screen relative overflow-hidden">
//         <Sidebar2/>
//       <ToastContainer position="top-right" autoClose={3000} />
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
//         <div className="text-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
//             {username || "Your Profile"}
//           </h1>
//           <p className="text-slate-600 text-lg">Track your posts and notifications</p>
//         </div>

//         <Tabs defaultValue="notifications" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
//             <TabsTrigger value="notifications" className="flex items-center gap-2">
//               <Bell className="w-4 h-4" />
//               Notifications
//             </TabsTrigger>
//             <TabsTrigger value="stats" className="flex items-center gap-2">
//               <TrendingUp className="w-4 h-4" />
//               Statistics
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="notifications" className="space-y-6">
//             <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//               <CardContent className="p-4">
//                 <div className="flex flex-wrap gap-2">
//                   <Button
//                     variant={filter === "all" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setFilter("all")}
//                     className={filter === "all" ? "bg-slate-800 hover:bg-slate-900" : ""}
//                   >
//                     All ({notifications.length})
//                   </Button>
//                   <Button
//                     variant={filter === "accepted" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setFilter("accepted")}
//                     className={filter === "accepted" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
//                   >
//                     <CheckCircle className="w-3 h-3 mr-1" />
//                     Accepted ({notifications.filter((n) => n.status === "accepted").length})
//                   </Button>
//                   <Button
//                     variant={filter === "rejected" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setFilter("rejected")}
//                     className={filter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
//                   >
//                     <XCircle className="w-3 h-3 mr-1" />
//                     Rejected ({notifications.filter((n) => n.status === "rejected").length})
//                   </Button>
//                   <Button
//                     variant={filter === "pending" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setFilter("pending")}
//                     className={filter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
//                   >
//                     <Clock className="w-3 h-3 mr-1" />
//                     Pending ({notifications.filter((n) => n.status === "pending").length})
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="space-y-4">
//               {loading ? (
//                 <div className="text-center py-12 text-slate-600">Loading...</div>
//               ) : filteredNotifications.length > 0 ? (
//                 filteredNotifications.map((notification) => (
//                   <Card
//                     key={notification._id}
//                     className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300"
//                   >
//                     <CardContent className="p-6">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-shrink-0 mt-1">{getStatusIcon(notification.status)}</div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between mb-2">
//                             <p className="text-slate-800 font-medium">{notification.message}</p>
//                             {getStatusBadge(notification.status)}
//                           </div>
//                           {notification.comment && (
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
//                               <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
//                               <p className="text-red-700 text-sm">{notification.comment}</p>
//                             </div>
//                           )}
//                           <div className="flex items-center gap-4 text-sm text-slate-500">
//                             <div className="flex items-center gap-1">
//                               <FileText className="w-3 h-3" />
//                               <span className="truncate">{notification.postId?.title || "Post deleted"}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Calendar className="w-3 h-3" />
//                               <span>{formatDate(notification.createdAt)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-slate-600 mb-2">No notifications found</h3>
//                   <p className="text-slate-500">
//                     {filter !== "all" ? `No ${filter} notifications` : "You're all caught up!"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="stats" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
//                       <FileText className="w-5 h-5 text-slate-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-slate-800">{userStats.totalPosts}</p>
//                       <p className="text-sm text-slate-600">Total Posts</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
//                       <CheckCircle className="w-5 h-5 text-emerald-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-slate-800">{userStats.acceptedPosts}</p>
//                       <p className="text-sm text-slate-600">Accepted</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                       <XCircle className="w-5 h-5 text-red-500" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-slate-800">{userStats.rejectedPosts}</p>
//                       <p className="text-sm text-slate-600">Rejected</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                       <Clock className="w-5 h-5 text-yellow-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-slate-800">{userStats.pendingPosts}</p>
//                       <p className="text-sm text-slate-600">Pending</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardHeader>
//                   <CardTitle className="text-lg text-slate-800">Engagement</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-600">Total Upvotes</span>
//                       <span className="font-semibold text-slate-800">{userStats.totalUpvotes}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-600">Total Comments</span>
//                       <span className="font-semibold text-slate-800">{userStats.totalComments}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
//                 <CardHeader>
//                   <CardTitle className="text-lg text-slate-800">Success Rate</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-slate-600">Acceptance Rate</span>
//                       <span className="font-semibold text-emerald-600">
//                         {userStats.totalPosts > 0
//                           ? Math.round((userStats.acceptedPosts / userStats.totalPosts) * 100)
//                           : 0}
//                         %
//                       </span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-2">
//                       <div
//                         className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
//                         style={{
//                           width: `${
//                             userStats.totalPosts > 0
//                               ? (userStats.acceptedPosts / userStats.totalPosts) * 100
//                               : 0
//                           }%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }




import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card"
import { Badge } from "../Components/ui/badge"
import { Button } from "../Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Bell, CheckCircle, XCircle, Clock, Calendar, FileText, TrendingUp } from "lucide-react"
import axios from "axios"
import Sidebar2 from "@/Components/Common/Sidebar"

const API_BASE_URL = "http://localhost:5000/api"

interface Notification {
  _id: string
  message: string
  status: "accepted" | "rejected" | "pending" | string
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
}

export default function UserProfilePage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalPosts: 0,
    acceptedPosts: 0,
    rejectedPosts: 0,
    pendingPosts: 0,
    totalUpvotes: 0,
    totalComments: 0,
  })
  const [filter, setFilter] = useState<"all" | "accepted" | "rejected" | "pending">("all")
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<String>("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please log in to view your profile.", {
            position: "top-right",
            style: { background: "#fee2e2", color: "#dc2626" },
          })
          setLoading(false)
          return
        }

        const [notificationsResponse, statsResponse, profileResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/user/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        setNotifications(notificationsResponse.data)
        setUserStats(statsResponse.data)
        setUsername(profileResponse.data.username)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load profile data. Please try again.", {
          position: "top-right",
          style: { background: "#fee2e2", color: "#dc2626" },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    return notification.status === filter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar2 />
      <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-32">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              {username || "Your Profile"}
            </h1>
            <p className="text-slate-600 text-lg">Track your posts and notifications</p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                      className={filter === "all" ? "bg-slate-800 hover:bg-slate-900" : ""}
                    >
                      All ({notifications.length})
                    </Button>
                    <Button
                      variant={filter === "accepted" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("accepted")}
                      className={filter === "accepted" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accepted ({notifications.filter((n) => n.status === "accepted").length})
                    </Button>
                    <Button
                      variant={filter === "rejected" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("rejected")}
                      className={filter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Rejected ({notifications.filter((n) => n.status === "rejected").length})
                    </Button>
                    <Button
                      variant={filter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("pending")}
                      className={filter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending ({notifications.filter((n) => n.status === "pending").length})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-slate-600">Loading...</div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <Card
                      key={notification._id}
                      className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getStatusIcon(notification.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-slate-800 font-medium">{notification.message}</p>
                              {getStatusBadge(notification.status)}
                            </div>
                            {notification.comment && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                                <p className="text-red-700 text-sm">{notification.comment}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="truncate">{notification.postId?.title || "Post deleted"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(notification.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No notifications found</h3>
                    <p className="text-slate-500">
                      {filter !== "all" ? `No ${filter} notifications` : "You're all caught up!"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{userStats.totalPosts}</p>
                        <p className="text-sm text-slate-600">Total Posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{userStats.acceptedPosts}</p>
                        <p className="text-sm text-slate-600">Accepted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{userStats.rejectedPosts}</p>
                        <p className="text-sm text-slate-600">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{userStats.pendingPosts}</p>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Upvotes</span>
                        <span className="font-semibold text-slate-800">{userStats.totalUpvotes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Comments</span>
                        <span className="font-semibold text-slate-800">{userStats.totalComments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Acceptance Rate</span>
                        <span className="font-semibold text-emerald-600">
                          {userStats.totalPosts > 0
                            ? Math.round((userStats.acceptedPosts / userStats.totalPosts) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              userStats.totalPosts > 0
                                ? (userStats.acceptedPosts / userStats.totalPosts) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}