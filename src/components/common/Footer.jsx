import React from 'react';
import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white pt-10 pb-8 mt-[100px] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-start">
          {/* Left Section - Branding & Social Icons */}
          <div className="w-full lg:w-5/12 px-4 mb-8 lg:mb-0">
            <h4 className="text-4xl font-semibold text-white mb-2">KMISHRA</h4>
            <h5 className="text-lg text-green-200 mb-4">Delivery within 4-7 working days. Your health, our priority!</h5>
            <div className="flex gap-4">
              <button className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition duration-300 transform hover:scale-110">
                <FaFacebookF />
              </button>
              <button className="bg-green-500 hover:bg-green-400 text-white p-3 rounded-full transition duration-300 transform hover:scale-110">
                <FaWhatsapp />
              </button>
              <button className="bg-green-700 hover:bg-green-600 text-white p-3 rounded-full transition duration-300 transform hover:scale-110">
                <FaInstagram />
              </button>
            </div>
          </div>

          {/* Right Section - Useful Links */}
          <div className="w-full lg:w-5/12 px-4">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-5/12 px-4 mb-6">
                <span className="block uppercase text-green-400 text-sm font-semibold mb-3">Useful Links</span>
                <ul className="space-y-2">
                  <li>
                    <a href="https://kmishraenterprises.in/profile" className="text-green-200 hover:text-green-100 font-medium block text-sm">My Profile</a>
                  </li>
                  <li>
                    <a href="https://kmishraenterprises.in/order" className="text-green-200 hover:text-green-100 font-medium block text-sm">My Order</a>
                  </li>
                  <li>
                    <a href="https://kmishraenterprises.in/contact" className="text-green-200 hover:text-green-100 font-medium block text-sm">Contact Us</a>
                  </li>
                  <li>
                    <Link to="/admin/dashboard/add-product" className="text-green-200 hover:text-green-100 font-medium block text-sm">Admin Route</Link>
                  </li>
                </ul>
              </div>

              {/* Empty section for spacing */}
              <div className="w-full lg:w-7/12 px-4">
                <span className="block uppercase text-green-400 text-sm font-semibold mb-3">About Us</span>
                {/* Add your About Us links or content here */}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-green-700" />

        {/* Footer Bottom Section */}
        <div className="flex flex-wrap justify-center items-center text-center">
          <div className="w-full md:w-4/12 px-4 mx-auto">
            <div className="text-sm text-green-300 font-semibold py-2 flex justify-center items-center gap-2">
              <span>© <span id="get-current-year">{new Date().getFullYear()}</span></span>
              <span>Powered By</span>
              <a href="https://inextets.in" className="text-green-300 hover:text-green-500" target="_blank" rel="noopener noreferrer">I-NEXT-ETS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
