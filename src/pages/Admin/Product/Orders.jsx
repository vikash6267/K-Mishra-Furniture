"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAllOrders, updateOrder } from "../../../serivces/operations/admin"
import { X, Package, User, MapPin, CreditCard, Calendar } from "lucide-react"

function Orders() {
  const { token } = useSelector((state) => state.auth)
  const [allOrders, setAllOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getAllOrders(token)
        setAllOrders(orders)
        console.log(orders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [token])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder({ orderId, newStatus }, token)
      console.log(`Order status updated to ${newStatus} successfully`)
      setAllOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus } : order)),
      )
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const openOrderDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Ordered":
        return "bg-purple-100 text-purple-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openOrderDetails(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">ORD-{order._id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{order?.user?.name}</div>
                        <div className="text-sm text-gray-500">{order?.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
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

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Details - ORD-{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Order Info</h4>
                  </div>
                  <p className="text-sm text-gray-600">Order ID: ORD-{selectedOrder._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">
                    Status:
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total:{" "}
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(selectedOrder.totalPrice)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Customer</h4>
                  </div>
                  <p className="text-sm text-gray-600">{selectedOrder?.user?.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder?.user?.email}</p>
                  {selectedOrder?.user?.contactNumber && (
                    <p className="text-sm text-gray-600">{selectedOrder?.user?.contactNumber}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Dates</h4>
                  </div>
                  <p className="text-sm text-gray-600">Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Shipping Address</h4>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedOrder.shippingInfo.name}</p>
                  <p>{selectedOrder.shippingInfo.address}</p>
                  <p>
                    {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}{" "}
                    {selectedOrder.shippingInfo.pincode}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Payment Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>
                      Status: <span className="font-medium text-green-600">{selectedOrder.paymentStatus}</span>
                    </p>
                    <p>PayPal Order ID: {selectedOrder.paymentInfo.paypalOrderId}</p>
                  </div>
                  <div>
                    <p>Payer Email: {selectedOrder.paymentInfo.payerEmail}</p>
                    <p>Payer ID: {selectedOrder.paymentInfo.paypalPayerId}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item?.product?.images[0]?.url || "/placeholder.svg"}
                          alt={item?.product?.title}
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item?.product?.title}</h5>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item?.product?.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                Quantity: <span className="font-medium">{item.quantity}</span>
                              </span>
                              <span>
                                Price: <span className="font-medium">£{item?.product?.price}</span>
                              </span>
                           
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              £{(item?.product?.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                  <span>Total Amount:</span>
                  <span>
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(selectedOrder.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => {
                  handleStatusChange(selectedOrder._id, e.target.value)
                  setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value })
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
