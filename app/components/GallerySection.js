"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GallerySection() {
  const galleryItems = [
    {
      id: 1,
      title: "",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    },
    {
      id: 2,
      title: "",
      image: "/2.jpeg",
    },
    {
      id: 3,
      title: "",
      image:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    },
    {
      id: 4,
      title: "",
      image: "/3.jpeg",
    },
    {
      id: 5,
      title: "",
      image: "/4.jpeg",
    },
    {
      id: 6,
      title: "",
      image: "./5.jpeg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="py-12 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white"
      id="gallery"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 uppercase tracking-wide">
          Our <span className="text-neonBlue glow">Gallery</span>
        </h2>

        {/* Mobile: Auto-scroll single image */}
        <div className="block md:hidden">
          <div className="relative w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={galleryItems[currentIndex].id}
                className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={galleryItems[currentIndex].image}
                  alt={galleryItems[currentIndex].title}
                  className="w-full h-64 object-cover rounded-lg transition-opacity duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300">
                  <span className="text-lg font-semibold text-white opacity-0 hover:opacity-100 transition-all duration-300">
                    {galleryItems[currentIndex].title}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop: Three-Column Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-800/40 border border-gray-700 backdrop-blur-md transform transition-all hover:scale-105 hover:shadow-neonBlue"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[350px] object-cover rounded-lg transition-opacity duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300">
                <span className="text-xl font-semibold text-white opacity-0 hover:opacity-100 transition-all duration-300">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
