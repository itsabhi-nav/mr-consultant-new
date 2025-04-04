"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center h-[350px] sm:h-[450px] md:h-[550px] bg-gradient-to-tr from-[#0a192f] via-[#102a43] to-[#1e3a8a] overflow-hidden rounded-2xl shadow-2xl px-6 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="px-6 sm:px-12"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight sm:leading-snug tracking-tight">
          Welcome to <span className="text-blue-400">M R Blogs</span>
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
          Elevate your living experience with our visionary real estate,
          construction, and interior design services.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 flex flex-col sm:flex-row gap-4"
      >
        <Link href="/#services" passHref>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-medium hover:bg-blue-600 transition">
            Explore Our Services
          </button>
        </Link>
        <button className="px-6 py-3 bg-transparent border border-white text-white rounded-full text-lg font-medium hover:bg-white hover:text-black transition">
          Download Brochure
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.2 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-10 left-10 w-24 h-24 bg-blue-500 opacity-30 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.3 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 right-10 w-28 h-28 bg-indigo-500 opacity-30 blur-3xl rounded-full"
      />
    </section>
  );
}
