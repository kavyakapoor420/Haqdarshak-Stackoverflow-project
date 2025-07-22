const User = require("../Models/User.model");

const jwt_secret='abcd'


//check is user is authenticated or not -> logged in then only able to access more features 
const authMiddleware=async(req,res)=>{
    const token=req.header("Authorization")?.replace('Bearer','')
    if(!token){
        req.user=null ;
        return next() 
    }

    try{
        const decoded=jwt.verify(token,jwt_secret)
        req.user=await User.findById(decoded.userId)
        next() 
    }catch(err){
        res.status(401).json({message:"invalid or expired token"})
    }
}

module.exports=authMiddleware