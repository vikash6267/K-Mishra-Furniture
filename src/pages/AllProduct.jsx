import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { displayMoney } from "../helper/utills";
import { Link, useParams } from 'react-router-dom';
import AOS from "aos";
import 'aos/dist/aos.css';

function AllProduct() {
  const { query } = useParams();
  const { allProduct } = useSelector((state) => state.product);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [sortType, setSortType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const categories = [...new Set(allProduct.map((product) => product.category.name))];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    let filtered = [...allProduct]; // Create a shallow copy of the allProduct array
    if (category) {
      filtered = filtered.filter(product => product.category.name === category);
    }
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortType === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price); // Create a new copy before sorting
    } else if (sortType === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortType === 'a-z') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'z-a') {
      filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
    }
    setFilteredProducts(filtered);
  }, [category, sortType, searchTerm, allProduct]);
  
  return (
    <div className="min-h-screen mt-20 px-4 md:px-6 lg:px-10">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">All Products</h2>
      
      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <div className="flex flex-wrap gap-4">
          <select onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select onChange={(e) => setSortType(e.target.value)} className="p-2 border rounded">
            <option value="">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="a-z">Title: A to Z</option>
            <option value="z-a">Title: Z to A</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh] text-xl font-semibold text-gray-600">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              data-aos="fade-up"
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="relative w-full h-[380px] bg-gray-100">
                <img
                  src={product.images[0]?.url}
                  alt={product.title}
                  className="w-full h-[90%] object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {product.title}
                </h4>
                <p className="text-green-600 font-bold text-sm mt-1">
                  {displayMoney(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProduct;
