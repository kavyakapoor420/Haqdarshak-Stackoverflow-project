const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const schemeNameData = require('./SchemeNameData/schemNameData.json');

const app = express();

// Middleware
// app.use(cors("*"));
app.use(cors({
  origin: "*", // or your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB Connection
// const mongo_uri1='mongodb+srv://kavyakapoor413:Helloworld@cluster01.4zpagwq.mongodb.net/KavyaGPT?retryWrites=true&w=majority&appName=Cluster01'
const mongo_uri2='mongodb://localhost:27017/postReviewSystem'

mongoose.connect(mongo_uri2)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  notifications: [{
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    comment: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    createdAt: { type: Date, default: Date.now }
  }]
});

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  schemeName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  rejectionComment: { type: String },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// New Chat Schema
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    mergedAudioData: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Chat = mongoose.model('Chat', chatSchema);

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const getCommentsWithReplies = async (comments) => {
  return Promise.all(comments.map(async (comment) => {
    const replies = await Comment.find({ parentCommentId: comment._id })
      .populate('userId', 'username')
      .sort({ createdAt: 1 });
    return {
      ...comment.toObject(),
      replies: replies.length > 0 ? await getCommentsWithReplies(replies) : []
    };
  }));
};

// --- Routes ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with that email or username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, username: user.username, message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to create a post' });
    }
    const { title, description, schemeName } = req.body;
    if (!title || !title.trim() || !description || !description.trim()) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const post = new Post({
      title: title.trim(),
      description: description.trim(),
      schemeName: schemeName.trim(),
      userId: req.user._id,
      status: 'pending',
      upvotes: [],
      downvotes: []
    });
    await post.save();

    // Award 1 point for creating a post
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 1 } });

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      admin.notifications.push({
        postId: post._id,
        message: `New post "${title}" submitted for review`,
        status: 'pending'
      });
      await admin.save();
    }
    res.status(201).json({ message: 'Post submitted for review', post });
  } catch (error) {
    console.error('Error in /api/posts:', error);
    res.status(500).json({ message: 'Server error creating post', error: error.message });
  }
});

app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const query = status === 'all' ? {} : { status };
    const posts = await Post.find(query).populate('userId', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin posts', error: error.message });
  }
});

app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, rejectionComment } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const previousStatus = post.status;
    post.status = status;
    if (status === 'rejected') post.rejectionComment = rejectionComment;
    await post.save();

    const user = await User.findById(post.userId);
    if (user) {
      user.notifications.push({
        postId: post._id,
        message: `Your post "${post.title}" has been ${status}`,
        comment: status === 'rejected' ? rejectionComment : '',
        status
      });
      await user.save();

      // Update points based on status change
      if (status === 'accepted' && previousStatus !== 'accepted') {
        await User.findByIdAndUpdate(post.userId, { $inc: { points: 2 } });
      } else if (status === 'rejected' && previousStatus === 'accepted') {
        await User.findByIdAndUpdate(post.userId, { $inc: { points: -3 } });
      }
    }
    res.json({ message: `Post ${status} successfully`, post });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating post status', error: error.message });
  }
});

app.get('/api/posts/approved', async (req, res) => {
  try {
    let query = Post.find({ status: 'accepted' }).populate('userId', 'username');
    if (req.query.sort === 'createdAt' && req.query.order === 'desc') {
      query = query.sort({ createdAt: -1 });
    } else if (req.query.sort === 'upvotes.length' && req.query.order === 'desc') {
      const posts = await query.lean();
      posts.sort((a, b) => b.upvotes.length - a.upvotes.length);
      return res.json(posts);
    }
    if (req.query.unanswered) {
      const posts = await query.lean();
      const unansweredPosts = [];
      for (const post of posts) {
        const topLevelCommentsCount = await Comment.countDocuments({ postId: post._id, parentCommentId: null });
        if (topLevelCommentsCount === 0) unansweredPosts.push(post);
      }
      return res.json(unansweredPosts);
    }
    const posts = await query;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching approved posts', error: error.message });
  }
});

app.get('/api/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('userId', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const topLevelComments = await Comment.find({ postId: post._id, parentCommentId: null })
      .populate('userId', 'username')
      .sort({ createdAt: 1 });
    const commentsWithReplies = await getCommentsWithReplies(topLevelComments);
    res.json({ ...post.toObject(), comments: commentsWithReplies });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching post details', error: error.message });
  }
});

app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
    const { voteType } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });
    const userId = req.user._id;
    if (voteType === 'upvote') {
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
      if (!post.upvotes.includes(userId)) post.upvotes.push(userId);
      else return res.status(400).json({ message: 'Already upvoted' });
    } else if (voteType === 'downvote') {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
      if (!post.downvotes.includes(userId)) post.downvotes.push(userId);
      else return res.status(400).json({ message: 'Already downvoted' });
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    await post.save();
    res.json({ message: `${voteType} recorded`, post });
  } catch (error) {
    res.status(500).json({ message: 'Server error voting on post', error: error.message });
  }
});

app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to comment' });
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });
    const comment = new Comment({
      postId: post._id,
      userId: req.user._id,
      content,
      parentCommentId: null
    });
    await comment.save();
    const populatedComment = await comment.populate('userId', 'username');
    res.status(201).json({ message: 'Comment added', comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding comment', error: error.message });
  }
});

app.post('/api/comments/:commentId/vote', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
    const { voteType } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment or reply not found' });
    const userId = req.user._id;
    if (voteType === 'upvote') {
      comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
      if (!comment.upvotes.includes(userId)) comment.upvotes.push(userId);
      else return res.status(400).json({ message: 'Already upvoted' });
    } else if (voteType === 'downvote') {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
      if (!comment.downvotes.includes(userId)) comment.downvotes.push(userId);
      else return res.status(400).json({ message: 'Already downvoted' });
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    await comment.save();
    res.json({ message: `${voteType} recorded`, comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error voting on comment', error: error.message });
  }
});

app.post('/api/comments/:commentId/replies', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to reply' });
    const { content } = req.body;
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) return res.status(404).json({ message: 'Parent comment not found' });
    const post = await Post.findById(parentComment.postId);
    if (!post || post.status !== 'accepted') {
      return res.status(400).json({ message: 'Cannot reply to comments on an unaccepted post.' });
    }
    const reply = new Comment({
      postId: parentComment.postId,
      userId: req.user._id,
      content,
      parentCommentId: parentComment._id
    });
    await reply.save();
    const populatedReply = await reply.populate('userId', 'username');
    res.status(201).json({ message: 'Reply added', reply: populatedReply });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding reply', error: error.message });
  }
});

app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to view notifications' });
    const user = await User.findById(req.user._id).populate('notifications.postId', 'title');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications', error: error.message });
  }
});

app.get('/api/user/stats', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const userId = req.user._id;
    const totalPosts = await Post.countDocuments({ userId });
    const acceptedPosts = await Post.countDocuments({ userId, status: 'accepted' });
    const rejectedPosts = await Post.countDocuments({ userId, status: 'rejected' });
    const pendingPosts = await Post.countDocuments({ userId, status: 'pending' });
    const totalUpvotes = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalUpvotes: { $sum: { $size: "$upvotes" } } } },
    ]);
    const totalComments = await Comment.countDocuments({ userId });
    const points = (await User.findById(userId)).points || 0;

    res.json({
      totalPosts,
      acceptedPosts,
      rejectedPosts,
      pendingPosts,
      totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
      totalComments,
      points,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
  }
});

app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const user = await User.findById(req.user._id).select('username role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
  }
});

// New Chat Endpoints
app.get('/api/chats', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to view chats' });
    const chats = await Chat.find({ userId: req.user._id })
      .select('title messages createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching chats', error: error.message });
  }
});

app.post('/api/chats', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to create chat' });
    const { title, messages } = req.body;
    if (!title || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Title and messages are required' });
    }
    const chat = new Chat({
      userId: req.user._id,
      title: title.trim(),
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await chat.save();
    res.status(201).json({ message: 'Chat created successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating chat', error: error.message });
  }
});

app.put('/api/chats/:chatId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to update chat' });
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages are required' });
    }
    const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found or unauthorized' });
    chat.messages = messages;
    chat.updatedAt = new Date();
    await chat.save();
    res.json({ message: 'Chat updated successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating chat', error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'userId',
          as: 'posts'
        }
      },
      {
        $project: {
          username: 1,
          points: 1,
          acceptedPosts: {
            $size: {
              $filter: {
                input: '$posts',
                cond: { $eq: ['$$this.status', 'accepted'] }
              }
            }
          }
        }
      },
      {
        $sort: { points: -1 }
      },
      {
        $group: {
          _id: null,
          data: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $project: {
          _id: 0,
          data: {
            $map: {
              input: { $range: [0, { $size: '$data' }] },
              as: 'index',
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ['$data', '$$index'] },
                  { rank: { $add: ['$$index', 1] } }
                ]
              }
            }
          }
        }
      },
      {
        $unwind: '$data'
      },
      {
        $replaceRoot: { newRoot: '$data' }
      }
    ]).exec();

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching leaderboard', error: error.message });
  }
});

app.get('/api/scheme-names', (req, res) => {
  res.json(schemeNameData);
});

app.get('/api/posts/by-scheme/:schemeName', authMiddleware, async (req, res) => {
  try {
    const schemeName = req.params.schemeName.trim();
    const posts = await Post.find({ schemeName, status: 'accepted' }).select('title description schemeName');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching posts by scheme', error: error.message });
  }
});

app.put('/api/markdown/update/:schemeName', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const schemeName = req.params.schemeName.trim();
    const markdownDoc = await db.collection('markdown_files').findOne({ scheme_name: schemeName });

    if (!markdownDoc) {
      return res.status(404).json({ message: 'Markdown document not found for this scheme' });
    }

    const posts = await Post.find({ schemeName, status: 'accepted' }).select('title description schemeName');
    if (posts.length === 0) {
      return res.json({ message: 'No approved posts to append', markdown_content: markdownDoc.markdown_content });
    }

    let updatedMarkdownContent = markdownDoc.markdown_content;
    posts.forEach(post => {
      updatedMarkdownContent += `\n\n## User Post: ${post.title}\n\n**Scheme Name:** ${post.schemeName}\n\n**Description:** ${post.description}\n`;
    });

    const result = await db.collection('markdown_files').updateOne(
      { _id: markdownDoc._id },
      { $set: { markdown_content: updatedMarkdownContent, updated_at: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update markdown content' });
    }

    res.json({ message: 'Markdown content updated with approved posts', markdown_content: updatedMarkdownContent });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating markdown content', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const schemeNameData=require('./SchemeNameData/schemNameData.json')

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // JWT Secret
// const JWT_SECRET = 'your_jwt_secret'; 

// // --- Mongoose Schemas ---

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   points: { type: Number, default: 0 },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });



// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   schemeName:{type:String,required:true},
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     req.user = null;
//     return next();
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// const adminMiddleware = (req, res, next) => {
//   if (!req.user || req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// const getCommentsWithReplies = async (comments) => {
//   return Promise.all(comments.map(async (comment) => {
//     const replies = await Comment.find({ parentCommentId: comment._id })
//       .populate('userId', 'username')
//       .sort({ createdAt: 1 });
//     return {
//       ...comment.toObject(),
//       replies: replies.length > 0 ? await getCommentsWithReplies(replies) : []
//     };
//   }));
// };

// // --- Routes ---

// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User with that email or username already exists.' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during registration', error: error.message });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, role: user.role, message: 'Login successful!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during login', error: error.message });
//   }
// });

// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Authentication required to create a post' });
//     }
//     const { title, description,schemeName} = req.body;
//     if (!title || !title.trim() || !description || !description.trim()) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
//     const post = new Post({
//       title: title.trim(),
//       description: description.trim(),
//       schemeName:schemeName.trim(),
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();

//     // Award 1 point for creating a post
//     await User.findByIdAndUpdate(req.user._id, { $inc: { points: 1 } });

//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     console.error('Error in /api/posts:', error);
//     res.status(500).json({ message: 'Server error creating post', error: error.message });
//   }
// });

// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const status = req.query.status || 'pending';
//     const query = status === 'all' ? {} : { status };
//     const posts = await Post.find(query).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching admin posts', error: error.message });
//   }
// });

// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     const previousStatus = post.status;
//     post.status = status;
//     if (status === 'rejected') post.rejectionComment = rejectionComment;
//     await post.save();

//     const user = await User.findById(post.userId);
//     if (user) {
//       user.notifications.push({
//         postId: post._id,
//         message: `Your post "${post.title}" has been ${status}`,
//         comment: status === 'rejected' ? rejectionComment : '',
//         status
//       });
//       await user.save();

//       // Update points based on status change
//       if (status === 'accepted' && previousStatus !== 'accepted') {
//         await User.findByIdAndUpdate(post.userId, { $inc: { points: 2 } }); // +2 (3 - 1 already given)
//       } else if (status === 'rejected' && previousStatus === 'accepted') {
//         await User.findByIdAndUpdate(post.userId, { $inc: { points: -3 } }); // Remove 3 points
//       }
//     }
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error updating post status', error: error.message });
//   }
// });

// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     let query = Post.find({ status: 'accepted' }).populate('userId', 'username');
//     if (req.query.sort === 'createdAt' && req.query.order === 'desc') {
//       query = query.sort({ createdAt: -1 });
//     } else if (req.query.sort === 'upvotes.length' && req.query.order === 'desc') {
//       const posts = await query.lean();
//       posts.sort((a, b) => b.upvotes.length - a.upvotes.length);
//       return res.json(posts);
//     }
//     if (req.query.unanswered) {
//       const posts = await query.lean();
//       const unansweredPosts = [];
//       for (const post of posts) {
//         const topLevelCommentsCount = await Comment.countDocuments({ postId: post._id, parentCommentId: null });
//         if (topLevelCommentsCount === 0) unansweredPosts.push(post);
//       }
//       return res.json(unansweredPosts);
//     }
//     const posts = await query;
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching approved posts', error: error.message });
//   }
// });

// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId).populate('userId', 'username');
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     const topLevelComments = await Comment.find({ postId: post._id, parentCommentId: null })
//       .populate('userId', 'username')
//       .sort({ createdAt: 1 });
//     const commentsWithReplies = await getCommentsWithReplies(topLevelComments);
//     res.json({ ...post.toObject(), comments: commentsWithReplies });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching post details', error: error.message });
//   }
// });

// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });
//     const userId = req.user._id;
//     if (voteType === 'upvote') {
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//       if (!post.upvotes.includes(userId)) post.upvotes.push(userId);
//       else return res.status(400).json({ message: 'Already upvoted' });
//     } else if (voteType === 'downvote') {
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//       if (!post.downvotes.includes(userId)) post.downvotes.push(userId);
//       else return res.status(400).json({ message: 'Already downvoted' });
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error voting on post', error: error.message });
//   }
// });

// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to comment' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content,
//       parentCommentId: null
//     });
//     await comment.save();
//     const populatedComment = await comment.populate('userId', 'username');
//     res.status(201).json({ message: 'Comment added', comment: populatedComment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error adding comment', error: error.message });
//   }
// });

// app.post('/api/comments/:commentId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
//     const { voteType } = req.body;
//     const comment = await Comment.findById(req.params.commentId);
//     if (!comment) return res.status(404).json({ message: 'Comment or reply not found' });
//     const userId = req.user._id;
//     if (voteType === 'upvote') {
//       comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
//       if (!comment.upvotes.includes(userId)) comment.upvotes.push(userId);
//       else return res.status(400).json({ message: 'Already upvoted' });
//     } else if (voteType === 'downvote') {
//       comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
//       if (!comment.downvotes.includes(userId)) comment.downvotes.push(userId);
//       else return res.status(400).json({ message: 'Already downvoted' });
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
//     await comment.save();
//     res.json({ message: `${voteType} recorded`, comment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error voting on comment', error: error.message });
//   }
// });

// app.post('/api/comments/:commentId/replies', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to reply' });
//     const { content } = req.body;
//     const parentComment = await Comment.findById(req.params.commentId);
//     if (!parentComment) return res.status(404).json({ message: 'Parent comment not found' });
//     const post = await Post.findById(parentComment.postId);
//     if (!post || post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Cannot reply to comments on an unaccepted post.' });
//     }
//     const reply = new Comment({
//       postId: parentComment.postId,
//       userId: req.user._id,
//       content,
//       parentCommentId: parentComment._id
//     });
//     await reply.save();
//     const populatedReply = await reply.populate('userId', 'username');
//     res.status(201).json({ message: 'Reply added', reply: populatedReply });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error adding reply', error: error.message });
//   }
// });

// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to view notifications' });
//     const user = await User.findById(req.user._id).populate('notifications.postId', 'title');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching notifications', error: error.message });
//   }
// });

// app.get('/api/user/stats', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const userId = req.user._id;
//     const totalPosts = await Post.countDocuments({ userId });
//     const acceptedPosts = await Post.countDocuments({ userId, status: 'accepted' });
//     const rejectedPosts = await Post.countDocuments({ userId, status: 'rejected' });
//     const pendingPosts = await Post.countDocuments({ userId, status: 'pending' });
//     const totalUpvotes = await Post.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       { $group: { _id: null, totalUpvotes: { $sum: { $size: "$upvotes" } } } },
//     ]);
//     const totalComments = await Comment.countDocuments({ userId });
//     const points = (await User.findById(userId)).points || 0;

//     res.json({
//       totalPosts,
//       acceptedPosts,
//       rejectedPosts,
//       pendingPosts,
//       totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
//       totalComments,
//       points,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
//   }
// });

// app.get('/api/user/profile', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).select('username role');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ username: user.username, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
//   }
// });

// // Optimized Leaderboard Endpoint
// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const leaderboard = await User.aggregate([
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'userId',
//           as: 'posts'
//         }
//       },
//       {
//         $project: {
//           username: 1,
//           points: 1,
//           acceptedPosts: {
//             $size: {
//               $filter: {
//                 input: '$posts',
//                 cond: { $eq: ['$$this.status', 'accepted'] }
//               }
//             }
//           }
//         }
//       },
//       {
//         $sort: { points: -1 }
//       },
//       {
//         $group: {
//           _id: null,
//           data: {
//             $push: '$$ROOT'
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           data: {
//             $map: {
//               input: { $range: [0, { $size: '$data' }] },
//               as: 'index',
//               in: {
//                 $mergeObjects: [
//                   { $arrayElemAt: ['$data', '$$index'] },
//                   { rank: { $add: ['$$index', 1] } }
//                 ]
//               }
//             }
//           }
//         }
//       },
//       {
//         $unwind: '$data'
//       },
//       {
//         $replaceRoot: { newRoot: '$data' }
//       }
//     ]).exec();

//     res.json(leaderboard);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching leaderboard', error: error.message });
//   }
// });

// app.get('/api/scheme-names',(req,res)=>{
//     res.json(schemeNameData);
// })



// app.get('/api/posts/by-scheme/:schemeName', authMiddleware, async (req, res) => {
//   try {
//     const schemeName = req.params.schemeName.trim();
//     const posts = await Post.find({ schemeName, status: 'approved' }).select('title description schemeName');
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching posts by scheme', error: error.message });
//   }
// });

// app.put('/api/markdown/update/:schemeName', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const schemeName = req.params.schemeName.trim();
//     const markdownDoc = await db.collection('markdown_files').findOne({ scheme_name: schemeName });

//     if (!markdownDoc) {
//       return res.status(404).json({ message: 'Markdown document not found for this scheme' });
//     }

//     const posts = await Post.find({ schemeName, status: 'approved' }).select('title description schemeName');
//     if (posts.length === 0) {
//       return res.json({ message: 'No approved posts to append', markdown_content: markdownDoc.markdown_content });
//     }

//     // Append post data to markdown_content
//     let updatedMarkdownContent = markdownDoc.markdown_content;
//     posts.forEach(post => {
//       updatedMarkdownContent += `\n\n## User Post: ${post.title}\n\n**Scheme Name:** ${post.schemeName}\n\n**Description:** ${post.description}\n`;
//     });

//     // Update the document
//     const result = await db.collection('markdown_files').updateOne(
//       { _id: markdownDoc._id },
//       { $set: { markdown_content: updatedMarkdownContent, updated_at: new Date() } }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(500).json({ message: 'Failed to update markdown content' });
//     }

//     res.json({ message: 'Markdown content updated with approved posts', markdown_content: updatedMarkdownContent });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error updating markdown content', error: error.message });
//   }
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// // Ensure your MongoDB is running, typically on port 27017
// mongoose.connect('mongodb://localhost:27017/postReviewSystem')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // JWT Secret - IMPORTANT: Use a strong, environment-variable-based secret in production
// const JWT_SECRET = 'your_jwt_secret'; 

// // --- Mongoose Schemas ---

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true }, // Added required: true
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String, // This might be for rejection comments
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   points: { type: Number, default: 0 },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   // New field for nested comments: links to the parent comment
//   parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now },
//   // Removed embedded comments array, comments will be separate documents
//   // comments: [commentSchema] 
// });

// // --- Mongoose Models ---
// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema); // Define Comment model

// // --- Authentication Middleware ---
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     // If no token, proceed without a user (for public routes)
//     req.user = null;
//     return next();
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     // If token is invalid, send 401
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// // --- Admin Authorization Middleware ---
// const adminMiddleware = (req, res, next) => {
//   if (!req.user || req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // --- Helper function for recursive comment fetching ---
// // This function fetches replies for a given set of comments recursively
// const getCommentsWithReplies = async (comments) => {
//   return Promise.all(comments.map(async (comment) => {
//     // Find replies where parentCommentId matches the current comment's _id
//     const replies = await Comment.find({ parentCommentId: comment._id })
//       .populate('userId', 'username') // Populate the user who made the reply
//       .sort({ createdAt: 1 }); // Sort replies by creation time

//     return {
//       ...comment.toObject(), // Convert Mongoose document to plain JavaScript object
//       replies: replies.length > 0 ? await getCommentsWithReplies(replies) : [] // Recursively get replies for replies
//     };
//   }));
// };

// // --- Routes ---

// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Check if user with email or username already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User with that email or username already exists.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during registration', error: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
//     res.json({ token, role: user.role, message: 'Login successful!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during login', error: error.message });
//   }
// });

// // Create a new Post
// // app.post('/api/posts', authMiddleware, async (req, res) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ message: 'Authentication required to create a post' });
// //     const { title, description } = req.body;
// //     const post = new Post({
// //       title, description, userId: req.user._id, status: 'pending', upvotes: [], downvotes: []
// //     });
// //     await post.save();

// //     // Notify admins about the new post
// //     const admins = await User.find({ role: 'admin' });
// //     for (const admin of admins) {
// //       admin.notifications.push({ postId: post._id, message: `New post "${title}" submitted for review`, status: 'pending' });
// //       await admin.save();
// //     }
// //     res.status(201).json({ message: 'Post submitted for review', post });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error creating post', error: error.message });
// //   }
// // });


// // server.js (Updated /api/posts endpoint)
// // app.post('/api/posts', authMiddleware, async (req, res) => {
// //   try {
// //     if (!req.user) {
// //       return res.status(401).json({ message: 'Authentication required to create a post' });
// //     }
// //     const { title, description } = req.body;

// //     // Validate input
// //     if (!title || !title.trim()) {
// //       return res.status(400).json({ message: 'Title is required' });
// //     }
// //     if (!description || !description.trim()) {
// //       return res.status(400).json({ message: 'Description is required' });
// //     }

// //     // Create and save the post
// //     const post = new Post({
// //       title: title.trim(),
// //       description: description.trim(),
// //       userId: req.user._id,
// //       status: 'pending',
// //       upvotes: [],
// //       downvotes: []
// //     });
// //     await post.save();

// //     // Notify admins about the new post
// //     try {
// //       const admins = await User.find({ role: 'admin' });
// //       for (const admin of admins) {
// //         admin.notifications.push({
// //           postId: post._id,
// //           message: `New post "${title}" submitted for review`,
// //           status: 'pending'
// //         });
// //         await admin.save();
// //       }
// //     } catch (notificationError) {
// //       console.error('Error sending admin notifications:', notificationError.message);
// //       // Continue even if notifications fail to avoid blocking post creation
// //     }

// //     res.status(201).json({ message: 'Post submitted for review', post });
// //   } catch (error) {
// //     console.error('Error in /api/posts:', {
// //       message: error.message,
// //       stack: error.stack,
// //       body: req.body,
// //       userId: req.user?._id
// //     });
// //     res.status(500).json({ message: 'Server error creating post', error: error.message });
// //   }
// // });


// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Authentication required to create a post' });
//     }
//     const { title, description } = req.body;
//     if (!title || !title.trim() || !description || !description.trim()) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
//     const post = new Post({
//       title: title.trim(),
//       description: description.trim(),
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();

//     // Award 1 point for creating a post
//     await User.findByIdAndUpdate(req.user._id, { $inc: { points: 1 } });

//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     console.error('Error in /api/posts:', error);
//     res.status(500).json({ message: 'Server error creating post', error: error.message });
//   }
// });


// // Get Pending Posts for Admin Review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching admin posts', error: error.message });
//   }
// });

// // Update Post Status (Admin Only)
// // app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
// //   try {
// //     const { status, rejectionComment } = req.body;
// //     const post = await Post.findById(req.params.postId);
// //     if (!post) return res.status(404).json({ message: 'Post not found' });

// //     post.status = status;
// //     if (status === 'rejected') post.rejectionComment = rejectionComment;
// //     await post.save();

// //     // Notify the user who created the post
// //     const user = await User.findById(post.userId);
// //     if (user) {
// //       user.notifications.push({
// //         postId: post._id,
// //         message: `Your post "${post.title}" has been ${status}`,
// //         comment: status === 'rejected' ? rejectionComment : '',
// //         status
// //       });
// //       await user.save();
// //     }
// //     res.json({ message: `Post ${status} successfully`, post });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error updating post status', error: error.message });
// //   }
// // });


// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     const previousStatus = post.status;
//     post.status = status;
//     if (status === 'rejected') post.rejectionComment = rejectionComment;
//     await post.save();

//     const user = await User.findById(post.userId);
//     if (user) {
//       user.notifications.push({
//         postId: post._id,
//         message: `Your post "${post.title}" has been ${status}`,
//         comment: status === 'rejected' ? rejectionComment : '',
//         status
//       });
//       await user.save();

//       // Update points based on status change
//       if (status === 'accepted' && previousStatus !== 'accepted') {
//         await User.findByIdAndUpdate(post.userId, { $inc: { points: 2 } }); // +2 (3 - 1 already given)
//       } else if (status === 'rejected' && previousStatus === 'accepted') {
//         await User.findByIdAndUpdate(post.userId, { $inc: { points: -3 } }); // Remove 3 points
//       }
//     }
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error updating post status', error: error.message });
//   }
// });

// // Get All Approved Posts (Community Feed)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     let query = Post.find({ status: 'accepted' }).populate('userId', 'username');

//     // Sorting logic
//     if (req.query.sort === 'createdAt' && req.query.order === 'desc') {
//       query = query.sort({ createdAt: -1 });
//     } else if (req.query.sort === 'upvotes.length' && req.query.order === 'desc') {
//       // For sorting by upvotes, you might need to use aggregation for better performance on large datasets
//       // For now, this will work but can be inefficient if upvotes array is huge.
//       // MongoDB doesn't directly support sorting by array length efficiently without indexes/aggregation
//       // For simplicity, we fetch and sort in memory if needed, or rely on client-side sorting.
//       // For a more robust solution, consider storing upvote count as a separate field.
//       const posts = await query.lean(); // Use .lean() for faster fetching
//       posts.sort((a, b) => b.upvotes.length - a.upvotes.length);
//       return res.json(posts);
//     }

//     // Filter for unanswered posts (posts with no top-level comments)
//     if (req.query.unanswered) {
//       const posts = await query.lean(); // Fetch all accepted posts
//       const unansweredPosts = [];
//       for (const post of posts) {
//         const topLevelCommentsCount = await Comment.countDocuments({ postId: post._id, parentCommentId: null });
//         if (topLevelCommentsCount === 0) {
//           unansweredPosts.push(post);
//         }
//       }
//       return res.json(unansweredPosts);
//     }

//     const posts = await query;
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching approved posts', error: error.message });
//   }
// });

// // Get Single Post Details with Nested Comments
// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId).populate('userId', 'username');
//     if (!post) return res.status(404).json({ message: 'Post not found' });

//     // Fetch top-level comments for the post
//     const topLevelComments = await Comment.find({ postId: post._id, parentCommentId: null })
//       .populate('userId', 'username')
//       .sort({ createdAt: 1 }); // Sort by creation date

//     // Recursively fetch replies for each comment
//     const commentsWithReplies = await getCommentsWithReplies(topLevelComments);

//     res.json({ ...post.toObject(), comments: commentsWithReplies });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching post details', error: error.message });
//   }
// });

// // Vote on a Post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });

//     const userId = req.user._id;

//     if (voteType === 'upvote') {
//       // Remove from downvotes if present
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//       // Add to upvotes if not already present
//       if (!post.upvotes.includes(userId)) {
//         post.upvotes.push(userId);
//       } else {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//     } else if (voteType === 'downvote') {
//       // Remove from upvotes if present
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//       // Add to downvotes if not already present
//       if (!post.downvotes.includes(userId)) {
//         post.downvotes.push(userId);
//       } else {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }

//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error voting on post', error: error.message });
//   }
// });

// // Add a Top-Level Comment to a Post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to comment' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post or post not accepted' });

//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content,
//       parentCommentId: null // This indicates a top-level comment
//     });
//     await comment.save();

//     // Populate user details for the response
//     const populatedComment = await comment.populate('userId', 'username');

//     res.status(201).json({ message: 'Comment added', comment: populatedComment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error adding comment', error: error.message });
//   }
// });

// // Vote on a Comment or Reply
// app.post('/api/comments/:commentId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to vote' });
//     const { voteType } = req.body;
//     const comment = await Comment.findById(req.params.commentId);
//     if (!comment) return res.status(404).json({ message: 'Comment or reply not found' });

//     const userId = req.user._id;

//     if (voteType === 'upvote') {
//       comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
//       if (!comment.upvotes.includes(userId)) {
//         comment.upvotes.push(userId);
//       } else {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//     } else if (voteType === 'downvote') {
//       comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
//       if (!comment.downvotes.includes(userId)) {
//         comment.downvotes.push(userId);
//       } else {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }

//     await comment.save();
//     res.json({ message: `${voteType} recorded`, comment });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error voting on comment', error: error.message });
//   }
// });

// // Add a Reply to a Comment (Nested Comment)
// app.post('/api/comments/:commentId/replies', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to reply' });
//     const { content } = req.body;
//     const parentComment = await Comment.findById(req.params.commentId);
//     if (!parentComment) return res.status(404).json({ message: 'Parent comment not found' });

//     // Ensure the post associated with the parent comment is accepted
//     const post = await Post.findById(parentComment.postId);
//     if (!post || post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Cannot reply to comments on an unaccepted post.' });
//     }

//     const reply = new Comment({
//       postId: parentComment.postId, // Reply belongs to the same post as the parent comment
//       userId: req.user._id,
//       content,
//       parentCommentId: parentComment._id // Link to the direct parent comment
//     });
//     await reply.save();

//     // Populate user details for the response
//     const populatedReply = await reply.populate('userId', 'username');

//     res.status(201).json({ message: 'Reply added', reply: populatedReply });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error adding reply', error: error.message });
//   }
// });

// // Get User Notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required to view notifications' });
//     // Populate postId for notifications to get post titles/details
//     const user = await User.findById(req.user._id).populate('notifications.postId', 'title');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching notifications', error: error.message });
//   }
// });

// // server.js (Add this before app.listen)
// // Get User Statistics


// // app.get('/api/user/stats', authMiddleware, async (req, res) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
// //     const userId = req.user._id;

// //     const totalPosts = await Post.countDocuments({ userId });
// //     const acceptedPosts = await Post.countDocuments({ userId, status: 'accepted' });
// //     const rejectedPosts = await Post.countDocuments({ userId, status: 'rejected' });
// //     const pendingPosts = await Post.countDocuments({ userId, status: 'pending' });
// //     const totalUpvotes = await Post.aggregate([
// //       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
// //       { $group: { _id: null, totalUpvotes: { $sum: { $size: "$upvotes" } } } },
// //     ]);
// //     const totalComments = await Comment.countDocuments({ userId });

// //     res.json({
// //       totalPosts,
// //       acceptedPosts,
// //       rejectedPosts,
// //       pendingPosts,
// //       totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
// //       totalComments,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
// //   }
// // });


// app.get('/api/user/stats', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const userId = req.user._id;
//     const totalPosts = await Post.countDocuments({ userId });
//     const acceptedPosts = await Post.countDocuments({ userId, status: 'accepted' });
//     const rejectedPosts = await Post.countDocuments({ userId, status: 'rejected' });
//     const pendingPosts = await Post.countDocuments({ userId, status: 'pending' });
//     const totalUpvotes = await Post.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       { $group: { _id: null, totalUpvotes: { $sum: { $size: "$upvotes" } } } },
//     ]);
//     const totalComments = await Comment.countDocuments({ userId });
//     const points = (await User.findById(userId)).points || 0;

//     res.json({
//       totalPosts,
//       acceptedPosts,
//       rejectedPosts,
//       pendingPosts,
//       totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
//       totalComments,
//       points,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
//   }
// });

// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const status = req.query.status || 'pending';
//     const query = status === 'all' ? {} : { status };
//     const posts = await Post.find(query).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching admin posts', error: error.message });
//   }
// });


// // server.js (Add this before app.listen)
// // Get User Statistics
// app.get('/api/user/stats', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const userId = req.user._id;

//     const totalPosts = await Post.countDocuments({ userId });
//     const acceptedPosts = await Post.countDocuments({ userId, status: 'accepted' });
//     const rejectedPosts = await Post.countDocuments({ userId, status: 'rejected' });
//     const pendingPosts = await Post.countDocuments({ userId, status: 'pending' });
//     const totalUpvotes = await Post.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       { $group: { _id: null, totalUpvotes: { $sum: { $size: "$upvotes" } } } },
//     ]);
//     const totalComments = await Comment.countDocuments({ userId });

//     res.json({
//       totalPosts,
//       acceptedPosts,
//       rejectedPosts,
//       pendingPosts,
//       totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
//       totalComments,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
//   }
// });

// // server.js (Add this before app.listen)
// // Get User Profile
// app.get('/api/user/profile', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).select('username');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ username: user.username ,role:user.role});
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
//   }
// });


// // Optimized Leaderboard Endpoint
// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const leaderboard = await User.aggregate([
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'userId',
//           as: 'posts'
//         }
//       },
//       {
//         $project: {
//           username: 1,
//           points: 1,
//           acceptedPosts: {
//             $size: {
//               $filter: {
//                 input: '$posts',
//                 cond: { $eq: ['$$this.status', 'accepted'] }
//               }
//             }
//           },
//           totalPosts: { $size: '$posts' }
//         }
//       },
//       {
//         $sort: { points: -1 }
//       },
//       {
//         $addFields: {
//           rank: { $add: [1, { $indexOfArray: [{ $sortArray: { input: '$$ROOT', sortBy: { points: -1 } } }, '$$ROOT'] }] }
//         }
//       }
//     ]).exec();

//     res.json(leaderboard);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching leaderboard', error: error.message });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/postReviewSystem');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   replies: [this],
//   parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now },
//   comments: [commentSchema]
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);

// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
//   next();
// };

// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     const post = new Post({
//       title, description, userId: req.user._id, status: 'pending', upvotes: [], downvotes: [], comments: []
//     });
//     await post.save();
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({ postId: post._id, message: `New post "${title}" submitted for review`, status: 'pending' });
//       await admin.save();
//     }
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     post.status = status;
//     if (status === 'rejected') post.rejectionComment = rejectionComment;
//     await post.save();
//     const user = await User.findById(post.userId);
//     user.notifications.push({ postId: post._id, message: `Your post "${post.title}" has been ${status}`, comment: status === 'rejected' ? rejectionComment : '', status });
//     await user.save();
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     let query = Post.find({ status: 'accepted' }).populate('userId', 'username').populate('comments.userId').populate('comments.replies.userId');
//     if (req.query.sort === 'createdAt' && req.query.order === 'desc') query = query.sort({ createdAt: -1 });
//     else if (req.query.sort === 'upvotes.length' && req.query.order === 'desc') query = query.sort({ 'upvotes.length': -1 });
//     else if (req.query.unanswered) query = query.where('comments').equals([]);
//     const posts = await query;
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId).populate('userId', 'username').populate('comments.userId').populate('comments.replies.userId');
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post' });
//     const userId = req.user._id;
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) return res.status(400).json({ message: 'Already upvoted' });
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) return res.status(400).json({ message: 'Already downvoted' });
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     }
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
//     if (!post || post.status !== 'accepted') return res.status(400).json({ message: 'Invalid post' });
//     const comment = { postId: post._id, userId: req.user._id, content, upvotes: [], downvotes: [], replies: [], parentId: null };
//     post.comments.push(comment);
//     await post.save();
//     res.status(201).json({ message: 'Comment added', comment: post.comments[post.comments.length - 1] });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/comments/:commentId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findOne({ 'comments._id': req.params.commentId });
//     if (!post) return res.status(404).json({ message: 'Comment not found' });
//     const comment = post.comments.id(req.params.commentId);
//     const userId = req.user._id;
//     if (voteType === 'upvote') {
//       if (comment.upvotes.includes(userId)) return res.status(400).json({ message: 'Already upvoted' });
//       comment.upvotes.push(userId);
//       comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (comment.downvotes.includes(userId)) return res.status(400).json({ message: 'Already downvoted' });
//       comment.downvotes.push(userId);
//       comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
//     }
//     await post.save();
//     res.json({ message: `${voteType} recorded`, comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/comments/:commentId/replies', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findOne({ 'comments._id': req.params.commentId });
//     if (!post) return res.status(404).json({ message: 'Comment not found' });
//     const comment = post.comments.id(req.params.commentId);
//     const reply = { postId: post._id, userId: req.user._id, content, upvotes: [], downvotes: [], replies: [], parentId: comment._id };
//     comment.replies.push(reply);
//     await post.save();
//     res.status(201).json({ message: 'Reply added', comment: comment.replies[comment.replies.length - 1] });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem');

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   // email:{type:String,required: true, unique: true},
//   email:{type:String,unqiue:true},
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'accepted', 'rejected'], 
//     default: 'pending' 
//   },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// // Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
  
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // APIs
// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username,email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email,password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Create Post
// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     const post = new Post({
//       title,
//       description,
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();
    
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
    
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get pending posts for admin review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Review post (accept/reject)
// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     post.status = status;
//     if (status === 'rejected') {
//       post.rejectionComment = rejectionComment;
//     }
//     await post.save();
    
//     const user = await User.findById(post.userId);
//     user.notifications.push({
//       postId: post._id,
//       message: `Your post "${post.title}" has been ${status}`,
//       comment: status === 'rejected' ? rejectionComment : '',
//       status
//     });
//     await user.save();
    
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get approved posts for frontend display (public endpoint)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'accepted' })
//       .populate('userId', 'username');
//     const postsWithComments = await Promise.all(posts.map(async (post) => {
//       const comments = await Comment.find({ postId: post._id })
//         .populate('userId', 'username')
//         .sort({ createdAt: -1 });
//       return { ...post.toObject(), comments };
//     }));
//     res.json(postsWithComments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get detailed post with comments
// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//       .populate('userId', 'username');
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json({ ...post.toObject(), comments });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Upvote/Downvote post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only vote on accepted posts' });
//     }
    
//     const userId = req.user._id;
    
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
    
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add comment to post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only comment on accepted posts' });
//     }
    
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content
//     });
//     await comment.save();
    
//     res.status(201).json({ message: 'Comment added', comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get comments for a post
// app.get('/api/posts/:postId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get user notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'accepted', 'rejected'], 
//     default: 'pending' 
//   },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// // Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
  
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // APIs
// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Create Post
// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     const post = new Post({
//       title,
//       description,
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();
    
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
    
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get pending posts for admin review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Review post (accept/reject)
// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     post.status = status;
//     if (status === 'rejected') {
//       post.rejectionComment = rejectionComment;
//     }
//     await post.save();
    
//     const user = await User.findById(post.userId);
//     user.notifications.push({
//       postId: post._id,
//       message: `Your post "${post.title}" has been ${status}`,
//       comment: status === 'rejected' ? rejectionComment : '',
//       status
//     });
//     await user.save();
    
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get approved posts for frontend display (public endpoint)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'accepted' })
//       .populate('userId', 'username');
//     const postsWithComments = await Promise.all(posts.map(async (post) => {
//       const comments = await Comment.find({ postId: post._id })
//         .populate('userId', 'username')
//         .sort({ createdAt: -1 });
//       return { ...post.toObject(), comments };
//     }));
//     res.json(postsWithComments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get detailed post with comments
// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//       .populate('userId', 'username');
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json({ ...post.toObject(), comments });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Upvote/Downvote post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only vote on accepted posts' });
//     }
    
//     const userId = req.user._id;
    
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
    
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add comment to post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only comment on accepted posts' });
//     }
    
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content
//     });
//     await comment.save();
    
//     res.status(201).json({ message: 'Comment added', comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get comments for a post
// app.get('/api/posts/:postId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get user notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'accepted', 'rejected'], 
//     default: 'pending' 
//   },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// // Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
  
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // APIs
// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Create Post
// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     const post = new Post({
//       title,
//       description,
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();
    
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
    
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get pending posts for admin review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Review post (accept/reject)
// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     post.status = status;
//     if (status === 'rejected') {
//       post.rejectionComment = rejectionComment;
//     }
//     await post.save();
    
//     const user = await User.findById(post.userId);
//     user.notifications.push({
//       postId: post._id,
//       message: `Your post "${post.title}" has been ${status}`,
//       comment: status === 'rejected' ? rejectionComment : '',
//       status
//     });
//     await user.save();
    
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get approved posts for frontend display (public endpoint)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'accepted' })
//       .populate('userId', 'username');
//     const postsWithComments = await Promise.all(posts.map(async (post) => {
//       const comments = await Comment.find({ postId: post._id })
//         .populate('userId', 'username')
//         .sort({ createdAt: -1 });
//       return { ...post.toObject(), comments };
//     }));
//     res.json(postsWithComments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get detailed post with comments
// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//       .populate('userId', 'username');
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json({ ...post.toObject(), comments });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Upvote/Downvote post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only vote on accepted posts' });
//     }
    
//     const userId = req.user._id;
    
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
    
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add comment to post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only comment on accepted posts' });
//     }
    
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content
//     });
//     await comment.save();
    
//     res.status(201).json({ message: 'Comment added', comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get comments for a post
// app.get('/api/posts/:postId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get user notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'accepted', 'rejected'], 
//     default: 'pending' 
//   },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// // Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
  
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // APIs
// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Create Post
// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     const post = new Post({
//       title,
//       description,
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();
    
//     // Notify admin
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
    
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get pending posts for admin review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Review post (accept/reject)
// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     post.status = status;
//     if (status === 'rejected') {
//       post.rejectionComment = rejectionComment;
//     }
//     await post.save();
    
//     // Notify user
//     const user = await User.findById(post.userId);
//     user.notifications.push({
//       postId: post._id,
//       message: `Your post "${post.title}" has been ${status}`,
//       comment: status === 'rejected' ? rejectionComment : '',
//       status
//     });
//     await user.save();
    
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get approved posts for frontend display (public endpoint)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'accepted' })
//       .populate('userId', 'username');
//     // Fetch comments separately for each post
//     const postsWithComments = await Promise.all(posts.map(async (post) => {
//       const comments = await Comment.find({ postId: post._id })
//         .populate('userId', 'username')
//         .sort({ createdAt: -1 });
//       return { ...post.toObject(), comments };
//     }));
//     res.json(postsWithComments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Upvote/Downvote post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only vote on accepted posts' });
//     }
    
//     const userId = req.user._id;
    
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
    
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add comment to post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only comment on accepted posts' });
//     }
    
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content
//     });
//     await comment.save();
    
//     res.status(201).json({ message: 'Comment added', comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get comments for a post
// app.get('/api/posts/:postId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get user notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));





// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/postReviewSystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   notifications: [{
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
//     message: String,
//     comment: String,
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
//     createdAt: { type: Date, default: Date.now }
//   }]
// });

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'accepted', 'rejected'], 
//     default: 'pending' 
//   },
//   rejectionComment: { type: String },
//   upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// const Post = mongoose.model('Post', postSchema);
// const Comment = mongoose.model('Comment', commentSchema);

// // Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return next();
  
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin middleware
// const adminMiddleware = (req, res, next) => {
//   if (req.user && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // APIs
// // User Registration
// app.post('/api/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !await bcrypt.compare(password, user.password)) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
//     res.json({ token, role: user.role, userId: user._id });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Create Post
// app.post('/api/posts', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { title, description } = req.body;
//     if (!title || !description) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
//     const post = new Post({
//       title,
//       description,
//       userId: req.user._id,
//       status: 'pending',
//       upvotes: [],
//       downvotes: []
//     });
//     await post.save();
    
//     const admins = await User.find({ role: 'admin' });
//     for (const admin of admins) {
//       admin.notifications.push({
//         postId: post._id,
//         message: `New post "${title}" submitted for review`,
//         status: 'pending'
//       });
//       await admin.save();
//     }
    
//     res.status(201).json({ message: 'Post submitted for review', post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get pending posts for admin review
// app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const posts = await Post.find({ status: 'pending' }).populate('userId', 'username email');
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Review post (accept/reject)
// app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(403).json({ message: 'Admin access required' });
//     const { status, rejectionComment } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     post.status = status;
//     if (status === 'rejected') {
//       post.rejectionComment = rejectionComment;
//     }
//     await post.save();
    
//     const user = await User.findById(post.userId);
//     user.notifications.push({
//       postId: post._id,
//       message: `Your post "${post.title}" has been ${status}`,
//       comment: status === 'rejected' ? rejectionComment : '',
//       status
//     });
//     await user.save();
    
//     res.json({ message: `Post ${status} successfully`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get approved posts for frontend display (public endpoint)
// app.get('/api/posts/approved', async (req, res) => {
//   try {
//     const posts = await Post.find({ status: 'accepted' })
//       .populate('userId', 'username email');
//     const postsWithComments = await Promise.all(posts.map(async (post) => {
//       const comments = await Comment.find({ postId: post._id })
//         .populate('userId', 'username')
//         .sort({ createdAt: -1 });
//       return { ...post.toObject(), comments };
//     }));
//     res.json(postsWithComments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get detailed post with comments
// app.get('/api/posts/:postId', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//       .populate('userId', 'username email');
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json({ ...post.toObject(), comments });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Upvote/Downvote post
// app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { voteType } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only vote on accepted posts' });
//     }
    
//     const userId = req.user._id;
    
//     if (voteType === 'upvote') {
//       if (post.upvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already upvoted' });
//       }
//       post.upvotes.push(userId);
//       post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
//     } else if (voteType === 'downvote') {
//       if (post.downvotes.includes(userId)) {
//         return res.status(400).json({ message: 'Already downvoted' });
//       }
//       post.downvotes.push(userId);
//       post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
//     } else {
//       return res.status(400).json({ message: 'Invalid vote type' });
//     }
    
//     await post.save();
//     res.json({ message: `${voteType} recorded`, post });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add comment to post
// app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const { content } = req.body;
//     const post = await Post.findById(req.params.postId);
    
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
    
//     if (post.status !== 'accepted') {
//       return res.status(400).json({ message: 'Can only comment on accepted posts' });
//     }
    
//     const comment = new Comment({
//       postId: post._id,
//       userId: req.user._id,
//       content
//     });
//     await comment.save();
    
//     res.status(201).json({ message: 'Comment added', comment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get comments for a post
// app.get('/api/posts/:postId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId })
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get user notifications
// app.get('/api/notifications', authMiddleware, async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: 'Authentication required' });
//     const user = await User.findById(req.user._id).populate('notifications.postId');
//     res.json(user.notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
