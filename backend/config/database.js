const mongoose=require("mongoose");


const connectDatabase=()=>{
    mongoose.connect(process.env.mogo_url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("connected db");
    }).catch((err)=>{
    console.log(err);
})
    
}

module.exports=connectDatabase