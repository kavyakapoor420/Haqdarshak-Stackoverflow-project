
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Calendar, User, Reply, ChevronDown, ChevronRight } from "lucide-react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar2 from "@/components/Common/Sidebar";
import { SarvamAIClient } from "sarvamai";
import { useLanguage } from '../Context/LanguageContext';
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

interface UserObj {
  username: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: UserObj;
  upvotes: any[];
  downvotes: any[];
  createdAt: string;
  replies: Comment[];
  language?: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  schemeName: string;
  userId: UserObj;
  upvotes: any[];
  downvotes: any[];
  createdAt: string;
  comments: Comment[];
  language?: string;
}

interface ReplyState {
  commentId: string;
  isOpen: boolean;
}

const chunkText = (text: string, maxLength: number = 2000): string[] => {
  if (!text) return [''];
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
  if (!text || sourceLang === targetLang) return text;

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
    return text; // Fallback to original text
  }
};

const translateComment = async (comment: Comment, targetLang: TranslateTargetLanguage): Promise<Comment> => {
  const sourceLang = (comment.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...comment };

  try {
    const translatedComment = { ...comment };
    const contentChunks = chunkText(comment.content);
    const translatedContentChunks = await Promise.all(
      contentChunks.map(chunk => translateText(chunk, sourceLang, targetLang))
    );
    translatedComment.content = translatedContentChunks.join('. ');

    if (comment.replies && comment.replies.length > 0) {
      translatedComment.replies = await Promise.all(
        comment.replies.map(reply => translateComment(reply, targetLang))
      );
    }

    return translatedComment;
  } catch (error) {
    console.error('Error translating comment:', error);
    return comment; // Fallback to original comment
  }
};

const translatePost = async (post: Post, targetLang: TranslateTargetLanguage): Promise<Post> => {
  const sourceLang = (post.language || 'en-IN') as TranslateSourceLanguage;
  if (sourceLang === targetLang) return { ...post };

  try {
    const translatedPost = { ...post };
    type TranslatableField = keyof Pick<Post, 'title' | 'description' | 'schemeName'>;
    const fieldsToTranslate: TranslatableField[] = ['title', 'description', 'schemeName'];

    for (const field of fieldsToTranslate) {
      const text = post[field] as string | undefined;
      if (!text) {
        translatedPost[field] = '';
        continue;
      }
      const chunks = chunkText(text);
      const translatedChunks = await Promise.all(
        chunks.map(chunk => translateText(chunk, sourceLang, targetLang))
      );
      translatedPost[field] = translatedChunks.join('. ');
    }

    if (post.comments && post.comments.length > 0) {
      translatedPost.comments = await Promise.all(
        post.comments.map(comment => translateComment(comment, targetLang))
      );
    }

    return translatedPost;
  } catch (error) {
    console.error('Error translating post:', error);
    return post; // Fallback to original post
  }
};

export default function PostDetail() {
  const { t, i18n } = useTranslation();
  const languageContext = useLanguage() as unknown as { language: string } | null;
  const language = languageContext?.language || '';
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [displayPost, setDisplayPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [replyContents, setReplyContents] = useState<{ [key: string]: string }>({});
  const [replyStates, setReplyStates] = useState<ReplyState[]>([]);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        toast.error(t('community2.error.loadPosts', { defaultValue: 'Failed to load post.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId, t]);

  useEffect(() => {
    const translatePostData = async () => {
      if (!post) return;
      setLoading(true);
      try {
        const targetLang = mapLanguageToSarvam(language || i18n.language);
        const translated = await translatePost(post, targetLang);
        setDisplayPost(translated);
      } catch (error) {
        console.error('Error translating post:', error);
        setDisplayPost(post);
        toast.error(t('community2.error.translatePosts', { defaultValue: 'Failed to translate post.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } finally {
        setLoading(false);
      }
    };
    translatePostData();
  }, [post, language, i18n.language, t]);

  const handleVote = async (
    type: "upvote" | "downvote",
    targetId: string = postId || "",
    targetType: "post" | "comment" = "post",
  ) => {
    try {
      let response: 
        | { data: { post: Post } }
        | { data: { comment: Comment } }
        | undefined;
      if (targetType === 'post') {
        response = await api.post(`/posts/${targetId}/vote`, { voteType: type });
        if (response?.data && 'post' in response.data) {
          setPost(response.data.post);
          setDisplayPost(response.data.post);
          toast.success(t(`community2.success.${type}`, { defaultValue: `${type} successful!` }), {
            position: 'top-right',
            style: { background: '#dcfce7', color: '#15803d' }
          });
        }
      } else {
        response = await api.post(`/comments/${targetId}/vote`, { voteType: type });
        setPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === targetId && response?.data && 'comment' in response.data
              ? response.data.comment
              : comment
          )
        }) : prevPost);
        setDisplayPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === targetId && response?.data && 'comment' in response.data
              ? response.data.comment
              : comment
          )
        }) : prevPost);
        toast.success(t(`community2.success.${type}`, { defaultValue: `${type} successful!` }), {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid vote action.';
        if (message.includes('Already')) {
          toast.error(t('community2.error.alreadyVoted', { voteType: type, defaultValue: `You have already ${type}d.` }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error(t('community2.error.voteFailed', { defaultValue: 'Failed to vote.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
      } else if (error.response?.status === 401) {
        toast.error(t('community2.error.loginToVote', { defaultValue: 'Please log in to vote.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      } else {
        toast.error(t('community2.error.voteFailed', { defaultValue: 'Failed to vote.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
      }
      console.error(`Error ${type} ${targetType}:`, error);
    }
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string
  ) => {
    e.preventDefault();
    if (parentId) {
      const replyContent = replyContents[parentId]?.trim();
      if (!replyContent) {
        toast.error(t('community2.error.emptyReply', { defaultValue: 'Please enter a reply.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
        return;
      }
      try {
        const response = await api.post<{ reply: Comment }>(`/comments/${parentId}/replies`, { content: replyContent });
        setPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === parentId
              ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
              : comment
          )
        }) : prevPost);
        setDisplayPost(prevPost => prevPost ? ({
          ...prevPost,
          comments: prevPost.comments.map(comment =>
            comment._id === parentId
              ? { ...comment, replies: [...(comment.replies || []), response.data.reply] }
              : comment
          )
        }) : prevPost);
        setReplyContents(prev => ({ ...prev, [parentId]: "" }));
        setReplyStates(prev => prev.filter(r => r.commentId !== parentId));
        toast.success(t('community2.success.replyPosted', { defaultValue: 'Reply posted successfully!' }), {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error(t('community2.error.loginToReply', { defaultValue: 'Please log in to reply.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (error.response?.status === 400) {
          toast.error(t('community2.error.invalidReply', { defaultValue: 'Invalid reply or comment not available.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error(t('community2.error.replyFailed', { defaultValue: 'Failed to post reply.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
        console.error('Error submitting reply:', error);
      }
    } else {
      if (!newComment.trim() || !postId) {
        toast.error(t('community2.error.emptyComment', { defaultValue: 'Please enter a comment.' }), {
          position: 'top-right',
          style: { background: '#fee2e2', color: '#dc2626' }
        });
        return;
      }
      try {
        const response = await api.post<{ comment: Comment }>(`/posts/${postId}/comments`, { content: newComment });
        setPost((prevPost: Post | null) =>
          prevPost
            ? ({
                ...prevPost,
                comments: [...(prevPost.comments || []), response.data.comment],
              } as Post)
            : prevPost
        );
        setDisplayPost((prevPost: Post | null) =>
          prevPost
            ? ({
                ...prevPost,
                comments: [...(prevPost.comments || []), response.data.comment],
              } as Post)
            : prevPost
        );
        setNewComment("");
        toast.success(t('community2.success.commentPosted', { defaultValue: 'Comment posted successfully!' }), {
          position: 'top-right',
          style: { background: '#dcfce7', color: '#15803d' }
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error(t('community2.error.loginToComment', { defaultValue: 'Please log in to comment.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else if (error.response?.status === 400) {
          toast.error(t('community2.error.invalidComment', { defaultValue: 'Invalid comment or post not available.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        } else {
          toast.error(t('community2.error.commentFailed', { defaultValue: 'Failed to post comment.' }), {
            position: 'top-right',
            style: { background: '#fee2e2', color: '#dc2626' }
          });
        }
        console.error('Error submitting comment:', error);
      }
    }
  };

  const toggleReply = (commentId: string) => {
    setReplyStates((prev) => {
      const existing = prev.find((r) => r.commentId === commentId);
      if (existing) {
        return prev.filter((r) => r.commentId !== commentId);
      } else {
        return [...prev, { commentId, isOpen: true }];
      }
    });
  };

  const toggleCollapse = (commentId: string) => {
    setCollapsedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return t('community2.date.justNow', { defaultValue: 'Just now' });
    if (diffHours < 24) return t('community2.date.hoursAgo', { count: diffHours, defaultValue: `${diffHours} hours ago` });
    if (diffDays < 7) return t('community2.date.daysAgo', { count: diffDays, defaultValue: `${diffDays} days ago` });
    return date.toLocaleDateString();
  };

  const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isCollapsed = collapsedComments.has(comment._id);
    const replyState = replyStates.find((r) => r.commentId === comment._id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const maxDepth = 6;

    return (
      <div className={`${depth > 0 ? "ml-4 md:ml-6" : ""} ${depth > 0 ? "border-l-2 border-slate-200 pl-4" : ""}`}>
        <Card className={`bg-white/80 backdrop-blur-sm border-slate-200 ${depth === 0 ? "mb-4" : "mb-3"}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-slate-800">{comment.userId?.username || t('community2.anonymous', { defaultValue: 'Anonymous' })}</span>
                  <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCollapse(comment._id)}
                      className="h-6 px-1 text-slate-500 hover:text-slate-700"
                    >
                      {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      <span className="ml-1 text-xs">{comment.replies.length}</span>
                    </Button>
                  )}
                </div>
                <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("upvote", comment._id, "comment")}
                    className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.upvotes?.length || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("downvote", comment._id, "comment")}
                    className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.downvotes?.length || 0}</span>
                  </Button>
                  {depth < maxDepth && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReply(comment._id)}
                      className="h-7 px-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                    >
                      <Reply className="w-3 h-3" />
                      <span className="ml-1 text-xs">{t('community2.reply', { defaultValue: 'Reply' })}</span>
                    </Button>
                  )}
                </div>
                {replyState?.isOpen && (
                  <form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="mt-3">
                    <Textarea
                      value={replyContents[comment._id] || ""}
                      onChange={(e) => setReplyContents(prev => ({ ...prev, [comment._id]: e.target.value }))}
                      placeholder={t('community2.replyPlaceholder', { defaultValue: 'Write a reply...' })}
                      className="min-h-[80px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button type="submit" size="sm" className="bg-slate-800 hover:bg-slate-900">
                        {t('community2.postReply', { defaultValue: 'Post Reply' })}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReply(comment._id)}
                        className="text-slate-600 hover:text-slate-700"
                      >
                        {t('community2.cancel', { defaultValue: 'Cancel' })}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {hasReplies && !isCollapsed && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

   if (loading) return <div className="text-center py-12">{t('community2.loading', { defaultValue: 'Loading...' })}</div>;
  if (!displayPost) return <div className="text-center py-12">{t('community2.noPosts', { defaultValue: 'No post found.' })}</div>;
  
  return (
    // <div>
    //   <Sidebar2 />
    //   <div className="min-h-screen relative overflow-hidden">
    //     <ToastContainer position="top-right" autoClose={3000} />
    //     <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
    //       <div
    //         className="absolute inset-0 opacity-20"
    //         style={{
    //           backgroundImage: `
    //             linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
    //             linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
    //           `,
    //           backgroundSize: "40px 40px",
    //         }}
    //       />
    //       <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
    //       <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
    //     </div>
    //     <div className="relative z-10 max-w-4xl mx-auto p-6">
    //       <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
    //         <CardHeader className="pb-4">
    //           <div className="flex items-center gap-2 mb-3">
    //             <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
    //               {displayPost.schemeName}
    //             </Badge>
    //           </div>
    //           <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{displayPost.title}</h1>
    //           <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
    //             <div className="flex items-center gap-1">
    //               <User className="w-4 h-4" />
    //               <span>{displayPost.userId?.username || t('community2.anonymous', { defaultValue: 'Anonymous' })}</span>
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <Calendar className="w-4 h-4" />
    //               <span>{formatDate(displayPost.createdAt)}</span>
    //             </div>
    //           </div>
    //         </CardHeader>
    //         <CardContent>
    //           <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{displayPost.description}</p>
    //           <div className="flex items-center gap-3">
    //             <Button
    //               variant="ghost"
    //               onClick={() => handleVote("upvote")}
    //               className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
    //             >
    //               <ArrowUp className="w-4 h-4 mr-1" />
    //               {displayPost.upvotes?.length || 0}
    //             </Button>
    //             <Button
    //               variant="ghost"
    //               onClick={() => handleVote("downvote")}
    //               className="text-red-500 hover:text-red-600 hover:bg-red-50"
    //             >
    //               <ArrowDown className="w-4 h-4 mr-1" />
    //               {displayPost.downvotes?.length || 0}
    //             </Button>
    //             <Badge variant="secondary" className="bg-slate-100 text-slate-700">
    //               <MessageCircle className="w-3 h-3 mr-1" />
    //               {t('community2.comments', { count: displayPost.comments?.length || 0, defaultValue: `${displayPost.comments?.length || 0} comments` })}
    //             </Badge>
    //           </div>
    //         </CardContent>
    //       </Card>
    //       <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
    //         <CardHeader>
    //           <h3 className="text-lg font-semibold text-slate-800">{t('community2.addComment', { defaultValue: 'Add a Comment' })}</h3>
    //         </CardHeader>
    //         <CardContent>
    //           <form onSubmit={handleCommentSubmit}>
    //             <Textarea
    //               value={newComment}
    //               onChange={(e) => setNewComment(e.target.value)}
    //               placeholder={t('community2.commentPlaceholder', { defaultValue: 'Share your thoughts or ask a question...' })}
    //               className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
    //             />
    //             <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
    //               {t('community2.postComment', { defaultValue: 'Post Comment' })}
    //             </Button>
    //           </form>
    //         </CardContent>
    //       </Card>
    //       <div className="space-y-6">
    //         <div className="flex items-center gap-2">
    //           <h2 className="text-xl font-semibold text-slate-800">{t('community2.comments', { count: displayPost.comments?.length || 0, defaultValue: `${displayPost.comments?.length || 0} comments` })}</h2>
    //         </div>
    //         {displayPost.comments && displayPost.comments.length > 0 ? (
    //           <div className="space-y-4">
    //             {displayPost.comments.map((comment) => (
    //               <CommentComponent key={comment._id} comment={comment} />
    //             ))}
    //           </div>
    //         ) : (
    //           <div className="text-center py-12">
    //             <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    //             <h3 className="text-lg font-semibold text-slate-600 mb-2">{t('community2.noComments', { defaultValue: 'No comments yet' })}</h3>
    //             <p className="text-slate-500">{t('community2.noCommentsMessage', { defaultValue: 'Be the first to share your thoughts!' })}</p>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>


    <div>
      <Sidebar2 />
      <div className="min-h-screen relative overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251, 146, 60, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251, 146, 60, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                  {displayPost.schemeName}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 leading-tight">{displayPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{displayPost.userId?.username || t('community2.anonymous', { defaultValue: 'Anonymous' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(displayPost.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed mb-6 text-base md:text-lg">{displayPost.description}</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleVote("upvote")}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {displayPost.upvotes?.length || 0}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleVote("downvote")}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  {displayPost.downvotes?.length || 0}
                </Button>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {t('community2.comments', { count: displayPost.comments?.length || 0 })}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm border-slate-200 mb-8 shadow-lg">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-800">{t('community2.addComment', { defaultValue: 'Add a Comment' })}</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit}>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('community2.commentPlaceholder', { defaultValue: 'Share your thoughts or ask a question...' })}
                  className="min-h-[100px] bg-white/90 border-slate-200 focus:border-slate-400 resize-none mb-4"
                />
                <Button type="submit" className="bg-slate-800 hover:bg-slate-900">
                  {t('community2.postComment', { defaultValue: 'Post Comment' })}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-800">{t('community2.comments', { count: displayPost.comments?.length || 0 })}</h2>
            </div>
            {displayPost.comments && displayPost.comments.length > 0 ? (
              <div className="space-y-4">
                {displayPost.comments.map((comment) => (
                  <CommentComponent key={comment._id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">{t('community2.noComments', { defaultValue: 'No comments yet' })}</h3>
                <p className="text-slate-500">{t('community2.noCommentsMessage', { defaultValue: 'Be the first to share your thoughts!' })}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}