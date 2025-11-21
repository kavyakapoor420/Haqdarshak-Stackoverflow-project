

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Trophy, Medal, Award, User, TrendingUp, Star, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"
// const API_BASE_URL = "https://haqdarshak-stackoverflow-project.onrender.com/api/"

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  acceptedPosts: number
}

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("Please log in to view the leaderboard.", {
          position: "top-right",
          style: { background: "#fee2e2", color: "#dc2626" },
        })
        return
      }
      const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = response.data
      setLeaderboard(data)
      setTotalItems(data.length)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load leaderboard. Please try again.", {
        position: "top-right",
        style: { background: "#fee2e2", color: "#dc2626" },
      })
      console.error("Leaderboard fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = leaderboard.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById("leaderboard-table")?.scrollIntoView({ behavior: "smooth" })
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-slate-600 font-semibold text-sm">{rank}</span>
    }
  }

  const getRankBadge = (badge: string | null) => {
    switch (badge) {
      case "gold":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Gold</Badge>
      case "silver":
        return <Badge className="bg-yellow-100 text-amber-800 border-amber-200">Bronze</Badge>
      case "bronze":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Bronze</Badge>
      default:
        return null
    }
  }

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-green-50/80 to-green-50/80 border-yellow-200/50"
      case 2:
        return "bg-gradient-to-r from-amber-50/80 to-slate-50/80 border-gray-200/50"
      case 3:
        return "bg-gradient-to-r from-yellow-10/80 to-orange-50/80 border-amber-200/50"
      default:
        return "bg-white/80 border-slate-200/50"
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-16 ">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 ">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-slate-600 text-lg">Top performing agents of our Haqdarshak community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalItems}</p>
                  <p className="text-sm text-slate-600">Active Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                 <p className="text-2xl font-bold text-slate-800">
                   {leaderboard.reduce((sum, user) => sum + (Number(user.acceptedPosts) || 0), 0)}
                 </p>
                  <p className="text-sm text-slate-600">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  {/* <p className="text-2xl font-bold text-slate-800">
                    {leaderboard.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
                  </p> */}

                  <p className="text-2xl font-bold text-slate-800">
                  {leaderboard.reduce((sum, user) => sum + (Number(user.points) || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 overflow-hidden" id="leaderboard-table">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-slate-800">Community Rankings</CardTitle>
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} agents
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/30">
                    <th className="text-left p-4 font-semibold text-slate-700">Rank</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Username</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Accepted Posts</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-600">Loading...</td>
                    </tr>
                  ) : currentData.map((user, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 ${getRowStyle(user.rank)}`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center">{getRankIcon(user.rank)}</div>
                          {getRankBadge(null)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{user.username}</p>
                            <p className="text-xs text-slate-500">Agent #{(startIndex + index + 1).toString().padStart(4, "0")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-slate-800">{user.acceptedPosts}</span>
                          <span className="text-sm text-slate-500">posts</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-600">{(user.points || 0).toLocaleString()}</span>
                          <span className="text-sm text-slate-500">points</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getVisiblePages().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-slate-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center mt-3 text-sm text-slate-600">
                  Page {currentPage} of {totalPages} • {totalItems} total agents
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-8">
              <Trophy className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Want to climb the ranks?</h3>
              <p className="text-slate-600 mb-6">
                Post quality content, help fellow agents, and engage with the community to earn points and climb the
                leaderboard!
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                Start Contributing
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}