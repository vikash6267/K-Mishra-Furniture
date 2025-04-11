import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { paymentEndpoints } from "../apis"
import rzpLogo from "../../assests/logo2.jpg"
import { resetCart } from "../../redux/slices/cartSlice"
import { setCheckout } from "../../redux/slices/paymentSlice"

const {
    PRODUCT_PAYMENT_API,
    PRODUCT_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    GET_ALL_ORDER
} = paymentEndpoints


// Load the Razorpay SDK from the CDN
function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  


  // Buy Product

  export async function BuyProduct(
    token,
    products,
    coupon,
    address,
    payable,
    navigate,
    dispatch
  ) {
    const toastId = toast.loading("Creating PayPal Order...");
  
    try {
      // 1. Call backend to create PayPal order
      const orderResponse = await apiConnector(
        "POST",
        PRODUCT_PAYMENT_API,
        { products, coupon },
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }
  
      const orderID = orderResponse.data.id; // PayPal order ID
  
      toast.dismiss(toastId);
  
      // 2. Render PayPal Button (dynamic container)
      const paypalContainer = document.createElement("div");
      paypalContainer.id = "paypal-button-container";
      document.body.appendChild(paypalContainer);
  
      // 3. Load PayPal Script
      if (!window.paypal) {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AXAXG5LXv5cKcQH3giE6aJhz9LBWzhAPY0iNO-4iV_qRwBt5Bb7ynwTFnqdk-XMEFAKUVXSNl3YSPdek";
        script.async = true;
        script.onload = () => renderPayPalButton(orderID);
        document.body.appendChild(script);
      } else {
        renderPayPalButton(orderID);
      }
  
      function renderPayPalButton(orderID) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: payable.toString(), // Make sure payable is a string
                },
              }],
            });
          }
,          
          onApprove: async (data, actions) => {
            const { orderID } = data;
            await verifyPayment(
              { orderID, products, address, payable },
              token,
              navigate,
              dispatch
            );
          },
          onError: (err) => {
            console.error("PayPal error", err);
            toast.error("Payment failed.");
          },
        }).render("#paypal-button-container");
      }
    } catch (error) {
      console.error("PAYPAL PAYMENT ERROR", error);
      toast.error("Could not complete payment.");
      toast.dismiss(toastId);
    }
  }
  


// Verify the Payment
export async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...")
    console.log("enter verify")
    // dispatch(setPaymentLoading(true))
    try {
      const response = await apiConnector("POST", PRODUCT_VERIFY_API, bodyData, {
        Authorization: `Bearer ${token}`,
      })
  
      console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
  
      toast.success("Payment Successful. Order Placed ")
      
      navigate("/")
      dispatch(resetCart())
      dispatch(setCheckout(false))
    } catch (error) {
      console.log("PAYMENT VERIFY ERROR............", error)
      toast.error("Could Not Verify Payment.")
    }
    toast.dismiss(toastId)
    // dispatch(setPaymentLoading(false))
  }








    export const getAllOrder = () => async (token) => {
      const toastId = toast.loading("Loading...");

      try {
        const response = await apiConnector("GET", GET_ALL_ORDER,null, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        });
        console.log(response)
        if (!response?.data?.success) {
          throw new Error("Could Not Fetch Product");
        }
        const result = response?.data?.orders;
      // Dispatching action to save products
        toast.dismiss(toastId);
        return result;
      } catch (error) {
        console.log("GET_ALL_ORDER_API API ERROR:", error);
        toast.error(error.message);
        toast.dismiss(toastId);
        return [];
      }
    };