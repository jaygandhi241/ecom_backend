const Product=require("../models/productModels");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorhandler");

//create product

exports.createProduct=async(req,res,next)=>{
    req.body.user=req.user.id
    const product =await Product.create(req.body);
    res.status(201).send(product)
}

//getproducts

exports.getProduct=async (req,res)=>{
    const resultpage=2;
    const productcount=Product.countDocuments()
    const apiFeatures=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultpage)
    const products=await apiFeatures.query;
    res.send(products)

}

//updateproducts
exports.updateProduct=async (req,res,next)=>{
    const products=await Product.findById(req.params.id)
    if(!products){
        res.status(500).send("PRODUCT NOT FIND")
    }
    else{
        Product.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(products)
    }
}
//deleteproducts
exports.deleteProduct=async (req,res,next)=>{
    const products=await Product.findById(req.params.id)
    if(!products){
        res.status(500).send("PRODUCT NOT FIND")
    }
    else{
        await Product.remove()
        res.status(200).send("deleted")
    }
}
//get single products details
exports.getProductDetails=async(req,res,next)=>{
    const products=await Product.findById(req.params.id)
    if(!products){
        return next(new ErrorHandler("product not found",404))
    }
    else{
    res.status(200).send(products)
    }
}

 // comments and reviews product
 
exports.createProductReviews=async(req,res)=>{
    console.log("req.body");
    const {rating,comment,productId}=req.body
    console.log(Number(rating));
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }   
    const product=await Product.findById(productId);
    console.log(product)
    const isReviewed=product.reviews.find(rev=>rev.user.toString()==req.user._id.toString())
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()==req.user._id.toString()){
                (rev.rating=rating),
                (rev.comment=comment)
            }
        })
    }
    else{
        product.reviews.push(review)
        product.numoReviews=product.reviews.length
    }
    let avg=0
    await product.reviews.forEach((rev)=>{
        console.log(rev.rating);
        avg+=Number(rev.rating)
    })
    product.rating=avg/product.reviews.length

    await product.save()
    res.status(200).json({
        success:true,
        message:"review added"
     })
 }
  
 //to get all reviews 

exports.getProductReviews=async(req,res)=>{
    const {productId}=req.body
    const product=await Product.findById(productId)
    if(!product){
        res.status(404).json({
            success:false,
            message:"product not get"
        })
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
}

// delete product reviews

// exports.deleteReviews=async(req,res)=>{
//     const product=await Product.findById(req.query.id)
//     if(!product){
//         res.status(404).json({
//             success:false,
//             message:"product not get"
//         })
//     }
//     const reviews=product.review.filter(rev=>rev._id.toString())
//     await product.remove()
//     res.status(200).json({
//         success:true,
//         message:'deleted users '
//     })
// }



