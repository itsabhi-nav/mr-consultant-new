"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { MdCheckCircle, MdError } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Pencil, Edit3, Home } from "lucide-react";

function Notification({ message, type, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-xl text-white ${
          type === "success"
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-red-500 to-red-600"
        }`}
      >
        {type === "success" ? (
          <MdCheckCircle size={24} />
        ) : (
          <MdError size={24} />
        )}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold">
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBlogPanel() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPostIds, setDeletingPostIds] = useState([]);
  const [editId, setEditId] = useState(null);

  const initialFormState = {
    title: "",
    excerpt: "",
    content: "",
    category: "Real Estate",
    featured: false,
    authorName: "",
    authorBio: "",
    authorAvatar: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [file, setFile] = useState(null); // Cover image file
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  const BLOG_CATEGORIES = [
    "Land Development",
    "Real Estate",
    "Building Construction",
    "Interior Design",
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  async function fetchBlogPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Error fetching blog posts", error);
      showNotification("Error fetching blog posts", "error");
    } else {
      setBlogPosts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function uploadFileToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsUploading(true);

    let imageUrl = coverImagePreview;
    if (file) {
      try {
        imageUrl = await uploadFileToCloudinary(file);
      } catch (error) {
        console.error("Cover image upload failed:", error);
        showNotification("Cover image upload failed", "error");
        setIsUploading(false);
        return;
      }
    }

    let galleryUrls = existingGallery.filter(
      (url) => !removedGalleryImages.includes(url)
    );
    if (galleryFiles.length > 0) {
      try {
        const uploads = galleryFiles.map((f) => uploadFileToCloudinary(f));
        const newGalleryUrls = await Promise.all(uploads);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      } catch (error) {
        console.error("Gallery image upload failed:", error);
        showNotification("Gallery image upload failed", "error");
        setIsUploading(false);
        return;
      }
    }

    let avatarUrl =
      form.authorAvatar || avatarPreview || "https://via.placeholder.com/150";
    if (avatarFile) {
      try {
        avatarUrl = await uploadFileToCloudinary(avatarFile);
      } catch (error) {
        console.error("Author avatar upload failed:", error);
        showNotification("Author avatar upload failed", "error");
        setIsUploading(false);
        return;
      }
    }

    const postData = {
      title: form.title,
      slug: generateSlug(form.title),
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      isfeatured: form.featured,
      coverimage: imageUrl || "",
      gallery: galleryUrls,
      author: {
        name: form.authorName,
        bio: form.authorBio,
        avatar: avatarUrl,
      },
    };

    if (editId) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editId);
      if (error) {
        console.error("Error updating blog post:", error);
        showNotification("Error updating blog post", "error");
      } else {
        showNotification("Blog post updated successfully!", "success");
        resetForm();
        fetchBlogPosts();
      }
    } else {
      postData.likes = 0;
      const { error } = await supabase.from("blog_posts").insert([postData]);
      if (error) {
        console.error("Error inserting blog post:", error);
        showNotification("Error inserting blog post", "error");
      } else {
        showNotification("Blog post added successfully!", "success");
        resetForm();
        fetchBlogPosts();
      }
    }
    setIsUploading(false);
  }

  function resetForm() {
    setForm(initialFormState);
    setFile(null);
    setCoverImagePreview(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setRemovedGalleryImages([]);
    setEditId(null);
    setResetKey((prev) => prev + 1);
  }

  function handleEdit(post) {
    setEditId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featured: post.isfeatured,
      authorName: post.author?.name || "",
      authorBio: post.author?.bio || "",
      authorAvatar: post.author?.avatar || "",
    });
    setCoverImagePreview(post.coverimage || null);
    setAvatarPreview(post.author?.avatar || null);
    setExistingGallery(post.gallery || []);
    setGalleryPreviews(post.gallery || []);
    setGalleryFiles([]);
    setRemovedGalleryImages([]);
  }

  async function deleteBlogPost(post) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeletingPostIds((prev) => [...prev, post.id]);
    try {
      if (post.coverimage) {
        const res = await fetch("/api/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: post.coverimage }),
        });
        if (!res.ok) throw new Error("Failed to delete image from Cloudinary");
      }
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", post.id);
      if (error) throw error;
      showNotification("Blog post deleted successfully", "success");
      setBlogPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error("Error deleting blog post:", error);
      showNotification("Error deleting blog post", "error");
    }
    setDeletingPostIds((prev) => prev.filter((id) => id !== post.id));
  }

  function removeGalleryImage(url) {
    setRemovedGalleryImages((prev) => [...prev, url]);
    setGalleryPreviews((prev) => prev.filter((preview) => preview !== url));
    setExistingGallery((prev) => prev.filter((image) => image !== url));
  }

  return (
    <>
        {/* 👇 Meta tag to prevent indexing */}
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 bg-gradient-to-br from-gray-900 to-black text-white max-w-screen-lg"
      >
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-6">
          <Link href="/admin/projects" className="w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition-all duration-200">
              <Pencil size={18} />
              Edit Services
            </button>
          </Link>

          <Link href="/admin/blog" className="w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition-all duration-200">
              <Edit3 size={18} />
              Edit Blog Posts
            </button>
          </Link>

          <Link href="/admin/buy-sell" className="w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-cyan-500 text-white rounded-xl shadow hover:bg-cyan-600 transition-all duration-200">
              <Home size={18} />
              Edit New Property
            </button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:space-y-0 space-y-4 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neonBlue drop-shadow-lg">
            {editId ? "Edit Blog Post" : "Add Blog Post"}
          </h1>
          {editId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/5 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Blog Post Title"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Short excerpt of the blog post"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Content</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Full content of the blog post (HTML allowed)"
                  className="p-3 rounded bg-gray-800 text-white w-full h-40 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-neonBlue focus:ring-neonBlue"
                  />
                  <label className="font-semibold">Featured</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={form.authorName}
                    onChange={handleChange}
                    placeholder="Author Name"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Author Bio</label>
                  <input
                    type="text"
                    name="authorBio"
                    value={form.authorBio}
                    onChange={handleChange}
                    placeholder="Author Bio"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Author Avatar URL
                  </label>
                  <input
                    type="text"
                    name="authorAvatar"
                    value={form.authorAvatar}
                    onChange={handleChange}
                    placeholder="Optional: Enter avatar URL"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">
                    Upload Cover Image
                  </label>
                  <input
                    key={`cover-${resetKey}`}
                    type="file"
                    onChange={(e) => {
                      const selected = e.target.files[0];
                      setFile(selected);
                      setCoverImagePreview(
                        selected
                          ? URL.createObjectURL(selected)
                          : coverImagePreview
                      );
                    }}
                    className="block mt-2 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                  {coverImagePreview && (
                    <div className="mt-2">
                      <img
                        src={coverImagePreview}
                        alt="Cover Preview"
                        className="max-h-40 rounded shadow-md"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Upload Author Avatar
                  </label>
                  <input
                    key={`avatar-${resetKey}`}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setAvatarFile(file);
                      setAvatarPreview(
                        file ? URL.createObjectURL(file) : avatarPreview
                      );
                    }}
                    className="block mt-2 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                  {avatarPreview && (
                    <div className="mt-2">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="max-h-20 rounded-full shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Gallery Images
                </label>
                <input
                  key={`gallery-${resetKey}`}
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setGalleryFiles(files);
                    const previews = files.map((f) => URL.createObjectURL(f));
                    setGalleryPreviews([...galleryPreviews, ...previews]);
                  }}
                  className="block mt-2 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
                {galleryPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery Preview ${index + 1}`}
                          className="h-20 w-full object-cover rounded shadow-md"
                        />
                        {editId &&
                          existingGallery.includes(preview) &&
                          !removedGalleryImages.includes(preview) && (
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(preview)}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                            >
                              <span className="text-xs">×</span>
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className={`mt-6 w-full px-6 py-3 bg-neonBlue text-black font-bold rounded transition shadow-lg ${
                  isUploading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-neonBlue/80"
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black mr-2"></div>
                    {editId ? "Updating..." : "Uploading..."}
                  </div>
                ) : editId ? (
                  "Update Blog Post"
                ) : (
                  "Add Blog Post"
                )}
              </button>
            </form>
          </div>

          {/* Existing Blog Posts List */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">
              Existing Blog Posts
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <p className="text-gray-400">No blog posts found.</p>
            ) : (
              <ul className="space-y-4">
                {blogPosts.map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-white/10 rounded shadow-lg"
                  >
                    <span className="text-lg font-semibold truncate max-w-xs">
                      {post.title}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/blog/${post.slug}`}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBlogPost(post)}
                        disabled={deletingPostIds.includes(post.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-70"
                      >
                        {deletingPostIds.includes(post.id) ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
