

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


module.exports=getCommentsWithReplies