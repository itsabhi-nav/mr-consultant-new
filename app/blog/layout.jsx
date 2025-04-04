"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-black bg-opacity-70 backdrop-blur-md py-4 px-6 flex items-center justify-between shadow-xl"
      >
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-widest text-neonBlue hover:text-neonPink transition duration-300 cursor-pointer">
            M R Blog
          </h1>
        </Link>
        <Link
          href="/"
          className="border border-neonBlue px-3 py-1 rounded hover:bg-neonBlue hover:text-black transition duration-300"
        >
          Back to Home
        </Link>
      </motion.header>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
