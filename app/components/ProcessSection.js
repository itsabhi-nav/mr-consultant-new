export default function ProcessSection() {
  const steps = [
    {
      title: "Consultation",
      description: "We discuss your needs and objectives.",
      icon: "🗣️",
    },
    {
      title: "Planning",
      description: "We plan the project with precision.",
      icon: "📝",
    },
    {
      title: "Design",
      description: "Innovative design solutions are developed.",
      icon: "🎨",
    },
    {
      title: "Execution",
      description: "Our team brings the vision to life.",
      icon: "🏗️",
    },
    {
      title: "Delivery",
      description: "We deliver excellence on time.",
      icon: "✅",
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-center overflow-hidden">
      {/* Animated glowing background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.2)_100%)] animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-10 uppercase tracking-wide">
          Our <span className="text-neonBlue glow">Process</span>
        </h2>

        {/* Scrollable Steps for Mobile */}
        <div className="md:hidden flex space-x-6 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gray-800/40 border border-gray-700 rounded-2xl p-5 shadow-lg backdrop-blur-md w-64 snap-center transform transition-all hover:scale-105 hover:shadow-neonBlue"
            >
              <div className="text-5xl mb-3 text-neonBlue animate-bounce">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 uppercase">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Grid Layout for Tablet & Desktop */}
        <div className="hidden md:grid md:grid-cols-5 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center bg-gray-800/40 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur-lg transform transition-all hover:scale-105 hover:shadow-neonBlue"
            >
              <div className="text-6xl mb-4 text-neonBlue animate-bounce">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 uppercase">
                {step.title}
              </h3>
              <p className="text-gray-400">{step.description}</p>

              {/* Step Connector Line for Desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-[-30px] w-8 h-1 bg-neonBlue"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
