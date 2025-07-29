
const Post=require('../Models/Post.Model.js');
const User = require('../Models/User.model');


//create a new post -> question 
const createPost=async(req,res)=>{

    try{
         if(!req.user){
            return res.status(401).json({message:'authentication required to create new post'})
         }
         const {title,description,schemeName}=req.body ;

         if(!title || !title.trim() || !description || !description.trim()){
            return res.status(400).json({message:"title and description are required"})
         }

         const newPost=new Post({
            title:title.trim(),
            description:description.trim(),
            schemeName:schemeName.trim(),
            userId:req.user._id,
            status:'pending',
            upvotes:[],
            downvotes:[]
         })

         await newPost.save() 

         //give award to agent -> like 1 point for creating new post 
         await User.findByIdAndUpdate(req.user._id,{$inc:{points:1}})

         const admins=await User.find({role:'admin'})
         
    }catch(err){

    }
}



const getPosts=async(req,res)=>{
   try{
        const post=await Post.findById(req.params.postId).populate('userId','username')

        if(!post){
         return res.status(404).json({message:'post not found'})
        }

        const topLevelComments=await Comment.find({postId:post._id,parentCommentId:null})

   }catch(err){

   }
}