const jwt=require("jsonwebtoken")
const user=require("../models/userModel")
exports.isAuthenticatedUser=async(req,res,next)=>{
    const {token} =req.cookies;
    // console.log(token)
    if(!token){
        res.status(404).send("please login the account")
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decodedData);
    req.user=await user.findById(decodedData.id);
    next();
}   

exports.isAuthorizeUser=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(400).send(`${req.user.name} is  not an admin only admin can access this page`)
        }
        next();
}
    
}


