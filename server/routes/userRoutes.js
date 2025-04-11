// Import the required modules
const express = require("express");
const router = express.Router();

const {
  login,
  signup,

  fetchMyProfile,
} = require("../controllers/Auth");

const{
  contactUsController
} = require("../controllers/ContactUs")

const { auth, isCustomre } = require("../middlewares/auth");

router.post("/login", login);

router.post("/signup", signup);

router.get("/fetchMyProfile", auth, fetchMyProfile);


router.post("/contact", contactUsController)

module.exports = router;
