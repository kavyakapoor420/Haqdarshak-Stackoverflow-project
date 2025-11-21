// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaHome, FaUserCircle, FaQuestionCircle, FaRobot, FaNewspaper, FaBars, FaTimes } from 'react-icons/fa';

// const Sidebar2 = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white h-16 flex items-center">
//         <button onClick={toggleSidebar} className="focus:outline-none">
//           {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//         </button>
//       </div>

//       {/* Backdrop for mobile when sidebar is open */}
//       {isOpen && (
//         <div 
//           className="md:hidden fixed inset-0 top-16 bg-black/50 z-30"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div 
//         className={`fixed top-16 left-0 bottom-0 w-64 bg-black text-white p-4 border-r border-4 border-red-700
//           transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
//           md:translate-x-0 transition-transform duration-200 ease-in-out z-40
//           md:z-10 md:border-t-0`}
//       >
//         <div className="flex flex-col h-full">
//           <nav className="flex-1 mt-4">
//             <ul className="space-y-5">
//               <li>
//                 <Link 
//                   to="/" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaHome />
//                   <span>Home</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/leaderboard" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaHome />
//                   <span>Leaderboard</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/agents" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaHome />
//                   <span>Agents</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/profile" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaUserCircle />
//                   <span>Profile</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/post-question" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaQuestionCircle />
//                   <span>Post Questions</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/ai-assist" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaRobot />
//                   <span>AI Chatbot</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link 
//                   to="/all-approved-community-posts" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaNewspaper />
//                   <span>Questions</span>
//                 </Link>
//               </li>
//                <li>
//                 <Link 
//                   to="/redeem-rewards" 
//                   className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaHome />
//                   <span>Redeem Rewards</span>
//                 </Link>
//               </li>
//               <li></li>
//             </ul>
//           </nav>
//           <div className="mt-4">
//             <div className="p-2">
//               <h2 className="font-bold">Community</h2>
//               <p className="text-sm">Communities for your favorite posts, schemes, and policies.</p>
//               <button className="text-orange-400 hover:underline">Explore all Posts</button>
//             </div>
//             <div className="p-2">
//               <div className="flex justify-between items-center">
//                 <h2 className="font-bold">TEAMS</h2>
//                 <button className="text-orange-400">+</button>
//               </div>
//               <p className="text-sm">Ask questions, find answers, and collaborate at work with HaqDarshak for Teams.</p>
//               <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full mt-2">
//                 Haqdarshak
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar2;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaQuestionCircle, FaRobot, FaNewspaper, FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Sidebar2 = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white h-16 flex items-center">
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 top-16 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-16 left-0 bottom-0 w-64 bg-black text-white p-4 border-r border-4 border-red-700
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-200 ease-in-out z-40
          md:z-10 md:border-t-0`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 mt-4">
            <ul className="space-y-5">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome />
                  <span>{t('sidebar.home')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome />
                  <span>{t('sidebar.leaderboard')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/agents" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome />
                  <span>{t('sidebar.agents')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle />
                  <span>{t('sidebar.profile')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/post-question" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaQuestionCircle />
                  <span>{t('sidebar.postQuestion')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/ai-assist" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaRobot />
                  <span>{t('sidebar.aiChatbot')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/all-approved-community-posts" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaNewspaper />
                  <span>{t('sidebar.questions')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/redeem-rewards" 
                  className="flex items-center text-xl space-x-2 p-2 rounded hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome />
                  <span>{t('sidebar.redeemRewards')}</span>
                </Link>
              </li>
              <li></li>
            </ul>
          </nav>
          <div className="mt-4">
            <div className="p-2">
              <h2 className="font-bold">{t('sidebar.community.title')}</h2>
              <p className="text-sm">{t('sidebar.community.description')}</p>
              <button className="text-orange-400 hover:underline">{t('sidebar.community.explore')}</button>
            </div>
            <div className="p-2">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">{t('sidebar.teams.title')}</h2>
                <button className="text-orange-400">+</button>
              </div>
              <p className="text-sm">{t('sidebar.teams.description')}</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full mt-2">
                {t('sidebar.teams.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar2;