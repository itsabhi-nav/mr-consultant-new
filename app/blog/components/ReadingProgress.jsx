"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollPosition = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollPosition / totalHeight) * 100);
    }
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-300">
      <div
        style={{ width: `${progress}%` }}
        className="h-full bg-neonBlue transition-all duration-75"
      ></div>
    </div>
  );
}
