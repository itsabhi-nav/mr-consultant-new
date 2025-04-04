"use client";

export default function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search posts..."
      className="flex-1 bg-black bg-opacity-40 border border-neonBlue rounded px-4 py-2 focus:outline-none"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
