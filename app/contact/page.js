"use client";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const subject = formData.get("subject") || "No Subject";
    const message = formData.get("message");

    // Format the WhatsApp message
    const whatsappMessage = `🚀 New Inquiry Received!\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n📝 Subject: ${subject}\n💬 Message: ${message}`;

    // WhatsApp URL with your number (sending to 8310360414)
    const phoneNumber = "918310360414"; // WhatsApp number with country code
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    // Open WhatsApp chat
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[url('/futuristic-pattern.svg')] bg-cover bg-center animate-pulse"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-neonBlue drop-shadow-lg">
          Contact Us
        </h2>

        {/* Form Container */}
        <div className="bg-gray-800/50 border border-gray-700 backdrop-blur-lg p-6 sm:p-8 rounded-lg shadow-lg">
          {submitted ? (
            <div className="text-center py-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-neonBlue mb-4">
                Thank You!
              </h3>
              <p className="text-gray-300">
                Your message has been sent successfully. We will get back to you
                soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this about?"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative group bg-gray-900 border border-gray-700 text-neonBlue px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105 hover:ring-2 hover:ring-neonBlue focus:outline-none"
                >
                  {loading ? (
                    <span className="block">Sending...</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Send Message</span>
                      {/* Animated Futuristic Arrow */}
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50 group-hover:opacity-100 animate-ping"></span>
                        </span>
                        <svg
                          className="w-5 h-5 relative z-10 transition-all duration-300 transform group-hover:translate-x-1 group-hover:rotate-6 group-hover:scale-110"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#0ff" />
                              <stop offset="100%" stopColor="#00f" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M5 12h14M13 5l6 7-6 7"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
