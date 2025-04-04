// app/components/VideoSection.js
export default function VideoSection() {
  return (
    <section className="relative py-20 bg-black">
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/VIDEOMY.MP4"
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold mb-4 text-gradient">
          Experience Our Vision
        </h2>
        <p className="text-lg mb-8">
          Watch our journey and see how we transform spaces into futuristic
          landmarks.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-4 bg-neonBlue text-black font-semibold rounded-full hover:scale-105 transition"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}
