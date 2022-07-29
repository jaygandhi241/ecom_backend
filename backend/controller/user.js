const express = require("express");
const User=require("../models/userModel");
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto")

//registered user 

exports.registerUser= async (req,res,next)=>{
    const {name,email,password,role}=req.body;
    const user=User.create({
        name,email,password,
        avtar:{
            public_id:"hello234",
            url:"product1.png"
    },role,
    })
    const token=await User.getjwttoken(user)
    res.status(200).send(`succesfully registerd ${token}`)
}

// login user

exports.loginUser=async(req,res)=>{

    const {email,password}=req.body
    if(!email && !password){
        res.status(500).send("hey !enter the email and password")
    }
    const user=await User.findOne({email}).select("+password")
    console.log(`user is ${user}`)
    
    if(!user){
        return res.status(500).send("please enter proper password and email!")
    }
    console.log(password);
    const passwordMatched=await User.comparePassword(password,user)
    console.log(`password is ${passwordMatched}`);
    if(!passwordMatched){
        res.status(500).send('plaese enterd the proper password and email !')
    }
    const token=await User.getjwttoken(user)
    res.status(200).cookie("token",token).json({
        sucess:true,
        token,
        user
    })
}

//logout user 
exports.logoutUser=async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        sucess:true,
        message:"loggedout"
    })
}

//forget password
exports.forgetPass=async(req,res)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        res.status(400).json({
            sucess:false,
            message:"email is wrong eneterd"
        })
    }
    const resetToken=await User.getReset()
    console.log(resetToken)
    await User.findByIdAndUpdate(user._id,{resetpasswordtoken:resetToken})

    const resetPasswordUrl=`http://localhost:8000/api/users/password/reset/${resetToken}`
    
    const message=`your password token is :\n\n ${resetPasswordUrl}`
    try {
        await sendEmail({
            email:user.email,
            subject:`reset password`,
            message
        })
        res.status(200).send("email sent successfully")
        
    } catch (error) {
        console.log(error);
        return res.status(500).send("error")
    }
}

//reset password

exports.resetpassword=async(req,res)=>{
    const resetpasswordtoken=crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex") 
    const user=await User.findOne({
        resetpasswordtoken,resetPasswordExpire:{$gt:Date.now()},
    })
    if(!user){
        res.status(400).send("resetpassword topken is invalid and has been expired")
    }
    if(req.body.password!==req.body.confirmpassword){
        res.status(400).send("password and confirm password is wrong ")
    }
    user.password=req.body.confirmpassword
    resetpasswordtoken=undefined
    resetPasswordExpire=undefined
    await user.save()
    res.status(200).send("user is updated ")
}

//get users details 

exports.getUserDetails=async(req,res)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
}

//update password

exports.updatePass=async(req,res)=>{
    const user=await User.findById(req.user.id).select("+password")
    const isPassMatch=await User.comparePassword(req.body.oldpassword,user);
    if(!isPassMatch){
        res.status(400).send("oldpassword dosent matched")
    }
    if(req.body.newpassword!==req.body.confirmpassword){
        res.status(400).send("passwords dosent match ")
    }
    user.password=req.body.newpassword;
    await user.save()
    res.status(200).send('password is updated ')
}

//update user profile

exports.updateProfile=async(req,res)=>{
   const newUserData={
    name:req.body.name,
    email:req.body.email
   }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData)
    res.status(200).json({
        success:true,
        message:"update profile"
    })
}

//get all users admin panel 

exports.getAllUser=async(req,res)=>{
    const users=await User.find()
    res.status(200).json({
        success:true,
        users
    })

}

//get single users admin panel 

exports.getSingleUser=async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        res.status(400).json({
            success:false,
            message:"user dosent exist "
        })
    }
    res.status(200).json({
        success:true,
        user
    })

}

//admin update user profile

exports.adminUpdateProfile=async(req,res)=>{
    const newUserData={
     name:req.body.name,
     email:req.body.email,
     role:req.body.role
    }
     const user=await User.findByIdAndUpdate(req.user.id,newUserData)
     res.status(200).json({
         success:true,
         message:"update profile"
     })
 }

//admin delete user

exports.adminDeleteProfile=async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        res.status(400).send("user dosent exist")
    }
    await user.remove()
    res.status(200).json({
         success:true,                        
         message:"deleted user"
     })
 }



 

