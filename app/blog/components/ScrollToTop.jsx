"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      setIsVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!isVisible) return null;
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-neonBlue text-black p-3 rounded-full shadow-lg hover:bg-neonBlue/80 transition"
    >
      ↑
    </button>
  );
}
