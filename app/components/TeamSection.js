"use client";

import { motion } from "framer-motion";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Mallesh Reddy",
      role: "Proprietor",
      image: "/profile.jpeg",
    },
    // Add more team members here
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

  const isSingleMember = teamMembers.length === 1;

  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 uppercase tracking-wide">
          Meet Our <span className="text-neonBlue glow">Team</span>
        </h2>

        {/* Team Grid */}
        <motion.div
          className={`${
            isSingleMember
              ? "flex justify-center"
              : "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          } gap-6 sm:gap-8`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              className={`bg-gray-800/60 border border-gray-700 backdrop-blur-lg p-6 rounded-2xl shadow-xl transition-all transform hover:scale-[1.06] hover:shadow-neonBlue text-center ${
                isSingleMember ? "w-full max-w-xs" : ""
              }`}
              variants={itemVariants}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto mb-5 w-24 sm:w-28 h-24 sm:h-28 object-cover rounded-full border-2 border-neonBlue shadow-md"
                loading="lazy"
              />
              <h3 className="text-lg sm:text-xl font-semibold">
                {member.name}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base mt-1">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
