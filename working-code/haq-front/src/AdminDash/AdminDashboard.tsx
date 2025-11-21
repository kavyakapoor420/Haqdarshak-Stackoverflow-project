
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { format } from "date-fns"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Calendar as CalendarIcon,
  Check,
  X,
  User,
  Clock,
  Eye,
  ChevronDown,
  Menu,
} from "lucide-react"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"
//  const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api'

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Posts", count: 0 },
  { icon: Users, label: "Users", count: 0 },
  { icon: Bell, label: "Notifications", count: 0 },
  { icon: Settings, label: "Settings" },
]

type Post = {
  _id: string
  title: string
  description: string
  status: string
  createdAt: string
  userId: {
    username: string
    [key: string]: any
  }
  [key: string]: any
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [rejectionComments, setRejectionComments] = useState<{ [key: string]: string }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/posts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setPosts(response.data)
        const postsSidebarItem = sidebarItems.find((item) => item.label === "Posts")
        if (postsSidebarItem) {
          postsSidebarItem.count = response.data.length
        }
      } catch (error) {
        toast.error((error as any).response?.data?.message || "Failed to load posts. Please try again.", {
          position: "top-right",
          style: { background: "#fee2e2", color: "#dc2626" },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleReview = async (postId: string, status: string) => {
    try {
      if (status === "rejected" && !rejectionComments[postId]?.trim()) {
        toast.error("Please provide a reason for rejection.", {
          position: "top-right",
          style: { background: "#fee2e2", color: "#dc2626" },
        })
        return
      }
      setLoading(true)
      await axios.put(
        `${API_BASE_URL}/admin/posts/${postId}`,
        { status, rejectionComment: status === "rejected" ? rejectionComments[postId] || "" : "" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      setPosts(posts.filter((post) => post._id !== postId))
      setRejectionComments((prev) => {
        const newComments = { ...prev }
        delete newComments[postId]
        return newComments
      })
      toast.success(`Post ${status} successfully`, {
        position: "top-right",
        style: { background: "#dcfce7", color: "#15803d" },
      })
    } catch (error) {
      toast.error((error as any).response?.data?.message || "Failed to review post", {
        position: "top-right",
        style: { background: "#fee2e2", color: "#dc2626" },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCommentChange = (postId: string, value: string) => {
    setRejectionComments((prev) => ({
      ...prev,
      [postId]: value,
    }))
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userId.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = dateFilter
      ? format(new Date(post.createdAt), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")
      : true
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesDate && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-0left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white h-16 flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-lg">Admin Panel</span>
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed top bottom-0 left-0 right-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-18 left-0 bottom-0 w-64 bg-black text-white border-r-4 border-orange-400
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-200 ease-in-out z-40
          md:z-10 md:border-t-0 flex flex-col`}
      >
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-red-600 text-xl">Admin Panel</h2>
              <p className="text-xs text-white">Content Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start text-white ${
                    item.active
                      ? "bg-slate-800 hover:bg-slate-900"
                      : "hover:bg-slate-100 hover:text-slate-800"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="ml-3">{item.label}</span>
                  {(item.count ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-auto bg-slate-700 text-white">
                      {item.count ?? 0}
                    </Badge>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
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
        </div>

        <div className="relative z-10 p-6">
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Posts Review Dashboard</h1>
                <p className="text-slate-600">Manage and review pending posts</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {filteredPosts.length} Pending
                </Badge>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, users, or content..."
                  className="pl-10 bg-white/90 border-slate-200 focus:border-slate-400"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white/90 border-slate-200">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFilter} onSelect={(date) => setDateFilter(date)} initialFocus />
                  <div className="p-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)} className="w-full">
                      Clear filter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/90 border-slate-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12 text-slate-600">Loading...</div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-slate-800 mb-2">{post.title}</CardTitle>
                          <p className="text-slate-600 line-clamp-3">{post.description}</p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.userId.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Textarea
                          value={rejectionComments[post._id] || ""}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                          placeholder="Add a reason for rejection (optional for acceptance, required for rejection)"
                          className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
                        />
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleReview(post._id, "accepted")}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept Post
                          </Button>
                          <Button
                            onClick={() => handleReview(post._id, "rejected")}
                            disabled={loading || !rejectionComments[post._id]?.trim()}
                            variant="destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject Post
                          </Button>
                          <Button variant="outline" className="ml-auto bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No posts found</h3>
                  <p className="text-slate-500">
                    {searchQuery || dateFilter || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "All posts have been reviewed"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}