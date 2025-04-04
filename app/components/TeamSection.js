"use client";

import { motion } from "framer-motion";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Alice Johnson",
      role: "CEO & Founder",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeZ9G91YE6XpA1Ey21OcHQ9jbrRx7PDc2x_A&s",
    },
    {
      name: "Bob Williams",
      role: "Lead Architect",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_h65aXYjcTaX4Ufq4-QWbt6n0C6YmzxXyFw&s",
    },
    {
      name: "Carol Davis",
      role: "Interior Designer",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Outdoors-man-portrait_%28cropped%29.jpg/1200px-Outdoors-man-portrait_%28cropped%29.jpg",
    },
    {
      name: "David Lee",
      role: "Construction Manager",
      image:
        "https://media.istockphoto.com/id/1388648617/photo/confident-caucasian-young-man-in-casual-denim-clothes-with-arms-crossed-looking-at-camera.jpg?s=612x612&w=0&k=20&c=YxctPklAOJMmy6Tolyvn45rJL3puk5RlKt39FO46ZeA=",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 uppercase tracking-wide">
          Meet Our <span className="text-neonBlue glow">Team</span>
        </h2>

        {/* Team Grid - Mobile Optimized */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-800/50 border border-gray-700 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-neonBlue text-center"
              variants={itemVariants}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto mb-3 sm:mb-4 w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-full border-2 border-neonBlue"
                loading="lazy"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
