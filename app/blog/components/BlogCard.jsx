"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogCard({ post }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black bg-opacity-50 rounded-xl overflow-hidden shadow-lg group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="cursor-pointer">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm opacity-80 line-clamp-2">{post.excerpt}</p>
            <p className="text-xs mt-2 opacity-50">Category: {post.category}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
