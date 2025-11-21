import Feature1 from '../assets/Feature1.png'

const FeaturePage = () => {
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-900/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-900/30 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24 md:py-32 lg:py-[10rem]">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text mb-4 leading-tight">
            Advanced{' '}
            <span className="font-semibold">
              Functionality
            </span>{' '}
            <br />
            Flawless{' '}
            <span className="font-semibold">
              Integration
            </span>
          </h1>
          <p className="text-orange-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4 leading-relaxed">
            Built for agents, by agents. Our AGENT Community platform combines institutional knowledge with community wisdom to solve real-world welfare scheme challenges
          </p>
        </div>

        {/* Feature Section  */}

        {/* Feature 1  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-left p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r text-black from-orange-500 to-amber-600 bg-clip-text mb-4">
              1. Verified Content
            </h2>
            <p className="text-gray-800/90 text-sm sm:text-base leading-relaxed">
              Quality-assured answers through community rating and admin workflows. Ask any questions and get answers in your prefred language  and solve your query and earn some rewards for yoru meanigfull contributions . 
            </p>
          </div>
          <div className="flex justify-center">
            <img
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              src={Feature1}
              alt="Hide User Feature"
            />
          </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center mt-40">

        <div className="flex justify-center">
            <img
              className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              src={Feature1}
              alt="Hide User Feature"
            />
          </div>

          <div className="text-left p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r text-black from-orange-500 to-amber-600 bg-clip-text mb-4">
              2. AI-Powered Interface
            </h2>
            <p className="text-gray-800/90 text-sm sm:text-base leading-relaxed">
              Quality-assured answers through community rating and admin workflows. Ask any questions and get answers in your prefred language  and solve your query and earn some rewards for yoru meanigfull contributions . 
            </p>
          </div>
         
        </div>

      </div>
    </div>
  );
};

export default FeaturePage;