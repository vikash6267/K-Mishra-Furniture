"use client"

import { useEffect } from "react"
import { displayMoney } from "../../../helper/utills"
import { Link } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"

function TestSlide({ products }) {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  const displayedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="w-full max-w-7xl mx-auto overflow-hidden">
      <div className="relative">
        {/* Navigation buttons */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors hidden md:block"
          onClick={() => {
            const container = document.getElementById("product-slider")
            if (container) {
              container.scrollBy({ left: -300, behavior: "smooth" })
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors hidden md:block"
          onClick={() => {
            const container = document.getElementById("product-slider")
            if (container) {
              container.scrollBy({ left: 300, behavior: "smooth" })
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          id="product-slider"
          className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-6 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayedProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="min-w-[280px] max-w-[280px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex-shrink-0 snap-start"
              data-aos="fade-up"
            >
              {/* Image Container */}
              <div className="relative w-full h-[280px] bg-gray-100">
                <img
                  src={product?.images[0]?.url || "/placeholder.svg"}
                  alt={product?.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product?.images[1]?.url && (
                  <img
                    src={product?.images[1]?.url || "/placeholder.svg"}
                    alt={product?.title}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-500"
                  />
                )}

                {/* Discount badge if applicable */}
                {product.highPrice && product.highPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {Math.round(((product.highPrice - product.price) / product.highPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[48px]">{product.title}</h4>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-teal-600 font-bold">{displayMoney(product?.price)}</p>
                  {product.highPrice && product.highPrice > product.price && (
                    <p className="text-gray-400 line-through text-sm">{displayMoney(product?.highPrice)}</p>
                  )}
                </div>
                <button className="mt-3 w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 font-medium rounded-md transition-colors text-sm">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestSlide

