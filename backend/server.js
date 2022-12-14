const express=require("express")
const bodyparser = require("body-parser")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
const connectDatabase=require("./config/database")
const product=require('./routes/productRoute')
const user=require("./routes/userRoutes")
const order=require("./routes/orderRoutes")
const app=express()
dotenv.config({path:"backend/config/config.env"})
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
connectDatabase()
app.use("/api",product)
app.use("/api/users",user)
app.use("/api/",order)
app.listen(process.env.PORT,()=>{
    console.log(`CONNECTED port ${process.env.PORT}`);
})