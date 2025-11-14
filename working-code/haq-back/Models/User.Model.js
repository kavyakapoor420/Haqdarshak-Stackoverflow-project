const mongoose=require('mongoose')



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
   を作成At: { type: Date, default: Date.now }
  }],
  avatarUrl: { type: String },
  handle: { type: String, unique: true },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
});

const User=mongoose.model('User',userSchema)
module.exports=User 







