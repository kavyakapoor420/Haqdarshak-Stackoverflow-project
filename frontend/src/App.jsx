



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import LandingPage from './Pages/LandingPage'
import  {LanguageProvider}  from './Context/LanguageContext';
import Navbar from  './components/Common/Navbar'
import Chatbot from './components/AiChatInterface/Chatbot';
import PostQuestionPage from './Pages/PostQuestionPage';
import CommunityPostPage from './Pages/CommunityPostPage';
import KnowledgeBasePage from './Pages/KnowledgePage';
import PostDetail from './Pages/PostDetailPage';
import AdminDashboard from './AdminDash/AdminDashboard';
import UserProfilePage from './Pages/UserProfilePage';
import Leaderboard from './Sections/LeaderBoard';
import AutoCompleteSearchBar from './components/SearchBar/AutoCompleteSearchBar';
import SearchAgentsPage from './Pages/SearchAgentsPage';
import RewardsRedeemSection from './Sections/RewardRedeemSection';
import Hello from './Hello.jsx';







const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));



  return (
    <Router>
      <LanguageProvider>
        <Navbar />
        
        <Routes>
    
          <Route path="/auth" element={<AuthPage setToken={setToken} setRole={setRole} />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />} />
          <Route path="/profile2" element={token ? <UserProfile /> : <Navigate to="/auth" />} />
          <Route path="/post/:postId" element={token ? <PostDetail /> : <Navigate to="/auth" />} />
          <Route path="/ai-assist" element={token ? <Chatbot token={token} /> : <Navigate to="/auth" />} />
          <Route path="/post-question" element={token ? <PostQuestionPage /> : <Navigate to="/auth" />} />
          <Route path="/all-approved-community-posts" element={<CommunityPostPage />} />
          <Route path='/post/:postId' element={<PostDetail/>}/>
          <Route path='/profile' element={token ? <UserProfilePage/> : <Navigate to='/auth'/>}/>
          <Route path='/leaderboard' element={token ? <Leaderboard/> : <Navigate to='/auth'/>}/>
          <Route path='/agents' element={<SearchAgentsPage/>}/>
          <Route path='/redeem-rewards' element={<RewardsRedeemSection/>}/>
        </Routes>
          {/* <Hello/> */}
      </LanguageProvider>
    </Router>
  );
};




const UserProfile = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    };
    fetchNotifications();
  }, [token]);

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
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Your Notifications</h2>
        <div className="space-y-6">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-white/95 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-300">
              <p className="text-gray-800 mb-2">{notification.message}</p>
              {notification.comment && (
                <p className="text-red-600 mb-2">Rejection Reason: {notification.comment}</p>
              )}
              <p className="text-sm text-gray-500">Post: {notification.postId?.title || 'Post deleted'}</p>
              <p className="text-sm text-gray-500">Date: {new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

