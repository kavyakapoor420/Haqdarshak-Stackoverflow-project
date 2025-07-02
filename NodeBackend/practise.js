import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsownwebtoken'
import bcrypt from 'bcryptjs'


const app=express() 
app.use(cors())
app.use(express.json())

//schema
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    notifications:[{
        postId:{
            type:mongoose.Schema.Types.ObjectId,
            message:String,
            comment:String,
            status:{
                type:String,
                enum:['pending','accepted','rejected'],
                createdAt:{
                    type:Date,
                    default:Date.now
                }
            }
        }
    }]
})

const commentSchema=new mongoose.Schema({
   postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
    required:true
   },
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   content:{
    type:String,
    required:true,
   },
   createdAt:{
    type:Date,default:Date.now
   }
})


const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','accpeted','rejected'],
        default:'pending'
    },
    rejectedComment:{
        type:String
    },
    upvotes:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ],
    downvotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const User=mongoose.model("user",userSchema)
const post=mongoose.model('post',postSchema)
const comment=mongoose.model("comment",commentSchema)


//middleware for authentication
const authMiddleware=async(req,res)=>{
    const token=req.header("Authorization")?.repplace("Bearer","")
    if(!token){
        return next() 
    }

    try{
        const decoded=jwt.verify(token,'secret')
        req.user=await User.findById(decoded.id)
        next()
    }catch(err){
         res.status(401).json({message:'invalid token'})
    }
}

//admin middleware
const adminMiddleware=async(req,res,next)=>{
    if(req.user && req.user.role!='admin'){
        return res.status(403).json({message:"admin access required"})
    }
    next()
}

app.post("/api/register",async(req,res)=>{
    try{
        const {username,password,role}=req.body 
        const hashedPassword=await bcrypt.hash(password,10)
        const user=new User({username,password:hashedPassword,role})
        await user.save() 
        res.status(201).json({message:"user registered successfully"})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//user login 
app.post("/api/login",async(req,res)=>{
    try{
         const {username,password}=req.body 
         const user=await User.findOne({username})
         const isMatchPass=await  bcrypt.compare(password,user.password)

         if(!user  || !isMatchPass){
            return res.status(401).json({message:"invalid credentials"})
         }
         const token=jwt.sign({userId:user._id,role:user.role},'secret')
         res.json({token,role:user.role})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

app.post('/api/posts',authMiddleware,async(req,res)=>{
    try{
       if(!req.user){
        return res.status(401).json({message:"authentciated required"})
       }
       const {title,description}=req.body 
       const post=new Post({
        title,description,userId:req.user._id ,
        status:'pending',
        upvotes:[],
        downvotes:[]
       })
       await post.save() 

       const admins=await User.find({role:'admin'})
       for(const admin of admins){
        admin.notifications.push({
            postId:post._id,
            message:`new post ${title} submitted for review `,
            status:'pending'
        })
       }
       await admins.save() 

    }catch(err){
        res.status(400).json({message:err.message})
    }
})


app.get("/api/admin/posts",authMiddleware,adminMiddleware,async(req,res)=>{
    try{
        if(!req.user) return res.status(401).json({message:"admin access required"})
            
    }catch(err){
        res.status()
    }
})