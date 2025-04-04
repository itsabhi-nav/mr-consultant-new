"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function RelatedPosts({ currentPostId, category }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function fetchRelated() {
      let query = supabase
        .from("blog_posts")
        .select("id, slug, title")
        .neq("id", currentPostId)
        .limit(3);
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching related posts:", error);
      } else {
        setRelated(data);
      }
    }
    if (currentPostId) {
      fetchRelated();
    }
  }, [currentPostId, category]);

  if (!related.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">You May Also Like</h3>
      <div className="flex flex-col gap-3">
        {related.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="text-neonBlue hover:underline"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
