"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

import BlogHero from "./components/BlogHero";
import FeaturedPost from "./components/FeaturedPost";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import BlogCard from "./components/BlogCard";
import Pagination from "./components/Pagination";
import BlogSidebar from "./components/BlogSidebar";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("id", { ascending: false });
      if (error) {
        console.error("Error fetching blog posts", error);
      } else {
        const transformed = data.map((p) => ({
          ...p,
          coverImage: p.coverimage,
          isFeatured: p.isfeatured,
          date: new Date(p.created_at).toLocaleDateString(),
        }));
        setPosts(transformed);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const featuredPost = posts.find((post) => post.isFeatured);

  const filteredPosts = posts.filter((post) => {
    if (post.isFeatured) return false;
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      post.category.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handleSearch = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      <BlogHero />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <SearchBar onSearch={handleSearch} />
            <CategoryFilter onCategoryChange={handleCategoryChange} />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {displayedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
