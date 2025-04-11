import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllOrders, updateOrder } from "../../../serivces/operations/admin";

function Orders() {
  const { token } = useSelector((state) => state.auth);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders(token);
        setAllOrders(orders);
        console.log(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder({orderId, newStatus}, token);
      // Optionally, update the UI to reflect the changed status
      setSelectedStatus(newStatus);
      console.log(`Order status updated to ${newStatus} successfully`);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }

  };

  return (
    <div className="p-4 border border-gray-300 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
          
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price (GBP)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordered At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change Order Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ORD-{order._id.slice(-5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order?.user?.name} ({order?.user?.email})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => {
                        // Redirect to product details page on click
                        window.location.href = `/product/${item.product._id}`;
                      }}
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.title}
                        className="h-12 w-12 object-contain"
                      />
                      <span>{item.product.title}</span>

                      <div key={item._id} className="text-sm bg-green-500 p-2 rounded-full text-black">
                      {item.quantity}
                    </div>
                    </div>
                    
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 items-center">
               
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.orderStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "GBP",
                  }).format(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                  >
                    {[
                      "Ordered",
                      "Processing",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
