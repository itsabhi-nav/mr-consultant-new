"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function BlogSidebar() {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    async function fetchPopularPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title")
        .order("likes", { ascending: false })
        .limit(3);
      if (error) {
        console.error("Error fetching popular posts:", error);
      } else {
        setPopularPosts(data);
      }
    }
    fetchPopularPosts();
  }, []);

  return (
    <aside className="bg-black bg-opacity-50 p-6 rounded-xl sticky top-24 space-y-6">
      {/* Popular Posts */}
      <div>
        <h3 className="text-xl font-bold mb-4">Popular Posts</h3>
        <ul className="space-y-2 text-neonBlue">
          {popularPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Subscribe</h3>
        <p className="text-sm opacity-80">
          Get the latest updates and insights directly to your inbox.
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-3 py-2 bg-black bg-opacity-40 border border-neonBlue rounded-l focus:outline-none"
          />
          <button className="bg-neonBlue text-black px-3 py-2 rounded-r hover:opacity-80 transition">
            Join
          </button>
        </div>
      </div>
    </aside>
  );
}
