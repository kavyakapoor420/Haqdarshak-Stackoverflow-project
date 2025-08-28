

//multingual FAQSection page 



import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle, Users, Award } from "lucide-react";
import { useLanguage } from  '../Context/LanguageContext'
import translations from '../translations/faq-translation.json'

export default function FAQSection() {
  const { language } = useLanguage();
  const [openItem, setOpenItem] = useState(null)
  const t = translations[language] || translations['en'];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  // const faqIcons = {
  //   Platform: <HelpCircle className="w-5 h-5" />,
  //   Community: <Users className="w-5 h-5" />,
  //   Rewards: <Award className="w-5 h-5" />,
  //   Guidelines: <MessageCircle className="w-5 h-5" />,
  // };

  return (
    <div className="min-h-screen relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {t.header.title}
            </h1>
          </div>
          <p className="text-slate-700 text-xl max-w-3xl mx-auto leading-relaxed">
            {t.header.description.split(' ').slice(0, -1).join(' ')}
            <span className="text-orange-600 font-semibold"> {t.header.description.split(' ').slice(-1)}</span>
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">24/7</div>
              <div className="text-sm text-slate-500">{t.header.stats.support}</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">100%</div>
              <div className="text-sm text-slate-500">{t.header.stats.verified}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {t.faq.map((faq, index) => {
            const isOpen = openItem === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white/95 backdrop-blur-sm border border-orange-200/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-300/50 transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* <div className="px-6 pt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                    {/* {[faq.category] || <HelpCircle className="w-5 h-5" />} */}
                    {/* <span>{faq.category}</span>
                  </div> */}
                {/* // </div> */} 

                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 pt-4 text-left hover:bg-orange-50/50 transition-all duration-300 group/button"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-slate-800 group-hover/button:text-orange-700 transition-colors leading-tight">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                            : "bg-orange-100 text-orange-600 group-hover/button:bg-orange-200"
                        }`}
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-orange-200/50 pt-4">
                      <p className="text-slate-600 leading-relaxed text-lg">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              {/* <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div> */}
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-800">{t.cta.title}</h3>
                <p className="text-slate-600">{t.cta.subtitle}</p>
              </div>
            </div>

            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                {t.cta.joinButton}
              </button>
              <button className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm">
                {t.cta.contactButton}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-orange-200">
              <div className="text-center">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div> */}
                <h4 className="font-semibold text-slate-800 mb-1">{t.cta.options.chat}</h4>
                <p className="text-sm text-slate-600">{t.cta.options.chatDesc}</p>
              </div>
              <div className="text-center">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div> */}
                <h4 className="font-semibold text-slate-800 mb-1">{t.cta.options.forum}</h4>
                <p className="text-sm text-slate-600">{t.cta.options.forumDesc}</p>
              </div>
              <div className="text-center">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div> */}
                <h4 className="font-semibold text-slate-800 mb-1">{t.cta.options.help}</h4>
                <p className="text-sm text-slate-600">{t.cta.options.helpDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}