// src/components/common/FurnitureHero.jsx
import React from 'react';

const FurnitureHero = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[90vh]">
      <img
        src="https://img.freepik.com/free-vector/organic-flat-furniture-sale-banner-with-photo_23-2148931230.jpg"
        alt="Furniture Sale"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center px-4">
        <div className="text-white max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Upgrade Your Home with Style</h1>
          <p className="text-base md:text-lg mb-6">Discover exclusive furniture deals that blend comfort and elegance.</p>
          <button className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default FurnitureHero;
