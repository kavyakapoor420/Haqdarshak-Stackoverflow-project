import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    Haqdarshak
                  </span>
                </h2>
                <p className="text-orange-200 leading-relaxed">
                  Empowering 40,000+ welfare agents across India with AI-powered knowledge sharing and community-driven
                  insights for better scheme implementation.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-200 hover:text-white hover:bg-orange-700/50 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-200 hover:text-white hover:bg-orange-700/50 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-200 hover:text-white hover:bg-orange-700/50 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-200 hover:text-white hover:bg-orange-700/50 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-amber-300">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/ai-assist"
                    className="text-orange-200 hover:text-white transition-colors flex items-center group"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 group-hover:text-amber-300" />
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/knowledge-base"
                    className="text-orange-200 hover:text-white transition-colors flex items-center group"
                  >
                    <BookOpen className="h-4 w-4 mr-2 group-hover:text-amber-300" />
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="text-orange-200 hover:text-white transition-colors flex items-center group"
                  >
                    <Users className="h-4 w-4 mr-2 group-hover:text-amber-300" />
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analytics"
                    className="text-orange-200 hover:text-white transition-colors flex items-center group"
                  >
                    <BarChart3 className="h-4 w-4 mr-2 group-hover:text-amber-300" />
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-amber-300">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="text-orange-200 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-orange-200 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-orange-200 hover:text-white transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/training" className="text-orange-200 hover:text-white transition-colors">
                    Training Materials
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-orange-200 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-amber-300">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-orange-200 text-sm">
                    123 Knowledge Street
                    <br />
                    Mumbai, Maharashtra 400001
                    <br />
                    India
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                  <span className="text-orange-200 text-sm">+91 98765 43210</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                  <span className="text-orange-200 text-sm">support@haqdarshak.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-orange-700/50" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-orange-200 text-sm">
              © 2024 Haqdarshak. All rights reserved. Empowering welfare agents across India.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-orange-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-orange-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-orange-200 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}