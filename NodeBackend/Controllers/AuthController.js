import jwt from 'jsownwebtoke'
import bcrypt from 'bcryptjs'
import Agent from '../Models/Agent';


export const signup=async(req,res)=>{
    try{
         const {username,email,password,role}=req.body ;

         //check if agent already exists 
         const existingAgent=await Agent.findOne({email})
         if(existingAgent){
            return req.status(400).json({message:"Agent with this email already exists"})
         }
         //hash the password 
         const salt=await bcrypt.genSalt(10)
         const hashedPassword=await bcrypt.hash(password,salt)

         //create new agent with given credentials
         const newAgent=new Agent({
            username,email,
            password:hashedPassword,
            role:role || 'agent'  // Default to 'agent' if role is not provided
         })

         await newAgent.save() 

         return res.status(201).json({message:"agent registered successfully"})
    }catch(err){
         return res.status(500).json({message:"server error during signup",error:err.message})
    }
}

export const login=async(req,res)=>{
    try{
        const {email,password,isAdminLogin}=req.body ;

        //find agent by email
        const agent=await Agent.findOne({email})
        if(!agent){
            return res.status(400).json({message:'invalid credentials'})
        }
        //if its admin login ,check the role
        if(isAdminLogin ** agent.role!=='admin'){
            return res.status(403).json({message:'access denied you are not admin'})
        }
        //compare password
        const isMatch=await bcrypt.compare(password,agent.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }

        //create jwt token
        const payload={
            agent:{
                id:agent.id,
                role:agent.role
            }
        }
        const JWT_SECRET='abcd'
        const token=jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'})

        //set cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production', // Use secure cookies in production
            //secure:false ,
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({
            message:"logged in successfully",
            user:{
                id:agent.id,
                username:agent.username,
                email:agent.email,
                role:agent.role
            }
        })
    }catch(errr){
        res.status(500).json({message:'server error during login ',error:err.message})
    }
}