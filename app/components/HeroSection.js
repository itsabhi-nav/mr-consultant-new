export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[80vh] md:min-h-screen text-center overflow-hidden">
      {/* Background Video with Mobile Optimization */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover sm:object-center md:object-cover"
        src="/22.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 px-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 animate-fadeIn text-white">
          Welcome to M R Consultants
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 animate-fadeIn delay-200 text-gray-300">
          Elevate your living experience with our visionary real estate,
          construction, and interior design services.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <a
            href="#services"
            className="inline-block px-5 sm:px-8 py-2 sm:py-4 bg-neonBlue text-black font-semibold rounded-full hover:scale-105 transform transition"
          >
            Explore Our Services
          </a>
          <a
            href="/brochure.pdf"
            download
            className="inline-block px-5 sm:px-8 py-2 sm:py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transform transition"
          >
            Download Brochure
          </a>
        </div>
      </div>
    </section>
  );
}
