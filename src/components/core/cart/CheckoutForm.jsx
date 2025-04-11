import React, { useState } from 'react';
import { useSelector } from "react-redux"
import { displayMoney } from '../../../helper/utills';
import { FiShoppingCart } from "react-icons/fi";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { fetchCoupon } from '../../../serivces/operations/product';
import Address from './Address';
import Payment from './Payment';
import { Link } from 'react-router-dom';

const CheckoutForm = ({ handleClose }) => {
  const { cart, total } = useSelector((state) => state.cart);
  const { step } = useSelector((state) => state.payment);

  const [isOpen, setIsOpen] = useState(true);
  const [payable, setPayable] = useState(total);

  const [couponName, setCouponName] = useState('');
  const [coupon, setCoupon] = useState(false);
  const [couponValue, setCouponValue] = useState(0);
  const [couponValid, setCouponValid] = useState(true);

  const displayTotalAmount = displayMoney(total);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

  const handleCoupon = async () => {
    try {
      const response = await fetchCoupon(couponName);
      if (response.success) {
        setCouponValue(response?.data?.discount);
        setCoupon(true);
        setCouponValid(true);
        setPayable(total - response?.data?.discount);
      } else {
        setCouponValid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full flex flex-wrap-reverse lg:min-h-[calc(100vh-150px)] min-h-[calc(100vh-200px)] font-montserrat'>

      {/* LEFT: Address/Payment */}
      <div className='lg:w-[65%] w-full border-r-2 max-h-[calc(100vh-150px)] overflow-y-auto'>
        {step === 1 && <Address />}
        {step === 2 && <Payment payable={payable} />}
      </div>

      {/* RIGHT: Summary */}
      <div className='lg:w-[35%] w-full'>

        <div className="w-full lg:p-4 rounded-xl text-black">
          <button
            type="button"
            onClick={toggleSummary}
            className="w-full p-2 rounded-xl font-bold text-left flex justify-between items-center"
          >
            <div className='flex items-center gap-5'>
              <FiShoppingCart /> Order Summary Details
            </div>
            <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>

          {isOpen && (
            <div className="p-3 max-h-[150px] overflow-y-auto scrollbar-w-[0.35vw]">
              <ul className='flex flex-col gap-3'>
                {cart.map((item, ind) => (
                  <li key={ind} className='border p-2'>
                    <div className='flex gap-2'>
                      <div className='w-[25%] border-r-2 pr-3'>
                        <Link to={`/product/${item.product._id}`} onClick={handleClose}>
                          <img src={item.product.images[0].url} alt="product-img" />
                        </Link>
                      </div>
                      <div>
                        <p className='text-[15px] font-semibold'>{item.product.title}</p>
                        <p className='text-[12px] lg:text-[14px]'>{`Price- ${displayMoney(item.product.price)}`}</p>
                        <p className='text-[12px] lg:text-[14px]'>{`Quantity- ${item.quantity}`}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='mt-[20px] font-montserrat'>
            <div className='flex w-full justify-between px-6 text-[13px]'>Subtotal <span>{displayTotalAmount}</span></div>
            {coupon && (
              <div className='flex w-full justify-between px-6 text-[13px]'>Discount <span className='text-green-600'>- {displayMoney(couponValue)}</span></div>
            )}
            <div className='flex w-full justify-between px-6 text-[13px]'>Shipping <span>To be calculated</span></div>
          </div>

          <div className='min-h-[1px] max-w-[90%] bg-black mt-[20px] mx-auto'></div>

          <div className='flex w-full justify-between px-6 font-bold text-[12px] mt-3'>Payable <span>{displayMoney(payable)}</span></div>

          {/* Coupon form (currently hidden with false) */}
          {false && (
            <div className='mt-3 px-6 flex flex-col gap-2'>
              <div className='flex gap-5 relative'>
                <input
                  type="text"
                  id='coupon'
                  className='p-1'
                  placeholder='Coupon Code'
                  value={couponName.toUpperCase()}
                  onChange={(e) => {
                    setCouponName(e.target.value.toUpperCase());
                    setCouponValid(true);
                  }}
                />
                {!couponValid && (
                  <div className='text-red-500 absolute -top-2 left-0 text-[10px]'>
                    {couponName} is not valid Coupon.
                  </div>
                )}
                <button type='submit' className='button' onClick={handleCoupon}>Apply</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
