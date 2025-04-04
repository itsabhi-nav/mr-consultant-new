"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    access_key: "96d2b4fe-bd7e-4c6f-8405-3cbea0d1b577",
    name: "",
    email: "",
    contactNumber: "",
    message: "",
    botcheck: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "Sending...", type: "loading" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (response.status === 200) {
        setStatus({ message: "Form submitted successfully!", type: "success" });
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          message: "",
          botcheck: "",
        });
      } else {
        throw new Error(json.message || "Submission failed, please try again.");
      }
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    }

    setTimeout(() => setStatus({ message: "", type: "" }), 3000);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-neonBlue drop-shadow-lg">
          Get in Touch
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-70 backdrop-blur-lg p-8 rounded-lg shadow-2xl max-w-xl mx-auto transform transition-all hover:scale-105"
        >
          <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
          />

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-neonBlue">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-neonBlue"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-neonBlue">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue"
              placeholder="Your Email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-neonBlue">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue transition"
              placeholder="Your Contact Number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-neonBlue">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue"
              placeholder="Your Message"
              required
            ></textarea>
          </div>

          {status.message && (
            <div
              className={`mb-4 text-center font-semibold ${
                status.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            className="bg-neonBlue text-black px-8 py-3 rounded font-semibold transition hover:scale-105 hover:bg-white"
          >
            Submit Form
          </button>
        </form>
      </div>
    </section>
  );
}
