import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Agent', //reference with Agent model 
        required:true 
    },
    title:{
        type:String,
        required:true,
        trim:true // remove whitespace from both ends of string
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:"pending"
    },
    adminComment:{
        type:String,
        trim:true,
        required:function(){return this.status==='rejected'}  // required only if post is rejected -> reason
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now 
    }
})

const Post=mongoose.model("Post",postSchema)

export default Post 


