"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { displayMoney } from "../../../helper/utills"
import { useDispatch } from "react-redux"
import { addToCart } from "../../../redux/slices/cartSlice"
import AOS from "aos"
import "aos/dist/aos.css"

function ProductCard({ products }) {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  const { _id, title, price, highPrice, images } = products
  const dispatch = useDispatch()

  const newPrice = displayMoney(price)
  const oldPrice = highPrice ? displayMoney(highPrice) : null

  // Calculate discount percentage if highPrice exists
  const discountPercentage = highPrice ? Math.round(((highPrice - price) / highPrice) * 100) : null

  return (
    <div
      className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      data-aos="zoom-in"
    >
      <Link to={`/product/${_id}`} className="block relative">
        <div className="relative w-full h-[280px] overflow-hidden bg-gray-100">
          <img
            src={images[0]?.url || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition duration-700 ease-in-out transform group-hover:scale-105"
          />
          {images[1]?.url && (
            <img
              src={images[1]?.url || "/placeholder.svg"}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out"
            />
          )}

          {/* Discount badge */}
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Quick action buttons */}
          <div className="absolute bottom-3 right-3 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dispatch(addToCart({  products: products,
                  quantity:0, }))
              }}
              className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${_id}`} className="block">
          <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[48px] group-hover:text-teal-600 transition-colors">
            {title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-teal-600 font-bold">{newPrice}</span>
          {oldPrice && <span className="text-gray-400 line-through text-sm">{oldPrice}</span>}
        </div>

        <button
          onClick={() => dispatch(addToCart({  products: products,
            quantity:0, }))}
          className="mt-3 w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard

