"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturedPost({ post }) {
  return (
    <motion.div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-10 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-full object-cover brightness-75"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
        <h3 className="text-3xl sm:text-5xl font-bold text-white mb-4 glow">
          {post.title}
        </h3>
        <p className="max-w-2xl mx-auto text-white text-sm sm:text-lg mb-4">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="bg-neonBlue text-black px-4 py-2 rounded hover:opacity-80 transition"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  );
}
