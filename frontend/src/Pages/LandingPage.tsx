import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ArrowRight, Globe, BarChart3, Shield } from "lucide-react";
import { TypewriterText } from '../components/Common/TypeWritingEffect'
import { Footer } from  '../components/Common/Footer'
import { Link } from "react-router-dom";
import { useLanguage } from '../Context/LanguageContext'
import translations from '../translations/translation.json'
import AgentImage from '../assets/Agent.png';
import SampleImage from  '../assets/SampleImage.png'
import SampleImage2 from '../assets/SampleImage2.png'
import FeaturePage from "./FeaturePage";
import FAQSection from "../Sections/FAQ-Section";
import ScrollAnimation from "@/Sections/ScrollAnimationSection";
import Nav from '../Nav'
import TestimonialSection from "@/TestimonialSection";


export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const sourceUrl='https://www.youtube.com/watch?v=OVMYaLT0xL0'


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Grid Background Pattern */}
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

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Haqdarshak
                  </span>
                  <br />
                  {t.welcome}
                </h1>

                <div className="text-xl lg:text-2xl text-gray-700 font-medium min-h-[3rem]">
                  <TypewriterText
                    texts={t.typewriterTexts}
                    speed={100}
                    deleteSpeed={50}
                    delayBetweenTexts={2000}
                  />
                </div>

                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  {t.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/post-question" className="w-full sm:w-auto" >
                    {/* <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
                    > */}
                      {/* <button className="bg-[#1677ff] text-white font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#135ecc] transition"> */}
                      <button className="flex items-center  bg-[#1677ff] text-white font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#135ecc] transition">
                      {t.postQuestion}
                      {/* <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /> */}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                    {/* </Button> */}
                        </button>
                  </Link>
                  <Link to="/all-approved-community-posts" className="w-full sm:w-auto" >
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  > */}
                   <button className="flex items-center gap-3 border border-black bg-[#f0f7ff] text-black font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#e1efff] transition tracking-wider">
                       {t.exploreKnowledgeBase}
                   <span className="bg-[#1677ff] text-white rounded-full p-2 flex items-center justify-center">
                     ▶
                    </span>
                   </button>
                 
                  {/* </Button> */}
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-orange-200">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    40K+
                  </div>
                  <div className="text-sm text-gray-600">{t.stats.trainedAgents}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    9
                  </div>
                  <div className="text-sm text-gray-600">{t.stats.yearsExperience}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    100+
                  </div>
                  <div className="text-sm text-gray-600">{t.stats.activeSchemes}</div>
                </div>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 h-[600px]">
                {/* Main large image - Top spanning both columns */}
                <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={AgentImage}
                    alt="Haqdarshak agents working together"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{t.communityCollaborationTitle}</h3>
                      <p className="text-sm text-gray-600">{t.communityCollaborationDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom left image */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={SampleImage}
                    alt="AI-powered assistance"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom right image */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={SampleImage2}
                    alt="Knowledge base and resources"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 animate-pulse delay-1000" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        {/* <div className="bg-white/60 backdrop-blur-sm border-t border-orange-200">
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
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t.empoweringAgents}{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {t.AiTEXT}{" "}
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.builtForAgents}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Globe className="h-8 w-8" />}
                title={t.features.multilingualSupport.title}
                description={t.features.multilingualSupport.description}
                gradient="from-orange-500 to-amber-500"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title={t.features.verifiedContent.title}
                description={t.features.verifiedContent.description}
                gradient="from-amber-500 to-orange-500"
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title={t.features.analyticsDashboard.title}
                description={t.features.analyticsDashboard.description}
                gradient="from-orange-600 to-amber-600"
              />
            </div>
          </div>
        </div> */}
 
        {/* <FeaturePage/> */}
        {/* <ScrollAnimation/> */}
         <Nav videoUrl={sourceUrl}/>
         <TestimonialSection/>
       <FAQSection/>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-200">
      <div
        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
