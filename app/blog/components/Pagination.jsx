"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [...Array(totalPages).keys()].map((x) => x + 1);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 mt-8">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded transition ${
            page === currentPage
              ? "bg-neonBlue text-black"
              : "border border-neonBlue hover:bg-neonBlue hover:text-black"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
