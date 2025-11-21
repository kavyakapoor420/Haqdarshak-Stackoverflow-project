
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