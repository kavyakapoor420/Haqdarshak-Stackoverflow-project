const mongoose=require('mongoose')


const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
  title: { type: String, required: true },
  messages: [{
    role: { 
        type: String, enum: ['user', 'model'], 
        required: true
  },
    content: { 
        type: String, required: true 
    },
    mergedAudioData: {
         type: String, default: null 
    },
    createdAt: { 
        type: Date, default: Date.now 
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports=Chat