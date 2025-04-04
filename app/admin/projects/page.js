"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FaTrashAlt } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SERVICES = [
  { label: "Real Estate", value: "real-estate" },
  { label: "Building Construction", value: "building-construction" },
  { label: "Land Development", value: "land-development" },
  { label: "Home Interior Design", value: "home-interior-design" },
];

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

export default function AdminProjectsPage() {
  const [service, setService] = useState("real-estate");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingProjectIds, setDeletingProjectIds] = useState([]);

  // State for adding a new project
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "current",
    overview: "",
    details: "",
    hero_image: "",
    location: "",
    year_completed: "",
    project_type: "",
    key_features: "",
  });
  const [file, setFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  // State for editing an existing project
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "current",
    overview: "",
    details: "",
    hero_image: "",
    location: "",
    year_completed: "",
    project_type: "",
    key_features: "",
  });
  const [editFile, setEditFile] = useState(null);
  const [editMainImagePreview, setEditMainImagePreview] = useState(null);
  const [editGalleryFiles, setEditGalleryFiles] = useState([]);
  const [editGalleryPreviews, setEditGalleryPreviews] = useState([]);

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category || "others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(project);
    return acc;
  }, {});

  // Fetch projects when service changes
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("service", service);
      if (error) {
        console.error("Error fetching projects", error);
        showNotification("Error fetching projects", "error");
      } else {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, [service]);

  // Pre-fill edit form when a project is selected for editing
  useEffect(() => {
    if (editingProject) {
      setEditForm({
        title: editingProject.title || "",
        description: editingProject.description || "",
        category: editingProject.category || "current",
        overview: editingProject.overview || "",
        details: editingProject.details || "",
        hero_image: editingProject.hero_image || "",
        location: editingProject.location || "",
        year_completed: editingProject.year_completed || "",
        project_type: editingProject.project_type || "",
        key_features: editingProject.key_features || "",
      });
      setEditFile(null);
      setEditMainImagePreview(editingProject.image || null);
      setEditGalleryFiles([]);
      setEditGalleryPreviews(editingProject.gallery || []);
    }
  }, [editingProject]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
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

    let imageUrl = "";
    if (file) {
      try {
        imageUrl = await uploadFileToCloudinary(file);
      } catch (error) {
        console.error("Main image upload failed:", error);
        showNotification("Main image upload failed", "error");
        setIsUploading(false);
        return;
      }
    }

    let galleryUrls = [];
    for (const gf of galleryFiles) {
      if (gf) {
        try {
          const url = await uploadFileToCloudinary(gf);
          galleryUrls.push(url);
        } catch (error) {
          console.error("Gallery image upload failed:", error);
          showNotification("Gallery image upload failed", "error");
        }
      }
    }

    const newProject = {
      service,
      title: form.title,
      description: form.description,
      category: form.category,
      overview: form.overview,
      details: form.details,
      hero_image: form.hero_image,
      image: imageUrl,
      gallery: galleryUrls,
      location: form.location,
      year_completed: form.year_completed,
      project_type: form.project_type,
      key_features: form.key_features,
    };

    const { error } = await supabase.from("projects").insert([newProject]);
    if (error) {
      console.error("Error inserting project:", error);
      showNotification("Error inserting project", "error");
    } else {
      showNotification("Project added successfully!", "success");
      setForm({
        title: "",
        description: "",
        category: "current",
        overview: "",
        details: "",
        hero_image: "",
        location: "",
        year_completed: "",
        project_type: "",
        key_features: "",
      });
      setFile(null);
      setMainImagePreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setResetKey((prev) => prev + 1);
      // Refresh projects list
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("service", service);
      if (error) {
        console.error("Error fetching projects", error);
        showNotification("Error fetching projects", "error");
      } else {
        setProjects(data);
      }
    }
    setIsUploading(false);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    // Upload main image if updated
    let newImageUrl = editMainImagePreview;
    if (editFile) {
      try {
        newImageUrl = await uploadFileToCloudinary(editFile);
      } catch (error) {
        console.error("Main image upload failed:", error);
        showNotification("Main image upload failed", "error");
        return;
      }
    }
    // Upload new gallery images if any
    let newGalleryUrls = editGalleryPreviews;
    if (editGalleryFiles.length > 0) {
      newGalleryUrls = [];
      for (const gf of editGalleryFiles) {
        try {
          const url = await uploadFileToCloudinary(gf);
          newGalleryUrls.push(url);
        } catch (error) {
          console.error("Gallery image upload failed:", error);
          showNotification("Gallery image upload failed", "error");
        }
      }
    }
    const updatedProject = {
      ...editForm,
      image: newImageUrl,
      gallery: newGalleryUrls,
    };
    // Update with returning option
    const { error, data } = await supabase
      .from("projects")
      .update(updatedProject, { returning: "representation" })
      .eq("id", editingProject.id);
    if ((error && error.message) || !data || data.length === 0) {
      console.error("Error updating project:", error, data);
      showNotification("Error updating project", "error");
    } else {
      showNotification("Project updated successfully!", "success");
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? data[0] : p))
      );
      setEditingProject(null);
    }
  }

  async function deleteProject(project) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingProjectIds((prev) => [...prev, project.id]);
    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: project.image,
          gallery: project.gallery || [],
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete images from Cloudinary");
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
      showNotification("Error deleting images from Cloudinary", "error");
      setDeletingProjectIds((prev) => prev.filter((id) => id !== project.id));
      return;
    }
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (error) {
      console.error("Error deleting project:", error);
      showNotification("Error deleting project", "error");
    } else {
      showNotification("Project deleted successfully", "success");
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    }
    setDeletingProjectIds((prev) => prev.filter((id) => id !== project.id));
  }

  const handleGalleryDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...previews]);
    }
  }, []);

  const handleGalleryDragOver = (e) => {
    e.preventDefault();
  };

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
        {/* Navigation Links */}
        <div className="flex justify-end mb-6">
          <Link href="/admin/projects">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4">
              Edit Services
            </button>
          </Link>
          <Link href="/admin/blog">
            <button className="px-4 py-2 bg-neonBlue text-black rounded hover:bg-neonBlue/80 transition">
              Edit Blog Posts
            </button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:space-y-0 space-y-4 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neonBlue drop-shadow-lg">
            Admin Projects
          </h1>
        </div>
        <p className="mb-4 text-lg lg:text-xl">
          Select the service you want to edit:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 lg:mb-12">
          {SERVICES.map((s) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              key={s.value}
              onClick={() => setService(s.value)}
              className={`px-4 py-2 rounded backdrop-blur-md bg-white/10 transition text-center ${
                service === s.value
                  ? "bg-neonBlue text-black font-bold shadow-lg"
                  : "bg-gray-800 hover:bg-neonBlue hover:text-black"
              }`}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">
          Editing {SERVICES.find((s) => s.value === service)?.label} Projects
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section for Adding New Projects */}
          <div className="bg-white/5 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Project Title"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  >
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short Description"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    name="hero_image"
                    value={form.hero_image}
                    onChange={handleChange}
                    placeholder="Hero Image URL (optional)"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    name="year_completed"
                    value={form.year_completed}
                    onChange={handleChange}
                    placeholder="Year Completed"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Project Type
                  </label>
                  <input
                    type="text"
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    placeholder="Residential, Commercial, Mixed-use, etc."
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Key Features
                  </label>
                  <textarea
                    name="key_features"
                    value={form.key_features}
                    onChange={handleChange}
                    placeholder="Key Features (each point on a new line)"
                    className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Project Overview
                </label>
                <textarea
                  name="overview"
                  value={form.overview}
                  onChange={handleChange}
                  placeholder="Project Overview"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Project Details
                </label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Project Details (each point on a new line)"
                  className="p-3 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Main Image Upload
                </label>
                <input
                  key={resetKey}
                  type="file"
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    setFile(selected);
                    setMainImagePreview(
                      selected ? URL.createObjectURL(selected) : null
                    );
                  }}
                  className="block mt-2 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
                {mainImagePreview && (
                  <div className="mt-2">
                    <img
                      src={mainImagePreview}
                      alt="Main Preview"
                      className="max-h-40 rounded shadow-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Gallery Images Upload
                </label>
                <div
                  onDrop={handleGalleryDrop}
                  onDragOver={handleGalleryDragOver}
                  className="border-dashed border-2 border-gray-700 p-4 rounded text-center text-gray-400 mb-2"
                >
                  Drag & drop images here, or use the file selector below.
                </div>
                <input
                  key={resetKey}
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setGalleryFiles((prev) => [...prev, ...files]);
                    const previews = files.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setGalleryPreviews((prev) => [...prev, ...previews]);
                  }}
                  className="block mb-4 text-white bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
                />
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery Preview ${index + 1}`}
                          className="h-20 w-full object-cover rounded shadow-md"
                        />
                        <button
                          onClick={() => {
                            setGalleryFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setGalleryPreviews((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                        >
                          <FaTrashAlt size={12} />
                        </button>
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
                    Uploading...
                  </div>
                ) : (
                  "Add Project"
                )}
              </button>
            </form>
          </div>
          {/* Existing Projects List */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
              </div>
            ) : (
              Object.entries(groupedProjects).map(([category, projectList]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-bold capitalize mb-4">
                    {category} Projects
                  </h3>
                  <ul className="space-y-4">
                    {projectList.map((project) => (
                      <li
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-white/10 rounded shadow-lg"
                      >
                        <span className="text-lg font-semibold">
                          {project.title}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/project/${project.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Learn More
                          </Link>
                          <button
                            onClick={() => setEditingProject(project)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProject(project)}
                            disabled={deletingProjectIds.includes(project.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-70"
                          >
                            {deletingProjectIds.includes(project.id) ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white text-black p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="current">Current</option>
                      <option value="completed">Completed</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Short Description</label>
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Hero Image URL</label>
                  <input
                    type="text"
                    name="hero_image"
                    value={editForm.hero_image}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Year Completed</label>
                  <input
                    type="text"
                    name="year_completed"
                    value={editForm.year_completed}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Project Type</label>
                  <input
                    type="text"
                    name="project_type"
                    value={editForm.project_type}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    Key Features (each point on a new line)
                  </label>
                  <textarea
                    name="key_features"
                    value={editForm.key_features}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Project Overview</label>
                  <textarea
                    name="overview"
                    value={editForm.overview}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Project Details</label>
                  <textarea
                    name="details"
                    value={editForm.details}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Main Image Upload</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const selected = e.target.files[0];
                      setEditFile(selected);
                      setEditMainImagePreview(
                        selected
                          ? URL.createObjectURL(selected)
                          : editMainImagePreview
                      );
                    }}
                    className="w-full"
                  />
                  {editMainImagePreview && (
                    <div className="mt-2">
                      <img
                        src={editMainImagePreview}
                        alt="Main Preview"
                        className="max-h-40 rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Gallery Images Upload</label>
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      if (files.length) {
                        setEditGalleryFiles((prev) => [...prev, ...files]);
                        const previews = files.map((file) =>
                          URL.createObjectURL(file)
                        );
                        setEditGalleryPreviews((prev) => [
                          ...prev,
                          ...previews,
                        ]);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-dashed border-2 border-gray-300 p-4 rounded text-center mb-2"
                  >
                    Drag & drop images here, or use the file selector below.
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setEditGalleryFiles((prev) => [...prev, ...files]);
                      const previews = files.map((file) =>
                        URL.createObjectURL(file)
                      );
                      setEditGalleryPreviews((prev) => [...prev, ...previews]);
                    }}
                    className="w-full"
                  />
                  {editGalleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {editGalleryPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Gallery Preview ${index + 1}`}
                            className="h-20 w-full object-cover rounded"
                          />
                          <button
                            onClick={() => {
                              setEditGalleryFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              setEditGalleryPreviews((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
