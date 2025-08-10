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


import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AutoCompleteSearchBar from "../components/SearchBar/AutoCompleteSearchBar";

const API_BASE_URL = 'http://localhost:5000/api';

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

export default function PostQuestionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please log in to submit a post.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid input. Please check your title, description, and scheme name.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } else {
        toast.error('Failed to submit post. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      }
      console.error('Error submitting post:', error.response?.data?.message || error.message);
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
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500 h-40 resize-none"
            />
          </div>
          <div>
            <label htmlFor="scheme-name" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Relevant related name of scheme of your question
            </label>
            <AutoCompleteSearchBar value={schemeName} onChange={setSchemeName} />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
}