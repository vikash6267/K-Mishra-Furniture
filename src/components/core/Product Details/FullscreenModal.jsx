// FullscreenModal.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';

export default function FullscreenModal({ isOpen, onClose, slides, currentIndex }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-screen-lg">
        <button
          className="absolute top-4 right-4 text-white text-3xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <Swiper
          modules={[Navigation]}
          navigation
          initialSlide={currentIndex}
          spaceBetween={30}
          className="h-full"
          
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                className="w-full h-full object-contain"
                src={slide.url}
                alt={`fullscreen-slide-${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
