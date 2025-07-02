import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaQuestionCircle, FaRobot, FaNewspaper, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="md:hidden p-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white">
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24}  />}
        </button>
      </div>

      <div className={`fixed top-16 left-0 bottom-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-black text-white p-4 border-l border-t border-4 border-red-700`}>
        <div className="flex  flex-col h-full mt-12">
          {/* <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Haqdarshak</h1>
          </div> */}
          <nav className="flex-1 ">
            <ul className="space-y-5">
              <li>
                <Link to="/" className="flex  items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaHome />
                  <span>Home</span>
                </Link>
              </li>
               <li>
                <Link to="/" className="flex  items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaHome />
                  <span>Leaderboard</span>
                </Link>
              </li>
              <li>
                <li>
                <Link to="/profile" className="flex mb-5 items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaUserCircle  />
                  <span>Profile</span>
                </Link>
              </li>
              <li></li>
                <Link to="/post-question" className="flex items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaQuestionCircle />
                  <span>Post Questions</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-assist" className="flex items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaRobot />
                  <span>AI Chatbot</span>
                </Link>
              </li>
              <li>
                <Link to="/all-approved-community-posts" className="flex items-center text-2xl space-x-2 p-2 rounded hover:bg-gray-800">
                  <FaNewspaper />
                  <span>Questions</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-4">
            <div className="p-2">
              <h2 className="font-bold">Community</h2>
              <p className="text-sm">Communities for your favorite post ,schems policy .</p>
              <button className="text-orange-400 hover:underline">Explore all Posts </button>
            </div>
            <div className="p-2">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">TEAMS</h2>
                <button className="text-orange-400">+</button>
              </div>
              <p className="text-sm">Ask questions, find answers and collaborate at work with HaqDarshak for Teams.</p>
              <button className="bg-orange-500 mb-8 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full mt-2">
                 Haqdarshak 
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar2;
