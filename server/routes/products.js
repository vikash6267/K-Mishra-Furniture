const express = require("express");
const router = express.Router();

const { auth, isAdmin, isCustomre } = require("../middlewares/auth");

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  editCategory,
} = require("../controllers/Category");

const {
  createProduct,
  getAllProduct,
  getProductDetails,
  deleteProduct,
  updateProduct
} = require("../controllers/productCtrl");


const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/adminCtrl")

router.post("/createCategory",auth,isAdmin, createCategory);
router.post("/editCategory", auth, isAdmin, editCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

router.post("/create",auth,isAdmin, createProduct);
router.post("/delete",auth,isAdmin, deleteProduct);
router.post("/getProductDetails", getProductDetails);
router.get("/all-product", getAllProduct);
router.put("/update/:productID", updateProduct);


//admin
router.get("/adminGetOrder",auth,isAdmin, getAllOrders);
router.post("/updateOrder",auth,isAdmin, updateOrderStatus);

// export all router
module.exports = router;
