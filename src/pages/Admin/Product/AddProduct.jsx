import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchCategory, imageUpload, createProduct } from "../../../serivces/operations/admin";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategoryMain = async () => {
      try {
        const response = await fetchCategory();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoryMain();
  }, []);

  const uploadImage = async (acceptedFiles) => {
    const response = await imageUpload(acceptedFiles);
    const uploadedImages = response?.map((image) => ({
      public_id: image.asset_id,
      url: image.url
    }));
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const removeImage = (publicId) => {
    setImages(images.filter((image) => image.public_id !== publicId));
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.string().required("Category is required"),
    highPrice: Yup.number().required("High Price is required"),
    quantity: Yup.number().required("Quantity is required"),

  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      highPrice: "",
      quantity: "",
      sizes: "",
      images: []
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      formData.append('images', JSON.stringify(images));
      await createProduct(formData, token);
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add Product</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {['title', 'description', 'price', 'highPrice', 'quantity',].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              id={field}
              name={field}
              type={field === 'price' || field === 'highPrice' || field === 'quantity' ? 'text' : 'text'}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              {...formik.getFieldProps(field)}
            />
            {formik.touched[field] && formik.errors[field] && <div className="text-red-500 text-sm">{formik.errors[field]}</div>}
          </div>
        ))}

        <div>
          <label className="block font-medium">Category</label>
          <select id="category" name="category" className="w-full p-2 border rounded-md" {...formik.getFieldProps('category')}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && <div className="text-red-500 text-sm">{formik.errors.category}</div>}
        </div>

        <div className="p-14 border-2 border-dashed border-gray-300 rounded-md text-center">
          <Dropzone onDrop={uploadImage}>
            {({ getRootProps, getInputProps }) => (
              <section {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="text-gray-600">Drag & drop images here, or click to select</p>
              </section>
            )}
          </Dropzone>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-md">
              <button type="button" onClick={() => removeImage(image.public_id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                &times;
              </button>
              <img src={image.url} alt="" className="w-full h-full object-cover rounded-md" />
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddProduct;