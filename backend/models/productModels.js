const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"]
    },
    
    description:{
        type:String,
        required:[true,"please enter the description"]
    },
    price:{
        type:Number,
        required:[true,"please enter the product price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    }
     
],
category:{
    type:String,
    required:[true,"please enter the category"],
    
},
stock:{
    type:Number,
    required:[true,"please enter the product stock"],
    maxLength:[4,"stock annot excess 4 charcaters"],
    default:1
},
numoReviews:{
    type:Number,
    default:0
},
reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            requried:true,
            ref:"User"
        },
        name:{
            type:String,
            // required:true
        },
        rating:{
            type:Number,
            // required:true
        },
        comment:{
            type:String,
            // required:true
        }
    }
],
user:{
    type:mongoose.Schema.ObjectId,
    requried:true,
    ref:"User"
}
,
createdAt:{
    type:Date,
    default:Date.now
}
})
module.exports= mongoose.model("Product",productSchema)