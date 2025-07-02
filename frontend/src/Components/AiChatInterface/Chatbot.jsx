import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MessageSquareText, Settings, HelpCircle, ChevronDown, Menu, PenLine, FileText, Loader2 } from 'lucide-react';


const Button = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = '', type = 'text', ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const IconButton = ({ icon: Icon, onClick, className = '', title = '', ...props }) => (
  <button
    className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${className}`}
    onClick={onClick}
    title={title}
    {...props}
  >
    <Icon className="h-5 w-5 text-gray-400" />
  </button>
);

const ChatHistoryItem = ({ title, onClick, isActive }) => (
  <div
    className={`flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer text-gray-300 ${isActive ? 'bg-gray-700' : ''}`}
    onClick={onClick}
  >
    <MessageSquareText className="h-5 w-5 mr-3" />
    <span className="truncate">{title}</span>
  </div>
);

// Component to display a single message
const MessageBubble = ({ role, content }) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[70%] px-4 py-2 rounded-xl text-white ${
      role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
    } text-base break-words`}>
      {content}
    </div>
  </div>
);

// Chatbot component now accepts loggedInUser and onLogout as props
const Chatbot = ({ loggedInUser, onLogout }) => {
  const [query, setQuery] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobileView(newIsMobile);
      if (!newIsMobile && sidebarExpanded) {
        setSidebarExpanded(false);
      }
      if (newIsMobile && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarExpanded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: query };
    const updatedCurrentMessages = [...currentMessages, userMessage];
    setCurrentMessages(updatedCurrentMessages);
    setQuery('');
    setLoading(true);

    let newChatId = currentChatId;
    let updatedChatSessions = [...chatSessions];

    if (newChatId === null) {
      newChatId = `chat-${Date.now()}`;
      const newSession = {
        id: newChatId,
        title: userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : ''),
        messages: [userMessage],
      };
      updatedChatSessions = [newSession, ...chatSessions];
    } else {
      updatedChatSessions = updatedChatSessions.map(session =>
        session.id === newChatId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      );
    }
    setChatSessions(updatedChatSessions);
    setCurrentChatId(newChatId);

    try {
      const chatHistoryForAPI = [{ role: "user", parts: [{ text: query }] }];
      const payload = { contents: chatHistoryForAPI };
      const apiKey = "AIzaSyAXzmHm2OTvvjtUmDyQNy-tgDlslaxbOEo"; // Canvas will provide this, keep it empty
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      let modelResponseContent = "Hello from HaQdarshak. Could not get a response. Please try again.";

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        modelResponseContent = result.candidates[0].content.parts[0].text;
      }

      const modelMessage = { id: Date.now() + 1, role: 'model', content: modelResponseContent };
      setCurrentMessages(prev => [...prev, modelMessage]);

      setChatSessions(prev =>
        prev.map(session =>
          session.id === newChatId
            ? { ...session, messages: [...session.messages, modelMessage] }
            : session
        )
      );

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = { id: Date.now() + 1, role: 'model', content: "Hello from HaQdarshak. An error occurred while fetching the response." };
      setCurrentMessages(prev => [...prev, errorMessage]);
      setChatSessions(prev =>
        prev.map(session =>
          session.id === newChatId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentMessages([]);
    setQuery('');
    if (isMobileView) {
      setSidebarExpanded(false);
    }
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    setCurrentMessages(chatSessions.find(session => session.id === chatId)?.messages || []);
    if (isMobileView) {
      setSidebarExpanded(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrentMessages(prev => [...prev, { id: Date.now(), role: 'user', content: `File selected: ${file.name}` }]);
      // In a real app, you would handle file upload logic here
    }
  };

  return (
    <div className="flex h-screen bg-[#202123] text-white font-inter overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          flex flex-col bg-[#25262B] p-4 shadow-lg transition-all duration-300 ease-in-out h-full
          ${isMobileView // Mobile styles
            ? `fixed inset-y-0 z-30 ${sidebarExpanded ? 'left-0 w-64' : '-left-64'}`
            : `relative ${sidebarExpanded ? 'w-64' : 'w-20'}` // Desktop styles
          }
        `}
        onMouseEnter={() => !isMobileView && setSidebarExpanded(true)}
        onMouseLeave={() => !isMobileView && setSidebarExpanded(false)}
      >
        {/* Toggle button and App Name */}
        <div className="flex items-center justify-center md:justify-start mb-6">
          {isMobileView && (
            <IconButton
              icon={Menu}
              onClick={() => setSidebarExpanded(prev => !prev)}
              title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="mr-2"
            />
          )}
          {(!isMobileView || sidebarExpanded) && (
            <span className="text-xl font-semibold text-gray-300 ml-4 md:ml-0">App Name</span>
          )}
        </div>

        {/* New Chat Button */}
        <div className="mb-6">
          <Button
            className="w-full flex items-center justify-start bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg"
            onClick={handleNewChat}
          >
            <PenLine className="h-5 w-5 mr-3" />
            {sidebarExpanded && 'New chat'}
          </Button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {(sidebarExpanded && chatSessions.length > 0) && <h3 className="text-gray-400 text-sm font-semibold mb-3 px-4">Recent</h3>}
          <div className="space-y-1">
            {chatSessions.map((session) => (
              <ChatHistoryItem
                key={session.id}
                title={session.title}
                onClick={() => handleSelectChat(session.id)}
                isActive={session.id === currentChatId}
              />
            ))}
            {chatSessions.length > 0 && sidebarExpanded && (
              <Button className="w-full flex items-center justify-start text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg bg-transparent">
                Show more <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Settings and Help */}
        <div className="space-y-2 border-t border-gray-700 pt-4">
          <Button className="w-full flex items-center justify-start text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg bg-transparent">
            <Settings className="h-5 w-5 mr-3" />
            {sidebarExpanded && 'Settings and help'}
          </Button>
          {/* Logout button uses the onLogout prop */}
          <Button className="w-full flex items-center justify-start bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg" onClick={onLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            {sidebarExpanded && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileView && sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={() => setSidebarExpanded(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
                    ${isMobileView && sidebarExpanded ? 'ml-64' : 'ml-0'}
                    ${!isMobileView && (sidebarExpanded ? 'md:ml-64' : 'md:ml-20')}
      `}>
        {/* Top bar for mobile/collapsed sidebar */}
        <div className="flex items-center justify-between p-4 bg-[#25262B] md:hidden shadow-lg">
          <IconButton icon={Menu} onClick={() => setSidebarExpanded(true)} />
          <span className="text-xl font-semibold text-gray-300">App Name</span>
          <IconButton icon={Search} onClick={() => console.log('Search chats')} title="Search chats" />
        </div>

        {/* Output Display Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
          {currentMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Hello, {loggedInUser ? (loggedInUser.name || loggedInUser.email) : 'Guest'}!
              </h1>
            </div>
          ) : (
            <div className="flex flex-col flex-1 justify-end">
              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-700 px-4 py-2 rounded-xl text-white text-base">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-400 inline-block mr-2" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="p-4 md:p-8 bg-[#202123] flex justify-center items-end ">
          <div className="w-full max-w-2xl bg-[#25262B] rounded-3xl flex items-center p-2 shadow-2xl border border-gray-700 min-h-[60px] md:min-h-[72px]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <IconButton
              icon={FileText}
              onClick={handleFileUploadClick}
              title="Upload file"
              className="mr-2"
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Enter your query..."
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-base md:text-lg text-gray-200 placeholder-gray-500 mx-2 h-full resize-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSendQuery();
                }
              }}
              disabled={loading}
            />
            <IconButton
              icon={Mic}
              onClick={() => console.log('Voice input')}
              title="Voice input"
              className="ml-2"
              disabled={loading}
            />
          </div>
        </div>
      </div>
      {/* Custom scrollbar style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #25262B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
