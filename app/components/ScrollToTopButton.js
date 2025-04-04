// app/components/ScrollToTopButton.js
"use client";

import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 200px
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showButton ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-neonBlue text-black p-3 rounded-full shadow-lg hover:scale-110 transition"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  ) : null;
}
