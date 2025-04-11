"use client"
import { useDispatch, useSelector } from "react-redux"
import { RxHamburgerMenu } from "react-icons/rx"
import { FaUser, FaShoppingCart } from "react-icons/fa"
import { Link } from "react-router-dom"
import logo from "../../../assests/logo.jpg"
import Cart from "../../../pages/Cart"
import { handleIsCartOpen } from "../../../redux/slices/cartSlice"
import Navbar from "./Navbar"
import { handleIsMenuOpen } from "../../../redux/slices/product"
import { Briefcase, Building2 } from "lucide-react"; // Make sure lucide-react is installed


function Header() {
  const { isMenuOpen } = useSelector((state) => state.product)
  const { cart } = useSelector((state) => state.cart)
  const totalItems = cart.length
  const dispatch = useDispatch()

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-300 shadow-sm">
      <div className="w-11/12 mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(handleIsMenuOpen())}
            className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RxHamburgerMenu className="text-xl" />
            <span className="sr-only">Open menu</span>
          </button>
          <Navbar isOpen={isMenuOpen} setIsOpen={handleIsMenuOpen} />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
  <Link to="/" className="flex items-center space-x-3">
    {/* Icon with dark blue tone */}
    <Briefcase className="text-blue-800 w-7 h-7" />

    {/* Brand Text */}
    <div className="flex items-baseline space-x-1">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 tracking-wide">
        KMISHRA
      </h2>
      <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
        Enterprises
      </span>
    </div>

    {/* Optional additional icon */}
    <Building2 className="text-blue-600 w-6 h-6" />
  </Link>
</div>


        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Profile"
          >
            <FaUser className="text-lg" />
            <span className="sr-only">Profile</span>
          </Link>

          <Cart />

          <button
            onClick={() => dispatch(handleIsCartOpen())}
            className="relative p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Cart"
          >
            <FaShoppingCart className="text-lg" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

