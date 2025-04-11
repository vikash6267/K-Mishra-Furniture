import React, { useEffect, useState } from "react";
import { setStep } from "../../../redux/slices/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { verifyPayment } from "../../../serivces/operations/order";

const stripePromise = loadStripe(
  "pk_test_51N8wSIIgVdZ3fy8KtfIGuiGbTptdEltd8tHzhx6CrwIuslzoyzq2Fy49bBLkzp19FACzgN1F4v4BZ9d6bFq3E6wC00AcYZR3Ya"
); // replace with your Stripe publishable key

function Payment({ payable, coupon }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addressData } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const handleSuccess = (details) => {
    verifyPayment(
      { details, cart, coupon, addressData, payable, user },
      token,
      navigate,
      dispatch
    );
  };

  function StripeCheckout({
    payable,
    coupon,
    cart,
    user,
    addressData,
    token,
    navigate,
    dispatch,
  }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleStripePayment = async (e) => {
      e.preventDefault();
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/payment/process`,
        {
          amount: Math.round(payable * 100), // Stripe needs amount in cents
        }
      );

      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      console.log(result.paymentIntent.status);

      if (result.error) {
        console.error("Stripe Error:", result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          verifyPayment(
            {
              details: result.paymentIntent,
              cart,
              coupon,
              addressData,
              payable,
              user,
            },
            token,
            navigate,
            dispatch
          );
        }
      }

      setLoading(false);
    };

    return (
      <form
        onSubmit={handleStripePayment}
        className="w-full max-w-md mx-auto p-4 border rounded"
      >
        <CardElement className="p-2 border rounded mb-4" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="text-center font-bold text-2xl">Payment Methods</div>

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
                purchase_units: [
                  {
                    amount: {
                      value: payable.toString(),
                    },
                  },
                ],
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
        <Elements stripe={stripePromise}>
          <StripeCheckout
            payable={payable}
            coupon={coupon}
            cart={cart}
            user={user}
            addressData={addressData}
            token={token}
            navigate={navigate}
            dispatch={dispatch}
          />
        </Elements>
      </div>

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
