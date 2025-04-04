// app/components/ParallaxCTA.js
export default function ParallaxCTA() {
  return (
    <section
      className="relative bg-fixed bg-center bg-cover bg-no-repeat py-20"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20210709/original/pngtree-creative-synthesis-city-comic-real-estate-picture-image_916360.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Join Our Global Network
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Let us help you expand your real estate footprint and build your dream
          projects.
        </p>
        <a
          href="/contact"
          className="px-8 py-4 bg-neonBlue text-black font-semibold rounded-full hover:scale-105 transition"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
