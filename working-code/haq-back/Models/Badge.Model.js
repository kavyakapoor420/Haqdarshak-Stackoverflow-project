const mongoose=require('mongoose')

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  imageUrl: { type: String },
  earnedAt: { type: Date, default: Date.now }
});

const Badge=mongoose.model('Badge',userSchema)
module.exports=Badge 