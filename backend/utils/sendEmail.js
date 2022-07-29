const nodemailer=require("nodemailer");
const sendMail=async(option)=>{
    console.log(option.email)
    const transporter=nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
        service:"webmail",
        auth:{
            user:process.env.User_mail,
            pass:process.env.User_pass
        }
    })
    const mailOption={
        from:process.env.User_mail,
        to:option.email,
        subject:option.subject,
        text:option.message
    }
   await  transporter.sendMail(mailOption)
}

module.exports=sendMail