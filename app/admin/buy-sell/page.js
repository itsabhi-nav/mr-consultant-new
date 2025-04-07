"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { MdCheckCircle, MdError } from "react-icons/md";
import { Pencil, Edit3, Home } from "lucide-react";

// ---------------- Notification Component ----------------
function Notification({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="notification"
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
      )}
    </AnimatePresence>
  );
}

// ---------------- Slug Generator (optional) ----------------
// If you want to auto-generate slugs from the title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------- Main AdminBuySellPanel Component ----------------
export default function AdminBuySellPanel() {
  // ---------------- State ----------------
  const [properties, setProperties] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form state
  const initialForm = {
    slug: "",
    title: "",
    address: "",
    price: "",
    propertytype: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: "", // Comma-separated
    description: "",
    agentname: "",
    agentphone: "",
    agentemail: "",
  };
  const [form, setForm] = useState(initialForm);

  // Main Image
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  // Gallery
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]); // URLs for existing gallery
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);

  const [resetKey, setResetKey] = useState(0);

  // ---------------- Effects ----------------
  useEffect(() => {
    fetchProperties();
  }, []);

  // ---------------- Notifications ----------------
  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  // ---------------- Supabase Data Fetch ----------------
  async function fetchProperties() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("id", { ascending: false });
      if (error) {
        console.error("Error fetching properties:", error);
        showNotification("Error fetching properties", "error");
      } else {
        setProperties(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // ---------------- Form Handlers ----------------
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ---------------- File Uploads (Cloudinary) ----------------
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

  // ---------------- Submit ----------------
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1) Upload main image if new
      let mainImageUrl = mainImagePreview;
      if (mainImageFile) {
        try {
          mainImageUrl = await uploadFileToCloudinary(mainImageFile);
        } catch (error) {
          console.error("Main image upload failed:", error);
          showNotification("Main image upload failed", "error");
          setIsLoading(false);
          return;
        }
      }

      // 2) Gallery
      let galleryUrls = existingGallery.filter(
        (url) => !removedGalleryImages.includes(url)
      );
      if (galleryFiles.length > 0) {
        try {
          const uploads = galleryFiles.map((f) => uploadFileToCloudinary(f));
          const newGalleryUrls = await Promise.all(uploads);
          galleryUrls = [...galleryUrls, ...newGalleryUrls];
        } catch (error) {
          console.error("Gallery upload failed:", error);
          showNotification("Gallery upload failed", "error");
          setIsLoading(false);
          return;
        }
      }

      // 3) Prepare payload
      const payload = {
        slug: form.slug || generateSlug(form.title),
        title: form.title,
        address: form.address,
        price: form.price,
        description: form.description,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        area: form.area,
        propertytype: form.propertytype,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        agentname: form.agentname,
        agentphone: form.agentphone,
        agentemail: form.agentemail,
        main_image: mainImageUrl
          ? { url: mainImageUrl, public_id: "" }
          : editingProperty?.main_image || null,
        gallery_images: galleryUrls.map((url) => ({ url, public_id: "" })),
      };

      // 4) Insert or Update
      if (editingProperty) {
        // Update
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingProperty.id);
        if (error) {
          console.error("Error updating property:", error);
          showNotification("Error updating property", "error");
        } else {
          showNotification("Property updated successfully!", "success");
          resetForm();
          fetchProperties();
        }
      } else {
        // Insert
        const { error } = await supabase.from("properties").insert([payload]);
        if (error) {
          console.error("Error adding property:", error);
          showNotification("Error adding property", "error");
        } else {
          showNotification("Property added successfully!", "success");
          resetForm();
          fetchProperties();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  // ---------------- Edit ----------------
  function handleEdit(prop) {
    setEditingProperty(prop);
    setForm({
      slug: prop.slug,
      title: prop.title,
      address: prop.address,
      price: prop.price,
      propertytype: prop.propertytype || "",
      bedrooms: prop.bedrooms ? prop.bedrooms.toString() : "",
      bathrooms: prop.bathrooms ? prop.bathrooms.toString() : "",
      area: prop.area || "",
      features: prop.features ? prop.features.join(", ") : "",
      description: prop.description || "",
      agentname: prop.agentname || "",
      agentphone: prop.agentphone || "",
      agentemail: prop.agentemail || "",
    });
    setMainImagePreview(prop.main_image?.url || null);
    setExistingGallery(prop.gallery_images?.map((img) => img.url) || []);
    setGalleryPreviews(prop.gallery_images?.map((img) => img.url) || []);
    setGalleryFiles([]);
    setRemovedGalleryImages([]);
  }

  // ---------------- Delete ----------------
  async function handleDelete(prop) {
    if (!confirm(`Are you sure you want to delete "${prop.title}"?`)) return;
    setDeletingIds((prev) => [...prev, prop.id]);
    try {
      // (Optional) Delete images from Cloudinary if needed
      // e.g., if you have an API route that handles Cloudinary deletions

      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", prop.id);
      if (error) {
        console.error("Error deleting property:", error);
        showNotification("Error deleting property", "error");
      } else {
        showNotification("Property deleted successfully!", "success");
        setProperties((prev) => prev.filter((p) => p.id !== prop.id));
        if (editingProperty?.id === prop.id) resetForm();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      showNotification("Error deleting property", "error");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== prop.id));
    }
  }

  // ---------------- Remove Gallery Image ----------------
  function removeGalleryImage(url) {
    setRemovedGalleryImages((prev) => [...prev, url]);
    setGalleryPreviews((prev) => prev.filter((preview) => preview !== url));
    setExistingGallery((prev) => prev.filter((imgUrl) => imgUrl !== url));
  }

  // ---------------- Reset Form ----------------
  function resetForm() {
    setEditingProperty(null);
    setForm(initialForm);
    setMainImageFile(null);
    setMainImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setRemovedGalleryImages([]);
    setResetKey((prev) => prev + 1);
  }

  // ---------------- Render ----------------
  return (
    <>
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
        {/* Top Navigation (similar to blog) */}
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

        {/* Heading + Cancel Edit (if editing) */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:space-y-0 space-y-4 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neonBlue drop-shadow-lg">
            {editingProperty ? "Edit Property" : "Add New Property"}
          </h1>
          {editingProperty && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ------ LEFT: Form ------ */}
          <div className="bg-white/5 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Slug */}
              <div>
                <label className="block mb-2 font-semibold">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Unique slug (or auto-generated)"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Property Title"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  required
                />
              </div>

              {/* Address & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Property Address"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
              </div>

              {/* Property Type, Bedrooms, Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">
                    Property Type
                  </label>
                  <input
                    type="text"
                    name="propertytype"
                    value={form.propertytype}
                    onChange={handleChange}
                    placeholder="Apartment, Villa, etc."
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block mb-2 font-semibold">Area (sqft)</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block mb-2 font-semibold">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  placeholder="Pool, Garage, Gym, etc."
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description or detailed info"
                  className="p-3 rounded bg-gray-800 text-white w-full h-24 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
              </div>

              {/* Agent Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">Agent Name</label>
                  <input
                    type="text"
                    name="agentname"
                    value={form.agentname}
                    onChange={handleChange}
                    placeholder="Agent Name"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Agent Phone
                  </label>
                  <input
                    type="text"
                    name="agentphone"
                    value={form.agentphone}
                    onChange={handleChange}
                    placeholder="e.g. +1-555-555-1234"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Agent Email
                  </label>
                  <input
                    type="email"
                    name="agentemail"
                    value={form.agentemail}
                    onChange={handleChange}
                    placeholder="agent@example.com"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block mb-2 font-semibold">
                  {editingProperty
                    ? "Upload New Main Image (optional)"
                    : "Upload Main Image"}
                </label>
                <input
                  key={`main-${resetKey}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setMainImageFile(file);
                    setMainImagePreview(
                      file ? URL.createObjectURL(file) : null
                    );
                  }}
                  className="block mt-2 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
                {mainImagePreview && (
                  <div className="mt-2">
                    <img
                      src={mainImagePreview}
                      alt="Main Image Preview"
                      className="max-h-40 rounded shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Gallery Upload */}
              <div>
                <label className="block mb-2 font-semibold">
                  {editingProperty
                    ? "Upload New Gallery Images (optional)"
                    : "Upload Gallery Images"}
                </label>
                <input
                  key={`gallery-${resetKey}`}
                  type="file"
                  multiple
                  accept="image/*"
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
                        {/* Only show "Remove" button if it's an existing image in edit mode */}
                        {editingProperty &&
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

              {/* Submit Button */}
              <button
                type="submit"
                className={`mt-6 w-full px-6 py-3 bg-neonBlue text-black font-bold rounded transition shadow-lg ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-neonBlue/80"
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? editingProperty
                    ? "Updating..."
                    : "Uploading..."
                  : editingProperty
                  ? "Update Property"
                  : "Add Property"}
              </button>
            </form>
          </div>

          {/* ------ RIGHT: Existing Properties ------ */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">
              Existing Properties
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
              </div>
            ) : properties.length === 0 ? (
              <p className="text-gray-400">No properties found.</p>
            ) : (
              <ul className="space-y-4">
                {properties.map((prop) => (
                  <li
                    key={prop.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/10 rounded shadow-lg"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="text-lg font-semibold truncate max-w-xs">
                        {prop.title}
                      </div>
                      <div className="text-sm text-gray-300">
                        Slug: {prop.slug}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(prop)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prop)}
                        disabled={deletingIds.includes(prop.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-70"
                      >
                        {deletingIds.includes(prop.id) ? (
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
