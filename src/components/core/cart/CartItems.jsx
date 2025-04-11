"use client"
import { TbTrash } from "react-icons/tb"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { removeFromCart } from "../../../redux/slices/cartSlice"
import QuantityBox from "./QuantityBox"
import { displayMoney } from "../../../helper/utills"

const CartItems = (props) => {
  const dispatch = useDispatch()
  const { _id, images, title, price, highPrice } = props.product
  const { quantity } = props

  const newPrice = displayMoney(price)
  const oldPrice = displayMoney(highPrice)

  return (
    <div className="cart_item flex flex-col sm:flex-row gap-3 sm:gap-4 py-3 sm:py-4 items-start sm:items-center border-b-2 w-full sm:w-11/12 mx-auto px-2 sm:px-0">
      <figure className="w-full sm:w-[30%] md:w-[25%] lg:w-[20%]">
        <Link to={`/product/${_id}`} className="block">
          <img
            src={images[0].url || "/placeholder.svg"}
            alt="product-img"
            className="w-full h-auto object-cover rounded-md"
          />
        </Link>
      </figure>
      <div className="flex flex-col gap-1 sm:gap-2 w-full">
        <div className="flex items-start sm:items-center justify-between">
          <h4 className="pr-2">
            <Link
              to={`/product/${_id}`}
              className="text-base sm:text-lg font-montserrat font-semibold line-clamp-2 sm:line-clamp-1"
            >
              {title}
            </Link>
          </h4>
          <div className="relative group flex ml-2 sm:ml-0">
            <button
              onClick={() => dispatch(removeFromCart(_id))}
              className="cursor-pointer group-hover:text-red-500 text-lg sm:text-xl p-1"
              aria-label="Remove item"
            >
              <TbTrash />
            </button>
            <div className="hidden group-hover:block absolute top-[30px] right-0 sm:-left-10 sm:transform sm:-translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded w-[86px] z-10">
              Remove Item
            </div>
          </div>
        </div>
        <h2 className="text-sm sm:text-base font-semibold">
          {newPrice} &nbsp;
          <small>
            <del className="text-gray-500">{oldPrice}</del>
          </small>
        </h2>

        <div className="mt-1 sm:mt-2">
          <QuantityBox itemId={_id} itemQuantity={quantity} />
        </div>
      </div>
    </div>
  )
}

export default CartItems
