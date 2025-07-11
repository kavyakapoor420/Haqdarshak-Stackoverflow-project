"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card"
import { Button } from "../Components/ui/button"
import { Input } from "../Components/ui/input"
import { Textarea } from "../Components/ui/textarea"
import { Badge } from "../Components/ui/badge"
import { Gift, Star, MapPin, Mail, User, MessageSquare, Check, Lock } from "lucide-react"
import HaqImage from '../assets/HaqImage.png'

const rewardsData = [
  {
    id: 1,
    name: "Haqdarshak Pen",
    description: "Premium branded pen with Haqdarshak logo",
    points: 10,
    image: HaqImage,
    available: true,
    category: "Stationery",
  },
  {
    id: 2,
    name: "Haqdarshak Premium T-Shirt",
    description: "Comfortable cotton t-shirt with exclusive Haqdarshak design",
    points: 20,
    image: HaqImage,
    available: true,
    category: "Apparel",
  },
  {
    id: 3,
    name: " Bag & Kit with premimum course and  mentorship ",
    description: "Premium bag with complete stationery kit and branded accessories",
    points: 30,
    image: HaqImage,
    available: true,
    category: "Premium",
  },
]

export default function RewardsRedeemSection() {
  const [userPoints] = useState(25) // Mock user points - replace with actual user data
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    feedback: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRedemption = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)
    setSelectedReward(null)
    setFormData({
      username: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      feedback: "",
    })

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const canRedeem = (points: number) => userPoints >= points

  return (
    <div className="min-h-screen relative overflow-hidden py-16">
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

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Rewards Store
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Redeem your contribution points for exclusive Haqdarshak goodies
          </p>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">{userPoints}</span>
            <span className="text-slate-600">points available</span>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 max-w-md mx-auto">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-green-800">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Redemption successful! Your reward will be delivered soon.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {rewardsData.map((reward) => {
            const canRedeemItem = canRedeem(reward.points)

            return (
              <Card
                key={reward.id}
                className={`bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 ${
                  !canRedeemItem ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="relative">
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      className="w-full h-48 object-cover rounded-lg bg-slate-100"
                    />
                    {!canRedeemItem && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800 border-orange-200">
                      {reward.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{reward.name}</h3>
                  <p className="text-slate-600 mb-4 text-sm">{reward.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-600">{reward.points} points</span>
                    </div>
                    {canRedeemItem ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">Locked</Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => setSelectedReward(reward.id)}
                    disabled={!canRedeemItem}
                    className={`w-full ${
                      canRedeemItem
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {canRedeemItem ? "Redeem Now" : `Need ${reward.points - userPoints} more points`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Redemption Form Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Complete Your Redemption</CardTitle>
                <p className="text-slate-600">Redeeming: {rewardsData.find((r) => r.id === selectedReward)?.name}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRedemption} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Username *
                      </label>
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="bg-white/90 border-slate-200 focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="bg-white/90 border-slate-200 focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Delivery Address *
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your complete address"
                      required
                      className="bg-white/90 border-slate-200 focus:border-orange-400 min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                        required
                        className="bg-white/90 border-slate-200 focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                      <Input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                        required
                        className="bg-white/90 border-slate-200 focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Pincode *</label>
                      <Input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="Pincode"
                        required
                        className="bg-white/90 border-slate-200 focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Feedback (Optional)
                    </label>
                    <Textarea
                      value={formData.feedback}
                      onChange={(e) => handleInputChange("feedback", e.target.value)}
                      placeholder="Any feedback or special instructions..."
                      className="bg-white/90 border-slate-200 focus:border-orange-400 min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setSelectedReward(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Redemption"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How to Earn Points */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <Gift className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-4">How to Earn More Points?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">+3</span>
                </div>
                <p className="text-slate-600">Post approved by admin</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">+1</span>
                </div>
                <p className="text-slate-600">Post new Question with all required details </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">+0.5</span>
                </div>
                <p className="text-slate-600">Help other agents with comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
