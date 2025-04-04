"use client";

import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a range of services including real estate consultation, building construction, land development, and interior design.",
    },
    {
      question: "How can I schedule a consultation?",
      answer:
        "You can reach out to us via our contact form or call us directly to schedule a consultation.",
    },
    {
      question: "Do you work internationally?",
      answer:
        "Yes, we have experience with both national and international projects.",
    },
    {
      question: "What makes your company unique?",
      answer:
        "Our futuristic approach, innovation-driven designs, and commitment to excellence set us apart in the industry.",
    },
    {
      question: "Can I request a custom project?",
      answer:
        "Absolutely! We tailor our services to meet your specific needs and vision.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Title with Neon Glow */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 uppercase tracking-wide">
          Frequently Asked <span className="text-neonBlue glow">Questions</span>
        </h2>

        {/* FAQ Section - Mobile Optimized */}
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-5 shadow-lg backdrop-blur-md transform transition-all duration-300 ${
                openIndex === idx ? "shadow-neonBlue" : "hover:shadow-neonBlue"
              }`}
            >
              {/* Question Section */}
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left font-semibold text-lg sm:text-xl flex justify-between items-center focus:outline-none transition-all duration-300"
              >
                <span className="text-white">{faq.question}</span>
                <span
                  className={`transition-transform duration-300 ${
                    openIndex === idx
                      ? "rotate-180 text-neonBlue"
                      : "text-gray-400"
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Answer Section (Collapsible with Animation) */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx
                    ? "max-h-32 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-300 text-sm sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
