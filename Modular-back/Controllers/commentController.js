const Comment = require('../Models/Comments');
const Post = require('../Models/Post');
const User = require('../Models/User');
const Activity = require('../Models/Activity');

exports.addComment = async (req, res) => {
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
};

exports.voteComment = async (req, res) => {
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
};

exports.addReply = async (req, res) => {
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
};