
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { deleteProduct } from "../../../serivces/operations/admin"
import AddProduct from "./add-product"
import { Edit, Trash2, X } from "lucide-react"

function AllProduct() {
  const { allProduct } = useSelector((state) => state.product)
  const { token } = useSelector((state) => state.auth)
  const [products, setProducts] = useState(allProduct || [])
  const [editProduct, setEditProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(null)

  const handleDelete = async (id) => {
    try {
      await deleteProduct({ id }, token)
      setProducts(products.filter((prod) => prod._id !== id))
      setIsConfirmingDelete(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditProduct(null)
  }

  useEffect(() => {
    if (allProduct) {
      setProducts(allProduct)
    }
  }, [allProduct])

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <button
            onClick={() => {
              setEditProduct(null)
              setIsModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2"
          >
            <span>Add New Product</span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No products found. Add your first product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.images[0]?.url || "https://via.placeholder.com/300x200"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
                  £ {product.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Quantity: {product.quantity}</span>
                    <span>High Price: £{product.highPrice}</span>
                    <span>Price: £{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>

                    {isConfirmingDelete === product._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setIsConfirmingDelete(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsConfirmingDelete(product._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10" onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
              <AddProduct productData={editProduct} closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllProduct

