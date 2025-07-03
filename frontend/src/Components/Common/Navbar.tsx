// import Logo from '../../assets/Logo.png'
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext'


// interface NavbarProps {
//   isLoggedIn?: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
//   const { language, changeLanguage } = useLanguage(); // Use the language context
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "हिंदी" },
//     { code: "mr", name: "मराठी" },
//     // Add more languages as needed
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleLanguageDropdown = () => {
//     setIsLanguageOpen(!isLanguageOpen);
//   };

//   return (
//     <nav className={cn("sticky top-0 z-50 transition-all duration-300 ease-in-out", "bg-gradient-to-r from-slate-800 via-slate-900 to-gray-900", "border-b-2 border-orange-500/30 backdrop-blur-sm", isScrolled ? "shadow-2xl py-2" : "shadow-lg py-3")}>
//       <div className="container mx-auto px-4 lg:px-6">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo Section - Left */}
//           <div className="flex items-center flex-shrink-0 bg-white h-12 rounded-2xl p-2">
//             <Link to="/" className="group flex items-center hover:scale-105 transition-transform duration-200">
//               <img src={Logo} alt="Haqdarshak Logo" className="h-12 w-auto m-4 max-w-[180px] object-contain group-hover:brightness-110 transition-all duration-200 filter drop-shadow-md group-hover:drop-shadow-lg" />
//             </Link>
//           </div>

//           {/* Search Bar - Center */}
//           <div className="hidden md:flex flex-1 max-w-2xl mx-8">
//             <div className="relative w-full group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-200" />
//               </div>
//               <input type="text" placeholder="Search policies, schemes, and guidelines..." className={cn("w-full pl-12 pr-4 py-3 rounded-xl", "bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm", "text-white placeholder-gray-400 text-base", "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", "hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-200", "shadow-inner hover:shadow-lg")} />
//             </div>
//           </div>

//           {/* Right Section - Profile, Language, Signup */}
//           <div className="hidden md:flex items-center space-x-3">
//             {/* Profile Icon */}
//             <Link to="/profile" className={cn("p-2.5 rounded-xl text-gray-300", "hover:bg-slate-700/50 hover:text-orange-400 hover:shadow-md", "transition-all duration-200 ease-in-out", "hover:scale-110 border border-transparent hover:border-slate-600/50")}>
//               <FaUserCircle className="text-2xl" />
//             </Link>

//             {/* Language Dropdown */}
//             <div className="relative">
//               <button onClick={toggleLanguageDropdown} className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-xl", "bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm", "text-gray-300 font-medium hover:bg-slate-700/70 hover:text-orange-400 hover:border-slate-500/50", "transition-all duration-200 ease-in-out", "hover:shadow-md hover:scale-105", isLanguageOpen && "bg-slate-700/70 text-orange-400 border-slate-500/50 shadow-md")}>
//                 <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                 <FaChevronDown className={cn("h-3 w-3 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//               </button>

//               {isLanguageOpen && (
//                 <div className={cn("absolute right-0 mt-2 w-48 py-2 rounded-xl", "bg-slate-800 shadow-2xl border border-slate-600/50 backdrop-blur-sm", "animate-in slide-in-from-top-2 duration-200", "max-h-64 overflow-y-auto")}>
//                   {languages.map((lang, index) => (
//                     <button key={index} onClick={() => {
//                       changeLanguage(lang.code);
//                       setIsLanguageOpen(false);
//                     }} className={cn("w-full text-left px-4 py-2.5 text-sm", "hover:bg-slate-700/50 text-gray-300 hover:text-orange-400", "transition-colors duration-150", language === lang.code && "bg-slate-700/70 text-orange-400 font-medium")}>
//                       {lang.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Sign Up / Login Button */}
//             {!isLoggedIn ? (
//               <Link to="/signup" className={cn("px-6 py-2.5 rounded-xl font-semibold", "bg-gradient-to-r from-orange-500 to-amber-500 text-white", "hover:from-orange-600 hover:to-amber-600 hover:shadow-lg", "transition-all duration-200 ease-in-out", "hover:scale-105 active:scale-95", "border border-orange-400/20 hover:border-orange-300/50", "shadow-md hover:shadow-xl")}>
//                 Sign Up
//               </Link>
//             ) : (
//               <Link to="/login" className={cn("px-6 py-2.5 rounded-xl font-semibold", "bg-slate-700/50 text-gray-300 border border-slate-600/50", "hover:bg-slate-700/70 hover:text-orange-400 hover:border-slate-500/50 hover:shadow-md", "transition-all duration-200 ease-in-out", "hover:scale-105 active:scale-95")}>
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={toggleMenu} className={cn("p-2.5 rounded-xl text-gray-300", "hover:bg-slate-700/50 hover:text-orange-400 transition-all duration-200", "hover:scale-110 active:scale-95 border border-transparent hover:border-slate-600/50")}>
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={cn("md:hidden overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
//           <div className="py-4 space-y-4 border-t border-slate-700/50 mt-4">
//             {/* Mobile Logo */}
//             <div className="px-4 pb-2">
//               <img src="/placeholder.svg?height=40&width=150" alt="Haqdarshak Logo" className="h-10 w-auto max-w-[150px] object-contain filter drop-shadow-md" />
//             </div>

//             {/* Mobile Search */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaSearch className="h-4 w-4 text-gray-400" />
//               </div>
//               <input type="text" placeholder="Search policies..." className={cn("w-full pl-12 pr-4 py-3 rounded-xl", "bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm", "text-white placeholder-gray-400", "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50")} />
//             </div>

//             {/* Mobile Profile Link */}
//             <Link to="/profile" className={cn("flex items-center px-4 py-3 rounded-xl text-gray-300 font-medium", "hover:bg-slate-700/50 hover:text-orange-400 transition-all duration-200")} onClick={() => setIsOpen(false)}>
//               <FaUserCircle className="text-xl mr-3" />
//               Profile
//             </Link>

//             {/* Mobile Language Selector */}
//             <div className="px-4">
//               <select value={language} onChange={(e) => changeLanguage(e.target.value)} className={cn("w-full p-3 rounded-xl", "bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm", "text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50")}>
//                 {languages.map((lang, index) => (
//                   <option key={index} value={lang.code} className="bg-slate-800 text-white">
//                     {lang.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Mobile Sign Up / Login Button */}
//             {!isLoggedIn ? (
//               <Link to="/signup" className={cn("block mx-4 px-6 py-3 rounded-xl font-semibold text-center", "bg-gradient-to-r from-orange-500 to-amber-500 text-white", "hover:from-orange-600 hover:to-amber-600 transition-all duration-200", "shadow-md hover:shadow-lg")} onClick={() => setIsOpen(false)}>
//                 Sign Up
//               </Link>
//             ) : (
//               <Link to="/login" className={cn("block mx-4 px-6 py-3 rounded-xl font-semibold text-center", "bg-slate-700/50 text-gray-300 border border-slate-600/50", "hover:bg-slate-700/70 hover:text-orange-400 transition-all duration-200")} onClick={() => setIsOpen(false)}>
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close language dropdown */}
//       {isLanguageOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLanguageOpen(false)} />}
//     </nav>
//   );
// };

// export default Navbar;





// import Logo from '../../assets/Logo.png';
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { easeInOut } from 'framer-motion';

// interface NavbarProps {
//   isLoggedIn?: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
//   const { language, changeLanguage } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "हिंदी" },
//     { code: "mr", name: "मराठी" },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleLanguageDropdown = () => {
//     setIsLanguageOpen(!isLanguageOpen);
//   };
//   const menuVariants = {
//     open: { 
//       opacity: 1, 
//       maxHeight: '24rem',
//       transition: { duration: 0.3, ease: easeInOut }
//     },
//     closed: { 
//       opacity: 0, 
//       maxHeight: 0,
//       transition: { duration: 0.3, ease: easeInOut }
//     }
//   };

//   const dropdownVariants = {
//     open: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { duration: 0.2, ease: "easeOut" as const }
//     },
//     closed: { 
//       opacity: 0, 
//       y: -10, 
//       transition: { duration: 0.2, ease: "easeIn" as const }
//     }
//   };

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5, ease: 'easeOut' }}
//       className={cn(
//         "sticky top-0 z-50",
//         "bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900",
//         "border-b-2 border-orange-500/20 backdrop-blur-md",
//         isScrolled ? "shadow-xl py-2" : "shadow-md py-4"
//       )}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo Section */}
//           <motion.div 
//             className="flex items-center flex-shrink-0 bg-white h-12 rounded-2xl p-2"
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
//           <div className="hidden md:flex flex-1 max-w-3xl mx-6">
//             <motion.div 
//               className="relative w-full group"
//               whileFocus={{ scale: 1.02 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-gray-300 group-focus-within:text-orange-400 transition-colors duration-200" />
//               </div>
//               <input 
//                 type="search" 
//                 placeholder="Search policies, schemes, and guidelines..." 
//                 className={cn(
//                   "w-full pl-12 pr-4 py-3 rounded-xl",
//                   "bg-slate-800/60 border border-slate-700/30 backdrop-blur-sm",
//                   "text-white placeholder-gray-400 text-sm",
//                   "focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50",
//                   "hover:bg-slate-800/80 transition-all duration-300"
//                 )} 
//                 aria-label="Search policies"
//               />
//             </motion.div>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Profile Icon */}
//             <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//               <Link 
//                 to="/profile" 
//                 className={cn(
//                   "p-2.5 rounded-full text-gray-200",
//                   "hover:bg-slate-700/50 hover:text-orange-400",
//                   "transition-all duration-200 border border-transparent hover:border-orange-400/20"
//                 )}
//                 aria-label="User profile"
//               >
//                 <FaUserCircle className="text-2xl" />
//               </Link>
//             </motion.div>

//             {/* Language Dropdown */}
//             <div className="relative">
//               <motion.button 
//                 onClick={toggleLanguageDropdown}
//                 className={cn(
//                   "flex items-center space-x-2 px-4 py-2 rounded-xl",
//                   "bg-slate-800/50 border border-slate-700/30 backdrop-blur-sm",
//                   "text-gray-200 font-medium hover:bg-slate-800/80 hover:text-orange-400",
//                   "transition-all duration-200",
//                   isLanguageOpen && "bg-slate-800/80 text-orange-400 border-orange-400/20"
//                 )}
//                 whileHover={{ scale: 1.05 }}
//                 aria-expanded={isLanguageOpen}
//                 aria-label="Select language"
//               >
//                 <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                 <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//               </motion.button>

//               <AnimatePresence>
//                 {isLanguageOpen && (
//                   <motion.div 
//                     variants={dropdownVariants}
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     className={cn(
//                       "absolute right-0 mt-2 w-48 py-2 rounded-xl",
//                       "bg-slate-800/95 shadow-xl border border-slate-700/30 backdrop-blur-sm"
//                     )}
//                     role="menu"
//                     aria-label="Language selection"
//                   >
//                     {languages.map((lang, index) => (
//                       <motion.button
//                         key={index}
//                         onClick={() => {
//                           changeLanguage(lang.code);
//                           setIsLanguageOpen(false);
//                         }}
//                         className={cn(
//                           "w-full text-left px-4 py-2 text-sm",
//                           "hover:bg-slate-700/50 text-gray-200 hover:text-orange-400",
//                           "transition-colors duration-150",
//                           language === lang.code && "bg-slate-700/70 text-orange-400 font-medium"
//                         )}
//                         whileHover={{ x: 5 }}
//                         role="menuitem"
//                       >
//                         {lang.name}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Sign Up / Login Button */}
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               {!isLoggedIn ? (
//                 <Link 
//                   to="/signup" 
//                   className={cn(
//                     "px-6 py-2 rounded-xl font-semibold",
//                     "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                     "hover:from-orange-600 hover:to-amber-600",
//                     "transition-all duration-200 border border-orange-400/30"
//                   )}
//                   aria-label="Sign up"
//                 >
//                   Sign Up
//                 </Link>
//               ) : (
//                 <Link 
//                   to="/login" 
//                   className={cn(
//                     "px-6 py-2 rounded-xl font-semibold",
//                     "bg-slate-800/50 text-gray-200 border border-slate-700/30",
//                     "hover:bg-slate-800/80 hover:text-orange-400 hover:border-orange-400/20",
//                     "transition-all duration-200"
//                   )}
//                   aria-label="Log in"
//                 >
//                   Login
//                 </Link>
//               )}
//             </motion.div>
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.div 
//             className="md:hidden"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <button 
//               onClick={toggleMenu} 
//               className={cn(
//                 "p-2.5 rounded-full text-gray-200",
//                 "hover:bg-slate-700/50 hover:text-orange-400",
//                 "transition-all duration-200 border border-transparent hover:border-orange-400/20"
//               )}
//               aria-label={isOpen ? "Close menu" : "Open menu"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </motion.div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               variants={menuVariants}
//               initial="closed"
//               animate="open"
//               exit="closed"
//               className="md:hidden overflow-hidden border-t border-slate-700/30 mt-4"
//             >
//               <div className="py-4 space-y-4">
//                 {/* Mobile Search */}
//                 <div className="relative px-4">
//                   <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
//                     <FaSearch className="h-5 w-5 text-gray-300" />
//                   </div>
//                   <input 
//                     type="search" 
//                     placeholder="Search policies..." 
//                     className={cn(
//                       "w-full pl-12 pr-4 py-3 rounded-xl",
//                       "bg-slate-800/60 border border-slate-700/30 backdrop-blur-sm",
//                       "text-white placeholder-gray-400 text-sm",
//                       "focus:outline-none focus:ring-2 focus:ring-orange-400/50"
//                     )} 
//                     aria-label="Search policies"
//                   />
//                 </div>

//                 {/* Mobile Profile Link */}
//                 <Link 
//                   to="/profile" 
//                   className={cn(
//                     "flex items-center px-4 py-3 rounded-xl text-gray-200 font-medium",
//                     "hover:bg-slate-800/50 hover:text-orange-400 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                   aria-label="User profile"
//                 >
//                   <FaUserCircle className="text-xl mr-3" />
//                   Profile
//                 </Link>

//                 {/* Mobile Language Selector */}
//                 <div className="px-4">
//                   <select 
//                     value={language} 
//                     onChange={(e) => {
//                       changeLanguage(e.target.value);
//                       setIsOpen(false);
//                     }} 
//                     className={cn(
//                       "w-full p-3 rounded-xl",
//                       "bg-slate-800/60 border border-slate-700/30 backdrop-blur-sm",
//                       "text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
//                     )}
//                     aria-label="Select language"
//                   >
//                     {languages.map((lang, index) => (
//                       <option key={index} value={lang.code} className="bg-slate-800 text-white">
//                         {lang.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Mobile Sign Up / Login Button */}
//                 {!isLoggedIn ? (
//                   <Link 
//                     to="/signup" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded-xl font-semibold text-center",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 ) : (
//                   <Link 
//                     to="/login" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded-xl font-semibold text-center",
//                       "bg-slate-800/60 text-gray-200 border border-slate-700/30",
//                       "hover:bg-slate-800/80 hover:text-orange-400 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Log in"
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Click outside to close language dropdown */}
//       {isLanguageOpen && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setIsLanguageOpen(false)} 
//           aria-hidden="true"
//         />
//       )}
//     </motion.nav>
//   );
// };

// export default Navbar;



// import Logo from '../../assets/Logo.png';
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext';
// import { motion, AnimatePresence, easeInOut } from 'framer-motion';

// interface NavbarProps {
//   isLoggedIn?: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
//   const { language, changeLanguage } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAskAI, setIsAskAI] = useState(false);

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "हिंदी" },
//     { code: "mr", name: "मराठी" },
//   ];

//   const suggestedQueries = [
//     "How to apply for XYZ scheme",
//     "What is Haqdarshak",
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
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
//     window.location.href = 'http://localhost:5173/ai-assist';
//   };

// interface SuggestedQuery {
//     query: string;
// }

// interface LanguageOption {
//     code: string;
//     name: string;
// }

// const selectQuery = (query: string): void => {
//     setSearchQuery(query);
//     setIsSearchActive(false);
// };

//   const menuVariants = {
//     open: { opacity: 1, maxHeight: '24rem', transition: { duration: 0.3, ease: easeInOut } },
//     closed: { opacity: 0, maxHeight: 0, transition: { duration: 0.3, ease: easeInOut } },
//   };

//   const dropdownVariants = {
//     open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
//     closed: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" as const } },
//   };

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5, ease: 'easeOut' }}
//       className={cn(
//         "sticky top-0 z-50",
//         "bg-gray-900",
//         "border-b border-orange-500",
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
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute left-0 mt-1 w-full bg-gray-900 border border-orange-500 rounded shadow-lg p-2"
//                 >
//                   <div className="flex items-center text-gray-400 text-sm mb-1">
//                     <span className="mr-2">⌀</span> Suggested Queries:
//                   </div>
//                   {suggestedQueries.map((query, index) => (
//                     <div 
//                       key={index}
//                       className="text-gray-300 hover:text-orange-500 cursor-pointer p-1 rounded"
//                       onClick={() => selectQuery(query)}
//                     >
//                       {query}
//                     </div>
//                   ))}
//                   <div className="flex mt-2">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-4 py-1 rounded-l",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-4 py-1 rounded-r",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                   <div className="text-xs text-gray-400 text-right mt-2">Powered by Haqdarshak</div>
//                 </motion.div>
//               )}
//             </motion.div>
//           </div>

//           {/* Menu Links, Profile, Language, Post Question, AI-Assist, Signup */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/post-question" className="text-gray-300 hover:text-orange-500">Post Question</Link>
//             <Link to="/ai-assist" className="text-gray-300 hover:text-orange-500">AI-Assist</Link>
//             <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//               <Link 
//                 to="/profile" 
//                 className={cn(
//                   "p-2.5 rounded-full text-gray-300",
//                   "hover:bg-gray-700 hover:text-orange-500",
//                   "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//                 )}
//                 aria-label="User profile"
//               >
//                 <FaUserCircle className="text-2xl" />
//               </Link>
//             </motion.div>
//             <div className="relative">
//               <motion.button 
//                 onClick={toggleLanguageDropdown}
//                 className={cn(
//                   "flex items-center space-x-2 px-4 py-2 rounded",
//                   "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                   "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500",
//                   isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20"
//                 )}
//                 whileHover={{ scale: 1.05 }}
//                 aria-expanded={isLanguageOpen}
//                 aria-label="Select language"
//               >
//                 <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                 <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//               </motion.button>
//               <AnimatePresence>
//                 {isLanguageOpen && (
//                   <motion.div 
//                     variants={dropdownVariants}
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     className={cn(
//                       "absolute right-0 mt-2 w-48 py-2 rounded",
//                       "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm"
//                     )}
//                     role="menu"
//                     aria-label="Language selection"
//                   >
//                     {languages.map((lang, index) => (
//                       <motion.button
//                         key={index}
//                         onClick={() => {
//                           changeLanguage(lang.code);
//                           setIsLanguageOpen(false);
//                         }}
//                         className={cn(
//                           "w-full text-left px-4 py-2 text-sm",
//                           "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
//                           "transition-colors duration-150",
//                           language === lang.code && "bg-gray-700 text-orange-500 font-medium"
//                         )}
//                         whileHover={{ x: 5 }}
//                         role="menuitem"
//                       >
//                         {lang.name}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               {!isLoggedIn ? (
//                 <Link 
//                   to="/signup" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                     "hover:from-orange-600 hover:to-amber-600",
//                     "transition-all duration-200 border border-orange-500/30"
//                   )}
//                   aria-label="Sign up"
//                 >
//                   Sign Up
//                 </Link>
//               ) : (
//                 <Link 
//                   to="/login" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gray-800 text-gray-300 border border-gray-700",
//                     "hover:bg-gray-700 hover:text-orange-500 hover:border-orange-500/20",
//                     "transition-all duration-200"
//                   )}
//                   aria-label="Log in"
//                 >
//                   Login
//                 </Link>
//               )}
//             </motion.div>
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.div 
//             className="md:hidden"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <button 
//               onClick={toggleMenu} 
//               className={cn(
//                 "p-2.5 rounded-full text-gray-300",
//                 "hover:bg-gray-700 hover:text-orange-500",
//                 "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//               )}
//               aria-label={isOpen ? "Close menu" : "Open menu"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </motion.div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               variants={menuVariants}
//               initial="closed"
//               animate="open"
//               exit="closed"
//               className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
//             >
//               <div className="py-4 space-y-4">
//                 <div className="relative px-4">
//                   <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
//                     <FaSearch className="h-5 w-5 text-gray-300" />
//                   </div>
//                   <input 
//                     type="search" 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..." 
//                     className={cn(
//                       "w-full pl-12 pr-4 py-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white placeholder-gray-500",
//                       "focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )} 
//                     aria-label="Search"
//                   />
//                   <div className="flex mt-2">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-4 py-1 rounded-l",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-4 py-1 rounded-r",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                 </div>
//                 <Link 
//                   to="/profile" 
//                   className={cn(
//                     "flex items-center px-4 py-3 rounded text-gray-300 font-medium",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                   aria-label="User profile"
//                 >
//                   <FaUserCircle className="text-xl mr-3" />
//                   Profile
//                 </Link>
//                 <div className="px-4">
//                   <select 
//                     value={language} 
//                     onChange={(e) => {
//                       changeLanguage(e.target.value);
//                       setIsOpen(false);
//                     }} 
//                     className={cn(
//                       "w-full p-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )}
//                     aria-label="Select language"
//                   >
//                     {languages.map((lang, index) => (
//                       <option key={index} value={lang.code} className="bg-gray-800 text-white">
//                         {lang.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <Link 
//                   to="/post-question" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Post Question
//                 </Link>
//                 <Link 
//                   to="/ai-assist" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   AI-Assist
//                 </Link>
//                 {!isLoggedIn ? (
//                   <Link 
//                     to="/signup" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 ) : (
//                   <Link 
//                     to="/login" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gray-800 text-gray-300 border border-gray-700",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Log in"
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;





// import Logo from '../../assets/Logo.png';
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext';
// import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from 'framer-motion';

// interface NavbarProps {
//   isLoggedIn?: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
//   const { language, changeLanguage } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAskAI, setIsAskAI] = useState(false);
//   const navigate = useNavigate();

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
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute left-0 mt-1 w-full bg-gray-900 border border-orange-500 rounded shadow-lg p-2"
//                 >
//                   <div className="flex items-center text-gray-400 text-sm mb-1">
//                     <span className="mr-2">⌀</span> Suggested Queries:
//                   </div>

// {isSearchActive && (
//   <motion.div
//     initial={{ opacity: 0, y: -15 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -15 }}
//     transition={{ duration: 0.2, ease: "easeOut" }}
//     className="absolute left-0 mt-1 w-80 bg-gray-900 border border-orange-500 rounded-lg shadow-xl p-3 z-50"
//   >
    
//     <div className="grid grid-cols-2 gap-2">
//       {Array.from({ length: Math.ceil(suggestedQueries.length / 2) }, (_, i) => (
//         <React.Fragment key={i}>
//           <div
//             className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
//             onClick={() => selectQuery(suggestedQueries[i * 2])}
//           >
//             {suggestedQueries[i * 2]}
//           </div>
//           {suggestedQueries[i * 2 + 1] && (
//             <div
//               className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
//               onClick={() => selectQuery(suggestedQueries[i * 2 + 1])}
//             >
//               {suggestedQueries[i * 2 + 1]}
//             </div>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//     <div className="flex mt-3 space-x-1">
//       <button
//         onClick={() => setIsAskAI(false)}
//         className={cn(
//           "px-3 py-1 rounded-l-md text-sm",
//           "bg-gray-800 text-gray-300 hover:bg-gray-700",
//           !isAskAI && "bg-orange-500 text-white"
//         )}
//       >
//         Search
//       </button>
//       <button
//         onClick={handleAskAI}
//         className={cn(
//           "px-3 py-1 rounded-r-md text-sm",
//           "bg-gray-800 text-gray-300 hover:bg-gray-700",
//           isAskAI && "bg-orange-500 text-white"
//         )}
//       >
//         Ask AI
//       </button>
//     </div>
//     <div className="text-xs text-gray-500 text-right mt-2">Powered by Haqdarshak</div>
//   </motion.div>
// )}

//                <div className="flex mt-2">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-4 py-1 rounded-l",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-4 py-1 rounded-r",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                   <div className="text-xs text-gray-400 text-right mt-2">Powered by Haqdarshak</div>
//                 </motion.div>
//               )}
//             </motion.div>
//           </div>

//           {/* Menu Links, Profile, Language, Post Question, AI-Assist, Signup */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/post-question" className="text-gray-300 hover:text-orange-500">Post Question</Link>
//             <Link to="/ai-assist" className="text-gray-300 hover:text-orange-500">AI-Assist</Link>
//             <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//               <Link 
//                 to="/profile" 
//                 className={cn(
//                   "p-2.5 rounded-full text-gray-300",
//                   "hover:bg-gray-700 hover:text-orange-500",
//                   "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//                 )}
//                 aria-label="User profile"
//               >
//                 <FaUserCircle className="text-2xl" />
//               </Link>
//             </motion.div>
//             <div className="relative">
//               <motion.button 
//                 onClick={toggleLanguageDropdown}
//                 className={cn(
//                   "flex items-center space-x-2 px-4 py-2 rounded",
//                   "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                   "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500",
//                   isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20"
//                 )}
//                 whileHover={{ scale: 1.05 }}
//                 aria-expanded={isLanguageOpen}
//                 aria-label="Select language"
//               >
//                 <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                 <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//               </motion.button>
//               <AnimatePresence>
//                 {isLanguageOpen && (
//                   <motion.div 
//                     variants={dropdownVariants}
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     className={cn(
//                       "absolute right-0 mt-2 w-48 py-2 rounded",
//                       "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm"
//                     )}
//                     role="menu"
//                     aria-label="Language selection"
//                   >
//                     {languages.map((lang, index) => (
//                       <motion.button
//                         key={index}
//                         onClick={() => {
//                           changeLanguage(lang.code);
//                           setIsLanguageOpen(false);
//                         }}
//                         className={cn(
//                           "w-full text-left px-4 py-2 text-sm",
//                           "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
//                           "transition-colors duration-150",
//                           language === lang.code && "bg-gray-700 text-orange-500 font-medium"
//                         )}
//                         whileHover={{ x: 5 }}
//                         role="menuitem"
//                       >
//                         {lang.name}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               {!isLoggedIn ? (
//                 <Link 
//                   to="/auth" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                     "hover:from-orange-600 hover:to-amber-600",
//                     "transition-all duration-200 border border-orange-500/30"
//                   )}
//                   aria-label="Sign up"
//                 >
//                   Sign Up
//                 </Link>
//               ) : (
//                 <Link 
//                   to="/login" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gray-800 text-gray-300 border border-gray-700",
//                     "hover:bg-gray-700 hover:text-orange-500 hover:border-orange-500/20",
//                     "transition-all duration-200"
//                   )}
//                   aria-label="Log in"
//                 >
//                   Login
//                 </Link>
//               )}
//             </motion.div>
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.div 
//             className="md:hidden"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <button 
//               onClick={toggleMenu} 
//               className={cn(
//                 "p-2.5 rounded-full text-gray-300",
//                 "hover:bg-gray-700 hover:text-orange-500",
//                 "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//               )}
//               aria-label={isOpen ? "Close menu" : "Open menu"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </motion.div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               variants={menuVariants}
//               initial="closed"
//               animate="open"
//               exit="closed"
//               className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
//             >
//               <div className="py-4 space-y-4">
//                 <div className="relative px-4">
//                   <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
//                     <FaSearch className="h-5 w-5 text-gray-300" />
//                   </div>
//                   <input 
//                     type="search" 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..." 
//                     className={cn(
//                       "w-full pl-12 pr-4 py-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white placeholder-gray-500",
//                       "focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )} 
//                     aria-label="Search"
//                   />
//                   <div className="flex mt-2">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-4 py-1 rounded-l",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-4 py-1 rounded-r",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                 </div>
//                 <Link 
//                   to="/profile" 
//                   className={cn(
//                     "flex items-center px-4 py-3 rounded text-gray-300 font-medium",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                   aria-label="User profile"
//                 >
//                   <FaUserCircle className="text-xl mr-3" />
//                   Profile
//                 </Link>
//                 <div className="px-4">
//                   <select 
//                     value={language} 
//                     onChange={(e) => {
//                       changeLanguage(e.target.value);
//                       setIsOpen(false);
//                     }} 
//                     className={cn(
//                       "w-full p-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )}
//                     aria-label="Select language"
//                   >
//                     {languages.map((lang, index) => (
//                       <option key={index} value={lang.code} className="bg-gray-800 text-white">
//                         {lang.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <Link to='/all-approved-community-posts'  
//                       className={cn(
//                       "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} onClick={() => setIsOpen(false)}>
//                     Community Posts
//                 </Link>
//                 <Link 
//                   to="/post-question" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Post Question
//                 </Link>
//                 <Link 
//                   to="/ai-assist" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   AI-Assist
//                 </Link>
//                 {!isLoggedIn ? (
//                   <Link 
//                     to="/signup" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 ) : (
//                   <Link 
//                     to="/login" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gray-800 text-gray-300 border border-gray-700",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Log in"
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;




// import Logo from '../../assets/Logo.png';
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
// import { cn } from "@/lib/utils";
// import { useLanguage } from '../../Context/LanguageContext';
// import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from 'framer-motion';

// interface NavbarProps {
//   isLoggedIn?: boolean;
// }

// const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
//   const { language, changeLanguage } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAskAI, setIsAskAI] = useState(false);
//   const navigate = useNavigate();

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
//                   <div className="flex mt-3 space-x-1">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-3 py-1 rounded-l-md text-sm",
//                         "bg-gray-800 text-gray-300 hover:bg-gray-700",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-3 py-1 rounded-r-md text-sm",
//                         "bg-gray-800 text-gray-300 hover:bg-gray-700",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                   <div className="text-80  text-red-500 text-right mt-2">Powered by Haqdarshak</div>
//                 </motion.div>
//               )}
//             </motion.div>
//           </div>

//           {/* Menu Links, Profile, Language, Post Question, AI-Assist, Community Posts, Signup */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/all-approved-community-posts" className="text-gray-300 hover:text-orange-500">Community Posts</Link>
//             <Link to="/post-question" className="text-gray-300 hover:text-orange-500">Post Question</Link>
//             <Link to="/ai-assist" className="text-gray-300 hover:text-orange-500">AI-Assist</Link>
//             <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
//               <Link 
//                 to="/profile" 
//                 className={cn(
//                   "p-2.5 rounded-full text-gray-300",
//                   "hover:bg-gray-700 hover:text-orange-500",
//                   "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//                 )}
//                 aria-label="User profile"
//               >
//                 <FaUserCircle className="text-2xl" />
//               </Link>
//             </motion.div>
//             <div className="relative">
//               <motion.button 
//                 onClick={toggleLanguageDropdown}
//                 className={cn(
//                   "flex items-center space-x-2 px-4 py-2 rounded",
//                   "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                   "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500",
//                   isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20"
//                 )}
//                 whileHover={{ scale: 1.05 }}
//                 aria-expanded={isLanguageOpen}
//                 aria-label="Select language"
//               >
//                 <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
//                 <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
//               </motion.button>
//               <AnimatePresence>
//                 {isLanguageOpen && (
//                   <motion.div 
//                     variants={dropdownVariants}
//                     initial="closed"
//                     animate="open"
//                     exit="closed"
//                     className={cn(
//                       "absolute right-0 mt-2 w-48 py-2 rounded",
//                       "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm"
//                     )}
//                     role="menu"
//                     aria-label="Language selection"
//                   >
//                     {languages.map((lang, index) => (
//                       <motion.button
//                         key={index}
//                         onClick={() => {
//                           changeLanguage(lang.code);
//                           setIsLanguageOpen(false);
//                         }}
//                         className={cn(
//                           "w-full text-left px-4 py-2 text-sm",
//                           "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
//                           "transition-colors duration-150",
//                           language === lang.code && "bg-gray-700 text-orange-500 font-medium"
//                         )}
//                         whileHover={{ x: 5 }}
//                         role="menuitem"
//                       >
//                         {lang.name}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               {!isLoggedIn ? (
//                 <Link 
//                   to="/auth" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                     "hover:from-orange-600 hover:to-amber-600",
//                     "transition-all duration-200 border border-orange-500/30"
//                   )}
//                   aria-label="Sign up"
//                 >
//                   Sign Up
//                 </Link>
//               ) : (
//                 <Link 
//                   to="/login" 
//                   className={cn(
//                     "px-6 py-2 rounded font-semibold",
//                     "bg-gray-800 text-gray-300 border border-gray-700",
//                     "hover:bg-gray-700 hover:text-orange-500 hover:border-orange-500/20",
//                     "transition-all duration-200"
//                   )}
//                   aria-label="Log in"
//                 >
//                   Login
//                 </Link>
//               )}
//             </motion.div>
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.div 
//             className="md:hidden"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <button 
//               onClick={toggleMenu} 
//               className={cn(
//                 "p-2.5 rounded-full text-gray-300",
//                 "hover:bg-gray-700 hover:text-orange-500",
//                 "transition-all duration-200 border border-transparent hover:border-orange-500/20"
//               )}
//               aria-label={isOpen ? "Close menu" : "Open menu"}
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </motion.div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               variants={menuVariants}
//               initial="closed"
//               animate="open"
//               exit="closed"
//               className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
//             >
//               <div className="py-4 space-y-4">
//                 <div className="relative px-4">
//                   <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
//                     <FaSearch className="h-5 w-5 text-gray-300" />
//                   </div>
//                   <input 
//                     type="search" 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..." 
//                     className={cn(
//                       "w-full pl-12 pr-4 py-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white placeholder-gray-500",
//                       "focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )} 
//                     aria-label="Search"
//                   />
//                   <div className="flex mt-2">
//                     <button
//                       onClick={() => setIsAskAI(false)}
//                       className={cn(
//                         "px-4 py-1 rounded-l",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         !isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Search
//                     </button>
//                     <button
//                       onClick={handleAskAI}
//                       className={cn(
//                         "px-4 py-1 rounded-r",
//                         "bg-gray-700 text-gray-300 hover:bg-gray-600",
//                         isAskAI && "bg-orange-500 text-white"
//                       )}
//                     >
//                       Ask AI
//                     </button>
//                   </div>
//                 </div>
//                 <Link 
//                   to="/profile" 
//                   className={cn(
//                     "flex items-center px-4 py-3 rounded text-gray-300 font-medium",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                   aria-label="User profile"
//                 >
//                   <FaUserCircle className="text-xl mr-3" />
//                   Profile
//                 </Link>
//                 <div className="px-4">
//                   <select 
//                     value={language} 
//                     onChange={(e) => {
//                       changeLanguage(e.target.value);
//                       setIsOpen(false);
//                     }} 
//                     className={cn(
//                       "w-full p-3 rounded",
//                       "bg-gray-800 border border-gray-700 backdrop-blur-sm",
//                       "text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     )}
//                     aria-label="Select language"
//                   >
//                     {languages.map((lang, index) => (
//                       <option key={index} value={lang.code} className="bg-gray-800 text-white">
//                         {lang.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <Link to='/all-approved-community-posts'  
//                       className={cn(
//                       "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} onClick={() => setIsOpen(false)}>
//                     Community Posts
//                 </Link>
//                 <Link 
//                   to="/post-question" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Post Question
//                 </Link>
//                 <Link 
//                   to="/ai-assist" 
//                   className={cn(
//                     "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
//                     "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                   )} 
//                   onClick={() => setIsOpen(false)}
//                 >
//                   AI-Assist
//                 </Link>
//                 {!isLoggedIn ? (
//                   <Link 
//                     to="/signup" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
//                       "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Sign up"
//                   >
//                     Sign Up
//                   </Link>
//                 ) : (
//                   <Link 
//                     to="/login" 
//                     className={cn(
//                       "block mx-4 px-6 py-3 rounded font-semibold text-center",
//                       "bg-gray-800 text-gray-300 border border-gray-700",
//                       "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
//                     )} 
//                     onClick={() => setIsOpen(false)}
//                     aria-label="Log in"
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;





import Logo from '../../assets/Logo.png';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useLanguage } from '../../Context/LanguageContext';
import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from 'framer-motion';

const Navbar: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskAI, setIsAskAI] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "mr", name: "मराठी" },
  ];

  const suggestedQueries = [
    "How to apply for XYZ scheme",
    "What is Haqdarshak",
    "hello world what is this Platform",
    "How to get help for my business",
    "What are the benefits of using Haqdarshak",
    "How to find government schemes",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchActive(false), 200);
  };

  const handleAskAI = () => {
    setIsAskAI(true);
    navigate('/ai-assist');
  };

  const selectQuery = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    setIsOpen(false);
  };

  const menuVariants = {
    open: { opacity: 1, maxHeight: '24rem', transition: { duration: 0.3, ease: easeInOut } },
    closed: { opacity: 0, maxHeight: 0, transition: { duration: 0.3, ease: easeInOut } },
  };

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.2, ease: easeIn } },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        "sticky top-0 z-50",
        "bg-gray-900",
        "border-b-3 border-orange-500",
        isScrolled ? "shadow-xl py-2" : "shadow-md py-4"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center flex-shrink-0 bg-white h-12 rounded-2xl p-2 ml-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center" aria-label="Home">
              <img 
                src={Logo} 
                alt="Haqdarshak Logo" 
                className="h-10 w-auto max-w-[160px] object-contain transition-all duration-300 filter drop-shadow-md hover:drop-shadow-lg" 
              />
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="relative mx-4 flex-1 max-w-xs">
            <motion.div 
              className="relative w-full group"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
              </div>
              <input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search..." 
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-full",
                  "bg-gray-800 border border-gray-700 text-white",
                  "placeholder-gray-500 text-sm focus:outline-none",
                  "focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                )} 
                aria-label="Search"
              />
              {isSearchActive && (
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 mt-1 w-80 bg-gray-900 border border-orange-500 rounded-lg shadow-xl p-3 z-50"
                >
                  <div className="flex items-center text-gray-400 text-sm mb-1">
                    <span className="mr-2">⌀</span> Suggested Queries:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: Math.ceil(suggestedQueries.length / 2) }, (_, i) => (
                      <React.Fragment key={i}>
                        <div
                          className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => selectQuery(suggestedQueries[i * 2])}
                        >
                          {suggestedQueries[i * 2]}
                        </div>
                        {suggestedQueries[i * 2 + 1] && (
                          <div
                            className="text-gray-300 hover:text-orange-500 cursor-pointer text-sm p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => selectQuery(suggestedQueries[i * 2 + 1])}
                          >
                            {suggestedQueries[i * 2 + 1]}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                    <div className="flex mt-3 space-x-1">
                      <button
                        onClick={() => setIsAskAI(false)}
                        className={cn(
                          "px-3 py-1 rounded-l-md text-sm",
                          "bg-gray-800 text-gray-300 hover:bg-gray-700",
                          !isAskAI && "bg-orange-500 text-white"
                        )}
                      >
                        Search
                      </button>
                      <button
                        onClick={handleAskAI}
                        className={cn(
                          "px-3 py-1 rounded-r-md text-sm",
                          "bg-gray-800 text-gray-300 hover:bg-gray-700",
                          isAskAI && "bg-orange-500 text-white"
                        )}
                      >
                        Ask AI
                      </button>
                    </div>
                    <div className="text-xl  text-red-500 text-right mt-2">Powered by Haqdarshak</div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Menu Links, Profile, Language, Post Question, AI-Assist, Community Posts, Sign Up/Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/all-approved-community-posts" className="text-gray-300 hover:text-orange-500">Community Posts</Link>
              <Link to="/post-question" className="text-gray-300 hover:text-orange-500">Post Question</Link>
              <Link to="/ai-assist" className="text-gray-300 hover:text-orange-500">AI-Assist</Link>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Link 
                  to="/profile" 
                  className={cn(
                    "p-2.5 rounded-full text-gray-300",
                    "hover:bg-gray-700 hover:text-orange-500",
                    "transition-all duration-200 border border-transparent hover:border-orange-500/20"
                  )}
                  aria-label="User profile"
                >
                  <FaUserCircle className="text-2xl" />
                </Link>
              </motion.div>
              <div className="relative">
                <motion.button 
                  onClick={toggleLanguageDropdown}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded",
                    "bg-gray-800 border border-gray-700 backdrop-blur-sm",
                    "text-gray-300 font-medium hover:bg-gray-700 hover:text-orange-500",
                    isLanguageOpen && "bg-gray-700 text-orange-500 border-orange-500/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                  aria-expanded={isLanguageOpen}
                  aria-label="Select language"
                >
                  <span className="text-sm">{languages.find(lang => lang.code === language)?.name || "English"}</span>
                  <FaChevronDown className={cn("h-4 w-4 transition-transform duration-200", isLanguageOpen && "rotate-180")} />
                </motion.button>
                <AnimatePresence>
                  {isLanguageOpen && (
                    <motion.div 
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className={cn(
                        "absolute right-0 mt-2 w-48 py-2 rounded",
                        "bg-gray-800 shadow-lg border border-gray-700 backdrop-blur-sm"
                      )}
                      role="menu"
                      aria-label="Language selection"
                    >
                      {languages.map((lang, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsLanguageOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm",
                            "hover:bg-gray-700 text-gray-300 hover:text-orange-500",
                            "transition-colors duration-150",
                            language === lang.code && "bg-gray-700 text-orange-500 font-medium"
                          )}
                          whileHover={{ x: 5 }}
                          role="menuitem"
                        >
                          {lang.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "px-6 py-2 rounded font-semibold ",
                      "bg-red-700 text-gray-300 border border-gray-700",
                      "hover:bg-gray-700 hover:text-orange-500 hover:border-orange-500/20",
                      "transition-all duration-200"
                    )}
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/auth" 
                    className={cn(
                      "px-6 py-2 rounded font-semibold",
                      "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                      "hover:from-orange-600 hover:to-amber-600",
                      "transition-all duration-200 border border-orange-500/30"
                    )}
                    aria-label="Sign up"
                  >
                    Sign Up
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={toggleMenu} 
                className={cn(
                  "p-2.5 rounded-full text-gray-300",
                  "hover:bg-gray-700 hover:text-orange-500",
                  "transition-all duration-200 border border-transparent hover:border-orange-500/20"
                )}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
                className="md:hidden overflow-hidden border-t border-gray-700 mt-4"
              >
                <div className="py-4 space-y-4">
                  <div className="relative px-4">
                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-300" />
                    </div>
                    <input 
                      type="search" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..." 
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded",
                        "bg-gray-800 border border-gray-700 backdrop-blur-sm",
                        "text-white placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-orange-500"
                      )} 
                      aria-label="Search"
                    />
                    <div className="flex mt-2">
                      <button
                        onClick={() => setIsAskAI(false)}
                        className={cn(
                          "px-4 py-1 rounded-l",
                          "bg-gray-700 text-gray-300 hover:bg-gray-600",
                          !isAskAI && "bg-orange-500 text-white"
                        )}
                      >
                        Search
                      </button>
                      <button
                        onClick={handleAskAI}
                        className={cn(
                          "px-4 py-1 rounded-r",
                          "bg-gray-700 text-gray-300 hover:bg-gray-600",
                          isAskAI && "bg-orange-500 text-white"
                        )}
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className={cn(
                      "flex items-center px-4 py-3 rounded text-gray-300 font-medium",
                      "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                    )} 
                    onClick={() => setIsOpen(false)}
                    aria-label="User profile"
                  >
                    <FaUserCircle className="text-xl mr-3" />
                    Profile
                  </Link>
                  <div className="px-4">
                    <select 
                      value={language} 
                      onChange={(e) => {
                        changeLanguage(e.target.value);
                        setIsOpen(false);
                      }} 
                      className={cn(
                        "w-full p-3 rounded",
                        "bg-gray-800 border border-gray-700 backdrop-blur-sm",
                        "text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      )}
                      aria-label="Select language"
                    >
                      {languages.map((lang, index) => (
                        <option key={index} value={lang.code} className="bg-gray-800 text-white">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Link to='/all-approved-community-posts'  
                        className={cn(
                        "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
                        "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                      )} onClick={() => setIsOpen(false)}>
                      Community Posts
                  </Link>
                  <Link 
                    to="/post-question" 
                    className={cn(
                      "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
                      "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                    )} 
                    onClick={() => setIsOpen(false)}
                  >
                    Post Question
                  </Link>
                  <Link 
                    to="/ai-assist" 
                    className={cn(
                      "block mx-4 px-4 py-3 rounded text-gray-300 font-medium text-center",
                      "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                    )} 
                    onClick={() => setIsOpen(false)}
                  >
                    AI-Assist
                  </Link>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "block mx-4 px-6 py-3 rounded font-semibold text-center",
                        "bg-gray-800 text-gray-300 border border-gray-700",
                        "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                      )}
                      aria-label="Log out"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link 
                      to="/auth" 
                      className={cn(
                        "block mx-4 px-6 py-3 rounded font-semibold text-center",
                        "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                        "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                      )} 
                      onClick={() => setIsOpen(false)}
                      aria-label="Sign up"
                    >
                      Sign Up
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    );
};

export default Navbar;