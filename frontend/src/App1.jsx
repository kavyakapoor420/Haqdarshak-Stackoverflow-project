import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from  './Context/LanguageContext'
import Navbar from  './component2/Navbar'
import LandingPage from './component2/LandingPage'
import CreatePost from './component2/CreatePost'
import AdminPosts from './component2/AdminPosts'
import ViewAllPosts from './component2/viewAllPosts'
import UserProfile from './component2/UserProfile'
import Login from './component2/'
import Register from './components/Register';
import Chatbot from './components/AiChatInterface/Chatbot';
import Footer from './components/Common/Footer';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  return (
    <Router>
      <LanguageProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-post" element={token ? <CreatePost /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token && role === 'admin' ? <AdminPosts /> : <Navigate to="/login" />} />
          <Route path="/posts" element={token ? <ViewAllPosts /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="/post/:postId" element={token ? <ViewAllPosts /> : <Navigate to="/login" />} />
          <Route path="/ai-assist" element={<Chatbot />} />
        </Routes>
        <Footer />
      </LanguageProvider>
    </Router>
  );
};

export default App;