"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lightbox (optional)
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("Error fetching project:", error);
      else setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  // Convert key_features to array
  const keyFeatures = project.key_features
    ? project.key_features.split("\n")
    : [];

  // Lightbox Handlers (optional)
  const openModal = (imgUrl) => {
    setActiveImage(imgUrl);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setActiveImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[60vh] md:min-h-[80vh]">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-hero-radial from-[#050505] via-[#0c0f1f] to-[#000000] opacity-90" />

        {/* Floating Orbs - Responsive Sizes */}
        <motion.div
          className="absolute w-24 h-24 md:w-40 md:h-40 bg-neonBlue rounded-full opacity-30 blur-xl"
          initial={{ x: "-50%", y: "50%" }}
          animate={{ x: ["-40%", "-60%", "-40%"], y: ["40%", "60%", "40%"] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute w-20 h-20 md:w-32 md:h-32 bg-neonPink rounded-full opacity-30 blur-xl"
          initial={{ x: "40%", y: "-50%" }}
          animate={{ x: ["30%", "50%", "30%"], y: ["-40%", "-60%", "-40%"] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-[600px] mx-auto"
        >
          {/* Glass Card with Responsive Padding */}
          <div className="bg-white/10 backdrop-blur-md rounded-md p-6 md:p-8 shadow-md w-full">
            <h1 className="text-3xl md:text-6xl font-extrabold bg-gradient-to-r from-neonPink to-neonBlue bg-clip-text text-transparent mb-3 md:mb-4">
              {project.title}
            </h1>
            <p className="text-sm md:text-lg text-gray-200 mb-4 md:mb-6">
              A glimpse into our futuristic design and innovative solutions.
            </p>
            <a
              href="#project-overview"
              className="inline-block px-5 py-2 md:px-6 md:py-3 bg-gradient-to-r from-neonPink to-neonBlue text-black font-semibold rounded-full hover:opacity-90 transition"
            >
              Explore Project
            </a>
          </div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full rotate-180 overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[80px]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#0c0f1f"
              fillOpacity="1"
              d="M0,224L80,186.7C160,149,320,75,480,64C640,53,800,107,960,138.7C1120,171,1280,181,1360,186.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* PROJECT OVERVIEW */}
      <section id="project-overview" className="pt-12 pb-16 px-6 bg-[#0c0f1f]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-neonBlue"
          >
            Project Overview
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-300 mb-8"
          >
            {project.overview}
          </motion.p>

          <ul className="list-disc list-inside text-base md:text-lg text-gray-300 space-y-3">
            <li>
              <span className="font-semibold">Location:</span>{" "}
              {project.location}
            </li>
            <li>
              <span className="font-semibold">Year Completed:</span>{" "}
              {project.year_completed}
            </li>
            <li>
              <span className="font-semibold">Project Type:</span>{" "}
              {project.project_type}
            </li>
            <li>
              <span className="font-semibold">Key Features:</span>
              <ul className="ml-4 mt-2 space-y-1">
                {keyFeatures.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-neonPink">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {project.gallery?.map((imgUrl, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal(imgUrl)} // if using the lightbox
              >
                <div className="w-full h-64 flex items-center justify-center bg-black">
                  <img
                    src={imgUrl}
                    alt={`Project Image ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL-TO-ACTION */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-neonPink to-neonBlue bg-clip-text text-transparent">
            Interested in This Project?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Contact us to learn more about our work and how we can help bring
            your vision to life.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gradient-to-r from-neonPink to-neonBlue text-black font-semibold rounded-full hover:opacity-90 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Lightbox Modal (optional) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl font-bold"
              >
                &times;
              </button>
              <img
                src={activeImage}
                alt="Enlarged Project"
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
