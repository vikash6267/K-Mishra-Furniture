import React from "react"
import { setStep } from "../../../redux/slices/paymentSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { verifyPayment } from "../../../serivces/operations/order"

function Payment({ payable, coupon }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { addressData } = useSelector((state) => state.payment)
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const handleSuccess = (details) => {
    verifyPayment({details,  cart, coupon, addressData, payable, user}, token , navigate, dispatch)
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex w-full justify-center font-bold text-2xl mb-4">
        Payment Methods
      </div>

      <div className="flex justify-center">
        <PayPalScriptProvider 
         options={{ "client-id": "AXAXG5LXv5cKcQH3giE6aJhz9LBWzhAPY0iNO-4iV_qRwBt5Bb7ynwTFnqdk-XMEFAKUVXSNl3YSPdek",
          currency: "GBP" 

         }}>
          <PayPalButtons    fundingSource="paypal" 
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
              })
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture()
              handleSuccess(details)
            }}
            onError={(err) => {
              console.error("PayPal Error:", err)
            }}
          />
        </PayPalScriptProvider>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => dispatch(setStep(1))}
          className="text-blue-600 hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default Payment
