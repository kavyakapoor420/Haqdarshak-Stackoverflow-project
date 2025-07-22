const User = require("../Models/User.model");
const bcrypt=require('bcryptjs')

const register=async(req,res)=>{
    try{
        const {username,email,password,role}=req.body ;

        //check is user already exist in my DB -> from email or username 
        const existingUser=await User.findOne({$or:[{email},{username}]})

        if(existingUser){
            return res.status(409).json({message:'user with that email or username already exists'})
        }
        //hash pass -> bfeore storing it in DB 
        const hashedPass=await bcrypt.hash(password,10) ;
        
        const newUser=new User({username,email,password:hashedPass,role})
        await newUser.save() 

        res.status(201).json({message:"user registered successfully"})

    }catch(err){
        res.status(500).json({message:'server error during registeration',error:err.message})
    }
}

const login=async(req,res)=>{

    try{
         const {email,password}=req.body ;
         const user=await User.findOne({email})

         const matchPass=await bcrypt.compare(password,user.password)

         if(!user || matchPass){
            return res.status(401).json({message:"invalid credentials"})
         }

         const token=jwt.sign(   
                {userId:user._id,role:user.role},
                jwt_secret,
                {expiresIn:'1h'}
         )

         res.json({token,role:user.role,message:'login successfull'})

    }catch(err){
        res.status(500).json({message:'server error during login',erro:err.message})
    }
}


module.exports={
    register,login
}
