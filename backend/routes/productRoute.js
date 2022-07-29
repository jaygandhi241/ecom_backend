const express=require("express")
const router=express.Router();
const {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReviews,
    getProductReviews,

    }=require("../controller/product");
const { isAuthenticatedUser,isAuthorizeUser } = require("../middleware/auth");

router.route("/admin/products/new").post(isAuthenticatedUser,isAuthorizeUser("admin"),createProduct)
router.route("/admin/products").get(getProduct)
router.route("/admin/products/update/:id").put(isAuthenticatedUser,isAuthorizeUser("admin"),updateProduct)
router.route("/admin/products/delete/:id").delete(isAuthenticatedUser,isAuthorizeUser("admin"),deleteProduct)
router.route("/products/:id").get(getProductDetails)
router.route("/reviews").put(isAuthenticatedUser,createProductReviews)
router.route("/reviews/all/:id").get(isAuthenticatedUser,getProductReviews)
// router.route("/reviews/delete/:id").delete(isAuthenticatedUser,deleteReviews)

module.exports = router;