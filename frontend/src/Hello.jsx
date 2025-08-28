

// "use client"


// import { Button } from './components/ui/button'

// import React, { useEffect, useRef } from 'react';
// import { motion, useAnimation, useInView } from 'framer-motion';
// import { ShoppingCart, Edit3, Network, BarChart3 } from 'lucide-react';

// const Hello = () => {
//   const containerRef = useRef(null);
//   const isInView = useInView(containerRef, { once: true, amount: 0.3 });
//   const controls = useAnimation();

//   useEffect(() => {
//     if (isInView) {
//       controls.start("visible");
//     }
//   }, [isInView, controls]);

//   const cards = [
//     {
//       icon: <ShoppingCart className="w-8 h-8 text-blue-400" />,
//       title: "Checkout",
//       description: "Juspay powers leading enterprises & banks around the world with no-code global coverage, payment orchestration, fraud reduction, and seamless customer experiences."
//     },
//     {
//       icon: <Edit3 className="w-8 h-8 text-blue-400" />,
//       title: "Design Studio",
//       description: "Design branded native experiences for Android, iOS, and Web tailored to your brand's aesthetic."
//     },
//     {
//       icon: <Network className="w-8 h-8 text-blue-400" />,
//       title: "Orchestration",
//       description: "Enterprise grade orchestration that routes your payments to the best performing payment gateway."
//     },
//     {
//       icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
//       title: "Analytics",
//       description: "Unlock true power of your payments data with actionable insights to drive smarter decisions."
//     }
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.1
//       }
//     }
//   };

//   const cardVariants = {
//     hidden: { 
//       opacity: 0, 
//       y: 60,
//       scale: 0.9
//     },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 12,
//         duration: 0.6
//       }
//     }
//   };

//   const headerVariants = {
//     hidden: { opacity: 0, y: -30 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 120,
//         damping: 10
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
//       {/* Background geometric patterns */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-20 w-32 h-32 border border-gray-600 rounded-lg transform rotate-12"></div>
//         <div className="absolute top-40 right-32 w-24 h-24 border border-gray-600 rounded-full"></div>
//         <div className="absolute bottom-40 left-32 w-28 h-28 border border-gray-600 transform rotate-45"></div>
//         <div className="absolute bottom-20 right-20 w-36 h-36 border border-gray-600 rounded-lg transform -rotate-6"></div>
//       </div>

//       <div ref={containerRef} className="relative z-10 container mx-auto px-6 py-20">
//         <motion.div 
//           className="text-center mb-16"
//           variants={containerVariants}
//           initial="hidden"
//           animate={controls}
//         >
//           <motion.div variants={headerVariants}>
//             <div className="inline-block bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-2 mb-8">
//               <span className="text-gray-300 text-sm font-medium tracking-wider uppercase">
//                 Full Stack Solution
//               </span>
//             </div>
//           </motion.div>

//           <motion.h1 
//             className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
//             variants={headerVariants}
//           >
//             Juspay HyperCheckout
//           </motion.h1>

//           <motion.p 
//             className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
//             variants={headerVariants}
//           >
//             HyperCheckout combines the power of native checkout experiences, robust payment
//             <br />orchestration & advanced analytics.
//           </motion.p>

//           <motion.button 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
//             variants={headerVariants}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Learn More
//           </motion.button>
//         </motion.div>

//         {/* Cards Section */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
//           variants={containerVariants}
//           initial="hidden"
//           animate={controls}
//         >
//           {cards.map((card, index) => (
//             <motion.div
//               key={index}
//               className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-blue-500/10 group"
//               variants={cardVariants}
//               whileHover={{ 
//                 y: -5,
//                 transition: { type: "spring", stiffness: 300, damping: 10 }
//               }}
//             >
//               <div className="mb-6 group-hover:scale-110 transition-transform duration-200">
//                 {card.icon}
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-200">
//                 {card.title}
//               </h3>
//               <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
//                 {card.description}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Additional background effects */}
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
//     </div>
//   );
// };

// export default Hello ;



"use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
// import { Button } from './components/ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from'./components/ui/select'
// import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
// import { Eye, MessageSquare, Star, Trophy, ChevronRight } from "lucide-react"

// const recentPosts = [
//   { title: "Find if Path Exists in Graph", timeAgo: "2 days ago" },
//   { title: "Rotting Oranges", timeAgo: "4 days ago" },
//   { title: "Minimum Sensors to Cover Grid", timeAgo: "8 days ago" },
//   { title: "Number of Perfect Pairs", timeAgo: "8 days ago" },
//   { title: "Validate Binary Search Tree", timeAgo: "24 days ago" },
//   { title: "Count Islands With Total Value Divisible by K", timeAgo: "a month ago" },
//   { title: "Split Array by Prime Indices", timeAgo: "a month ago" },
// ]

// const calendarData = Array.from({ length: 365 }, (_, i) => ({
//   date: new Date(2025, 0, i + 1),
//   count: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
// }))

// export default function Hello() {
//   const [selectedYear, setSelectedYear] = useState("2025")

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Left Sidebar */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* User Profile Card */}
//           <Card className="bg-gray-800 border-gray-700">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4 mb-4">
//                 <Avatar className="w-16 h-16">
//                   <AvatarImage src="/user-profile-illustration.png" />
//                   <AvatarFallback className="bg-gray-600">KK</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className="text-xl font-semibold text-white">kavyakapoor</h2>
//                   <p className="text-gray-400">kavyakapoor</p>
//                 </div>
//               </div>
//               <p className="text-gray-300 mb-4">Rank 643,406</p>
//               <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Edit Profile</Button>
//             </CardContent>
//           </Card>

//           {/* Community Stats */}
//           <Card className="bg-gray-800 border-gray-700">
//             <CardHeader>
//               <CardTitle className="text-white">Community Stats</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Eye className="w-4 h-4 text-blue-400" />
//                   <span className="text-gray-300">Views</span>
//                   <span className="text-white font-semibold">0</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-sm ml-6">Last week 0</p>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
//                   <span className="text-gray-300">Posts</span>
//                   <span className="text-white font-semibold">0</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-sm ml-6">Last week 0</p>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <MessageSquare className="w-4 h-4 text-teal-400" />
//                   <span className="text-gray-300">Discuss</span>
//                   <span className="text-white font-semibold">0</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-sm ml-6">Last week 0</p>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Star className="w-4 h-4 text-yellow-400" />
//                   <span className="text-gray-300">Reputation</span>
//                   <span className="text-white font-semibold">0</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-sm ml-6">Last week 0</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-3 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Posts Statistics with Pie Chart */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   {/* Circular Progress Chart */}
//                   <div className="relative">
//                     <div className="relative w-40 h-40">
//                       <svg className="w-40 h-40 transform -rotate-90">
//                         {/* Background circle */}
//                         <circle cx="80" cy="80" r="70" stroke="#374151" strokeWidth="12" fill="none" />
//                         {/* Accepted progress */}
//                         <circle
//                           cx="80"
//                           cy="80"
//                           r="70"
//                           stroke="#10b981"
//                           strokeWidth="8"
//                           fill="none"
//                           strokeDasharray={`${(202 / 3661) * 439.82} 439.82`}
//                           strokeLinecap="round"
//                           className="opacity-80"
//                         />
//                         {/* Attempting progress */}
//                         <circle
//                           cx="80"
//                           cy="80"
//                           r="70"
//                           stroke="#06b6d4"
//                           strokeWidth="4"
//                           fill="none"
//                           strokeDasharray={`${(7 / 3661) * 439.82} 439.82`}
//                           strokeDashoffset={`-${(202 / 3661) * 439.82}`}
//                           strokeLinecap="round"
//                           className="opacity-60"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <span className="text-3xl font-bold text-white">202</span>
//                         <span className="text-sm text-gray-400">/3661</span>
//                         <span className="text-sm text-green-400">✓ Solved</span>
//                         <span className="text-xs text-cyan-400 mt-1">7 Attempting</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Stats on the right */}
//                   <div className="space-y-6">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-green-400 mb-1">97</div>
//                       <div className="text-sm text-gray-400">Accepted</div>
//                       <div className="text-xs text-gray-500">97/891</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-red-400 mb-1">95</div>
//                       <div className="text-sm text-gray-400">Rejected</div>
//                       <div className="text-xs text-gray-500">95/1907</div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Badges Section */}
//             <Card className="bg-gray-800 border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-semibold text-white">Badges</h3>
//                   <ChevronRight className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <div className="flex items-center space-x-6">
//                   <div className="text-center">
//                     <div className="text-4xl font-bold text-white mb-4">1</div>
//                     <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
//                       <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
//                         <Trophy className="w-10 h-10 text-green-400" />
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-gray-400 text-sm mb-1">Most Recent Badge</p>
//                     <p className="text-white font-semibold text-lg">50 Days Badge 2024</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity Calendar */}
//           <Card className="bg-gray-800 border-gray-700">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-4">
//                   <span className="text-white font-semibold text-lg">119</span>
//                   <span className="text-gray-400">submissions in the past one year</span>
//                 </div>
//                 <div className="flex items-center space-x-6">
//                   <span className="text-gray-400">
//                     Total active days: <span className="text-white font-semibold">40</span>
//                   </span>
//                   <span className="text-gray-400">
//                     Max streak: <span className="text-white font-semibold">3</span>
//                   </span>
//                   <Select value={selectedYear} onValueChange={setSelectedYear}>
//                     <SelectTrigger className="w-28 bg-gray-700 border-gray-600 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-700 border-gray-600">
//                       <SelectItem value="2025">2025</SelectItem>
//                       <SelectItem value="2024">2024</SelectItem>
//                       <SelectItem value="2023">2023</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="grid grid-cols-13 gap-1 text-xs text-gray-400 mb-3">
//                   {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
//                     (month, i) => (
//                       <div key={i} className="text-center">
//                         {month}
//                       </div>
//                     ),
//                   )}
//                 </div>
//                 <div className="grid grid-cols-53 gap-1">
//                   {calendarData.map((day, i) => (
//                     <div
//                       key={i}
//                       className={`w-3 h-3 rounded-sm transition-colors hover:ring-1 hover:ring-gray-400 ${
//                         day.count === 0
//                           ? "bg-gray-700"
//                           : day.count === 1
//                             ? "bg-green-900"
//                             : day.count === 2
//                               ? "bg-green-700"
//                               : day.count === 3
//                                 ? "bg-green-500"
//                                 : "bg-green-400"
//                       }`}
//                       title={`${day.count} submissions on ${day.date.toDateString()}`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Posts */}
//           <Card className="bg-gray-800 border-gray-700">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex space-x-4">
//                   <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
//                     Recent AC
//                   </Button>
//                   <Button variant="ghost" className="text-gray-400 hover:text-white">
//                     List
//                   </Button>
//                   <Button variant="ghost" className="text-gray-400 hover:text-white">
//                     Solutions
//                   </Button>
//                   <Button variant="ghost" className="text-gray-400 hover:text-white">
//                     Discuss
//                   </Button>
//                 </div>
//                 <Button variant="ghost" className="text-gray-400 hover:text-white">
//                   View all submissions <ChevronRight className="w-4 h-4 ml-1" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 {recentPosts.map((post, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 rounded px-2 transition-colors"
//                   >
//                     <h4 className="text-white font-medium hover:text-blue-400 cursor-pointer">{post.title}</h4>
//                     <span className="text-gray-400 text-sm">{post.timeAgo}</span>
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


// import React, { useState } from 'react';

// // Assuming you have the shadcn/ui components installed and configured.
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";

// // Main component containing all the dashboard sections
// const UserProfileDashboard = () => {
//   const [selectedYear, setSelectedYear] = useState('2025');

//   // Dummy data for the calendar grid
//   const submissionData = Array(365).fill(0).map(() => Math.floor(Math.random() * 5));
  
//   // Dummy data for recent posts
//   const recentPosts = [
//     { title: 'Find if Path Exists in Graph', daysAgo: 2 },
//     { title: 'Rotting Oranges', daysAgo: 4 },
//     { title: 'Minimum Sensors to Cover Grid', daysAgo: 8 },
//     { title: 'Number of perfect pairs', daysAgo: 8 },
//     { title: 'Validate Binary Search Tree', daysAgo: 24 },
//     { title: 'Count Islands With Total Value Divisible by K', daysAgo: 30 },
//     { title: 'Split Array by Prime Indices', daysAgo: 30 },
//   ];

//   // Function to get a color for the calendar based on submission count
//   const getCalendarColor = (count) => {
//     if (count === 0) return 'bg-gray-800';
//     if (count < 2) return 'bg-[#4CAF50]';
//     if (count < 4) return 'bg-[#43A047]';
//     return 'bg-[#2E7D32]';
//   };

//   return (
//     <div className="min-h-screen bg-[#121212] p-8 text-[#E0E0E0] font-sans">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
//         {/* Left Sidebar */}
//         <div className="md:col-span-1 space-y-8">
          
//           {/* User Profile Card */}
//           <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] flex flex-col items-center space-y-4 shadow-lg">
//             <Avatar className="w-24 h-24 shadow-md">
//               <AvatarImage src="https://placehold.co/100x100" alt="user avatar" />
//               <AvatarFallback className="bg-[#2E7D32]">KV</AvatarFallback>
//             </Avatar>
//             <div className="text-center">
//               <h2 className="text-2xl font-bold">kavyakapoors</h2>
//               <p className="text-[#A0A0A0] text-sm mt-1">Rank 643,406</p>
//             </div>
//             <Button className="w-full bg-[#1E1E1E] border border-[#333333] hover:bg-[#2e2e2e] text-[#E0E0E0] font-semibold rounded-md shadow-md">
//               Edit Profile
//             </Button>
//           </Card>

//           {/* Community Stats */}
//           <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] space-y-4 shadow-lg">
//             <h3 className="text-lg font-bold">Community Stats</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-xl">📊</span>
//                 <div className="flex flex-col">
//                   <span className="font-bold">Views 0</span>
//                   <span className="text-[#A0A0A0] text-xs">Last week 0</span>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-xl">✅</span>
//                 <div className="flex flex-col">
//                   <span className="font-bold">Solution 0</span>
//                   <span className="text-[#A0A0A0] text-xs">Last week 0</span>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-xl">💬</span>
//                 <div className="flex flex-col">
//                   <span className="font-bold">Discuss 0</span>
//                   <span className="text-[#A0A0A0] text-xs">Last week 0</span>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-xl">⭐</span>
//                 <div className="flex flex-col">
//                   <span className="font-bold">Reputation 0</span>
//                   <span className="text-[#A0A0A0] text-xs">Last week 0</span>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Right Main Content */}
//         <div className="md:col-span-3 space-y-8">
          
//           {/* Top Stats Cards */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Contest Rating Card */}
//             <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] shadow-lg">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-bold">Contest Rating</h3>
//                 <p className="text-[#A0A0A0] text-sm">Global Ranking</p>
//               </div>
//               <p className="text-3xl font-bold">1,494</p>
//               <p className="text-[#A0A0A0] text-sm mt-1">339,561/742,807</p>
//               {/* This is a placeholder for the graph */}
//               <div className="h-24 bg-gray-900 rounded-md mt-4"></div>
//             </Card>

//             {/* Accepted/Rejected Stats Card */}
//             <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] flex flex-col items-center space-y-4 shadow-lg">
//               <div className="relative w-32 h-32 flex items-center justify-center">
//                 {/* Placeholder for the circular progress bar */}
//                 <svg className="w-full h-full" viewBox="0 0 100 100">
//                   <circle cx="50" cy="50" r="45" fill="none" className="stroke-current text-gray-700" strokeWidth="10" />
//                   <circle cx="50" cy="50" r="45" fill="none" className="stroke-current text-[#4CAF50]" strokeWidth="10" strokeDasharray="50 283" strokeLinecap="round" />
//                 </svg>
//                 <div className="absolute text-center">
//                   <div className="text-2xl font-bold">202/3661</div>
//                   <div className="text-sm text-[#A0A0A0]">7 Attempting</div>
//                 </div>
//               </div>
//               <div className="flex justify-around w-full mt-4">
//                 <Badge variant="secondary" className="bg-[#4CAF50] text-white">Accepted</Badge>
//                 <Badge variant="secondary" className="bg-[#8A2BE2] text-white">Rejected</Badge>
//               </div>
//             </Card>
            
//             {/* Badges Card */}
//             <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] space-y-4 shadow-lg">
//               <h3 className="text-lg font-bold">Top 46.23%</h3>
//               <div className="flex items-center space-x-2">
//                 <span className="text-3xl">🏅</span>
//                 <span className="text-2xl font-bold">1</span>
//               </div>
//               <p className="text-[#A0A0A0]">Most Recent Badge</p>
//               <Badge className="bg-[#2E7D32] text-white text-lg font-bold py-1 px-3">
//                 50 Days Badge 2024
//               </Badge>
//             </Card>
//           </div>

//           {/* Submission Calendar */}
//           <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl  text-white font-bold">119 submissions in the past one year</h3>
//               <div className="flex space-x-4 items-center">
//                 <p className="text-sm">Total active days: 40</p>
//                 <p className="text-sm">Max streak: 3</p>
//                 <Select value={selectedYear} onValueChange={setSelectedYear}>
//                   <SelectTrigger className="w-[120px] bg-[#2e2e2e] border-none text-[#E0E0E0]">
//                     <SelectValue placeholder="Year" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-[#2e2e2e] border-none text-[#E0E0E0]">
//                     <SelectItem value="2025">2025</SelectItem>
//                     <SelectItem value="2024">2024</SelectItem>
//                     <SelectItem value="2023">2023</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-53 gap-1 mt-4 overflow-x-auto">
//               {submissionData.map((count, index) => (
//                 <div key={index} className={`w-3 h-3 rounded-sm ${getCalendarColor(count)}`}></div>
//               ))}
//             </div>
//           </Card>

//           {/* Recent Posts List */}
//           <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#333333] shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Recent Posts</h3>
//               <a href="#" className="text-[#A0A0A0] text-sm hover:underline">View all posts &gt;</a>
//             </div>
//             <div className="space-y-2">
//               {recentPosts.map((post, index) => (
//                 <div key={index} className="bg-[#2e2e2e] p-4 rounded-md flex justify-between items-center hover:bg-[#3d3d3d] transition-colors duration-200">
//                   <span className="font-semibold">{post.title}</span>
//                   <span className="text-[#A0A0A0] text-sm">{post.daysAgo} day{post.daysAgo > 1 ? 's' : ''} ago</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileDashboard;
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, CheckCircle, MessageCircle, Star, TrendingUp, Trophy, Calendar, ArrowRight } from "lucide-react"

const Hello = () => {
  const [selectedYear, setSelectedYear] = useState("2025")

  const submissionData = Array(365)
    .fill(0)
    .map((_, index) => {
      // Create more realistic submission patterns with clusters
      const dayOfWeek = index % 7
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const baseChance = isWeekend ? 0.3 : 0.7
      return Math.random() < baseChance ? Math.floor(Math.random() * 4) + 1 : 0
    })

  const recentPosts = [
    { title: "Find if Path Exists in Graph", daysAgo: 2 },
    { title: "Rotting Oranges", daysAgo: 4 },
    { title: "Minimum Sensors to Cover Grid", daysAgo: 8 },
    { title: "Number of Perfect Pairs", daysAgo: 8 },
    { title: "Validate Binary Search Tree", daysAgo: 24 },
    { title: "Count Islands With Total Value Divisible by K", daysAgo: 30 },
    { title: "Split Array by Prime Indices", daysAgo: 30 },
  ]

  const getCalendarColor = (count) => {
    if (count === 0) return "bg-gray-800/50"
    if (count === 1) return "bg-emerald-900/60"
    if (count === 2) return "bg-emerald-700/70"
    if (count === 3) return "bg-emerald-600/80"
    return "bg-emerald-500"
  }

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] p-6 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <Avatar className="w-28 h-28 ring-4 ring-emerald-500/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=112&width=112" alt="user avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-xl font-bold">
                      KV
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#1E1E1E]"></div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    kavyakapoor
                  </h2>
                  <p className="text-gray-400 font-medium">Rank 643,406</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                  Edit Profile
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="text-white">Community Stats </span> 
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Eye, label: "Views", count: 0, lastWeek: 0, color: "text-blue-400" },
                  { icon: CheckCircle, label: "Solution", count: 0, lastWeek: 0, color: "text-emerald-400" },
                  { icon: MessageCircle, label: "Discuss", count: 0, lastWeek: 0, color: "text-purple-400" },
                  { icon: Star, label: "Reputation", count: 0, lastWeek: 0, color: "text-yellow-400" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div className="flex-1">
                      <div className="font-semibold ">
                        <span className="text-gray-400 mr-2">
                               {stat.label} 
                        </span>
                        <span className="text-white">
                              {stat.count}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">Last week {stat.lastWeek}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Contest Rating Card */}
              <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200">Contest Rating</h3>
                      <p className="text-gray-400 text-sm">Global Ranking</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-400">1,494</p>
                    <p className="text-gray-400 text-sm">339,561 / 742,807</p>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg flex items-center justify-center border border-gray-700/30">
                    <div className="w-full h-8 bg-gradient-to-r from-orange-500/20 via-orange-400/30 to-orange-500/20 rounded"></div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" className="stroke-gray-700" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        className="stroke-emerald-500"
                        strokeWidth="8"
                        strokeDasharray="60 251"
                        strokeLinecap="round"
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl text-white font-bold">202</div>
                      {/* <div className="text-sm text-gray-400">/3661</div> */}
                      <div className="text-xs text-gray-500 mt-1">7 Attempting</div>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full">
                    <div className="flex-1 text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <div className="text-emerald-400 font-bold text-lg">195</div>
                      <div className="text-xs text-gray-400">Accepted</div>
                    </div>
                    <div className="flex-1 text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="text-red-400 font-bold text-lg">7</div>
                      <div className="text-xs text-gray-400">Rejected</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Top 46.23%</h3>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold">1</div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Most Recent Badge</p>
                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                      50 Days Badge 2024
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-8 rounded-2xl border border-gray-700/50 shadow-xl">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl text-white font-bold">Total 119 Posts submissions in the past year</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400">
                    <span>
                      Total active days: <span className="text-white font-semibold">40</span>
                    </span>
                    <span>
                      Max streak: <span className="text-white font-semibold">3</span>
                    </span>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px] bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 mb-2">
                    {monthLabels.map((month) => (
                      <div key={month} className="text-center">
                        {month}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-53 gap-1 overflow-x-auto pb-2">
                    {submissionData.map((count, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getCalendarColor(count)} hover:ring-2 hover:ring-emerald-400/50 transition-all cursor-pointer`}
                        title={`${count} submissions`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div key={level} className={`w-3 h-3 rounded-sm ${getCalendarColor(level)}`} />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] p-8 rounded-2xl border border-gray-700/50 shadow-xl">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    Recent Posts
                  </h3>
                  <button className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    View all posts
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recentPosts.map((post, index) => (
                    <div
                      key={index}
                      className="group bg-gray-800/30 hover:bg-gray-700/50 p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                          {post.title}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {post.daysAgo === 1 ? "1 day ago" : `${post.daysAgo} days ago`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hello
