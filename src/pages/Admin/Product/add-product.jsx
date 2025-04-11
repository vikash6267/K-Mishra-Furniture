"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { fetchCategory, imageUpload, createProduct, updateProduct } from "../../../serivces/operations/admin"
import Dropzone from "react-dropzone"
import { useSelector } from "react-redux"
import { X } from "lucide-react"

function AddProduct({ productData = null, closeModal = () => {} }) {
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const { token } = useSelector((state) => state.auth)
  const isEditing = !!productData

  useEffect(() => {
    const fetchCategoryMain = async () => {
      try {
        const response = await fetchCategory()
        setCategories(response)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategoryMain()

    // If editing, populate the form with existing product data
    if (productData) {
      setImages(productData.images || [])
    }
  }, [productData])

  const uploadImage = async (acceptedFiles) => {
    try {
      const response = await imageUpload(acceptedFiles)
      const uploadedImages = response?.map((image) => ({
        public_id: image.asset_id,
        url: image.url,
      }))
      setImages((prevImages) => [...prevImages, ...uploadedImages])
    } catch (error) {
      console.error("Error uploading images:", error)
    }
  }

  const removeImage = (publicId) => {
    setImages(images.filter((image) => image.public_id !== publicId))
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    highPrice: Yup.number().required("High Price is required"),
    quantity: Yup.number().required("Quantity is required"),
  })

  const formik = useFormik({
    initialValues: {
      title: productData?.title || "",
      description: productData?.description || "",
      price: productData?.price || "",
      category: productData?.category?._id || "",
      highPrice: productData?.highPrice || "",
      quantity: productData?.quantity || "",
      sizes: productData?.sizes || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => formData.append(key, value))
        formData.append("images", JSON.stringify(images))

        if (isEditing) {
          formData.append("id", productData._id)
          await updateProduct(formData, token)
        } else {
          await createProduct(formData, token)
        }

        
        closeModal()
        // Refresh the product list or redirect
        window.location.reload()
      } catch (error) {
        console.error("Error submitting product:", error)
      }
    },
  })

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">{isEditing ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["title", "description", "price", "highPrice", "quantity"].map((field) => (
            <div key={field} className={field === "description" ? "md:col-span-2" : ""}>
              <label className="block font-medium capitalize mb-1" htmlFor={field}>
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                id={field}
                name={field}
                type={field === "price" || field === "highPrice" || field === "quantity" ? "number" : "text"}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                {...formik.getFieldProps(field)}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              id="category"
              name="category"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
              {...formik.getFieldProps("category")}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
            )}
          </div>
        </div>

        <div className="p-8 border-2 border-dashed border-gray-300 rounded-md text-center mt-6 bg-gray-50">
          <Dropzone onDrop={uploadImage}>
            {({ getRootProps, getInputProps }) => (
              <section {...getRootProps()} className="cursor-pointer py-4">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600">Drag & drop images here, or click to select</p>
                  <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
              <button
                type="button"
                onClick={() => removeImage(image.public_id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={image.url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct

