

export const createPost=async(req,res)=>{
    try{
         const {title,description}=req.body ;
         const userId=req.agent.id   // User ID from authenticated token via authMiddleware

         //crea new post 
         const newPost=new Post({
            userId,title,description
         })
         //save post to database 
         const post=await newPost.save() 
         return res.status(201).json({message:'post submitted successfully'})
    
    }catch(err){
         return res.status(500).json({message:"Post submitted successfully "})
    }
}

