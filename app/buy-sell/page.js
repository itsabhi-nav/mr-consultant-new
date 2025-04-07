"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "lib/supabaseClient";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function BuySellPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const allLocations = [
    "All",
    ...new Set(properties.map((p) => p.address.split(",")[0] || "Unknown")),
  ];
  const allTypes = [
    "All",
    ...new Set(properties.map((p) => p.propertytype || "Other")),
  ];

  const filtered = properties
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (p) =>
        selectedLocation === "All" ||
        p.address.split(",")[0] === selectedLocation
    )
    .filter((p) => selectedType === "All" || p.propertytype === selectedType)
    .sort((a, b) => {
      if (sortOrder === "priceLow")
        return (
          parseFloat(a.price.replace(/[^0-9.-]+/g, "")) -
          parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
        );
      if (sortOrder === "priceHigh")
        return (
          parseFloat(b.price.replace(/[^0-9.-]+/g, "")) -
          parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
        );
      return b.id - a.id;
    });

  return (
    <div className="mt-[20px]">
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-800 p-8 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          {/* Spacing added to push content downward */}
          <div className="mt-16 flex justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-lg"
            >
              Explore Properties 🏘️
            </motion.h1>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="px-4 py-3 rounded-xl shadow border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 rounded-xl shadow border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl shadow border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 rounded-xl shadow border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/30 rounded-2xl p-6 shadow-md h-80"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-300 text-lg">
              No properties found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((prop) => (
                <motion.div
                  key={prop.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white/20 rounded-2xl shadow-xl overflow-hidden border border-white/10"
                >
                  {prop.main_image?.url ? (
                    <img
                      src={prop.main_image.url}
                      alt={prop.title}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-600 flex items-center justify-center text-white">
                      No Image
                    </div>
                  )}
                  <div className="p-5 text-white">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-2xl font-bold">{prop.title}</h2>
                      <span className="bg-blue-200 text-sm px-2 py-1 rounded-full">
                        {prop.propertytype || "Property"}
                      </span>
                    </div>
                    <p className="mb-2">{prop.address}</p>
                    <p className="text-xl font-semibold text-green-400 mb-4">
                      {prop.price}
                    </p>
                    <Link
                      href={`/buy-sell/${prop.slug}`}
                      className="inline-block bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <Link
            href="/admin/buy-sell"
            className="fixed bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all z-50"
            aria-label="Add New Listing"
          >
            <Plus size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}
