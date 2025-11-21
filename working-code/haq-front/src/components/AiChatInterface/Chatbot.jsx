

"use client"

import { useState, useEffect, useRef } from "react"
import {
  Mic,
  MessageSquareText,
  Settings,
  ChevronDown,
  Menu,
  PenLine,
  Loader2,
  MicOff,
  Languages,
  Globe,
} from "lucide-react"

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const IconButton = ({ icon: Icon, onClick, className = "", title = "", ...props }) => (
  <button
    className={`p-2 rounded-full hover:bg-gray-600 transition-colors ${className}`}
    onClick={onClick}
    title={title}
    {...props}
  >
    <Icon className="h-5 w-5 text-gray-300" />
  </button>
)

const ChatHistoryItem = ({ title, onClick, isActive }) => (
  <div
    className={`flex items-center px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer text-gray-200 ${
      isActive ? "bg-gray-600" : ""
    }`}
    onClick={onClick}
  >
    <MessageSquareText className="h-5 w-5 mr-3" />
    <span className="truncate">{title}</span>
  </div>
)

const LanguageBadge = ({ language }) => {
  const languageNames = {
    "en-IN": "English",
    "hi-IN": "हिंदी",
    "bn-IN": "বাংলা",
    "gu-IN": "ગુજરાતી",
    "kn-IN": "ಕನ್ನಡ",
    "ml-IN": "മലയാളം",
    "mr-IN": "मराठी",
    "or-IN": "ଓଡ଼ିଆ",
    "pa-IN": "ਪੰਜਾਬੀ",
    "ta-IN": "தமிழ்",
    "te-IN": "తెలుగు",
    "ur-IN": "اردو",
  }

  return (
    <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
      {languageNames[language] || language}
    </span>
  )
}

const MessageBubble = ({ id, role, content, mergedAudioData, detectedLanguage, translatedQuery, onFeedback }) => {
  const [feedback, setFeedback] = useState(null)

  const formatContent = (text) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\*{3,}/g, "")
      .replace(/^\*+/gm, "•")
      .replace(/\n\s*\n/g, "\n\n")
      .trim()
  }

  const formattedContent = formatContent(content)

  const handleFeedback = (type) => {
    setFeedback(type)
    if (onFeedback) {
      onFeedback(id, type)
    }
  }

  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-[80%] px-6 py-4 rounded-2xl text-white shadow-lg ${
          role === "user"
            ? "bg-gradient-to-br from-blue-500 to-blue-700 rounded-br-none border border-blue-400/30"
            : "bg-gradient-to-br from-gray-700 to-gray-900 rounded-bl-none border border-gray-500/50"
        } text-base break-words backdrop-blur-md`}
      >
        {role === "user" && detectedLanguage && detectedLanguage !== "en-IN" && (
          <div className="mb-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-400/20 text-blue-100 text-xs font-medium border border-blue-300/30">
              <Globe className="w-3 h-3 mr-1" />
              <LanguageBadge language={detectedLanguage} />
            </div>
          </div>
        )}

        <div
          className="whitespace-pre-line leading-7 text-[15px]"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        {role === "user" && translatedQuery && translatedQuery !== content && (
          <div className="mt-4 p-4 bg-blue-400/10 rounded-xl border-l-3 border-blue-300 backdrop-blur-md">
            <div className="text-xs text-blue-200 font-semibold mb-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              Translated Query
            </div>
            <div className="text-sm text-blue-100 font-medium">{translatedQuery}</div>
          </div>
        )}

        {role === "model" && mergedAudioData && (
          <div className="mt-4 p-4 bg-gray-800/60 rounded-xl border border-gray-500/50 backdrop-blur-md">
            <div className="flex items-center text-xs text-gray-200 mb-3 font-medium">
              <Mic className="w-4 h-4 mr-2 text-blue-300" />
              Audio Response
            </div>
            <audio
              controls
              className="w-full h-12 rounded-lg"
              style={{
                filter: "sepia(1) hue-rotate(190deg) brightness(0.95)",
                background: "rgba(55, 65, 81, 0.7)",
              }}
            >
              <source src={mergedAudioData} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {role === "model" && (
          <div className="flex items-center justify-end mt-5 pt-4 border-t border-gray-500/30">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleFeedback("like")}
                className={`group p-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  feedback === "like"
                    ? "bg-green-500/20 text-green-300 shadow-md shadow-green-400/20"
                    : "hover:bg-gray-600/30 text-gray-300 hover:text-green-300"
                }`}
                title="Like this response"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-105"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </button>
              <button
                onClick={() => handleFeedback("dislike")}
                className={`group p-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  feedback === "dislike"
                    ? "bg-red-500/20 text-red-300 shadow-md shadow-red-400/20"
                    : "hover:bg-gray-600/30 text-gray-300 hover:text-red-300"
                }`}
                title="Dislike this response"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-105"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Chatbot = ({ loggedInUser, onLogout, token }) => {
  const [query, setQuery] = useState("")
  const [currentMessages, setCurrentMessages] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [chatSessions, setChatSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false)
  const [username, setUsername] = useState(loggedInUser?.username || "Guest")
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [messageIdCounter, setMessageIdCounter] = useState(0)
  const [supportedLanguages, setSupportedLanguages] = useState({})
  const [showLanguageInfo, setShowLanguageInfo] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const SARVAM_API_KEY = "sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI"

  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          setUsername(data.username)
        } else {
          console.error("Error fetching user profile:", data.message)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          setChatSessions(
            data.map((chat) => ({
              id: chat._id,
              title: chat.title,
              messages: chat.messages.map((msg) => ({
                ...msg,
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              })),
            })),
          )
        } else {
          console.error("Error fetching chats:", data.message)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }

    const fetchSupportedLanguages = async () => {
      try {
        const response = await fetch("http://localhost:8000/supported-languages")
        const data = await response.json()
        if (data.success) {
          setSupportedLanguages(data.language_mapping)
        }
      } catch (error) {
        console.error("Error fetching supported languages:", error)
      }
    }

    if (token) {
      fetchUserProfile()
      fetchChats()
      fetchSupportedLanguages()
    }
  }, [token])

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobileView(newIsMobile)
      if (!newIsMobile && sidebarExpanded) {
        setSidebarExpanded(false)
      }
      if (newIsMobile && sidebarExpanded) {
        setSidebarExpanded(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarExpanded])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages])

  const generateUniqueId = () => {
    setMessageIdCounter((prev) => prev + 1)
    return `msg-${Date.now()}-${messageIdCounter}`
  }

  const mergeAudioChunks = async (audioChunks) => {
    try {
      console.log(`Merging ${audioChunks.length} audio chunks...`)
      if (audioChunks.length === 0) {
        return null
      }
      if (audioChunks.length === 1) {
        return `data:audio/wav;base64,${audioChunks[0]}`
      }
      const audioBuffers = audioChunks.map((chunk) => {
        const binaryString = atob(chunk)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes.buffer
      })
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const decodedBuffers = []
      for (const buffer of audioBuffers) {
        try {
          const audioBuffer = await audioContext.decodeAudioData(buffer.slice())
          decodedBuffers.push(audioBuffer)
        } catch (error) {
          console.error("Error decoding audio chunk:", error)
          continue
        }
      }
      if (decodedBuffers.length === 0) {
        console.error("No valid audio buffers to merge")
        return null
      }
      const totalLength = decodedBuffers.reduce((sum, buffer) => sum + buffer.length, 0)
      const numberOfChannels = decodedBuffers[0].numberOfChannels
      const sampleRate = decodedBuffers[0].sampleRate
      const mergedBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate)
      let offset = 0
      for (const buffer of decodedBuffers) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel)
          mergedBuffer.getChannelData(channel).set(channelData, offset)
        }
        offset += buffer.length
      }
      const wavBlob = await audioBufferToWav(mergedBuffer)
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(wavBlob)
      })
    } catch (error) {
      console.error("Error merging audio chunks:", error)
      return audioChunks.length > 0 ? `data:audio/wav;base64,${audioChunks[0]}` : null
    }
  }

  const audioBufferToWav = (buffer) => {
    const length = buffer.length
    const numberOfChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const bytesPerSample = 2
    const blockAlign = numberOfChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = length * blockAlign
    const bufferSize = 44 + dataSize
    const arrayBuffer = new ArrayBuffer(bufferSize)
    const view = new DataView(arrayBuffer)
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    writeString(0, "RIFF")
    view.setUint32(4, bufferSize - 8, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bytesPerSample * 8, true)
    writeString(36, "data")
    view.setUint32(40, dataSize, true)
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample * 0x7fff, true)
        offset += 2
      }
    }
    return new Blob([arrayBuffer], { type: "audio/wav" })
  }

  const speechToText = async (audioBlob) => {
    const formData = new FormData()
    formData.append("file", audioBlob, "audio.wav")
    formData.append("model", "saarika:v2.5")
    formData.append("language_code", "unknown")
    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: formData,
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Speech-to-text API error response:", errorText)
      throw new Error(`Speech-to-text API error: ${response.status} - ${errorText}`)
    }
    return await response.json()
  }

  const textToSpeech = async (text, languageCode) => {
    try {
      const cleanedText = text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/\*{3,}/g, "")
        .replace(/^\*+/gm, "")
        .replace(/[#[\]]/g, "")
        .trim()
      const response = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
          "api-subscription-key": SARVAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [cleanedText.substring(0, 500)],
          target_language_code: languageCode || "en-IN",
          speaker: "arya",
          model: "bulbul:v2",
          enable_preprocessing: true,
          speech_sample_rate: 8000,
        }),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("TTS API error response:", errorText)
        throw new Error(`Text-to-speech API error: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      return data.audios && data.audios[0] ? data.audios[0] : null
    } catch (error) {
      console.error("Text-to-speech error:", error)
      throw error
    }
  }

  const textToSpeechComplete = async (text, languageCode) => {
    try {
      const cleanedText = text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/\*{3,}/g, "")
        .replace(/^\*+/gm, "")
        .replace(/[#[\]]/g, "")
        .trim()
      const chunks = []
      const maxChunkSize = 400
      if (cleanedText.length <= maxChunkSize) {
        chunks.push(cleanedText)
      } else {
        const sentences = cleanedText.split(/[।.!?]+/).filter((s) => s.trim())
        let currentChunk = ""
        for (const sentence of sentences) {
          const trimmedSentence = sentence.trim()
          if ((currentChunk + trimmedSentence).length <= maxChunkSize) {
            currentChunk += (currentChunk ? "। " : "") + trimmedSentence
          } else {
            if (currentChunk) {
              chunks.push(currentChunk + "।")
              currentChunk = trimmedSentence
            } else {
              chunks.push(trimmedSentence.substring(0, maxChunkSize))
              currentChunk = trimmedSentence.substring(maxChunkSize)
            }
          }
        }
        if (currentChunk) {
          chunks.push(currentChunk + "।")
        }
      }
      console.log(`Converting ${chunks.length} chunks to speech:`, chunks)
      const audioChunks = []
      for (let i = 0; i < chunks.length; i++) {
        try {
          const audioData = await textToSpeech(chunks[i], languageCode)
          if (audioData) {
            audioChunks.push(audioData)
          }
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch (error) {
          console.error(`Error converting chunk ${i + 1} to speech:`, error)
        }
      }
      const mergedAudioData = await mergeAudioChunks(audioChunks)
      return mergedAudioData
    } catch (error) {
      console.error("Complete text-to-speech error:", error)
      return null
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      const chunks = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }
      recorder.start()
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Error accessing microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsProcessingSpeech(true)
    }
  }

  // const processAudio = async (audioBlob) => {
  //   try {
  //     const transcription = await speechToText(audioBlob)
  //     if (!transcription || !transcription.transcript) {
  //       alert("Could not understand the audio. Please try again.")
  //       setIsProcessingSpeech(false)
  //       return
  //     }
  //     const detectedLanguage = transcription.language_code || "en-IN"
  //     setQuery(transcription.transcript)
  //     await handleSendQuery(transcription.transcript, true, detectedLanguage)
  //   } catch (error) {
  //     console.error("Error processing audio:", error)
  //     alert("Error processing audio. Please try again.")
  //   } finally {
  //     setIsProcessingSpeech(false)
  //   }
  // }

const processAudio = async (audioBlob) => {
  try {
    const transcription = await speechToText(audioBlob)
    if (!transcription || !transcription.transcript) {
      alert("Could not understand the audio. Please try again.")
      setIsProcessingSpeech(false)
      return
    }
    const detectedLanguage = transcription.language_code || "en-IN"
    setQuery(transcription.transcript)
    // Pass detected language and enable audio response for voice queries
    await handleSendQuery(transcription.transcript, true, detectedLanguage)
  } catch (error) {
    console.error("Error processing audio:", error)
    alert("Error processing audio. Please try again.")
  } finally {
    setIsProcessingSpeech(false)
  }
}

  // const handleSendQuery = async (inputQuery = null, includeAudio = false, languageCode = "en-IN") => {
  //   const queryText = inputQuery || query
  //   if (!queryText.trim()) return

  //   if (!token) {
  //     alert("Please log in to use the chatbot.")
  //     return
  //   }

  //   const userMessage = {
  //     id: generateUniqueId(),
  //     role: "user",
  //     content: queryText,
  //     createdAt: new Date(),
  //     detectedLanguage: languageCode,
  //   }

  //   const updatedCurrentMessages = [...currentMessages, userMessage]
  //   setCurrentMessages(updatedCurrentMessages)
  //   setQuery("")
  //   setLoading(true)

  //   const newChatId = currentChatId
  //   let updatedChatSessions = [...chatSessions]

  //   try {
  //     const response = await fetch("http://localhost:8000/rag-query", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         query: queryText,
  //         language_code: languageCode,
  //       }),
  //     })

  //     const result = await response.json()
  //     let modelResponseContent = "Hello from HaQdarshak. Could not get a response. Please try again."
  //     let mergedAudioData = null

  //     if (!response.ok || !result.success) {
  //       modelResponseContent = result.message || "Error processing query."
  //       if (modelResponseContent.includes("Please specify the scheme name")) {
  //         alert("Please specify the scheme name in your query.")
  //       }
  //     } else {
  //       modelResponseContent = result.response

  //       if (includeAudio && result.detected_language) {
  //         try {
  //           console.log("Generating complete merged audio response...")
  //           mergedAudioData = await textToSpeechComplete(modelResponseContent, result.detected_language)
  //           console.log("Generated merged audio:", mergedAudioData ? "Success" : "Failed")
  //         } catch (audioError) {
  //           console.error("Error generating audio:", audioError)
  //           mergedAudioData = null
  //         }
  //       }
  //     }

  //     const modelMessage = {
  //       id: generateUniqueId(),
  //       role: "model",
  //       content: modelResponseContent,
  //       mergedAudioData,
  //       createdAt: new Date(),
  //       detectedLanguage: result.detected_language,
  //       translatedQuery: result.translated_query,
  //     }

  //     setCurrentMessages((prev) => [...prev, modelMessage])
  //     const messagesWithoutAudio = [
  //       { ...userMessage, detectedLanguage: result.detected_language, translatedQuery: result.translated_query },
  //       modelMessage,
  //     ].map(({ mergedAudioData, ...rest }) => rest)

  //     if (newChatId === null) {
  //       const newSession = {
  //         id: `temp-${Date.now()}`,
  //         title: userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? "..." : ""),
  //         messages: messagesWithoutAudio,
  //       }
  //       updatedChatSessions = [newSession, ...chatSessions]
  //       setChatSessions(updatedChatSessions)
  //       setCurrentChatId(newSession.id)

  //       const chatResponse = await fetch("http://localhost:5000/api/chats", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           title: newSession.title,
  //           messages: newSession.messages,
  //         }),
  //       })

  //       const chatData = await chatResponse.json()
  //       if (chatResponse.ok) {
  //         setChatSessions((prev) =>
  //           prev.map((session) => (session.id === newSession.id ? { ...session, id: chatData.chat._id } : session)),
  //         )
  //         setCurrentChatId(chatData.chat._id)
  //       } else {
  //         console.error("Error saving chat:", chatData.message)
  //       }
  //     } else {
  //       updatedChatSessions = updatedChatSessions.map((session) =>
  //         session.id === newChatId ? { ...session, messages: [...session.messages, ...messagesWithoutAudio] } : session,
  //       )
  //       setChatSessions(updatedChatSessions)

  //       const chatResponse = await fetch(`http://localhost:5000/api/chats/${newChatId}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           messages: updatedChatSessions.find((session) => session.id === newChatId).messages,
  //         }),
  //       })

  //       if (!chatResponse.ok) {
  //         const chatData = await chatResponse.json()
  //         console.error("Error updating chat:", chatData.message)
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error calling RAG API:", error)
  //     const errorMessage = {
  //       id: generateUniqueId(),
  //       role: "model",
  //       content: `Hello from HaQdarshak. An error occurred: ${error.message}`,
  //       createdAt: new Date(),
  //     }
  //     setCurrentMessages((prev) => [...prev, errorMessage])
  //     updatedChatSessions = updatedChatSessions.map((session) =>
  //       session.id === newChatId ? { ...session, messages: [...session.messages, errorMessage] } : session,
  //     )
  //     setChatSessions(updatedChatSessions)

  //     if (newChatId !== null) {
  //       const chatResponse = await fetch(`http://localhost:5000/api/chats/${newChatId}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           messages: updatedChatSessions.find((session) => session.id === newChatId).messages,
  //         }),
  //       })

  //       if (!chatResponse.ok) {
  //         const chatData = await chatResponse.json()
  //         console.error("Error updating chat:", chatData.message)
  //       }
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  const handleSendQuery = async (inputQuery = null, includeAudio = false, languageCode = "en-IN") => {
  const queryText = inputQuery || query
  if (!queryText.trim()) return

  if (!token) {
    alert("Please log in to use the chatbot.")
    return
  }

  const userMessage = {
    id: generateUniqueId(),
    role: "user",
    content: queryText,
    createdAt: new Date(),
    detectedLanguage: languageCode,
  }

  const updatedCurrentMessages = [...currentMessages, userMessage]
  setCurrentMessages(updatedCurrentMessages)
  setQuery("")
  setLoading(true)

  const newChatId = currentChatId
  let updatedChatSessions = [...chatSessions]

  try {
    // Prepare chat history for memory context
    // Send last 6 messages (3 exchanges) for context, excluding the current user message
    const chatHistoryForContext = currentMessages
      .slice(-6)
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      }))

    console.log("Sending chat history for context:", chatHistoryForContext)

    const response = await fetch("http://localhost:8000/rag-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: queryText,
        language_code: languageCode,
        chat_history: chatHistoryForContext, // Add chat history
      }),
    })

    const result = await response.json()
    let modelResponseContent = "Hello from HaQdarshak. Could not get a response. Please try again."
    let mergedAudioData = null

    if (!response.ok || !result.success) {
      modelResponseContent = result.message || "Error processing query."
      if (modelResponseContent.includes("Please specify the scheme name")) {
        // Updated message to reflect memory capability
        alert("Please specify the scheme name in your query or refer to a scheme mentioned earlier in our conversation.")
      }
    } else {
      modelResponseContent = result.response

      if (includeAudio && result.detected_language) {
        try {
          console.log("Generating complete merged audio response...")
          mergedAudioData = await textToSpeechComplete(modelResponseContent, result.detected_language)
          console.log("Generated merged audio:", mergedAudioData ? "Success" : "Failed")
        } catch (audioError) {
          console.error("Error generating audio:", audioError)
          mergedAudioData = null
        }
      }
    }

    const modelMessage = {
      id: generateUniqueId(),
      role: "model",
      content: modelResponseContent,
      mergedAudioData,
      createdAt: new Date(),
      detectedLanguage: result.detected_language,
      translatedQuery: result.translated_query,
    }

    setCurrentMessages((prev) => [...prev, modelMessage])
    
    // For MongoDB storage, we don't include mergedAudioData due to size constraints
    const messagesWithoutAudio = [
      { ...userMessage, detectedLanguage: result.detected_language, translatedQuery: result.translated_query },
      { ...modelMessage, mergedAudioData: undefined }, // Remove audio data for storage
    ]

    if (newChatId === null) {
      const newSession = {
        id: `temp-${Date.now()}`,
        title: userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? "..." : ""),
        messages: messagesWithoutAudio,
      }
      updatedChatSessions = [newSession, ...chatSessions]
      setChatSessions(updatedChatSessions)
      setCurrentChatId(newSession.id)

      const chatResponse = await fetch("http://localhost:5000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newSession.title,
          messages: newSession.messages,
        }),
      })

      const chatData = await chatResponse.json()
      if (chatResponse.ok) {
        setChatSessions((prev) =>
          prev.map((session) => (session.id === newSession.id ? { ...session, id: chatData.chat._id } : session)),
        )
        setCurrentChatId(chatData.chat._id)
      } else {
        console.error("Error saving chat:", chatData.message)
      }
    } else {
      // Update existing chat with new messages
      const existingSession = updatedChatSessions.find(session => session.id === newChatId)
      if (existingSession) {
        const updatedMessages = [...existingSession.messages, ...messagesWithoutAudio]
        
        updatedChatSessions = updatedChatSessions.map((session) =>
          session.id === newChatId ? { ...session, messages: updatedMessages } : session,
        )
        setChatSessions(updatedChatSessions)

        const chatResponse = await fetch(`http://localhost:5000/api/chats/${newChatId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        })

        if (!chatResponse.ok) {
          const chatData = await chatResponse.json()
          console.error("Error updating chat:", chatData.message)
        }
      }
    }
  } catch (error) {
    console.error("Error calling RAG API:", error)
    const errorMessage = {
      id: generateUniqueId(),
      role: "model",
      content: `Hello from HaQdarshak. An error occurred: ${error.message}`,
      createdAt: new Date(),
    }
    setCurrentMessages((prev) => [...prev, errorMessage])
    
    // Handle error case for chat sessions
    if (newChatId !== null) {
      updatedChatSessions = updatedChatSessions.map((session) =>
        session.id === newChatId ? { ...session, messages: [...session.messages, errorMessage] } : session,
      )
      setChatSessions(updatedChatSessions)

      const chatResponse = await fetch(`http://localhost:5000/api/chats/${newChatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: updatedChatSessions.find((session) => session.id === newChatId).messages,
        }),
      })

      if (!chatResponse.ok) {
        const chatData = await chatResponse.json()
        console.error("Error updating chat:", chatData.message)
      }
    }
  } finally {
    setLoading(false)
  }
}



  const handleNewChat = async () => {
    setCurrentChatId(null)
    setCurrentMessages([])
    setQuery("")
    if (isMobileView) {
      setSidebarExpanded(false)
    }
  }

  // const handleSelectChat = (chatId) => {
  //   setCurrentChatId(chatId)
  //   setCurrentMessages(chatSessions.find((session) => session.id === chatId)?.messages || [])
  //   if (isMobileView) {
  //     setSidebarExpanded(false)
  //   }
  // }

  const handleSelectChat = (chatId) => {
  const selectedChat = chatSessions.find((session) => session.id === chatId)
  if (selectedChat) {
    setCurrentChatId(chatId)
    // Ensure all messages have proper IDs for memory context
    const messagesWithIds = selectedChat.messages.map((msg, index) => ({
      ...msg,
      id: msg.id || `loaded-${Date.now()}-${index}`,
    }))
    setCurrentMessages(messagesWithIds)
    
    console.log(`Loaded chat with ${messagesWithIds.length} messages for memory context`)
  }
  
  if (isMobileView) {
    setSidebarExpanded(false)
  }
}

const getMemoryStatusIndicator = () => {
  if (currentMessages.length === 0) return null
  
  // Count messages for context indication
  const messageCount = currentMessages.length
  const contextMessages = Math.min(messageCount, 6)
  
  return (
    <div className="text-xs text-gray-400 mb-2 px-3 flex items-center">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
      Using context from last {contextMessages} messages
    </div>
  )
}


  const handleFileUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setCurrentMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          role: "user",
          content: `File selected: ${file.name}`,
          createdAt: new Date(),
        },
      ])
    }
  }

  const toggleLanguageInfo = () => {
    setShowLanguageInfo(!showLanguageInfo)
  }

  const handleTextareaResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading && !isRecording && !isProcessingSpeech) {
      e.preventDefault()
      handleSendQuery()
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      const chunks = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }
      recorder.start()
      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      setIsListening(true)
    } catch (error) {
      console.error("Error starting listening:", error)
      alert("Error accessing microphone. Please check permissions.")
    }
  }

  const stopListening = () => {
    if (mediaRecorder && isListening) {
      mediaRecorder.stop()
      setIsListening(false)
      setIsProcessingSpeech(true)
    }
  }

  const handleFeedback = (messageId, feedbackType) => {
    console.log(`[v0] Feedback received for message ${messageId}: ${feedbackType}`)
  }

  return (
    <div className="flex h-screen bg-[#1A1B1E] text-white font-inter overflow-hidden">
      <div
        className={`
          flex flex-col bg-[#232427] p-4 shadow-md transition-all duration-300 ease-in-out h-full
          ${
            isMobileView
              ? `fixed inset-y-0 z-30 ${sidebarExpanded ? "left-0 w-64" : "-left-64"}`
              : `relative ${sidebarExpanded ? "w-64" : "w-16"}`
          }
        `}
        onMouseEnter={() => !isMobileView && setSidebarExpanded(true)}
        onMouseLeave={() => !isMobileView && setSidebarExpanded(false)}
      >
        <div className="flex items-center justify-center md:justify-start mb-6">
          {isMobileView && (
            <IconButton
              icon={Menu}
              onClick={() => setSidebarExpanded((prev) => !prev)}
              title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="mr-2"
            />
          )}
          {(!isMobileView || sidebarExpanded) && (
            <span className="text-xl font-semibold text-gray-200 ml-4 md:ml-0">Haqdarshak</span>
          )}
        </div>

        {/* {sidebarExpanded && (
          <div className="mb-4 p-3 bg-gray-700/50 rounded-lg"> */}
            {/* <Button
              className="w-full flex items-center justify-start text-gray-200 hover:bg-gray-600 px-2 py-1 rounded text-sm bg-transparent"
              onClick={toggleLanguageInfo}
            >
              <Languages className="h-4 w-4 mr-2" />
              Multilingual Support
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${showLanguageInfo ? "rotate-180" : ""}`} />
            </Button> */}

            {/* {showLanguageInfo && (
              <div className="mt-2 text-xs text-gray-300">
                <div className="mb-2">Supported Languages:</div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(supportedLanguages)
                    .slice(0, 8)
                    .map(([code, name]) => (
                      <div key={code} className="truncate">
                        {name.split("-")[0]}
                      </div>
                    ))}
                </div>
                <div className="mt-2 text-xs opacity-75">Ask questions in any supported language!</div>
              </div>
            )} */}
          {/* </div> */}
        {/* )} */}

        <div className="mb-6">
          <Button
            className="w-full flex items-center justify-start bg-gray-700/50 text-gray-200 hover:bg-gray-600 px-4 py-2 rounded-lg"
            onClick={handleNewChat}
          >
            <PenLine className="h-5 w-5 mr-3" />
            {sidebarExpanded && "New chat"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sidebarExpanded && chatSessions.length > 0 && (
            <h3 className="text-gray-300 text-sm font-semibold mb-3 px-4">Recent</h3>
          )}
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
              <Button className="w-full flex items-center justify-start text-gray-200 hover:bg-gray-600 px-4 py-2 rounded-lg bg-transparent">
                Show more <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2 border-t border-gray-600 pt-4">
          <Button className="w-full flex items-center justify-start text-gray-200 hover:bg-gray-600 px-4 py-2 rounded-lg bg-transparent">
            <Settings className="h-5 w-5 mr-3" />
            {sidebarExpanded && "Settings and help"}
          </Button>
          <Button
            className="w-full flex items-center justify-start bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg"
            onClick={onLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {sidebarExpanded && "Logout"}
          </Button>
        </div>
      </div>
      {isMobileView && sidebarExpanded && (
        <div className="fixed inset-0 bg-black opacity-50 z-20" onClick={() => setSidebarExpanded(false)}></div>
      )}
      <div
        className={`flex-1 flex flex-col overflow-hidden
                    ${isMobileView && sidebarExpanded ? "ml-64" : "ml-0"}
                    ${!isMobileView && (sidebarExpanded ? "md:ml-64" : "md:ml-16")}
      `}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              {/* <MessageSquareText className="h-16 w-16 mb-4 opacity-50" /> */}
                <h1 className="text-4xl  sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-4">
                  Hello, {username}!
                </h1>
              <p className="text-lg opacity-75">Type or speak your query below</p>
            </div>
          )}
          {currentMessages.map((message) => (
            <MessageBubble key={message.id} {...message} onFeedback={handleFeedback} />
          ))}
          {loading && (
            <div className="flex justify-start mb-6">
              <div className="bg-gray-700/50 px-4 py-3 rounded-xl rounded-bl-none flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-300" />
                <span className="text-gray-200">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isListening && (
          <div className="px-6 py-3 bg-blue-500/10 border-t border-blue-400/20">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <span className="text-blue-200 text-sm font-medium">Listening...</span>
              <button
                onClick={stopListening}
                className="p-1 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <MicOff className="h-4 w-4 text-red-300" />
              </button>
            </div>
          </div>
        )}

        <div className="p-6 bg-[#232427] border-t border-gray-600">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[#2A2B2F] rounded-xl border border-gray-500/50 shadow-sm overflow-hidden">
              <div className="flex items-end p-3 space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFileUploadClick}
                    className="p-2 rounded-full hover:bg-gray-600/50 transition-colors"
                    title="Add file"
                  >
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                 
                </div>

                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      handleTextareaResize()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your question..."
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-base leading-6 min-h-[24px] max-h-[200px] py-2 px-3"
                    style={{ height: "auto" }}
                    rows={1}
                  />
                </div>

 
                <div className="flex items-center space-x-2">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-full transition-colors ${
                      isListening
                        ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        : "hover:bg-gray-600/50 text-gray-300"
                    }`}
                    title={isListening ? "Stop listening" : "Voice input"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>


            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #232427;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </div>
  )
}

export default Chatbot





               