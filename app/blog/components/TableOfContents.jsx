"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!content) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3");
    const newHeadings = Array.from(headingElements).map((heading) => {
      const id =
        heading.id ||
        heading.innerText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      return { text: heading.innerText, id };
    });
    setHeadings(newHeadings);
  }, [content]);

  if (!headings.length) return null;
  return (
    <div className="border-l-2 border-gray-600 pl-4 mb-6">
      <h4 className="text-lg font-bold mb-2">Table of Contents</h4>
      <ul className="space-y-1">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className="text-neonBlue hover:underline text-sm"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
