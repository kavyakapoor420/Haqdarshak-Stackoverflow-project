

import Haqdarshak from '../assets/Haqdarshak.png'
"use client"

const companies = [
//   { name: "Purple", logo: Haqdarshak},
//   { name: "RSi Redstamp", logo: "/placeholder.svg?height=40&width=80&text=RSi" },
//   { name: "Selkirk", logo: "/placeholder.svg?height=40&width=80&text=Selkirk" },
//   { name: "SolarJetPro", logo: "/placeholder.svg?height=40&width=80&text=SolarJet" },
//   { name: "Dolly", logo: "/placeholder.svg?height=40&width=80&text=Dolly" },
//   { name: "CleverTap", logo: "/placeholder.svg?height=40&width=80&text=CleverTap" },
//   { name: "DR", logo: "/placeholder.svg?height=40&width=80&text=DR" },
//   { name: "TechCorp", logo: "/placeholder.svg?height=40&width=80&text=TechCorp" },
//   { name: "InnovateLab", logo: "/placeholder.svg?height=40&width=80&text=Innovate" },
//   { name: "DataFlow", logo: "/placeholder.svg?height=40&width=80&text=DataFlow" },

   { name: "Purple", logo: Haqdarshak},
  { name: "RSi Redstamp"},
  { name: "Selkirk" },
  { name: "SolarJetPro"},
  { name: "Dolly"},
  { name: "CleverTap" },
  { name: "DR"},
  { name: "TechCorp"},
  { name: "InnovateLab"},
  { name: "DataFlow" },
]

export default function CompanyLogosScroll() {
  return (
    <div className="bg-slate-900 py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Trusted by 40K+  agents  
          </h2>
          <p className="text-slate-400">Join with thousands of agent and start contributing from today  </p>
        </div>

        {/* Single Row Scrolling Logos */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-900 to-transparent z-10" />

          <div className="flex overflow-hidden">
            <div className="flex animate-scroll-smooth">
              {/* First set of logos */}
              {companies.map((company, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  <img
                    src={company.logo }
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain filter brightness-0 invert"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {companies.map((company, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  {/* <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain filter brightness-0 invert"
                  /> */}
                </div>
              ))}
              {/* Third set for extra smoothness */}
              {companies.map((company, index) => (
                <div
                  key={`third-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center justify-center w-24 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  {/* <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full object-contain filter brightness-0 invert"
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes scroll-smooth {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }

          .animate-scroll-smooth {
            animation: scroll-smooth 40s linear infinite;
          }

          /* Pause animation on hover */
          .animate-scroll-smooth:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  )
}
