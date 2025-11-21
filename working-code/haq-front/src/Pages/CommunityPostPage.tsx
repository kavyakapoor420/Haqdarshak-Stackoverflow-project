
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Search, Calendar, User, TrendingUp } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar2 from "@/components/Common/Sidebar";
import { SarvamAIClient } from "sarvamai";
import { useTranslation } from "react-i18next";

const API_BASE_URL = 'http://localhost:5000/api';
const SARVAM_API_KEY = 'sk_x5ao4fpr_c0hmA9rE3uSZjc9lYsSzcSkP';
const client = new SarvamAIClient({ apiSubscriptionKey: SARVAM_API_KEY });

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
  language?: string;
  [key: string]: any;
}

const chunkText = (text: any, maxLength: number = 2000): string[] => {
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

type TranslateSourceLanguage =
  | 'bn-IN'
  | 'en-IN'
  | 'gu-IN'
  | 'hi-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'mr-IN'
  | 'od-IN'
  | 'pa-IN'
  | 'ta-IN'
  | 'te-IN';

type TranslateTargetLanguage =
  | 'bn-IN'
  | 'en-IN'
  | 'gu-IN'
  | 'hi-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'mr-IN'
  | 'od-IN'
  | 'pa-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'as-IN'
  | 'brx-IN'
  | 'doi-IN'
  | 'kok-IN'
  | 'ks-IN'
  | 'mai-IN'
  | 'mni-IN'
  | 'ne-IN'
  | 'sa-IN'
  | 'sat-IN'
  | 'sd-IN'
  | 'ur-IN';

const mapLanguageToSarvam = (lang: string): TranslateTargetLanguage => {
  const mapping: { [key: string]: TranslateTargetLanguage } = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
  };
  return mapping[lang] || 'en-IN';
};

const translateText = async (text: string, sourceLang: TranslateSourceLanguage, targetLang: TranslateTargetLanguage): Promise<string> => {
  if (!text) return '';
  if (sourceLang === targetLang) return text;

  const cacheKey = `translation_${text}_${sourceLang}_${targetLang}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const response = await client.text.translate({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      model: 'sarvam-translate:v1',
      enable_preprocessing: true,
      numerals_format: 'international',
    });
    const translatedText = response.translated_text;
    localStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error: any) {
    console.error('Sarvam AI Translation error:', error);
    let errorMessage = 'Translation failed';
    if (error.response?.data?.error?.message) {
      errorMessage = `Translation error: ${error.response.data.error.message}`;
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request. Check API key or language codes.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Invalid API key.';
    }
    toast.error(errorMessage, {
      position: 'top-right',
      style: { background: '#fee2e2', color: '#dc2626' },
    });
    return text;
  }
};

const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
  const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...post };

  const fieldsToTranslate = ['title', 'description', 'schemeName'];
  const translatedPost = { ...post };

  for (const field of fieldsToTranslate) {
    const text = post[field];
    if (typeof text !== 'string' || !text) {
      translatedPost[field] = '';
      continue;
    }
    const chunks = chunkText(text);
    const translatedChunks = await Promise.all(
      chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
    );
    translatedPost[field] = translatedChunks.join('. ');
  }

  return translatedPost;
};

export default function CommunityPostsWithSarvam() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

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
        const validPosts = response.data.filter(
          (post: any) => post && typeof post.title === 'string' && typeof post.description === 'string' && typeof post.schemeName === 'string'
        );
        setPosts(validPosts);
      } catch (error) {
        toast.error(t('community.error.loadPosts'), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter, t]);

  useEffect(() => {
    const translatePosts = async () => {
      setLoading(true);
      try {
        const targetLang = mapLanguageToSarvam(i18n.language);
        const translated = await Promise.all(
          posts.map(post => translatePost(post, targetLang))
        );
        setDisplayPosts(translated);
      } catch (error) {
        console.error('Error translating posts:', error);
        setDisplayPosts(posts);
        toast.error(t('community.error.translatePosts'), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePosts();
  }, [posts, i18n.language]);

  const handleVote = async (postId: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await api.post(`/posts/${postId}/vote`, { voteType });
      setPosts(posts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      setDisplayPosts(displayPosts.map(post => 
        post._id === postId ? response.data.post : post
      ));
      toast.success(t(`community.success.${voteType}`), {
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
          toast.error(t(`community.error.alreadyVoted`, { voteType }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (response.status === 401) {
          toast.error(t('community.error.loginToVote'), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error(t('community.error.voteFailed'), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else {
        toast.error(t('community.error.voteFailed'), {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return t('community.date.yesterday');
    if (diffDays < 7) return t('community.date.daysAgo', { count: diffDays });
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
              {t('community.title')}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {t('community.description')}
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('community.searchPlaceholder')}
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-slate-400 rounded-xl"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                <SelectValue placeholder={t('community.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('community.filters.newest')}
                  </div>
                </SelectItem>
                <SelectItem value="upvotes">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('community.filters.upvotes')}
                  </div>
                </SelectItem>
                <SelectItem value="unanswered">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t('community.filters.unanswered')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-lg p-4 font-medium text-slate-700">
                  {t('community.loading', { language: t(`languages.${i18n.language}`) })}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex flex-col items-center justify-start p-4 bg-slate-50/50 border-r border-slate-200/50 min-w-[80px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "upvote")}
                          className="flex flex-col items-center gap-1 text-slate-600 hover:text-green-600 hover:bg-green-50/50 p-2 rounded-lg transition-all duration-200 mb-1"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </Button>
                        <div className="text-xl font-bold text-slate-700 py-1">
                          {(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mb-2">{t('community.votes')}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post._id, "downvote")}
                          className="flex flex-col items-center gap-1 text-slate-600 hover:text-red-600 hover:bg-red-50/50 p-2 rounded-lg transition-all duration-200 mb-3"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </Button>
                        <div className="flex flex-col items-center text-slate-500">
                          <div className="text-sm font-semibold">
                            {Array.isArray(post.comments) ? post.comments.length : 0}
                          </div>
                          <div className="text-xs">{t('community.answers')}</div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3">
                            <Link to={`/post/${post._id}`}>
                              <h3 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer leading-tight">
                                {post.title || t('community.untitled')}
                              </h3>
                            </Link>
                            <Badge
                              variant="secondary"
                              className="self-start bg-blue-100 text-blue-800 font-medium px-3 py-1 text-sm rounded-md border-0"
                            >
                              {post.schemeName || t('community.general')}
                            </Badge>
                          </div>

                          <p className="text-slate-700 text-base leading-relaxed line-clamp-3">
                            {post.description || t('community.noDescription')}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">
                                  {(post.userId as User)?.username || t('community.anonymous')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                            <Link to={`/post/${post._id}`}>
                              <Button
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium px-4 py-2 rounded-md transition-all duration-200 bg-transparent"
                              >
                                {t('community.readMore')}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                {t('community.previous')}
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 ${
                      currentPage === page 
                        ? "bg-blue-600 text-white" 
                        : "text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                {t('community.next')}
              </Button>
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="text-center mt-4 text-sm text-slate-600">
              {t('community.paginationInfo', {
                start: startIndex + 1,
                end: Math.min(endIndex, filteredPosts.length),
                total: filteredPosts.length
              })}
            </div>
          )}

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">{t('community.noPosts')}</h3>
              <p className="text-slate-500">{t('community.noPostsMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}