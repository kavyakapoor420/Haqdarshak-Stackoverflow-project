const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/postReviewSystem');

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // email:{type:String,required: true, unique: true},
  email:{type:String,unqiue:true},
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
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
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  rejectionComment: { type: String },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next();
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// APIs
// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username,email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email,password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create Post
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { title, description } = req.body;
    const post = new Post({
      title,
      description,
      userId: req.user._id,
      status: 'pending',
      upvotes: [],
      downvotes: []
    });
    await post.save();
    
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
    res.status(400).json({ message: error.message });
  }
});

// Get pending posts for admin review
app.get('/api/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: 'Admin access required' });
    const posts = await Post.find({ status: 'pending' }).populate('userId', 'username');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Review post (accept/reject)
app.put('/api/admin/posts/:postId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: 'Admin access required' });
    const { status, rejectionComment } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.status = status;
    if (status === 'rejected') {
      post.rejectionComment = rejectionComment;
    }
    await post.save();
    
    const user = await User.findById(post.userId);
    user.notifications.push({
      postId: post._id,
      message: `Your post "${post.title}" has been ${status}`,
      comment: status === 'rejected' ? rejectionComment : '',
      status
    });
    await user.save();
    
    res.json({ message: `Post ${status} successfully`, post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get approved posts for frontend display (public endpoint)
app.get('/api/posts/approved', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'accepted' })
      .populate('userId', 'username');
    const postsWithComments = await Promise.all(posts.map(async (post) => {
      const comments = await Comment.find({ postId: post._id })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
      return { ...post.toObject(), comments };
    }));
    res.json(postsWithComments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get detailed post with comments
app.get('/api/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('userId', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json({ ...post.toObject(), comments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upvote/Downvote post
app.post('/api/posts/:postId/vote', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { voteType } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only vote on accepted posts' });
    }
    
    const userId = req.user._id;
    
    if (voteType === 'upvote') {
      if (post.upvotes.includes(userId)) {
        return res.status(400).json({ message: 'Already upvoted' });
      }
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
    } else if (voteType === 'downvote') {
      if (post.downvotes.includes(userId)) {
        return res.status(400).json({ message: 'Already downvoted' });
      }
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    
    await post.save();
    res.json({ message: `${voteType} recorded`, post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment to post
app.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only comment on accepted posts' });
    }
    
    const comment = new Comment({
      postId: post._id,
      userId: req.user._id,
      content
    });
    await comment.save();
    
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const user = await User.findById(req.user._id).populate('notifications.postId');
    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));





