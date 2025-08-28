// import { useState } from "react";
// import axios from 'axios';


// const PostQuestionPage = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);
//   const token = localStorage.getItem('token');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         'http://localhost:5000/api/posts',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Post submitted for review');
//       setTitle('');
//       setDescription('');
//       const updatedPosts = await axios.get('http://localhost:5000/api/posts/approved', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {}
//       });
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//       alert(error.response?.data?.message || 'Failed to submit post');
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Create Your Post</h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Title"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter Description"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostQuestionPage

// import { useState } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// // Axios instance with auth header
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default function PostQuestionPage() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [posts, setPosts] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       toast.error('Please enter a title.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     if (!description.trim()) {
//       toast.error('Please enter a description.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     try {
//       const response = await api.post('/posts', { title: title.trim(), description: description.trim() });
//       toast.success('Post submitted for review!', {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//       setTitle('');
//       setDescription('');
//       const updatedPosts = await api.get('/posts/approved');
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error('Please log in to submit a post.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid input. Please check your title and description.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else {
//         toast.error('Failed to submit post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">Create Your Post</h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter Title"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter Description"
//             className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import AutoCompleteSearchBar from "../Components/SearchBar/AutoCompleteSearchBar";

// const API_BASE_URL = 'http://localhost:5000/api';

// // Axios instance with auth header
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default function PostQuestionPage() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [schemeName, setSchemeName] = useState('');
//   const [posts, setPosts] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       toast.error('Please enter a title.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     if (!description.trim()) {
//       toast.error('Please enter a description.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     if (!schemeName.trim()) {
//       toast.error('Please select a scheme name .', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     try {
//       const response = await api.post('/posts', { 
//         title: title.trim(), 
//         description: description.trim(), 
//         schemeName: schemeName.trim() 
//       });
//       toast.success('Post submitted for review!', {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//       setTitle('');
//       setDescription('');
//       setSchemeName('')
//       const updatedPosts = await api.get('/posts/approved');
//       setPosts(updatedPosts.data);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error('Please log in to submit a post.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid input. Please check your title, description, and scheme nam.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else {
//         toast.error('Failed to submit post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden ">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="absolute inset-0 bg-gradient-to-br  from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full mb-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
//           Create Your Post
//         </h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
//           <div>
//             <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Title
//             </label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e

// ) => setTitle(e.target.value)}
//               placeholder="Enter Title"
//               className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter Description"
//               className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//             />
//           </div>
//           <div>
//             <label htmlFor="scheme-name" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Relevant related name of scheme of your question 
//             </label>
//             <AutoCompleteSearchBar value={schemeName} onChange={setSchemeName} />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import AutoCompleteSearchBar from "../components/SearchBar/AutoCompleteSearchBar";

// const API_BASE_URL = 'http://localhost:5000/api';
// // const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api/'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default function PostQuestionPage() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [schemeName, setSchemeName] = useState('');
//   const [posts, setPosts] = useState([]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       toast.error('Please enter a title.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     if (!description.trim()) {
//       toast.error('Please enter a description.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     if (!schemeName.trim()) {
//       toast.error('Please select a scheme name.', {
//         position: 'top-right',
//         style: { background: '#fee2e2', color: '#dc2626' }
//       });
//       return;
//     }
//     try {
//       const response = await api.post('/posts', { 
//         title: title.trim(), 
//         description: description.trim(), 
//         schemeName: schemeName.trim() 
//       });
//       toast.success('Post submitted for review!', {
//         position: 'top-right',
//         style: { background: '#dcfce7', color: '#15803d' }
//       });
//       setTitle('');
//       setDescription('');
//       setSchemeName('');
//       const updatedPosts = await api.get('/posts/approved');
//       setPosts(updatedPosts.data);
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         toast.error('Please log in to submit a post.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid input. Please check your title, description, and scheme name.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       } else {
//         toast.error('Failed to submit post. Please try again.', {
//           position: 'top-right',
//           style: { background: '#fee2e2', color: '#dc2626' }
//         });
//       }
//       console.error('Error submitting post:', error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//         <div className="absolute inset-0 opacity-30">
//           <div
//             className="h-full w-full mb-20"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(251, 146, 60, 0.7) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(251, 146, 60, 0.7) 1px, transparent 1px)
//               `,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-transparent rounded-full blur-3xl" />
//       </div>
//       <div className="relative z-10 max-w-4xl mx-auto p-6">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
//           Create Your Post
//         </h2>
//         <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
//           <div>
//             <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Title
//             </label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter Title"
//               className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter Description"
//               className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
//             />
//           </div>
//           <div>
//             <label htmlFor="scheme-name" className="block text-lg font-medium text-gray-700 mb-2">
//               Enter Relevant related name of scheme of your question
//             </label>
//             <AutoCompleteSearchBar value={schemeName} onChange={setSchemeName} />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             Submit Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, FormEvent } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';
import AutoCompleteSearchBar from "../components/SearchBar/AutoCompleteSearchBar";

const API_BASE_URL: string = 'http://localhost:5000/api';
// const API_BASE_URL='https://haqdarshak-stackoverflow-project.onrender.com/api/'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define types for state and data structures
interface Post {
  title: string;
  description: string;
  schemeName: string;
}

interface TranscriptionResponse {
  transcript: string;
}

export default function PostQuestionPage() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [schemeName, setSchemeName] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Speech-to-text states
  const [isTitleRecording, setIsTitleRecording] = useState<boolean>(false);
  const [isDescriptionRecording, setIsDescriptionRecording] = useState<boolean>(false);
  const [isTitleProcessing, setIsTitleProcessing] = useState<boolean>(false);
  const [isDescriptionProcessing, setIsDescriptionProcessing] = useState<boolean>(false);
  const [titleMediaRecorder, setTitleMediaRecorder] = useState<MediaRecorder | null>(null);
  const [descriptionMediaRecorder, setDescriptionMediaRecorder] = useState<MediaRecorder | null>(null);

  // Sarvam AI API Key
  const SARVAM_API_KEY: string = 'sk_oswbovqu_RKsxylFUid3eSRD2aDlCELnI';

  // Speech-to-text function for processing audio chunks
  const speechToText = async (audioBlob: Blob): Promise<TranscriptionResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'saarika:v2.5');
      formData.append('language_code', 'unknown'); // Auto-detect language
      
      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Speech-to-text API error response:', errorText);
        throw new Error(`Speech-to-text API error: ${response.status} - ${errorText}`);
      }

      return await response.json() as TranscriptionResponse;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw error;
    }
  };

  // Process audio chunks for long recordings
  const processAudioInChunks = async (audioBlob: Blob, fieldType: 'title' | 'description'): Promise<void> => {
    try {
      // If recording is less than 3 minutes, process as single chunk
      const recordingDuration = audioBlob.size / (16000 * 2); // Approximate duration in seconds
      
      if (recordingDuration < 180) { // Less than 3 minutes
        const transcription = await speechToText(audioBlob);
        if (transcription?.transcript) {
          if (fieldType === 'title') {
            setTitle(prev => prev + (prev ? ' ' : '') + transcription.transcript);
          } else {
            setDescription(prev => prev + (prev ? ' ' : '') + transcription.transcript);
          }
          
          toast.success(`${fieldType === 'title' ? 'Title' : 'Description'} transcribed successfully!`, {
            position: 'top-right',
            style: { background: '#dcfce7', color: '#15803d' }
          });
        }
        return;
      }

      // For longer recordings, split into chunks
      const chunkSize = 1024 * 1024; // 1MB chunks
      const chunks: Blob[] = [];
      let offset = 0;

      while (offset < audioBlob.size) {
        const chunk = audioBlob.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
      }

      let fullTranscript: string = '';
      
      for (let i = 0; i < chunks.length; i++) {
        try {
          const chunkTranscription = await speechToText(chunks[i]);
          if (chunkTranscription?.transcript) {
            fullTranscript += (fullTranscript ? ' ' : '') + chunkTranscription.transcript;
          }
          
          // Add delay between chunks to respect API rate limits
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (chunkError) {
          console.error(`Error processing chunk ${i + 1}:`, chunkError);
          toast.error(`Error processing audio chunk ${i + 1}. Continuing...`, {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      }

      if (fullTranscript) {
        if (fieldType === 'title') {
          setTitle(prev => prev + (prev ? ' ' : '') + fullTranscript);
        } else {
          setDescription(prev => prev + (prev ? ' ' : '') + fullTranscript);
        }
        
        toast.success(`${fieldType === 'title' ? 'Title' : 'Description'} transcribed successfully from ${chunks.length} chunks!`, {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      } else {
        throw new Error('No valid transcription from any chunk');
      }

    } catch (error) {
      console.error('Error processing audio chunks:', error);
      toast.error('Error processing audio. Please try again.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
    }
  };

  // Start recording for title
  const startTitleRecording = async (): Promise<void> => {
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

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setIsTitleProcessing(true);
        await processAudioInChunks(audioBlob, 'title');
        setIsTitleProcessing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setTitleMediaRecorder(recorder);
      setIsTitleRecording(true);
      
      toast.info('Recording title... Click mic again to stop.', {
        position: 'top-right',
        style: { background: '#dbeafe', color: '#1d4ed8' }
      });

    } catch (error) {
      console.error('Error starting title recording:', error);
      toast.error('Error accessing microphone. Please check permissions.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
    }
  };

  // Stop recording for title
  const stopTitleRecording = (): void => {
    if (titleMediaRecorder && isTitleRecording) {
      titleMediaRecorder.stop();
      setIsTitleRecording(false);
    }
  };

  // Start recording for description
  const startDescriptionRecording = async (): Promise<void> => {
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

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setIsDescriptionProcessing(true);
        await processAudioInChunks(audioBlob, 'description');
        setIsDescriptionProcessing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setDescriptionMediaRecorder(recorder);
      setIsDescriptionRecording(true);
      
      toast.info('Recording description... Click mic again to stop.', {
        position: 'top-right',
        style: { background: '#dbeafe', color: '#1d4ed8' }
      });

    } catch (error) {
      console.error('Error starting description recording:', error);
      toast.error('Error accessing microphone. Please check permissions.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
    }
  };

  // Stop recording for description
  const stopDescriptionRecording = (): void => {
    if (descriptionMediaRecorder && isDescriptionRecording) {
      descriptionMediaRecorder.stop();
      setIsDescriptionRecording(false);
    }
  };

  // Toggle recording functions
  const toggleTitleRecording = (): void => {
    if (isTitleRecording) {
      stopTitleRecording();
    } else {
      startTitleRecording();
    }
  };

  const toggleDescriptionRecording = (): void => {
    if (isDescriptionRecording) {
      stopDescriptionRecording();
    } else {
      startDescriptionRecording();
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
      return;
    }
    if (!schemeName.trim()) {
      toast.error('Please select a scheme name.', {
        position: 'top-right',
        style: { background: '#fee2e2', color: '#dc2626' }
      });
      return;
    }
    try {
      const response = await api.post('/posts', { 
        title: title.trim(), 
        description: description.trim(), 
        schemeName: schemeName.trim() 
      });
      toast.success('Post submitted for review!', {
        position: 'top-right',
        style: { background: '#dcfce7', color: '#15803d' }
      });
      setTitle('');
      setDescription('');
      setSchemeName('');
      const updatedPosts = await api.get('/posts/approved');
      setPosts(updatedPosts.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          toast.error('Please log in to submit a post.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (axiosError.response?.status === 400) {
          toast.error((axiosError.response.data as any).message || 'Invalid input. Please check your title, description, and scheme name.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('Failed to submit post. Please try again.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
        console.error('Error submitting post:', (axiosError.response?.data as any)?.message || axiosError.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
        console.error('Error submitting post:', error);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full mb-20"
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
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
          Create Your Post
        </h2>
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl space-y-6 mb-12 border border-orange-100">
          
          {/* Title Input with Speech-to-Text */}
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Title
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title or click mic to speak..."
                className="w-full p-4 pr-14 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
                disabled={isTitleRecording || isTitleProcessing}
              />
              <button
                type="button"
                onClick={toggleTitleRecording}
                disabled={isTitleProcessing || isDescriptionRecording}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  isTitleRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : isTitleProcessing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                }`}
                title={isTitleRecording ? 'Stop recording' : 'Start voice input (multilingual)'}
              >
                {isTitleProcessing ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isTitleRecording ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
            {isTitleRecording && (
              <p className="text-sm text-orange-600 mt-2 animate-pulse">🎤 Recording... Speak in any supported language</p>
            )}
            {isTitleProcessing && (
              <p className="text-sm text-blue-600 mt-2">🔄 Processing speech...</p>
            )}
          </div>

          {/* Description Input with Speech-to-Text */}
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description or click mic to speak..."
                className="w-full p-4 pr-14 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
                disabled={isDescriptionRecording || isDescriptionProcessing}
              />
              <button
                type="button"
                onClick={toggleDescriptionRecording}
                disabled={isDescriptionProcessing || isTitleRecording}
                className={`absolute right-3 top-4 p-2 rounded-full transition-all duration-300 ${
                  isDescriptionRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : isDescriptionProcessing 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                }`}
                title={isDescriptionRecording ? 'Stop recording' : 'Start voice input (multilingual)'}
              >
                {isDescriptionProcessing ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isDescriptionRecording ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
            {isDescriptionRecording && (
              <p className="text-sm text-orange-600 mt-2 animate-pulse">🎤 Recording... Speak in any supported language</p>
            )}
            {isDescriptionProcessing && (
              <p className="text-sm text-blue-600 mt-2">🔄 Processing speech...</p>
            )}
          </div>

          {/* Scheme Name Input */}
          <div>
            <label htmlFor="scheme-name" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Relevant related name of scheme of your question
            </label>
            <AutoCompleteSearchBar value={schemeName} onChange={setSchemeName} />
          </div>

          

          <button
            type="submit"
            disabled={isTitleRecording || isDescriptionRecording || isTitleProcessing || isDescriptionProcessing}
            className={`w-full p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isTitleRecording || isDescriptionRecording || isTitleProcessing || isDescriptionProcessing
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
            }`}
          >
            {isTitleProcessing || isDescriptionProcessing ? 'Processing Speech...' : 'Submit Post'}
          </button>
        </form>
      </div>
    </div>
  );
}