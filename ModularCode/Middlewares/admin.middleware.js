

//check is admin is logged in -> so they can access Admin Dashboard
const adminMiddleware=(req,res,next)=>{
    if(!req.user || req.user.role!='admin'){
        return res.status(403).json({message:'admin access required'})
    }
    next() 
}

module.exports=adminMiddleware