const express=require("express")
const router=express.Router()
const { 
    newOrder,
    getOrder,
    myOrder,
    allOrder,
    updateOrder,
    deleteOrder
    } = require("../controller/order")
const { isAuthenticatedUser,isAuthorizeUser }=require("../middleware/auth")

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/getsingleorder").get(isAuthenticatedUser,isAuthorizeUser("admin"),getOrder)
router.route("/order/myorder").get(isAuthenticatedUser,myOrder)
router.route("/order/allorder").get(isAuthenticatedUser,isAuthorizeUser("admin"),allOrder)
router.route("/order/updateorder/:id").put(isAuthenticatedUser,isAuthorizeUser("admin"),updateOrder)
router.route("/order/deleteorder/:id").delete(isAuthenticatedUser,isAuthorizeUser("admin"),deleteOrder)
module.exports=router