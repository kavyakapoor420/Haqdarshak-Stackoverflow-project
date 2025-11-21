// "use client"

// interface Testimonial {
//   id: number
//   logo: string
//   logoColor: string
//   quote: string
//   author: string
//   title: string
//   borderStyle?: "solid" | "dotted"
// }

// interface TestimonialWallProps {
//   testimonials: Testimonial[]
// }

// const TestimonialWall = ({ testimonials }: TestimonialWallProps) => {
//   const duplicatedTestimonials = [...testimonials, ...testimonials]

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-16">
//       {/* Header Section */}
//       <div className="text-center mb-16 relative">
//         <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-4">TRUSTED BY THE BEST</p>
//         <h1 className="text-5xl font-bold text-gray-900 text-balance relative inline-block">
//           The Wall of Words
//           <div className="absolute top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2">
//             <svg className="w-24 h-12 text-blue-500" viewBox="0 0 96 48" fill="none">
//               <path d="M10 10 Q 40 35 80 20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="3,3" />
//               <path d="M75 18 L80 20 L77 25" stroke="currentColor" strokeWidth="2" fill="none" />
//             </svg>
//             <span className="absolute left-[100%] bottom-[40%] text-blue-500 text-sm font-medium tracking-wide leading-snug text-left whitespace-nowrap">
//               Trending Posts Accessible to all
//               <br />
//                So now you can too contribute! 
//             </span>
//           </div>
//         </h1>
//       </div>

//       <div className="relative overflow-hidden">
//         <div className="flex animate-scroll">
//           {duplicatedTestimonials.map((testimonial, index) => (
//             <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-80 px-4">
//               <div
//                 className={`bg-gray-50 rounded-2xl p-8 h-118 flex flex-col justify-between shadow-sm transition-shadow duration-300 ${
//                   testimonial.borderStyle === "dotted"
//                     ? "border-2 border-dashed border-gray-300"
//                     : "border border-gray-200"
//                 }`}
//               >
//                 {/* Logo */}
//                 <div className="mb-6">
//                   <div
//                     className={`w-12 h-12 ${testimonial.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}
//                   >
//                     {testimonial.logo}
//                   </div>
//                 </div>

//                 {/* Quote */}
//                 <div className="flex-1 mb-8">
//                   <p className="text-gray-700 text-base leading-relaxed">{testimonial.quote}</p>
//                 </div>

//                 {/* Author Info */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-1">{testimonial.author}</h4>
//                   <p className="text-xs text-gray-500 uppercase tracking-wide">{testimonial.title}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }




// const testimonialData = [
//   {
//     id: 1,
//     logo: "a",
//     logoColor: "bg-red-600",
//     quote:
//       "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
//     author: "Amol Nahar",
//     title: "Yojana Card:Transforming How Indians Access Social Security ",
//     borderStyle: "solid" as const,
//   },
//   {
//     id: 2,
//     logo: "✝",
//     logoColor: "bg-blue-500",
//     quote: "We admire juspay for its great UI and consistent experience across our Web, Android, and iOS platforms! ",
//     author: "Mohsin Batla",
//     title: "DIRECTOR OF GROWTH, TRAVCLAN",
//     borderStyle: "solid" as const,
//   },
//   {
//     id: 3,
//     logo: "bb",
//     logoColor: "bg-green-600",
//     quote:
//       "Juspay has been more of a partner to us than just a vendor. The breadth of knowledge that they bring to the table as far as the payments space is concerned has been impressive!",
//     author: "Prashant Aiyar",
//     title: "PRODUCT, BIGBASKET",
//     borderStyle: "dotted" as const,
//   },
//   {
//     id: 4,
//     logo: "💡",
//     logoColor: "bg-orange-500",
//     quote:
//       "Our teams have always worked together to achieve a better payment experience for our customers. Swiggy conversion rates are a benchmark for the industry and Juspay has been a key ally for us in this journey.",
//     author: "Vikrant Lele",
//     title: "DIRECTOR FINANCE, SWIGGY",
//     borderStyle: "solid" as const,
//   },
//   {
//     id: 5,
//     logo: "one",
//     logoColor: "bg-black",
//     quote:
//       "The platform is user-friendly and has made a significant impact on streamlining our repayments and driving key success metrics",
//     author: "Kaushal Singh",
//     title: "PRODUCT LEAD, ONECARD",
//     borderStyle: "solid" as const,
//   },
// ]



// export default function Home() {
//   return (
//     <main className="min-h-screen bg-white py-16">
//       <TestimonialWall testimonials={testimonialData} />
//     </main>
//   )
// }


"use client"
import React from 'react'

interface Testimonial {
  id: number
  logo: string
  logoColor: string
  quote: string
  author: string
  title: string
  borderStyle?: "solid" | "dotted"
}

interface TestimonialWallProps {
  testimonials: Testimonial[]
}

const TestimonialWall = ({ testimonials }: TestimonialWallProps) => {
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    // The main container now has a gradient background and the repeating grid pattern from the landing page.
    <div className="min-h-screen relative overflow-hidden">
      {/* Grid Background Pattern from Landing Page */}
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
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <p className="text-sm font-bold tracking-widest uppercase mb-4 text-orange-600  ">TRUSTED BY THE BEST</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-balance relative text-gray-900  inline-block">
            The Wall of Words
            <div className="absolute top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2">
              <svg className="w-24 h-12 text-orange-500" viewBox="0 0 96 48" fill="none">
                <path d="M10 10 Q 40 35 80 20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="3,3" />
                <path d="M75 18 L80 20 L77 25" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span className="absolute left-[100%] bottom-[40%] text-blue-500 text-sm font-medium tracking-wide leading-snug text-left whitespace-nowrap">
                Trending Posts Accessible to all
                <br />
                So now you can too contribute! 
              </span>
            </div>
          </h1>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-80 px-4">
                <div
                  className={`bg-white rounded-2xl p-8 h-118 flex flex-col justify-between shadow-sm transition-shadow duration-300 ${
                    testimonial.borderStyle === "dotted"
                      ? "border-2 border-dashed border-gray-300"
                      : "border border-gray-200"
                  }`}
                >
                  {/* Logo */}
                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 ${testimonial.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {testimonial.logo}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex-1 mb-8">
                    <p className="text-gray-700 text-base leading-relaxed">{testimonial.quote}</p>
                  </div>

                  {/* Author Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{testimonial.author}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const testimonialData = [
  {
    id: 1,
    logo: "a",
    logoColor: "bg-red-600",
    quote:
      "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
    author: "Amol Nahar",
    title: "Yojana Card:Transforming How Indians Access Social Security ",
    borderStyle: "solid" as const,
  },
  {
    id: 2,
    logo: "kk",
    logoColor: "bg-red-600",
    quote:
      "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
    author: "Amol Nahar",
    title: "Yojana Card:Transforming How Indians Access Social Security ",
    borderStyle: "solid" as const,
  },
  {
    id: 3,
      logo: "GG",
    logoColor: "bg-yellow-600",
    quote:
      "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
    author: "Amol Nahar",
    title: "Yojana Card:Transforming How Indians Access Social Security ",
    borderStyle: "solid" as const,
  },
  {
    id: 4,
     logo: "r",
    logoColor: "bg-green-600",
    quote:
      "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
    author: "Amol Nahar",
    title: "Yojana Card:Transforming How Indians Access Social Security ",
    borderStyle: "solid" as const,
  },
  {
    id: 5,
   logo: "m",
    logoColor: "bg-black",
    quote:
      "The Yojana Card is a physical card that will help you not only discover the welfare schemes you are eligible for but also get you the support you need to unlock their benefits.  your eligibility information is securely saved to discover welfare schemes.",
    author: "Amol Nahar",
    title: "Yojana Card:Transforming How Indians Access Social Security ",
    borderStyle: "solid" as const,
  },
]

export default function TestimonialSection() {
  return (
    <main className="min-h-screen">
      <TestimonialWall testimonials={testimonialData} />
    </main>
  )
}
