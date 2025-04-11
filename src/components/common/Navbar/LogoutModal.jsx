"use client"
import { motion } from "framer-motion"

const LogoutModal = ({ onClose, onConfirmLogout }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <motion.div
        className="bg-white rounded-lg p-6 w-[90%] max-w-md z-10 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={()=>{onConfirmLogout() ; onClose()}}>
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default LogoutModal

