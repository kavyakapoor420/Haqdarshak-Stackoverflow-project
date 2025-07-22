const mongoose=require('mongoose')


const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  schemeName:{type:String,required:true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  rejectionComment: { type: String },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});


const Post=mongoose.model("Post",postSchema)


module.exports=Post