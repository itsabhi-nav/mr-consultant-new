"use client";

import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Akshat Gada",
      feedback:
        "M R Consultants helped us find the perfect property overseas. Their expertise was invaluable!",
      image:
        "https://media.istockphoto.com/id/613557584/photo/portrait-of-a-beautifull-smiling-man.jpg?s=612x612&w=0&k=20&c=hkCg5CrmTKOApePbPOyo1U9GexEfIJOJqoLXJIvcN8E=",
    },
    {
      name: "Abhinav Dubey",
      feedback:
        "They transformed our home interior into a modern oasis. Highly recommended!",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtJqiPNplZ_hwP_fXLOLxBeQ-yqxIxVsHPQ&s",
    },
    {
      name: "Akash Debnath",
      feedback:
        "Professional, visionary, and reliable. M R Consultants delivered our construction project on time.",
      image:
        "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHww",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 uppercase tracking-wide">
          What Our <span className="text-neonBlue glow">Clients Say</span>
        </h2>

        {/* Testimonials Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-800/50 border border-gray-700 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-neonBlue text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              {/* Profile Image */}
              <img
                src={t.image}
                alt={t.name}
                className="mx-auto mb-4 sm:mb-6 w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-full border-2 border-neonBlue"
                loading="lazy"
              />

              {/* Feedback */}
              <p className="italic text-gray-300 text-sm sm:text-base">
                "{t.feedback}"
              </p>

              {/* Name */}
              <h4 className="mt-4 text-lg sm:text-xl font-semibold text-neonBlue">
                - {t.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
