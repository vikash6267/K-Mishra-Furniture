const Coupon = require("../models/Coupon");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  let { name, expiry, discount } = req.body;

  // Convert name to uppercase
  name = name.toUpperCase();

  try {
    const newCoupon = new Coupon({ name, expiry, discount });
    await newCoupon.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Coupon created successfully",
        data: newCoupon,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a coupon by name
exports.getCouponByName = async (req, res) => {
  const { name } = req.body;

  try {
    const coupon = await Coupon.findOne({ name: name.toUpperCase() });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a coupon by name
exports.deleteCouponByName = async (req, res) => {
  const { name } = req.params;

  try {
    const coupon = await Coupon.findOneAndDelete({ name: name.toUpperCase() });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
