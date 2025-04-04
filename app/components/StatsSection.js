"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { label: "Projects", value: 100 },
    { label: "Countries", value: 50 },
    { label: "Clients", value: 500 },
    { label: "Awards", value: 20 },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, idx) =>
      setInterval(() => {
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          if (newCounts[idx] < stat.value) {
            newCounts[idx] += Math.ceil(stat.value / 50);
          } else {
            newCounts[idx] = stat.value;
            clearInterval(intervals[idx]);
          }
          return newCounts;
        });
      }, 50)
    );

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-8 uppercase tracking-wide">
          Our <span className="text-neonBlue glow">Achievements</span>
        </h2>

        {/* Stats Grid - Compact Layout on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center bg-gray-800/40 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg backdrop-blur-md transform transition-all hover:scale-105 hover:shadow-neonBlue"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              {/* Animated Counter */}
              <span className="text-4xl sm:text-5xl font-extrabold text-neonBlue">
                {counts[idx]}+
              </span>
              <span className="mt-1 sm:mt-2 text-sm sm:text-lg text-gray-300">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
