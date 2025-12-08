const User = require('../Models/User');

exports.getLeaderboard = async (req, res) => {
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
};