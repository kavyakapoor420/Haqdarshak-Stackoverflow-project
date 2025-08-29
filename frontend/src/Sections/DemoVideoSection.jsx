"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom";
import { ArrowRight } from 'lucide-react'
import {useTranslation} from 'react-i18next'

// Function to extract YouTube video ID from a URL
const getYouTubeVideoId = (url) => {
  if (!url) {
    return null;
  }
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? match[1] : null;
};

const DemoVideoSection = ({ videoUrl = '/demo-video.mp4' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const {t}=useTranslation() 

  const isYouTube = getYouTubeVideoId(videoUrl);

  const toggleVideo = () => {
    if (!isYouTube && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Grid Background Pattern - Matching the LandingPage.jsx */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading - Updated text and color to match the LandingPage */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
           {t("videoSection.header")}
            </span>
            <br />
            <span className="text-gray-900">{t("videoSection.subheader")}</span>
          </h1>

          {/* Subheading - Updated text and color to match the LandingPage */}
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            {t("videoSection.description")}
          </p>

          {/* Button - Updated to match the LandingPage button style */}
          <div className="relative mb-16">
            {/* Animated Circles - Changed color to match the theme */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-orange-400 rounded-full animate-pulse opacity-30"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-orange-400 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Main Button */}
            <div className="relative z-10">
              <Link to={'/all-approved-community-posts'}>
                <button className="flex items-center gap-3 mx-auto bg-[#1677ff] text-white font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#135ecc] transition">
                   {t("videoSection.mainButton")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Video Container - ADJUSTED WIDTH AND HEIGHT */}
          <div className="relative max-w-6xl mx-auto">
            {/* Glow Effects - Changed color to match the theme */}
            <div className="absolute -inset-4 bg-orange-500/20 rounded-2xl blur-xl"></div>
            <div className="absolute -inset-2 bg-amber-400/30 rounded-xl blur-lg"></div>

            {/* Main Video Container */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              {/* Logo and Branding - Updated to match the provided code */}
              <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
                <span className="text-black bg-orange-400 rounded-3xl p-2 font-bold text-xl">HAQDARSHAK</span>
              </div>

              {/* Dynamic Video Element */}
              {isYouTube ? (
                <iframe
                  className="w-full h-[450px] md:h-[600px] object-cover"
                  src={`https://www.youtube.com/embed/${isYouTube}?autoplay=0&modestbranding=1&rel=0`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                ></iframe>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-[450px] md:h-[600px] object-cover"
                  poster="/dark-technology-dashboard-interface.png"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Video Overlay Content - Conditional rendering */}
              {!isYouTube && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                  {/* Main Text - Changed to match the new theme */}
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light mb-2">Empowering Welfare Agents</h2>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-4">with Ai Powered Knowledge</h2>
                    <p className="text-gray-300 text-lg md:text-xl">Built for agents, by agents.</p>
                  </div>

                  {/* Action Button - Changed to match the new theme */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-8 h-8 border-2 border-gray-900 rounded-full border-t-transparent"></div>
                    </div>
                    <button className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                      Launch your first Meshery design pattern
                    </button>
                  </div>

                  {/* Play Button */}
                  <button onClick={toggleVideo} className="group relative">
                    <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                      {isPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-8 bg-gray-900 rounded"></div>
                          <div className="w-2 h-8 bg-gray-900 rounded"></div>
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-l-[16px] border-l-gray-900 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoSection;


