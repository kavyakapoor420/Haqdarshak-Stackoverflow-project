import Logo from '../../assets/Logo.png';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useLanguage } from  '../Context/LanguageContext'
import { motion, AnimatePresence, easeIn, easeOut, easeInOut } from 'framer-motion';

const Navbar = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskAI, setIsAskAI] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

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

interface Language {
    code: string;
    name: string;
}

interface SuggestedQueryProps {
    query: string;
}

const selectQuery = (query: string): void => {
    setSearchQuery(query);
    setIsSearchActive(false);
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
        "border-b border-orange-500",
        isScrolled ? "shadow-xl py-2" : "shadow-md py-4"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
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
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-1 w-full bg-gray-900 border border-orange-500 rounded shadow-lg p-2"
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
                  <div className="text-xs text-gray-500 text-right mt-2">Powered by Haqdarshak</div>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/create-post" className="text-gray-300 hover:text-orange-500">Post Question</Link>
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
            {token ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className={cn(
                    "px-6 py-2 rounded font-semibold",
                    "bg-gray-800 text-gray-300 border border-gray-700",
                    "hover:bg-gray-700 hover:text-orange-500 hover:border-orange-500/20",
                    "transition-all duration-200"
                  )}
                  aria-label="Log in"
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); setToken(null); }}
                >
                  Logout
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className={cn(
                    "px-6 py-2 rounded font-semibold",
                    "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                    "hover:from-orange-600 hover:to-amber-600",
                    "transition-all duration-200 border border-orange-500/30"
                  )}
                  aria-label="Log in"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

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
                <Link 
                  to="/create-post" 
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
                {token ? (
                  <Link 
                    to="/login" 
                    className={cn(
                      "block mx-4 px-6 py-3 rounded font-semibold text-center",
                      "bg-gray-800 text-gray-300 border border-gray-700",
                      "hover:bg-gray-700 hover:text-orange-500 transition-all duration-200"
                    )} 
                    onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); setToken(null); setIsOpen(false); }}
                    aria-label="Logout"
                  >
                    Logout
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className={cn(
                      "block mx-4 px-6 py-3 rounded font-semibold text-center",
                      "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                      "hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                    )} 
                    onClick={() => setIsOpen(false)}
                    aria-label="Login"
                  >
                    Login
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