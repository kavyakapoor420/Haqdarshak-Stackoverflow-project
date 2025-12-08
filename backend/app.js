const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv=require('dotenv')

dotenv.config()

const schemeNameData = require('./SchemeNameData/schemNameData.json');

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI2 = process.env.MONGO_URI2;
mongoose.connect(MONGO_URI2)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  notifications: [{
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: String,
    comment: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
   を作成At: { type: Date, default: Date.now }
  }],
  avatarUrl: { type: String },
  handle: { type: String, unique: true },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
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

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  imageUrl: { type: String },
  earnedAt: { type: Date, default: Date.now }
});

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
});

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
const Badge = mongoose.model('Badge', badgeSchema);
const Activity = mongoose.model('Activity', activitySchema);
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
    const { username, email, password, role, handle, avatarUrl } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { handle }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with that email, username, or handle already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, handle, avatarUrl });
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
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
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

    // Record activity
    const today = new Date().toISOString().slice(0, 10);
    await Activity.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );

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
        // Award badge for first accepted post
        const acceptedCount = await Post.countDocuments({ userId: post.userId, status: 'accepted' });
        if (acceptedCount === 1) {
          const badge = new Badge({
            userId: post.userId,
            name: 'Newbie Contributor ',
            imageUrl: '/badges/first-accepted.png',
            earnedAt: new Date()
          });
          await badge.save();
          await User.findByIdAndUpdate(post.userId, { $push: { badges: badge._id } });
        }
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
    res.status(500).json({ message: 'Server error fetching approved posts',error: error.message });
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
      if (!post.upvotes.includes(userId)) {
        post.upvotes.push(userId);
        await User.findByIdAndUpdate(post.userId, { $inc: { points: 1 } });
      } else {
        return res.status(400).json({ message: 'Already upvoted' });
      }
    } else if (voteType === 'downvote') {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
      if (!post.downvotes.includes(userId)) {
        post.downvotes.push(userId);
        await User.findByIdAndUpdate(post.userId, { $inc: { points: -1 } });
      } else {
        return res.status(400).json({ message: 'Already downvoted' });
      }
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
    // Record activity
    const today = new Date().toISOString().slice(0, 10);
    await Activity.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    // Award 1 point for commenting
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 1 } });
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
      if (!comment.upvotes.includes(userId)) {
        comment.upvotes.push(userId);
        await User.findByIdAndUpdate(comment.userId, { $inc: { points: 1 } });
      } else {
        return res.status(400).json({ message: 'Already upvoted' });
      }
    } else if (voteType === 'downvote') {
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
      if (!comment.downvotes.includes(userId)) {
        comment.downvotes.push(userId);
        await User.findByIdAndUpdate(comment.userId, { $inc: { points: -1 } });
      } else {
        return res.status(400).json({ message: 'Already downvoted' });
      }
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
    // Record activity
    const today = new Date().toISOString().slice(0, 10);
    await Activity.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    // Award 1 point for replying
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 1 } });
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
    const totalReplies = await Comment.countDocuments({ userId, parentCommentId: { $ne: null } });
    const reputation = points + totalUpvotes[0]?.totalUpvotes || 0;

    res.json({
      totalPosts,
      acceptedPosts,
      rejectedPosts,
      pendingPosts,
      totalUpvotes: totalUpvotes[0]?.totalUpvotes || 0,
      totalComments,
      points,
      discussions: totalComments + totalReplies,
      reputation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user stats', error: error.message });
  }
});

app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
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
          avatarUrl: 1,
          handle: 1,
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
      { $sort: { points: -1 } },
      {
        $group: {
          _id: null,
          data: { $push: '$$ROOT' }
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
      { $unwind: '$data' },
      { $replaceRoot: { newRoot: '$data' } }
    ]);

    const user = leaderboard.find(u => u._id.toString() === req.user._id.toString());
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      username: user.username,
      handle: user.handle,
      avatarUrl: user.avatarUrl,
      rank: user.rank
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
  }
});

app.get('/api/user/badges', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const badges = await Badge.find({ userId: req.user._id }).select('name imageUrl earnedAt');
    res.json(badges.map(b => ({
      id: b._id,
      name: b.name,
      imageUrl: b.imageUrl,
      earnedAt: b.earnedAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching badges', error: error.message });
  }
});

app.get('/api/user/activity', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);
    const activity = await Activity.find({
      userId: req.user._id,
      date: { $gte: start.toISOString().slice(0, 10), $lte: end.toISOString().slice(0, 10) }
    }).select('date count');
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching activity', error: error.message });
  }
});

app.get('/api/user/posts', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);
    const posts = await Post.find({
      userId: req.user._id,
      createdAt: { $gte: start, $lte: end }
    }).select('title status createdAt');
    res.json(posts.map(p => ({
      id: p._id,
      title: p.title,
      status: p.status,
      createdAt: p.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching posts', error: error.message });
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
