import React, { useEffect, useState } from "react";
import { setStep } from "../../../redux/slices/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { verifyPayment } from "../../../serivces/operations/order";

const stripePromise = loadStripe(
  "pk_live_51RA4smGsRwmqhZp1cvCcgPkpuG48EvGTcrCNbmlGvwyWyukgk0FOlH4Mm9NmKrbKyL3BxRhYF1duUy0mrs5ernVb00FF93HuBO"
); // replace with your Stripe publishable key

function Payment({ payable, coupon }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addressData } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/payment/process`,
          { amount: Math.round(payable * 100) }
        );
        setClientSecret(data.client_secret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [payable]);

  const handleSuccess = (details) => {
    verifyPayment(
      { details, cart, coupon, addressData, payable, user },
      token,
      navigate,
      dispatch
    );
  };

  const StripePaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe Error:", error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        verifyPayment(
          { details: paymentIntent, cart, coupon, addressData, payable, user },
          token,
          navigate,
          dispatch
        );
      }

      setLoading(false);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="w-full  mx-auto lg:p-4  border rounded bg-"
      >
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </form>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="text-center font-bold text-2xl">Payment Methods</div>
  
      {/* Scrollable Area */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] lg:px-4 space-y-6">
  
        {/* PayPal */}
        <div className="flex justify-center">
          <PayPalScriptProvider
            options={{
              "client-id":
                "AXAXG5LXv5cKcQH3giE6aJhz9LBWzhAPY0iNO-4iV_qRwBt5Bb7ynwTFnqdk-XMEFAKUVXSNl3YSPdek",
              currency: "GBP",
            }}
          >
            <PayPalButtons
              fundingSource="paypal"
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: payable.toString() } }],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                handleSuccess(details);
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
              }}
            />
          </PayPalScriptProvider>
        </div>
  
        {/* Stripe */}
        <div className="flex justify-center">
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: clientSecret,
                appearance: { theme: "flat" },
              }}
            >
              <StripePaymentForm />
            </Elements>
          )}
        </div>
      </div>
  
      {/* Back Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => dispatch(setStep(1))}
          className="text-blue-600 hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  );
  
}


export default Payment;
