const Order=require("../models/orderModel")
const Product=require("../models/productModels")
const User=require("../models/userModel")


exports.newOrder=async(req,res)=>{
    
    const  {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    }=req.body
    const order=await Order.create({ 
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success:true,
        message:"order created",
        order
    })
}

//get single user order

exports.getOrder=async(req,res)=>{

    const order=await Order.findById(req.body.orderid).populate("user","name email")
    if(!order){
        res.status(404).json({
            message:"order not get"
        })
    }
    res.status(200).json({
        success:true,
        order
    })
}

//get logged in user orders

exports.myOrder=async(req,res)=>{

    const order=await Order.find({user:req.user._id})
    if(!order){
        res.status(404).json({
            message:"order not get"
        })
    }
    res.status(200).json({
        success:true,

        order
    })
}

//get all order for admin

exports.allOrder=async(req,res)=>{

    const order=await Order.find()
    if(!order){
        res.status(404).json({
            message:"order not get"
        })
    }
    
    let totalamount=0
    order.forEach((order) => {
        totalamount+=order.totalPrice
    });
   
    res.status(200).json({
        success:true,
        totalamount,
        order
    })
}

//get update order  status for admin

exports.updateOrder=async(req,res)=>{

    const order=await Order.findById(req.params.id)
    if(!order){
        res.send("order not fountd in this id")
    }
    if(order.orderStatus==="delivered"){
        res.status(404).json({
            message:"we have already delivered this order"
        })
    }
    order.orderItems.forEach(async(orders)=>{
        await updateStock(orders.product,orders.quantity)
    })
    order.orderStatus=req.body.status

    if(req.body.status==="delivered"){
        order.deliverAt=Date.now()
    }
    await order.save()
    res.status(200).json({
       success:true,
       order
    })
};
async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.stock-=quantity
    await product.save()
}
//delete order 
exports.deleteOrder=async(req,res)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        res.send("order not fountd in this id")
    }
    await order.remove()
    res.status(200).json({
       success:true
    })
};



