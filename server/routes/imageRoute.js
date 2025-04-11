const express = require("express")
const router = express.Router()

const{
    auth,
    isAdmin,
    isCustomre
}= require("../middlewares/auth")

const {uploadPhoto} = require("../middlewares/uploadImage")

const {
    imageUpload,
    uploadImages
}=require("../controllers/imageCtrl")

router.post("/upload",imageUpload)
router.post("/multi",uploadImages)
// export all router
module.exports = router


