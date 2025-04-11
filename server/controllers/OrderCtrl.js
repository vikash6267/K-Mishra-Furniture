const paypal = require('@paypal/checkout-server-sdk');
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
// PayPal client
const Environment =  paypal.core.SandboxEnvironment;

// process.env.NODE_ENV === 'production'
//   ? paypal.core.LiveEnvironment
//   :
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);


// CREATE ORDER
const capturePayment  = async (req, res) => {
  const { products } = req.body;

  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.product._id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    totalAmount += product.price * item.quantity;
  }
console.log(totalAmount)
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "GBP",
        value: totalAmount.toFixed(2),
      },
    }],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log(order)
    res.status(200).json({ success: true, id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create PayPal order" });
  }
};

// CAPTURE ORDER
const paymentVerification = async (req, res) => {
  const { details, cart, addressData, payable, user } = req.body;

  try {
    const paypalOrderId = details.id;
    const paypalPayerId = details.payer?.payer_id || "N/A";
    const paypalPayerEmail = details.payer?.email_address || "N/A";
    const products = cart;
    const userId = user._id;

    await createOrder(
      products,
      userId,
      addressData,
      paypalOrderId,
      paypalPayerId,
      payable,
      paypalPayerEmail,
      res
    );

    return res.status(200).json({ success: true, message: "Payment Captured & Order Placed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Payment capture failed" });
  }
};







const createOrder = asyncHandler(async (
  products,
  userId,
  address,
  paypal_order_id,
  paypal_payer_id,
  payable,
  payerEmail,
  res
) => {
  const userDetails = await User.findById(userId);
console.log(userDetails)
  const {
    billingCity,
    billingPincode,
    billingState,
    billingCountry,
    billingAddress,
    billingPhone
  } = address;

  try {
    const orderId = uuidv4();

    const order = await Order.create({
      order_id: orderId,
      shipment_id: 123, // Optional or can be generated
      user: userId,
      shippingInfo: {
        name: userDetails.name || "N/A",
        address: billingAddress,
        city: billingCity,
        state: billingState,
        pincode: billingPincode,
        phone: billingPhone,
        country: billingCountry,
      },
      paymentInfo: {
        paypalOrderId: paypal_order_id,
        paypalPayerId: paypal_payer_id,
        payerEmail: payerEmail
      },
      orderItems: products.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: payable,
      paymentStatus: "Completed", // Optional
    });

    // Stock adjustment
    for (const item of products) {
      const product = await Product.findById(item.product._id);
      if (!product) throw new Error(`Product ${item.product._id} not found`);

      product.sold += item.quantity;
      product.quantity -= item.quantity;
      if (product.quantity < 0) throw new Error(`Not enough stock for ${item.product._id}`);

      await product.save();
    }

    return; // No response from here — `res` is handled in `paymentVerification`

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


  // Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}






const getAllOrder = async(req,res)=>{
  try {

    const userId = req.user.id

    if(!userId){
      return res.status(401).json({
        success: false,
        message: `User is not Found`,
      })
    }
    
    const orders = await Order.find({ user: userId })
    .populate({
        path: 'orderItems.product',
        model: 'Product',
    })
    .exec();

console.log('Populated Orders:', orders);

    return res.status(200).json({
      orders,
success: true,
message: `Fetch Orders Successfully`,
})

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: `Error During fetch order`,
    })
  }
}



module.exports = {
    capturePayment,
  paymentVerification,
  createOrder,
  getAllOrder
};
