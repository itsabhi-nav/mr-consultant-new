"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "lib/supabaseClient";

export default function AdminBuySellPage() {
  const [properties, setProperties] = useState([]);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [propertytype, setPropertytype] = useState("");
  const [features, setFeatures] = useState("");
  const [agentname, setAgentname] = useState("");
  const [agentphone, setAgentphone] = useState("");
  const [agentemail, setAgentemail] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  // NEW: isLoading for showing a loader
  const [isLoading, setIsLoading] = useState(false);

  const fetchProperties = async () => {
    setIsLoading(true); // Start loading
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("id", { ascending: false });
      if (!error) setProperties(data || []);
      else console.error("Fetch error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      let mainImageUrl = mainImagePreview;
      if (mainImageFile) {
        const url = await uploadFileToCloudinary(mainImageFile);
        if (url) mainImageUrl = url;
        else {
          alert("Main image upload failed");
          return;
        }
      }

      let galleryUrls = existingGallery.filter(
        (url) => !removedGalleryImages.includes(url)
      );
      if (galleryFiles.length > 0) {
        const uploads = galleryFiles.map((f) => uploadFileToCloudinary(f));
        const newGalleryUrls = (await Promise.all(uploads)).filter(
          (url) => url
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      const payload = {
        slug,
        title,
        address,
        price,
        description,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        area,
        propertytype,
        features: features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        agentname,
        agentphone,
        agentemail,
        main_image: mainImageUrl
          ? { url: mainImageUrl, public_id: "" } // Placeholder public_id; update if needed
          : editingProperty?.main_image || null,
        gallery_images: galleryUrls.map((url) => ({ url, public_id: "" })), // Placeholder public_id
      };

      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingProperty.id);
        if (error) {
          alert("Error updating property: " + error.message);
        } else {
          alert("Property updated successfully!");
        }
      } else {
        const { error } = await supabase.from("properties").insert([payload]);
        if (error) {
          alert("Error adding property: " + error.message);
        } else {
          alert("Property added successfully!");
        }
      }
      fetchProperties();
      resetForm();
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setSlug(property.slug);
    setTitle(property.title);
    setAddress(property.address);
    setPrice(property.price);
    setDescription(property.description || "");
    setBedrooms(property.bedrooms ? property.bedrooms.toString() : "");
    setBathrooms(property.bathrooms ? property.bathrooms.toString() : "");
    setArea(property.area || "");
    setPropertytype(property.propertytype || "");
    setFeatures(property.features ? property.features.join(", ") : "");
    setAgentname(property.agentname || "");
    setAgentphone(property.agentphone || "");
    setAgentemail(property.agentemail || "");
    setMainImagePreview(property.main_image?.url || null);
    setExistingGallery(property.gallery_images?.map((img) => img.url) || []);
    setGalleryPreviews(property.gallery_images?.map((img) => img.url) || []);
    setGalleryFiles([]);
    setRemovedGalleryImages([]);
  };

  const resetForm = () => {
    setEditingProperty(null);
    setSlug("");
    setTitle("");
    setAddress("");
    setPrice("");
    setDescription("");
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setPropertytype("");
    setFeatures("");
    setAgentname("");
    setAgentphone("");
    setAgentemail("");
    setMainImageFile(null);
    setMainImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setRemovedGalleryImages([]);
    setResetKey((prev) => prev + 1);
  };

  const handleDelete = async (property) => {
    if (!confirm(`Delete property "${property.title}"?`)) return;

    setIsLoading(true); // Start loading
    try {
      const gallery = [];
      if (property.main_image?.url) gallery.push(property.main_image.url);
      if (property.gallery_images?.length > 0)
        gallery.push(...property.gallery_images.map((img) => img.url));

      if (gallery.length > 0) {
        await fetch("/api/delete-image/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gallery }),
        });
      }

      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);
      if (error) {
        alert("Error deleting property: " + error.message);
      } else {
        alert("Property deleted successfully!");
        fetchProperties();
        if (editingProperty?.id === property.id) resetForm();
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const removeGalleryImage = (url) => {
    setRemovedGalleryImages((prev) => [...prev, url]);
    setGalleryPreviews((prev) => prev.filter((preview) => preview !== url));
    setExistingGallery((prev) => prev.filter((image) => image !== url));
  };

  return (
    <motion.div
      className="relative min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Manage Buy/Sell Properties</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl mb-4">
          {editingProperty
            ? `Edit Property: ${editingProperty.title}`
            : "Add New Property"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="mb-1">Slug (unique)</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Title</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Address</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Price</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Property Type</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              placeholder="Apartment, Villa, etc."
              value={propertytype}
              onChange={(e) => setPropertytype(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Bedrooms</label>
            <input
              type="number"
              className="p-2 rounded bg-gray-700"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Bathrooms</label>
            <input
              type="number"
              className="p-2 rounded bg-gray-700"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Area (sqft)</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1">Features (comma separated)</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              placeholder="Pool, Garden, Garage, etc."
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1">Description</label>
            <textarea
              className="p-2 rounded bg-gray-700"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Agent Name</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={agentname}
              onChange={(e) => setAgentname(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Agent Phone</label>
            <input
              type="text"
              className="p-2 rounded bg-gray-700"
              value={agentphone}
              onChange={(e) => setAgentphone(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1">Agent Email</label>
            <input
              type="email"
              className="p-2 rounded bg-gray-700"
              value={agentemail}
              onChange={(e) => setAgentemail(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1">
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
                setMainImagePreview(file ? URL.createObjectURL(file) : null);
              }}
              className="p-2 rounded bg-gray-700"
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
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1">
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
              className="p-2 rounded bg-gray-700"
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
          <div className="md:col-span-2 flex justify-end gap-2">
            {editingProperty && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 transition"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              {editingProperty ? "Update Property" : "Add Property"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Existing Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Agent</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{prop.slug}</td>
                  <td className="px-4 py-2">{prop.title}</td>
                  <td className="px-4 py-2">{prop.price}</td>
                  <td className="px-4 py-2">{prop.address}</td>
                  <td className="px-4 py-2">{prop.propertytype}</td>
                  <td className="px-4 py-2">{prop.agentname}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(prop)}
                      className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prop)}
                      className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
