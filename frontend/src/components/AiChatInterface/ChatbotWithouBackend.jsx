
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MessageSquareText, Settings, HelpCircle, ChevronDown, Menu, PenLine, FileText, Loader2, Volume2, MicOff } from 'lucide-react';


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


// Component to display a single message with audio support
const MessageBubble = ({ role, content, mergedAudioData }) => {
  // Clean and format the content for better display
  const formatContent = (text) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*([^*]+)\*/g, '$1')     // Remove italic markdown
      .replace(/\*{3,}/g, '')           // Remove multiple asterisks
      .replace(/^\*+/gm, '•')           // Convert leading asterisks to bullets
      .replace(/\n\s*\n/g, '\n\n')      // Clean up excessive line breaks
      .trim();
  };


  const formattedContent = formatContent(content);


  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-xl text-white ${
        role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
      } text-base break-words`}>
        <div className="whitespace-pre-line leading-relaxed">{formattedContent}</div>
        {role === 'model' && mergedAudioData && (
          <div className="mt-3 p-2 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Audio Response:</div>
            <audio 
              controls 
              className="w-full h-8"
              style={{ filter: 'sepia(1) hue-rotate(200deg) brightness(0.8)' }}
            >
              <source src={mergedAudioData} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};


// Chatbot component with speech functionality
const Chatbot = ({ loggedInUser, onLogout }) => {
  const [query, setQuery] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);


  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);


  // Speech-related state
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  
  // API Keys - In production, these should be stored securely
  const SARVAM_API_KEY = 'sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI';
  const GEMINI_API_KEY = 'AIzaSyAXzmHm2OTvvjtUmDyQNy-tgDlslaxbOEo';


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


  // Function to merge multiple base64 audio chunks into a single audio file
  const mergeAudioChunks = async (audioChunks) => {
    try {
      console.log(`Merging ${audioChunks.length} audio chunks...`);
      
      if (audioChunks.length === 0) {
        return null;
      }
      
      if (audioChunks.length === 1) {
        return `data:audio/wav;base64,${audioChunks[0]}`;
      }

      // Convert base64 to ArrayBuffers
      const audioBuffers = audioChunks.map(chunk => {
        const binaryString = atob(chunk);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      });

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffers = [];

      // Decode all audio buffers
      for (const buffer of audioBuffers) {
        try {
          const audioBuffer = await audioContext.decodeAudioData(buffer.slice());
          decodedBuffers.push(audioBuffer);
        } catch (error) {
          console.error('Error decoding audio chunk:', error);
          continue;
        }
      }

      if (decodedBuffers.length === 0) {
        console.error('No valid audio buffers to merge');
        return null;
      }

      // Calculate total length and create merged buffer
      const totalLength = decodedBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
      const numberOfChannels = decodedBuffers[0].numberOfChannels;
      const sampleRate = decodedBuffers[0].sampleRate;
      
      const mergedBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);

      // Copy data from all buffers
      let offset = 0;
      for (const buffer of decodedBuffers) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          mergedBuffer.getChannelData(channel).set(channelData, offset);
        }
        offset += buffer.length;
      }

      // Convert merged buffer to WAV blob
      const wavBlob = await audioBufferToWav(mergedBuffer);
      
      // Convert blob to data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(wavBlob);
      });

    } catch (error) {
      console.error('Error merging audio chunks:', error);
      // Fallback: return the first chunk if merging fails
      return audioChunks.length > 0 ? `data:audio/wav;base64,${audioChunks[0]}` : null;
    }
  };

  // Function to convert AudioBuffer to WAV Blob
  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;
    
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };


  // Speech-to-text function
  const speechToText = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'saarika:v2.5');
    formData.append('language_code', 'unknown');


    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });


    if (!response.ok) {
      throw new Error(`Speech-to-text API error: ${response.status}`);
    }


    return await response.json();
  };


  // Text-to-speech function with chunking support
  const textToSpeech = async (text) => {
    try {
      // Clean the text before sending to TTS
      const cleanedText = text
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*([^*]+)\*/g, '$1')     // Remove italic markdown
        .replace(/\*{3,}/g, '')           // Remove multiple asterisks
        .replace(/^\*+/gm, '')            // Remove leading asterisks
        .replace(/[#\[\]]/g, '')          // Remove other markdown characters
        .trim();


      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [cleanedText.substring(0, 500)], // API limit is 500 chars
          target_language_code: 'hi-IN', // Changed back to Hindi
          //anushka, abhilash, manisha, vidya, arya, karun, 
          speaker: 'manisha',
          model: 'bulbul:v2',
          enable_preprocessing: true,
          speech_sample_rate: 8000
        })
      });


      if (!response.ok) {
        const errorData = await response.text();
        console.error('TTS API Error Response:', errorData);
        throw new Error(`Text-to-speech API error: ${response.status} - ${errorData}`);
      }


      const data = await response.json();
      return data.audios && data.audios[0] ? data.audios[0] : null;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  };


  // Function to split text into chunks and convert each to speech
  const textToSpeechComplete = async (text) => {
    try {
      // Clean the text
      const cleanedText = text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\*{3,}/g, '')
        .replace(/^\*+/gm, '')
        .replace(/[#\[\]]/g, '')
        .trim();


      // Split text into chunks of ~400 characters (leaving buffer for API limit)
      const chunks = [];
      const maxChunkSize = 400;
      
      if (cleanedText.length <= maxChunkSize) {
        chunks.push(cleanedText);
      } else {
        // Try to split at sentence boundaries
        const sentences = cleanedText.split(/[।\.\!\?]+/).filter(s => s.trim());
        let currentChunk = '';
        
        for (const sentence of sentences) {
          const trimmedSentence = sentence.trim();
          if ((currentChunk + trimmedSentence).length <= maxChunkSize) {
            currentChunk += (currentChunk ? '। ' : '') + trimmedSentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk + '।');
              currentChunk = trimmedSentence;
            } else {
              // If single sentence is too long, split it
              chunks.push(trimmedSentence.substring(0, maxChunkSize));
              currentChunk = trimmedSentence.substring(maxChunkSize);
            }
          }
        }
        
        if (currentChunk) {
          chunks.push(currentChunk + '।');
        }
      }


      console.log(`Converting ${chunks.length} chunks to speech:`, chunks);


      // Convert each chunk to speech
      const audioChunks = [];
      for (let i = 0; i < chunks.length; i++) {
        try {
          const audioData = await textToSpeech(chunks[i]);
          if (audioData) {
            audioChunks.push(audioData);
          }
          // Add a small delay between API calls to avoid rate limiting
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Error converting chunk ${i + 1} to speech:`, error);
          // Continue with other chunks even if one fails
        }
      }

      // Merge all audio chunks into a single audio file
      const mergedAudioData = await mergeAudioChunks(audioChunks);
      return mergedAudioData;

    } catch (error) {
      console.error('Complete text-to-speech error:', error);
      return null;
    }
  };


  // Handle voice recording
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };


  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsProcessingSpeech(true);
    }
  };


  // Process audio with speech-to-text and generate AI response
  const processAudio = async (audioBlob) => {
    try {
      // Step 1: Transcribe audio
      const transcription = await speechToText(audioBlob);
      
      if (!transcription || !transcription.transcript) {
        alert('Could not understand the audio. Please try again.');
        setIsProcessingSpeech(false);
        return;
      }


      // Set the transcribed text as query and send it
      setQuery(transcription.transcript);
      await handleSendQuery(transcription.transcript, true);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Error processing audio. Please try again.');
    } finally {
      setIsProcessingSpeech(false);
    }
  };


  const detectGreeting = (text) => {
  const greetings = [
    'hello', 'hi', 'hey', 'hola', 'namaste', 'namaskar',
    'how are you', 'how r u', 'what is your name', 'whats your name',
    'who are you', 'what are you', 'introduce yourself',
    'good morning', 'good afternoon', 'good evening'
  ];
  
  const lowerText = text.toLowerCase().trim();
  return greetings.some(greeting => lowerText.includes(greeting));
};


  const handleSendQuery = async (inputQuery = null, includeAudio = false) => {
    const queryText = inputQuery || query;
    if (!queryText.trim()) return;


    const userMessage = { id: Date.now(), role: 'user', content: queryText };
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
      const chatHistoryForAPI = [{ role: "user", parts: [{ text: queryText }] }];
      const payload = { contents: chatHistoryForAPI };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


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


      // Generate merged audio for the response if this was a voice query
      let mergedAudioData = null;
      if (includeAudio) {
        try {
          console.log('Generating complete merged audio response...');
          mergedAudioData = await textToSpeechComplete(modelResponseContent);
          console.log('Generated merged audio:', mergedAudioData ? 'Success' : 'Failed');
        } catch (audioError) {
          console.error("Error generating audio:", audioError);
          // Continue without audio if TTS fails
          mergedAudioData = null;
        }
      }


      const modelMessage = { 
        id: Date.now() + 1, 
        role: 'model', 
        content: modelResponseContent,
        mergedAudioData: mergedAudioData
      };
      
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
    }
  };


  return (
    <div className="flex h-screen bg-[#202123] text-white font-inter overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          flex flex-col bg-[#25262B] p-4 shadow-lg transition-all duration-300 ease-in-out h-full
          ${isMobileView 
            ? `fixed inset-y-0 z-30 ${sidebarExpanded ? 'left-0 w-64' : '-left-64'}`
            : `relative ${sidebarExpanded ? 'w-64' : 'w-20'}`
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
            <span className="text-xl font-semibold text-gray-300 ml-4 md:ml-0">Haqdarshak</span>
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
          <span className="text-xl font-semibold text-gray-300">Haqdarshak</span>
          <IconButton icon={Search} onClick={() => console.log('Search chats')} title="Search chats" />
        </div>


        {/* Output Display Area */}
         <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
//           {currentMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-4">
                  Hello, {loggedInUser ? (loggedInUser.name || loggedInUser.email) : 'Guest'}!
                </h1>
                <p className="text-gray-400 text-lg">Start a conversation by typing or using voice input</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 justify-end">
              {currentMessages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  role={msg.role} 
                  content={msg.content} 
                  audioData={msg.audioData}
                  mergedAudioData={msg.mergedAudioData}
                />
              ))}
              {(loading || isProcessingSpeech) && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-700 px-4 py-2 rounded-xl text-white text-base">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-400 inline-block mr-2" /> 
                    {isProcessingSpeech ? 'Processing speech...' : 'Thinking...'}
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
              disabled={loading || isRecording || isProcessingSpeech}
            />
            <Input
              type="text"
              placeholder="Enter your query or use voice..."
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-base md:text-lg text-gray-200 placeholder-gray-500 mx-2 h-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading && !isRecording && !isProcessingSpeech) {
                  handleSendQuery();
                }
              }}
              disabled={loading || isRecording || isProcessingSpeech}
            />
            <IconButton
              icon={isRecording ? MicOff : Mic}
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Voice input"}
              className={`ml-2 ${isRecording ? 'bg-red-600 text-white animate-pulse' : ''}`}
              disabled={loading || isProcessingSpeech}
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


