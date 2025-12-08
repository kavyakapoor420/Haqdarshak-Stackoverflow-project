const Post = require('../Models/Post');
const User = require('../Models/User');
const Activity = require('../Models/Activity');
const Badge = require('../Models/Badge');
const Comment = require('../Models/Comments');

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

exports.createPost = async (req, res) => {
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
    console.error('Error in createPost:', error);
    res.status(500).json({ message: 'Server error creating post', error: error.message });
  }
};

exports.getAdminPosts = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const query = status === 'all' ? {} : { status };
    const posts = await Post.find(query).populate('userId', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin posts', error: error.message });
  }
};

exports.updatePostStatus = async (req, res) => {
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
            name: 'Newbie Contributor',
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
};

exports.getApprovedPosts = async (req, res) => {
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
};

exports.getPostById = async (req, res) => {
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
};

exports.votePost = async (req, res) => {
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
};