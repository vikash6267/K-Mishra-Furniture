
import { HiUserAdd } from "react-icons/hi";
import { IoLibrary } from "react-icons/io5";
import { GiNotebook } from "react-icons/gi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiSolidOffer } from "react-icons/bi";



export const sidebarLinks = [
  // {
  //   id: 123,
  //   name: "Dashboard",
  //   path: "admin/dashboard",
  //   icon: <AiOutlineDashboard />
  //   ,
  // },
  {
    id: 1,
    name: "Add Product",
    path: "/admin/dashboard/add-product",
    icon: <IoMdAddCircleOutline />  ,
  },
  {
    id: 3,
    name: "Add Category",
    path: "/admin/dashboard/add-category",
    icon: <TbCategoryPlus />,
  },
 
  {
    id: 5,
    name: "Order",
    path: "/admin/dashboard/orders",
    icon: <FaUsers />,
  },
  {
    id: 6,
    name: "All Product",
    path: "/admin/dashboard/all-product",
    icon: <IoLibrary/>,
  },
  // {
  //   id: 7,
  //   name: "Coupons",
  //   path: "/admin/dashboard/coupons",
  //   icon: <BiSolidOffer />,
  // },
 
];
