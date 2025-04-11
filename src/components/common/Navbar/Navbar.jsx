"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import Backdrop from "../../common/Backdrop"
import {
  FaSun,
  FaCloudSun,
  FaMoon,
  FaAngleRight,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
  FaHeartbeat,
  FaPills,
  FaFirstAid,
  FaMicroscope,
  FaHeart,
  FaChartLine,
} from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import { logout } from "../../../serivces/operations/user"
import LogoutModal from "./LogoutModal"

// Updated NavbarLinks with medical-themed icons
const NavbarLinks = [
  { title: "Home", path: "/", icon: <FaHeartbeat className="text-blue-600" /> },
  { title: "Products", path: "/allProduct", icon: <FaPills className="text-blue-600" /> },
  { title: "My Orders", path: "/order", icon: <FaFirstAid className="text-blue-600" /> },
  { title: "Contact Us", path: "/contact", icon: <FaHeart className="text-blue-600" /> },
  { title: "About Us", path: "/aboutus", icon: <FaMicroscope className="text-blue-600" /> },
 
]

function getGreeting() {
  const currentHour = new Date().getHours()
  let greeting = ""
  let icon = null

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning"
    icon = <FaSun className="text-yellow-500" />
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon"
    icon = <FaCloudSun className="text-yellow-400" />
  } else {
    greeting = "Good Evening"
    icon = <FaMoon className="text-blue-500" />
  }

  return { greeting, icon }
}

function Navbar({ isOpen, setIsOpen }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const ref = useRef(null)
  useOnClickOutside(ref, () => dispatch(setIsOpen(false)))
  const { user } = useSelector((state) => state.profile)

  const logoutHandler = () => {
    console.log("Working Logout")
    dispatch(logout(navigate))
  }

  const { greeting, icon } = getGreeting()

  const handleClose = () => {
    console.log("Backdrop clicked, closing navbar")
    dispatch(setIsOpen(false))
  }

  useEffect(() => {
    console.log(isOpen)
    AOS.init({ duration: 800, once: true })
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden uppercase">
          <Backdrop onClick={handleClose} />
          <motion.div
            id="navbar"
            ref={ref}
            className="fixed top-0 left-0 bottom-0 w-[300px] md:w-[350px] bg-white p-6 z-40 border-r border-gray-200 shadow-lg overflow-y-auto"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="w-full mx-auto mt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                  {user?.image ? (
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name || "User"}
                      className="w-16 h-16 rounded-full border-2 border-blue-100 object-cover"
                      data-aos="fade-up"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-100"
                      data-aos="fade-up"
                    >
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                  )}

                  <div
                    className="flex items-center mt-4 bg-blue-50 px-4 py-2 rounded-full"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <div className="mr-2">{icon}</div>
                    <div className="text-sm font-medium text-blue-800">{greeting}</div>
                  </div>

                  {user && (
                    <div className="mt-2 text-lg font-semibold text-gray-700" data-aos="fade-up" data-aos-delay="200">
                      {user.name}
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-gray-200 my-2"></div>

                <div className="flex flex-col w-full gap-3">
                  {user ? (
                    <>
                      <Link
                        to="profile"
                        onClick={() => dispatch(setIsOpen(false))}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                        data-aos="fade-up"
                        data-aos-delay="100"
                      >
                        <FaUser className="text-blue-600" />
                        <span className="font-medium">My Profile</span>
                        <FaAngleRight className="ml-auto text-blue-500" />
                      </Link>

                      {user?.accountType === "Admin" && (
                        <Link
                          to="admin/dashboard/orders"
                          onClick={() => dispatch(setIsOpen(false))}
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                          data-aos="fade-up"
                          data-aos-delay="150"
                        >
                          <FaTachometerAlt className="text-blue-600" />
                          <span className="font-medium">Dashboard</span>
                          <FaAngleRight className="ml-auto text-blue-500" />
                        </Link>
                      )}

                      <button
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors py-2 px-3 rounded-md hover:bg-red-50 text-left"
                        onClick={() => {
                          setShowLogoutModal(true)
                          dispatch(setIsOpen(false))
                        }}
                        data-aos="fade-up"
                        data-aos-delay="200"
                      >
                        <FaSignOutAlt />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                      onClick={() => dispatch(setIsOpen(false))}
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <FaUser className="text-blue-600" />
                      <span className="font-medium">Login</span>
                      <FaAngleRight className="ml-auto text-blue-500" />
                    </Link>
                  )}
                </div>

                <div className="w-full border-t border-gray-200 my-2"></div>

                <div className="w-full">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    KMishra
                  </h3>
                  <ul className="flex flex-col w-full gap-1">
                    {NavbarLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.path}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                        onClick={() => dispatch(setIsOpen(false))}
                        data-aos="fade-up"
                        data-aos-delay={`${250 + index * 50}`}
                      >
                        {link.icon}
                        <span>{link.title}</span>
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} onConfirmLogout={logoutHandler} setIsOpen={setIsOpen} />
      )}
    </AnimatePresence>
  )
}

export default Navbar

