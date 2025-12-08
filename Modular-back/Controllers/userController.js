const User = require('../Models/User');
const Post = require('../Models/Post');
const Comment = require('../Models/Comments');
const Badge = require('../Models/Badge');
const Activity = require('../Models/Activity');
const mongoose = require('mongoose');

exports.getNotifications = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required to view notifications' });
    const user = await User.findById(req.user._id).populate('notifications.postId', 'title');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications', error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
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
};

exports.getUserProfile = async (req, res) => {
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
};

exports.getUserBadges = async (req, res) => {
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
};

exports.getUserActivity = async (req, res) => {
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
};

exports.getUserPosts = async (req, res) => {
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
};