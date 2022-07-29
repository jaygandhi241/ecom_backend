const express=require("express")
const router = express.Router();


const {
registerUser,
loginUser,
logoutUser,
forgetPass,
resetpassword,
getUserDetails,
updatePass, 
updateProfile,
getAllUser,
getSingleUser,
adminUpdateProfile,
adminDeleteProfile
}=require("../controller/user");

const {isAuthenticatedUser, isAuthorizeUser}=require("../middleware/auth");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forget").put(forgetPass)
router.route("/password/reset/:token").put(resetpassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/updatePass").put(isAuthenticatedUser,updatePass)
router.route("/updateprofile").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,isAuthorizeUser("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthenticatedUser,isAuthorizeUser("admin"),getSingleUser)
router.route("/admin/update").get(isAuthenticatedUser,isAuthorizeUser("admin"),adminUpdateProfile)
router.route("/admin/delete/:id").delete(isAuthenticatedUser,isAuthorizeUser("admin"),adminDeleteProfile)

 
module.exports = router;



