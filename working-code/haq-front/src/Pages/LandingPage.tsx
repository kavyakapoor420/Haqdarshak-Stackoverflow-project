
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ArrowRight, Globe, BarChart3, Shield } from "lucide-react";
import { TypewriterText } from "../components/Common/TypeWritingEffect";
import { Footer } from "../components/Common/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AgentImage from "../assets/Agent.png";
import SampleImage from "../assets/SampleImage.png";
import SampleImage2 from "../assets/SampleImage2.png";
import TestimonialSection from "../TestimonialSection";
import FAQSection from '../Sections/FAQ-Section'
import DemoVideoSection from "@/Sections/DemoVideoSection";

export default function LandingPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const sourceUrl = "https://www.youtube.com/watch?v=OVMYaLT0xL0";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Haqdarshak
                  </span>
                  <br />
                  {t("landing.welcome")}
                </h1>

                <div className="text-xl lg:text-2xl text-gray-700 font-medium min-h-[3rem]">
                  <TypewriterText
                    texts={t("landing.typewriterTexts", { returnObjects: true }) as string[]}
                    speed={100}
                    deleteSpeed={50}
                    delayBetweenTexts={2000}
                  />
                </div>

                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  {t("landing.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/post-question" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="bg-[#1677ff] text-white font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#135ecc] transition"
                    >
                      {t("landing.postQuestion")}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/all-approved-community-posts" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-3 border border-black bg-[#f0f7ff] text-black font-semibold px-8 py-3 rounded-md shadow-[0_4px_0_#0b2b48] hover:bg-[#e1efff] transition tracking-wider"
                    >
                      {t("landing.exploreKnowledgeBase")}
                      <span className="bg-[#1677ff] text-white rounded-full p-2 flex items-center justify-center">
                        ▶
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-orange-200">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    40K+
                  </div>
                  <div className="text-sm text-gray-600">{t("landing.stats.trainedAgents")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    9
                  </div>
                  <div className="text-sm text-gray-600">{t("landing.stats.yearsExperience")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    100+
                  </div>
                  <div className="text-sm text-gray-600">{t("landing.stats.activeSchemes")}</div>
                </div>
              </div>
            </div>

            {/* <div className="relative">
              <div className="grid grid-cols-2 gap-6 h-[600px]">
                <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={AgentImage}
                    alt={t("landing.communityCollaborationTitle")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{t("landing.communityCollaborationTitle")}</h3>
                      <p className="text-sm text-gray-600">{t("landing.communityCollaborationDescription")}</p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={SampleImage}
                    alt={t("landing.aiPoweredAssistance")}
                    className="w-full h-full object-cover"
                  />
                </div>

BOSE

                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm border border-orange-100">
                  <img
                    src={SampleImage2}
                    alt={t("landing.knowledgeBase")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                </div>
              </div> */}



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
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{t('landing.communityCollaborationTitle')}</h3>
                      <p className="text-sm text-gray-600">{t('landing.communityCollaborationDescription')}</p>
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

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 animate-pulse delay-1000" />
            </div>
          </div>
        </div>

        <DemoVideoSection videoUrl={sourceUrl} />
        <TestimonialSection />
        <FAQSection />
        <Footer />
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







               
