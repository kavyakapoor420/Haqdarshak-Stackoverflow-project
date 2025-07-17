import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select";
import { Badge } from "../../Components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar2 from "@/Components/Common/Sidebar";

const API_BASE_URL = 'http://localhost:5000/api';
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyBmdh5whTH7S771tuBx1YSHn3kSXOdelIE';
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

const getAuthToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  username: string;
}

interface Comment {
  [key: string]: any;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  schemeName: string;
  userId?: User;
  upvotes?: any[];
  downvotes?: any[];
  comments?: Comment[];
  createdAt: string;
  [key: string]: any;
}

const chunkText = (text: any, maxLength: number = 500): string[] => {
  // Handle non-string inputs
  if (typeof text !== 'string' || !text) {
    return [''];
  }
  const chunks: string[] = [];
  let currentChunk = '';
  const sentences = text.split('.').map(s => s.trim()).filter(s => s);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text) return '';
  const cacheKey = `translation_${text}_${targetLang}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.post(
      `${TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLang,
        format: 'text',
      }
    );
    const translatedText = response.data.data.translations[0].translatedText;
    localStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
};

const translatePost = async (post: Post, targetLang: string): Promise<Post> => {
  const fieldsToTranslate = ['title', 'description', 'schemeName'];
  const translatedPost = { ...post };

  for (const field of fieldsToTranslate) {
    const text = post[field];
    if (typeof text !== 'string' || !text) {
      translatedPost[field] = ''; // Fallback to empty string
      continue;
    }
    const chunks = chunkText(text);
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateText(chunk, targetLang))
    );
    translatedPost[field] = translatedChunks.join('. ');
  }

  return translatedPost;
};

export default function CommunityPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en"); // Default: English

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {};
        if (filter === 'newest') {
          params.sort = 'createdAt';
          params.order = 'desc';
        } else if (filter === 'upvotes') {
          params.sort = 'upvotes.length';
          params.order = 'desc';
        } else if (filter === 'unanswered') {
          params.unanswered = true;
        }

        const response = await api.get('/posts/approved', { params });
        // Ensure posts are valid
        const validPosts = response.data.filter(
          (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
        );
        setPosts(validPosts);
      } catch (error) {
        toast.error('Failed to load posts. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

  useEffect(() => {
    const translatePosts = async () => {
      setLoading(true);
      try {
        const translated = await Promise.all(
          posts.map(post => translatePost(post, language))
        );
        setDisplayPosts(translated);
      } catch (error) {
        console.error('Error translating posts:', error);
        setDisplayPosts(posts); // Fallback to original posts
        toast.error('Failed to translate posts. Showing original content.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePosts();
  }, [posts, language]);

  const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      setPosts(posts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      toast.success(`${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`, {
        position: 'top-right',
        style: { background: '#dcfce7', color: '#15803d' }
      });
    } catch (error: any) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null
      ) {
        const response = error.response;
        if (
          response.status === 400 &&
          response.data?.message &&
          typeof response.data.message === "string" &&
          response.data.message.includes('Already')
        ) {
          toast.error(`You have already ${voteType}d this post.`, {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (response.status === 401) {
          toast.error('Please log in to vote.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error('Failed to record vote. Please try again.', {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else {
        toast.error('Failed to record vote. Please try again.', {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      }
    }
  };

  const filteredPosts = displayPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar2 />
      <div className="flex-1 md:ml-64 min-h-screen relative overflow-hidden pt-16">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.9) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Community Hub
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Share knowledge, ask questions, and connect with fellow Agent and contribute in Community and earn rewards
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts and discussions..."
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="upvotes">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Most Upvoted
                  </div>
                </SelectItem>
                <SelectItem value="unanswered">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Unanswered
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/post/${post._id}`}>
                          <h3 className="text-2xl font-semibold text-blue-500 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
                            {post.title || 'Untitled'}
                          </h3>
                        </Link>
                        <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800 font-medium">
                          {post.schemeName || 'No Scheme'}
                        </Badge>
                        <p className="text-slate-600 mt-2 line-clamp-3">{post.description || 'No description'}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="text-blue-400">{post.userId?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post._id, "upvote")}
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <ArrowUp className="w-4 h-4" />
                            <span className="ml-1 text-xs font-medium">{post.upvotes?.length || 0}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post._id, "downvote")}
                            className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <ArrowDown className="w-4 h-4" />
                            <span className="ml-1 text-xs font-medium">{post.downvotes?.length || 0}</span>
                          </Button>
                        </div>

                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {post.comments?.length || 0} replies
                        </Badge>

                        <Link to={`/post/${post._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-300 hover:border-slate-400 bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No posts found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}