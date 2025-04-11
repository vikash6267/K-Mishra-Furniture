import React, { useState } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";



import { useSelector,useDispatch } from "react-redux";
import { sidebarLinks } from "../../../constant/sidebarlink";



function Sidebar() {
  const { user } = useSelector((state) => state.profile);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();


  const toggle = () => setIsOpen(!isOpen);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      width: "200px",
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <motion.div
      animate={{
        width: isOpen ? "220px" : "45px",
        transition: {
          duration: 0.5,
          type: "spring",
          damping: 12,
        },
      }}
      className="flex flex-col border-r-[1px] border-r-gray-700 min-h-[calc(100vh-4rem)]  bg-gray-800 pt-3 gap-10"
    >
      <div className="flex items-center justify-between text-2xl leading-0 px-2 h-8">
        <AnimatePresence>
          {isOpen && (
            <motion.h1
              variants={showAnimation}
              initial="show"
              aniamte="show"
              exit="hidden"
              className="whitespace-nowrap text-2xl text-blue-200 font-mulish capitalize"
            >
           <div className="flex gap-2">  <img src={user?.image} alt="" width={50} className=" rounded-full"/> {user?.firstName}</div>
            </motion.h1>
          )}
        </AnimatePresence>

        <div>
          <FaBars onClick={toggle} className="cursor-pointer text-white" />
        </div>
      </div>
      {/* <div className="mx-auto my-6 h-[1px] w-10/12 bg-gray-700"></div> */}
      <section className="flex gap-4 flex-col text-xl">
      
        {sidebarLinks.map((link) => {
          {/* if (link.type && user?.accountType !== link.type) return null; */}
        return (
          <NavLink
            to={link.path}
            key={link.id}
            onClick={()=> setIsOpen(false)} 
            className={`" flex text-white font-mulish items-center gap-2 px-2 py-0 hover:border-r-4 hover:bg-gray-600 hover:transition hover:ease-in-expo " ${
              matchRoute(link?.path) && "bg-pink-400 "
            }`}
          >
            <div title={link.name}>{link.icon}</div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="show"
                  aniamte="show"
                  exit="hidden"
                  className="whitespace-nowrap text-base"
                >
                  {link.name}
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
         )
        })}
      </section>

  

      <div className="mx-auto my-6 h-[1px] w-10/12 bg-gray-700"></div>
      

    </motion.div>
  );
}

export default Sidebar;
