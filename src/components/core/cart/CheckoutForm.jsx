// CheckoutForm.js
import React, { useState } from 'react';
import { useSelector } from "react-redux"
import { displayMoney , calculateTotal} from '../../../helper/utills';
import { FiShoppingCart } from "react-icons/fi";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { fetchCoupon } from '../../../serivces/operations/product';
import Address from './Address';
import Payment from './Payment';
import { Link } from 'react-router-dom';

const CheckoutForm = ({handleClose}) => {
  const { cart, total} = useSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(true);
  const [payable,setPayable] = useState(total)
  //Coupon

  const [couponName,setCouponName] = useState('')
  const [coupon,setCoupon] = useState(false)
  const [couponValue,setCouponValue] = useState(0)
  const [couponValid,setCouponValid] = useState(true)



  const displayTotalAmount = displayMoney(total);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

    const { step } = useSelector((state) => state.payment)

    

const handleCoupon = async() =>{

  try {
    const response = await fetchCoupon(couponName)

    console.log(response?.data?.discount)
    

    if(response.success){
      setCouponValue(response?.data?.discount)
      console.log(couponValue)
      setCoupon(true)
      setCouponValid(true)
      setPayable(total - response?.data?.discount)
    }
    else setCouponValid(false)
    
  } catch (error) {
    console.log(error)
    
  }

}
  return (
   <div className=' w-full flex flex-wrap-reverse lg:min-h-[calc(100vh-150px)] min-h-[calc(100vh-200px)]  lg:max-h-[calc(100vh-150px)] max-h-[calc(100vh-130px)] checkout font-montserrat  '>
{/* left */}


<div className=' lg:w-[65%]  w-screen border-r-2  '>
    {/* <div className="relative mb-2 flex w-full justify-center">
      {steps.map((item) => (
        <>
          <div
            className="flex flex-col items-center "
            key={item.id}
          >
            <button
              className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                step === item.id
                  ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                  : "border-gray-700 bg-gray-800 text-gray-300"
              } ${step > item.id && "bg-yellow-50 text-yellow-50"}} `}
            >
              {step > item.id ? (
                <FaCheck className="font-bold text-gray-900" />
              ) : (
                item.id
              )}
            </button>
            
          </div>
          {item.id !== steps.length && (
            <>
              <div
                className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                step > item.id  ? "border-yellow-50" : "border-gray-500"
              } `}
              ></div>
            </>
          )}
        </>
      ))}
    </div> */}
{/* 
    <div className="relative mb-16 flex w-full  justify-center">
      {steps.map((item) => (
        <>
          <div
            className="flex w-full flex-col items-center gap-y-2"
            key={item.id}
          >
            
            <p
              className={`text-sm ${
                step >= item.id ? "text-gray-5" : "text-gray-500"
              }`}
            >
              {item.title}
            </p>
          </div>
          
        </>
      ))}
    </div> */}
    {/* Render specific component based on current step */}
    {step === 1 && <Address />}
    {step === 2 && <Payment payable={payable} coupon={couponName} />}
    {/* {step === 2 && <div> STEP 2</div>} */}
    {/* {step === 3 && <div> STEP 3</div>} */}
  </div>





{/* right */}
    <div className='   lg:w-[35%]  w-full '>



    <div>

    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100">
      {/* Header */}
      <button
        type="button"
        onClick={toggleSummary}
        className="w-full p-4 font-bold text-left flex justify-between items-center bg-gray-50 rounded-t-xl hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3 text-gray-800">
          <FiShoppingCart className="text-lg" />
          <span className="text-sm sm:text-base">Order Summary</span>
        </div>
        <span className="text-gray-500 h-5 w-5 flex items-center justify-center">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {/* Order Items */}
      {isOpen && (
        <div className="p-3 max-h-[240px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="flex flex-col gap-3">
            {cart.map((item, ind) => (
              <li key={ind} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="w-[25%] sm:w-[20%] border-r border-gray-100 pr-3 flex items-center">
                    <Link to={`/product/${item.product._id}`} onClick={handleClose} className="block w-full">
                      <img
                        src={item.product.images[0].url || "/placeholder.svg"}
                        alt={item.product.title}
                        className="w-full h-auto object-cover rounded-md"
                      />
                    </Link>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold line-clamp-1 mb-1">{item.product.title}</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium">{displayMoney(item.product.price)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Qty:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Summary */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="font-montserrat text-sm space-y-2 px-4">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">{displayTotalAmount}</span>
          </div>

          {coupon && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600 font-medium">- {displayMoney(couponValue)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-600">
            <span>Shipping</span>
            <span className="italic text-xs">To be calculated</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-3 mx-4"></div>

        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-b-xl">
          <span className="font-bold text-gray-800">Total Payable</span>
          <span className="font-bold text-lg">{displayMoney(payable)}</span>
        </div>

        {false && (
          <div className="mt-4 px-4 pb-4">
            <p className="text-sm font-medium mb-1">Apply Coupon</p>
            <div className="flex gap-2 relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="coupon"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  placeholder="Enter coupon code"
                  value={couponName}
                  onChange={(e) => {
                    setCouponName(e.target.value.toUpperCase())
                    setCouponValid(true)
                  }}
                />
                {!couponValid && (
                  <div className="text-red-500 absolute -bottom-5 left-0 text-xs">
                    {couponName} is not a valid coupon.
                  </div>
                )}
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                onClick={handleCoupon}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>


    </div>

    </div>






   </div>
  );
};

export default CheckoutForm;
