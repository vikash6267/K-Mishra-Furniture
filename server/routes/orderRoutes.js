const express = require("express")
const router = express.Router()

const{
    auth,
    isAdmin,
    isCustomre
}= require("../middlewares/auth")



const {
    capturePayment,
    paymentVerification,
    getAllOrder
} = require("../controllers/OrderCtrl")


// router.post("/capturePayment", auth, isCustomre, capturePayment)
// router.post("/verifyPayment", auth, isCustomre, paymentVerification)
// router.get("/get", auth, isCustomre, getAllOrder)

router.post("/capturePayment",auth, capturePayment)
router.post("/verifyPayment",auth, paymentVerification)
router.get("/get", auth, getAllOrder)

module.exports = router
