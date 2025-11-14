
const mongoose=require('mongoose')

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
});

const Activity=mongoose.model('Activity',userSchema)
module.exports=Activity 