export default function Services() {
  const services = [
    {
      title: "Real Estate",
      description:
        "National and international real estate projects with modern insights and global reach.",
      link: "/services/real-estate",
    },
    {
      title: "Building Construction",
      description:
        "Innovative construction solutions that combine quality and futuristic design.",
      link: "/services/building-construction",
    },
    {
      title: "Land Development",
      description:
        "Transforming landscapes into thriving communities through sustainable development.",
      link: "/services/land-development",
    },
    {
      title: "Home Interior Design",
      description:
        "Modern interior design that creates immersive, stylish living environments.",
      link: "/services/home-interior-design",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-black overflow-hidden"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/futuristic-pattern.svg')] bg-cover bg-center animate-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-neonBlue drop-shadow-lg">
          Our Services
        </h2>

        {/* Services Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          {services.map((service, idx) => (
            <a
              key={idx}
              href={service.link}
              className="block group relative overflow-hidden"
            >
              <div className="bg-gray-800/50 border border-gray-700 backdrop-blur-lg p-6 sm:p-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-neonBlue hover:ring-2 hover:ring-neonBlue cursor-pointer">
                <div className="flex justify-between items-center relative">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-neonBlue">
                    {service.title}
                  </h3>
                  {/* Futuristic Arrow with Tooltip */}
                  <div className="relative flex items-center justify-center">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2 py-1 text-xs text-white bg-gray-800 rounded shadow">
                        Explore
                      </span>
                    </div>
                    {/* Enhanced Arrow */}
                    <div className="relative flex items-center justify-center">
                      {/* Pulsating glowing circle */}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex h-12 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50 group-hover:opacity-100 animate-ping"></span>
                      </span>
                      <svg
                        className="w-8 h-8 relative z-10 transition-all duration-300 transform group-hover:translate-x-2 group-hover:rotate-6 group-hover:scale-110"
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
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
              {/* Subtle Ripple Effect on Click */}
              <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-300"></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
