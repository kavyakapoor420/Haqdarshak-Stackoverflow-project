"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqData = [
  {
    id: 1,
    question: "What is the Haqdarshak Platform?",
    answer:
      "Haqdarshak is an innovative agent community platform where agents can freely post questions, share knowledge, and connect with fellow professionals. It's a space designed to foster collaboration, learning, and growth within our agent network without relying on AI assistance.",
  },
  {
    id: 2,
    question: "How can I contribute to the community?",
    answer:
      "You can contribute by posting insightful questions, providing helpful answers to other agents' queries, sharing your expertise and experiences, engaging in meaningful discussions, and helping build a supportive community environment. Every interaction helps strengthen our network.",
  },
  {
    id: 3,
    question: "What rewards can I earn and how do I redeem them?",
    answer:
      "Active participation earns you reward points through posting quality content, receiving upvotes, helping other agents, and engaging with the community. These points can be redeemed for various benefits, exclusive access to resources, recognition badges, and special community privileges.",
  },
  {
    id: 4,
    question: "Can I ask anything on this platform?",
    answer:
      "You can ask any professional question, seek advice, share challenges, discuss industry trends, or request guidance from fellow agents. Our platform encourages open dialogue and knowledge sharing within our community guidelines, all powered by human expertise rather than AI.",
  },
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden py-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">FAQs on Haqdarshak Platform</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about our agent community platform
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqData.map((faq, index) => {
            const isOpen = openItems.includes(faq.id)

            return (
              <div
                key={faq.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left hover:bg-slate-700/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white group-hover:text-slate-100 transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-slate-700/50 pt-4">
                      <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
            <p className="text-slate-300 mb-6">
              Join our community and connect with fellow agents who are ready to help!
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
