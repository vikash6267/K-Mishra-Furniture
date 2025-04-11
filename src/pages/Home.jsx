"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../components/core/home/ProductCard";
import Footer from "../components/common/Footer";
import OffersSection from "../components/common/HealthCare";

import HeroSection from "../components/common/HeroSection";
import FurnitureDeals from "../components/common/OfferHealthCare";
import TestSlide from "../components/core/home/Slider";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Interior Designer',
    rating: 5,
    feedback: 'Excellent quality furniture with a stylish touch. Highly recommended!'
  },
  {
    name: 'Sneha Patel',
    role: 'Homeowner',
    rating: 4,
    feedback: 'Beautiful craftsmanship and timely delivery.'
  },
  {
    name: 'Amit Verma',
    role: 'Architect',
    rating: 5,
    feedback: 'Modern designs and sturdy build. Great value!'
  },
  {
    name: 'Priya Das',
    role: 'Interior Consultant',
    rating: 5,
    feedback: 'Wide range of stylish furniture pieces. Loved the collection!'
  },
];

const TestimonialCarousel = () => (
  <section className="py-12 bg-gray-50 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
      <p className="text-gray-600 mb-10">What our happy furniture buyers say</p>
      <div className="relative w-full overflow-hidden">
        <div className="flex space-x-6 animate-scroll">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={idx}
              className="min-w-[300px] max-w-sm bg-white rounded-2xl shadow p-6 flex-shrink-0"
            >
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-400 ${i < t.rating ? '' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">“{t.feedback}”</p>
              <h4 className="font-semibold text-lg">{t.name}</h4>
              <span className="text-sm text-gray-500">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <style jsx>{`
      .animate-scroll {
        animation: scroll 20s linear infinite;
      }
      @keyframes scroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-90%); }
      }
    `}</style>
  </section>
);

function Home() {
  const [products, setProduct] = useState([]);
  const [products2, setProduct2] = useState([]);
  const { allProduct } = useSelector((state) => state.product);

  const selectRandomProducts = (products) => {
    if (!Array.isArray(products)) return [];
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  useEffect(() => {
    setProduct(allProduct);
    setProduct2(selectRandomProducts(allProduct));
  }, [allProduct]);

  if (!allProduct.length) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-[60px] bg-gray-50">
        <HeroSection />
        <OffersSection />

        {/* New Furniture Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Furniture Arrivals</h2>
              <Link
                to="/allProduct"
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors shadow-sm"
              >
                Explore More
              </Link>
            </div>
            <TestSlide products={products} />
          </div>
        </div>

        <FurnitureDeals />

        {/* Banner */}
        <div className="w-11/12 mx-auto">
          <img src="/banner-01.webp" alt="Furniture Sale" className="rounded-lg shadow-xl w-full object-cover" />
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Discover Your Dream Furniture</h2>
            <p className="text-gray-600 mt-2">Upgrade your space with our stylish and modern pieces.</p>
          </div>
        </div>

        {/* Trending Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Trending Furniture</h2>
              <Link
                to="/allProduct"
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors shadow-sm"
              >
                Explore More
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products2.map((product) => (
                <ProductCard key={product._id} products={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <TestimonialCarousel />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default Home;
