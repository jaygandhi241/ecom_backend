const mongoose =require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
const crypto=require("crypto")
require("dotenv")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter the name"],
        maxlength:[30,"name is excedde 30 characters"],
        minlength:[4,"name is less than 4 chara characters"]
    },
    email:{
        type:String,
        required:[true,"please enter the mailid "],
        validate: [validator.isEmail,"enter the proper emailn "] ,
        unique:true
    },
    password:{
        type:String,
        required:[true,"enter the password"],
        minlength:[6,"password should be greater than 5 character"],
        select:false
    },
    avtar:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetpasswordtoken:String,
    resetpasswordexpires:Date
})

//hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

//JWT TOKEN
userSchema.statics.getjwttoken= async function(user){
   return await jwt.sign({id:user._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE  
   })
}

// compare password

userSchema.statics.comparePassword=async function(enterdPassword,user){
    return await bcrypt.compare(enterdPassword,user.password)
}

//reset token 

userSchema.statics.getReset=async function(){
    const resetToken=crypto.randomBytes(20).toString("hex")
    this.resetpasswordtoken=crypto.createHash("sha256").update(resetToken).digest("hex")
    return resetToken;
}

module.exports=mongoose.model("user",userSchema)