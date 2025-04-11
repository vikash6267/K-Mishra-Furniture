"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

const Backdrop = ({ onClick }) => {
  // Disable scrolling when the backdrop is displayed
  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  )
}

export default Backdrop

