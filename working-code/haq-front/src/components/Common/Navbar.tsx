

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
            {/* <motion.div
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
            </motion.div> */}

            <motion.div
              className="flex items-center flex-shrink-0 bg-white h-10 sm:h-12 rounded-2xl p-1 sm:p-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center" aria-label="Home">
                <img
                  src={HAQImage}
                  alt="Haqdarshak Logo"
                  className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[160px] object-contain transition-all duration-300 filter drop-shadow-md hover:drop-shadow-lg"
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