"use client";

import { useState } from "react";

const categories = [
  "",
  "Land Development",
  "Real Estate",
  "Building Construction",
  "Interior Design",
];

export default function CategoryFilter({ onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState("");

  const handleClick = (cat) => {
    setActiveCategory(cat);
    onCategoryChange(cat);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat || "All"}
          onClick={() => handleClick(cat)}
          className={`px-3 py-1 rounded border transition ${
            activeCategory === cat
              ? "bg-neonBlue text-black"
              : "border-neonBlue hover:bg-neonBlue hover:text-black"
          }`}
        >
          {cat === "" ? "All" : cat}
        </button>
      ))}
    </div>
  );
}
