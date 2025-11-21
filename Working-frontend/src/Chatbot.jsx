
import { useState } from "react";
import axios from "axios";
import { MessageCircle, Bot, Send, X } from "lucide-react";

const Chatbot = () => {
  const API_KEY = "AIzaSyCsA7wL-Xusb21c8oS37CQ9FpwlSGtQf_k";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle user message submission
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Record user message
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Enriched query
      const enrichedQuery = `
You are an AI-powered chatbot specializing in Web3 investments, blockchain automation, and AI-driven financial management. You provide expert insights on the Hive AI-based auto-investing bot, its features, smart contract execution, and how AI predicts high-potential tokens. You also answer general investment and financial queries, including portfolio management, crypto trading, and decentralized finance.

If a user asks about this website, explain its functionalities, such as AI-driven investment strategies, real-time token tracking, and smart contract automation. If the user requests advanced insights, mention the premium version.

For general queries unrelated to finance, investments, or this website, provide a helpful response.

User Query: ${input}
`;

      const response = await axios.post(
        // "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,        {
          contents: [
            {
              parts: [{ text: enrichedQuery }],
            },
          ],
        },
        {
          params: { key: API_KEY },
          headers: { "Content-Type": "application/json" },
        }
      );

      const botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching AI response:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong. Please check your input or try again later!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition"
        >
          <Bot size={40} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-gradient-to-br from-purple-900 to-purple-700 text-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-purple-600">
            <h2 className="text-lg font-semibold">SamaySetu ChatBot</h2>
            <button onClick={toggleChat} className="text-gray-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 space-y-3 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user" ? "bg-purple-500 ml-auto w-fit" : "bg-gray-800 w-fit"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-300">Typing...</div>}
          </div>

          {/* Input Field */}
          <div className="p-3 border-t border-purple-600 flex items-center">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-purple-800 text-white rounded-lg outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
