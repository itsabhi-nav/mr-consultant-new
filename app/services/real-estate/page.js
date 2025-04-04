"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";

function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-neonBlue transition duration-300 flex flex-col min-h-[32rem]"
    >
      {/* Fixed-height container for the image */}
      <div className="w-full h-56 flex items-center justify-center bg-black">
        <img
          src={project.image}
          alt={project.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Text + Button container */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold mb-2 text-neonBlue">
          {project.title}
        </h3>

        {/* Limit description but allow full text accessibility */}
        <p className="text-gray-300 mb-4 flex-grow line-clamp-3 overflow-hidden relative after:absolute after:bottom-0 after:right-0 after:w-full after:h-6 after:bg-gradient-to-t after:from-gray-900 after:to-transparent">
          {project.description}
        </p>

        {/* Centered, improved button with balanced gradient */}
        <div className="mt-auto flex justify-center">
          <Link
            href={`/project/${project.id}`}
            className="px-4 py-1.5 bg-gradient-to-r from-pink-400 via-pink-500 to-blue-500 text-black font-semibold rounded-full hover:scale-105 transition shadow-lg shadow-pink-400/50 text-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function RealEstatePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects for service = real-estate
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("service", "real-estate");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.category || "others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {});

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center bg-fixed bg-center bg-cover px-4 min-h-[50vh] mt-12 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/real_estate.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full max-w-3xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-6xl font-extrabold text-gradient mb-2 md:mb-4"
          >
            Real Estate Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-2xl text-gray-300 mb-4 md:mb-6"
          >
            Redefining urban living with luxury and sustainable innovation.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="#current"
            className="px-6 py-2 md:px-8 md:py-4 bg-neonBlue text-black font-semibold rounded-full transition"
          >
            Explore Our Portfolio
          </motion.a>
        </div>
      </section>

      {/* FIXED TEXT SECTION */}
      <section className="py-6 md:py-10 bg-gray-900 text-white min-h-[35vh] md:min-h-[45vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-left">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-5 text-neonBlue">
            Our Vision in Real Estate
          </h2>
          <p className="text-sm md:text-lg text-gray-300 leading-snug md:leading-relaxed mb-3 md:mb-5">
            At <span className="text-white font-semibold">M R Consultants</span>
            , we redefine urban living by seamlessly integrating luxury,
            sustainability, and cutting-edge design. Our projects transform
            cityscapes into iconic landmarks worldwide.
          </p>
          <ul className="text-sm md:text-lg text-gray-300 space-y-1.5 md:space-y-3">
            <li className="flex items-start">
              ✅{" "}
              <span className="ml-2">
                <span className="font-semibold text-white">
                  Innovative Urban Architecture:
                </span>{" "}
                Designs that inspire and elevate cityscapes.
              </span>
            </li>
            <li className="flex items-start">
              ✅{" "}
              <span className="ml-2">
                <span className="font-semibold text-white">
                  Sustainable & Eco-Friendly:
                </span>{" "}
                Building for a greener tomorrow.
              </span>
            </li>
            <li className="flex items-start">
              ✅{" "}
              <span className="ml-2">
                <span className="font-semibold text-white">
                  Global Excellence:
                </span>{" "}
                World-class projects with international acclaim.
              </span>
            </li>
            <li className="flex items-start">
              ✅{" "}
              <span className="ml-2">
                <span className="font-semibold text-white">
                  Premium Spaces:
                </span>{" "}
                Exquisite residential and commercial developments.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* PROJECT SECTIONS */}
      {Object.entries(groupedProjects).map(([category, projectList]) => (
        <section key={category} id={category} className="py-20 bg-gray-800">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 capitalize">
              {category} Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectList.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CALL-TO-ACTION SECTION */}
      <section className="relative flex items-center justify-center bg-fixed bg-center bg-cover px-4 min-h-[50vh] md:min-h-[50vh] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/buildd.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center w-full max-w-3xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-5xl font-extrabold text-gradient mb-4"
          >
            Ready to Transform Your Space?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-xl text-gray-300 mb-6"
          >
            Connect with us to discuss how our innovative real estate solutions
            can elevate your property portfolio.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="/contact"
            className="px-6 py-2 md:px-8 md:py-4 bg-neonBlue text-black font-semibold rounded-full transition"
          >
            Contact Us Today
          </motion.a>
        </div>
      </section>
    </div>
  );
}
