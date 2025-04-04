"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioSection() {
  const projects = [
    {
      title: "Luxury Villa",
      image:
        "https://luxuryproperties.in/wp-content/uploads/2019/07/Prestige-Golfshire-Villa-1.jpg",
    },
    {
      title: "Urban Skyscraper",
      image:
        "https://preview.redd.it/the-infamous-skyscraper-mansion-in-bengaluru-india-v0-ljn3urgwqxxc1.png?auto=webp&s=b691d445d72c605aaf9f98397ad0f3f680b2ab08",
    },
    {
      title: "Modern Office",
      image:
        "https://foyr.com/learn/wp-content/uploads/2021/08/modern-office-design.png",
    },
    {
      title: "Suburban Home",
      image:
        "https://cdn.alittledelightful.com/wp-content/uploads/2023/08/Latest-suburban-house.jpeg",
    },
  ];

  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white"
      id="portfolio"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 uppercase tracking-wide">
          Our <span className="text-neonBlue glow">Projects</span>
        </h2>

        {/* Grid Layout for Desktop, Scrollable Layout for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory px-2 pb-4 scrollbar-hide">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="relative bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden shadow-lg backdrop-blur-lg transform transition-all hover:scale-105 hover:shadow-neonBlue snap-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 sm:h-64 object-cover rounded-t-xl transition-opacity duration-300"
                loading="lazy"
              />

              {/* Overlay with Title */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300">
                <span className="text-lg font-semibold text-white opacity-0 hover:opacity-100 transition-all duration-300">
                  {project.title}
                </span>
              </div>

              {/* Title */}
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="max-w-full max-h-screen rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-red-600 transition"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
