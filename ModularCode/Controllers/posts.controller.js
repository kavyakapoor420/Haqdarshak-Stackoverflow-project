
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
              .populate('userId','username')
              .sort({createdAt:-1})
       const commentsWithReplies=await getCommentsWithReplies(topLevelComments)

       res.json({...post.toObject(),comments:commentsWithReplies})

   }catch(err){
       res.status(500).json({message:'server error fetching with post details '})
   }
}


const getApprovedPosts=async(req,res)=>{
   try{
        let query=Post.find({status:'accepted'}).populate("userId","username")

        if(req.query.sort==='createdAt' && req.query.order==='desc'){
          query=query.sort({createdAt:-1})
        }
        else if(req.query.sort==='upvotes.length' && req.query.order==='desc'){
           const posts=await query.lean() 
           posts.sort((a,b)=>b.upvotes.length-a.upvotes.length)

           return res.json(posts)
        }

        if(req.query.unanswered){
           const posts=await query.lean() 
           const unansweredPosts=[]

           for(const post of posts){
            const topLevelCommentsCount=await Comment.countDocuments({ postId:post._id,parentCommentId:null})

            if(topLevelCommentsCount===0){
               unansweredPosts.push(post)
            }

            return res.json(unansweredPosts)
           }
        }
        const posts=await query ;
        res.json(posts)

   }catch(err){
        res.status(500).json({message:'server error fetching approved post'})
   }
}