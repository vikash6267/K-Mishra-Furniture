import React, { useEffect, useState } from "react";
import { getAllOrder } from "../serivces/operations/order";
import { useSelector } from "react-redux";
import {  FaMoneyBillAlt } from "react-icons/fa";
import Footer from "../components/common/Footer";
function Order() {
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchAllOrders = getAllOrder(); // This returns a function
        const res = await fetchAllOrders(token); // Call the returned function to fetch orders
        setOrders(res);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [token]);

  // Function to format price to INR currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  return (
 <div>
     <div className="flex flex-col items-center px-4">
      <div className="w-full flex justify-center text-2xl font-bold p-4 border-b-2 mb-6">
        <h2>Your Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-2xl mt-10">No Order Found</div>
      ) : (
        <div className="container mx-auto px-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="my-4 p-6 border border-gray-300 rounded-lg shadow-lg bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between mb-4">
                <span className="text-gray-600 mb-2 md:mb-0">
                  <strong>Order ID:</strong> {order.order_id}
                </span>
                <span className="text-gray-600">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Shipping Information:
                </h3>
                <p className="text-gray-700">{order.shippingInfo.name}</p>
                <p className="text-gray-700">{order.shippingInfo.address}</p>
                <p className="text-gray-700">
                  {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                  {order.shippingInfo.pincode}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                <ul className="list-disc pl-5">
                  {order.orderItems.map((item) => (
                    <li key={item._id} className="flex items-center mb-2">
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-full mr-3"
                      />
                      <span className="text-gray-700">
                        {item.product.title} - Quantity: {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <span className="text-gray-600 flex items-center mb-2 gap-1 md:mb-0">
                  <FaMoneyBillAlt className="mr-2 text-green-600" />
                  <strong>Total Price:</strong> {formatPrice(order.totalPrice)}
                </span>
                {/* <span className="text-gray-600 flex items-center">
                  <FaTruck className="mr-2 text-blue-600" />
                  <strong>Payment Status:</strong> {order.orderStatus}
                </span> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <Footer></Footer>
 </div>
  );
}

export default Order;
