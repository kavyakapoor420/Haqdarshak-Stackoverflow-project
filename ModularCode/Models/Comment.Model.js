
const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    upvotes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',  
        }
    ],
    downvotes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    parentCommentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }
})

const Comment=mongoose.model("Comment",commentSchema)


module.exports=Comment