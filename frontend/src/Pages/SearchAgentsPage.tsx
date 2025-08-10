"use client"

import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Search, User, MapPin, Star, Filter } from "lucide-react"
import Sidebar2 from "@/components/Common/Sidebar"

// Mock agents data - replace with your actual API data
const agentsData = [
  {
    id: 1,
    username: "KavyaKapoor",
    location: "Mumbai, India",
    reputation: 555,
    posts: 45,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-01-15",
    isNewUser: false,
  },
  {
    id: 2,
    username: "KavyaKapoor",
    location: "Delhi, India",
    reputation: 420,
    posts: 38,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-02-20",
    isNewUser: false,
  },
  {
    id: 3,
    username: "KavyaKapoor",
    location: "Bangalore, India",
    reputation: 380,
    posts: 32,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-03-10",
    isNewUser: false,
  },
  {
    id: 4,
    username: "KavyaKapoor",
    location: "Chennai, India",
    reputation: 290,
    posts: 28,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-04-05",
    isNewUser: false,
  },
  {
    id: 5,
    username: "KavyaKapoor",
    location: "Pune, India",
    reputation: 250,
    posts: 24,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-05-12",
    isNewUser: false,
  },
  {
    id: 6,
    username: "KavyaKapoor",
    location: "Hyderabad, India",
    reputation: 220,
    posts: 21,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-06-18",
    isNewUser: false,
  },
  {
    id: 7,
    username: "KavyaKapoor",
    location: "Kolkata, India",
    reputation: 180,
    posts: 18,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-07-22",
    isNewUser: false,
  },
  {
    id: 8,
    username: "KavyaKapoor",
    location: "Ahmedabad, India",
    reputation: 150,
    posts: 15,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2023-08-30",
    isNewUser: false,
  },
  {
    id: 9,
    username: "KavyaKapoor",
    location: "Jaipur, India",
    reputation: 120,
    posts: 12,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2024-01-10",
    isNewUser: true,
  },
  {
    id: 10,
    username: "KavyaKapoor",
    location: "Lucknow, India",
    reputation: 80,
    posts: 9,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2024-01-20",
    isNewUser: true,
  },
  {
    id: 11,
    username: "KavyaKapoor",
    location: "Indore, India",
    reputation: 60,
    posts: 6,
    avatar: "/placeholder.svg?height=60&width=60",

    joinedDate: "2024-02-01",
    isNewUser: true,
  },
  {
    id: 12,
    username: "KavyaKapoor",
    location: "Bhopal, India",
    reputation: 40,
    posts: 4,
    avatar: "/placeholder.svg?height=60&width=60",
    joinedDate: "2024-02-15",
    isNewUser: true,
  },
]

const filterOptions = [
  { id: "all", label: "All Agents", count: agentsData.length },
  { id: "reputation", label: "High Reputation", count: agentsData.filter((a) => a.reputation > 200).length },
  { id: "new", label: "New Agents", count: agentsData.filter((a) => a.isNewUser).length },
  { id: "active", label: "Active Contributors", count: agentsData.filter((a) => a.posts > 20).length },
]

export default function SearchAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("reputation")

  const filteredAndSortedAgents = agentsData
    .filter((agent) => {
      const matchesSearch = agent.username.toLowerCase().includes(searchQuery.toLowerCase())

      switch (activeFilter) {
        case "reputation":
          return matchesSearch && agent.reputation > 200
        case "new":
          return matchesSearch && agent.isNewUser
        case "active":
          return matchesSearch && agent.posts > 20
        default:
          return matchesSearch
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "reputation":
          return b.reputation - a.reputation
        case "posts":
          return b.posts - a.posts
        case "newest":
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        default:
          return b.reputation - a.reputation
      }
    })

  const getReputationColor = (reputation: number) => {
    if (reputation >= 400) return "text-green-600 bg-green-100 border-green-200"
    if (reputation >= 200) return "text-blue-600 bg-blue-100 border-blue-200"
    if (reputation >= 100) return "text-orange-600 bg-orange-100 border-orange-200"
    return "text-gray-600 bg-gray-100 border-gray-200"
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
        {/* <Sidebar2/> */}
      {/* Background Pattern */}
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

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Agents 
          </h1>
          <p className="text-slate-600 text-lg">Discover and connect with fellow agents in our community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by username..."
              className="pl-10 bg-white/90 backdrop-blur-sm border-slate-200 focus:border-orange-400 rounded-xl"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                className={`${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    : "bg-white/90 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white/90 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="reputation">Reputation</option>
              <option value="posts">Number of Posts</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedAgents.map((agent, index) => (
            <Card
              key={agent.id}
              className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <User className="w-8 h-8 text-slate-600" />
                  </div>

                  {/* Username */}
                  <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                    {agent.username}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{agent.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getReputationColor(agent.reputation).split(" ")[0]}`}>
                        {agent.reputation}
                      </div>
                      <div className="text-xs text-slate-500">Reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">{agent.posts}</div>
                      <div className="text-xs text-slate-500">Posts</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.isNewUser && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">New</Badge>
                    )}
                    <Badge className={`text-xs ${getReputationColor(agent.reputation)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {agent.reputation >= 400 ? "Expert" : agent.reputation >= 200 ? "Advanced" : "Beginner"}
                    </Badge>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedAgents.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No agents found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold text-slate-800">{agentsData.length}</div>
                  <div className="text-sm text-slate-600">Total Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {agentsData.filter((a) => a.reputation > 200).length}
                  </div>
                  <div className="text-sm text-slate-600">Expert Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {agentsData.filter((a) => a.isNewUser).length}
                  </div>
                  <div className="text-sm text-slate-600">New This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {agentsData.reduce((sum, agent) => sum + agent.posts, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Contributions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
