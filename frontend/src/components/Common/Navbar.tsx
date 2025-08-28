


// import Logo from '../../assets/Logo.png';
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext';
// import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from 'framer-motion';
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";
// // const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api'

// const Nav: React.FC = () => {
//   const { language, changeLanguage } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAskAI, setIsAskAI] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const isLoggedIn = !!localStorage.getItem('token');

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "हिंदी" },
//     { code: "mr", name: "मराठी" },
//   ];

//   const suggestedQueries = [
//     "How to apply for XYZ scheme",
//     "What is Haqdarshak",
//     "hello world what is this Platform",
//     "How to get help for my business",
//     "What are the benefits of using Haqdarshak",
//     "How to find government schemes",
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);

//     const fetchUserRole = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const response = await axios.get(`${API_BASE_URL}/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setUserRole(response.data.role);
//         } catch (error) {
//           console.error("Failed to fetch user profile:", error);
//           setUserRole(null);
//         }
//       }
//     };
//     fetchUserRole();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleLanguageDropdown = () => {
//     setIsLanguageOpen(!isLanguageOpen);
//   };

//   const handleSearchFocus = () => {
//     setIsSearchActive(true);
//   };

//   const handleSearchBlur = () => {
//     setTimeout(() => setIsSearchActive(false), 200);
//   };

//   const handleAskAI = () => {
//     setIsAskAI(true);
//     navigate('/ai-assist');
//   };

//   const selectQuery = (query: string) => {
//     setSearchQuery(query);
//     setIsSearchActive(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     setUserRole(null);
//     navigate('/');
//     setIsOpen(false);
//   };

//   const profileLink = userRole === "admin" ? "/admin" : "/profile";

//   const menuVariants = {
//     open: { opacity: 1, maxHeight: '24rem', transition: { duration: 0.3, ease: easeInOut } },
//     closed: { opacity: 0, maxHeight: 0, transition: { duration: 0.3, ease: easeInOut } },
//   };

//   const dropdownVariants = {
//     open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
//     closed: { opacity: 0, y: -10, transition: { duration: 0.2, ease: easeIn } },
//   };

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5, ease: 'easeOut' }}
//       className={cn(
//         "sticky top-0 z-50",
//         "bg-gray-900",
//         "border-b-3 border-orange-500",
//         isScrolled ? "shadow-xl py-2" : "shadow-md py-4"
//       )}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       <div className="container mx-auto px-6 lg:px-10">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo Section */}
//           <motion.div 
//             className="flex items-center flex-shrink-0 bg-white h-12 rounded-2xl p-2 ml-4"
//             whileHover={{ scale: 1.05 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Link to="/" className="flex items-center" aria-label="Home">
//               <img 
//                 src={Logo} 
//                 alt="Haqdarshak Logo" 
//                 className="h-10 w-auto max-w-[160px] object-contain transition-all duration-300 filter drop-shadow-md hover:drop-shadow-lg" 
//               />
//             </Link>
//           </motion.div>

//           {/* Search Bar */}
//           <div className="relative mx-4 flex-1 max-w-xs">
//             <motion.div 
//               className="relative w-full group"
//               whileFocus={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
//               </div>
//               <input 
//                 type="search" 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={handleSearchFocus}
//                 onBlur={handleSearchBlur}
//                 placeholder="Search..." 
//                 className={cn(
//                   "w-full pl-10 pr-4 py-2 rounded-full",
//                   "bg-gray-800 border border-gray-700 text-white",
//                   "placeholder-gray-500 text-sm focus:outline-none",
//                   "focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 )} 
//                 aria-label="Search"
//               />
//               {isSearchActive && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -15 }}
//                   transition={{ duration: 0.2, ease: "easeOut" }}
//                   className="absolute left-0 mt-1 w-80 bg-gray-900 border border-orange-500 rounded-lg shadow-xl p-3 z-50"
//                 >
//                   <div className="flex items-center text-gray-400 text-sm mb-1">
//                     <span className="mr-2">⌀</span> Suggested Queries:
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     {Array.from({ length: Math.ceil(suggestedQueries.length / 2) }, (_, i) => (
//                       <React.Fragment key={i}>
//                         <div
//                           className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
//                           onClick={() => selectQuery(suggestedQueries[i * 2])}
//                         >
//                           {suggestedQueries[i * 2]}
//                         </div>
//                         {suggestedQueries[i * 2 + 1] && (
//                           <div
//                             className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
//                             onClick={() => selectQuery(suggestedQueries[i * 2 + 1])}
//                           >
//                             {suggestedQueries[i * 2 + 1]}
//                           </div>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </div>
//                     <div className="flex mt-3 space-x-1">
//                       <button
//                         onClick={() => setIsAskAI(false)}
//                         className={cn(
//                           "px-3 py-1 rounded-l-md text-sm",
//                           "bg-gray-800 text-gray-300 hover:bg-gray-700",
//                           !isAskAI && "bg-orange-500 text-white"
//                         )}
//                       >
//                         Search
//                       </button>
//                       <button
//                         onClick={handleAskAI}
//                         className={cn(
//                           "px-3 py-1 rounded-r-md text-sm",
//                           "bg-gray-800 text-gray-300 hover:bg-gray-700",
//                           isAskAI && "bg-orange-500 text-white"
//                         )}
//                       >
//                         Ask AI
//                       </button>
//                     </div>
//                     <div className="text-xl  text-red-500 text-right mt-2">Powered by Haqdarshak</div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </div>

//             {/* Menu Links, Profile, Language, Post Question, AI-Assist, Community Posts, Sign Up/Logout */}
//             <div className="hidden md:flex items-center space-x-4">
//               <Link to="/all-approved-community-posts" className="text-gray-300 hover:text-orange-500">Community Posts</Link>
//               <Link to="/post-question" className="text-gray-300 hover:text-orange-500">Post Question</Link>
//               <Link to="/ai-assist" className="text-gray-300 hover:text-orange-500">AI-Assist</Link>
//               <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//                 <Link 
//                   to={profileLink} 
//                   className={cn(
//                     "p-2.5 rounded-full text-gray-300",
//                     "hover:bg-gray-700 hover:text-orange-500",
//                     "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//                   )}
//                   aria-label={userRole === "admin" ? "Admin Dashboard" : "User profile"}
//                 >
//                   <FaUserCircle className="text-2xl" />
//                 </Link>
//               </motion.div>
//               <div className="relative">
//                 <motion.button 
//                   onClick={toggleLanguageDropdown}
//                   className={cn(
//                     "flex items-center space-x-2 px-4 py-2 rounded",
//                     "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                     "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500",
//                     isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20"
//                   )}
//                   whileHover={{ scale: 1.05 }}
//                   aria-expanded={isLanguageOpen}
//                   aria-label="Select language"
//                 >
//                   <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                   <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//                 </motion.button>
//                 <AnimatePresence>
//                   {isLanguageOpen && (
//                     <motion.div 
//                       variants={dropdownVariants}
//                       initial="closed"
//                       animate="open"
//                       exit="closed"
//                       className={cn(
//                         "absolute right-0 mt-2 w-48 py-2 rounded",
//                         "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm"
//                       )}
//                       role="menu"
//                       aria-label="Language selection"
//                     >
//                       {languages.map((lang, index) => (
//                         <motion.button
//                           key={index}
//                           onClick={() => {
//                             changeLanguage(lang.code);
//                             setIsLanguageOpen(false);
//                           }}
//                           className={cn(
//                             "w-full text-left px-4 py-2 text-sm",
//                             "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
//                             "transition-colors duration-150",
//                             language === lang.code && "bg-gray-700 text-orange-500 font-medium"
//                           )}
//                           whileHover={{ x: 5 }}
//                           role="menuitem"
//                         >
//                           {lang.name}
//                         </motion.button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 {isLoggedIn ? (
//                   <button
//                     onClick={handleLogout}
//                     className={cn(
//                       "px-6 py-2 rounded font-semibold ",
//                       " text-gray-300 border border-gray-700 bg-gradient-to-r from-orange-500 to-amber-500",
//                       " hover:text-red-500 hover:border-orange-500/20",
//                       "transition-all duration-200"
//                     )}
//                     aria-label="Log out"
//                   >
//                     Logout
//                   </button>
//                 ) : (
//                   <Link 
//                     to="/auth" 
//                     className={cn(
//                       "px-6 py-2 rounded font-semibold",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600",
//                       "transition-all duration-200 border border-orange-500/30"
//                     )}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 )}
//               </motion.div>
//             </div>

//             {/* Mobile Menu Button */}
//             <motion.div 
//               className="md:hidden"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <button 
//                 onClick={toggleMenu} 
//                 className={cn(
//                   "p-2.5 rounded-full text-gray-300",
//                   "hover:bg-gray-700 hover:text-orange-500",
//                   "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//                 )}
//                 aria-label={isOpen ? "Close menu" : "Open menu"}
//                 aria-expanded={isOpen}
//               >
//                 {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//               </button>
//             </motion.div>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isOpen && (
//               <motion.div
//                 variants={menuVariants}
//                 initial="closed"
//                 animate="open"
//                 exit="closed"
//                 className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
//               >
//                 <div className="py-4 space-y-4">
//                   <div className="relative px-4">
//                     <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
//                       <FaSearch className="h-5 w-5 text-gray-300" />
//                     </div>
//                     <input 
//                       type="search" 
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search..." 
//                       className={cn(
//                         "w-full pl-12 pr-4 py-3 rounded",
//                         "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                         "text-white placeholder-gray-500",
//                         "focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       )} 
//                       aria-label="Search"
//                     />
//                     <div className="flex mt-2">
//                       <button
//                         onClick={() => setIsAskAI(false)}
//                         className={cn(
//                           "px-4 py-1 rounded-l",
//                           "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                           !isAskAI && "bg-orange-500 text-white"
//                         )}
//                       >
//                         Search
//                       </button>
//                       <button
//                         onClick={handleAskAI}
//                         className={cn(
//                           "px-4 py-1 rounded-r",
//                           "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                           isAskAI && "bg-orange-500 text-white"
//                         )}
//                       >
//                         Ask AI
//                       </button>
//                     </div>
//                   </div>
//                   <Link 
//                     to={profileLink} 
//                     className={cn(
//                       "flex items-center px-4 py-3 rounded text-gray-300 font-medium",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label={userRole === "admin" ? "Admin Dashboard" : "User profile"}
//                   >
//                     <FaUserCircle className="text-xl mr-3" />
//                     {userRole === "admin" ? "Admin Dashboard" : "Profile"}
//                   </Link>
//                   <div className="px-4">
//                     <select 
//                       value={language} 
//                       onChange={(e) => {
//                         changeLanguage(e.target.value);
//                         setIsOpen(false);
//                       }} 
//                       className={cn(
//                         "w-full p-3 rounded",
//                         "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                         "text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       )}
//                       aria-label="Select language"
//                     >
//                       {languages.map((lang, index) => (
//                         <option key={index} value={lang.code} className="bg-gray-800 text-white">
//                           {lang.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <Link 
//                     to="/all-approved-community-posts" 
//                     className={cn(
//                       "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Community Posts
//                   </Link>
//                   <Link 
//                     to="/post-question" 
//                     className={cn(
//                       "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Post Question
//                   </Link>
//                   <Link 
//                     to="/ai-assist" 
//                     className={cn(
//                       "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                   >
//                     AI-Assist
//                   </Link>
//                   {isLoggedIn ? (
//                     <button
//                       onClick={handleLogout}
//                       className={cn(
//                         "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                         "bg-gray-800 text-gray-300 border border-gray-700 ",
//                         "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                       )}
//                       aria-label="Log out"
//                     >
//                       Logout
//                     </button>
//                   ) : (
//                     <Link 
//                       to="/auth" 
//                       className={cn(
//                         "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                         "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                         "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
//                       )} 
//                       onClick={() => setIsOpen(false)}
//                       aria-label="Sign up"
//                     >
//                       Sign Up
//                     </Link>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.nav>
//     );
// };

// export default Nav;



// import type React from "react"
// import { useState, useEffect } from "react"
// import {Link, useNavigate} from "react-router-dom"

// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa"
// import { cn } from  '../../../src/lib/utils'
// import { useLanguage } from '../../../src/Context/LanguageContext'
// import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from "framer-motion"
// import axios from "axios"
// import HAQImage from '../../assets/HaqImage.png'

// const API_BASE_URL = "http://localhost:5000/api"
// // const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api'

// const Navbar: React.FC = () => {
//   const { language, changeLanguage } = useLanguage()
//   const [isOpen, setIsOpen] = useState(false)
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false)
//   const [isSearchActive, setIsSearchActive] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isAskAI, setIsAskAI] = useState(false)
//   const [userRole, setUserRole] = useState<string | null>(null)
//   const navigate = useNavigate()
//   const isLoggedIn = !!localStorage.getItem("token")

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "हिंदी" },
//     { code: "mr", name: "मराठी" },
//   ]

//   const suggestedQueries = [
//     "How to Use this platform ",
//     "What is Haqdarshak and how to resolve my query",
//     "What rewards I can  get by using this Platform",
//     "How to apply for Yojana Didi scheme",
//     "What are the benefits of using this  Haqdarshak Platform",
//     "Can I Post any question on this and how i will get response ",
//   ]



//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20)
//     }
//     window.addEventListener("scroll", handleScroll)

//     const fetchUserRole = async () => {
//       const token = localStorage.getItem("token")
//       if (token) {
//         try {
//           const response = await axios.get(`${API_BASE_URL}/user/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           setUserRole(response.data.role)
//         } catch (error) {
//           console.error("Failed to fetch user profile:", error)
//           setUserRole(null)
//         }
//       }
//     }
//     fetchUserRole()

//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const toggleMenu = () => {
//     setIsOpen(!isOpen)
//   }

//   const toggleLanguageDropdown = () => {
//     setIsLanguageOpen(!isLanguageOpen)
//   }

//   const handleSearchFocus = () => {
//     setIsSearchActive(true)
//   }

//   const handleSearchClose = () => {
//     setIsSearchActive(false)
//   }

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && isSearchActive) {
//         setIsSearchActive(false)
//       }
//     }

//     if (isSearchActive) {
//       document.addEventListener("keydown", handleKeyDown)
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "unset"
//     }

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown)
//       document.body.style.overflow = "unset"
//     }
//   }, [isSearchActive])

//   const handleAskAI = () => {
//     setIsAskAI(true)
//     navigate("/ai-assist")
//   }

//   const selectQuery = (query: string) => {
//     setSearchQuery(query)
//     setIsSearchActive(false)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("role")
//     setUserRole(null)
//     navigate("/")
//     setIsOpen(false)
//   }

//   const profileLink = userRole === "admin" ? "/admin" : "/profile"

//   const menuVariants = {
//     open: { opacity: 1, maxHeight: "24rem", transition: { duration: 0.3, ease: easeInOut } },
//     closed: { opacity: 0, maxHeight: 0, transition: { duration: 0.3, ease: easeInOut } },
//   }

//   const dropdownVariants = {
//     open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
//     closed: { opacity: 0, y: -10, transition: { duration: 0.2, ease: easeIn } },
//   }

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className={cn(
//           "sticky top-0 z-50",
//           "bg-gray-900",
//           "border-b-3 border-orange-500",
//           isScrolled ? "shadow-xl py-2" : "shadow-md py-4",
//         )}
//         role="navigation"
//         aria-label="Main navigation"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-10">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo Section */}
//             {/* <motion.div
//               className="flex items-center flex-shrink-0 bg-white h-10 sm:h-12 rounded-2xl p-1 sm:p-2"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Link to="/" className="flex items-center" aria-label="Home">
//                 <img
//                   src={HAQImage}
//                   alt="Haqdarshak Logo"
//                   className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[160px] object-contain transition-all duration-300 filter drop-shadow-md hover:drop-shadow-lg"
//                 />
//               </Link>
//             </motion.div> */}

//             <motion.div 
//             className="flex items-center flex-shrink-0 bg-white h-12 rounded-2xl p-2 ml-4"
//             whileHover={{ scale: 1.05 }}
//             transition={{ duration: 0.2 }}
//           >
//             <Link to="/" className="flex items-center" aria-label="Home">
//               <img 
//                 src={HAQImage} 
//                 alt="Haqdarshak Logo" 
//                 className="h-10 w-auto max-w-[160px] object-contain transition-all duration-300 filter drop-shadow-md hover:drop-shadow-lg" 
//               />
//             </Link>
//           </motion.div>

//             {/* Search Bar */}
//             <div className="relative mx-2 sm:mx-4 flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
//               <motion.div className="relative w-full group" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
//                 </div>
//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={handleSearchFocus}
//                   placeholder="Search..."
//                   className={cn(
//                     "w-full pl-10 pr-16 sm:pr-20 py-2 sm:py-3 rounded-full",
//                     "bg-gray-800 border border-gray-700 text-white text-sm sm:text-base",
//                     "placeholder-gray-500 focus:outline-none",
//                     "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
//                     "transition-all duration-200",
//                   )}
//                   aria-label="Search"
//                 />
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-xs sm:text-sm">
//                   /
//                 </div>
//               </motion.div>
//             </div>

//             <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
//               <Link
//                 to="/all-approved-community-posts"
//                 className="text-gray-300 hover:text-orange-500 text-sm xl:text-base whitespace-nowrap"
//               >
//                 Community Posts
//               </Link>
//               <Link
//                 to="/post-question"
//                 className="text-gray-300 hover:text-orange-500 text-sm xl:text-base whitespace-nowrap"
//               >
//                 Post Question
//               </Link>
//               <Link
//                 to="/ai-assist"
//                 className="text-gray-300 hover:text-orange-500 text-sm xl:text-base whitespace-nowrap"
//               >
//                 AI-Assist
//               </Link>

//               <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//                 <Link
//                   to={profileLink}
//                   className={cn(
//                     "p-2 rounded-full text-gray-300",
//                     "hover:bg-gray-700 hover:text-orange-500",
//                     "transition-all duration-200 border border-transparent hover:border-orange-500/20",
//                   )}
//                   aria-label={userRole === "admin" ? "Admin Dashboard" : "User profile"}
//                 >
//                   <FaUserCircle className="text-xl xl:text-2xl" />
//                 </Link>
//               </motion.div>

//               <div className="relative">
//                 <motion.button
//                   onClick={toggleLanguageDropdown}
//                   className={cn(
//                     "flex items-center space-x-1 xl:space-x-2 px-2 xl:px-4 py-2 rounded",
//                     "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                     "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500 text-sm xl:text-base",
//                     isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20",
//                   )}
//                   whileHover={{ scale: 1.05 }}
//                   aria-expanded={isLanguageOpen}
//                   aria-label="Select language"
//                 >
//                   <span className="hidden xl:inline">
//                     {languages.find((lang) => lang.code === language)?.name || "English"}
//                   </span>
//                   <span className="xl:hidden">
//                     {languages.find((lang) => lang.code === language)?.code.toUpperCase() || "EN"}
//                   </span>
//                   <FaChevronDown
//                     className={cn(
//                       "h-3 w-3 xl:h-4 xl:w-4 transition-transform duration-200",
//                       isLanguageOpen && "rotate-180",
//                     )}
//                   />
//                 </motion.button>

//                 <AnimatePresence>
//                   {isLanguageOpen && (
//                     <motion.div
//                       variants={dropdownVariants}
//                       initial="closed"
//                       animate="open"
//                       exit="closed"
//                       className={cn(
//                         "absolute right-0 mt-2 w-48 py-2 rounded",
//                         "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm",
//                       )}
//                       role="menu"
//                       aria-label="Language selection"
//                     >
//                       {languages.map((lang, index) => (
//                         <motion.button
//                           key={index}
//                           onClick={() => {
//                             changeLanguage(lang.code)
//                             setIsLanguageOpen(false)
//                           }}
//                           className={cn(
//                             "w-full text-left px-4 py-2 text-sm",
//                             "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
//                             "transition-colors duration-150",
//                             language === lang.code && "bg-gray-700 text-orange-500 font-medium",
//                           )}
//                           whileHover={{ x: 5 }}
//                           role="menuitem"
//                         >
//                           {lang.name}
//                         </motion.button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 {isLoggedIn ? (
//                   <button
//                     onClick={handleLogout}
//                     className={cn(
//                       "px-3 xl:px-6 py-2 rounded font-semibold text-sm xl:text-base",
//                       " text-gray-300 border border-gray-700 bg-gradient-to-r from-orange-500 to-amber-500",
//                       " hover:text-red-500 hover:border-orange-500/20",
//                       "transition-all duration-200",
//                     )}
//                     aria-label="Log out"
//                   >
//                     Logout
//                   </button>
//                 ) : (
//                   <Link
//                     to="/auth"
//                     className={cn(
//                       "px-3 xl:px-6 py-2 rounded font-semibold text-sm xl:text-base",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600",
//                       "transition-all duration-200 border border-orange-500/30",
//                     )}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 )}
//               </motion.div>
//             </div>

//             <motion.div className="lg:hidden" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
//               <button
//                 onClick={toggleMenu}
//                 className={cn(
//                   "p-2 rounded-full text-gray-300",
//                   "hover:bg-gray-700 hover:text-orange-500",
//                   "transition-all duration-200 border border-transparent hover:border-orange-500/20",
//                 )}
//                 aria-label={isOpen ? "Close menu" : "Open menu"}
//                 aria-expanded={isOpen}
//               >
//                 {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//               </button>
//             </motion.div>
//           </div>

//           <AnimatePresence>
//             {isOpen && (
//               <motion.div
//                 variants={menuVariants}
//                 initial="closed"
//                 animate="open"
//                 exit="closed"
//                 className="lg:hidden overflow-hidden border-t border-gray-700 mt-4"
//               >
//                 <div className="py-4 space-y-3">
//                   {/* Mobile Search - Simplified */}
//                   <div className="px-4">
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FaSearch className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="search"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Search..."
//                         className={cn(
//                           "w-full pl-10 pr-4 py-3 rounded-lg",
//                           "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                           "text-white placeholder-gray-500",
//                           "focus:outline-none focus:ring-2 focus:ring-orange-500",
//                         )}
//                         aria-label="Search"
//                       />
//                     </div>
//                   </div>

//                   {/* Mobile Navigation Links */}
//                   <div className="space-y-1">
//                     <Link
//                       to={profileLink}
//                       className={cn(
//                         "flex items-center px-4 py-3 text-gray-300 font-medium",
//                         "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200",
//                       )}
//                       onClick={() => setIsOpen(false)}
//                       aria-label={userRole === "admin" ? "Admin Dashboard" : "User profile"}
//                     >
//                       <FaUserCircle className="text-xl mr-3" />
//                       {userRole === "admin" ? "Admin Dashboard" : "Profile"}
//                     </Link>

//                     <Link
//                       to="/all-approved-community-posts"
//                       className={cn(
//                         "block px-4 py-3 text-gray-300 font-medium",
//                         "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200",
//                       )}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Community Posts
//                     </Link>

//                     <Link
//                       to="/post-question"
//                       className={cn(
//                         "block px-4 py-3 text-gray-300 font-medium",
//                         "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200",
//                       )}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Post Question
//                     </Link>

//                     <Link
//                       to="/ai-assist"
//                       className={cn(
//                         "block px-4 py-3 text-gray-300 font-medium",
//                         "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200",
//                       )}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       AI-Assist
//                     </Link>
//                   </div>

//                   {/* Language Selector */}
//                   <div className="px-4">
//                     <select
//                       value={language}
//                       onChange={(e) => {
//                         changeLanguage(e.target.value)
//                         setIsOpen(false)
//                       }}
//                       className={cn(
//                         "w-full p-3 rounded-lg",
//                         "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                         "text-white focus:outline-none focus:ring-2 focus:ring-orange-500",
//                       )}
//                       aria-label="Select language"
//                     >
//                       {languages.map((lang, index) => (
//                         <option key={index} value={lang.code} className="bg-gray-800 text-white">
//                           {lang.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Auth Button */}
//                   <div className="px-4 pt-2">
//                     {isLoggedIn ? (
//                       <button
//                         onClick={handleLogout}
//                         className={cn(
//                           "w-full px-6 py-3 rounded-lg font-semibold text-center",
//                           "bg-gray-800 text-gray-300 border border-gray-700",
//                           "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200",
//                         )}
//                         aria-label="Log out"
//                       >
//                         Logout
//                       </button>
//                     ) : (
//                       <Link
//                         to="/auth"
//                         className={cn(
//                           "block w-full px-6 py-3 rounded-lg font-semibold text-center",
//                           "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                           "hover:from-orange-600 hover:to-amber-600 transition-all duration-200",
//                         )}
//                         onClick={() => setIsOpen(false)}
//                         aria-label="Sign up"
//                       >
//                         Sign Up
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.nav>

//       {/* Full-screen modal overlay for search popup */}
//       <AnimatePresence>
//         {isSearchActive && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-32"
//             onClick={handleSearchClose}
//           >
//             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

//             <motion.div
//               initial={{ opacity: 0, y: -30, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -30, scale: 0.95 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//               className="relative w-full max-w-2xl mx-4 sm:mx-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-gray-900 border border-orange-500 rounded-xl shadow-2xl p-6 sm:p-8">
//                 <div className="relative mb-6">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaSearch className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="search"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..."
//                     className={cn(
//                       "w-full pl-12 pr-32 py-4 rounded-xl text-lg",
//                       "bg-gray-800 border-2 border-orange-500 text-white",
//                       "placeholder-gray-400 focus:outline-none",
//                       "focus:ring-2 focus:ring-orange-500/50",
//                       "transition-all duration-200",
//                     )}
//                     autoFocus
//                   />
//                   <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
//                     <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
//                       Search
//                     </button>
//                     <Link to='/ai-assist'>
//                      <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-1">
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                       Ask AI
//                     </button>
//                     </Link>
                   
//                   </div>
//                 </div>

//                 {/* Header with refresh icon */}
//                 <div className="flex items-center text-gray-400 text-sm mb-4">
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                     />
//                   </svg>
//                   <span>Suggested Queries:</span>
//                   <div className="ml-auto flex gap-2">
//                     {suggestedQueries.slice(0, 3).map((query, index) => (
//                       <span key={index} className="px-3 py-1 bg-gray-800 rounded-lg text-xs border border-gray-700">
//                         {query.split(" ").slice(0, 2).join(" ")}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
//                   {suggestedQueries.map((query, index) => (
//                     <motion.div
//                       key={index}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="text-gray-300 hover:text-orange-500 cursor-pointer p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-orange-500/50"
//                       onClick={() => selectQuery(query)}
//                     >
//                       <div className="font-medium text-sm">{query}</div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-700 gap-4">
//                   <div className="flex items-center gap-6 text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↵</kbd>
//                       <span>to select</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↓</kbd>
//                       <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↑</kbd>
//                       <span>to navigate</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">esc</kbd>
//                       <span>to close</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-400">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                     <span className="text-xl font-bold text-red-500">Powered by Haqdarshak</span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default Navbar 




import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { cn } from "../../../src/lib/utils";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import HAQImage from "../../assets/HaqImage.png";

const API_BASE_URL = "http://localhost:5000/api";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const languages = [
    { code: "en", name: t("languages.english") },
    { code: "hi", name: t("languages.hindi") },
    { code: "mr", name: t("languages.marathi") },
  ];

  const suggestedQueries = [
    t("suggestedQueries.platformUsage"),
    t("suggestedQueries.haqdarshakInfo"),
    t("suggestedQueries.rewards"),
    t("suggestedQueries.yojanaDidi"),
    t("suggestedQueries.benefits"),
    t("suggestedQueries.postQuestion"),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserRole(null);
        }
      }
    };
    fetchUserRole();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchActive) {
        setIsSearchActive(false);
      }
    };

    if (isSearchActive) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSearchActive]);

  const handleAskAI = () => {
    navigate("/ai-assist");
  };

  const selectQuery = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole(null);
    navigate("/");
    setIsOpen(false);
  };

  const profileLink = userRole === "admin" ? "/admin" : "/profile";

  const menuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 z-50",
          "bg-gray-900 text-white",
          "border-b-2 border-orange-500",
          isScrolled ? "shadow-xl py-2" : "shadow-md py-3",
          "w-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <motion.div
              className="flex items-center flex-shrink-0 bg-white h-10 sm:h-12 rounded-2xl p-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center" aria-label={t("nav.home")}>
                <img
                  src={HAQImage}
                  alt="Haqdarshak Logo"
                  className="h-8 sm:h-10 w-auto max-w-[140px] object-contain"
                />
              </Link>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden sm:flex relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-2 sm:mx-4">
              <motion.div className="relative w-full" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  placeholder={t("nav.searchPlaceholder")}
                  className={cn(
                    "w-full pl-10 pr-4 py-2 sm:py-3 rounded-full",
                    "bg-gray-800 border border-gray-700 text-white",
                    "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                    "text-sm sm:text-base"
                  )}
                  aria-label={t("nav.search")}
                />
              </motion.div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/all-approved-community-posts"
                className="text-gray-300 hover:text-orange-500 text-sm xl:text-base"
              >
                {t("nav.communityPosts")}
              </Link>
              <Link
                to="/post-question"
                className="text-gray-300 hover:text-orange-500 text-sm xl:text-base"
              >
                {t("nav.postQuestion")}
              </Link>
              <Link
                to="/ai-assist"
                className="text-gray-300 hover:text-orange-500 text-sm xl:text-base"
              >
                {t("nav.aiAssist")}
              </Link>

              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Link
                  to={profileLink}
                  className="p-2 rounded-full text-gray-300 hover:text-orange-500 hover:bg-gray-700"
                  aria-label={userRole === "admin" ? t("nav.adminDashboard") : t("nav.profile")}
                >
                  <FaUserCircle className="text-xl xl:text-2xl" />
                </Link>
              </motion.div>

              {/* Language Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={toggleLanguageDropdown}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded",
                    "bg-gray-800 border border-gray-700 text-gray-300",
                    isLanguageOpen && "bg-gray-700 text-orange-500"
                  )}
                  whileHover={{ scale: 1.05 }}
                  aria-expanded={isLanguageOpen}
                  aria-label={t("nav.selectLanguage")}
                >
                  <span>{languages.find((lang) => lang.code === i18n.language)?.name || "English"}</span>
                  <FaChevronDown
                    className={cn("h-4 w-4", isLanguageOpen && "rotate-180")}
                  />
                </motion.button>
                <AnimatePresence>
                  {isLanguageOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 border border-gray-700 rounded shadow-lg"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setIsLanguageOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-orange-500",
                            i18n.language === lang.code && "bg-gray-700 text-orange-500"
                          )}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    aria-label={t("nav.logout")}
                  >
                    {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="px-4 py-2 rounded text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    aria-label={t("nav.signUp")}
                  >
                    {t("nav.signUp")}
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Hamburger Menu */}
            <motion.div className="lg:hidden" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-orange-500"
                aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                aria-expanded={isOpen}
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="lg:hidden border-t border-gray-700 bg-gray-900"
              >
                <div className="py-4 px-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  {/* Mobile Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      placeholder={t("nav.searchPlaceholder")}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
                      aria-label={t("nav.search")}
                    />
                  </div>

                  {/* Mobile Navigation Links */}
                  <Link
                    to={profileLink}
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                    aria-label={userRole === "admin" ? t("nav.adminDashboard") : t("nav.profile")}
                  >
                    <FaUserCircle className="text-xl mr-3" />
                    {userRole === "admin" ? t("nav.adminDashboard") : t("nav.profile")}
                  </Link>
                  <Link
                    to="/all-approved-community-posts"
                    className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.communityPosts")}
                  </Link>
                  <Link
                    to="/post-question"
                    className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.postQuestion")}
                  </Link>
                  <Link
                    to="/ai-assist"
                    className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.aiAssist")}
                  </Link>

                  {/* Language Selector */}
                  <select
                    value={i18n.language}
                    onChange={(e) => {
                      i18n.changeLanguage(e.target.value);
                      setIsOpen(false);
                    }}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-orange-500"
                    aria-label={t("nav.selectLanguage")}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                        {lang.name}
                      </option>
                    ))}
                  </select>

                  {/* Auth Button */}
                  <div className="pt-2">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full px-6 py-3 rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        aria-label={t("nav.logout")}
                      >
                        {t("nav.logout")}
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        className="block w-full px-6 py-3 rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        onClick={() => setIsOpen(false)}
                        aria-label={t("nav.signUp")}
                      >
                        {t("nav.signUp")}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm"
            onClick={handleSearchClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl mx-4 bg-gray-900 border border-orange-500 rounded-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full pl-12 pr-32 py-4 rounded-xl bg-gray-800 border-2 border-orange-500 text-white focus:ring-2 focus:ring-orange-500/50"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium">
                    {t("nav.search")}
                  </button>
                  <Link to="/ai-assist">
                    <button
                      onClick={handleAskAI}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t("nav.askAI")}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center text-gray-400 text-sm mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{t("nav.suggestedQueries")}</span>
                <div className="ml-auto flex gap-2">
                  {suggestedQueries.slice(0, 3).map((query, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 rounded-lg text-xs border border-gray-700">
                      {query.split(" ").slice(0, 2).join(" ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {suggestedQueries.map((query, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-orange-500 border border-gray-700 hover:border-orange-500/50 cursor-pointer"
                    onClick={() => selectQuery(query)}
                  >
                    <div className="font-medium text-sm">{query}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-700 gap-4">
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↵</kbd>
                    <span>{t("nav.select")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↓</kbd>
                    <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">↑</kbd>
                    <span>{t("nav.navigate")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 font-mono">esc</kbd>
                    <span>{t("nav.close")}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xl font-bold text-red-500">{t("nav.poweredBy")}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;